"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";
/**
 * PageTransition — an Apple-grade, fluid cinematic curtain between routes.
 *
 * Symmetrical paths (§7 of Apple Design Foundation):
 *   - Forward navigation: Curtain sweeps up from bottom (100% -> 0), then clears out the top (0 -> -100%).
 *   - Backward navigation (e.g. "← Back to all tracks"): Curtain sweeps down from top (-100% -> 0), then clears out the bottom (0 -> 100%).
 *
 * Latency & Polish (§1 & §3):
 *   - Captured click listener ensures instantaneous response before router starts.
 *   - Lenis and ScrollTrigger are measured and resized *behind the curtain*.
 *   - Incoming page lands precisely on its anchor before the curtain lifts, completely eliminating scroll jumps.
 */

/** Curtain covers the page. */
const OUT_MS = 0.35;
/** Curtain clears the page to reveal incoming content. */
const IN_MS = 0.44;
/** Minimum dwell time (ms) while curtain is closed so the emblem animation is clearly seen. */
const MIN_HOLD_MS = 950;

export default function PageTransition() {
  const veilRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  /** Set once a route change has actually been started from here. */
  const navigating = useRef(false);
  const isBackRef = useRef(false);
  const lastPath = useRef(pathname);
  const targetHashRef = useRef<string>("");
  const curtainClosedAt = useRef<number>(0);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Positions the incoming page behind the curtain before it lifts.
   * Resizes Lenis to update scroll limits, clears trigger caches,
   * and synchronizes immediate landing without visible scroll animations.
   */
  const settleNewPage = useCallback(() => {
    const hash = (typeof window !== "undefined" ? window.location.hash : "") || targetHashRef.current;
    const lenis = getLenis();

    if (typeof ScrollTrigger !== "undefined" && typeof ScrollTrigger.clearScrollMemory === "function") {
      ScrollTrigger.clearScrollMemory();
    }

    if (lenis) {
      lenis.resize();
    }

    if (hash && hash.length > 1) {
      const target = document.querySelector<HTMLElement>(hash);
      if (target) {
        const rect = target.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;

        window.scrollTo(0, absoluteTop);
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(absoluteTop, { immediate: true, force: true });
        } else {
          target.scrollIntoView({ block: "start" });
        }

        window.setTimeout(() => {
          if (typeof window !== "undefined" && window.location.hash) {
            try {
              window.history.replaceState(null, "", window.location.pathname);
            } catch {}
          }
        }, 150);
        return true;
      }
    }

    if (!hash) {
      window.scrollTo(0, 0);
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    }
    return false;
  }, []);

  // GSAP owns the transform; park the curtain below the fold.
  useEffect(() => {
    const veil = veilRef.current;
    if (veil) gsap.set(veil, { yPercent: 100 });
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (nav?.type === "reload") {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } catch {}
    }
  }, []);

  // ── IN: the new route has committed ───────────────────────────────────────
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const veil = veilRef.current;
    const mark = markRef.current;
    const wasNavigating = navigating.current;
    navigating.current = false;
    const isBack = isBackRef.current;

    settleNewPage();

    // Subtle incoming page reveal
    const mainEl = document.querySelector<HTMLElement>("main") || document.querySelector<HTMLElement>(".page-wrap");
    if (mainEl && !reduced()) {
      gsap.killTweensOf(mainEl);
      gsap.fromTo(
        mainEl,
        { opacity: 0.92 },
        {
          opacity: 1,
          duration: 0.38,
          ease: "power2.out",
          clearProps: "opacity",
        }
      );
    }

    if (!veil || !mark || reduced() || !wasNavigating) {
      if (veil) gsap.set(veil, { yPercent: 100, visibility: "hidden", pointerEvents: "none" });
      if (mark) mark.classList.remove("is-active");
      isBackRef.current = false;
      targetHashRef.current = "";
      curtainClosedAt.current = 0;
      return;
    }

    gsap.killTweensOf([veil, mark]);
    gsap.set(veil, { yPercent: 0, visibility: "visible", pointerEvents: "auto" });

    // Calculate remaining hold time so user clearly sees the emblem animation
    const elapsed = curtainClosedAt.current > 0 ? Date.now() - curtainClosedAt.current : 0;
    const remainingHold = Math.max(0, MIN_HOLD_MS - elapsed);
    const holdDelaySec = remainingHold / 1000;

    // Allow DOM to commit layout at the target position before lifting the curtain
    requestAnimationFrame(() => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
      settleNewPage();

      const tl = gsap.timeline({
        delay: holdDelaySec,
        onStart: () => {
          settleNewPage();
        },
        onComplete: () => {
          gsap.set(veil, { yPercent: 100, visibility: "hidden", pointerEvents: "none" });
          if (mark) mark.classList.remove("is-active");
          isBackRef.current = false;
          targetHashRef.current = "";
          curtainClosedAt.current = 0;
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("liquid-metal-resume"));
          }
        },
      });
      tl.to(
        mark,
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        veil,
        {
          yPercent: isBack ? 100 : -100,
          duration: IN_MS,
          ease: "expo.out",
        },
        0.03,
      );
    });
  }, [pathname, settleNewPage]);

  // ── OUT: capture internal links and cover the page first ───────────────────
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

      // Same page, different anchor — SmoothScroll eases it.
      if (url.pathname === window.location.pathname) return;

      // Prevent premature route swap while curtain is animating
      event.preventDefault();
      if (navigating.current) return;
      navigating.current = true;

      const isBack =
        anchor.getAttribute("data-direction") === "back" ||
        anchor.classList.contains("tb-back-btn") ||
        (url.hash === "#themes" && window.location.pathname.startsWith("/tracks"));
      isBackRef.current = isBack;

      if (typeof history !== "undefined" && "scrollRestoration" in history) {
        try {
          history.scrollRestoration = "manual";
        } catch {}
      }
      if (typeof ScrollTrigger !== "undefined" && typeof ScrollTrigger.clearScrollMemory === "function") {
        ScrollTrigger.clearScrollMemory();
      }

      if (url.hash) {
        targetHashRef.current = url.hash;
        try {
          sessionStorage.setItem("recursive:skip-intro-for-anchor", url.hash);
        } catch {}
      } else {
        targetHashRef.current = "";
        try {
          sessionStorage.removeItem("recursive:skip-intro-for-anchor");
        } catch {}
        if (typeof document !== "undefined") {
          delete document.documentElement.dataset.intro;
        }
      }

      const to = `${url.pathname}${url.search}${url.hash}`;
      const veil = veilRef.current;
      const mark = markRef.current;

      if (!veil || !mark || reduced()) {
        router.push(to);
        return;
      }

      gsap.killTweensOf([veil, mark]);
      // Reset & activate animation so it starts from keyframe 0% cleanly
      mark.classList.remove("is-active");
      void mark.offsetWidth; // trigger reflow
      mark.classList.add("is-active");

      // Symmetrical path: Back navigations enter from top (-100%), Forward enters from bottom (100%)
      gsap.set(veil, { yPercent: isBack ? -100 : 100, visibility: "visible", pointerEvents: "auto" });
      gsap.set(mark, { opacity: 0, scale: 0.96 });

      const tl = gsap.timeline({
        onComplete: () => {
          curtainClosedAt.current = Date.now();
          router.push(to);
        },
      });
      tl.to(veil, { yPercent: 0, duration: OUT_MS, ease: "power3.inOut" }, 0);
      tl.to(
        mark,
        {
          opacity: 1,
          scale: 1,
          duration: 0.24,
          ease: "power2.out",
        },
        0.06,
      );
    };

    // Use capture phase so we reliably intercept before Next.js Link initiates navigation
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [router]);

  return (
    <div ref={veilRef} className="pt-veil" aria-hidden="true">
      <div ref={markRef} className="pt-mark">
        <img
          src="/images/ui/artifact.png"
          alt=""
          className="pt-artifact-base pt-artifact-center"
          draggable={false}
        />
        <img
          src="/images/ui/artifact.png"
          alt=""
          className="pt-artifact-base pt-artifact-left"
          draggable={false}
        />
        <img
          src="/images/ui/artifact.png"
          alt=""
          className="pt-artifact-base pt-artifact-right"
          draggable={false}
        />
      </div>

      <style href="page-transition" precedence="default">{`
        .pt-veil {
          position: fixed;
          inset: 0;
          z-index: 100000;
          display: grid;
          place-items: center;
          pointer-events: none;
          visibility: hidden;
          will-change: transform;
          background:
            radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.42) 0%, rgba(52, 88, 38, 0) 62%),
            linear-gradient(180deg, #0A160A 0%, #010301 62%);
          box-shadow: 0 0 100px 30px rgba(1, 3, 1, 0.95);
        }

        .pt-mark {
          position: relative;
          width: clamp(150px, 22vw, 240px);
          aspect-ratio: 744 / 220;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity;
        }

        .pt-artifact-base {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          /* Original botanical green — rich, natural, matches site ornament */
          filter: brightness(1.16) saturate(1.1);
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* Center anchor: subtle constant presence at the pivot */
        .pt-artifact-center {
          -webkit-mask-image: radial-gradient(ellipse 24% 65% at 50% 50%, black 30%, transparent 100%);
          mask-image: radial-gradient(ellipse 24% 65% at 50% 50%, black 30%, transparent 100%);
          opacity: 0.72;
        }

        /* Dramatic split fade: Left wing starts visible */
        .pt-artifact-left {
          -webkit-mask-image: linear-gradient(to right, black 0%, black 38%, transparent 58%);
          mask-image: linear-gradient(to right, black 0%, black 38%, transparent 58%);
          opacity: 1;
        }

        /* Dramatic split fade: Right wing starts hidden */
        .pt-artifact-right {
          -webkit-mask-image: linear-gradient(to right, transparent 42%, black 62%, black 100%);
          mask-image: linear-gradient(to right, transparent 42%, black 62%, black 100%);
          opacity: 0;
        }

        .pt-mark.is-active .pt-artifact-left {
          animation: pt-split-left 1.05s ease-in-out infinite alternate;
        }

        .pt-mark.is-active .pt-artifact-right {
          animation: pt-split-right 1.05s ease-in-out infinite alternate;
        }

        @keyframes pt-split-left {
          0% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(0.98);
          }
        }

        @keyframes pt-split-right {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pt-veil { display: none; }
          .pt-artifact-left, .pt-artifact-right {
            animation: none;
            opacity: 0.85;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .pt-artifact-center { display: none; }
        }
      `}</style>
    </div>
  );
}
