/**
 * The canonical origin for this site, in one place.
 *
 * This used to be a fallback string copied into layout.tsx, robots.ts and
 * sitemap.ts, and all three defaulted to the Devfolio subdomain. With no
 * NEXT_PUBLIC_SITE_URL set, production shipped
 * `<link rel="canonical" href="https://recursiveacm.devfolio.co/...">` on every
 * page -- which tells Google the real copy of each page lives on someone else's
 * host, and consolidates the ranking signals there instead of here. The sitemap
 * had the same problem, and a sitemap listing URLs on a different host than the
 * one serving it is simply rejected.
 *
 * recursiveacm.in 308-redirects to www, so www is the canonical host; pointing
 * canonicals at the pre-redirect host would waste a hop on every crawl.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.recursiveacm.in";
