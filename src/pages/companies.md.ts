import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const items = await getCollection('companies');
  items.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const lines: string[] = [];
  lines.push(pageHeader({ title: 'Companies', canonical: '/companies/', description: 'Browse companies with academic R&D collaborations.' }));
  lines.push('## All ' + 'companies' + ` (${items.length})`);
  lines.push('');
  for (const u of items) {
    lines.push(`- [${u.data.name}](${SITE}/companies/${u.id}/) — ${u.data.industry}, R&D ${u.data.rdSpend}, ${u.data.patents} patents`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
