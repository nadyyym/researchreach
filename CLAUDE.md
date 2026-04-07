# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Marketing site for **Sci-Buy CLI** — a research intelligence CLI for those who sell to scientists. Lives at **selltoscientists.com**. Companion product to selltostate.com (Hook for govt contracts). Both share the same Supabase for lead storage (distinguished by `source` field).

## Commands

```bash
npm run dev      # Dev server (localhost:4321)
npm run build    # Static build → dist/ (134 pages, ~3-5s)
npm run preview  # Preview built site
vercel deploy --prod --yes  # Deploy to production
```

## Architecture

**Astro 5 static site** with Tailwind CSS 4, deployed on Vercel. All pages are pre-rendered at build time (SSG). No server-side runtime.

### Content Collections (src/content/)

8 Zod-validated data collections powering programmatic SEO pages. Each collection is `type: 'data'` with individual JSON files per entry. Schemas defined in `src/content/config.ts`.

| Collection | Schema key fields | ~Count |
|---|---|---|
| universities | name, country, city, researcherCount, avgHindex, departments[] | 20 |
| fields | name, subfields[], topInstitutions[], researcherCount | 20 |
| researchers | name, institution, field, hindex, patents, industryTies[] | 15 |
| phd | name, institution, advisor, thesis, transitionSignals[] | 10 |
| countries | name, code (ISO), topInstitutions[], researchOutput | 15 |
| agencies | name, country, type (govt/private/foundation), budget | 12 |
| companies | name, industry, rdSpend, academicCollabs, patents | 15 |
| industries | name, companies[], targetResearchers, marketSize | 8 |

To add a new entry: drop a JSON file matching the schema into `src/content/{collection}/`. The `[id].astro` page template picks it up automatically via `getStaticPaths`.

### Page Structure (src/pages/)

- **Core pages**: index, features, pricing, use-cases, developers, about, contact, blog/, privacy, terms, 404
- **Programmatic pages**: Each of the 8 categories has `{category}/index.astro` (directory listing) + `{category}/[id].astro` (detail page using `getStaticPaths` + `getCollection`)

### Shared Components (src/components/)

- `Header.astro` / `Footer.astro` — included by Base.astro layout
- `InstallCommand.astro` — `npx sci-buy@latest` with clipboard copy + PostHog `copy_install_cmd` event
- `TerminalMockup.astro` — props: `lines: { type: 'prompt'|'output'|'success'|'blank', text: string }[]`
- `WaitlistForm.astro` — props: `compact?` (inline email) or full form. Submits to Supabase + PostHog
- `Breadcrumb.astro` — generates schema.org BreadcrumbList markup
- `BottomCTA.astro` — install command + email form, used at bottom of every page

### Layout (src/layouts/Base.astro)

Single layout wrapping all pages. Handles: `<head>` meta/OG/canonical, PostHog snippet, JSON-LD structured data, Google Fonts, Header/Footer. Props: `title`, `description`, `robots`, `extraSchemas`.

### Libs (src/lib/)

- `posthog.ts` — init + `trackEvent()` helper (also hardcoded in Base.astro `<head>` as inline snippet)
- `supabase.ts` — client init from env vars, `submitLead()` with `source: 'selltoscientists'`
- `seo.ts` — schema.org JSON-LD generators: Organization, WebSite, WebPage, BreadcrumbList, FAQPage, SoftwareApplication

## Design System

**Constructivist / Mondrian / De Stijl / Rodchenko** — NOT generic shadcn. This is a deliberate aesthetic choice.

Defined in `src/styles/global.css` via Tailwind 4 `@theme`:

- **Backgrounds**: `bg-bg` (#101520), `bg-bg-raised`, `bg-bg-surface`
- **Text**: `text-text`, `text-text-dim`, `text-text-muted`, `text-text-bright`
- **Accents**: `bg-accent` (muted blue), `bg-red` (muted red), `bg-yellow` (muted yellow)
- **Fonts**: `font-mono` (Space Mono), `font-body` (Inter)
- **Grid**: `grid-lines` class = 1px gap with line color (Mondrian grid effect)
- **Accent borders**: `accent-top-red`, `accent-top-blue`, `accent-top-yellow`

Key design rules:
- NO rounded corners anywhere
- NO emoji in UI (flags on country pages are Unicode characters, not decorative)
- Uppercase monospace labels: `font-mono text-[9px] tracking-[2px] uppercase`
- Large light headings with semibold key words: `text-3xl font-light` + `<strong class="font-semibold">`
- Asymmetric grid columns (2fr 1fr, not uniform)

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Vercel env | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Vercel env | Supabase anon/publishable key |
| `PUBLIC_POSTHOG_KEY` | Vercel env + hardcoded in Base.astro | PostHog project key |

## Deployment

Vercel project: `getbeton/sci-buy-cli`. Static output from `dist/`.

Domains (all redirect to .com): selltoscientists.com (primary), .org, .dev, .sh, .tech, www.

Redirects configured in `vercel.json`.

## Relationship to selltostate.com

Same company (Beton/getbeton team), same Supabase instance for leads. The Sci-Buy CLI and Hook (selltostate) share the same TUI/CLI/API engine but operate on different databases (scientists vs. government contracts). The `source` field in the leads table distinguishes signups.
