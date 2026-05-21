// Pre-compute per-source git edit dates into src/data/lastmod.json so the
// sitemap can emit accurate <lastmod> values WITHOUT a deep clone at build
// time. Vercel's default shallow clone (--depth=10) lacks the history that
// `git log` needs, and forcing VERCEL_DEEP_CLONE=true breaks cloning on this
// repo — so we read git history locally (where it's complete) and commit the
// result. The build just reads the committed JSON.
//
// Run locally before committing content changes:  npm run lastmod
// Also runs as `prebuild`; on a shallow clone (e.g. Vercel) it detects that
// and keeps the committed manifest instead of overwriting it with nulls.
import { execFileSync } from "node:child_process";
import {
  readdirSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(projectRoot, "src/data/lastmod.json");

function git(args) {
  return execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function isShallow() {
  try {
    return git(["rev-parse", "--is-shallow-repository"]) === "true";
  } catch {
    return true; // no git / not a repo → treat as shallow, keep manifest
  }
}

function walk(dir, exts, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, acc);
    else if (exts.some((x) => e.name.endsWith(x))) acc.push(p);
  }
  return acc;
}

function gitDate(rel) {
  try {
    return git(["log", "-1", "--format=%aI", "--", rel]) || null;
  } catch {
    return null;
  }
}

const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

if (isShallow()) {
  console.log(
    `[lastmod] shallow clone or no git history — keeping committed manifest (${Object.keys(existing).length} entries)`,
  );
  process.exit(0);
}

const files = [
  ...walk(path.join(projectRoot, "src/content"), [".json", ".md"]),
  ...walk(path.join(projectRoot, "src/pages"), [".astro"]),
];

const manifest = { ...existing };
let changed = 0;
for (const abs of files) {
  const rel = path.relative(projectRoot, abs).split(path.sep).join("/");
  const d = gitDate(rel);
  if (d) {
    if (manifest[rel] !== d) changed++;
    manifest[rel] = d;
  }
  // If git returns nothing (e.g. brand-new uncommitted file), keep any
  // existing value rather than dropping it.
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((k) => [k, manifest[k]]),
);
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(
  `[lastmod] wrote ${Object.keys(sorted).length} entries (${changed} changed) → src/data/lastmod.json`,
);
