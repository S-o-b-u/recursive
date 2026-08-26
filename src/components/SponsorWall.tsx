"use client";

import { SPONSOR_SLOTS, EVENT } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";

/**
 * SPONSOR WALL — eight logo slots, `contain` so brand marks are never cropped.
 * Fill `src` in SPONSOR_SLOTS as each one signs; add rows by adding entries.
 *
 * Note: the older `Sponsors.tsx` / `/sponsors` route with the tier table is
 * still there and untouched — this is the home-page wall.
 */
export default function SponsorWall() {
  return (
    <section id="sponsors" className="sp" aria-label="Sponsors">
      <div className="sp-inner">
        <RevealHeading className="sp-heading" lines={["Sponsors."]} />

        <RevealBlock className="sp-note" y={16}>
          <p>Logos land here as they sign.</p>
          <a href={`mailto:${EVENT.email}`} className="sp-link">
            back this one
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

        <RevealBlock className="sp-grid" selector=".sp-slot" stagger={0.05} y={22}>
          {SPONSOR_SLOTS.map((slot) => (
            <MediaSlot
              key={slot.expect}
              slot={slot}
              ratio="16 / 9"
              fit="contain"
              sizes="(max-width: 720px) 50vw, 25vw"
              className="sp-slot"
            />
          ))}
        </RevealBlock>
      </div>

      <style>{`
        .sp {
          position: relative;
          width: 100%;
          background: var(--color-bg-alt);
          color: #111a12;
          padding-block: clamp(6rem, 13vh, 10rem);
        }

        .sp-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .sp-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 6.6vw, 5.25rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }

        .sp-note {
          margin-top: clamp(1.25rem, 3vh, 2rem);
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
        }
        .sp-note p {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1.1rem, 1.9vw, 1.45rem);
          font-weight: 380;
          letter-spacing: -0.022em;
          color: var(--color-text-secondary);
        }
        .sp-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.82rem;
          color: var(--color-accent-deep);
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(47, 85, 39, 0.35);
          transition: gap 200ms var(--ease-out), color 200ms ease;
        }
        .sp-link svg { width: 0.85rem; height: 0.85rem; }
        .sp-link:hover { gap: 0.7rem; color: var(--color-accent); }

        .sp-grid {
          margin-top: clamp(2.5rem, 6vh, 4rem);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.75rem, 1.8vw, 1.35rem);
        }

        @media (max-width: 860px) {
          .sp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .sp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </section>
  );
}
