# T06 — Read pipeline wired to interface

**Est:** 1h · **Depends on:** T02, T04 · **Blocks:** T08, T09, T10 · **Test:** [tests.md › pipeline](./tests.md)

## Context
The orchestration seam: given a researcher, fetch their record **through `OrcidSource`** (not the client directly) and produce transformed rows. Keeps the API/CC0/Member swap clean.

## Files
- Create: `seo_subroutine/orcid/pipeline.py`

## Steps
1. `enrich(researcher) -> rows | None`: if `researcher.orcid` set → `source.get_record(iD)`; else → T05 `resolve()` then `get_record` only on accept.
2. Pass the record to T04 `transform(record, slug)`.
3. Return rows (or `None` if unresolved/empty) for T07 to upsert.
4. Honor the per-run cap from T01 and `opt_out` (skip opted-out researchers).

## Acceptance
- Pipeline imports `get_source()`, never `client.py`.
- Stored-iD path and resolver path both produce transformed rows.
- Opted-out and unresolved researchers produce `None` and no fetch where avoidable.
