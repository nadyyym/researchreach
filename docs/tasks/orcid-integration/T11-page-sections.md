# T11 — Researcher page sections

**Est:** 3h · **Depends on:** T10 · **Blocks:** T13, T14, T15 · **Test:** visual + T-T5

## Context
Render the enriched data on the researcher page. Sections must **collapse gracefully** so un-enriched researchers look exactly as they do today.

## Files
- Modify: `src/pages/researchers/[id].astro`
- Possibly: `src/pages/researchers/[id].md.ts` (markdown export mirror)

## Steps
1. **Affiliation timeline** — employments + educations sorted by year (org, role/department, year range).
2. **Publications** — works: title + year + DOI link-out (`https://doi.org/{doi}`). Note §2 excludes full-text — link out only, never re-host.
3. **Bio** — biography prose; **keywords** as chips; **researcher URLs** as links.
4. Each section renders only if it has data (`{works?.length && …}`).
5. Follow `/web-design-guidelines` — consistent with existing page styling.

## Acceptance
- Enriched researcher shows all sections with real data.
- Un-enriched researcher renders identically to the pre-change page (no empty headers).
- DOIs link to `doi.org`, not re-hosted content.

## Docs
`/web-design-guidelines` · existing `[id].astro`
