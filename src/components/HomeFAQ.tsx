"use client";

import React from "react";
import { FAQS, EVENT } from "@/data/hackathon";

export default function HomeFAQ() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="faq-sheet">
        <span className="faq-sheet-sheen" aria-hidden="true" />

        {/* ── Header: title + count on the left, the way out on the right ── */}
        <div className="faq-head">
          <div className="faq-head-text">
            <h2 id="faq-title" className="faq-title">
              FAQs
            </h2>
            <span className="faq-count">
              ( {String(FAQS.length).padStart(2, "0")} )
            </span>
          </div>

          <a
            href={EVENT.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask a question in Discord"
            title="Ask in Discord"
            className="faq-jump"
          >
            <span className="faq-jump-sheen" aria-hidden="true" />
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* ── The stack. Each card is a dark glass slab carrying a light
               capsule for the question and the answer beneath it. ── */}
        <ul className="faq-list">
          {FAQS.map((faq, i) => (
            <li key={i} className="faq-card">
              <span className="faq-card-sheen" aria-hidden="true" />
              <div className="faq-q">
                <span className="faq-q-sheen" aria-hidden="true" />
                <span className="faq-q-text">{faq.q}</span>
              </div>
              <p className="faq-a">{faq.a}</p>
            </li>
          ))}
        </ul>
      </div>

      <style href="home-faq" precedence="default" suppressHydrationWarning>{`
        /* ─────────────────────────────────────────
           FAQ. Sits on the page sky, so every surface
           here is glass rather than paint: the sheet
           and the capsules let the cloud through and
           bend it, the slabs sit dark against it.
        ───────────────────────────────────────── */
        .faq {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
          padding-block: clamp(3.5rem, 22.61px + 6.52vw, 9rem);
          padding-inline: clamp(1rem, 3.5vw, 2rem);
          scroll-margin-top: 7rem;
        }

        /* ── The sheet ── */
        .faq-sheet {
          position: relative;
          width: 100%;
          max-width: 34rem;
          display: flex;
          flex-direction: column;
          padding: clamp(1.35rem, 3.13px + 3.7vw, 3rem);
          border-radius: clamp(26px, 15.57px + 2.9vw, 44px);
          overflow: hidden;
          isolation: isolate;

          background:
            linear-gradient(
              158deg,
              rgba(255, 255, 255, 0.82) 0%,
              rgba(248, 251, 245, 0.66) 46%,
              rgba(238, 245, 234, 0.6) 100%
            );
          backdrop-filter: blur(28px) saturate(165%);
          -webkit-backdrop-filter: blur(28px) saturate(165%);
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(22, 36, 26, 0.06),
            0 30px 70px -28px rgba(20, 38, 23, 0.3),
            0 2px 10px -4px rgba(20, 38, 23, 0.12);
        }

        /* The specular streak that makes glass read as glass. */
        .faq-sheet-sheen {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(
            118deg,
            rgba(255, 255, 255, 0) 26%,
            rgba(255, 255, 255, 0.5) 42%,
            rgba(255, 255, 255, 0) 58%
          );
          opacity: 0.55;
        }

        .faq-sheet > *:not(.faq-sheet-sheen) {
          position: relative;
          z-index: 1;
        }

        /* ── Header ── */
        .faq-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: clamp(1.5rem, 2.61px + 3.26vw, 3rem);
        }

        .faq-head-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .faq-title {
          margin: 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.5rem, 30.61px + 2.609vw, 4rem);
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -0.035em;
          color: #16241A;
        }

        .faq-count {
          margin-top: clamp(0.55rem, 1.2vh, 0.9rem);
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.8125rem, 12.22px + 0.217vw, 0.9375rem);
          letter-spacing: 0.2em;
          color: rgba(22, 36, 26, 0.6);
        }

        /* ── The circular way out ── */
        .faq-jump {
          position: relative;
          flex-shrink: 0;
          width: clamp(44px, 36.17px + 2.17vw, 56px);
          height: clamp(44px, 36.17px + 2.17vw, 56px);
          margin-top: 0.35rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          color: #16241A;
          text-decoration: none;

          background: linear-gradient(
            150deg,
            rgba(255, 255, 255, 0.78) 0%,
            rgba(236, 244, 231, 0.5) 100%
          );
          backdrop-filter: blur(14px) saturate(170%);
          -webkit-backdrop-filter: blur(14px) saturate(170%);
          border: 1px solid rgba(22, 36, 26, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.85),
            0 8px 20px -10px rgba(20, 38, 23, 0.35);
          transition:
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
            background 380ms ease,
            color 300ms ease,
            box-shadow 380ms ease;
        }

        .faq-jump-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            125deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.6) 48%,
            rgba(255, 255, 255, 0) 64%
          );
        }

        .faq-jump svg {
          position: relative;
          z-index: 1;
          transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .faq-jump:hover {
          transform: translateY(-2px);
          background: linear-gradient(150deg, #1B2E1F 0%, #0E1A10 100%);
          color: #EFF5EA;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            0 14px 30px -12px rgba(20, 38, 23, 0.55);
        }

        .faq-jump:hover svg {
          transform: rotate(45deg);
        }

        /* ── The stack ── */
        .faq-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: clamp(0.7rem, 4.87px + 1.09vw, 1.25rem);
        }

        .faq-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          padding: clamp(0.5rem, 1.87px + 0.54vw, 0.85rem);
          border-radius: clamp(20px, 11.3px + 2.17vw, 32px);

          background: linear-gradient(
            160deg,
            rgba(23, 39, 26, 0.9) 0%,
            rgba(11, 22, 13, 0.94) 100%
          );
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3),
            0 16px 34px -20px rgba(8, 18, 10, 0.7);
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 420ms ease;
        }

        .faq-card-sheen {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(
            122deg,
            rgba(255, 255, 255, 0) 34%,
            rgba(190, 224, 168, 0.14) 50%,
            rgba(255, 255, 255, 0) 66%
          );
        }

        .faq-card > *:not(.faq-card-sheen) {
          position: relative;
          z-index: 1;
        }

        .faq-card:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3),
            0 22px 44px -20px rgba(8, 18, 10, 0.8);
        }

        /* ── Question capsule ── */
        .faq-q {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
          padding: clamp(0.62rem, 2.87px + 0.65vw, 0.9rem)
            clamp(1rem, 4.7px + 1.3vw, 1.6rem);
          border-radius: 999px;

          background: linear-gradient(
            150deg,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(240, 246, 236, 0.9) 100%
          );
          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            inset 0 -1px 0 rgba(22, 36, 26, 0.1),
            0 4px 12px -6px rgba(0, 0, 0, 0.35);
        }

        .faq-q-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 32%,
            rgba(255, 255, 255, 0.75) 48%,
            rgba(255, 255, 255, 0) 62%
          );
        }

        .faq-q-text {
          position: relative;
          z-index: 1;
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(0.9375rem, 14.22px + 0.217vw, 1.0625rem);
          font-weight: 600;
          line-height: 1.32;
          letter-spacing: -0.014em;
          color: #14231A;
          text-wrap: pretty;
        }

        /* ── Answer ── */
        .faq-a {
          margin: clamp(0.6rem, 3.13px + 0.54vw, 0.95rem) 0
            clamp(0.35rem, 1.39px + 0.33vw, 0.6rem);
          padding-inline: clamp(1rem, 4.7px + 1.3vw, 1.6rem);
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(0.84375rem, 12.91px + 0.163vw, 0.9375rem);
          font-weight: 400;
          line-height: 1.62;
          letter-spacing: -0.006em;
          color: rgba(228, 240, 223, 0.9);
          text-wrap: pretty;
        }

        /* ─────────────────────────────────────────
           Ratios per class of device. The sheet is a
           reading column, so it widens with the screen
           but never past a comfortable measure.
        ───────────────────────────────────────── */

        /* Tablet */
        @media (min-width: 641px) {
          .faq-sheet {
            max-width: 44rem;
          }
        }

        /* Desktop */
        @media (min-width: 1025px) {
          .faq-sheet {
            max-width: 58rem;
          }
        }

        /* Wide Desktop */
        @media (min-width: 1280px) {
          .faq-sheet {
            max-width: 64rem;
          }
        }

        /* Phone: the capsule is the tight axis here, so the question loses its
           pill rounding rather than its words when it has to wrap. */
        @media (max-width: 480px) {
          .faq-q {
            border-radius: 22px;
          }
        }

        /* backdrop-filter is the expensive one on a phone GPU. Four stacked
           glass layers per card is fine on desktop and not on a handset, so the
           capsules and slabs keep their tint but drop the live blur. */
        @media (max-width: 700px) {
          .faq-card,
          .faq-q {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
          .faq-sheet {
            backdrop-filter: blur(16px) saturate(150%);
            -webkit-backdrop-filter: blur(16px) saturate(150%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-card,
          .faq-jump,
          .faq-jump svg {
            transition: none;
          }
          .faq-card:hover,
          .faq-jump:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
