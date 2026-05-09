import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/pricing/';
const TITLE = 'Pricing';
const BODY = `Free tier: limited search and export. Paid tiers add bulk export, API access, and integration with sales tools. Contact sales for enterprise volume and custom data deliveries.`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
