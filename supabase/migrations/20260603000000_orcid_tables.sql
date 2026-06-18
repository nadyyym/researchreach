-- ORCID public-record storage for the RESEARCHER pillar (sci content DB).
-- Target project: uezyvflphqcizcbfklla (https://uezyvflphqcizcbfklla.supabase.co).
--
-- Six flat relational tables (NO JSONB blobs), each FK -> public.researchers(slug)
-- ON DELETE CASCADE. Populated by the Python ORCID pipeline
-- (seo-subroutine/seo_subroutine/orcid/) using the SERVICE key over PostgREST.
--
-- CRITICAL SECURITY (why ORCID data never appears in the static build):
--   RLS is enabled on ALL six tables with NO anon/authenticated policy, and we
--   REVOKE ALL FROM anon, authenticated. The anon/publishable key therefore CANNOT
--   read ORCID data over PostgREST — otherwise anyone could scrape locked profile
--   data (employments, works, biography, keywords, urls, emails). Only service_role
--   (a server-side secret used by the backfill writer and the Astro `/unlock`
--   endpoint) may read/write. service_role has BYPASSRLS, so it works even with RLS
--   enabled once the table grants below exist.
--
-- NOTE (deviation from docs/tasks/orcid-integration/T03-db-migration.md): T03 suggested
-- granting anon/publishable SELECT so the build-time Astro loader could read these
-- tables with the publishable key. That is intentionally NOT done here — the shared
-- CONTRACT requires anon to have zero access (the locked sections are served at request
-- time by the service-key `/unlock` endpoint, never embedded in static HTML). The
-- existing BLURRED researcher profile fields remain on `public.researchers`, which the
-- publishable key already reads; only the LOCKED orcid_* sections live behind service_role.
--
-- Idempotent. Apply with the Supabase CLI: `supabase db push --linked`.

-- ---------------------------------------------------------------------------
-- researcher_orcid (1:0..1 with researchers)
-- ---------------------------------------------------------------------------
create table if not exists public.researcher_orcid (
  researcher_slug       text primary key
                          references public.researchers(slug) on delete cascade,
  orcid                 text,
  credit_name           text,
  biography             text,
  keywords              text[],
  orcid_visibility      text,
  resolution_method     text,      -- stored | search+openalex | manual | unresolved
  resolution_confidence numeric,
  data_source           text not null default 'orcid',
  last_synced_at        timestamptz not null default now(),
  opt_out               boolean not null default false
);

-- ---------------------------------------------------------------------------
-- orcid_employment
-- ---------------------------------------------------------------------------
create table if not exists public.orcid_employment (
  id              bigserial primary key,
  researcher_slug text not null references public.researchers(slug) on delete cascade,
  put_code        text,
  organization    text,
  department      text,
  role_title      text,
  start_year      int,
  end_year        int,
  unique (researcher_slug, put_code)
);

-- ---------------------------------------------------------------------------
-- orcid_education (identical shape to orcid_employment)
-- ---------------------------------------------------------------------------
create table if not exists public.orcid_education (
  id              bigserial primary key,
  researcher_slug text not null references public.researchers(slug) on delete cascade,
  put_code        text,
  organization    text,
  department      text,
  role_title      text,
  start_year      int,
  end_year        int,
  unique (researcher_slug, put_code)
);

-- ---------------------------------------------------------------------------
-- orcid_work
-- ---------------------------------------------------------------------------
create table if not exists public.orcid_work (
  id              bigserial primary key,
  researcher_slug text not null references public.researchers(slug) on delete cascade,
  put_code        text,
  title           text,
  type            text,
  year            int,
  doi             text,
  url             text,
  unique (researcher_slug, put_code)
);

-- ---------------------------------------------------------------------------
-- orcid_url (researcher-urls; no put_code in the ORCID model, so no unique pair)
-- ---------------------------------------------------------------------------
create table if not exists public.orcid_url (
  id              bigserial primary key,
  researcher_slug text not null references public.researchers(slug) on delete cascade,
  name            text,
  url             text
);

-- ---------------------------------------------------------------------------
-- orcid_email (default display_allowed=false — emails are NOT served unless flipped)
-- ---------------------------------------------------------------------------
create table if not exists public.orcid_email (
  id              bigserial primary key,
  researcher_slug text not null references public.researchers(slug) on delete cascade,
  email           text,
  display_allowed boolean not null default false,
  unique (researcher_slug, email)
);

-- Helpful read indexes for the child tables (lookups are always by slug).
create index if not exists orcid_employment_slug_idx on public.orcid_employment (researcher_slug);
create index if not exists orcid_education_slug_idx  on public.orcid_education  (researcher_slug);
create index if not exists orcid_work_slug_idx       on public.orcid_work       (researcher_slug);
create index if not exists orcid_url_slug_idx        on public.orcid_url         (researcher_slug);
create index if not exists orcid_email_slug_idx      on public.orcid_email       (researcher_slug);

-- ===========================================================================
-- SECURITY: enable RLS (no anon/authenticated policy) + lock down grants.
-- ===========================================================================
alter table public.researcher_orcid enable row level security;
alter table public.orcid_employment enable row level security;
alter table public.orcid_education  enable row level security;
alter table public.orcid_work       enable row level security;
alter table public.orcid_url        enable row level security;
alter table public.orcid_email      enable row level security;

-- Revoke EVERYTHING from the public-facing roles. No SELECT for anon/authenticated:
-- ORCID data must never be reachable with the publishable key.
revoke all on public.researcher_orcid from anon, authenticated;
revoke all on public.orcid_employment from anon, authenticated;
revoke all on public.orcid_education  from anon, authenticated;
revoke all on public.orcid_work       from anon, authenticated;
revoke all on public.orcid_url        from anon, authenticated;
revoke all on public.orcid_email      from anon, authenticated;

-- Also revoke usage on the bigserial sequences from anon/authenticated.
revoke all on sequence public.orcid_employment_id_seq from anon, authenticated;
revoke all on sequence public.orcid_education_id_seq  from anon, authenticated;
revoke all on sequence public.orcid_work_id_seq       from anon, authenticated;
revoke all on sequence public.orcid_url_id_seq        from anon, authenticated;
revoke all on sequence public.orcid_email_id_seq      from anon, authenticated;

-- Only service_role (server-side secret) may read/write.
grant all on public.researcher_orcid to service_role;
grant all on public.orcid_employment to service_role;
grant all on public.orcid_education  to service_role;
grant all on public.orcid_work       to service_role;
grant all on public.orcid_url        to service_role;
grant all on public.orcid_email      to service_role;

grant all on sequence public.orcid_employment_id_seq to service_role;
grant all on sequence public.orcid_education_id_seq  to service_role;
grant all on sequence public.orcid_work_id_seq       to service_role;
grant all on sequence public.orcid_url_id_seq        to service_role;
grant all on sequence public.orcid_email_id_seq      to service_role;

-- Keep future re-creations consistent: default new public tables/sequences to
-- service_role-only (mirrors 0001_grant_service_role_seo_generated_pages.sql intent,
-- but scoped tighter — we do NOT extend anon/authenticated here).
alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public
  grant usage, select on sequences to service_role;
