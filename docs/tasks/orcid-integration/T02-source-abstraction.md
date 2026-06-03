# T02 — Source-abstraction interface

**Est:** 1h · **Depends on:** T01 · **Blocks:** T06 · **Test:** covered by T06's pipeline test

## Context
This is the **risk mitigation that makes D3 reversible**. Everything downstream reads records through an interface, not the API directly — so swapping Public API → CC0 Public Data File → Member API (when PICO lands) is a one-file change. See [legal-and-cc0.md › B5](./legal-and-cc0.md).

## Files
- Create: `seo_subroutine/orcid/source.py`

## Steps
1. Define an `OrcidSource` protocol/ABC: `get_record(orcid_id) -> dict | None` and `search(name, institution) -> list[dict]`.
2. Implement `PublicApiSource` wrapping T01's `client.py` — the only live impl.
3. Add documented stubs `PublicDataFileSource` and `MemberApiSource` (raise `NotImplementedError` with a one-line note pointing at `legal-and-cc0.md`). These exist so the swap target is obvious, not so they work today.
4. A `get_source()` factory picks the impl from an env var (`ORCID_SOURCE=public_api` default).

## Acceptance
- Downstream code imports `OrcidSource`/`get_source()`, never `client.py` directly.
- Both record-by-iD and search go through the interface.
- The two stubs exist and are referenced in the factory.

## Docs
[Public Data File (future source)](https://info.orcid.org/what-is-orcid/services/annual-data-files/)
