# ORCID → selltoscientists.com — Task Pack

Prepared via `/prepare-task` on 2026-06-03. Local-markdown equivalent of a Plane epic + subtasks. Plain English, no code.

Pull each researcher's **full public ORCID record** (employments, educations, works, biography, keywords, URLs, public emails) into our DB (`uezyvflphqcizcbfklla.public.researchers` + new `orcid_*` tables) and render it on the page. New researchers added by the daily SEO subroutine get enriched automatically.

## Files in this pack

| File | What |
|------|------|
| [`epic.md`](./epic.md) | Refined epic: overview, decisions, acceptance criteria, out-of-scope, data model, flow, API reference |
| [`legal-and-cc0.md`](./legal-and-cc0.md) | The legal analysis (cited) **and** the CC0 Public Data File deep-dive (size/structure/parse/storage) |
| `T01`–`T15` | One implementable subtask each (1–4h), TDD-paired |
| [`tests.md`](./tests.md) | The 6 test tasks (written first) |

## Decisions (locked 2026-06-03)

| # | Decision |
|---|----------|
| D1 | Scope = curated 236 now, grow only via the SEO subroutine. |
| D2 | Scaling beyond the curated set is **BLOCKED on the PICO data-licensing agreement**. |
| D3 | Access = live Public API now, **knowingly accepting the §2 non-commercial risk** (bounded + reversible by design). |
| D4 | Missing iDs (145/236) = auto-resolve, verified-only (OpenAlex cross-check, strict bar). |
| D5 | Display = professional record + works + bio/keywords/links + **contact emails** (gated off by default). |

## Subtasks

| Task | Title | Est | Depends on |
|------|-------|-----|-----------|
| [T01](./T01-orcid-api-client.md) | ORCID Public API client | 2–3h | — |
| [T02](./T02-source-abstraction.md) | Source-abstraction interface | 1h | T01 |
| [T03](./T03-db-migration.md) | DB migration (`orcid_*` tables) | 1–2h | — |
| [T04](./T04-transform.md) | Visibility-aware transform | 2h | T01 |
| [T05](./T05-resolver.md) | Verified-only resolver (145 iDs) | 3–4h | T01 |
| [T06](./T06-read-pipeline.md) | Read pipeline wired to interface | 1h | T02, T04 |
| [T07](./T07-upsert-reconcile.md) | Upsert + deletion reconciliation | 2–3h | T03, T04, T05 |
| [T08](./T08-backfill.md) | One-shot backfill over 236 | 1h | T06, T07 |
| [T09](./T09-subroutine-hook.md) | SEO-subroutine hook | 1–2h | T06, T07 |
| [T10](./T10-astro-loader.md) | Astro loader + schema | 2h | T03, T07 |
| [T11](./T11-page-sections.md) | Researcher page sections | 3h | T10 |
| [T12](./T12-orcid-id-display.md) | ORCID iD display compliance | 1h | T10 |
| [T13](./T13-email-gate.md) | Email display gate | 1h | T11 |
| [T14](./T14-gdpr-optout.md) | GDPR LIA + opt-out path | 1–2h | T07, T11 |
| [T15](./T15-jsonld.md) | JSON-LD enrichment | 1h | T11 |

**Dependency order:** T01 → T02 → T06; T03 ∥ T01; (T04, T05) → T07; (T03,T04,T05) → T07 → {T08, T09, T10}; T10 → T11 → {T12, T13, T15}; T14 after T07/T11.

## Open blocker (not a task)

**PICO data-licensing agreement** gates (a) the commercial-use resolution for the live API and (b) any scaling past the curated set into full-directory ingestion. See [`legal-and-cc0.md`](./legal-and-cc0.md).
