"use client";

import { EVENT } from "@/data/hackathon";
import { RevealWords, RevealHeading, RevealBlock } from "@/components/ui/reveal";

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
          background: var(--color-bg);
          color: #111a12;
          padding-block: clamp(7rem, 15vh, 12rem) clamp(6rem, 13vh, 10rem);
          overflow: hidden;
          z-index: 1;
        }

        .ab-inner {
          position: relative;
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          z-index: 2;
        }

        .ab-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 7.6vw, 6rem);
          line-height: 0.94;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }

        /* Wide measure, big type, few lines — reads as a statement, not a page
           of copy. Overrides the RevealWords defaults. */
        .ab-story { margin-top: clamp(2.5rem, 6vh, 4rem); }
        .ab-story .rw-para {
          max-width: 68rem;
          font-size: clamp(1.3rem, 2.55vw, 2.15rem);
          font-weight: 380;
          line-height: 1.42;
          letter-spacing: -0.022em;
          color: #111a12;
        }

        .ab-meta {
          margin-top: clamp(2.5rem, 6vh, 3.75rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.6rem 1.1rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          letter-spacing: 0.02em;
          color: var(--color-text-secondary);
        }
        .ab-meta span { display: inline-flex; align-items: center; }
        .ab-meta span + span::before {
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-accent);
          opacity: 0.5;
          margin-right: 1.1rem;
        }

        .ab-kicker {
          margin-top: clamp(3rem, 7vh, 5rem);
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.6rem 1.6rem;
        }
        .ab-kicker-line {
          margin: 0;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.6rem, 4vw, 3.1rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }
        .ab-kicker-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.85rem;
          letter-spacing: 0.02em;
          color: var(--color-accent-deep);
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(47, 85, 39, 0.35);
          transition: gap 200ms var(--ease-out), color 200ms ease;
        }
        .ab-kicker-link svg { width: 0.9rem; height: 0.9rem; }
        .ab-kicker-link:hover { gap: 0.7rem; color: var(--color-accent); }

        @media (max-width: 520px) {
          .ab-kicker { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
