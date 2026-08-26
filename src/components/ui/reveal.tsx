"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
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
export function RevealWords({
  paragraphs,
  className = "",
  start = "top 78%",
  end = "bottom 70%",
  dim = 0.13,
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
      gsap.fromTo(
        words,
        { opacity: dim, y: 6 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 1.6,
          stagger: 0.4,
          scrollTrigger: {
            trigger: root,
            start,
            end,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);

    const cancel = refreshOnFonts();
    return () => {
      cancel();
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
              <span className="rw-word">{word}</span>{" "}
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
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          font-size: clamp(1.15rem, 2.05vw, 1.6rem);
          font-weight: 350;
          line-height: 1.66;
          letter-spacing: -0.014em;
          text-wrap: pretty;
        }
        .rw-word { display: inline-block; }
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
          duration: 1.5,
          delay,
          stagger: 0.11,
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [lines, delay]);

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
          ease: "power3.out",
          duration: 1.1,
          delay,
          stagger,
          scrollTrigger: { trigger: root, start: "top 86%", once: true },
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
