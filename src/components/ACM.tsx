"use client";

import Image from "next/image";
import { COLLEGE } from "@/data/hackathon";
import { RevealWords, RevealHeading, RevealBlock } from "@/components/ui/reveal";

/**
 * Botanical Divider Motif — central petal sprout with vertical dot trail.
 */
function BotanicalSprout({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M70 12C68 22 62 28 52 32C62 34 67 40 70 50C73 40 78 34 88 32C78 28 72 22 70 12Z"
        fill="currentColor"
      />
      <path
        d="M50 33C38 34 26 28 20 22C24 32 34 40 46 41C48 38 49 35 50 33Z"
        fill="currentColor"
      />
      <path
        d="M90 33C102 34 114 28 120 22C116 32 106 40 94 41C92 38 91 35 90 33Z"
        fill="currentColor"
      />
      <circle cx="70" cy="4" r="1.5" fill="currentColor" />
      <circle cx="70" cy="8" r="1" fill="currentColor" />
      <circle cx="70" cy="58" r="1.5" fill="currentColor" />
      <circle cx="70" cy="64" r="1.5" fill="currentColor" />
    </svg>
  );
}

const SUBLOGOS = [
  { src: "/college_logo/jis.png", alt: "JIS Group", width: 95, height: 32 },
  { src: "/college_logo/aicte.png", alt: "AICTE Approved", width: 44, height: 32 },
  { src: "/college_logo/naac.png", alt: "NAAC Accredited", width: 44, height: 32 },
  { src: "/college_logo/nba.png", alt: "NBA Accredited", width: 44, height: 32 },
];

const STORY = [
  "Recursive is organized by the ACM Student Chapter of Guru Nanak Institute of Technology in collaboration with the Department of Information Technology. The chapter brings together developers, designers, and problem solvers across Kolkata for an eight-hour sprint of focused building and real software craft.",
];

export default function ACM() {
  return (
    <section id="acm" className="acm" aria-label="Organizers of Recursive">
      <div className="acm-inner">
        {/* ── Symmetrical Botanical Sprout ── */}
        <RevealBlock y={14}>
          <div className="acm-ornament-wrap">
            <BotanicalSprout className="acm-sprout" />
          </div>
        </RevealBlock>

        {/* ── Centered Heading ── */}
        <div className="acm-head-wrap">
          <RevealHeading
            className="acm-heading"
            lines={["The ACM Chapter"]}
          />
        </div>

        {/* ── Main Chapter Logo & Supporting Sublogos (No Backgrounds) ── */}
        <div className="acm-brand-stage">
          {/* Main Logo: GNIT ACM */}
          <RevealBlock y={16} delay={0.08}>
            <div className="acm-main-logo-wrap">
              <Image
                src="/college_logo/gnitacm.png"
                alt="GNIT ACM Student Chapter in collaboration with Department of IT"
                width={280}
                height={90}
                className="acm-main-logo-img"
                priority
              />
            </div>
          </RevealBlock>

          {/* Sublogos Row: JIS, AICTE, NAAC, NBA (Small & Clean) */}
          <RevealBlock y={12} delay={0.12}>
            <div className="acm-sublogos-row">
              {SUBLOGOS.map((sub) => (
                <div key={sub.src} className="acm-sublogo-item">
                  <Image
                    src={sub.src}
                    alt={sub.alt}
                    width={sub.width}
                    height={sub.height}
                    className="acm-sublogo-img"
                  />
                </div>
              ))}
            </div>
          </RevealBlock>
        </div>

        {/* ── Wide Single Story Paragraph ── */}
        <div className="acm-story-wrap">
          <RevealWords paragraphs={STORY} className="acm-story" />
        </div>

        {/* ── Centered Signoff ── */}
        <RevealBlock className="acm-signoff-block" y={16} delay={0.16}>
          <div className="acm-signoff">
            <span className="acm-signoff-line">See you on the hill.</span>
            <span className="acm-signoff-dot">·</span>
            <span className="acm-signoff-who">
              {COLLEGE.chapter} × {COLLEGE.collaboration}, {COLLEGE.collegeShort}
            </span>
          </div>
        </RevealBlock>
      </div>

      <style>{`
        .acm {
          position: relative;
          width: 100%;
          background: transparent;
          color: #111a12;
          padding-top: clamp(8.5rem, 19vh, 14rem);
          padding-bottom: clamp(6rem, 14vh, 10rem);
          overflow: hidden;
          z-index: 1;
        }

        .acm-inner {
          position: relative;
          max-width: 96rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .acm-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1.2rem, 2.2vh, 1.8rem);
        }

        .acm-sprout {
          width: clamp(100px, 13vw, 140px);
          height: auto;
          color: #2F5527;
          opacity: 0.85;
        }

        .acm-head-wrap {
          width: 100%;
          text-align: center;
        }

        .acm-heading {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.6rem, 5.8vw, 4.6rem);
          line-height: 1.12;
          letter-spacing: -0.028em;
          color: #111a12;
          text-align: center;
        }

        .acm-heading .rh-line {
          display: flex;
          justify-content: center;
        }

        /* ── Brand Stage Hierarchy (Main Logo + Sublogos) ── */
        .acm-brand-stage {
          width: 100%;
          margin-top: clamp(2rem, 4.5vh, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.1rem, 2.2vh, 1.6rem);
        }

        .acm-main-logo-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .acm-main-logo-img {
          width: auto;
          height: clamp(54px, 8.5vw, 76px);
          object-fit: contain;
          opacity: 0.95;
          transition: transform 220ms ease, opacity 220ms ease;
        }

        .acm-main-logo-img:hover {
          transform: scale(1.03);
          opacity: 1;
        }

        /* ── Sublogos Row (Small & Clean) ── */
        .acm-sublogos-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(1.2rem, 2.8vw, 2.4rem);
        }

        .acm-sublogo-item {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .acm-sublogo-img {
          width: auto;
          height: clamp(22px, 3.2vw, 30px);
          object-fit: contain;
          opacity: 0.72;
          filter: grayscale(20%);
          transition: opacity 220ms ease, transform 220ms ease, filter 220ms ease;
        }

        .acm-sublogo-img:hover {
          opacity: 0.95;
          filter: grayscale(0%);
          transform: scale(1.06);
        }

        /* ── Wide Single Story Paragraph ── */
        .acm-story-wrap {
          margin-top: clamp(2.75rem, 6vh, 4.5rem);
          width: 100%;
          max-width: 88rem;
        }

        .acm-story {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .acm-story .rw-para {
          margin: 0 auto;
          max-width: 86rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1.4rem, 2.45vw, 2.1rem);
          font-weight: 400;
          line-height: 1.76;
          letter-spacing: -0.012em;
          color: #18261A;
          text-align: center;
          text-wrap: balance;
        }

        /* ── Signoff ── */
        .acm-signoff-block {
          margin-top: clamp(3rem, 6vh, 4.5rem);
        }

        .acm-signoff {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.65rem 0.95rem;
          padding: 0.6rem 1.6rem;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(47, 85, 39, 0.18);
          box-shadow: 0 4px 16px rgba(22, 45, 26, 0.05);
        }

        .acm-signoff-line {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: 0.94rem;
          font-weight: 500;
          color: #111a12;
        }

        .acm-signoff-dot {
          color: #8FC45A;
        }

        .acm-signoff-who {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #4A5F48;
        }
      `}</style>
    </section>
  );
}
