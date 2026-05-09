// Markdown export helpers for the public site. Mirrors the getbeton.ai
// pattern — every page on the site has a `.md` alternate, plus there's a
// curated `/llms.txt` (index) and `/llms-full.txt` (full-bundle) for
// LLM ingestion.

import type { CollectionEntry } from 'astro:content';

const SITE = 'https://selltoscientists.com';

export function pageHeader({
  title,
  subtitle,
  canonical,
  description,
}: {
  title: string;
  subtitle?: string;
  canonical: string;
  description?: string;
}): string {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  if (description) {
    lines.push(`> ${description}`);
    lines.push('');
  } else if (subtitle) {
    lines.push(`> ${subtitle}`);
    lines.push('');
  }
  const url = canonical.startsWith('http') ? canonical : `${SITE}${canonical}`;
  lines.push(`*Source: [${url}](${url})*`);
  lines.push('');
  return lines.join('\n');
}

export function bulletList(items: string[]): string {
  return items.map((i) => `- ${i}`).join('\n');
}

export function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export function plainTextResponse(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

// Per-collection markdown formatters keyed to the actual schemas in
// src/content/config.ts.

export function universityToMarkdown(entry: CollectionEntry<'universities'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      subtitle: `${d.city}, ${d.country}`,
      canonical: `/universities/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Country:** ${d.country}`);
  parts.push(`**City:** ${d.city}`);
  parts.push(`**Type:** ${d.type}`);
  parts.push(`**Researcher count:** ${d.researcherCount.toLocaleString()}`);
  parts.push(`**Average H-index:** ${d.avgHindex}`);
  parts.push(`**Grant count:** ${d.grantCount.toLocaleString()}`);
  parts.push('');
  if (d.departments.length) {
    parts.push('## Departments');
    parts.push('');
    parts.push(bulletList(d.departments));
    parts.push('');
  }
  if (d.topFields.length) {
    parts.push('## Top research fields');
    parts.push('');
    parts.push(bulletList(d.topFields));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function fieldToMarkdown(entry: CollectionEntry<'fields'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      canonical: `/fields/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Researcher count:** ${d.researcherCount.toLocaleString()}`);
  parts.push(`**Average funding:** ${d.avgFunding}`);
  parts.push('');
  if (d.subfields.length) {
    parts.push('## Subfields');
    parts.push('');
    parts.push(bulletList(d.subfields));
    parts.push('');
  }
  if (d.keyTechnologies.length) {
    parts.push('## Key technologies');
    parts.push('');
    parts.push(bulletList(d.keyTechnologies));
    parts.push('');
  }
  if (d.topInstitutions.length) {
    parts.push('## Top institutions');
    parts.push('');
    parts.push(bulletList(d.topInstitutions));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function researcherToMarkdown(entry: CollectionEntry<'researchers'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      subtitle: `${d.field} — ${d.institution}`,
      canonical: `/researchers/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Institution:** ${d.institution}`);
  parts.push(`**Field:** ${d.field}`);
  parts.push(`**H-index:** ${d.hindex}`);
  parts.push(`**Publications:** ${d.publications.toLocaleString()}`);
  parts.push(`**Grants:** ${d.grantCount}`);
  parts.push(`**Patents:** ${d.patents}`);
  if (d.orcid) parts.push(`**ORCID:** \`${d.orcid}\``);
  parts.push('');
  if (d.industryTies.length) {
    parts.push('## Industry collaborations');
    parts.push('');
    parts.push(bulletList(d.industryTies));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function phdToMarkdown(entry: CollectionEntry<'phd'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      subtitle: `PhD candidate — ${d.field} at ${d.institution}`,
      canonical: `/phd/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Institution:** ${d.institution}`);
  parts.push(`**Field:** ${d.field}`);
  parts.push(`**Advisor:** ${d.advisor}`);
  parts.push(`**Thesis:** ${d.thesis}`);
  parts.push(`**Publications:** ${d.publications}`);
  parts.push('');
  if (d.skills.length) {
    parts.push('## Skills');
    parts.push('');
    parts.push(bulletList(d.skills));
    parts.push('');
  }
  if (d.transitionSignals.length) {
    parts.push('## Industry transition signals');
    parts.push('');
    parts.push(bulletList(d.transitionSignals));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function countryToMarkdown(entry: CollectionEntry<'countries'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      canonical: `/countries/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Country code:** ${d.code}`);
  parts.push(`**Annual research output:** ${d.researchOutput.toLocaleString()} publications`);
  parts.push('');
  if (d.topFields.length) {
    parts.push('## Top research fields');
    parts.push('');
    parts.push(bulletList(d.topFields));
    parts.push('');
  }
  if (d.topInstitutions.length) {
    parts.push('## Top institutions');
    parts.push('');
    parts.push(bulletList(d.topInstitutions));
    parts.push('');
  }
  if (d.topAgencies.length) {
    parts.push('## Top funding agencies');
    parts.push('');
    parts.push(bulletList(d.topAgencies));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function agencyToMarkdown(entry: CollectionEntry<'agencies'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      subtitle: `${d.type} agency — ${d.country}`,
      canonical: `/agencies/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Country:** ${d.country}`);
  parts.push(`**Type:** ${d.type}`);
  parts.push(`**Budget:** ${d.budget}`);
  parts.push('');
  if (d.programs.length) {
    parts.push('## Programs');
    parts.push('');
    parts.push(bulletList(d.programs));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function companyToMarkdown(entry: CollectionEntry<'companies'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      subtitle: d.industry,
      canonical: `/companies/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Industry:** ${d.industry}`);
  parts.push(`**R&D spend:** ${d.rdSpend}`);
  parts.push(`**Academic collaborations:** ${d.academicCollabs}`);
  parts.push(`**Patents:** ${d.patents.toLocaleString()}`);
  parts.push('');
  return parts.join('\n').trimEnd() + '\n';
}

export function industryToMarkdown(entry: CollectionEntry<'industries'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.name,
      canonical: `/industries/${entry.id}/`,
      description: d.description,
    }),
  );
  parts.push(`**Market size:** ${d.marketSize}`);
  parts.push(`**Target researcher profile:** ${d.targetResearchers}`);
  parts.push('');
  if (d.useCases.length) {
    parts.push('## Use cases');
    parts.push('');
    parts.push(bulletList(d.useCases));
    parts.push('');
  }
  if (d.companies.length) {
    parts.push('## Representative companies');
    parts.push('');
    parts.push(bulletList(d.companies));
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function blogPostToMarkdown(entry: CollectionEntry<'blog'>, body: string): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: d.title,
      canonical: `/blog/${entry.slug}/`,
      description: d.description,
    }),
  );
  parts.push(`**Author:** ${d.author}`);
  parts.push(`**Date:** ${d.date}`);
  if (d.tags.length) parts.push(`**Tags:** ${d.tags.join(', ')}`);
  parts.push('');
  parts.push(body.trim());
  parts.push('');
  return parts.join('\n').trimEnd() + '\n';
}
