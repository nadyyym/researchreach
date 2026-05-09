import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/about/';
const TITLE = 'About Sci-Buy';
const BODY = `Sci-Buy was built for the GTM teams selling into academia — life sciences vendors, research instrumentation companies, scientific software vendors, and KOL-engagement teams at pharma. The standard B2B contact databases (ZoomInfo, Apollo, Lusha) miss roughly 70% of academic researchers because researchers don't live in corporate HR systems. Sci-Buy aggregates publication metadata, ORCID profiles, grant records, and institutional directories instead.`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
