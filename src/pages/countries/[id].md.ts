import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, countryToMarkdown } from '../../lib/markdown-export';

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getCollection('countries');
  return items.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  return markdownResponse(countryToMarkdown(props.entry as any));
};
