# T07 — Upsert + deletion reconciliation

**Est:** 2–3h · **Depends on:** T03, T04, T05 · **Blocks:** T08, T09, T10 · **Test:** [tests.md › T-T4](./tests.md)

## Context
Write transformed rows to the DB **and** reflect removals. Deletion reconciliation is the GDPR erasure mechanism: if a researcher deletes/privatizes an item, it must leave our DB. See [legal-and-cc0.md › A3](./legal-and-cc0.md).

## Files
- Create: `seo_subroutine/orcid/upsert.py`

## Steps
1. Upsert `researcher_orcid` (by `researcher_slug`); set `last_synced_at = now()`, `resolution_method/confidence`.
2. Upsert each child table by `(researcher_slug, put_code)`.
3. **Reconcile:** for each child table, delete rows for this `researcher_slug` whose `put_code` is **not** in the freshly-fetched set (handles edits, deletions, public→private).
4. Use the `service_role` key (writes), batched. Idempotent — re-running changes nothing.

## Acceptance
- Re-syncing a record with one work removed deletes exactly that child row; untouched rows persist; `last_synced_at` advances.
- Re-running an unchanged record is a no-op.
- Private-turned items disappear on next sync.

## Docs
existing `seo_subroutine/registry.py` (service_role write pattern)
