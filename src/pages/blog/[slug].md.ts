import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { blogPostToMarkdown, markdownResponse } from '../../lib/markdown-export';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as any;
  // The body field is on the entry itself for content collections.
  const body = entry.body || '';
  return markdownResponse(blogPostToMarkdown(entry, body));
};
