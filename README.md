# RECURSIVE

Site for the RECURSIVE hackathon — GNIT Kolkata ACM Student Chapter.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP + ScrollTrigger · Lenis.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000, bound to 0.0.0.0 for phone testing
```

```bash
npm run build && npm start
```

Animation and media behaviour only really shows itself in a production build,
so check anything performance-related against `npm run build && npm start`
rather than the dev server.

## Layout

```
src/app/          routes; globals.css holds the design tokens and fluid scales
src/components/   sections (Hero, Themes, Judges, …); ui/ holds the primitives
src/data/         hackathon.ts is the single source for copy, tracks, FAQs
src/lib/          Lenis singleton, device heuristics, scroll + texture helpers
public/           media; hero_bg.mp4 is the shared hero/intro plate
```

`src/data/hackathon.ts` drives most on-page copy — dates, tracks, prizes, FAQ
answers, sponsor tiers. Edit content there rather than in components.

## Things worth knowing before editing

- **The intro owns the first ~9s of `/`.** `IntroSequence` renders a full-screen
  overlay, holds scroll through Lenis, and hands off to `Hero`. Force it with
  `?intro=1`, skip it with `?intro=0`. It carries a watchdog: 2.5s of zero
  timeline progress while visible hands off rather than leaving the page locked.
- **`prefersLiteMedia()` (`src/lib/device.ts`) is the one capability gate.**
  Coarse pointer, ≤860px, reduced-motion, or Save-Data takes the cheap path.
  Several components branch on it; keep new heavy effects behind it too.
- **WebGL contexts are scarce** (~16, fewer on phones). `RetroDither` and
  `WarpText` each take one and both release it via `WEBGL_lose_context` on
  unmount. Anything new that takes a context must do the same, or unrelated
  canvases elsewhere on the page go blank.
- **Fluid sizing** uses `clamp(<mobile>, <px> + <vw>, <desktop>)` ramping
  360→1280. A clamp pinned to a fixed floor breaks tablets.
- Media is cached `immutable` by `next.config.ts`, so **change the filename**
  when replacing an image or video.

## Known issues

- **Font licensing.** `MADEOkineSansPERSONALUSE-Bold.otf` (`--font-display`) and
  `HeadingNowTrial-45Medium.ttf` (`--font-heading`) are a personal-use font and a
  trial font. Both need proper licences, or replacing, before this is treated as
  a settled public site.
- Content Security Policy is configured in `next.config.ts`. It allows the
  inline bootstrap and styles required by the App Router, plus the Devfolio SDK
  and Google Maps embed. The policy is intentionally applied only to production:
  Next.js development mode uses eval-based source-map debugging, while production
  never permits `unsafe-eval`.
