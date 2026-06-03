# Test tasks (write first)

TDD: each is written **before** its implementation task. Reuse the seo-subroutine `tests/` harness.

## T-T1 — ORCID client (relates [T01](./T01-orcid-api-client.md))
- Token is cached and reused (second call issues no token request).
- A 503 response triggers back-off + retry, not a crash.
- `ORCID_MAX_RECORDS_PER_RUN` is enforced (run stops at the cap).
- Sustained request rate stays ≤2 req/s.

## T-T2 — Resolver namesake rejection (relates [T05](./T05-resolver.md))
- Fixtures `june-huh`, `feng-zhang`, `regina-barzilay` → `unresolved`, **no iD written**.
- A true ORCID-on-OpenAlex match (e.g. Doudna) → resolved above threshold.
- Institution-mismatch candidate is rejected.

## T-T3 — Transform visibility filter (relates [T04](./T04-transform.md))
- A record mixing `public`/`limited`/`private` items yields rows for the **public items only**.
- DOI extracted from `external-ids`; year coerced to int.

## T-T4 — Deletion reconciliation (relates [T07](./T07-upsert-reconcile.md))
- Re-syncing a record with one work removed deletes exactly that child row.
- Unchanged rows persist; `last_synced_at` advances.
- Re-running an unchanged record is a no-op.

## T-T5 — Email gate (relates [T13](./T13-email-gate.md))
- `PUBLIC_SHOW_ORCID_EMAILS` off → no email in rendered output even when present in DB.
- Flag on + `display_allowed=true` → email shown.

## T-T6 — JSON-LD still valid (relates [T15](./T15-jsonld.md))
- The enriched graph passes the quality-gate validator for `(selltoscientists, researcher)`.
