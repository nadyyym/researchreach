# T01 — ORCID Public API client

**Est:** 2–3h · **Depends on:** none · **Blocks:** T02, T04, T05 · **Test:** [tests.md › T-T1](./tests.md)

## Context
A throttled, two-legged-OAuth client for the ORCID Public API. Must stay clearly clear of ToS §3 (no continuous polling, under rate limits). See [legal-and-cc0.md › A1](./legal-and-cc0.md).

## Files
- Create: `seo_subroutine/orcid/client.py` (sibling of the existing `openalex.py` in the seo-subroutine package)
- Env: `ORCID_CLIENT_ID`, `ORCID_CLIENT_SECRET`, `ORCID_MAX_RECORDS_PER_RUN` (default 300) — never committed; add to `env.example`

## Steps
1. `get_token()` — `POST https://orcid.org/oauth/token` with `grant_type=client_credentials`, `scope=/read-public`. Cache the token (it's ~20-year-lived) to a gitignored file; reuse across runs.
2. `get_record(orcid_id) -> dict` — `GET https://pub.orcid.org/v3.0/{iD}/record`, `Accept: application/json`, bearer token.
3. `expanded_search(query) -> list` — `GET https://pub.orcid.org/v3.0/expanded-search/?q=…` (used by T05).
4. Throttle to **≤2 req/s**; exponential back-off + retry on **503**; abort the run once `ORCID_MAX_RECORDS_PER_RUN` is hit (hard cap, logged).
5. Polite headers; surface non-2xx with the URL.

## Acceptance
- Token cached and reused; second run issues no token call.
- 503 triggers back-off + retry, not a crash.
- Run stops at the per-run cap and logs how many were processed/skipped.
- Sustained rate stays ≤2 req/s.

## Docs
[Read a record](https://info.orcid.org/documentation/api-tutorials/api-tutorial-read-data-on-a-record/) · [API limits](https://info.orcid.org/ufaqs/what-are-the-api-limits/)
