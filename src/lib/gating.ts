// Per-field paywall treatment for researcher pages — ported from ui-data-atlas.
//
//   "public"  → value shown normally, in HTML + JSON-LD.
//   "blurred" → value IS in HTML (SEO sees it) but rendered CSS-blurred until an
//               entitled viewer unblurs it client-side. A soft teaser.
//   "locked"  → value NOT in HTML/JSON-LD (true paywall); served only by
//               /api/researchers/[slug]/unlock to entitled viewers and inserted
//               client-side. The locked values are ORCID-sourced data that must
//               never appear in the static build (anti-scraping).
//
// The existing researcher profile fields (name, description, hindex,
// publications, grantCount, patents) are BLURRED. The six ORCID-sourced field
// keys are LOCKED. orcid.emails is intentionally absent here — emails are never
// served unless a row has display_allowed=true (handled server-side, default off).

export type Treatment = "public" | "blurred" | "locked";

const TREATMENTS: Record<string, Treatment> = {
  // Existing researcher profile fields — blurred (already in HTML, SEO-visible).
  name: "blurred",
  description: "blurred",
  hindex: "blurred",
  publications: "blurred",
  grantCount: "blurred",
  patents: "blurred",
  // ORCID-sourced fields — locked (never in HTML; served only by the unlock API).
  "orcid.employments": "locked",
  "orcid.educations": "locked",
  "orcid.works": "locked",
  "orcid.biography": "locked",
  "orcid.keywords": "locked",
  "orcid.urls": "locked",
};

export function treatmentFor(key: string): Treatment {
  return TREATMENTS[key] ?? "public";
}

// Only "locked" values are withheld from HTML and must be served by the unlock
// API. "blurred" values are already in the HTML (just obscured).
export function lockedKeys(): string[] {
  return Object.keys(TREATMENTS).filter((k) => TREATMENTS[k] === "locked");
}
