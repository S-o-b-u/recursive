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
 * Botanical Symmetrical Motif for Sponsors.
 */
function BotanicalMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M80 4C80 4 76 13 66 16C56 18 42 14 32 19C24 23 20 31 12 33C7 34 3 32 0 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 4C80 4 84 13 94 16C104 18 118 14 128 19C136 23 140 31 148 33C153 34 157 32 160 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 1C77 4 74 7 74 10C74 13 77 14.5 80 14.5C83 14.5 86 13 86 10C86 7 83 4 80 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="20" r="1.7" fill="currentColor" />
      <circle cx="80" cy="27" r="1.2" fill="currentColor" />
      <circle cx="80" cy="33" r="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * SPONSOR WALL — a broken mosaic on six columns.
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
        {/* ── Top Botanical Ornament ── */}
        <RevealBlock y={14}>
          <div className="sp-ornament-wrap">
            <BotanicalMotif className="sp-motif" />
          </div>
        </RevealBlock>

        {/* ── Centered Header ── */}
        <div className="sp-head-wrap">
          <RevealBlock y={10}>
            <span className="sp-eyebrow">006 · SUPPORTERS & PARTNERS</span>
          </RevealBlock>
          <RevealHeading
            className="sp-heading"
            lines={["Our Sponsors"]}
          />
          <RevealBlock y={12} delay={0.06}>
            <p className="sp-lede">
              {sealed
                ? "The backers are lined up. Organization names stay sealed until the official reveal."
                : "Organizations and platforms empowering the builders on the hill."}
            </p>
          </RevealBlock>
          <RevealBlock y={14} delay={0.1}>
            <div className="sp-cta-wrap">
              <a href={`mailto:${EVENT.email}`} className="sp-link">
                <span>Partner with this edition</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="sp-arrow">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </RevealBlock>
        </div>

        {/* ── Rule Divider ── */}
        <RuleDraw className="sp-rule" />

        {/* ── Mosaic Wall ── */}
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
          background: transparent;
          color: #111a12;
          padding-block: clamp(5.5rem, 13vh, 10rem);
          overflow: hidden;
          z-index: 1;
        }

        .sp-inner {
          position: relative;
          max-width: 82rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sp-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
        }

        .sp-motif {
          width: clamp(110px, 14vw, 150px);
          height: auto;
          color: #2F5527;
          opacity: 0.85;
        }

        .sp-head-wrap {
          width: 100%;
          text-align: center;
        }

        .sp-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          font-weight: 550;
          letter-spacing: 0.08em;
          color: #5C8C3A;
          text-transform: uppercase;
        }

        .sp-heading {
          margin-top: 0.5rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.4rem, 5.2vw, 4rem);
          line-height: 1.15;
          letter-spacing: -0.028em;
          color: #111a12;
          text-align: center;
        }

        .sp-heading .rh-line {
          display: flex;
          justify-content: center;
        }

        .sp-lede {
          margin: clamp(0.75rem, 1.8vh, 1.25rem) auto 0;
          max-width: 48rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1.02rem, 1.5vw, 1.2rem);
          font-weight: 400;
          line-height: 1.6;
          color: #334731;
        }

        .sp-cta-wrap {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
        }

        .sp-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #2F5527;
          padding-bottom: 2px;
          border-bottom: 1.5px solid rgba(47, 85, 39, 0.35);
          transition: gap 220ms ease, color 220ms ease, border-color 220ms ease;
        }

        .sp-arrow {
          width: 0.88rem;
          height: 0.88rem;
          transition: transform 220ms ease;
        }

        .sp-link:hover {
          color: #5C8C3A;
          border-color: #5C8C3A;
          gap: 0.7rem;
        }

        .sp-link:hover .sp-arrow {
          transform: translateX(2px);
        }

        .sp-rule {
          width: 100%;
          max-width: 72rem;
          margin-top: clamp(2rem, 4vh, 3.25rem);
          background: rgba(47, 85, 39, 0.18);
        }

        .sp-wall-wrap {
          position: relative;
          width: 100%;
          max-width: 78rem;
          margin-top: clamp(2.5rem, 5vh, 4rem);
        }

        .sp-wall {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          column-gap: clamp(0.9rem, 2vw, 1.6rem);
          row-gap: clamp(1.5rem, 4vw, 3rem);
          align-items: start;
        }

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
          .sp-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sp-cell { grid-column: auto; grid-row: auto; }
          .sp-cell .ms { aspect-ratio: 16 / 9 !important; }
        }
      `}</style>
    </section>
  );
}
