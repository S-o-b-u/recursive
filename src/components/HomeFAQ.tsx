"use client";

import React from "react";
import { FAQS } from "@/data/hackathon";

export default function HomeFAQ() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="faq-sheet">
        <span className="faq-sheet-sheen" aria-hidden="true" />

        {/* ── Header: Centered "FAQ" title ── */}
        <div className="faq-head">
          <h2 id="faq-title" className="faq-title">
            FAQ
          </h2>
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

        /* ── The sheet (Liquid Glass Frame) ── */
        .faq-sheet {
          position: relative;
          width: 100%;
          max-width: 34rem;
          display: flex;
          flex-direction: column;
          padding: clamp(1.5rem, 3.13px + 3.7vw, 3.5rem);
          border-radius: clamp(28px, 15.57px + 2.9vw, 48px);
          overflow: hidden;
          isolation: isolate;

          background:
            radial-gradient(130% 90% at 15% 8%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.35) 32%, transparent 65%),
            radial-gradient(100% 80% at 88% 92%, rgba(210, 245, 200, 0.42) 0%, transparent 60%),
            linear-gradient(
              152deg,
              rgba(255, 255, 255, 0.88) 0%,
              rgba(246, 251, 244, 0.72) 46%,
              rgba(235, 246, 232, 0.65) 100%
            );
          backdrop-filter: blur(36px) saturate(185%) contrast(104%);
          -webkit-backdrop-filter: blur(36px) saturate(185%) contrast(104%);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            inset 0 2px 6px rgba(255, 255, 255, 0.98),
            inset 0 -2px 8px rgba(22, 36, 26, 0.08),
            inset 0 0 40px rgba(255, 255, 255, 0.5),
            0 35px 85px -25px rgba(18, 38, 22, 0.32),
            0 12px 28px -8px rgba(18, 38, 22, 0.16);
          transition: box-shadow 400ms ease, border-color 400ms ease;
        }

        /* Fluid liquid specular caustics overlay */
        .faq-sheet-sheen {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0) 22%,
            rgba(255, 255, 255, 0.75) 44%,
            rgba(220, 248, 215, 0.35) 52%,
            rgba(255, 255, 255, 0.7) 58%,
            rgba(255, 255, 255, 0) 78%
          );
          opacity: 0.75;
          animation: faq-liquid-glow 10s ease-in-out infinite alternate;
        }

        @keyframes faq-liquid-glow {
          0% {
            opacity: 0.55;
            transform: scale(1) translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.03) translate3d(1%, -1%, 0);
          }
          100% {
            opacity: 0.6;
            transform: scale(1) translate3d(-1%, 1%, 0);
          }
        }

        .faq-sheet > *:not(.faq-sheet-sheen) {
          position: relative;
          z-index: 1;
        }

        /* ── Header ── */
        .faq-head {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          margin-bottom: clamp(1.5rem, 2.61px + 3.26vw, 3rem);
        }

        .faq-title {
          margin: 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.5rem, 30.61px + 2.609vw, 4.2rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.035em;
          color: #16241A;
          text-align: center;
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
            max-width: 48rem;
          }
        }

        /* Desktop */
        @media (min-width: 1025px) {
          .faq-sheet {
            max-width: 70rem;
          }
        }

        /* Wide Desktop */
        @media (min-width: 1280px) {
          .faq-sheet {
            max-width: 78rem;
          }
        }

        /* Ultra-wide Screens */
        @media (min-width: 1536px) {
          .faq-sheet {
            max-width: 84rem;
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
