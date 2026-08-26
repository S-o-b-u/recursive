"use client";

import { JUDGES } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";

/**
 * JUDGES — six portrait slots. No invented names: a card shows "To be
 * announced" until you fill `name`, `role` and `photo.src` in JUDGES.
 */
export default function Judges() {
  return (
    <section id="judges" className="jd" aria-label="Judges">
      <div className="jd-inner">
        <RevealHeading className="jd-heading" lines={["The people", "judging this."]} />

        <RevealBlock className="jd-note" y={16}>
          <p>Names go up here as they confirm.</p>
        </RevealBlock>

        <RevealBlock className="jd-grid" selector=".jd-card" stagger={0.07} y={26}>
          {JUDGES.map((judge) => (
            <article key={judge.photo.expect} className="jd-card">
              <MediaSlot
                slot={judge.photo}
                ratio="4 / 5"
                sizes="(max-width: 720px) 50vw, 30vw"
              />
              <h3 className="jd-name" data-empty={judge.name ? "false" : "true"}>
                {judge.name || "To be announced"}
              </h3>
              {judge.role ? <p className="jd-role">{judge.role}</p> : null}
            </article>
          ))}
        </RevealBlock>
      </div>

      <style>{`
        .jd {
          position: relative;
          width: 100%;
          background: var(--color-bg);
          color: #111a12;
          padding-block: clamp(6rem, 13vh, 10rem);
        }

        .jd-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .jd-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 6.6vw, 5.25rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111a12;
        }

        .jd-note {
          margin-top: clamp(1.25rem, 3vh, 2rem);
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1.1rem, 1.9vw, 1.45rem);
          font-weight: 380;
          letter-spacing: -0.022em;
          color: var(--color-text-secondary);
        }

        .jd-grid {
          margin-top: clamp(2.5rem, 6vh, 4rem);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.6vw, 2rem) clamp(1rem, 2.2vw, 1.75rem);
        }

        .jd-card { display: flex; flex-direction: column; }

        .jd-name {
          margin-top: 0.95rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #111a12;
        }
        .jd-name[data-empty="true"] {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: var(--color-text-tertiary);
        }

        .jd-role {
          margin-top: 0.2rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.74rem;
          color: var(--color-text-secondary);
        }

        @media (max-width: 720px) {
          .jd-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </section>
  );
}
