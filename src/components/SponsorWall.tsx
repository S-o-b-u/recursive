"use client";

import type { CSSProperties } from "react";
import { SPONSOR_SLOTS, EVENT } from "@/data/hackathon";
import {
  RevealHeading,
  RevealBlock,
  ParallaxY,
  RuleDraw,
} from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";
import SponsorRevealCard from "@/components/ui/SponsorRevealCard";
import SponsorVeil from "@/components/ui/SponsorVeil";

/**
 * SPONSOR WALL — a broken mosaic on six columns.
 *
 * Cells are placed by hand at mixed spans and aspects, and several grid
 * positions are left deliberately empty. The holes are the point: a full
 * eight-up rectangle looks like a table, while a wall with air in it looks
 * composed — and it degrades gracefully, since the first sponsors to sign land
 * in the big cells and the gaps read as intent rather than absence.
 *
 * Note: the older Sponsors.tsx / /sponsors route with the tier table is still
 * there and untouched — this is the home-page wall.
 */
const CELLS = [
  { c: "1 / 3", r: "1 / 2", ratio: "16 / 9", drift: 54 },
  { c: "3 / 4", r: "1 / 2", ratio: "1 / 1", drift: -40 },
  { c: "5 / 7", r: "1 / 2", ratio: "16 / 9", drift: 64 },
  { c: "2 / 3", r: "2 / 3", ratio: "1 / 1", drift: -46 },
  { c: "3 / 5", r: "2 / 3", ratio: "16 / 9", drift: 50 },
  { c: "6 / 7", r: "2 / 3", ratio: "1 / 1", drift: -34 },
  { c: "1 / 3", r: "3 / 4", ratio: "16 / 9", drift: 58 },
  { c: "4 / 6", r: "3 / 4", ratio: "16 / 9", drift: -44 },
] as const;

export default function SponsorWall() {
  const sealed = SPONSOR_SLOTS.every((slot) => !slot.src);

  return (
    <section id="sponsors" className="sp" aria-label="Sponsors">
      <div className="sp-inner">
        <div className="sp-head">
          <RevealHeading className="sp-heading" lines={["Sponsors."]} />

          <RevealBlock className="sp-note" y={16} delay={0.18}>
            <p>
              {sealed
                ? "The backers are lined up. Names stay sealed until the reveal."
                : "Logos land here as they sign."}
            </p>
            <a href={`mailto:${EVENT.email}`} className="sp-link">
              back this one
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </RevealBlock>
        </div>

        <RuleDraw className="sp-rule" />

        <div className="sp-wall-wrap" data-sealed={sealed ? "true" : "false"}>
          <div className="sp-wall">
            {SPONSOR_SLOTS.map((slot, i) => {
              const cell = CELLS[i % CELLS.length];

              return (
                <ParallaxY
                  key={slot.expect}
                  className="sp-cell"
                  distance={cell.drift}
                  style={{ "--c": cell.c, "--r": cell.r } as CSSProperties}
                >
                  {slot.src ? (
                    <MediaSlot
                      slot={slot}
                      ratio={cell.ratio}
                      fit="contain"
                      sizes="(max-width: 780px) 50vw, 33vw"
                    />
                  ) : (
                    <SponsorRevealCard ratio={cell.ratio} index={i} />
                  )}
                </ParallaxY>
              );
            })}
          </div>

          {sealed && <SponsorVeil />}
        </div>
      </div>

      <style>{`
        .sp {
          position: relative;
          width: 100%;
          background: var(--color-bg-alt);
          color: #111a12;
          padding-block: clamp(6rem, 14vh, 11rem);
          overflow: hidden;
        }

        .sp-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .sp-head {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: clamp(1rem, 2.4vw, 2rem);
          align-items: end;
        }

        .sp-heading {
          grid-column: 1 / 8;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 7.4vw, 6rem);
          line-height: 0.92;
          letter-spacing: -0.024em;
          text-transform: uppercase;
        }

        .sp-note {
          grid-column: 9 / 13;
          padding-bottom: 0.7rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .sp-note p {
          margin: 0;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(0.98rem, 1.5vw, 1.2rem);
          font-weight: 380;
          line-height: 1.45;
          letter-spacing: -0.02em;
          color: var(--color-text-secondary);
        }
        .sp-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.82rem;
          color: var(--color-accent-deep);
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(47, 85, 39, 0.35);
          transition: gap 300ms var(--ease-out), color 300ms ease;
        }
        .sp-link svg { width: 0.85rem; height: 0.85rem; }
        .sp-link:hover { gap: 0.75rem; color: var(--color-accent); }

        .sp-rule {
          margin-top: clamp(1.75rem, 4vh, 3rem);
          background: rgba(47, 85, 39, 0.26);
        }

        .sp-wall-wrap {
          position: relative;
          margin-top: clamp(2.5rem, 6vh, 4.5rem);
        }

        .sp-wall {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          column-gap: clamp(0.9rem, 2vw, 1.6rem);
          row-gap: clamp(1.5rem, 4vw, 3rem);
          align-items: start;
        }

        /* Racked out of focus, the same way the intro blurs its content — the
           blur is on the cards themselves, so there's no blurred-rectangle
           edge. Nothing under it responds to hover. */
        .sp-wall-wrap[data-sealed="true"] .sp-wall {
          filter: blur(6px) saturate(0.9) brightness(1.01);
          opacity: 0.9;
        }
        .sp-wall-wrap[data-sealed="true"] .sp-cell { pointer-events: none; }

        .sp-cell {
          grid-column: var(--c);
          grid-row: var(--r);
        }

        @media (max-width: 780px) {
          .sp-heading, .sp-note { grid-column: 1 / -1; }
          .sp-note { padding-top: 1.1rem; padding-bottom: 0; }
          .sp-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          /* Drop the hand placement entirely — at two columns the holes stop
             reading as composition and just look like missing logos. */
          .sp-cell { grid-column: auto; grid-row: auto; }
          .sp-cell .ms { aspect-ratio: 16 / 9 !important; }
        }
      `}</style>
    </section>
  );
}
