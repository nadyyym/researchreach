# Product Marketing Context

*Last updated: 2026-04-07*

## Product Overview
**One-liner:** Research intelligence CLI for those who sell to scientists.
**What it does:** Sci-Buy lets B2B teams search 250M+ academic papers, map researchers by field, H-index, grants, and industry ties, then export verified contacts — all from the terminal. Three commands: search, map, export.
**Product category:** Research intelligence / scientific contact data / B2B prospecting tool
**Product type:** CLI/TUI/API tool with SaaS pricing (credit-based)
**Business model:** Free tier (100 searches/mo, no contacts) → Pro $15/mo early bird first 6 months (10K searches, verified emails, API) → Enterprise custom (unlimited, SDKs, CRM integration)

## Target Audience
**Target companies:** Pharma/biotech (mid-size to enterprise), scientific software vendors (ELN, LIMS, analytics), deep tech recruiting firms, life sciences VCs, contract research organizations
**Decision-makers:** BD leads, heads of sales, KOL program managers, medical affairs directors, recruiting leads, VC partners
**Primary use case:** Finding and reaching academic researchers who are invisible to standard B2B tools (LinkedIn, ZoomInfo, Scopus)
**Jobs to be done:**
- Build a KOL list in a specific therapeutic area with verified contacts in hours, not weeks
- Identify researchers with industry bridge signals (patents, startup affiliations, industry funding) for BD or recruiting
- Export CRM-ready researcher data filtered by institution, field, H-index, and grant activity
**Use cases:**
- Pharma BD: Build KOL lists by therapeutic area, identify clinical trial PIs, source SAB members
- Scientific software sales: Target lab PIs actively publishing in relevant verticals, segment by lab size/funding
- Deep tech recruiting: Source PhD researchers with industry transition signals (patents, startup co-founder, ex-industry)
- VC deal sourcing: Track patent filings in emerging fields, monitor spinout signals, identify founder-ready scientists

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| BD Lead (Pharma) | KOL identification speed, contact accuracy, therapeutic area depth | Building KOL lists takes weeks with manual search across fragmented databases | 50 verified KOLs in any therapeutic area in under an hour |
| Sales AE (Scientific Software) | Reaching PIs who make purchasing decisions, lab size/funding signals | ZoomInfo doesn't cover academia; LinkedIn profiles are empty or wrong | Target active lab PIs by field, institution, and funding level |
| Technical Recruiter (Deep Tech) | PhD-to-industry transition signals, skills mapping | Academic talent is invisible to recruiting tools; no way to find patent-holding PhDs | Surface researchers with industry bridge signals ready to transition |
| VC Partner (Life Sciences) | Early spinout detection, patent activity, founder signals | Spotting academic spinouts before they're public requires manual tracking | Monitor patent filings and startup affiliations in thesis areas |

## Problems & Pain Points
**Core problem:** Academic researchers are invisible to B2B tools. 70% have no LinkedIn presence. ZoomInfo indexes corporate HR systems, not universities. Scopus and Web of Science are citation databases built for literature review, not prospecting.
**Why alternatives fall short:**
- LinkedIn: 70% of researchers have no presence; those who do rarely update institutional details or grants
- ZoomInfo/Apollo: Index corporate HR systems; university researchers and NIH-funded PIs simply don't appear
- Scopus/Web of Science: Citation databases for academics, not prospecting tools; no contact data, no industry signals, no CRM export
- Faculty directories: Update yearly at best; lab moves, funding changes, and industry pivots go unrecorded
**What it costs them:** Weeks of manual searching across fragmented databases to build a single outreach list. Missed opportunities from stale data. Sending to wrong emails because institutional affiliations changed.
**Emotional tension:** "I know the researchers exist but I can't find a reliable way to reach them." Frustration of having to manually cross-reference PubMed, ORCID, and university websites for every prospect.

## Competitive Landscape
**Direct:** No direct competitor offers a CLI/API for academic researcher contact intelligence with industry bridge signals. ZoomInfo and Apollo are the closest in category but miss academia entirely.
**Secondary:** Manual research workflows (PubMed + Google Scholar + university directories + LinkedIn) — the "spreadsheet and 47 browser tabs" approach. Works but takes 10-50x longer.
**Indirect:** Scopus/Web of Science/Dimensions — academic databases that researchers use, but not designed for B2B prospecting. No contact export, no industry signals.

