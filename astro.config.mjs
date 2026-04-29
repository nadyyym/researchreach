// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const mtimeCache = new Map();

function gitMtime(absPath) {
  if (mtimeCache.has(absPath)) return mtimeCache.get(absPath);
  let mtime = null;
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%aI", "--", absPath],
      {
        cwd: projectRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
    mtime = out || null;
  } catch {
    mtime = null;
  }
  mtimeCache.set(absPath, mtime);
  return mtime;
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
        const mtime = source ? gitMtime(source) : null;
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
