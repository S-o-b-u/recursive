"use client";

import { useEffect, useState } from "react";
import { TRACKS, TRACK_CRITERIA, EVENT } from "@/data/hackathon";
import Ornament from "@/components/ui/Ornament";

export default function Tracks({ detailed = true }: { detailed?: boolean }) {
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveHash(hash);
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 150);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <section id="track-briefs" className="tr-section" aria-label="Detailed Track Briefs">
      <div className="tr-inner">
        {/* ── Section Header Motif ── */}
        <div className="tr-ornament-wrap">
          <Ornament className="tr-motif" />
        </div>

        <div className="tr-header">
          <span className="tr-eyebrow">THE SIX TRACKS</span>
          <h2 className="tr-title">Pick your seat. Build your idea.</h2>
          <p className="tr-subtitle">
            Every track represents a fundamental direction of craft. Choose the seat that aligns with your team&rsquo;s vision — each track carries dedicated mentor support and its own prize purse.
          </p>
        </div>

        {/* ── Track Cards ── */}
        <div className="tr-grid">
          {TRACKS.map((track, i) => {
            const isTargeted = activeHash === track.slug;
            const criteria = TRACK_CRITERIA[track.slug] || [
              "Originality & Vision",
              "Technical Craft & Execution",
              "Demo & Presentation Quality",
            ];

            return (
              <article
                key={track.slug}
                id={track.slug}
                className={`tr-card ${isTargeted ? "tr-card-active" : ""}`}
              >
                {/* ── Card Header ── */}
                <div className="tr-card-head">
                  <div className="tr-seat-badge">
                    <span className="tr-seat-num">{track.seat}</span>
                    <span className="tr-seat-dot" />
                    <span className="tr-seat-label">Track 0{i + 1}</span>
                  </div>

                  <div className="tr-chair-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 4v10m12-10v10M5 14h14M7 14v6m10-6v6" />
                    </svg>
                  </div>
                </div>

                {/* ── Track Card Media ── */}
                {track.media.src && (
                  <div className="tr-card-media-link">
                    <div className="tr-card-media">
                      {/* Intrinsic size declared so the browser reserves the
                          box before the lazy load lands; without it a
                          lazy image starts as 0x0 and shifts the layout
                          when it arrives. CSS still sizes it to the card. */}
                      <img
                        src={track.media.src}
                        alt={track.title}
                        className="tr-card-img"
                        width={1514}
                        height={1039}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="tr-card-media-gloss" aria-hidden="true" />
                    </div>
                  </div>
                )}

                {/* ── Title & Line ── */}
                <h3 className="tr-card-title">{track.title}</h3>
                <p className="tr-card-line">&ldquo;{track.line}&rdquo;</p>

                <div className="tr-card-divider" />

                {/* ── Summary ── */}
                <p className="tr-card-summary">{track.summary}</p>

                {/* ── Inspiration Prompts ── */}
                <div className="tr-card-section">
                  <h4 className="tr-section-label">Core Prompts &amp; Exploration</h4>
                  <ul className="tr-prompts-list">
                    {track.prompts.map((prompt) => (
                      <li key={prompt} className="tr-prompt-item">
                        <svg className="tr-leaf-icon" viewBox="0 0 12 14" aria-hidden="true">
                          <path d="M6 13.4V4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M6.2 7.6C10 7 11.4 4 11.6 0.4C7.8 0.6 6 4 6.2 7.6Z" fill="currentColor" />
                          <path d="M5.6 10.6C2.4 10.2 1 8 0.6 5C3.8 5.2 5.4 7.6 5.6 10.6Z" fill="currentColor" />
                        </svg>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Evaluation Criteria ── */}
                {detailed && (
                  <div className="tr-card-section">
                    <h4 className="tr-section-label">Judging &amp; Evaluation Focus</h4>
                    <ul className="tr-criteria-list">
                      {criteria.map((crit) => (
                        <li key={crit} className="tr-crit-item">
                          <span className="tr-crit-bullet" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── Card Footer with CTA ── */}
                <div className="tr-card-footer">
                  <div className="tr-prize-badge">
                    <svg viewBox="0 0 24 24" className="tr-prize-icon" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                    <span>Track Prize Eligible</span>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .tr-section {
          position: relative;
          width: 100%;
          padding: clamp(3rem, 6vh, 5rem) var(--padding-x) clamp(5rem, 10vh, 8rem);
          color: #111a12;
        }

        .tr-inner {
          max-width: var(--max-width);
          margin-inline: auto;
        }

        .tr-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .tr-motif {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
        }

        .tr-header {
          text-align: center;
          max-width: 48rem;
          margin-inline: auto;
          margin-bottom: clamp(3rem, 6vh, 4.5rem);
        }

        .tr-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 550;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4A6B3E;
        }

        .tr-title {
          margin-top: 0.6rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.45rem, 10.99px + 3.391vw, 3.4rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #111a12;
        }

        .tr-subtitle {
          margin-top: 1rem;
          font-size: clamp(0.95rem, 1.2vw, 1.1rem);
          line-height: 1.6;
          color: #3b5038;
        }

        .tr-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.5vw, 2rem);
        }

        @media (max-width: 840px) {
          .tr-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Track Card ── */
        .tr-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: clamp(1.05rem, 7.72px + 2.522vw, 2.5rem);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(47, 85, 39, 0.14);
          box-shadow:
            0 2px 10px rgba(18, 38, 16, 0.04),
            0 16px 36px -12px rgba(18, 38, 16, 0.08),
            inset 0 1px 2px rgba(255, 255, 255, 0.85);
          transition: transform 260ms var(--ease-out), box-shadow 260ms var(--ease-out), border-color 260ms ease;
          scroll-margin-top: 120px;
        }

        .tr-card:hover {
          transform: translateY(-4px);
          border-color: rgba(92, 140, 58, 0.38);
          box-shadow:
            0 4px 14px rgba(18, 38, 16, 0.06),
            0 24px 48px -12px rgba(18, 38, 16, 0.12),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
        }

        .tr-card-active {
          border-color: #5C8C3A;
          box-shadow:
            0 0 0 2px rgba(92, 140, 58, 0.3),
            0 20px 44px -10px rgba(18, 38, 16, 0.14),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
          animation: tr-pulse 1.8s ease-in-out infinite alternate;
        }

        @keyframes tr-pulse {
          0% { box-shadow: 0 0 0 2px rgba(92, 140, 58, 0.25), 0 16px 36px -12px rgba(18, 38, 16, 0.1); }
          100% { box-shadow: 0 0 0 4px rgba(92, 140, 58, 0.45), 0 24px 50px -10px rgba(18, 38, 16, 0.16); }
        }

        .tr-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.1rem;
        }

        .tr-seat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.28rem 0.75rem;
          border-radius: 4px;
          background: rgba(47, 85, 39, 0.08);
          border: 1px solid rgba(47, 85, 39, 0.16);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 550;
          color: #2F5527;
        }

        .tr-seat-dot {
          width: 4px;
          height: 4px;
          border-radius: 1px;
          background: #5C8C3A;
        }

        .tr-chair-icon {
          width: 2rem;
          height: 2rem;
          display: grid;
          place-items: center;
          border-radius: 4px;
          color: #2F5527;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9);
        }

        .tr-chair-icon svg {
          width: 1.1rem;
          height: 1.1rem;
        }

        .tr-card-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: calc(var(--radius-lg, 18px) - 6px);
          overflow: hidden;
          margin-bottom: 1.25rem;
          background: #060B05;
          border: 1px solid rgba(47, 85, 39, 0.18);
          box-shadow:
            0 4px 14px rgba(18, 38, 16, 0.08),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .tr-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 550ms cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }

        .tr-card:hover .tr-card-img {
          transform: scale(1.05);
        }

        .tr-card-media-gloss {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        .tr-card-media-link {
          display: block;
          text-decoration: none;
          border-radius: 12px;
          cursor: pointer;
        }

        .tr-card-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.0rem, 10.05px + 1.652vw, 1.95rem);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #111a12;
        }

        .tr-title-link {
          color: inherit;
          text-decoration: none;
          transition: color 180ms ease;
        }

        .tr-title-link:hover {
          color: #2F5527;
        }

        .tr-card-line {
          margin-top: 0.35rem;
          font-size: 0.92rem;
          font-style: italic;
          color: #4A6B3E;
          line-height: 1.45;
        }

        .tr-card-divider {
          width: 100%;
          height: 1px;
          background: rgba(47, 85, 39, 0.12);
          margin: 1.15rem 0;
        }

        .tr-card-summary {
          font-size: 0.94rem;
          line-height: 1.62;
          color: #2d422a;
          margin-bottom: 1.25rem;
        }

        .tr-card-section {
          margin-bottom: 1.25rem;
        }

        .tr-section-label {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4A6B3E;
          margin-bottom: 0.65rem;
        }

        .tr-prompts-list,
        .tr-criteria-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tr-prompt-item,
        .tr-crit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.88rem;
          line-height: 1.5;
          color: #1e331c;
        }

        .tr-leaf-icon {
          width: 0.85rem;
          height: 0.95rem;
          flex-shrink: 0;
          margin-top: 0.18rem;
          color: #5C8C3A;
        }

        .tr-crit-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8FC45A;
          margin-top: 0.48rem;
          flex-shrink: 0;
        }

        /* ── Card Footer ── */
        .tr-card-footer {
          margin-top: auto;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(47, 85, 39, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .tr-prize-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          color: #385e2e;
        }

        .tr-prize-icon {
          width: 1rem;
          height: 1rem;
          color: #5C8C3A;
        }

        .tr-card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tr-brief-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.48rem 0.95rem;
          border-radius: 4px;
          background: rgba(47, 85, 39, 0.08);
          border: 1px solid rgba(47, 85, 39, 0.22);
          color: #1E3719;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }

        .tr-brief-btn:hover {
          background: rgba(47, 85, 39, 0.16);
          border-color: rgba(47, 85, 39, 0.4);
          transform: translateY(-1px);
        }

        .tr-brief-btn:hover .tr-cta-arrow {
          transform: translateX(2.5px);
        }

        .tr-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 1.1rem;
          border-radius: 4px;
          background: #1B2E16;
          color: #F4F8EE;
          font-size: 0.84rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 180ms ease, background 180ms ease;
        }

        .tr-cta-btn:hover {
          background: #25401F;
          transform: translateY(-1px);
        }

        .tr-cta-arrow {
          width: 0.85rem;
          height: 0.85rem;
          transition: transform 180ms ease;
        }

        .tr-cta-btn:hover .tr-cta-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 768px) {
          .tr-card {
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        }
      `}</style>
    </section>
  );
}
