"use client";

import React from "react";
import Image from "next/image";
import { RevealBlock, RevealHeading } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import { COLLEGE } from "@/data/hackathon";

const SUBLOGOS = [
  {
    src: "/college_logo/jis.png",
    alt: "JIS Group",
    name: "JIS Group",
    tier: "Educational Partner",
    width: 115,
    height: 38,
  },
  {
    src: "/college_logo/aicte.png",
    alt: "AICTE Approved",
    name: "AICTE Approved",
    tier: "Statutory Body",
    width: 50,
    height: 38,
  },
  {
    src: "/college_logo/naac.png",
    alt: "NAAC Accredited",
    name: "NAAC Accredited",
    tier: "Institutional Quality",
    width: 50,
    height: 38,
  },
  {
    src: "/college_logo/nba.png",
    alt: "NBA Accredited",
    name: "NBA Accredited",
    tier: "Technical Tier-1",
    width: 50,
    height: 38,
  },
];

const STORY =
  "The chapter brings together developers, designers, and builders from across Kolkata for eight hours of focused work and honest software craft. Rooted in student-led technical exploration, we provide the mentorship, infrastructure, and community for ideas to take shape.";

export default function ACM() {
  return (
    <section id="acm" className="acm-section" aria-label="Organizers of Recursive">
      <div className="acm-container">
        {/* ── Section Header ── */}
        <div className="acm-header">
          <RevealBlock y={12}>
            <div className="acm-ornament-wrap">
              <Ornament className="acm-ornament" />
            </div>
          </RevealBlock>

          <RevealBlock y={14} delay={0.04}>
            <div className="acm-tag-wrap">
              <span className="acm-tag">ORGANIZERS &amp; INSTITUTION</span>
            </div>
          </RevealBlock>

          <div className="acm-title-wrap">
            <RevealHeading
              className="acm-title"
              lines={["The Builders Behind The Event"]}
            />
          </div>
        </div>

        {/* ── Main Exhibition Plaque (Frame 3) ── */}
        <RevealBlock y={20} delay={0.08} className="w-full flex justify-center mt-16 sm:mt-20 lg:mt-24">
          <div className="acm-plaque">
            
            {/* ── Top Row: Frame 4 (Emblem Card) + Editorial Narrative ── */}
            <div className="acm-top-grid">
              
              {/* Frame 4: Host Chapter Emblem Showcase */}
              <div className="acm-emblem-bay">
                <div className="acm-emblem-sheen" />
                <span className="acm-emblem-grain" aria-hidden="true" />
                <span className="acm-emblem-keyline" aria-hidden="true" />
                <span className="acm-emblem-ticks" aria-hidden="true" />
                <div className="acm-emblem-header">
                  <span className="acm-badge-primary">PRIMARY HOST</span>
                  <span className="acm-badge-ghost">STUDENT CHAPTER</span>
                </div>

                <div className="acm-logo-stage">
                  <Image
                    src="/college_logo/gnitacm.png"
                    alt="GNIT ACM Student Chapter"
                    width={360}
                    height={110}
                    className="acm-logo-image"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                </div>

                <div className="acm-emblem-footer">
                  <span className="acm-badge-sub">{COLLEGE.collegeShort} Kolkata</span>
                  <span className="acm-badge-sub-muted">Est. 2026</span>
                </div>
              </div>

              {/* Right: Editorial Narrative Content */}
              <div className="acm-narrative-bay">
                <div className="acm-meta-pill-row">
                  <span className="acm-academic-pill">
                    Academic Host
                  </span>
                  <span className="acm-dept-name">{COLLEGE.collaboration}</span>
                </div>

                <h3 className="acm-chapter-heading">
                  GNIT ACM Student Chapter
                </h3>

                <p className="acm-institution-lead">
                  In collaboration with the{" "}
                  <span className="acm-strong-lead">{COLLEGE.collaboration}</span>
                  , {COLLEGE.college}.
                </p>

                <p className="acm-body-story">
                  {STORY}
                </p>

                <div className="acm-chips-strip">
                  <div className="acm-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{COLLEGE.city}</span>
                  </div>
                  <div className="acm-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>October 08, 2026</span>
                  </div>
                  <div className="acm-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>8-Hour Hackathon</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Hairline Divider with Centered Diamond Accent ── */}
            <div className="acm-divider-wrap" aria-hidden="true">
              <span className="acm-divider-line" />
              <span className="acm-divider-node">✦</span>
              <span className="acm-divider-line" />
            </div>

            {/* ── Bottom Row: 4 Accreditation Ribbon Bays (Frames 5, 6, 7, 8) ── */}
            <div className="acm-accreditations-ribbon">
              {SUBLOGOS.map((sub) => (
                <div key={sub.src} className="acm-bay-cell group">
                  <div className="acm-bay-logo-wrap">
                    <Image
                      src={sub.src}
                      alt={sub.alt}
                      width={sub.width}
                      height={sub.height}
                      className="acm-bay-logo"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div className="acm-bay-text-wrap">
                    <span className="acm-bay-name">{sub.name}</span>
                    <span className="acm-bay-tier">{sub.tier}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </RevealBlock>
      </div>

      <style>{`
        /* ─────────────────────────────────────────
           Section Base & Atmosphere
        ───────────────────────────────────────── */
        .acm-section {
          position: relative;
          width: 100%;
          color: #111a12;
          padding-top: clamp(4.5rem, 9vh, 7rem);
          padding-bottom: clamp(0.2rem, 1vh, 0.6rem);
          overflow: hidden;
          z-index: 1;
          background: transparent;
        }

        .acm-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 94rem;
          margin-inline: auto;
          padding-inline: clamp(1.2rem, 3.5vw, 3rem);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Header ── */
        .acm-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 54rem;
          margin-inline: auto;
          margin-bottom: clamp(3rem, 6vh, 5rem);
        }

        .acm-ornament-wrap {
          margin-bottom: 0.85rem;
          display: flex;
          justify-content: center;
        }

        .acm-ornament {
          width: clamp(96px, 45.52px + 14.022vw, 225px);
          height: auto;
          color: #2F5527;
          opacity: 0.94;
        }

        .acm-tag-wrap {
          margin-bottom: 0.75rem;
        }

        .acm-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 1vw, 0.85rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3D6B22;
        }

        .acm-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.519rem, 11.27px + 3.62vw, 3.6rem);
          font-weight: 500;
          letter-spacing: -0.028em;
          line-height: 1.08;
          color: #111a12;
          text-wrap: balance;
        }

        /* ─────────────────────────────────────────
           Main Exhibition Plaque (Frame 3) - Expansive Glass
        ───────────────────────────────────────── */
        .acm-plaque {
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.2) 48%, rgba(236, 247, 232, 0.38) 100%);
          backdrop-filter: blur(32px) saturate(190%);
          -webkit-backdrop-filter: blur(32px) saturate(190%);
          border-radius: clamp(28px, 4vw, 42px);
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-top: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 32px 80px -20px rgba(22, 45, 26, 0.09),
            0 4px 24px rgba(22, 45, 26, 0.02),
            inset 0 1px 2px rgba(255, 255, 255, 0.95),
            inset 0 -1px 2px rgba(92, 140, 58, 0.05);
          padding: clamp(1.438rem, 5.7px + 4.804vw, 4.2rem);
          isolation: isolate;
        }

        /* ─────────────────────────────────────────
           Top Grid: Frame 4 + Editorial Narrative
        ───────────────────────────────────────── */
        .acm-top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1.319rem, 5.57px + 4.315vw, 3.8rem);
          align-items: center;
        }

        @media (min-width: 980px) {
          .acm-top-grid {
            grid-template-columns: minmax(360px, 440px) 1fr;
          }
        }

        /* Frame 4: Host Emblem Showcase Card - Crystalline Glass */
        /* ── The host plate ──
           It was a plain rounded glass rectangle: the same radius, weight and
           surface as the four accreditation tiles under it, which is what made
           the block read as generated rather than made. It is now a mounted
           plate in the language the rest of the page already speaks — the
           double keyline from JudgeRevealCard, the corner ticks from the track
           plate, and the paper grain used across the sealed cards. A tighter
           radius and a warmer paper tone separate it from the tiles below. */
        .acm-emblem-bay {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(128% 84% at 50% -6%, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0) 58%),
            linear-gradient(158deg, rgba(252, 253, 250, 0.78) 0%, rgba(238, 244, 233, 0.42) 100%);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 22px 48px -18px rgba(20, 36, 22, 0.16),
            0 2px 6px -2px rgba(20, 36, 22, 0.06),
            inset 0 1px 2px rgba(255, 255, 255, 0.98),
            inset 0 0 0 1px rgba(47, 85, 39, 0.07);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 255px;
          transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms ease, background 300ms ease, border-color 300ms ease;
          overflow: hidden;
        }

        .acm-emblem-bay:hover {
          transform: translateY(-3px);
          background: linear-gradient(150deg, rgba(255, 255, 255, 0.75) 0%, rgba(244, 248, 241, 0.45) 100%);
          border-color: rgba(92, 140, 58, 0.35);
          box-shadow:
            0 20px 48px -6px rgba(20, 36, 22, 0.12),
            inset 0 1px 2px rgba(255, 255, 255, 1);
        }

        .acm-emblem-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          /* Was a blanket wash over the whole face, which flattened it. A
             raking highlight off one corner leaves the plate some depth. */
          background: linear-gradient(132deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.08) 34%, transparent 62%);
        }

        /* The engraved inner rule — the edge of a mounted print. */
        .acm-emblem-keyline {
          position: absolute;
          inset: 10px;
          border-radius: 11px;
          pointer-events: none;
          z-index: 2;
          box-shadow:
            0 0 0 1px rgba(47, 85, 39, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        /* Corner ticks, same trick as the track plate: keep the keyline only
           where the corners are, so it reads as registration marks. */
        .acm-emblem-ticks {
          position: absolute;
          inset: 10px;
          border-radius: 11px;
          pointer-events: none;
          z-index: 3;
          box-shadow: inset 0 0 0 1.5px rgba(47, 85, 39, 0.42);
          -webkit-mask:
            linear-gradient(#000 0 0) top left / 18px 18px no-repeat,
            linear-gradient(#000 0 0) top right / 18px 18px no-repeat,
            linear-gradient(#000 0 0) bottom left / 18px 18px no-repeat,
            linear-gradient(#000 0 0) bottom right / 18px 18px no-repeat;
          mask:
            linear-gradient(#000 0 0) top left / 18px 18px no-repeat,
            linear-gradient(#000 0 0) top right / 18px 18px no-repeat,
            linear-gradient(#000 0 0) bottom left / 18px 18px no-repeat,
            linear-gradient(#000 0 0) bottom right / 18px 18px no-repeat;
        }

        .acm-emblem-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.38;
          mix-blend-mode: soft-light;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .acm-emblem-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .acm-badge-primary,
        .acm-badge-ghost {
          white-space: nowrap;
        }

        /* Two nowrap chips will not sit side by side inside the plate at phone
           widths — they were wrapping into each other. Below this the ghost
           label drops and the plate keeps the one that carries meaning. */
        @media (max-width: 560px) {
          .acm-emblem-bay { padding: 1.4rem 1.15rem; }
          .acm-badge-ghost { display: none; }
          .acm-emblem-header { justify-content: flex-start; }
          .acm-badge-primary { font-size: 0.62rem; letter-spacing: 0.14em; }
          .acm-badge-sub,
          .acm-badge-sub-muted { font-size: 0.66rem; }
        }

        .acm-badge-primary {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2F5527;
          background: rgba(92, 140, 58, 0.15);
          border: 1px solid rgba(92, 140, 58, 0.25);
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
        }

        .acm-badge-ghost {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.6875rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(22, 36, 26, 0.5);
          font-weight: 600;
        }

        .acm-logo-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 0.5rem;
          position: relative;
          z-index: 1;
        }

        .acm-logo-image {
          width: 100%;
          height: auto;
          max-height: 105px;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
          transition: transform 250ms ease;
        }

        .acm-emblem-bay:hover .acm-logo-image {
          transform: scale(1.03);
        }

        .acm-emblem-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(22, 36, 26, 0.06);
        }

        .acm-badge-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: #16241A;
          letter-spacing: 0.04em;
        }

        .acm-badge-sub-muted {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.78rem;
          color: rgba(22, 36, 26, 0.55);
        }

        /* ── Narrative Bay ── */
        .acm-narrative-bay {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .acm-meta-pill-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.65rem;
        }

        .acm-academic-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #2F5527;
          background: rgba(47, 85, 39, 0.08);
          border: 1px solid rgba(47, 85, 39, 0.16);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }

        .acm-dept-name {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(22, 36, 26, 0.65);
        }

        .acm-chapter-heading {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.363rem, 14.99px + 1.891vw, 2.45rem);
          font-weight: 600;
          line-height: 1.16;
          letter-spacing: -0.025em;
          color: #111a12;
          margin-top: 0.65rem;
          margin-bottom: 0.4rem;
        }

        .acm-institution-lead {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.25vw, 1.08rem);
          line-height: 1.55;
          color: rgba(22, 36, 26, 0.74);
          margin-bottom: 0.75rem;
        }

        .acm-strong-lead {
          font-weight: 600;
          color: #16241A;
        }

        .acm-body-story {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.25vw, 1.08rem);
          line-height: 1.72;
          color: rgba(22, 36, 26, 0.82);
          max-width: 52rem;
          text-wrap: pretty;
        }

        .acm-chips-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-top: 1.25rem;
        }

        .acm-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(22, 36, 26, 0.74);
          background: rgba(255, 255, 255, 0.52);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.75);
          padding: 0.38rem 0.9rem;
          border-radius: 9999px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        /* ── Hairline Divider ── */
        .acm-divider-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          width: 100%;
          margin: clamp(1.8rem, 3.8vh, 2.8rem) 0 clamp(1.6rem, 3vh, 2.2rem);
        }

        .acm-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(22, 36, 26, 0.12) 20%, rgba(22, 36, 26, 0.12) 80%, transparent);
        }

        .acm-divider-node {
          font-size: 0.85rem;
          color: #3D6B22;
          opacity: 0.65;
        }

        /* ─────────────────────────────────────────
           Bottom Row: 4 Accreditation Ribbon Bays
        ───────────────────────────────────────── */
        .acm-accreditations-ribbon {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
          width: 100%;
        }

        @media (min-width: 720px) {
          .acm-accreditations-ribbon {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* Quieter than the host plate on purpose. Four tiles carrying the same
           radius, border and shadow as the plate above turned the block into
           five equal cards with no hierarchy — the thing that reads as
           generated. These are now marks on a shared rail: hairline separators
           instead of full borders, no drop shadow, and the surface only
           resolves into a card on hover. */
        .acm-bay-cell {
          position: relative;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.1) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 12px;
          border: 1px solid rgba(47, 85, 39, 0.1);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
          padding: 1.3rem 1.1rem;
          min-height: 130px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 260ms ease, border-color 260ms ease, background 260ms ease;
          overflow: hidden;
        }

        .acm-bay-cell:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(92, 140, 58, 0.3);
          box-shadow:
            0 14px 30px -8px rgba(22, 45, 26, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .acm-bay-logo-wrap {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.35rem;
        }

        .acm-bay-logo {
          width: auto;
          height: 100%;
          max-height: 46px;
          object-fit: contain;
          opacity: 0.92;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .acm-bay-cell:hover .acm-bay-logo {
          opacity: 1;
          transform: scale(1.06);
        }

        .acm-bay-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          margin-top: 0.5rem;
        }

        .acm-bay-name {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          color: #142617;
          letter-spacing: -0.01em;
          text-align: center;
        }

        .acm-bay-tier {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(22, 36, 26, 0.5);
          text-align: center;
        }
      `}</style>
    </section>
  );
}
