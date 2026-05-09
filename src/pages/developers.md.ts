import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/developers/';
const TITLE = 'Developers';
const BODY = `Sci-Buy CLI is the developer interface for academic research intelligence. Search, filter, and export researcher data via command-line flags. Integrates with shell pipelines, Make, and CI workflows. Open-source CLI; data API on a paid tier.`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
