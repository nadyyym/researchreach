import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/terms/';
const TITLE = 'Terms of service';
const BODY = `Standard terms of service for the Sci-Buy platform. Pre-launch — terms will be expanded before paid plans launch.`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
