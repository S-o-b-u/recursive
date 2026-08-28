"use client";

import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { TRACKS } from "@/data/hackathon";

const TRACK_STYLES = [
  {
    bg: "#eaf2e3", // Light Sage / Mint Mist
    borderColor: "rgba(110, 160, 100, 0.38)",
    shadow: "0 18px 45px rgba(25, 45, 20, 0.12)",
    accentColor: "#2c5424",
    bulletColor: "#3a6830",
    badgeBg: "rgba(225, 240, 218, 0.9)",
  },
  {
    bg: "#eaf1f8", // Powder Blue / Blueprint Mist
    borderColor: "rgba(100, 140, 180, 0.38)",
    shadow: "0 18px 45px rgba(20, 35, 55, 0.12)",
    accentColor: "#1d456b",
    bulletColor: "#25537f",
    badgeBg: "rgba(220, 235, 248, 0.9)",
  },
  {
    bg: "#f5e8d3", // Warm Honey / Manila Parchment
    borderColor: "rgba(175, 130, 80, 0.38)",
    shadow: "0 18px 45px rgba(45, 30, 15, 0.12)",
    accentColor: "#6c4114",
    bulletColor: "#844f19",
    badgeBg: "rgba(245, 230, 208, 0.9)",
  },
  {
    bg: "#faedf2", // Rose-Blush / Dusty Blossom
    borderColor: "rgba(185, 115, 140, 0.38)",
    shadow: "0 18px 45px rgba(50, 20, 35, 0.12)",
    accentColor: "#6e2542",
    bulletColor: "#863053",
    badgeBg: "rgba(248, 230, 238, 0.9)",
  },
];

export default function Tracks({ detailed = false }: { detailed?: boolean }) {
  return (
    <SectionWrapper
      id="tracks"
      label="Tracks"
      heading={<>Four chairs on the hill. Pick one and sit down.</>}
      lede={
        <p>
          Each track is a seat — a direction, not a cage. Your project has to lean
          toward one of them, and every track carries its own prize.
        </p>
      }
      tone="alt"
    >
      <div className="grid gap-6 sm:grid-cols-2 pt-4">
        {TRACKS.map((track, i) => {
          const style = TRACK_STYLES[i % TRACK_STYLES.length];
          return (
            <Reveal key={track.slug} delay={i * 0.07}>
              <article
                id={track.slug}
                className="track-folio-card"
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.borderColor,
                  boxShadow: style.shadow,
                }}
              >
                {/* Frosted washi tape scrap */}
                <div className="track-folio-tape" aria-hidden="true" />

                <header className="flex items-center justify-between gap-3">
                  <span
                    className="track-folio-badge"
                    style={{
                      color: style.accentColor,
                      backgroundColor: style.badgeBg,
                      borderColor: style.borderColor,
                    }}
                  >
                    {track.seat}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 opacity-75"
                    style={{ color: style.accentColor }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M7 4v9m10-9v9M6 13h12M8 13v7m8-7v7" strokeLinecap="round" />
                  </svg>
                </header>

                <h3 className="track-folio-title">
                  {track.title}
                </h3>

                <p className="track-folio-summary">
                  {track.summary}
                </p>

                {detailed && (
                  <ul className="mt-auto space-y-2.5 border-t border-black/8 pt-5">
                    {track.prompts.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-sm text-[#3b503e]"
                      >
                        <span
                          aria-hidden
                          className="track-folio-bullet"
                          style={{ backgroundColor: style.bulletColor }}
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>

      <style>{`
        /* ── Handcrafted Track Folio Paper Card ── */
        .track-folio-card {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
          gap: 1.25rem;
          padding: clamp(1.75rem, 4vw, 2.5rem);
          border-radius: 16px;
          border: 1px solid;
          color: #152417;
          transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms ease;
        }
        .track-folio-card:hover {
          transform: translateY(-5px);
        }

        .track-folio-tape {
          position: absolute;
          top: -10px;
          left: 3rem;
          width: 48px;
          height: 17px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .track-folio-badge {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          border: 1px solid;
        }

        .track-folio-title {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-size: clamp(1.5rem, 3.2vw, 2rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #122214;
        }

        .track-folio-summary {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.96rem;
          line-height: 1.6;
          color: #425845;
        }

        .track-folio-bullet {
          margin-top: 0.45em;
          width: 6px;
          height: 6px;
          border-radius: 50% 45% 55% 48% / 48% 54% 46% 52%;
          flex-shrink: 0;
        }
      `}</style>
    </SectionWrapper>
  );
}
