# T13 — Email display gate

**Est:** 1h · **Depends on:** T11 · **Test:** [tests.md › T-T5](./tests.md)

## Context
You chose to display contact emails (D5). ORCID only returns emails the researcher set to **public** (rare — most are private), but it's the highest GDPR/abuse-sensitivity field. So: **ingest ≠ display.** Emails land in `orcid_email` (T04/T07) but are rendered only behind a gate, default off, flippable without a code change.

## Files
- Modify: `src/pages/researchers/[id].astro`
- Env: `PUBLIC_SHOW_ORCID_EMAILS` (default `false`) — add to `env.example` + Vercel envs

## Steps
1. Render an email **only if** `import.meta.env.PUBLIC_SHOW_ORCID_EMAILS === 'true'` **AND** that row's `display_allowed === true`.
2. Default both off → no emails render. Document the flag.

## Acceptance
- Flag off → no email in rendered HTML even when present in DB.
- Flag on + `display_allowed=true` → email shown.
- Toggling is env-only, no redeploy-of-code needed (rebuild only).

## Docs
[legal-and-cc0.md › A3](./legal-and-cc0.md)
