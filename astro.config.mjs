// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Per-source git edit dates, precomputed by scripts/gen-lastmod.mjs and
// committed as src/data/lastmod.json. Read here instead of shelling out to
// `git log` at build time, which would require a full clone (Vercel does a
// shallow --depth=10 clone, and VERCEL_DEEP_CLONE=true breaks cloning on this
// repo). Keyed by repo-relative POSIX path.
const lastmodPath = path.join(projectRoot, "src/data/lastmod.json");
const lastmodMap = existsSync(lastmodPath)
  ? JSON.parse(readFileSync(lastmodPath, "utf8"))
  : {};

function lastmodFor(absPath) {
  const rel = path.relative(projectRoot, absPath).split(path.sep).join("/");
  return lastmodMap[rel] ?? null;
}

function resolveSourceForUrl(url) {
  const slug = new URL(url).pathname.replace(/^\/|\/$/g, "");
  const parts = slug.split("/").filter(Boolean);

  if (parts.length === 2) {
    const [collection, id] = parts;
    const json = path.join(projectRoot, `src/content/${collection}/${id}.json`);
    if (existsSync(json)) return json;
    const md = path.join(projectRoot, `src/content/${collection}/${id}.md`);
    if (existsSync(md)) return md;
  }

  if (!slug) {
    const home = path.join(projectRoot, "src/pages/index.astro");
    if (existsSync(home)) return home;
  } else {
    const astro = path.join(projectRoot, `src/pages/${slug}.astro`);
    if (existsSync(astro)) return astro;
    const idx = path.join(projectRoot, `src/pages/${slug}/index.astro`);
    if (existsSync(idx)) return idx;
  }
  return null;
}

export default defineConfig({
  site: "https://selltoscientists.com",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/privacy/") &&
        !page.includes("/terms/") &&
        !page.includes("/404"),
      serialize(item) {
        const source = resolveSourceForUrl(item.url);
        const mtime = source ? lastmodFor(source) : null;
        if (mtime) {
          item.lastmod = mtime;
        } else {
          delete item.lastmod;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
