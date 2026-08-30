"use client";

import { EVENT } from "@/data/hackathon";
import { RevealWords, RevealHeading, RevealBlock } from "@/components/ui/reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import Ornament from "@/components/ui/Ornament";

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
            <Ornament className="ab-crown" />
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
          padding-top: clamp(6rem, 13vh, 10rem);
          /* Stacks with the countdown's padding-top, so this is half the gap
             that reads on screen. */
          padding-bottom: clamp(3.5rem, 8vh, 6.5rem);
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
          width: clamp(190px, 22vw, 260px);
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
