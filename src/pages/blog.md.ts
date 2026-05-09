import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const SITE = 'https://selltoscientists.com';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog'))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  const lines: string[] = [];
  lines.push(pageHeader({
    title: 'Blog',
    canonical: '/blog/',
    description: 'Sci-Buy blog — research outreach, academic prospecting, and KOL discovery patterns.',
  }));
  lines.push('## Posts');
  lines.push('');
  for (const p of posts) {
    lines.push(`- [${p.data.title}](${SITE}/blog/${p.slug}/) (${p.data.date}) — ${p.data.description}`);
  }
  lines.push('');
  return markdownResponse(lines.join('\n').trimEnd() + '\n');
};
