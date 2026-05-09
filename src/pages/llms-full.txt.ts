// /llms-full.txt — concatenated bundle of every public page as Markdown.
// Single payload an LLM can ingest in one read instead of crawling 130+
// `.md` URLs. Mirrors the getbeton.ai pattern.

import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import {
  agencyToMarkdown,
  blogPostToMarkdown,
  companyToMarkdown,
  countryToMarkdown,
  fieldToMarkdown,
  industryToMarkdown,
  pageHeader,
  phdToMarkdown,
  plainTextResponse,
  researcherToMarkdown,
  universityToMarkdown,
} from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

// Static-page bodies live in this map so the bundle includes prose
// content for the pages that aren't backed by content collections.
// Kept short and factual — the canonical content remains the live HTML
// pages; this is the LLM-friendly summary.
const STATIC_PAGES: Record<string, { title: string; body: string }> = {
  '/': {
    title: 'Sci-Buy — Research Intelligence CLI',
    body: 'Sci-Buy is a CLI tool plus searchable directory site for sales and BD teams that target academic researchers. Search 250M+ papers, map researchers by field, H-index, grants, and industry ties. Export verified contacts.\n\nKey features:\n- Researcher discovery by field, institution, country, H-index, citation count\n- Grant and funding history tied to each researcher\n- Industry collaboration signals (consulting, advisory, patents)\n- Verified institutional emails sourced from publication metadata, not stale faculty pages\n- CLI-first interface for engineering and ops teams who script their workflows\n',
  },
  '/about/': {
    title: 'About Sci-Buy',
    body: 'Sci-Buy was built for the GTM teams selling into academia — life sciences vendors, research instrumentation companies, scientific software vendors, and KOL-engagement teams at pharma. The standard B2B contact databases (ZoomInfo, Apollo, Lusha) miss roughly 70% of academic researchers because researchers don\'t live in corporate HR systems. Sci-Buy aggregates publication metadata, ORCID profiles, grant records, and institutional directories instead.\n',
  },
  '/pricing/': {
    title: 'Pricing',
    body: 'Free tier: limited search and export. Paid tiers add bulk export, API access, and integration with sales tools. Contact sales for enterprise volume and custom data deliveries.\n',
  },
  '/contact/': {
    title: 'Contact',
    body: 'Reach the Sci-Buy team for sales, partnerships, or support. Pre-launch waitlist available on the homepage.\n',
  },
  '/features/': {
    title: 'Features',
    body: 'Sci-Buy features:\n- Researcher search by name, field, institution, H-index, citation count\n- Grant and funding records tied to each researcher\n- Industry collaboration tracking (patents, consulting, advisory roles)\n- Verified institutional email enrichment\n- CLI for scripted exports and integration with sales tooling\n- Per-country and per-field intelligence dashboards\n',
  },
  '/use-cases/': {
    title: 'Use cases',
    body: 'Sci-Buy use cases:\n- Life sciences vendor outreach: find PIs running labs that match your reagent or instrument\n- KOL engagement at pharma: identify high-H-index researchers in therapeutic areas\n- Research instrumentation sales: map researchers using techniques relevant to your product\n- Academic software adoption: target researchers publishing in computational fields\n- BD and partnership discovery: find researchers with industry ties and consulting history\n',
  },
  '/developers/': {
    title: 'Developers',
    body: 'Sci-Buy CLI is the developer interface for academic research intelligence. Search, filter, and export researcher data via command-line flags. Integrates with shell pipelines, Make, and CI workflows. Open-source CLI; data API on a paid tier.\n',
  },
  '/privacy/': {
    title: 'Privacy policy',
    body: 'Sci-Buy aggregates publicly available data — publications, ORCID profiles, grant records, institutional directories. We do not collect data from individual researchers without their consent. Email enrichment uses publication metadata that researchers themselves submitted to journal publishers.\n',
  },
  '/terms/': {
    title: 'Terms of service',
    body: 'Standard terms of service for the Sci-Buy platform.\n',
  },
};

export const GET: APIRoute = async () => {
  const universities = await getCollection('universities');
  const fields = await getCollection('fields');
  const researchers = await getCollection('researchers');
  const phd = await getCollection('phd');
  const countries = await getCollection('countries');
  const agencies = await getCollection('agencies');
  const companies = await getCollection('companies');
  const industries = await getCollection('industries');
  const blog = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const lines: string[] = [];
  lines.push('# Sci-Buy — Full Site Bundle');
  lines.push('');
  lines.push(
    `> Concatenated Markdown of every public page on ${SITE}. Suitable for one-shot LLM ingestion.`,
  );
  lines.push('');
  lines.push(
    `For the lightweight curated index see [${SITE}/llms.txt](${SITE}/llms.txt).`,
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  // Static pages
  for (const [path, page] of Object.entries(STATIC_PAGES)) {
    lines.push(pageHeader({ title: page.title, canonical: path }));
    lines.push(page.body.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Programmatic content
  for (const u of universities.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
    lines.push(universityToMarkdown(u));
    lines.push('---');
    lines.push('');
  }
  for (const f of fields.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
    lines.push(fieldToMarkdown(f));
    lines.push('---');
    lines.push('');
  }
  for (const r of researchers.sort((a, b) => b.data.hindex - a.data.hindex)) {
    lines.push(researcherToMarkdown(r));
    lines.push('---');
    lines.push('');
  }
  for (const p of phd) {
    lines.push(phdToMarkdown(p));
    lines.push('---');
    lines.push('');
  }
  for (const c of countries.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
    lines.push(countryToMarkdown(c));
    lines.push('---');
    lines.push('');
  }
  for (const a of agencies.sort((x, y) => x.data.name.localeCompare(y.data.name))) {
    lines.push(agencyToMarkdown(a));
    lines.push('---');
    lines.push('');
  }
  for (const c of companies.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
    lines.push(companyToMarkdown(c));
    lines.push('---');
    lines.push('');
  }
  for (const i of industries) {
    lines.push(industryToMarkdown(i));
    lines.push('---');
    lines.push('');
  }
  for (const post of blog) {
    lines.push(blogPostToMarkdown(post, post.body || ''));
    lines.push('---');
    lines.push('');
  }

  return plainTextResponse(lines.join('\n').trimEnd() + '\n');
};
