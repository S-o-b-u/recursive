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
            className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4"
          >
            Ask in Discord
          </a>{" "}
          — we answer fast.
        </p>
      }
    >
      <div className="grid gap-2.5">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={faq.q} delay={i * 0.03}>
              <div className="glass glass-sheen overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="text-[var(--font-size-lg)] font-light tracking-[var(--tracking-snug)]">
                    {faq.q}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: EASE_OUT }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,0.6)] text-[var(--color-accent-deep)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
                      <p className="px-6 pb-6 leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)] max-w-[60ch]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
