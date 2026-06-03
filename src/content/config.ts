import { defineCollection, z } from 'astro:content';
import { PostgrestClient } from '@supabase/postgrest-js';

// Shared PostgREST-over-REST helper for the DB-driven pillar collections.
// Identical strategy to the `researchers` loader below: read rows from the GTM
// Supabase project (uezyvflphqcizcbfklla) at build time over REST only, never
// instantiating the full supabase-js createClient (which pulls in a
// RealtimeClient needing a WebSocket constructor that Node < 22 lacks and would
// crash the build). Reads RESEARCHERS_SUPABASE_URL / RESEARCHERS_SUPABASE_ANON_KEY.
// Returns one content-layer entry per row with id = slug; each collection's
// existing Zod schema (unchanged) still validates every entry.
function pillarLoader<T extends Record<string, unknown>>(
  table: string,
  columns: string,
  orderColumn: string,
  map: (row: Record<string, any>) => T & { id: string },
) {
  return async () => {
    const supabaseUrl = import.meta.env.RESEARCHERS_SUPABASE_URL;
    const supabaseKey = import.meta.env.RESEARCHERS_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        `${table} loader: missing RESEARCHERS_SUPABASE_URL or RESEARCHERS_SUPABASE_ANON_KEY env vars`,
      );
    }

    const rest = supabaseUrl.replace(/\/$/, '') + '/rest/v1';
    const supabase = new PostgrestClient(rest, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order(orderColumn, { ascending: true });

    if (error) {
      throw new Error(`${table} loader: Supabase query failed — ${error.message}`);
    }
    if (!data || data.length === 0) {
      throw new Error(`${table} loader: Supabase returned no rows`);
    }

    return data.map((row) => map(row as Record<string, any>));
  };
}

const universities = defineCollection({
  loader: pillarLoader(
    'universities',
    'slug, name, country, city, type, "researcherCount", "avgHindex", "grantCount", departments, "topFields", description',
    'slug',
    (row) => ({
      id: row.slug,
      name: row.name,
      country: row.country,
      city: row.city,
      type: row.type,
      researcherCount: Number(row.researcherCount),
      avgHindex: Number(row.avgHindex),
      grantCount: Number(row.grantCount),
      departments: row.departments ?? [],
      topFields: row.topFields ?? [],
      description: row.description,
    }),
  ),
  schema: z.object({
    name: z.string(),
    country: z.string(),
    city: z.string(),
    type: z.enum(['public', 'private']),
    researcherCount: z.number(),
    avgHindex: z.number(),
    grantCount: z.number(),
    departments: z.array(z.string()),
    topFields: z.array(z.string()),
    description: z.string(),
  }),
});

const fields = defineCollection({
  loader: pillarLoader(
    'fields',
    'slug, name, subfields, "keyTechnologies", "topInstitutions", "researcherCount", "avgFunding", description',
    'slug',
    (row) => ({
      id: row.slug,
      name: row.name,
      subfields: row.subfields ?? [],
      keyTechnologies: row.keyTechnologies ?? [],
      topInstitutions: row.topInstitutions ?? [],
      researcherCount: Number(row.researcherCount),
      avgFunding: row.avgFunding,
      description: row.description,
    }),
  ),
  schema: z.object({
    name: z.string(),
    subfields: z.array(z.string()),
    keyTechnologies: z.array(z.string()),
    topInstitutions: z.array(z.string()),
    researcherCount: z.number(),
    avgFunding: z.string(),
    description: z.string(),
  }),
});

