# T04 — Visibility-aware transform

**Est:** 2h · **Depends on:** T01 · **Blocks:** T06, T07 · **Test:** [tests.md › T-T3](./tests.md)

## Context
Map an ORCID v3.0 record (JSON) → flat rows for the `orcid_*` tables. **This transform is source-agnostic** — the CC0 file uses the same v3.0 schema, so a future `PublicDataFileSource` reuses it unchanged (see [legal-and-cc0.md › B3](./legal-and-cc0.md)).

## Files
- Create: `seo_subroutine/orcid/transform.py`

## Steps
1. `transform(record, researcher_slug) -> dict[str, list]` returning rows keyed by table name.
2. **Drop every item whose `visibility != "public"`** — at every level (emails, works, employments, etc.). Never persist limited/private.
3. Map: person → `researcher_orcid` (credit_name, biography, keywords[], orcid_visibility); employments/educations → org/dept/role/start_year/end_year + put_code; works → title/type/year/doi(from external-ids type=doi)/url + put_code; researcher-urls → `orcid_url`; public emails → `orcid_email`.
4. Tag `data_source='orcid'`; carry each item's `put_code`.
5. Coerce years to int; tolerate missing sub-fields.

## Acceptance
- A mixed-visibility fixture yields rows only for public items.
- DOIs extracted from `external-ids` (not raw URLs); years are ints.
- Output shape matches the T03 tables exactly.

## Docs
[Read a record](https://info.orcid.org/documentation/api-tutorials/api-tutorial-read-data-on-a-record/) (visibility + put-code semantics)
