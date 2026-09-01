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
function refreshOnFonts() {
  let raf = 0;
  document.fonts?.ready.then(() => {
    raf = requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  return () => cancelAnimationFrame(raf);
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

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start,
          end,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        words,
        {
          opacity: dim,
          y: 4,
        },
        {
          opacity: 1,
          y: 0,
          ease: "power1.out",
          stagger: {
            each: 0.04,
            ease: "none",
          },
        }
      );
    }, root);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("recursive-intro-done", handleRefresh);
      window.addEventListener("resize", handleRefresh);
    }

    const timer1 = setTimeout(handleRefresh, 150);
    const timer2 = setTimeout(handleRefresh, 600);
    const cancelFonts = refreshOnFonts();

    return () => {
      cancelFonts();
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (typeof window !== "undefined") {
        window.removeEventListener("recursive-intro-done", handleRefresh);
        window.removeEventListener("resize", handleRefresh);
      }
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

      <style>{`
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
          will-change: opacity, transform;
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
          ease: "expo.out",
          duration: 1.75,
          delay,
          stagger: 0.13,
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

      <style>{`
        .rh { margin: 0; }
        .rh-line {
          display: block;
          overflow: hidden;
          /* Room for descenders so the mask never clips a 'y' or 'g'. */
          padding-bottom: 0.09em;
          margin-bottom: -0.09em;
        }
        .rh-inner { display: block; }
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
          ease: "expo.out",
          duration: 1.45,
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

    if (reduced()) {
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
            scrub: 0.5,
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
          transform: scaleX(0);
          transform-origin: left center;
        }
      `}</style>
    </>
  );
}
