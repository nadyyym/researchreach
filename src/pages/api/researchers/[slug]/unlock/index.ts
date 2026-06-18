// Serves LOCKED ORCID data ONLY to entitled requests. Non-entitled requests get
// 402 and the page stays locked. This is what keeps ORCID values out of the
// static HTML — they live in the sci content DB (project uezyvflphqcizcbfklla)
// behind RLS, readable only by service_role, and are released here after an
// entitlement check.
//
// We read over PostgREST directly (PostgrestClient), NOT supabase-js
// createClient — the latter instantiates a RealtimeClient that needs a
// WebSocket constructor Node < 22 lacks and would crash the build (same
// rationale documented in src/content/config.ts). The endpoint reads env at
// REQUEST time only, so the static build never needs the DB or service key.
import type { APIRoute } from "astro";
import { PostgrestClient } from "@supabase/postgrest-js";
import { lockedKeys } from "../../../../../lib/gating";
import { parseEntitlements, isEntitled } from "../../../../../lib/entitlement";

export const prerender = false;

type Employment = {
  organization: string | null;
  department: string | null;
  role_title: string | null;
  start_year: number | null;
  end_year: number | null;
};
type Work = {
  title: string | null;
  type: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
};
type UrlRow = { name: string | null; url: string | null };

// Shape of the locked fields object. Keys match gating.ts lockedKeys().
type LockedFields = {
  "orcid.employments": Employment[];
  "orcid.educations": Employment[];
  "orcid.works": Work[];
  "orcid.biography": string;
  "orcid.keywords": string[];
  "orcid.urls": UrlRow[];
};

function emptyFields(): LockedFields {
  return {
    "orcid.employments": [],
    "orcid.educations": [],
    "orcid.works": [],
    "orcid.biography": "",
    "orcid.keywords": [],
    "orcid.urls": [],
  };
}

export const GET: APIRoute = async ({ params, request }) => {
  const slug = params.slug ?? "";

  // Entitlement gate first — non-entitled requests never touch the DB.
  const ent = parseEntitlements(request.headers.get("cookie"));
  if (!isEntitled(ent)) {
    return new Response(JSON.stringify({ entitled: false }), {
      status: 402,
      headers: { "content-type": "application/json", "cache-control": "private, no-store" },
    });
  }

  const fields = emptyFields();

  const supabaseUrl = process.env.RESEARCHERS_SUPABASE_URL;
  // SERVICE key — server-only secret. The anon/publishable key CANNOT read these
  // tables (RLS + REVOKE), which is the whole point: only service_role may read.
  const serviceKey = process.env.RESEARCHERS_SUPABASE_SERVICE_KEY;

  // If env or rows are missing, return entitled:true with empty arrays — never
  // crash the request. The page just shows nothing to reveal.
  if (supabaseUrl && serviceKey) {
    try {
      const rest = supabaseUrl.replace(/\/$/, "") + "/rest/v1";
      const db = new PostgrestClient(rest, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      });

      const [orcidRes, empRes, eduRes, workRes, urlRes] = await Promise.all([
        db
          .from("researcher_orcid")
          .select("biography, keywords, opt_out")
          .eq("researcher_slug", slug)
          .maybeSingle(),
        db
          .from("orcid_employment")
          .select("organization, department, role_title, start_year, end_year")
          .eq("researcher_slug", slug)
          .order("end_year", { ascending: false, nullsFirst: true }),
        db
          .from("orcid_education")
          .select("organization, department, role_title, start_year, end_year")
          .eq("researcher_slug", slug)
          .order("end_year", { ascending: false, nullsFirst: true }),
        db
          .from("orcid_work")
          .select("title, type, year, doi, url")
          .eq("researcher_slug", slug)
          .order("year", { ascending: false, nullsFirst: true }),
        db.from("orcid_url").select("name, url").eq("researcher_slug", slug),
      ]);

      // Respect opt-out: a researcher who opted out gets empty ORCID fields.
      const orcid = orcidRes.data as
        | { biography: string | null; keywords: string[] | null; opt_out: boolean | null }
        | null;
      if (orcid && !orcid.opt_out) {
        fields["orcid.biography"] = orcid.biography ?? "";
        fields["orcid.keywords"] = orcid.keywords ?? [];
        fields["orcid.employments"] = (empRes.data as Employment[] | null) ?? [];
        fields["orcid.educations"] = (eduRes.data as Employment[] | null) ?? [];
        fields["orcid.works"] = (workRes.data as Work[] | null) ?? [];
        fields["orcid.urls"] = (urlRes.data as UrlRow[] | null) ?? [];
      }
      // NOTE: emails are intentionally NOT served (orcid_email.display_allowed
      // gating is off by default and not exposed by this endpoint).
    } catch {
      // DB unreachable → fall through with empty fields rather than 500.
    }
  }

  // Sanity: make sure every locked key is present in the response.
  for (const k of lockedKeys()) {
    if (!(k in fields)) (fields as Record<string, unknown>)[k] = [];
  }

  return new Response(JSON.stringify({ entitled: true, fields }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "private, no-store" },
  });
};