// Astro 5 content-layer loader: fetch the 98 researcher rows from the GTM
// Supabase project at build time and return one entry per row with id = slug.
// Reads build-time env (RESEARCHERS_SUPABASE_URL / RESEARCHERS_SUPABASE_ANON_KEY).
// The Zod schema below is unchanged from the previous file-based collection and
// still validates every entry, so getCollection('researchers') keeps returning
// the same shape (entry.id = slug, entry.data = fields).
const researchers = defineCollection({
  loader: async () => {
    const supabaseUrl = import.meta.env.RESEARCHERS_SUPABASE_URL;
    const supabaseKey = import.meta.env.RESEARCHERS_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'researchers loader: missing RESEARCHERS_SUPABASE_URL or RESEARCHERS_SUPABASE_ANON_KEY env vars',
      );
    }

    // Use PostgREST directly (not the full supabase-js createClient) so the
    // build never instantiates a RealtimeClient — that requires a WebSocket
    // constructor which Node < 22 lacks, and it would crash the build. The
    // loader only ever reads rows over REST, so PostgrestClient is sufficient
    // and dependency-free on both local (Node 20) and Vercel build runtimes.
    const rest = supabaseUrl.replace(/\/$/, '') + '/rest/v1';
    const supabase = new PostgrestClient(rest, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    const { data, error } = await supabase
      .from('researchers')
      .select(
        'slug, name, institution, field, hindex, grantCount, patents, publications, orcid, "industryTies", description',
      )
      .order('hindex', { ascending: false });

    if (error) {
      throw new Error(`researchers loader: Supabase query failed — ${error.message}`);
    }
    if (!data || data.length === 0) {
      throw new Error('researchers loader: Supabase returned no rows');
    }

    // Return an array of entries; the documented inline-loader contract requires
    // each entry to carry a unique `id`. We set id = slug so existing consumers
    // (entry.id) keep working. numeric columns come back as JS numbers.
    return data.map((row) => {
      const { slug, ...rest } = row;
      return {
        id: slug,
        ...rest,
        hindex: Number(rest.hindex),
        grantCount: Number(rest.grantCount),
        patents: Number(rest.patents),
        publications: Number(rest.publications),
        orcid: rest.orcid ?? undefined,
        industryTies: rest.industryTies ?? [],
      };
    });
  },
  schema: z.object({
    name: z.string(),
    institution: z.string(),
    field: z.string(),
    hindex: z.number(),
    grantCount: z.number(),
    patents: z.number(),
    publications: z.number(),
    orcid: z.string().optional(),
    industryTies: z.array(z.string()),
    description: z.string(),
  }),
});

const phd = defineCollection({
  loader: pillarLoader(
    'phd',
    'slug, name, institution, field, advisor, thesis, publications, skills, "transitionSignals", description',
    'slug',
    (row) => ({
      id: row.slug,
      name: row.name,
      institution: row.institution,
      field: row.field,
      advisor: row.advisor,
      thesis: row.thesis,
      publications: Number(row.publications),
      skills: row.skills ?? [],
      transitionSignals: row.transitionSignals ?? [],
      description: row.description,
    }),
  ),
  schema: z.object({
    name: z.string(),
    institution: z.string(),
    field: z.string(),
    advisor: z.string(),
    thesis: z.string(),
    publications: z.number(),
    skills: z.array(z.string()),
    transitionSignals: z.array(z.string()),
    description: z.string(),
  }),
});

const countries = defineCollection({
  loader: pillarLoader(
    'countries',
    'slug, name, code, "topInstitutions", "topAgencies", "researchOutput", "topFields", description',
    'slug',
    (row) => ({
      id: row.slug,
      name: row.name,
      code: row.code,
      topInstitutions: row.topInstitutions ?? [],
      topAgencies: row.topAgencies ?? [],
      researchOutput: Number(row.researchOutput),
      topFields: row.topFields ?? [],
      description: row.description,
    }),
  ),
  schema: z.object({
    name: z.string(),
    code: z.string(),
    topInstitutions: z.array(z.string()),
    topAgencies: z.array(z.string()),
    researchOutput: z.number(),
    topFields: z.array(z.string()),
    description: z.string(),
  }),
});

const agencies = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    country: z.string(),
    type: z.enum(['government', 'private', 'foundation']),
    budget: z.string(),
    programs: z.array(z.string()),
    description: z.string(),
  }),
});

const companies = defineCollection({
  loader: pillarLoader(
    'companies',
    'slug, name, industry, "rdSpend", "academicCollabs", patents, description',
    'slug',
    (row) => ({
      id: row.slug,
      name: row.name,
      industry: row.industry,
      rdSpend: row.rdSpend,
      academicCollabs: Number(row.academicCollabs),
      patents: Number(row.patents),
      description: row.description,
    }),
  ),
  schema: z.object({
    name: z.string(),
    industry: z.string(),
    rdSpend: z.string(),
    academicCollabs: z.number(),
    patents: z.number(),
    description: z.string(),
  }),
});

const industries = defineCollection({
  loader: pillarLoader(
    'industries',
    'slug, name, companies, "targetResearchers", "marketSize", "useCases", description',
    'slug',
    (row) => ({
      id: row.slug,
      name: row.name,
      companies: row.companies ?? [],
      targetResearchers: row.targetResearchers,
      marketSize: row.marketSize,
      useCases: row.useCases ?? [],
      description: row.description,
    }),
  ),
  schema: z.object({
    name: z.string(),
    companies: z.array(z.string()),
    targetResearchers: z.string(),
    marketSize: z.string(),
    useCases: z.array(z.string()),
    description: z.string(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('Sci-Buy Team'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  universities,
  fields,
  researchers,
  phd,
  countries,
  agencies,
  companies,
  industries,
  blog,
};
