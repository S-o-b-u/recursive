"use client";

import type { CSSProperties } from "react";
import { JUDGES } from "@/data/hackathon";
import { RevealHeading, RevealBlock, ParallaxY } from "@/components/ui/reveal";
import MediaSlot from "@/components/ui/MediaSlot";
import JudgeRevealCard from "@/components/ui/JudgeRevealCard";
import Seal from "@/components/ui/Seal";

/**
 * JUDGES — a pinboard, not a contact sheet.
 *
 * Six cards on twelve columns with mismatched widths, aspect ratios, vertical
 * drops and a degree or two of rotation each, so it reads as photographs left
 * on a table rather than a CMS query. Every card drifts at its own rate; hover
 * straightens the one you're looking at.
 *
 * While NO judge is confirmed the whole board is cordoned off: the cards sit
 * dimmed and blurred behind <Seal> — crossed barrier tape and an ink
 * stamp. Confirm one judge (fill `name`, optionally `photo.src` in the data)
 * and the seal lifts; each still-unconfirmed card falls back to its own
 * <JudgeRevealCard> + "yet to reveal" caption.
 */
const CARDS = [
  { c: "1 / 5", ratio: "4 / 5", drop: 0, rot: "-1.5deg", drift: 72 },
  { c: "6 / 9", ratio: "3 / 4", drop: 6, rot: "1.2deg", drift: -58 },
  { c: "10 / 13", ratio: "4 / 5", drop: 1.5, rot: "-0.8deg", drift: 90 },
  { c: "2 / 6", ratio: "1 / 1", drop: 4, rot: "1.4deg", drift: -66 },
  { c: "7 / 10", ratio: "4 / 5", drop: 9, rot: "-1.1deg", drift: 80 },
  { c: "11 / 13", ratio: "3 / 4", drop: 2, rot: "0.9deg", drift: -52 },
] as const;

