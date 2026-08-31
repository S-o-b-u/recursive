"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
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
import Ornament from "@/components/ui/Ornament";

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
        {/* ── Centered Header ── */}
        <div className="sp-head-wrap">
          <RevealBlock y={10}>
            <span className="sp-eyebrow">006 · SUPPORTERS & PARTNERS</span>
          </RevealBlock>

          {/* ── Top Botanical Ornament ── */}
          <RevealBlock y={14}>
            <div className="sp-ornament-wrap">
              <Ornament tone="night" className="sp-motif" />
            </div>
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
              <button
                type="button"
                className="sp-link"
                aria-label="Partner with this edition - Currently Locked"
                disabled
              >
                <span className="sp-link-text-slot">
                  <span className="sp-link-text-default">Partner with this edition</span>
                  <span className="sp-link-text-hover">Locked · Revealing Soon</span>
                </span>
                <span className="sp-link-icon-slot" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="sp-arrow">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sp-lock-icon">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              </button>
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
          color: #EEF5E6;
          padding-block: clamp(3.25rem, 7.5vh, 6rem);
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
          margin-top: clamp(0.6rem, 1.4vh, 1rem);
          margin-bottom: clamp(1.2rem, 2.4vh, 1.8rem);
        }

        .sp-motif {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          color: #7FB84E;
          opacity: 0.62;
        }

        .sp-head-wrap {
          width: 100%;
          text-align: center;
        }

        .sp-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.76rem, 0.95vw, 0.88rem);
          font-weight: 500;
          letter-spacing: 0.22em;
          color: #8FC45A;
          text-transform: uppercase;
          display: inline-block;
        }

        .sp-heading {
          margin-top: 0.7rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.4rem, 5.2vw, 4rem);
          line-height: 1.15;
          letter-spacing: -0.028em;
          color: #F1F7E9;
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
          color: rgba(222, 235, 212, 0.6);
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
          padding: 0;
          padding-bottom: 2px;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(143, 196, 90, 0.34);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #B8DE8C;
          cursor: not-allowed;
          user-select: none;
          transition: gap 220ms ease, color 220ms ease, border-color 220ms ease;
        }

        .sp-link-text-slot {
          display: inline-grid;
          grid-template-areas: "text";
          align-items: center;
        }

        .sp-link-text-default {
          grid-area: text;
          display: inline-block;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .sp-link-text-hover {
          grid-area: text;
          display: inline-block;
          opacity: 0;
          transform: translateY(4px);
          color: #FFDE7A;
          white-space: nowrap;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .sp-link-icon-slot {
          display: inline-grid;
          place-items: center;
          width: 0.95rem;
          height: 0.95rem;
          flex-shrink: 0;
        }

        .sp-arrow {
          grid-area: 1 / 1;
          width: 0.88rem;
          height: 0.88rem;
          opacity: 1;
          transform: scale(1);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .sp-lock-icon {
          grid-area: 1 / 1;
          width: 0.88rem;
          height: 0.88rem;
          color: #FFDE7A;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .sp-link:hover {
          color: #FFDE7A;
          border-color: rgba(255, 222, 122, 0.6);
        }

        .sp-link:hover .sp-link-text-default {
          opacity: 0;
          transform: translateY(-4px);
        }

        .sp-link:hover .sp-link-text-hover {
          opacity: 1;
          transform: translateY(0);
        }

        .sp-link:hover .sp-arrow {
          opacity: 0;
          transform: scale(0.7);
        }

        .sp-link:hover .sp-lock-icon {
          opacity: 1;
          transform: scale(1);
        }

        .sp-rule {
          width: 100%;
          max-width: 72rem;
          margin-top: clamp(2rem, 4vh, 3.25rem);
          background: rgba(190, 224, 168, 0.16);
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

        /* ── Night re-ink ──
           SponsorRevealCard and SponsorVeil were drawn for the sage sections
           above the valley: cream plates, pine ink. Below the valley that is a
           field of bright rectangles on black. Re-inking them here, scoped to
           .sp, keeps both components working unchanged on the light pages. */
        .sp .spc {
          background:
            radial-gradient(120% 78% at 50% 4%, rgba(92, 140, 58, 0.24) 0%, rgba(92, 140, 58, 0) 54%),
            linear-gradient(170deg, #16240F 0%, #080F06 100%);
          box-shadow:
            inset 0 1px 0 rgba(214, 240, 190, 0.14),
            inset 0 0 0 1px rgba(190, 224, 168, 0.14),
            0 18px 40px -24px rgba(0, 0, 0, 0.9);
        }
        .sp .spc::after {
          box-shadow:
            0 0 0 1px rgba(190, 224, 168, 0.16),
            inset 0 1px 0 rgba(214, 240, 190, 0.08);
        }
        .sp .spc-plate {
          background:
            radial-gradient(85% 62% at 50% 26%, rgba(143, 196, 90, 0.15), rgba(143, 196, 90, 0) 72%),
            radial-gradient(130% 120% at 50% 122%, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0) 58%);
        }
        /* CSS wins over the stop-color presentation attribute in the SVG. */
        .sp .spc-figure stop:first-child { stop-color: rgba(143, 196, 90, 0.36); }
        .sp .spc-figure stop:last-child  { stop-color: rgba(143, 196, 90, 0.08); }
        .sp .spc-veil {
          background: linear-gradient(180deg, rgba(8, 16, 6, 0.08) 0%, rgba(5, 11, 4, 0.5) 100%);
        }
        .sp .spc-q text { fill: rgba(200, 232, 172, 0.32); }
        .sp .spc-sprig { color: #8FC45A; opacity: 0.5; }
        .sp .spc-grain { opacity: 0.34; }

        .sp .sp-veil-tint {
          background: radial-gradient(70% 62% at 50% 48%,
            rgba(4, 10, 3, 0.5) 0%,
            rgba(4, 10, 3, 0.28) 46%,
            rgba(4, 10, 3, 0) 82%);
        }
        .sp .sp-veil-word span {
          color: #DDF0BF;
          -webkit-text-stroke: 1px rgba(221, 240, 191, 0.85);
          text-shadow:
            0 2px 0 rgba(0, 0, 0, 0.45),
            0 0 26px rgba(24, 46, 16, 0.9),
            0 0 60px rgba(10, 24, 6, 0.85);
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
