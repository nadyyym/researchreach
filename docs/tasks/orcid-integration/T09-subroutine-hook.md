# T09 — SEO-subroutine hook

**Est:** 1–2h · **Depends on:** T06, T07 · **Test:** [tests.md › pipeline](./tests.md)

## Context
Keep new researcher pages enriched without a separate cron: when the daily SEO subroutine inserts a new researcher row, enrich that one slug inline. This is also where the growth from D1 happens (curated set grows via the subroutine).

## Files
- Modify: the researcher-pillar generation step of the SEO subroutine (`seo-subroutine/seo_subroutine/…` researcher path)

## Steps
1. After a new `researchers` row is inserted, call T06 `enrich(slug)` → T07 `upsert`.
2. Failures are non-fatal: log and continue (a page without ORCID enrichment is still valid — sections collapse, T11).
3. Count toward the same per-run cap (T01) so a big researcher day can't blow the quota.

## Acceptance
- Adding a researcher via the subroutine results in populated `orcid_*` rows for that slug (when resolvable).
- An ORCID fetch failure does not fail the subroutine run.
