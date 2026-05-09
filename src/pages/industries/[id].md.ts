import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, industryToMarkdown } from '../../lib/markdown-export';

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getCollection('industries');
  return items.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  return markdownResponse(industryToMarkdown(props.entry as any));
};
