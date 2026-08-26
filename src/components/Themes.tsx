"use client";

import { TRACKS } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";

/**
 * THEMES — four cards, one line each, cover art or a clip per card.
 * Fill `media.src` in TRACKS to swap each placeholder for the real asset.
 */
export default function Themes() {
  return (
    <section id="themes" className="th" aria-label="Themes">
      <div className="th-inner">
        <RevealHeading className="th-heading" lines={["Build one of", "these four."]} />

        <RevealBlock className="th-grid" selector=".th-card" stagger={0.09} y={30}>
          {TRACKS.map((track) => (
            <article key={track.slug} className="th-card">
              <MediaSlot
                slot={track.media}
                ratio="16 / 10"
                sizes="(max-width: 860px) 100vw, 42vw"
              />
              <h3 className="th-title">{track.title}</h3>
              <p className="th-line">{track.line}</p>
            </article>
          ))}
        </RevealBlock>
      </div>

      <style>{`
        .th {
          position: relative;
          width: 100%;
          background: var(--color-bg-alt);
          color: #111a12;
          padding-block: clamp(6rem, 13vh, 10rem);
        }

        .th-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .th-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 6.6vw, 5.25rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }

        .th-grid {
          margin-top: clamp(2.75rem, 6.5vh, 4.5rem);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1.5rem, 3.5vw, 3rem) clamp(1.25rem, 3vw, 2.5rem);
        }

        .th-card { display: flex; flex-direction: column; }

        .th-title {
          margin-top: clamp(1.1rem, 2.2vh, 1.5rem);
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.35rem, 2.6vw, 2rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }

        .th-line {
          margin-top: 0.55rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          font-weight: 380;
          line-height: 1.5;
          letter-spacing: -0.018em;
          color: var(--color-text-secondary);
          max-width: 34rem;
        }

        @media (max-width: 720px) {
          .th-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
