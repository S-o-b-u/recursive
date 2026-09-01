"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * FlipClock — a mechanical split-flap countdown.
 *
 * Each digit is one card cut across the middle. When the value changes the old
 * top half folds down over the seam, the new bottom half unfolds up behind it,
 * and a puff of vapour escapes the crease — the "smoke" is four blurred radial
 * discs with staggered delays and their own drift vectors, so no two flips look
 * identical.
 *
 * The half-glyph trick: every half holds a full-height numeral and clips it.
 * The top half shows the numeral's head, the bottom half shifts it up 50% and
 * shows its feet. The two folding flaps reuse those same halves, which is why
 * the seam never jumps mid-fold.
 *
 * Sizing rides on one custom property, so the whole board scales from a single
 * clamp() and the separators, labels and vapour all follow.
 */

const FOLD_MS = 260;
const DROP_MS = 300;

/**
 * How long the flap stays mounted — deliberately longer than FOLD + DROP.
 *
 * The timeout is scheduled in the effect, but the element only begins animating
 * on the paint *after* it mounts, so the animation's own t=0 is about a frame
 * later than the timer's. Unmounting at exactly FOLD + DROP therefore tore the
 * last frame off the settle: the flap vanished at ~98% and the static half
 * underneath snapped in. That one-frame pop was the seconds-card jitter.
 *
 * The flap holds its end state (animation-fill-mode: forwards) and is
 * pixel-identical to the static half by then, so the extra time is invisible.
 */
const FLIP_MS = FOLD_MS + DROP_MS + 90;

/** Each puff gets its own delay, drift and end-scale so flips never repeat. */
const PUFFS: CSSProperties[] = [
  { "--d": "0ms", "--x": "-58%", "--y": "-128%", "--sc": "1.75" } as CSSProperties,
  { "--d": "50ms", "--x": "-40%", "--y": "-96%", "--sc": "2.2" } as CSSProperties,
  { "--d": "100ms", "--x": "-64%", "--y": "-70%", "--sc": "1.5" } as CSSProperties,
  { "--d": "150ms", "--x": "-46%", "--y": "-146%", "--sc": "2.6" } as CSSProperties,
];

function FlipDigit({ digit, smoke = true }: { digit: string; smoke?: boolean }) {
  const shown = useRef(digit);
  const [flip, setFlip] = useState<{ from: string; to: string; k: number } | null>(null);

  useEffect(() => {
    if (shown.current === digit) return;
    const from = shown.current;
    shown.current = digit;
    setFlip((f) => ({ from, to: digit, k: (f?.k ?? 0) + 1 }));
    const t = setTimeout(() => setFlip(null), FLIP_MS);
    return () => clearTimeout(t);
  }, [digit]);

  return (
    <span className="fkc-cell" aria-hidden="true">
      {/* The card clips; the vapour below does not. */}
      <span className="fkc-digit">
        {/* Static halves. The top already carries the new value; the bottom
            hangs on to the old one until the unfolding flap covers it. */}
        <span className="fkc-half fkc-top">
          <b>{digit}</b>
        </span>
        <span className="fkc-half fkc-bottom">
          <b>{flip ? flip.from : digit}</b>
        </span>

        {flip && (
          <span key={flip.k} className="fkc-anim">
            <span className="fkc-flap fkc-flap-fold">
              <b>{flip.from}</b>
            </span>
            <span className="fkc-flap fkc-flap-drop">
              <b>{flip.to}</b>
            </span>
            {/* the shadow the falling flap throws onto the half beneath it */}
            <span className="fkc-cast" />
          </span>
        )}

        <span className="fkc-seam" />
        <span className="fkc-gloss" />
      </span>

      {flip && smoke && (
        <span key={`s${flip.k}`} className="fkc-smoke">
          {PUFFS.map((style, i) => (
            <i key={i} style={style} />
          ))}
        </span>
      )}
    </span>
  );
}

export interface FlipClockUnit {
  /** Zero-padded. One card per character. */
  value: string;
  label: string;
}

