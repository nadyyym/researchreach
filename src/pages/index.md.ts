import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/';
const TITLE = 'Sci-Buy — Research Intelligence CLI';
const BODY = `Sci-Buy is a CLI tool plus searchable directory site for sales and BD teams that target academic researchers. Search 250M+ papers, map researchers by field, H-index, grants, and industry ties. Export verified contacts.\n\nKey features:\n- Researcher discovery by field, institution, country, H-index, citation count\n- Grant and funding history tied to each researcher\n- Industry collaboration signals (consulting, advisory, patents)\n- Verified institutional emails sourced from publication metadata, not stale faculty pages\n- CLI-first interface for engineering and ops teams who script their workflows`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
