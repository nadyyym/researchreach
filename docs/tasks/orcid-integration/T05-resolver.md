# T05 — Verified-only resolver (the 145 without iDs)

**Est:** 3–4h · **Depends on:** T01, `openalex.py` · **Blocks:** T07 · **Test:** [tests.md › T-T2](./tests.md)

## Context
91 of 236 researchers have a stored ORCID iD; **145 don't**. Resolve those by name **only when confident** — reusing the OpenAlex cross-check that already lives in the codebase. This is the guardrail against the namesake errors that corrupted the OpenAlex backfill (june-huh h=0, feng-zhang, regina-barzilay). D4.

## Files
- Create: `seo_subroutine/orcid/resolve.py`

## Steps
1. `resolve(researcher) -> (orcid_id | None, method, confidence)`.
2. ORCID `expanded-search` on family + given names + `affiliation-org-name` = the researcher's institution.
3. For each candidate, **cross-check against OpenAlex** (`openalex.py`): does the OpenAlex author for this name carry *this exact* ORCID iD? Does the institution match? Does works_count/h-index plausibility hold (reuse the existing floors)?
4. Confidence score; accept **only** above a strict threshold (require ORCID-on-OpenAlex-author match OR institution match + high works overlap). Everything else → `method='unresolved'`, return `None` (no write).
5. On accept, persist the resolved iD onto `researchers.orcid` so it's "stored" next run.

## Acceptance
- Known-bad fixtures (june-huh, feng-zhang, regina-barzilay) → `unresolved`, no iD written.
- A clean match (e.g. Doudna, ORCID present on her OpenAlex author) → resolved above threshold.
- Manual 20-row audit after backfill (T08): **zero wrong-person matches.**

## Docs
[Expanded search](https://info.orcid.org/documentation/api-tutorials/searching-the-orcid-registry/) · existing `seo_subroutine/openalex.py`
