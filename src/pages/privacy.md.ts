import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/privacy/';
const TITLE = 'Privacy policy';
const BODY = `Sci-Buy aggregates publicly available data — publications, ORCID profiles, grant records, institutional directories. We do not collect data from individual researchers without their consent. Email enrichment uses publication metadata that researchers themselves submitted to journal publishers.`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
