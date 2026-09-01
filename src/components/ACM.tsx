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
    width: 65,
    height: 52,
  },
  {
    src: "/college_logo/aicte.png",
    alt: "AICTE Approved",
    name: "AICTE Approved",
    tier: "Statutory Body",
    width: 70,
    height: 52,
  },
  {
    src: "/college_logo/naac.png",
    alt: "NAAC Accredited",
    name: "NAAC Accredited",
    tier: "Institutional Quality",
    width: 70,
    height: 52,
  },
  {
    src: "/college_logo/IIC.png",
    alt: "Institution's Innovation Council",
    name: "Institution's Innovation Council",
    tier: "Ministry of Education Initiative",
    width: 130,
    height: 52,
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
            <span className="acm-host-name">GNIT ACM Student Chapter</span>
            <Image
              src="/college_logo/gnitacm.png"
              alt="GNIT ACM Student Chapter"
              width={360}
              height={110}
              className="acm-host-logo"
              style={{ width: "auto", height: "auto" }}
              priority
            />
            <a
              href="https://gnitkolkata.acm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="acm-chapter-link"
              aria-label="Visit GNIT ACM Student Chapter"
            >
              <span className="acm-link-text">Visit Chapter Website</span>
              <svg viewBox="0 0 24 24" className="acm-link-arrow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </RevealBlock>

        {/* ── The narrative. Illuminates word-by-word with scroll (matching The Story of the Chair) ── */}
        <div className="acm-story-wrap">
          <RevealWords
            paragraphs={STORY_PARAGRAPHS}
            className="acm-story-words"
            start="top 84%"
            end="bottom 38%"
            dim={0.18}
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
                      className={`acm-mark-logo ${sub.src.includes("IIC") ? "acm-mark-iic" : ""}`}
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
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.75rem, 12.35px + 3.87vw, 4rem);
          font-weight: 500;
          line-height: 1.06;
          letter-spacing: -0.035em;
          word-spacing: -0.01em;
          color: #16241A;
          text-wrap: balance;
        }

        /* ── Flourish between the title and the host mark ── */
        .acm-flourish {
          display: block;
          margin-top: clamp(1.6rem, 4vh, 3rem);
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
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
          width: clamp(210px, 110px + 25vw, 420px) !important;
          height: auto !important;
          object-fit: contain;
        }

        .acm-host-name {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.82rem, 0.7rem + 0.32vw, 1.02rem);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #244626;
        }

        .acm-chapter-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-top: 0.25rem;
          padding: 0.35rem 0.15rem 3px;
          min-height: 36px;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(47, 85, 39, 0.38);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.85rem, 1.1vw, 0.94rem);
          font-weight: 600;
          color: #2F5527;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 180ms ease, color 180ms ease, transform 180ms ease;
        }

        .acm-chapter-link:hover {
          color: #142e1c;
          border-bottom-color: #142e1c;
          transform: translateX(2px);
        }

        .acm-link-arrow {
          width: 15px;
          height: 15px;
          transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .acm-chapter-link:hover .acm-link-arrow {
          transform: translateX(3px);
        }

        /* ── Narrative (RevealWords with Scroll Scrub) ── */
        .acm-story-wrap {
          margin-top: clamp(2.2rem, 5vh, 3.8rem);
          width: 100%;
          max-width: clamp(46rem, 78vw, 64rem);
          margin-inline: auto;
        }

        .acm-story-words .rw-para {
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(1.12rem, 11px + 1.12vw, 1.62rem);
          font-weight: 400;
          line-height: 1.72;
          letter-spacing: -0.012em;
          color: #18261A;
          text-align: center;
          text-wrap: balance;
          max-width: 60rem;
          margin-inline: auto;
        }

        .acm-story-words .rw-para:first-child {
          font-weight: 600;
          color: #244626;
          font-size: clamp(1.22rem, 12px + 1.32vw, 1.8rem);
          line-height: 1.55;
          letter-spacing: -0.015em;
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
          height: clamp(52px, 34px + 4.2vw, 84px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .acm-mark-logo {
          max-height: 100%;
          width: auto !important;
          height: auto !important;
          max-width: clamp(105px, 58px + 12vw, 220px);
          object-fit: contain;
        }

        .acm-mark-iic {
          max-width: clamp(120px, 75px + 12vw, 230px) !important;
          transform: scale(1.12);
          transform-origin: center center;
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