export default function Judges() {
  const sealed = JUDGES.every(
    (j) => j.name.trim().length === 0 && !j.photo.src,
  );

  return (
    <section id="judges" className="jd" aria-label="Judges">
      <div className="jd-inner">
        <div className="jd-head">
          <RevealHeading className="jd-heading" lines={["The people", "judging this."]} />
          <RevealBlock className="jd-note" y={16} delay={0.2}>
            <p>
              {sealed
                ? "The panel is set. The names stay sealed until the reveal."
                : "Names go up here as they confirm."}
            </p>
          </RevealBlock>
        </div>

        <div className="jd-board-wrap" data-sealed={sealed ? "true" : "false"}>
          <div className="jd-board">
            {JUDGES.map((judge, i) => {
              const card = CARDS[i % CARDS.length];
              const named = judge.name.trim().length > 0;
              const revealed = named || Boolean(judge.photo.src);

              return (
                <ParallaxY
                  key={judge.photo.expect}
                  className="jd-card"
                  distance={card.drift}
                  style={
                    {
                      "--c": card.c,
                      "--drop": card.drop,
                      "--rot": card.rot,
                    } as CSSProperties
                  }
                >
                  {revealed ? (
                    <MediaSlot
                      slot={judge.photo}
                      ratio={card.ratio}
                      sizes="(max-width: 900px) 50vw, 30vw"
                    />
                  ) : (
                    <JudgeRevealCard ratio={card.ratio} index={i} />
                  )}

                  {/* While the whole board is sealed the stamp speaks for every
                      card; a per-card caption would just fight it. */}
                  {!sealed && (
                    <div className="jd-cap">
                      {named ? (
                        <>
                          <span className="jd-name">{judge.name}</span>
                          {judge.role ? <span className="jd-role">{judge.role}</span> : null}
                        </>
                      ) : (
                        <span className="jd-pending">
                          <i className="jd-pending-dot" aria-hidden="true" />
                          yet to reveal
                        </span>
                      )}
                    </div>
                  )}
                </ParallaxY>
              );
            })}
          </div>

          {sealed && <Seal word="PANEL SEALED" />}
        </div>
      </div>

      <style>{`
        .jd {
          position: relative;
          width: 100%;
          background: var(--color-bg);
          color: #111a12;
          padding-block: clamp(6rem, 14vh, 11rem);
          overflow: hidden;
        }

        .jd-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .jd-head {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: clamp(1rem, 2.4vw, 2rem);
          align-items: end;
        }

        .jd-heading {
          grid-column: 1 / 9;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 7vw, 5.5rem);
          line-height: 0.94;
          letter-spacing: -0.022em;
          text-transform: uppercase;
        }

        .jd-note { grid-column: 9 / 13; padding-bottom: 0.7rem; }
        .jd-note p {
          margin: 0;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(0.98rem, 1.5vw, 1.2rem);
          font-weight: 380;
          line-height: 1.45;
          letter-spacing: -0.018em;
          color: var(--color-text-secondary);
          text-wrap: pretty;
        }

        .jd-board-wrap {
          position: relative;
          margin-top: clamp(3.5rem, 9vh, 6rem);
        }

        .jd-board {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: clamp(1rem, 2.2vw, 1.8rem);
          row-gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
        }

        /* Cordoned off: the pinboard sits behind the seal, dimmed and softened
           so it reads as "roped off", and nothing under it responds to hover. */
        .jd-board-wrap[data-sealed="true"] .jd-board {
          filter: saturate(0.82) brightness(0.99) blur(1.4px);
          opacity: 0.9;
        }
        .jd-board-wrap[data-sealed="true"] .jd-card { pointer-events: none; }
        .jd-board-wrap[data-sealed="true"] .jd-card:hover {
          transform: rotate(var(--rot));
        }

        .jd-card {
          grid-column: var(--c);
          margin-top: calc(var(--drop) * 1vw);
          transform: rotate(var(--rot));
          transition: transform 600ms var(--ease-out);
        }
        /* Straighten and lift the one under the cursor. The GSAP drift lives on
           the inner node, so this transform never fights it. */
        .jd-card:hover { transform: rotate(0deg) translateY(-6px); }

        .jd-cap {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding-top: 0.85rem;
        }
        .jd-name {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(0.95rem, 1.3vw, 1.08rem);
          font-weight: 500;
          letter-spacing: -0.018em;
        }
        .jd-role {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.74rem;
          color: var(--color-text-secondary);
        }

        /* "yet to reveal" tag — mono, spaced, with a slow moss pulse. */
        .jd-pending {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 450;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
        }
        .jd-pending-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-accent);
          animation: jd-pending-pulse 2.6s var(--ease-out) infinite;
        }
        @keyframes jd-pending-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(92, 140, 58, 0.45); opacity: 1; }
          70%  { box-shadow: 0 0 0 7px rgba(92, 140, 58, 0); opacity: 0.55; }
          100% { box-shadow: 0 0 0 0 rgba(92, 140, 58, 0); opacity: 1; }
        }

        /* Hovering a card straightens it (below) and lets the reveal warm up:
           the frost thins, the bust firms, the sprig leans. */
        .jd-card:hover .jrc-veil { opacity: 0.55; }
        .jd-card:hover .jrc-figure { opacity: 1; }
        .jd-card:hover .jrc-q { opacity: 0.58; }
        .jd-card:hover .jrc-sprig {
          opacity: 0.9;
          transform: translateY(-2px) rotate(-4deg);
        }

        @media (prefers-reduced-motion: reduce) {
          .jd-pending-dot { animation: none; }
        }

        @media (max-width: 900px) {
          .jd-heading, .jd-note { grid-column: 1 / -1; }
          .jd-note { padding-top: 1.1rem; padding-bottom: 0; }
          .jd-board { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .jd-card {
            grid-column: auto;
            margin-top: calc(var(--drop) * 0.6vw);
          }
          /* One ratio for everything once the columns are even, otherwise the
             portrait and square cards fight for row height. */
          .jd-card .ms,
          .jd-card .jrc { aspect-ratio: 4 / 5 !important; }
        }

        @media (max-width: 520px) {
          .jd-board { grid-template-columns: minmax(0, 1fr); }
          .jd-card { margin-top: 0; transform: rotate(0deg); }
        }
      `}</style>
    </section>
  );
}
