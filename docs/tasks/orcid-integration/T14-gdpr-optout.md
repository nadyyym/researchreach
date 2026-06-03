# T14 — GDPR: LIA note + opt-out path

**Est:** 1–2h · **Depends on:** T07, T11 · **Test:** opt-out reconciliation

## Context
CC0 waives copyright, not GDPR. We need a documented lawful basis and a real removal mechanism. See [legal-and-cc0.md › A3](./legal-and-cc0.md).

## Files
- Create: `docs/legal/orcid-legitimate-interest-assessment.md`
- Uses: `researcher_orcid.opt_out` (added in T03)

## Steps
1. **LIA note**: purpose (surface public professional academic data for a research-buyer directory), lawful basis (legitimate interest), necessity, balancing test, data minimization (public-visibility only; emails gated), retention (refreshed from source, deletions reconciled).
2. **Opt-out mechanism**: setting `opt_out=true` on a researcher must (a) exclude them from ingest (T06 skip), (b) delete their `orcid_*` rows, (c) hide them in the loader (T10). Document how a removal request is actioned (manual SQL flip + next sync, or a small contact route).
3. Add a short "data & sources" / contact line on the site footer or researcher page pointing to the removal process.

## Acceptance
- LIA doc exists and is specific (not boilerplate).
- Setting `opt_out=true` removes the person from ingest, DB rows, and rendered pages on next sync/build.
- A documented removal path exists.

## Docs
[Public APIs ToS](https://info.orcid.org/public-client-terms-of-service/) · [Public Data File Use Policy](https://info.orcid.org/public-data-file-use-policy/)
