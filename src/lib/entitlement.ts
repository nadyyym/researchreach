// Entitlement = the viewer holds all-access. Ported from ui-data-atlas's
// entitlement.ts, simplified to this site's single all-access cookie.
//
//   sts_annual=1   → all-access subscriber (everything unlocked)
//
// Locked ORCID values are served only to entitled requests by
// /api/researchers/[slug]/unlock — they never appear in static HTML.
//
// In non-production (local dev / preview) every request is treated as entitled
// so the reveal flow can be previewed without a real cookie.
export interface Entitlements {
  annual: boolean;
}

export function parseEntitlements(cookieHeader: string | null): Entitlements {
  const jar: Record<string, string> = {};
  for (const part of (cookieHeader ?? "").split(/;\s*/)) {
    if (!part) continue;
    const i = part.indexOf("=");
    if (i < 0) continue;
    jar[part.slice(0, i)] = decodeURIComponent(part.slice(i + 1));
  }
  return {
    annual: jar["sts_annual"] === "1",
  };
}

export function isEntitled(e: Entitlements): boolean {
  // Local dev / preview builds are always entitled so the reveal can be tested.
  if (process.env.NODE_ENV !== "production") return true;
  return e.annual;
}
