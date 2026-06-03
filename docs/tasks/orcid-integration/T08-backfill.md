# T08 — One-shot backfill over the 236

**Est:** 1h · **Depends on:** T06, T07 · **Test:** manual audit (see acceptance)

## Context
Run the full pipeline across all current researchers once: enrich the 91 with stored iDs, resolve + enrich those of the 145 that clear the bar.

## Files
- Create: `seo_subroutine/orcid/backfill.py` (or a `scripts/` entry)

## Steps
1. Read all researchers (slug, name, institution, orcid) via the publishable key.
2. For each: T06 `enrich` → T07 `upsert`. Respect `ORCID_MAX_RECORDS_PER_RUN` (resume across runs if capped).
3. Log counts: stored-enriched, resolved, unresolved, items written per section.
4. Print a 20-row sample of resolved-from-name matches for manual audit.

## Acceptance
- All 91 stored-iD researchers enriched.
- Resolved/unresolved counts logged; **20-row audit shows zero wrong-person matches** — if any wrong, tighten T05 threshold and re-run.
- Re-running is idempotent (T07).