## Differentiation
**Key differentiators:**
- Only tool that combines publication data, grant funding, patents, and industry bridge signals in one searchable graph
- CLI-first: search → map → export in three commands, not a web dashboard
- Industry bridge signals: patent holders, startup co-founders, SAB members, industry-funded PIs, academia→industry transitions
- Built on open authoritative data (OpenAlex 250M+ papers, ORCID 20M+ IDs, PubMed, NIH Reporter, Semantic Scholar, USPTO)
- Verified institutional emails cross-referenced against recent publications (last 24 months)
**How we do it differently:** Aggregate 6+ open data sources into a unified research graph, then layer proprietary industry signal detection. Deliver via CLI/API, not a web app — fits into existing data workflows.
**Why that's better:** Speed (hours not weeks), accuracy (verified against recent publications), and depth (industry signals that no other tool surfaces).
**Why customers choose us:** "I can find 50 KOLs with verified emails and grant data in 10 minutes. That used to take my team two weeks."

## Objections & Anti-Personas
| Objection | Response |
|-----------|----------|
| "Is this GDPR-compliant?" | We only index publicly-disclosed contact information (institutional emails in publications, university pages) and public grant records. Researchers can opt out. We follow GDPR legitimate interest grounds for B2B contact data. |
| "How accurate are the emails?" | We target >85% deliverability on verified contacts. Institutional emails are cross-referenced against recent publications (last 24 months). We mark confidence levels: high, likely, unverified. |
| "We already use ZoomInfo" | ZoomInfo indexes corporate HR systems. Try searching for any academic PI — they're not there. Sci-Buy covers the 70% of the scientific workforce that ZoomInfo misses. |

**Anti-persona:** Teams selling to corporate R&D (not academic). If your buyers are in pharma/biotech corporate offices with LinkedIn profiles and ZoomInfo entries, you don't need Sci-Buy. We're for reaching the academic side — PIs, lab managers, postdocs.

## Switching Dynamics
**Push:** Current workflow requires 47 browser tabs — PubMed, Google Scholar, ORCID, university directories, LinkedIn. Takes weeks for a single KOL list. Data goes stale immediately.
**Pull:** Three terminal commands. Verified contacts with confidence scores. Industry bridge signals no other tool surfaces. CRM-ready export.
**Habit:** "We've always done it manually" / "Our medical affairs team has a process" / "We use an agency for KOL mapping"
**Anxiety:** "Will the emails actually work?" / "Is this legal for GDPR?" / "What if the data is wrong?"

## Customer Language
**How they describe the problem:**
- "Academic researchers are a black box for our sales team"
- "LinkedIn doesn't work for scientists"
- "We spend weeks building KOL lists manually"
- "ZoomInfo doesn't cover academia"
- "Faculty directories are always 3 years out of date"
**How they describe us:**
- "ZoomInfo for scientists"
- "Finally, a way to reach PIs without guessing"
- "It's like having a research analyst in your terminal"
**Words to use:** researcher graph, verified contacts, industry bridge signals, H-index, KOL, PI (principal investigator), research intelligence, open science data
**Words to avoid:** scraping, harvesting, cold email database, spam, lead generation (too generic), data mining
**Glossary:**
| Term | Meaning |
|------|---------|
| H-index | Metric measuring researcher impact (publications x citations) |
| PI | Principal Investigator — the researcher who leads a lab and controls budgets |
| KOL | Key Opinion Leader — influential researcher in a therapeutic area |
| Industry bridge signals | Indicators that a researcher has ties to industry (patents, startup affiliations, industry funding, SAB membership) |
| R01 | Major NIH research grant (~$250K-500K/year, 3-5 years) |
| ORCID | Open Researcher and Contributor ID — unique researcher identifier |
| OpenAlex | Open-access catalog of 250M+ scholarly works |

## Brand Voice
**Tone:** Technical but approachable. Direct. No fluff. Respect the user's intelligence — they know what H-index means.
**Style:** Constructivist minimalism. Short declarative sentences. Monospace labels. CLI-first metaphors. Show, don't describe (terminal mockups over feature lists).
**Personality:** Precise, understated, competent. Like a sharp research analyst who doesn't waste your time.

## Proof Points
**Metrics:**
- 250M+ papers indexed (via OpenAlex)
- 20M+ researcher IDs (via ORCID)
- 6 authoritative data sources aggregated
- >85% email deliverability target on verified contacts
- 200+ teams on waitlist
**Customers:** Pre-launch. Waitlist includes pharma BD leads, biotech sales heads, lab software AEs, deep tech recruiters, life sciences VCs.
**Value themes:**
| Theme | Proof |
|-------|-------|
| Speed | "Three commands. Full pipeline." — search → map → export in minutes |
| Accuracy | Emails cross-referenced against last 24 months of publications |
| Depth | Industry bridge signals (patents, startups, SAB, co-authorships) that no competitor surfaces |
| Coverage | 250M+ papers, 20M+ researcher IDs — the academic workforce that B2B tools miss |

## Goals
**Business goal:** Build waitlist → convert to paid Pro users at $15/mo early bird → expand to Enterprise
**Conversion action:** Install CLI (`npx sci-buy@latest`) or join waitlist (email capture)
**Current metrics:** 200+ teams on waitlist, 134 SEO pages live, 6 domains routing to selltoscientists.com
