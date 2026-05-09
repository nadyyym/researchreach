import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/features/';
const TITLE = 'Features';
const BODY = `Sci-Buy features:\n\n- Researcher search by name, field, institution, H-index, citation count\n- Grant and funding records tied to each researcher\n- Industry collaboration tracking (patents, consulting, advisory roles)\n- Verified institutional email enrichment\n- CLI for scripted exports and integration with sales tooling\n- Per-country and per-field intelligence dashboards`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