export default function FlipClock({
  units,
  className = "",
}: {
  units: FlipClockUnit[];
  className?: string;
}) {
  return (
    <div className={`fkc ${className}`.trim()}>
      <div className="fkc-board">
        {units.map((unit, i) => (
          <div className="fkc-group" key={unit.label}>
            <div className="fkc-cards">
              {unit.value.split("").map((ch, j) => (
                <FlipDigit key={j} digit={ch} smoke={unit.label !== "Seconds"} />
              ))}
            </div>
            <span className="fkc-label">{unit.label}</span>
            {i < units.length - 1 && (
              <span className="fkc-colon" aria-hidden="true">
                <i />
                <i />
              </span>
            )}
          </div>
        ))}
      </div>

      <span className="fkc-sr">
        {units.map((u) => `${Number(u.value)} ${u.label.toLowerCase()}`).join(", ")} until
        the gates open
      </span>

      <style href="flip-clock" precedence="default">{`
        .fkc {
          --fkc-w: clamp(3.4rem, 8.2vw, 6.6rem);
          --fkc-h: calc(var(--fkc-w) * 1.42);
          --fkc-r: calc(var(--fkc-w) * 0.14);
          --fkc-gap: calc(var(--fkc-w) * 0.11);
          --fkc-ink: #F4F7EC;
          --fkc-face-b: #16240F;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .fkc-board {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: calc(var(--fkc-w) * 0.46);
        }

        .fkc-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(var(--fkc-w) * 0.24);
        }

        .fkc-cards {
          display: flex;
          gap: var(--fkc-gap);
        }

        /* ── One card ──
           .fkc-cell is the unclipped box the vapour lives in; .fkc-digit is the
           card itself and clips. The clip matters: an unfolding flap swings its
           free edge toward the viewer, and perspective magnifies whatever is
           nearer — so the lower flap was drawing ~17% oversized, with square
           corners poking out past the card's rounded ones. That read as a
           glitch. Clipping at the card makes the overhang impossible.

           Perspective therefore has to live on .fkc-anim, not here: overflow
           forces this element to transform-style: flat, which would strip the
           3D from the flaps entirely. On .fkc-anim the flaps are still direct
           children, so they keep it. */
        .fkc-cell {
          position: relative;
          display: block;
          width: var(--fkc-w);
          height: var(--fkc-h);
          contain: layout style;
        }

        .fkc-digit {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: var(--fkc-r);
          background: var(--fkc-face-b);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.34),
            0 12px 28px -14px rgba(16, 32, 14, 0.8),
            0 2px 6px -2px rgba(16, 32, 14, 0.4);
          isolation: isolate;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .fkc-half,
        .fkc-flap {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .fkc-top,
        .fkc-flap-fold {
          top: 0;
          align-items: flex-start;
          border-radius: var(--fkc-r) var(--fkc-r) 0 0;
          background: linear-gradient(180deg, #3A5A31 0%, #2A4324 100%);
          box-shadow: inset 0 1px 0 rgba(214, 236, 196, 0.26);
        }

        .fkc-bottom,
        .fkc-flap-drop {
          bottom: 0;
          align-items: flex-end;
          border-radius: 0 0 var(--fkc-r) var(--fkc-r);
          background: linear-gradient(180deg, #1E3218 0%, var(--fkc-face-b) 100%);
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
        }

        /* A full-height numeral inside a half-height box. The alignment does the
           whole job: flex-start leaves the head showing and clips the feet,
           flex-end does the reverse. No transform — one would shift the crop off
           the seam and the two halves would stop lining up. */
        .fkc-digit b {
          display: block;
          width: 100%;
          height: var(--fkc-h);
          font-family: var(--font-bebas), var(--font-heading), sans-serif;
          font-weight: 400;
          font-size: calc(var(--fkc-w) * 1.06);
          line-height: var(--fkc-h);
          text-align: center;
          letter-spacing: 0.01em;
          color: var(--fkc-ink);
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          -webkit-font-smoothing: antialiased;
          transform: translate3d(0, 0, 0);
        }

        /* ── The fold ── */
        .fkc-anim {
          position: absolute;
          inset: 0;
          display: block;
          perspective: calc(var(--fkc-h) * 5.2);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* The fold throws down in 260ms, the drop settles smoothly in 300ms. */
        .fkc-flap-fold {
          z-index: 3;
          transform-origin: 50% 100%;
          will-change: transform, opacity;
          animation: fkc-fold ${FOLD_MS}ms cubic-bezier(0.4, 0, 0.7, 1) forwards;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .fkc-flap-drop {
          z-index: 4;
          transform-origin: 50% 0%;
          will-change: transform, opacity;
          opacity: 0;
          animation: fkc-drop ${DROP_MS}ms cubic-bezier(0.16, 0.95, 0.3, 1) ${FOLD_MS}ms forwards;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        @keyframes fkc-fold {
          0%   { transform: translate3d(0, 0, 0) rotateX(0deg); opacity: 1; }
          99%  { opacity: 1; }
          100% { transform: translate3d(0, 0, 0) rotateX(-90deg); opacity: 0; }
        }

        @keyframes fkc-drop {
          0%   { transform: translate3d(0, 0, 0) rotateX(90deg); opacity: 0; }
          1%   { opacity: 1; }
          100% { transform: translate3d(0, 0, 0) rotateX(0deg); opacity: 1; }
        }

        .fkc-cast {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 50%;
          z-index: 2;
          border-radius: 0 0 var(--fkc-r) var(--fkc-r);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 78%);
          animation: fkc-cast ${FOLD_MS + DROP_MS}ms cubic-bezier(0.33, 0, 0.2, 1) forwards;
        }

        /* Tracks the fold/drop split: holds while the flap is overhead, then
           clears as it settles. */
        @keyframes fkc-cast {
          0%   { opacity: 0.9; }
          45%  { opacity: 0.65; }
          100% { opacity: 0; }
        }

        /* ── Vapour off the seam ── */
        /* Sits on .fkc-cell, outside the card's clip, so puffs can drift off
           the seam and past the card edge. */
        .fkc-smoke {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1px;
          height: 1px;
          z-index: 6;
          pointer-events: none;
        }

        .fkc-smoke i {
          position: absolute;
          left: 0;
          top: 0;
          width: calc(var(--fkc-w) * 0.95);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 58%,
            rgba(246, 250, 240, 0.72) 0%,
            rgba(224, 238, 212, 0.3) 44%,
            rgba(210, 228, 198, 0) 74%);
          filter: blur(calc(var(--fkc-w) * 0.13));
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.16);
          animation: fkc-puff 800ms cubic-bezier(0.2, 0.6, 0.28, 1) var(--d) forwards;
        }

        @keyframes fkc-puff {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.16); }
          20%  { opacity: 0.42; }
          50%  { opacity: 0.24; }
          100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(var(--sc));
          }
        }

        /* ── Fixed furniture ── */
        .fkc-seam {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          z-index: 7;
          transform: translateY(-0.5px);
          background: rgba(0, 0, 0, 0.55);
          box-shadow: 0 1px 0 rgba(220, 240, 200, 0.09);
          pointer-events: none;
        }

        /* the specular streak that reads as moulded plastic */
        .fkc-gloss {
          position: absolute;
          inset: 0;
          z-index: 8;
          border-radius: var(--fkc-r);
          pointer-events: none;
          background: linear-gradient(103deg,
            rgba(255, 255, 255, 0.17) 0%,
            rgba(255, 255, 255, 0.03) 26%,
            rgba(255, 255, 255, 0) 48%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        /* ── Labels & separators ── */
        /* These sit over the valley photograph, which runs from pale haze to
           dark grass across the board's width — hence the halo rather than a
           flat tint. */
        .fkc-label {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.68rem, 1.0vw, 0.86rem);
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #22391D;
          text-shadow:
            0 0 10px rgba(240, 246, 232, 0.85),
            0 0 3px rgba(240, 246, 232, 0.95);
          padding-left: 0.24em;
        }

        .fkc-colon {
          position: absolute;
          top: calc(var(--fkc-h) * 0.5);
          right: calc(var(--fkc-w) * -0.3);
          transform: translate(50%, -50%);
          display: flex;
          flex-direction: column;
          gap: calc(var(--fkc-w) * 0.17);
        }

        .fkc-colon i {
          width: calc(var(--fkc-w) * 0.085);
          aspect-ratio: 1;
          border-radius: 50%;
          background: rgba(34, 57, 29, 0.55);
          box-shadow: 0 0 6px rgba(240, 246, 232, 0.6);
        }

        .fkc-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* Four groups across is eight cards in a row — under ~680px that either
           overflows or shrinks the numerals past reading size. Fold to a fixed
           2x2 instead and let the cards grow back. Grid, not flex-wrap, so the
           break is deterministic rather than dependent on the measured width. */
        @media (max-width: 680px) {
          .fkc { --fkc-w: clamp(3.0rem, 19.5vw, 5.6rem); }

          .fkc-smoke { display: none !important; }

          .fkc-board {
            display: grid;
            grid-template-columns: repeat(2, max-content);
            justify-content: center;
            column-gap: calc(var(--fkc-w) * 0.55);
            row-gap: calc(var(--fkc-w) * 0.42);
          }

          /* the colon after "hours" would sit at the end of the row */
          .fkc-group:nth-child(even) .fkc-colon { display: none; }

          .fkc-label { letter-spacing: 0.16em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fkc-flap-fold,
          .fkc-flap-drop,
          .fkc-cast,
          .fkc-smoke i {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>
    </div>
  );
}
