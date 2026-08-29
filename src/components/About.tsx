"use client";

import { EVENT } from "@/data/hackathon";
import { RevealWords, RevealHeading, RevealBlock } from "@/components/ui/reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

/**
 * Botanical Crown Flourish Motif.
 */
function BotanicalCrown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M90 6C90 6 86 16 74 19C62 22 46 16 34 22C24 27 20 37 12 39C6 40 2 37 0 35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M90 6C90 6 94 16 106 19C118 22 134 16 146 22C156 27 160 37 168 39C174 40 178 37 180 35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Central sprout */}
      <path
        d="M90 2V14M90 2C86.5 5.5 83 9 83 13C83 16.5 86.5 18 90 18C93.5 18 97 16.5 97 13C97 9 93.5 5.5 90 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Leaves left */}
      <path
        d="M68 20C65 16 59 15 56 18C53 21 55 26 59 27C63 28 66 24 68 20Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* Leaves right */}
      <path
        d="M112 20C115 16 121 15 124 18C127 21 125 26 121 27C117 28 114 24 112 20Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* Dots */}
      <circle cx="90" cy="25" r="2" fill="currentColor" />
      <circle cx="90" cy="33" r="1.5" fill="currentColor" />
      <circle cx="90" cy="40" r="1" fill="currentColor" />
      <circle cx="44" cy="22" r="1.5" fill="currentColor" />
      <circle cx="136" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

const STORY = [
  "The plastic chair is an everyday staple across Kolkata, scattered on college terraces, roadside tea stalls, and neighborhood corners where people gather to talk for hours. For this hackathon, four of these chairs sit together on the hill as an open table for your team. You arrive with people you know or team up in the morning, claim your spot, and spend eight focused hours turning an idea into working software before the day ends.",
];

export default function About() {
  return (
    <section id="about" className="ab" aria-label="About the Chair">
      <div className="ab-inner">
        {/* ── Symmetrical Botanical Flourish ── */}
        <RevealBlock y={14}>
          <div className="ab-ornament-wrap">
            <BotanicalCrown className="ab-crown" />
          </div>
        </RevealBlock>

        {/* ── Centered Heading ── */}
        <div className="ab-head-wrap">
          <RevealHeading
            className="ab-heading"
            lines={["The Story of the Chair"]}
          />
        </div>

        {/* ── Wide Single Story Paragraph ── */}
        <div className="ab-story-wrap">
          <RevealWords paragraphs={STORY} className="ab-story" />
        </div>

        {/* ── Liquid Metal Button ── */}
        <RevealBlock className="ab-action-wrap" y={16} delay={0.12}>
          <LiquidMetalButton
            label="Claim Your Seat"
            href={EVENT.devfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            width={210}
            height={48}
          />
        </RevealBlock>
      </div>

      <style>{`
        .ab {
          position: relative;
          width: 100%;
          background: transparent;
          color: #111a12;
          padding-top: clamp(8.5rem, 19vh, 14rem);
          padding-bottom: clamp(6rem, 14vh, 10rem);
          overflow: hidden;
          z-index: 1;
        }

        .ab-inner {
          position: relative;
          max-width: 96rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ab-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1.2rem, 2.2vh, 1.8rem);
        }

        .ab-crown {
          width: clamp(130px, 16vw, 180px);
          height: auto;
          color: #2F5527;
          opacity: 0.85;
        }

        .ab-head-wrap {
          width: 100%;
          text-align: center;
        }

        .ab-heading {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.6rem, 5.8vw, 4.6rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #111a12;
          text-align: center;
        }

        .ab-heading .rh-line {
          display: flex;
          justify-content: center;
        }

        /* ── Wide Single Story Paragraph ── */
        .ab-story-wrap {
          margin-top: clamp(2.75rem, 6vh, 4.5rem);
          width: 100%;
          max-width: 88rem;
        }

        .ab-story {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ab-story .rw-para {
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

        /* ── Action Wrap ── */
        .ab-action-wrap {
          margin-top: clamp(2.75rem, 5.5vh, 4.5rem);
          display: flex;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
