# T12 — ORCID iD display compliance

**Est:** 1h · **Depends on:** T10 · **Test:** visual

## Context
Wherever the ORCID iD appears, display it per ORCID's official guidelines — the green iD icon + the full `https://orcid.org/{iD}` URL as a link. This is both a trademark/usage requirement and a good-faith compliance signal under the §2 risk posture (D3).

## Files
- Modify: `src/pages/researchers/[id].astro` (and the listing/card if the iD shows there)
- Add: the ORCID iD icon asset (`public/orcid-icon.svg` or inline)

## Steps
1. Render `<a href="https://orcid.org/{iD}">` with the iD icon + the full https iD as visible text.
2. Apply on the detail page (and any card/list surface showing the iD).

## Acceptance
- iD shows as icon + `https://orcid.org/0000-…` link, not bare text.
- Matches ORCID display guidelines.

## Docs
[ORCID iD display guidelines](https://info.orcid.org/documentation/integration-guide/orcid-id-display-guidelines/)
