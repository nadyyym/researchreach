import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const items = await getCollection('countries');
  items.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const lines: string[] = [];
  lines.push(pageHeader({ title: 'Countries', canonical: '/countries/', description: 'Browse research output and top institutions by country.' }));
  lines.push('## All ' + 'countries' + ` (${items.length})`);
  lines.push('');
  for (const u of items) {
    lines.push(`- [${u.data.name}](${SITE}/countries/${u.id}/) (${u.data.code}) — ${u.data.researchOutput.toLocaleString()} publications/year`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
