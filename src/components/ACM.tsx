"use client";

import Image from "next/image";
import { COLLEGE } from "@/data/hackathon";
import { RevealWords, RevealBlock } from "@/components/ui/reveal";
import Atmosphere from "@/components/ui/Atmosphere";

/**
 * WHO IS RUNNING THIS — the college and the ACM chapter.
 *
 * Integrated centered brand lockup: Powered by [GNIT] + [GNIT ACM] + [ACM]
 * in collaboration with Department of Information Technology.
 */

const STORY = [
  `Recursive is run by the ${COLLEGE.chapter} at ${COLLEGE.college}, ${COLLEGE.city}, in collaboration with the ${COLLEGE.department}.`,
  "We are the students who book the labs, debate over poster typography, test every power strip twice, and get the network humming four minutes before the countdown.",
  "Eight hours on October 8th. An intense sprint where caffeine turns into code and ideas evolve from scratch. If it works, it will be because of the builders in the room, not the banner.",
];

export default function ACM() {
  return (
    <section id="acm" className="acm" aria-label="Who runs Recursive">
      <Atmosphere zIndex={-1} seed={23} count={14} opacity={0.75} />

      <div className="acm-inner">
        {/* Centered Integrated Powered-By Header Lockup with Cut-Out Paper Logo Scraps */}
        <RevealBlock className="acm-brand-lockup" y={20}>
          <div className="acm-lockup-top">
            <span className="acm-lockup-label">Powered by</span>

            {/* Cut-Out Paper Scrap 1: GNIT */}
            <div className="acm-paper-scrap acm-scrap-gnit">
              <div className="acm-scrap-tape" aria-hidden="true" />
              <Image
                src="/images/gnit-logos/GNIT.png"
                alt="Guru Nanak Institute of Technology"
                width={190}
                height={44}
                className="acm-lockup-logo"
              />
            </div>

            <span className="acm-lockup-plus">+</span>

            {/* Cut-Out Paper Scrap 2: GNIT ACM */}
            <div className="acm-paper-scrap acm-scrap-gnit-acm">
              <div className="acm-scrap-tape" aria-hidden="true" />
              <Image
                src="/images/gnit-logos/gnit-acm.png"
                alt="GNIT ACM Student Chapter"
                width={175}
                height={46}
                className="acm-lockup-logo"
              />
            </div>

            <span className="acm-lockup-plus">+</span>

            {/* Cut-Out Paper Scrap 3: ACM Official */}
            <div className="acm-paper-scrap acm-scrap-acm">
              <div className="acm-scrap-tape" aria-hidden="true" />
              <Image
                src="/images/gnit-logos/ACM2.png"
                alt="Association for Computing Machinery"
                width={42}
                height={42}
                className="acm-lockup-logo acm-logo-square"
              />
            </div>
          </div>

          <div className="acm-lockup-sub">
            <span className="acm-lockup-collab">in collaboration with</span>
            <span className="acm-lockup-dept">{COLLEGE.department}</span>
          </div>
        </RevealBlock>

        <RevealWords paragraphs={STORY} className="acm-story" />

        <RevealBlock className="acm-signoff" y={18}>
          <p className="acm-signoff-line">See you on the hill.</p>
          <span className="acm-signoff-who">
            — the {COLLEGE.chapter} & {COLLEGE.department}, {COLLEGE.collegeShort}
          </span>
        </RevealBlock>
      </div>

      <style>{`
        .acm {
          position: relative;
          width: 100%;
          background: #0d1910;
          color: #f3f8ee;
          padding-top: clamp(2rem, 5vh, 4rem);
          padding-bottom: clamp(7rem, 15vh, 12rem);
          overflow: hidden;
          z-index: 10;
        }

        .acm-inner {
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

        /* ── Centered Brand Lockup ── */
        .acm-brand-lockup {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1rem, 2.2vh, 1.6rem);
          width: 100%;
          text-align: center;
        }

        .acm-lockup-top {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1.1rem clamp(0.75rem, 2vw, 1.4rem);
        }

        .acm-lockup-label {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.4rem, 3.2vw, 2.35rem);
          line-height: 1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #f3f8ee;
        }

        /* ── CUT-OUT PAPER LOGO SCRAPS ── */
        .acm-paper-scrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.4rem;
          min-height: 54px;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45));
          transition:
            transform 360ms cubic-bezier(0.23, 1, 0.32, 1),
            filter 300ms ease;
          cursor: pointer;
        }

        .acm-paper-scrap:hover {
          transform: translateY(-6px) scale(1.06) rotate(0deg) !important;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.65));
          z-index: 10;
        }

        /* Scrap 1: GNIT (Natural Paper with Deckled Kraft Shadow) */
        .acm-scrap-gnit {
          background-color: #fdfbf6;
          background-image:
            linear-gradient(rgba(30, 65, 35, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 65, 35, 0.05) 1px, transparent 1px);
          background-size: 10px 10px;
          transform: rotate(-2deg);
          clip-path: polygon(
            0% 5%, 3% 1%, 97% 0%, 100% 4%,
            98% 24%, 100% 50%, 97% 76%, 100% 94%,
            94% 99%, 60% 97%, 30% 100%, 2% 96%,
            0% 75%, 2% 50%, 0% 25%
          );
        }

        /* Scrap 2: GNIT ACM (Warm Vanilla Paper with Deckled Edges) */
        .acm-scrap-gnit-acm {
          background-color: #fcf6eb;
          background-image:
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.03) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px);
          transform: rotate(1.6deg);
          clip-path: polygon(
            2% 2%, 98% 0%, 100% 10%,
            98% 40%, 100% 70%, 97% 96%,
            85% 98%, 45% 96%, 10% 100%, 0% 94%,
            3% 65%, 0% 35%, 2% 12%
          );
        }

        /* Scrap 3: ACM Official (Light Crisp Diamond Paper Scrap) */
        .acm-scrap-acm {
          background-color: #f6f9fc;
          padding: 0.6rem 0.95rem;
          transform: rotate(-2.4deg);
          clip-path: polygon(
            0% 6%, 4% 0%, 96% 2%, 100% 8%,
            97% 45%, 100% 85%, 96% 98%,
            60% 96%, 10% 100%, 0% 92%,
            3% 50%, 0% 20%
          );
        }

        /* Translucent Washi Hanging Tape on each Scrap */
        .acm-scrap-tape {
          position: absolute;
          top: -12px;
          left: 50%;
          width: 52px;
          height: 20px;
          transform: translateX(-50%) rotate(var(--tape-tilt, -1deg));
          background: rgba(248, 242, 228, 0.88);
          backdrop-filter: blur(4px);
          clip-path: polygon(
            0% 4%, 2% 0%, 98% 0%, 100% 4%,
            96% 35%, 100% 65%, 97% 100%,
            0% 100%, 4% 65%, 0% 35%
          );
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.28);
          pointer-events: none;
          z-index: 5;
        }

        .acm-scrap-gnit .acm-scrap-tape     { --tape-tilt: -2.5deg; }
        .acm-scrap-gnit-acm .acm-scrap-tape { --tape-tilt: 2deg; }
        .acm-scrap-acm .acm-scrap-tape      { --tape-tilt: -1.5deg; }

        .acm-lockup-logo {
          height: clamp(30px, 4.8vw, 42px);
          width: auto;
          max-width: 100%;
          object-fit: contain;
        }

        .acm-logo-square {
          height: clamp(32px, 5vw, 44px);
          width: clamp(32px, 5vw, 44px);
        }

        .acm-lockup-plus {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.2rem, 2.4vw, 1.85rem);
          color: #8fc45a;
        }

        .acm-lockup-sub {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.4rem 0.65rem;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-size: clamp(1.1rem, 2.2vw, 1.8rem);
          text-transform: uppercase;
          letter-spacing: -0.015em;
          line-height: 1.15;
        }

        .acm-lockup-collab {
          color: #8da488;
          font-weight: 800;
        }

        .acm-lockup-dept {
          color: #f3f8ee;
          font-weight: 900;
        }

        /* ── Centered Lore Story ── */
        .acm-story {
          margin-top: clamp(2rem, 5vh, 3.25rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .acm-story .rw-para {
          max-width: 54rem;
          margin-inline: auto;
          font-size: clamp(1.05rem, 1.65vw, 1.4rem);
          font-weight: 380;
          line-height: 1.5;
          letter-spacing: -0.018em;
          color: #dce7d6;
          text-align: center;
        }

        /* ── Centered Signoff ── */
        .acm-signoff {
          margin-top: clamp(2.5rem, 6vh, 4rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          text-align: center;
          width: 100%;
        }

        .acm-signoff-line {
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

        .acm-signoff-who {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          color: #8da488;
          letter-spacing: -0.005em;
          text-align: center;
        }
      `}</style>
    </section>
  );
}
