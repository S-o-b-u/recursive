"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Late-loading webfonts change text height, which moves every trigger below.
 *  One refresh once the fonts settle keeps start/end anchors honest. */
/**
 * One refresh for everyone.
 *
 * ScrollTrigger.refresh() is global: it re-measures every trigger on the
 * page (~12,000px, dozens of triggers). This file used to call it from
 * *each* instance -- and there are around forty of them on the home page --
 * on intro-done, on every resize, twice on mount, and on fonts-ready. That
 * is forty full re-measurements fired back to back, synchronously, inside
 * whatever dispatched the event. Measured: a 380ms main-thread task at the
 * hand-off on a throttled CPU, the same again at finish(), the same during
 * the artifact animation at load, and -- since a phone's toolbar showing or
 * hiding is a resize -- the same on every toolbar move, which is what a
 * shaking intro on a phone looks like.
 *
 * All requests now collapse into a single refresh on the next idle slot.
 * intro-done and resize are no longer handled here at all: the intro
 * schedules exactly one refresh when it finishes, and ScrollTrigger already
 * listens to resize itself, honouring ignoreMobileResize -- which the
 * per-instance listener silently bypassed.
 */
let refreshPending = 0;
export function scheduleRefresh() {
  if (refreshPending || typeof window === "undefined") return;
  const run = () => {
    refreshPending = 0;
    ScrollTrigger.refresh();
  };
  const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  refreshPending = typeof w.requestIdleCallback === "function"
    ? w.requestIdleCallback(run, { timeout: 400 })
    : window.setTimeout(run, 50);
}

function refreshOnFonts() {
  let cancelled = false;
  document.fonts?.ready.then(() => {
    if (!cancelled) scheduleRefresh();
  });
  return () => {
    cancelled = true;
  };
}

/* ────────────────────────────────────────────────────────────────
   RevealWords — the word-by-word illumination, scrubbed to scroll.

   Deliberately NOT pinned: the block scrolls at normal speed and the
   words light up as it passes, so the page never grabs the scroll.
   Anchored `start`/`end` (not "+=") guarantee the last word lands
   while the passage is still comfortably on screen.

   Animates opacity + a 6px lift only. No colour tweens, no blur, no
   text-shadow — those are what make scrubbed text stutter.
   ──────────────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────
   RevealWords — the word-by-word illumination, scrubbed to scroll.

   Deliberately NOT pinned: the block scrolls at normal speed and the
   words light up as it passes, so the page never grabs the scroll.
   Anchored `start`/`end` guarantee the words smoothly illuminate
   while the passage passes through the viewport.

   Animates opacity + a 6px lift only.
   ──────────────────────────────────────────────────────────────── */
