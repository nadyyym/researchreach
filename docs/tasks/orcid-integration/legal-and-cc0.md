# Legal analysis + CC0 Public Data File deep-dive

Two parts: (A) the licensing analysis that drove the decisions, and (B) a concrete look at whether the CC0 bulk file is a realistic fallback — size, structure, parse cost, where to stage it.

---

## A. Legal analysis (cited)

ORCID exposes **two legal surfaces with opposite commercial postures.**

### A1. The live Public API — non-commercial only
From the [ORCID Public APIs Terms of Service](https://info.orcid.org/public-client-terms-of-service/):

- **§2:** *"We grant you a limited royalty-free license to make **non-commercial** use of the Public APIs… you may not charge any re-use fees for the Public APIs, and you may not make use of the public APIs **in connection with any revenue-generating product or service**."* → selltoscientists is commercial → Public API use is **outside this license**. (The risk D3 accepts.)
- **§2 data license:** *"a limited license to use any Registry data marked 'public' … does not extend to materials linked to ORCID iD records, such as full text articles or datasets."*
- **§3:** *"You may not exceed our posted rate limits and usage quotas"*; *"You may not use the Public APIs to **continuously poll** the ORCID Registry."*

**Why §3 matters more than §2 operationally:** §3 is machine-enforced (503s, credential revocation). §2 is a contractual/relationship risk. Our design must never look like a poller — hence low volume, throttle, cache, slow refresh. The §2 commercial risk is mitigated by attribution, opt-outs, and being resolved via PICO.

**Rate limits** ([API limits FAQ](https://info.orcid.org/ufaqs/what-are-the-api-limits/)): authenticated Public API = **12 req/s, 40 burst, 100k reads/day per Client ID**; **503** on burst. Anonymous = 25k/day per IP. Our whole curated set ≈ 236 single `/record` reads — trivial against quota, which is exactly why low-volume cached enrichment stays clear of §3.

### A2. The CC0 Public Data File — commercial OK
From the [Public Data File Use Policy](https://info.orcid.org/public-data-file-use-policy/) + [Annual data files](https://info.orcid.org/what-is-orcid/services/annual-data-files/):
- **Creative Commons CC0 1.0 Universal** public-domain dedication. ORCID *"makes no copyright, related or neighboring rights claims"* and *"does not impose any conditions on access to and use of the Public Data File."* → **commercial use explicitly fine; no non-commercial clause, no polling clause.** This is the sanctioned commercial + bulk path.

### A3. GDPR (applies regardless of CC0 or API)
CC0 waives copyright, **not** data-protection law. ORCID records are personal data; many researchers are EU/UK.
- **Lawful basis:** legitimate interest (public professional academic data). Needs a short documented LIA — [T14](./T14-gdpr-optout.md).
- **Erasure/rectification:** reflect deletions/privatization → deletion reconciliation ([T07](./T07-upsert-reconcile.md)) + opt-out (T14).
- **Minimization:** store only public-visibility items; emails ingested but display-gated ([T13](./T13-email-gate.md)).
- **Attribution / good faith:** official ORCID iD icon + link per [display guidelines](https://info.orcid.org/documentation/integration-guide/orcid-id-display-guidelines/) — [T12](./T12-orcid-id-display.md).

---

## B. CC0 Public Data File — deep-dive (your questions)

### B1. How big is it?
The **2024 file = 185.92 GB** (compressed download on [Figshare](https://orcid.figshare.com/articles/dataset/ORCID_Public_Data_File_2024/27151305)), snapshot 2024-09-23, posted 2024-10-04. It grows every year (≈+30–40 GB/yr). Uncompressed XML is **far** larger — comfortably ~1 TB+ across all activities. It covers ~20M+ registered iDs (most records are sparse/empty). Released **once a year** around Open Access Week.

### B2. What's its structure?
- **Format:** XML only (since 2018), against ORCID's **v3.0 message schema** — *the same schema the API returns*. (No JSON; convert with the ORCID Conversion Library if wanted.)
- **Packaging:** `.tar.gz` archives — **1 summaries archive + 11 activities archives**. The summaries archive is a small fraction of the 186 GB; the 11 activities archives (works, employments, etc.) are the bulk.
- **Sharding:** every record is filed by the **last 3 digits of its ORCID iD** (the chars before the checksum). E.g. iD `0001-0000-0005-1234` → `…/ORCID_2024_summaries/234/0001-0000-0005-1234-summary.xml`. Activities use the same 3-digit shard.
- **Per record:** one `*-summary.xml` (person bio/name/keywords/urls/emails + activity *summaries*) plus, in the activities archives, one XML per full activity section (full works list, etc.).

### B3. How complicated is it to parse?
**Moderate, and cheaper than it looks for us**, for three reasons:
1. **Same schema as the API.** Because the file is v3.0, **our `transform.py` ([T04](./T04-transform.md)) is source-agnostic** — the abstraction layer ([T02](./T02-source-abstraction.md)) means a `PublicDataFileSource` feeds the *same* transform. No second mapper to build.
2. **Records are tiny standalone files.** Don't load 1 TB into memory — iterate `tar` members with a streaming reader (Python `tarfile` + `lxml.etree.iterparse` per member), parse each small XML, emit rows, move on. Constant memory.
3. **We usually only need the summaries archive.** Person + affiliation summaries live in the summaries archive (the small one). The 11 big activities archives are only needed if we want **full publication lists** at directory scale — skip them otherwise.

Real work = (a) handle the XSD/namespaces (schemas in [ORCID's GitHub](https://github.com/ORCID/orcid-model)), (b) stream-iterate tar members and filter to the shards we care about, (c) reuse the existing transform. Optional: ORCID Conversion Library (Java) for XML→JSON if a team prefers JSON.

### B4. Where do we store it before parsing into the DB?
**Never on the Astro build host or the app.** Two regimes:

- **Curated-set fallback (236 → few thousand):** stream the **summaries** tar.gz directly from Figshare, filter on the fly to the ~91 shard folders we need, parse in memory, write to DB — **persist nothing**, or cache only the summaries archive temporarily on the openclaw VM (check free disk first; the VM is tight per maintenance notes). You never touch the 186 GB activities archives at this scale.
- **Full-directory regime (post-PICO):** land the archives in **object storage** — Cloudflare R2 (we already use Cloudflare) or a GCS bucket — and run a worker that **streams each archive shard-by-shard** into the DB in batches. Do **not** extract ~1 TB to local disk. Pattern: `Figshare → R2 (raw .tar.gz) → streaming parser worker → batched inserts → Supabase`. Process is idempotent on `(orcid, put_code)` so a re-run/resume is safe.

### B5. Verdict
At our chosen scale (curated 236, growing slowly), **the CC0 file is overkill** — its only advantages are commercial-clean licensing and bulk, and we've deliberately taken the API + accepted the §2 risk (D3) because 236 live `/record` calls are trivial and always-fresh. The CC0 file becomes the **right and only** tool at full-directory scale **after PICO** (D2) — and even then, summaries-archive-only unless full works lists are required. The whole point of the source-abstraction layer ([T02](./T02-source-abstraction.md)) is that flipping to it is a one-file change, not a rewrite.

**Sources:** [Public APIs ToS](https://info.orcid.org/public-client-terms-of-service/) · [Public Data File Use Policy](https://info.orcid.org/public-data-file-use-policy/) · [Annual data files](https://info.orcid.org/what-is-orcid/services/annual-data-files/) · [Working with bulk data](https://info.orcid.org/documentation/integration-guide/working-with-bulk-data/) · [API limits FAQ](https://info.orcid.org/ufaqs/what-are-the-api-limits/) · [2024 file on Figshare](https://orcid.figshare.com/articles/dataset/ORCID_Public_Data_File_2024/27151305) · [orcid-model (XSDs)](https://github.com/ORCID/orcid-model)
