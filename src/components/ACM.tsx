"use client";

import React from "react";
import Image from "next/image";
import { RevealBlock, RevealHeading, RevealWords } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import { COLLEGE } from "@/data/hackathon";

/** The accreditation marks. These sit *below* the narrative, as a quiet
 *  footing under the story rather than as cards competing with it. */
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

const STORY_PARAGRAPHS = [
  `In collaboration with the ${COLLEGE.collaboration}, ${COLLEGE.college}.`,
  "The chapter brings together developers, designers, and builders from across Kolkata for eight hours of focused work and honest software craft. Rooted in student-led technical exploration, we provide the mentorship, infrastructure, and community for ideas to take shape.",
];

export default function ACM() {
  return (
    <section id="acm" className="acm-section" aria-label="Organizers of Recursive">
      <div className="acm-container">
        {/* ── Eyebrow + title, centred on the open page ── */}
        <RevealBlock y={12}>
          <span className="acm-tag">ORGANIZERS &amp; INSTITUTION</span>
        </RevealBlock>

        <div className="acm-title-wrap">
          <RevealHeading
            className="acm-title"
            lines={["The Builders Behind The Event"]}
          />
        </div>

        {/* ── Flourish, then the host mark on its own ── */}
        <RevealBlock y={14} delay={0.06}>
          <Ornament className="acm-flourish" />
        </RevealBlock>

        <RevealBlock y={16} delay={0.1}>
          <div className="acm-host">
            <Image
              src="/college_logo/gnitacm.png"
              alt="GNIT ACM Student Chapter"
              width={360}
              height={110}
              className="acm-host-logo"
              style={{ width: "auto", height: "auto" }}
              priority
            />
            <span className="acm-host-name">GNIT ACM Student Chapter</span>
          </div>
        </RevealBlock>

        {/* ── The narrative. Illuminates word-by-word with scroll (matching The Story of the Chair) ── */}
        <div className="acm-story-wrap">
          <RevealWords
            paragraphs={STORY_PARAGRAPHS}
            className="acm-story-words"
            start="top 80%"
            end="bottom 68%"
            dim={0.16}
          />
        </div>

        {/* ── Everything else the institution stands on ── */}
        <RevealBlock y={18} delay={0.18}>
          <div className="acm-marks">
            <span className="acm-marks-rule" aria-hidden="true" />
            <ul className="acm-marks-row">
              {SUBLOGOS.map((sub) => (
                <li key={sub.src} className="acm-mark">
                  <span className="acm-mark-plate">
                    <Image
                      src={sub.src}
                      alt={sub.alt}
                      width={sub.width}
                      height={sub.height}
                      className="acm-mark-logo"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </span>
                  <span className="acm-mark-name">{sub.name}</span>
                  <span className="acm-mark-tier">{sub.tier}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealBlock>

        {/* ── Where and when, kept to one quiet line ── */}
        <RevealBlock y={14} delay={0.22}>
          <div className="acm-facts">
            <span className="acm-fact">{COLLEGE.city}</span>
            <span className="acm-fact-dot" aria-hidden="true">
              ·
            </span>
            <span className="acm-fact">October 08, 2026</span>
            <span className="acm-fact-dot" aria-hidden="true">
              ·
            </span>
            <span className="acm-fact">8-Hour Hackathon</span>
          </div>
        </RevealBlock>
      </div>

      <style href="acm-style" precedence="default" suppressHydrationWarning>{`
        /* ─────────────────────────────────────────
           Section base. No panel, no card - the whole
           block sits directly on the page's sky.
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
          max-width: 72rem;
          margin-inline: auto;
          padding-inline: clamp(1.2rem, 3.5vw, 3rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* ── Eyebrow ── */
        .acm-tag {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.68rem, 1vw, 0.8rem);
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #5C8C3A;
          opacity: 0.9;
        }

        /* ── Title ── */
        .acm-title-wrap {
          margin-top: clamp(0.7rem, 1.6vh, 1.1rem);
          /* ch shrinks relative to the type as the heading grows, so a tight
             cap here wraps the line on wide screens while leaving it unwrapped
             on tablets. Give it the container and let balance do the work. */
          max-width: 100%;
        }

        .acm-title {
          font-family: var(--font-heading), var(--font-display), Georgia, serif;
          font-size: clamp(1.75rem, 12.35px + 3.87vw, 4rem);
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -0.02em;
          color: #16241A;
          text-wrap: balance;
        }

        /* ── Flourish between the title and the host mark ── */
        .acm-flourish {
          display: block;
          margin-top: clamp(1.6rem, 4vh, 3rem);
          width: clamp(112px, 55.65px + 15.652vw, 256px);
          height: auto;
          color: #2F5527;
          opacity: 0.72;
        }

        /* ── The host chapter, standing alone ── */
        .acm-host {
          margin-top: clamp(1.4rem, 3.5vh, 2.6rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.7rem, 1.6vh, 1.05rem);
        }

        .acm-host-logo {
          width: clamp(168px, 87.65px + 22.32vw, 374px) !important;
          height: auto !important;
          object-fit: contain;
        }

        .acm-host-name {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.66rem, 0.6px + 0.196vw, 0.78rem);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4A6146;
        }

        /* ── Narrative (RevealWords with Scroll Scrub) ── */
        .acm-story-wrap {
          margin-top: clamp(2rem, 4.8vh, 3.5rem);
          max-width: 58ch;
          margin-inline: auto;
        }

        .acm-story-words .rw-para {
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(1.05rem, 13.07px + 0.815vw, 1.3rem);
          font-weight: 400;
          line-height: 1.68;
          letter-spacing: -0.01em;
          color: #1B2C1E;
          text-align: center;
          text-wrap: pretty;
        }

        .acm-story-words .rw-para:first-child {
          font-weight: 600;
          color: #2F5527;
          font-size: clamp(1.12rem, 14px + 0.9vw, 1.4rem);
        }

        /* ── Accreditation marks, below the story ── */
        .acm-marks {
          margin-top: clamp(2.4rem, 5.5vh, 4rem);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .acm-marks-rule {
          width: clamp(120px, 60.87px + 16.43vw, 272px);
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(47, 85, 39, 0) 0%,
            rgba(47, 85, 39, 0.28) 50%,
            rgba(47, 85, 39, 0) 100%
          );
        }

        .acm-marks-row {
          margin: clamp(1.6rem, 3.6vh, 2.6rem) 0 0;
          padding: 0;
          list-style: none;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          gap: clamp(1.6rem, 6.87px + 3.26vw, 4rem);
        }

        .acm-mark {
          flex: 0 1 auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }

        .acm-mark-plate {
          height: clamp(38px, 26.26px + 3.26vw, 68px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .acm-mark-logo {
          max-height: 100%;
          width: auto !important;
          height: auto !important;
          max-width: clamp(84px, 45.13px + 10.8vw, 184px);
          object-fit: contain;
        }

        .acm-mark-name {
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(0.78rem, 11.13px + 0.24vw, 0.9rem);
          font-weight: 600;
          line-height: 1.25;
          color: #1B2C1E;
        }

        .acm-mark-tier {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.62rem, 9.13px + 0.13vw, 0.7rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6C7F68;
        }

        /* ── One quiet line of facts to close ── */
        .acm-facts {
          margin-top: clamp(2rem, 4.5vh, 3.2rem);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.68rem, 9.7px + 0.196vw, 0.8rem);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5F7259;
        }

        .acm-fact-dot {
          color: #9BAF95;
        }

        /* ─────────────────────────────────────────
           Narrow screens: the row of marks becomes a
           two-up grid so the logos keep their size
           instead of shrinking into stamps.
        ───────────────────────────────────────── */
        @media (max-width: 600px) {
          .acm-title-wrap {
            max-width: 18ch;
          }

          .acm-story {
            max-width: 40ch;
          }

          .acm-marks-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(1.5rem, 5vw, 2.2rem);
            max-width: 26rem;
            margin-inline: auto;
          }
        }

        @media (max-width: 360px) {
          .acm-marks-row {
            grid-template-columns: minmax(0, 1fr);
            max-width: 15rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .acm-story-body {
            -webkit-mask-image: none;
            mask-image: none;
          }
        }
      `}</style>
    </section>
  );
}