export function RevealWords({
  paragraphs,
  className = "",
  start = "top 84%",
  end = "bottom 38%",
  dim = 0.18,
}: {
  paragraphs: string[];
  className?: string;
  start?: string;
  end?: string;
  dim?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;

    const words = gsap.utils.toArray<HTMLElement>(".rw-word", root);
    if (!words.length) return;

    if (reduced()) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse), (max-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start,
          end,
          scrub: isMobile ? 0.35 : 0.7,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        words,
        {
          opacity: dim,
          y: isMobile ? 2 : 4,
        },
        {
          opacity: 1,
          y: 0,
          force3D: true,
          ease: "power1.out",
          stagger: {
            each: isMobile ? 0.018 : 0.035,
            ease: "none",
          },
        }
      );
    }, root);

    // Two coalesced refreshes after mount (layout settles, images land), and
    // one on fonts-ready. See scheduleRefresh for why nothing here listens
    // to intro-done or resize any more.
    const timer1 = setTimeout(scheduleRefresh, 150);
    const timer2 = setTimeout(scheduleRefresh, 600);
    const cancelFonts = refreshOnFonts();

    return () => {
      cancelFonts();
      clearTimeout(timer1);
      clearTimeout(timer2);
      ctx.revert();
    };
  }, [paragraphs, start, end, dim]);

  return (
    <div ref={rootRef} className={`rw ${className}`}>
      {paragraphs.map((text, pIdx) => (
        <p key={pIdx} className="rw-para">
          {text.split(/\s+/).filter(Boolean).map((word, wIdx) => (
            // Real text node between spans, so wrapping and word spacing
            // stay native — no fake margin-right hacks.
            <span key={wIdx}>
              <span className="rw-word" style={{ opacity: dim }}>
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
      ))}

      <style href="reveal-words" precedence="default">{`
        .rw {
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 3vh, 2.4rem);
        }
        .rw-para {
          margin: 0;
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(1.0rem, 11.93px + 1.13vw, 1.65rem);
          font-weight: 400;
          line-height: 1.68;
          letter-spacing: -0.012em;
          text-wrap: pretty;
        }
        .rw-word {
          display: inline-block;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   RevealHeading — the classic line-mask lift. Plays once, unscrubbed,
   so headings feel decisive while the prose stays scroll-linked.
   ──────────────────────────────────────────────────────────────── */
export function RevealHeading({
  lines,
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;

    const inners = gsap.utils.toArray<HTMLElement>(".rh-inner", root);
    if (!inners.length) return;

    if (reduced()) {
      gsap.set(inners, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 112 },
        {
          yPercent: 0,
          force3D: true,
          ease: "expo.out",
          duration: 1.5,
          delay,
          stagger: 0.1,
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [delay]);

  return (
    <h2 ref={rootRef} className={`rh ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="rh-line">
          <span className="rh-inner">{line}</span>
        </span>
      ))}

      {/* href + precedence so React hoists this to <head> and emits it once.
          Without them it rendered a <style> element *inside* every <h2> --
          invalid markup (a heading takes phrasing content, and this is not),
          repeated seven times on the homepage, and sitting in the middle of the
          text a crawler reads out of the heading. Sibling components in this
          file already do it this way. */}
      <style href="reveal-heading" precedence="default">{`
        .rh { margin: 0; }
        .rh-line {
          display: block;
          overflow: hidden;
          /* Room for descenders so the mask never clips a 'y' or 'g'. */
          padding-bottom: 0.09em;
          margin-bottom: -0.09em;
        }
        .rh-inner {
          display: block;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </h2>
  );
}

/* ────────────────────────────────────────────────────────────────
   RevealBlock — generic once-only fade/lift for non-text furniture
   (fact tiles, rules, sign-offs).
   ──────────────────────────────────────────────────────────────── */
export function RevealBlock({
  children,
  className = "",
  y = 26,
  delay = 0,
  stagger = 0,
  selector,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  /** Animate matching descendants individually instead of the wrapper. */
  selector?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = selector
      ? gsap.utils.toArray<HTMLElement>(selector, root)
      : [root];
    if (!targets.length) return;

    if (reduced()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          force3D: true,
          ease: "expo.out",
          duration: 1.25,
          delay,
          stagger,
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [y, delay, stagger, selector]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   ParallaxY — a slow vertical drift, scrubbed to scroll.

   The outer div is the trigger and never moves; the inner one carries
   the tween. Animating the same element you measure means a mid-scroll
   ScrollTrigger.refresh() re-reads a displaced position — this split
   makes the anchors immovable.

   `ease: "none"` because scrub already supplies the easing; anything
   else fights the scrollbar. Transform only, so it composites on the
   GPU and never triggers layout.
   ──────────────────────────────────────────────────────────────── */
export function ParallaxY({
  children,
  className = "",
  /** Total travel in px across the whole pass. Negative = drifts down. */
  distance = 70,
  start = "top bottom",
  end = "bottom top",
  style,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  start?: string;
  end?: string;
  /** Placement for the outer (never-transformed) node — grid-column, rotation, offsets. */
  style?: CSSProperties;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;

    const inner = root.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const isMobile =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse), (max-width: 860px)").matches || reduced());

    if (isMobile) {
      gsap.set(inner, { y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { y: distance / 2 },
        {
          y: -distance / 2,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start,
            end,
            scrub: 1.2,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [distance, start, end]);

  return (
    <div ref={rootRef} className={className} style={style}>
      <div className="px-in">{children}</div>

      <style href="parallax-y" precedence="default">{`
        .px-in { will-change: transform; }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   RuleDraw — a hairline that draws itself left-to-right. scaleX, not
   width, so it costs nothing to animate.
   ──────────────────────────────────────────────────────────────── */
export function RuleDraw({
  className = "",
  delay = 0,
  duration = 1.85,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reduced()) {
      gsap.set(root, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { scaleX: 0 },
        {
          scaleX: 1,
          force3D: true,
          ease: "expo.out",
          duration,
          delay,
          scrollTrigger: { trigger: root, start: "top 92%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [delay, duration]);

  return (
    <>
      <span ref={rootRef} className={`rd ${className}`} aria-hidden="true" />

      <style href="rule-draw" precedence="default">{`
        .rd {
          display: block;
          width: 100%;
          height: 1px;
          background: var(--color-border);
          transform: translate3d(0, 0, 0) scaleX(0);
          transform-origin: left center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </>
  );
}
