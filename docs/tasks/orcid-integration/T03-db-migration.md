# T03 — DB migration (`orcid_*` tables)

**Est:** 1–2h · **Depends on:** none · **Blocks:** T07, T10 · **Test:** schema asserted indirectly by T-T4

## Context
Flat relational tables for the ORCID record sections, FK to `researchers`. No JSONB blobs. Target DB = `uezyvflphqcizcbfklla` (sci content DB).

## ⚠️ Migration tooling (mandatory)
Use the project's **native** tool only: `supabase migration new orcid_tables` then `supabase db push --linked`. **Never** apply schema via raw SQL, MCP `execute_sql`, or the dashboard. If the repo isn't linked yet, `supabase link --project-ref uezyvflphqcizcbfklla` first.

## Files
- Create: `supabase/migrations/<ts>_orcid_tables.sql` (via the CLI)

## Schema
- `researcher_orcid` (1:0..1 with researchers): `researcher_slug text references researchers(slug)`, `orcid text`, `credit_name text`, `biography text`, `keywords text[]`, `orcid_visibility text`, `resolution_method text` (`stored|search+openalex|manual|unresolved`), `resolution_confidence numeric`, `data_source text default 'orcid'`, `last_synced_at timestamptz`, `opt_out boolean default false`. Unique on `researcher_slug`.
- `orcid_employment` / `orcid_education`: `id bigserial pk`, `researcher_slug text`, `put_code text`, `organization text`, `department text`, `role_title text`, `start_year int`, `end_year int`. Unique `(researcher_slug, put_code)`.
- `orcid_work`: `id`, `researcher_slug`, `put_code`, `title`, `type`, `year int`, `doi text`, `url text`. Unique `(researcher_slug, put_code)`.
- `orcid_url`: `id`, `researcher_slug`, `name text`, `url text`.
- `orcid_email`: `id`, `researcher_slug`, `email text`, `display_allowed boolean default false`. Unique `(researcher_slug, email)`.
- Grant `service_role` SELECT/INSERT/UPDATE/DELETE on all (mirror the existing `0001_grant_service_role_seo_generated_pages.sql` pattern), and grant `anon`/publishable SELECT (the Astro loader reads with the publishable key).

## Acceptance
- Migration file created via CLI and applied with `db push --linked`.
- All FKs, uniques, and grants present; build-time publishable key can SELECT.

## Docs
`/supabase-postgres-best-practices` · existing `seo-subroutine/migrations/0001_grant_service_role_seo_generated_pages.sql`
