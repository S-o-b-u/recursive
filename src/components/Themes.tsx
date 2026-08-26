"use client";

import type { CSSProperties } from "react";
import { TRACKS } from "@/data/hackathon";
import {
  RevealHeading,
  RevealBlock,
  ParallaxY,
  RuleDraw,
} from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";

/**
 * THEMES — an offset ladder, not a grid.
 *
 * Twelve columns, and every row sits somewhere different in them: the image
 * swaps sides, changes aspect, and the copy hangs off whichever edge is free.
 * The row index is set oversized and outlined, straddling the image's top
 * corner. Adjacent rows drift in opposite directions on scroll, so the
 * composition keeps shearing past itself instead of marching down the page.
 *
 * Placement lives in `ROWS` as custom properties, which means the media query
 * at the bottom can flatten all of it to one column without !important wars.
 */
const ROWS = [
  { m: "1 / 8", t: "9 / 13", ratio: "4 / 3", align: "end", numx: "end", gap: 0, drift: 96 },
  { m: "6 / 13", t: "1 / 5", ratio: "21 / 9", align: "start", numx: "start", gap: 7, drift: -74 },
  { m: "2 / 7", t: "8 / 12", ratio: "3 / 4", align: "end", numx: "end", gap: 5, drift: 112 },
  { m: "7 / 13", t: "1 / 6", ratio: "1 / 1", align: "start", numx: "start", gap: 6, drift: -84 },
] as const;

export default function Themes() {
  return (
    <section id="themes" className="th" aria-label="Themes">
      <div className="th-inner">
        <RevealHeading className="th-heading" lines={["Build one of", "these four."]} />

        <div className="th-ladder">
          {TRACKS.map((track, i) => {
            const row = ROWS[i % ROWS.length];
            const index = String(i + 1).padStart(2, "0");

            return (
              <div
                key={track.slug}
                className="th-row"
                style={
                  {
                    "--m": row.m,
                    "--t": row.t,
                    "--align": row.align,
                    "--numx": row.numx,
                    "--gap": row.gap,
                  } as CSSProperties
                }
              >
                <ParallaxY className="th-media" distance={row.drift}>
                  <MediaSlot
                    slot={track.media}
                    ratio={row.ratio}
                    sizes="(max-width: 900px) 100vw, 55vw"
                    className="th-slot"
                  />
                </ParallaxY>

                {/* Drifts harder than the image it sits on, so the two shear apart. */}
                <ParallaxY className="th-num" distance={row.drift * 1.6}>
                  <span aria-hidden="true">{index}</span>
                </ParallaxY>

                <div className="th-text">
                  <RevealBlock y={20}>
                    <h3 className="th-title">{track.title}</h3>
                    <RuleDraw className="th-rule" />
                    <p className="th-line">{track.line}</p>
                  </RevealBlock>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .th {
          position: relative;
          width: 100%;
          background: var(--color-bg-alt);
          color: #111a12;
          padding-block: clamp(6rem, 14vh, 11rem);
          overflow: hidden;
        }

        .th-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .th-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 7vw, 5.5rem);
          line-height: 0.94;
          letter-spacing: -0.022em;
          text-transform: uppercase;
        }
        /* Second line steps in — the whole section is built on offsets, so the
           heading may as well admit it. */
        .th-heading .rh-line:nth-child(2) { padding-left: 11%; }

        .th-ladder { margin-top: clamp(3.5rem, 9vh, 6.5rem); }

        .th-row {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: clamp(1rem, 2.4vw, 2rem);
          margin-top: calc(var(--gap) * 1vw);
        }

        .th-media { grid-column: var(--m); grid-row: 1; }

        .th-num {
          grid-column: var(--m);
          grid-row: 1;
          justify-self: var(--numx);
          align-self: start;
          z-index: 2;
          pointer-events: none;
          /* Hangs off the image's top corner instead of sitting politely inside it. */
          margin-top: -0.42em;
          margin-inline: -0.18em;
        }
        .th-num span {
          display: block;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(3.6rem, 11vw, 10rem);
          line-height: 0.78;
          letter-spacing: -0.04em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(17, 26, 18, 0.42);
        }

        .th-text {
          grid-column: var(--t);
          grid-row: 1;
          align-self: var(--align);
          padding-block: clamp(0.5rem, 2vw, 1.75rem);
        }

        .th-title {
          margin: 0;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.5rem, 2.9vw, 2.5rem);
          line-height: 0.98;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .th-rule {
          margin-block: clamp(0.85rem, 1.8vw, 1.3rem);
          background: rgba(47, 85, 39, 0.3);
        }

        .th-line {
          margin: 0;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1rem, 1.55vw, 1.24rem);
          font-weight: 380;
          line-height: 1.45;
          letter-spacing: -0.018em;
          color: var(--color-text-secondary);
          text-wrap: pretty;
        }

        @media (max-width: 900px) {
          .th-row {
            grid-template-columns: minmax(0, 1fr);
            margin-top: clamp(3rem, 9vw, 4.5rem);
          }
          .th-media, .th-num, .th-text {
            grid-column: 1 / -1;
            justify-self: start;
          }
          .th-media { grid-row: 1; }
          .th-num { grid-row: 1; align-self: start; }
          .th-text { grid-row: 2; align-self: start; padding-block: 1.1rem 0; }
          .th-heading .rh-line:nth-child(2) { padding-left: 0; }
          /* MediaSlot writes aspect-ratio inline, so flattening the portrait and
             letterbox rows to something phone-shaped has to shout. */
          .th-media .ms { aspect-ratio: 4 / 3 !important; }
        }
      `}</style>
    </section>
  );
}
