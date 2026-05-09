import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const items = await getCollection('industries');
  items.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const lines: string[] = [];
  lines.push(pageHeader({ title: 'Industries', canonical: '/industries/', description: 'Browse industries that hire from academia or partner with research labs.' }));
  lines.push('## All ' + 'industries' + ` (${items.length})`);
  lines.push('');
  for (const u of items) {
    lines.push(`- [${u.data.name}](${SITE}/industries/${u.id}/) — market ${u.data.marketSize}`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
