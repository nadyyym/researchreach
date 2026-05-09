// /llms.txt — curated index for LLMs.
// Mirrors the getbeton.ai pattern. Lists every public page with a short
// description and the matching `.md` URL. Bots that respect the
// llmstxt.org convention will hit this first.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { plainTextResponse } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

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
  lines.push('# Sci-Buy');
  lines.push('');
  lines.push(
    '> Research intelligence for those who sell to scientists. Search 250M+ papers, map researchers by field, H-index, grants, and industry ties. Export verified contacts.',
  );
  lines.push('');
  lines.push('Every page on this site is available as raw Markdown by appending `.md` to the URL.');
  lines.push(
    `For a single concatenated bundle of every page, see [${SITE}/llms-full.txt](${SITE}/llms-full.txt).`,
  );
  lines.push('');

  lines.push('## What Sci-Buy does');
  lines.push('');
  lines.push(
    'Sci-Buy is a CLI tool plus searchable directory site for sales and BD teams that target academic researchers. It aggregates publication metadata, grant records, ORCID profiles, and institutional data so you can find the right researcher for a product pitch, partnership, or KOL engagement — and reach them at a verified email instead of a stale faculty page.',
  );
  lines.push('');

  lines.push('## Pages');
  lines.push('');
  lines.push(`- [Home](${SITE}/index.md)`);
  lines.push(`- [About](${SITE}/about.md)`);
  lines.push(`- [Pricing](${SITE}/pricing.md)`);
  lines.push(`- [Contact](${SITE}/contact.md)`);
  lines.push(`- [Features](${SITE}/features.md)`);
  lines.push(`- [Use cases](${SITE}/use-cases.md)`);
  lines.push(`- [Developers](${SITE}/developers.md)`);
  lines.push(`- [Privacy](${SITE}/privacy.md)`);
  lines.push(`- [Terms](${SITE}/terms.md)`);
  lines.push('');

  lines.push('## Universities');
  lines.push('');
  lines.push(`- [All universities](${SITE}/universities.md)`);
  universities
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .forEach((u) => {
      lines.push(
        `- [${u.data.name}](${SITE}/universities/${u.id}.md): ${u.data.country} — ${u.data.researcherCount.toLocaleString()} researchers, avg H-index ${u.data.avgHindex}`,
      );
    });
  lines.push('');

  lines.push('## Research fields');
  lines.push('');
  lines.push(`- [All fields](${SITE}/fields.md)`);
  fields
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .forEach((f) => {
      lines.push(
        `- [${f.data.name}](${SITE}/fields/${f.id}.md): ${f.data.researcherCount.toLocaleString()} researchers; ${f.data.subfields.length} subfields`,
      );
    });
  lines.push('');

  lines.push('## Researchers');
  lines.push('');
  lines.push(`- [All researchers](${SITE}/researchers.md)`);
  researchers
    .sort((a, b) => b.data.hindex - a.data.hindex)
    .forEach((r) => {
      lines.push(
        `- [${r.data.name}](${SITE}/researchers/${r.id}.md): ${r.data.field} at ${r.data.institution}, H-index ${r.data.hindex}`,
      );
    });
  lines.push('');

  lines.push('## PhD candidates');
  lines.push('');
  lines.push(`- [All PhD candidates](${SITE}/phd.md)`);
  phd.forEach((p) => {
    lines.push(
      `- [${p.data.name}](${SITE}/phd/${p.id}.md): ${p.data.field} — ${p.data.institution}, advisor ${p.data.advisor}`,
    );
  });
  lines.push('');

  lines.push('## Countries');
  lines.push('');
  lines.push(`- [All countries](${SITE}/countries.md)`);
  countries
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .forEach((c) => {
      lines.push(
        `- [${c.data.name}](${SITE}/countries/${c.id}.md) (${c.data.code}): ${c.data.researchOutput.toLocaleString()} publications/year`,
      );
    });
  lines.push('');

  lines.push('## Funding agencies');
  lines.push('');
  lines.push(`- [All agencies](${SITE}/agencies.md)`);
  agencies
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .forEach((a) => {
      lines.push(
        `- [${a.data.name}](${SITE}/agencies/${a.id}.md): ${a.data.type}, ${a.data.country} — ${a.data.budget}`,
      );
    });
  lines.push('');

  lines.push('## Companies');
  lines.push('');
  lines.push(`- [All companies](${SITE}/companies.md)`);
  companies
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .forEach((c) => {
      lines.push(
        `- [${c.data.name}](${SITE}/companies/${c.id}.md): ${c.data.industry} — R&D ${c.data.rdSpend}, ${c.data.patents} patents`,
      );
    });
  lines.push('');

  lines.push('## Industries');
  lines.push('');
  lines.push(`- [All industries](${SITE}/industries.md)`);
  industries.forEach((i) => {
    lines.push(
      `- [${i.data.name}](${SITE}/industries/${i.id}.md): market ${i.data.marketSize}`,
    );
  });
  lines.push('');

  lines.push('## Blog');
  lines.push('');
  lines.push(`- [Blog index](${SITE}/blog.md)`);
  blog.forEach((p) => {
    lines.push(
      `- [${p.data.title}](${SITE}/blog/${p.slug}.md) (${p.data.date}): ${p.data.description}`,
    );
  });
  lines.push('');

  lines.push('## Links');
  lines.push('');
  lines.push(`- Sitemap: ${SITE}/sitemap-index.xml`);

  return plainTextResponse(lines.join('\n').trimEnd() + '\n');
};
