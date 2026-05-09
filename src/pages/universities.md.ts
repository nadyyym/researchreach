import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const items = await getCollection('universities');
  items.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const lines: string[] = [];
  lines.push(pageHeader({ title: 'Universities', canonical: '/universities/', description: 'Browse research universities with H-index, researcher count, and grant data.' }));
  lines.push('## All ' + 'universities' + ` (${items.length})`);
  lines.push('');
  for (const u of items) {
    lines.push(`- [${u.data.name}](${SITE}/universities/${u.id}/) — ${u.data.country}, ${u.data.researcherCount.toLocaleString()} researchers, avg H-index ${u.data.avgHindex}`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
