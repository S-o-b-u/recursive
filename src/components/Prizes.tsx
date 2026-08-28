"use client";

import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { PRIZES, TRACK_PRIZE, SPECIAL_PRIZES } from "@/data/hackathon";

const PODIUM_STYLES = [
  {
    bg: "#fcf9f2", // Ivory gold parchment
    borderColor: "rgba(212, 175, 55, 0.45)",
    tapeBg: "rgba(245, 235, 205, 0.65)",
    stampBg: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)",
    stampText: "🥇 1ST",
    accentColor: "#996515",
    shadow: "0 24px 50px rgba(45, 35, 15, 0.18)",
    featured: true,
  },
  {
    bg: "#f0f5ec", // Sage silver parchment
    borderColor: "rgba(120, 160, 110, 0.35)",
    tapeBg: "rgba(225, 240, 220, 0.65)",
    stampBg: "linear-gradient(135deg, #7c9d6c 0%, #4a683b 100%)",
    stampText: "🥈 2ND",
    accentColor: "#3a5e2d",
    shadow: "0 18px 40px rgba(25, 45, 20, 0.14)",
    featured: false,
  },
  {
    bg: "#f7f1e6", // Honey bronze docket
    borderColor: "rgba(180, 130, 80, 0.35)",
    tapeBg: "rgba(245, 230, 210, 0.65)",
    stampBg: "linear-gradient(135deg, #b07d48 0%, #784d20 100%)",
    stampText: "🥉 3RD",
    accentColor: "#784518",
    shadow: "0 18px 40px rgba(45, 30, 15, 0.14)",
    featured: false,
  },
];

export default function Prizes({ detailed = false }: { detailed?: boolean }) {
  return (
    <SectionWrapper
      id="prizes"
      label="Prizes"
      heading={<>₹4.5 lakh in prizes, and a reason to finish.</>}
      lede={
        <p>
          Money helps, but the point is the deadline. Everything below is on top of
          food, workspace, and hardware for the weekend.
        </p>
      }
    >
      {/* Handcrafted Parchment Podium */}
      <div className="grid items-end gap-6 sm:grid-cols-3 pt-6">
        {PRIZES.map((prize, i) => {
          const style = PODIUM_STYLES[i] || PODIUM_STYLES[0];
          return (
            <Reveal key={prize.place} delay={i * 0.08}>
              <div
                className={`prize-card ${prize.featured ? "sm:-mt-8 sm:pb-10 sm:pt-9" : ""}`}
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.borderColor,
                  boxShadow: style.shadow,
                }}
              >
                {/* Frosted Washi Tape Pin */}
                <div
                  className="prize-tape"
                  style={{ backgroundColor: style.tapeBg }}
                  aria-hidden="true"
                />

                {/* Wax Stamp Seal */}
                <div
                  className="prize-stamp"
                  style={{ background: style.stampBg }}
                  aria-hidden="true"
                >
                  {style.stampText}
                </div>

                <div className="prize-head">
                  <span
                    className="prize-place"
                    style={{ color: style.accentColor }}
                  >
                    {prize.place}
                  </span>
                  <p className="prize-amount">{prize.amount}</p>
                </div>

                <div className="prize-divider" />

                <ul className="prize-perks">
                  {prize.perks.map((p) => (
                    <li key={p} className="prize-perk-item">
                      <span className="prize-bullet" style={{ backgroundColor: style.accentColor }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Handcrafted Track Prize Ledger Ticket */}
      <Reveal delay={0.1}>
        <div className="prize-track-card">
          <div className="prize-track-tape" aria-hidden="true" />
          <div className="prize-track-info">
            <span className="prize-track-tag">{TRACK_PRIZE.label}</span>
            <p className="prize-track-note">{TRACK_PRIZE.note}</p>
          </div>
          <div className="prize-track-amount-wrap">
            <span className="prize-track-amount">{TRACK_PRIZE.amount}</span>
            <span className="prize-track-mult">× 4 tracks</span>
          </div>
        </div>
      </Reveal>

      {detailed && (
        <div className="mt-14">
          <h3 className="mb-6 font-display text-2xl font-bold tracking-tight text-[#16241a]">
            Special Category Awards
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {SPECIAL_PRIZES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="prize-special-card">
                  <div className="prize-special-clip" aria-hidden="true" />
                  <p className="prize-special-title">{s.title}</p>
                  <p className="prize-special-note">{s.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <style>{`
        /* ── Tactile Parchment Podium Card ── */
        .prize-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: clamp(1.75rem, 4vw, 2.5rem);
          border-radius: 16px;
          border: 1px solid;
          color: #142416;
          transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms ease;
        }
        .prize-card:hover {
          transform: translateY(-6px);
        }

        .prize-tape {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 52px;
          height: 18px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }

        .prize-stamp {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          color: #ffffff;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        .prize-head {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
        }

        .prize-place {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .prize-amount {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #122214;
        }

        .prize-divider {
          width: 100%;
          height: 1px;
          background: rgba(20, 36, 22, 0.12);
          margin-block: 0.25rem;
        }

        .prize-perks {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-top: auto;
          text-align: left;
        }

        .prize-perk-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.92rem;
          line-height: 1.4;
          color: #3b503d;
        }

        .prize-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50% 40% 55% 45% / 45% 55% 40% 50%;
          flex-shrink: 0;
        }

        /* ── Track Prize Ledger Ticket ── */
        .prize-track-card {
          position: relative;
          margin-top: 1.5rem;
          padding: 1.75rem 2rem;
          background: #fbfdf9;
          border-radius: 14px;
          border: 1px dashed rgba(47, 85, 39, 0.35);
          box-shadow: 0 12px 30px rgba(20, 35, 20, 0.08);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .prize-track-tape {
          position: absolute;
          top: -10px;
          left: 3rem;
          width: 44px;
          height: 16px;
          background: rgba(230, 242, 222, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .prize-track-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .prize-track-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent-deep);
        }

        .prize-track-note {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.95rem;
          color: #4a634c;
        }

        .prize-track-amount-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .prize-track-amount {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          color: #122214;
        }

        .prize-track-mult {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.85rem;
          color: #6d886f;
          font-weight: 500;
        }

        /* ── Special Category Pinned Note ── */
        .prize-special-card {
          position: relative;
          padding: 1.5rem 1.75rem;
          background: #f8faf6;
          border-radius: 12px;
          border: 1px solid rgba(47, 85, 39, 0.18);
          box-shadow: 0 8px 24px rgba(20, 35, 20, 0.06);
        }

        .prize-special-clip {
          position: absolute;
          top: -6px;
          left: 1.5rem;
          width: 14px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid #8fa28f;
          border-bottom: none;
          background: transparent;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
        }

        .prize-special-title {
          font-family: var(--font-geist-sans), sans-serif;
          font-weight: 600;
          font-size: 1.05rem;
          color: #142416;
        }

        .prize-special-note {
          margin-top: 0.35rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.88rem;
          line-height: 1.45;
          color: #556c57;
        }
      `}</style>
    </SectionWrapper>
  );
}
