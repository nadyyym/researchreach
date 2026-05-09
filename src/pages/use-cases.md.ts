import type { APIRoute } from 'astro';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

const PATH = '/use-cases/';
const TITLE = 'Use cases';
const BODY = `Sci-Buy use cases:\n\n- Life sciences vendor outreach: find PIs running labs that match your reagent or instrument\n- KOL engagement at pharma: identify high-H-index researchers in therapeutic areas\n- Research instrumentation sales: map researchers using techniques relevant to your product\n- Academic software adoption: target researchers publishing in computational fields\n- BD and partnership discovery: find researchers with industry ties and consulting history`;

export const GET: APIRoute = async () => {
  const md = pageHeader({ title: TITLE, canonical: PATH }) + '\n' + BODY.trim() + '\n';
  return markdownResponse(md);
};
