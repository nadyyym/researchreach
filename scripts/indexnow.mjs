#!/usr/bin/env node
/**
 * IndexNow notifier for selltoscientists.com — pings Bing + Yandex with every
 * URL in the built sitemap so they re-crawl changed pages fast (much quicker
 * than waiting for an organic crawl).
 *
 * URLs come from the generated sitemap in dist/ (sitemap-0.xml etc.), so this
 * automatically covers every page Astro builds — no hardcoded path list.
 *
 * Usage:
 *   node scripts/indexnow.mjs              # submit all sitemap URLs
 *   node scripts/indexnow.mjs --only-prod  # no-op unless VERCEL_ENV=production
 *                                          # (wired as the postbuild hook)
 *
 * The key file public/<KEY>.txt must be deployed and reachable at
 * https://selltoscientists.com/<KEY>.txt for IndexNow to accept submissions.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const HOST = "selltoscientists.com";
const KEY = "367fb9502188401e5fa1bb7b77f39179";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));

// postbuild guard: only ping on Vercel production builds (not local/preview).
if (flags.has("--only-prod") && process.env.VERCEL_ENV !== "production") {
  console.log(`[IndexNow] --only-prod: VERCEL_ENV=${process.env.VERCEL_ENV || "(unset)"} — skipping.`);
  process.exit(0);
}

// Collect <loc> URLs from every dist/sitemap-N.xml (skip the index file).
function collectUrls() {
  const distDir = resolve("dist");
  if (!existsSync(distDir)) {
    console.warn("dist/ not found — run `npm run build` first.");
    return [];
  }
  const files = readdirSync(distDir).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  if (files.length === 0) {
    // fall back to the index if no numbered child sitemaps were emitted
    if (existsSync(join(distDir, "sitemap-index.xml"))) files.push("sitemap-index.xml");
  }
  const urls = new Set();
  for (const f of files) {
    const xml = readFileSync(join(distDir, f), "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = m[1].trim();
      if (u && !u.endsWith(".xml")) urls.add(u);
    }
  }
  return [...urls];
}

async function submitIndexNow(urlList) {
  if (urlList.length === 0) {
    console.warn("[IndexNow] no URLs to submit.");
    return true;
  }
  console.log(`[IndexNow] Submitting ${urlList.length} URL(s) for ${HOST}...`);
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  if (res.ok || res.status === 202) {
    console.log(`[IndexNow] Accepted (HTTP ${res.status}).`);
    return true;
  }
  console.error(`[IndexNow] Rejected (HTTP ${res.status}): ${await res.text()}`);
  return false;
}

const ok = await submitIndexNow(collectUrls());
// Never fail the build over a ping: postbuild (--only-prod) always exits 0.
process.exit(flags.has("--only-prod") ? 0 : ok ? 0 : 1);
