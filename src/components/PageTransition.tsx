"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";
import { triggerScrollExpand } from "@/lib/scroll-expand";

/**
 * PageTransition — a curtain that sweeps through between routes.
 *
 * The App Router swaps trees instantly, which on a site this heavy reads as a
 * hard cut: the old page vanishes mid-scroll and the new one appears already
 * half-built, with every scroll-triggered reveal firing at once. This covers
 * the swap.
 *
 * Two halves, because `usePathname()` only updates *after* navigation:
 *
 *   OUT — a document-level click listener catches internal links, holds the
 *         navigation, sweeps the curtain up over the page, then routes.
 *   IN  — the pathname change lands the new page at the top and sweeps the
 *         curtain off the top edge, so it reads as one continuous pass rather
 *         than a panel that arrives and retreats the way it came.
 *
 * Same-page hash links are deliberately ignored: SmoothScroll owns those and
 * eases them through Lenis.
 */

/** Curtain covers the page. */
const OUT_MS = 0.5;
/** Curtain clears the page. Slower — the reveal is the part you watch. */
const IN_MS = 0.78;

export default function PageTransition() {
  const veilRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  /** Set once a route change has actually been started from here. */
  const navigating = useRef(false);
  const lastPath = useRef(pathname);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Put the incoming page where it belongs before the curtain lifts, then
   * re-measure every trigger on it.
   *
   * "Where it belongs" is the top *unless* the link carried a hash — the nav
   * items are all `/#section`, so from a sub-page they are both a route change
   * and an anchor, and forcing 0 would swallow the anchor.
   */
  const settleNewPage = useCallback(() => {
    const land = () => {
      const hash = window.location.hash;
      const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
      const lenis = getLenis();

      if (target) {
        if (lenis) lenis.scrollTo(target as HTMLElement, { immediate: true, force: true });
        else (target as HTMLElement).scrollIntoView();
        return;
      }
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };

    land();
    // One frame later the new tree has laid out, so anchors are honest and the
    // section we were asked for actually exists to scroll to.
    requestAnimationFrame(() => {
      land();
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      const target = hash && hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      if (target) {
        window.setTimeout(() => triggerScrollExpand(target), 180);
      }
    });
  }, []);

  // GSAP owns the transform from here on; park the curtain below the fold.
  useEffect(() => {
    const veil = veilRef.current;
    if (veil) gsap.set(veil, { yPercent: 100 });
  }, []);

  // ── IN: the new route has committed ───────────────────────────────────────
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const veil = veilRef.current;
    const mark = markRef.current;
    navigating.current = false;

    settleNewPage();

    // ── IN: Lightweight, smooth fade on the incoming page ────────────────────
    const mainEl = document.querySelector<HTMLElement>("main") || document.querySelector<HTMLElement>(".page-wrap");
    if (mainEl && !reduced()) {
      gsap.killTweensOf(mainEl);
      gsap.fromTo(
        mainEl,
        {
          opacity: 0.88,
        },
        {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "opacity",
        }
      );
    }

    if (!veil || !mark || reduced()) {
      if (veil) gsap.set(veil, { yPercent: 100, visibility: "hidden" });
      return;
    }

    gsap.killTweensOf([veil, mark]);
    gsap.set(veil, { yPercent: 0, visibility: "visible" });

    const tl = gsap.timeline();
    tl.to(mark, { opacity: 0, scale: 0.94, duration: 0.28, ease: "power2.in" }, 0);
    tl.to(
      veil,
      {
        yPercent: -100,
        duration: IN_MS,
        ease: "expo.inOut",
        // Park it back below the fold, ready for the next departure.
        onComplete: () => gsap.set(veil, { yPercent: 100, visibility: "hidden" }),
      },
      0.04,
    );

    return () => {
      tl.kill();
    };
  }, [pathname, settleNewPage]);

  // ── OUT: hold internal links and cover the page first ─────────────────────
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;

      const href = anchor.getAttribute("href");
      // Bare hashes belong to SmoothScroll.
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      // Same page, different anchor — SmoothScroll eases it. Leave it alone.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      if (navigating.current) return;
      navigating.current = true;

      const to = `${url.pathname}${url.search}${url.hash}`;
      const veil = veilRef.current;
      const mark = markRef.current;

      if (!veil || !mark || reduced()) {
        router.push(to);
        return;
      }

      gsap.killTweensOf([veil, mark]);
      gsap.set(veil, { yPercent: 100, visibility: "visible" });
      gsap.set(mark, { opacity: 0, scale: 0.94 });

      const tl = gsap.timeline({
        onComplete: () => router.push(to),
      });
      tl.to(veil, { yPercent: 0, duration: OUT_MS, ease: "power3.inOut" }, 0);
      tl.to(mark, { opacity: 1, scale: 1, duration: 0.34, ease: "expo.out" }, 0.16);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return (
    <div ref={veilRef} className="pt-veil" aria-hidden="true">
      <span ref={markRef} className="pt-mark">
        <svg viewBox="0 0 48 48" fill="none">
          <g
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          >
            <line x1="24" y1="7" x2="24" y2="41" />
            <line x1="7" y1="24" x2="41" y2="24" />
            <line x1="12" y1="12" x2="36" y2="36" />
            <line x1="12" y1="36" x2="36" y2="12" />
          </g>
        </svg>
      </span>

      <style href="page-transition" precedence="default">{`
        .pt-veil {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          pointer-events: none;
          /* No transform here on purpose. GSAP reads a CSS transform as a base
             y in px and then stacks yPercent on top of it, which parked the
             curtain at 200% instead of 100%. Visibility does the hiding until
             the mount effect hands GSAP the starting position. */
          visibility: hidden;
          will-change: transform;
          background:
            radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.42) 0%, rgba(52, 88, 38, 0) 62%),
            linear-gradient(180deg, #0A160A 0%, #010301 62%);
          /* A soft leading edge, so the curtain arrives as a wash rather than a
             hard rectangle sliding up the screen. */
          box-shadow: 0 -40px 80px -20px rgba(1, 3, 1, 0.9);
        }

        .pt-mark {
          display: block;
          width: clamp(34px, 5vw, 52px);
          color: rgba(184, 222, 140, 0.9);
          opacity: 0;
          filter: drop-shadow(0 0 18px rgba(92, 140, 58, 0.45));
        }

        .pt-mark svg {
          width: 100%;
          height: auto;
          display: block;
          animation: pt-spin 3.4s linear infinite;
        }

        @keyframes pt-spin {
          to { transform: rotate(180deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pt-veil { display: none; }
          .pt-mark svg { animation: none; }
        }
      `}</style>
    </div>
  );
}
