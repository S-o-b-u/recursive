"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { FAQS, EVENT } from "@/data/hackathon";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <SectionWrapper
      id="faq"
      label="FAQ"
      heading={<>Questions people actually ask.</>}
      lede={
        <p>
          Anything missing?{" "}
          <a
            href={EVENT.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4 text-emerald-800 font-medium"
          >
            Ask in Discord
          </a>{" "}
          — we answer fast.
        </p>
      }
    >
      <div className="grid gap-3.5 pt-2">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={faq.q} delay={i * 0.03}>
              <div
                className={`faq-card ${isOpen ? "faq-card-open" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="faq-question">
                    {faq.q}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: EASE_OUT }}
                    className="faq-toggle-btn"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduced ? undefined : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.42, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-black/6">
                        <p className="faq-answer">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>

      <style>{`
        /* ── Tactile Manila Folder Index Card ── */
        .faq-card {
          position: relative;
          background: #fbfdfa;
          border: 1px solid rgba(47, 85, 39, 0.18);
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(25, 40, 25, 0.05);
          overflow: hidden;
          transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .faq-card:hover {
          box-shadow: 0 8px 24px rgba(25, 40, 25, 0.09);
          border-color: rgba(47, 85, 39, 0.3);
        }
        .faq-card-open {
          background: #ffffff;
          border-color: rgba(92, 140, 58, 0.4);
          box-shadow: 0 12px 32px rgba(25, 45, 25, 0.1);
        }

        .faq-question {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 1.08rem;
          font-weight: 550;
          color: #122415;
          letter-spacing: -0.015em;
        }

        .faq-toggle-btn {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #eef5e8;
          color: #2f5527;
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 6px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(143, 196, 90, 0.3);
        }

        .faq-answer {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.95rem;
          line-height: 1.65;
          color: #4a634c;
          max-width: 62ch;
        }
      `}</style>
    </SectionWrapper>
  );
}
