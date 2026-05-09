import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/contact/';
const TITLE = 'Contact';
const BODY = `Reach the Sci-Buy team for sales, partnerships, or support. Pre-launch waitlist available on the homepage.`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
