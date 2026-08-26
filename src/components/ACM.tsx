"use client";

import { COLLEGE, COLLEGE_LOGOS } from "@/data/hackathon";
import { RevealWords, RevealHeading, RevealBlock } from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";

/**
 * WHO IS RUNNING THIS — the college and the ACM chapter.
 *
 * Full-width measure so three short paragraphs cover the page instead of
 * stacking into a column. Logo slots below; fill `src` in COLLEGE_LOGOS.
 */

const STORY = [
  `Recursive is run by the ${COLLEGE.chapter} at ${COLLEGE.college}, ${COLLEGE.city}.`,
  "We are the people who book the hall, argue about poster fonts, and get the projector working four minutes before the talk starts.",
  "It is the biggest thing we have tried. If it works, it will be because of the room and not the banner.",
];

export default function ACM() {
  return (
    <section id="acm" className="acm" aria-label="Who runs Recursive">
      <div className="acm-inner">
        <RevealHeading
          className="acm-heading"
          lines={["Powered by", "the ACM chapter."]}
        />

        <RevealWords paragraphs={STORY} className="acm-story" />

        <RevealBlock className="acm-logos" selector=".acm-logo" stagger={0.08}>
          {COLLEGE_LOGOS.map((logo) => (
            <MediaSlot
              key={logo.expect}
              slot={logo}
              ratio="16 / 7"
              fit="contain"
              sizes="(max-width: 860px) 100vw, 30vw"
              className="acm-logo"
            />
          ))}
        </RevealBlock>

        <RevealBlock className="acm-signoff" y={18}>
          <p className="acm-signoff-line">See you on the hill.</p>
          <span className="acm-signoff-who">
            — the {COLLEGE.chapter}, {COLLEGE.collegeShort}
          </span>
        </RevealBlock>
      </div>

      <style>{`
        .acm {
          position: relative;
          width: 100%;
          background: var(--color-bg-alt);
          color: #111a12;
          padding-block: clamp(6.5rem, 14vh, 11rem);
          overflow: hidden;
        }

        .acm-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .acm-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 6.6vw, 5.25rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }

        .acm-story { margin-top: clamp(2.25rem, 5.5vh, 3.5rem); }
        .acm-story .rw-para {
          max-width: 66rem;
          font-size: clamp(1.25rem, 2.35vw, 1.95rem);
          font-weight: 380;
          line-height: 1.44;
          letter-spacing: -0.022em;
          color: #111a12;
        }

        .acm-logos {
          margin-top: clamp(3rem, 7vh, 5rem);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(0.75rem, 1.6vw, 1.25rem);
          max-width: 58rem;
        }

        .acm-signoff {
          margin-top: clamp(2.75rem, 6.5vh, 4.5rem);
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem 1.4rem;
        }
        .acm-signoff-line {
          margin: 0;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.45rem, 3.4vw, 2.5rem);
          line-height: 1.04;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }
        .acm-signoff-who {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          letter-spacing: -0.005em;
        }

        @media (max-width: 700px) {
          .acm-logos { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .acm-logos > :last-child { grid-column: span 2; }
        }
      `}</style>
    </section>
  );
}
