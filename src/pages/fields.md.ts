import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const items = await getCollection('fields');
  items.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const lines: string[] = [];
  lines.push(pageHeader({ title: 'Research fields', canonical: '/fields/', description: 'Browse research fields with subfields, top institutions, and funding data.' }));
  lines.push('## All ' + 'fields' + ` (${items.length})`);
  lines.push('');
  for (const u of items) {
    lines.push(`- [${u.data.name}](${SITE}/fields/${u.id}/) — ${u.data.researcherCount.toLocaleString()} researchers; subfields: ${u.data.subfields.slice(0, 3).join(', ')}`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
