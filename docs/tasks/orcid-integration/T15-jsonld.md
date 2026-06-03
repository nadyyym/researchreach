# T15 — JSON-LD enrichment

**Est:** 1h · **Depends on:** T11 · **Test:** [tests.md › T-T6](./tests.md)

## Context
The researcher page already emits a `Person` + `ProfilePage` JSON-LD graph validated per `(site, pillar)` by the seo-subroutine quality gate. Enrich it with the new ORCID facts — better structured-data signals — **without** breaking that validator.

## Files
- Modify: the researcher page's JSON-LD block (`src/pages/researchers/[id].astro` / seo helper in `src/lib/seo.ts`)

## Steps
1. Add `sameAs: "https://orcid.org/{iD}"` to the `Person`.
2. Add `affiliation` / `worksFor` from current employment; `alumniOf` from educations.
3. Optionally `knowsAbout` from keywords.
4. Keep the existing required `@graph` nodes intact so the quality gate's `valid_jsonld(s, site='selltoscientists', pillar='researcher')` still passes.

## Acceptance
- Enriched graph includes `sameAs`/`affiliation`/`alumniOf` where data exists.
- The seo-subroutine quality-gate JSON-LD validator still passes for the researcher pillar.

## Docs
existing `seo_subroutine/quality_gate.py` (`REQUIRED_NODES`, `valid_jsonld`) · `src/lib/seo.ts`
