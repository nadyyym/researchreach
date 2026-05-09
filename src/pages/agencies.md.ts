import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const items = await getCollection('agencies');
  items.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const lines: string[] = [];
  lines.push(pageHeader({ title: 'Funding agencies', canonical: '/agencies/', description: 'Browse research funding agencies — government, private, foundation.' }));
  lines.push('## All ' + 'agencies' + ` (${items.length})`);
  lines.push('');
  for (const u of items) {
    lines.push(`- [${u.data.name}](${SITE}/agencies/${u.id}/) — ${u.data.type}, ${u.data.country}, ${u.data.budget}`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
