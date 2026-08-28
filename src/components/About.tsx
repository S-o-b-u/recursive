"use client";

import Image from "next/image";
import { EVENT } from "@/data/hackathon";
import { RevealWords, RevealHeading, RevealBlock } from "@/components/ui/reveal";
import Atmosphere from "@/components/ui/Atmosphere";

/**
 * THE CHAIR — answers the question the hero deliberately provokes.
 *
 * Short lines, wide measure: three sentences a person will actually read,
 * set big enough that they land like signage rather than a blog post.
 * No pinning — the section scrolls at normal speed and the prose illuminates.
 */

const STORY = [
  "There is a plastic chair on a hill. The same chair as every terrace and every roadside tea shop in this city.",
  "Four of them up there. A team is one to four people, so the chairs are the seats. Three fill with people you know. Nobody is holding the fourth one.",
  "The hill is thirty-six hours that will not compile. You climb it anyway, and at the top there is a thing that works and did not exist on Friday.",
];

export default function About() {
  return (
    <section id="about" className="ab" aria-label="About the chair">
      {/* Living air — faint spores drifting over the forest dark. */}
      <Atmosphere zIndex={-1} seed={11} count={16} opacity={0.8} />

      {/* ── Dual Mossy Tree Branch Seam with Center Moss Seal ── */}
      <div className="ab-seam-branch" aria-hidden="true">
        <div className="ab-seam-branch-track">
          <Image
            src="/images/other/gacher er dal.png"
            alt=""
            width={1400}
            height={380}
            className="ab-branch-seg ab-branch-left"
            priority
          />
          {/* Center moss backing to seal the hollow arch completely */}
          <div className="ab-branch-center-moss">
            <Image
              src="/images/other/gacher er dal.png"
              alt=""
              width={1000}
              height={280}
              className="ab-branch-center-img"
              priority
            />
          </div>
          <Image
            src="/images/other/gacher er dal.png"
            alt=""
            width={1400}
            height={380}
            className="ab-branch-seg ab-branch-right"
            priority
          />
        </div>
      </div>

      <div className="ab-bg-gradient" aria-hidden="true" />
      <div className="ab-spill" aria-hidden="true" />

      <div className="ab-inner">
        <RevealHeading
          className="ab-heading"
          lines={["The chair is", "the whole point."]}
        />

        <RevealWords paragraphs={STORY} className="ab-story" />

        <RevealBlock className="ab-meta" y={18}>
          <span>{EVENT.teamSize}</span>
          <span>{EVENT.duration}</span>
          <span>{EVENT.format}</span>
        </RevealBlock>

        <RevealBlock className="ab-kicker" y={22}>
          <p className="ab-kicker-line">Four chairs. One is yours.</p>
          <a
            href={EVENT.devfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ab-kicker-link"
          >
            go grab it
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

      <style>{`
        .ab {
          position: relative;
          width: 100%;
          background: #0d1910;
          color: #f3f8ee;
          padding-top: clamp(10rem, 20vh, 16rem);
          padding-bottom: clamp(2.5rem, 5vh, 4rem);
          overflow: visible;
          z-index: 10;
        }

        /* ── Deep Forest Background Gradients ── */
        .ab-bg-gradient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(120% 60% at 50% 0%, rgba(26, 52, 30, 0.55) 0%, rgba(13, 25, 16, 0) 100%);
        }

        /* ── Continuous Thick Dual Branch spanning full-bleed over the video frame seam ── */
        .ab-seam-branch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 25;
          pointer-events: none;
          user-select: none;
          overflow: visible;
        }

        .ab-seam-branch-track {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 114vw;
          min-width: 114vw;
          margin-left: clamp(0rem, 3.5vw, 4rem);
        }

        .ab-branch-seg {
          flex: 1 1 56%;
          min-width: 780px;
          height: auto;
          max-height: clamp(190px, 30vw, 420px);
          object-fit: contain;
          filter: drop-shadow(0 26px 48px rgba(14, 24, 16, 0.42));
        }

        .ab-branch-left {
          margin-right: -5vw;
          transform: scale(1.16) translateZ(0);
        }

        .ab-branch-right {
          transform: scaleX(-1) scale(1.16) translateZ(0);
          margin-left: -5vw;
        }

        /* Center moss backing that completely fills the hollow arch */
        .ab-branch-center-moss {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -46%) rotate(180deg) scale(0.95);
          width: 52vw;
          min-width: 680px;
          max-width: 960px;
          z-index: -1;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.98;
          filter: brightness(0.92) contrast(1.06);
          pointer-events: none;
        }

        .ab-branch-center-img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        @media (max-width: 768px) {
          .ab-seam-branch-track {
            width: 145vw;
            min-width: 145vw;
            margin-left: -22.5vw;
          }
          .ab-branch-seg {
            min-width: 540px;
            max-height: clamp(150px, 42vw, 240px);
          }
          .ab-branch-left {
            transform: scale(1.18) translateZ(0);
          }
          .ab-branch-right {
            transform: scaleX(-1) scale(1.18) translateZ(0);
          }
          .ab-branch-center-moss {
            width: 75vw;
            min-width: 480px;
          }
        }

        /* Deep organic green light spilling off the hero's grass onto the paper.
           Completely masks any horizontal boundary seam between the sections. */
        .ab-spill {
          position: absolute;
          top: -30px;
          left: 0;
          right: 0;
          height: clamp(8rem, 16vh, 12rem);
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(20, 42, 22, 0.65) 0%,
            rgba(45, 88, 38, 0.28) 35%,
            rgba(96, 148, 60, 0.08) 70%,
            transparent 100%
          );
        }

        .ab-inner {
          position: relative;
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 2;
        }

        .ab-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.1rem, 5.4vw, 4.25rem);
          line-height: 0.96;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #f3f8ee;
          text-align: center;
          width: 100%;
        }

        /* Wide measure, big type, few lines — reads as a statement, not a page
           of copy. Overrides the RevealWords defaults. */
        .ab-story {
          margin-top: clamp(2rem, 5vh, 3.25rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .ab-story .rw-para {
          max-width: 54rem;
          margin-inline: auto;
          font-size: clamp(1.05rem, 1.65vw, 1.4rem);
          font-weight: 380;
          line-height: 1.5;
          letter-spacing: -0.018em;
          color: #dce7d6;
          text-align: center;
        }

        .ab-meta {
          margin-top: clamp(2rem, 5vh, 3.25rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.6rem 1.1rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          color: #8da488;
          width: 100%;
        }
        .ab-meta span { display: inline-flex; align-items: center; }
        .ab-meta span + span::before {
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #8fc45a;
          opacity: 0.75;
          margin-right: 1.1rem;
        }

        .ab-kicker {
          margin-top: clamp(2.5rem, 6vh, 4rem);
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: center;
          gap: 0.6rem 1.6rem;
          width: 100%;
          text-align: center;
        }
        .ab-kicker-line {
          margin: 0;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.3rem, 2.6vw, 2.1rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #f3f8ee;
          text-align: center;
        }
        .ab-kicker-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.85rem;
          letter-spacing: 0.02em;
          color: #8fc45a;
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(143, 196, 90, 0.4);
          transition: gap 200ms var(--ease-out), color 200ms ease, border-color 200ms ease;
        }
        .ab-kicker-link svg { width: 0.9rem; height: 0.9rem; }
        .ab-kicker-link:hover {
          gap: 0.7rem;
          color: #b4ea80;
          border-color: #b4ea80;
        }

        @media (max-width: 520px) {
          .ab-kicker { flex-direction: column; align-items: center; }
        }
      `}</style>
    </section>
  );
}
