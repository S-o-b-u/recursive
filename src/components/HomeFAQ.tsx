"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RevealBlock, RevealHeading } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import { FAQS } from "@/data/hackathon";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Item [02] open by default matching reference image

  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-title">
      <div className="faq-container">
        {/* ── Header: Centered "FAQ" with Artifact (Matching Other Sections) ── */}
        <div className="faq-header">
          <RevealBlock y={14}>
            <div className="faq-ornament-wrap">
              <Ornament className="faq-crown" />
            </div>
          </RevealBlock>

          <RevealHeading
            className="faq-title"
            lines={["FAQ"]}
          />
        </div>

        {/* ── Accordion List (Matching WhatsApp Reference Image) ── */}
        <div className="faq-accordion" role="region" aria-label="Frequently Asked Questions">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const indexStr = `${index + 1}`;

            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "is-open" : "is-closed"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <div className="faq-row-main">
                    <span className="faq-row-num">{indexStr}</span>
                    <span className="faq-row-title">{faq.q}</span>
                  </div>

                  <div className="faq-arrow-box" aria-hidden="true">
                    {isOpen ? (
                      /* Up-Right Diagonal Arrow ↗ */
                      <svg
                        viewBox="0 0 24 24"
                        className="faq-arrow"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    ) : (
                      /* Down-Right Diagonal Arrow ↘ */
                      <svg
                        viewBox="0 0 24 24"
                        className="faq-arrow"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="7" x2="17" y2="17" />
                        <polyline points="7 17 17 17 17 7" />
                      </svg>
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE_OUT }}
                      className="faq-answer-collapse"
                    >
                      <div className="faq-answer-inner">
                        <p className="faq-answer-text">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <style href="home-faq-cloud" precedence="default" suppressHydrationWarning>{`
        /* ─────────────────────────────────────────
           Modern High-Contrast FAQ Section
           On Global Cloud Background
        ───────────────────────────────────────── */
        .faq-section {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
          background: transparent;
          color: #111c14;
          padding-block: clamp(4.5rem, 8vw, 8.5rem);
          padding-inline: clamp(1.2rem, 4vw, 3.5rem);
          scroll-margin-top: 7rem;
        }

        .faq-container {
          position: relative;
          width: 100%;
          max-width: 72rem;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
        }

        /* ── Header ── */
        .faq-header {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin-bottom: clamp(2.5rem, 4.5vw, 4rem);
        }

        .faq-ornament-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: clamp(1rem, 2vh, 1.6rem);
        }

        .faq-crown {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
        }

        .faq-title {
          margin: 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.6rem, 5.8vw, 4.6rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.035em;
          word-spacing: -0.01em;
          color: #111a12;
          text-transform: uppercase;
          text-align: center;
        }

        .faq-title .rh-line {
          display: flex;
          justify-content: center;
        }

        /* ── Accordion List ── */
        .faq-accordion {
          width: 100%;
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(22, 36, 26, 0.18);
        }

        /* ── Row Item ── */
        .faq-item {
          position: relative;
          width: 100%;
          border-bottom: 1px solid rgba(22, 36, 26, 0.18);
          transition: background 250ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 250ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 250ms ease,
                      box-shadow 250ms ease;
        }

        /* Closed State */
        .faq-item.is-closed {
          background: transparent;
          color: #16241A;
        }

        .faq-item.is-closed:hover {
          border-bottom-color: rgba(22, 36, 26, 0.42);
        }

        .faq-item.is-closed:hover .faq-row-title {
          color: #0b1710;
        }

        .faq-item.is-closed:hover .faq-arrow {
          transform: translate(2px, 2px);
        }

        /* Open Active State (Transparent on Cloud Background) */
        .faq-item.is-open {
          background: transparent;
          color: #111c14;
        }

        /* ── Trigger Button ── */
        .faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: clamp(1.35rem, 2.5vh, 2rem) clamp(0.75rem, 1.5vw, 1.75rem);
          text-align: left;
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        .faq-row-main {
          display: flex;
          align-items: baseline;
          gap: clamp(1.2rem, 2.5vw, 2.75rem);
          flex: 1;
          min-width: 0;
        }

        .faq-row-num {
          font-family: var(--font-bebas), var(--font-heading), sans-serif;
          font-size: clamp(1.4rem, 15px + 1.2vw, 2.1rem);
          font-weight: 700;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          color: #1b4324;
          line-height: 1;
          opacity: 1;
        }

        .faq-item.is-open .faq-row-num {
          color: #111c14;
          opacity: 1;
        }

        .faq-row-title {
          font-family: var(--font-display), var(--font-heading), sans-serif;
          font-size: clamp(1.05rem, 12px + 0.85vw, 1.4rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.015em;
          word-spacing: 0.04em;
          line-height: 1.3;
          color: inherit;
        }

        /* ── Arrow Box ── */
        .faq-arrow-box {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
        }

        .faq-arrow {
          width: clamp(22px, 1.8vw, 28px);
          height: clamp(22px, 1.8vw, 28px);
          color: #16241A;
          transition: transform 220ms ease;
        }

        .faq-item.is-open .faq-arrow {
          color: #111c14;
        }

        .faq-item.is-open:hover .faq-arrow {
          transform: translate(2px, -2px);
        }

        /* ── Answer Collapse ── */
        .faq-answer-collapse {
          overflow: hidden;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .faq-answer-inner {
          padding: 0 clamp(0.75rem, 1.5vw, 1.75rem) clamp(1.5rem, 2.8vh, 2.25rem);
          margin-left: clamp(2.6rem, 4.5vw, 4.75rem);
          max-width: 74ch;
        }

        .faq-answer-text {
          margin: 0;
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(0.95rem, 11.5px + 0.5vw, 1.15rem);
          line-height: 1.7;
          color: #334438;
          font-weight: 400;
        }

        /* ── Mobile Tweaks ── */
        @media (max-width: 640px) {
          .faq-trigger {
            padding: 1.15rem 0.5rem;
            gap: 0.75rem;
          }

          .faq-row-main {
            gap: 0.75rem;
          }

          .faq-row-num {
            font-size: 1.15rem;
            font-weight: 800;
          }

          .faq-row-title {
            font-size: 0.95rem;
            letter-spacing: 0.01em;
          }

          .faq-answer-inner {
            margin-left: 0;
            padding: 0 0.5rem 1.25rem;
          }

          .faq-answer-text {
            font-size: 0.9rem;
            line-height: 1.55;
          }

          .faq-arrow {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </section>
  );
}
