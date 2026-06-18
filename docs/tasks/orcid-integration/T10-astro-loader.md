# T10 — Astro loader + schema

**Est:** 2h · **Depends on:** T03, T07 · **Blocks:** T11, T12 · **Test:** build passes; T-T6

## Context
Surface the new `orcid_*` data to the Astro content layer, reusing the existing RealtimeClient-free PostgREST pattern.

## Files
- Modify: `src/content/config.ts` (researchers collection loader + Zod schema)

## Steps
1. In the researchers loader, after fetching `researchers`, fetch `researcher_orcid` + child tables via the same `PostgrestClient` (publishable key). Join in JS by `researcher_slug`. **Do not** introduce `createClient` (Node<22 RealtimeClient build crash — see the existing comment in `config.ts`).
2. Widen the Zod schema with optional: `orcidProfile` (`{ orcid, biography, keywords[], creditName, lastSyncedAt }`), `employments[]`, `educations[]`, `works[]`, `urls[]`, `emails[]`. All optional so un-enriched researchers validate unchanged.
3. Filter `opt_out=true` researchers out (defense in depth).

## Acceptance
- Build succeeds locally (Node 20) and on Vercel.
- Enriched researchers carry the new fields; un-enriched ones validate with the fields absent.
- No `createClient` import added.

## Docs
existing `src/content/config.ts` `pillarLoader` + researchers loader
