"use client";

import React from "react";
import Ornament from "@/components/ui/Ornament";
import { EVENT } from "@/data/hackathon";

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface FaqRow {
  id: string;
  speed?: string;
  direction?: "left" | "right";
  faqItems: FaqItem[];
}

export interface FaqData {
  mainTitle: string;
  mainSubtitle: string;
  rows: FaqRow[];
}

/**
 * FaqCard
 * Reusable card for a single FAQ item matching habit-faq-scroller design.
 */
export const FaqCard = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <div className="flex flex-col items-start justify-start gap-3 p-6 sm:p-7 bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-[280px] sm:w-[340px] md:w-[390px] flex-shrink-0 faq-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:border-black/20 text-left">
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 faq-title tracking-tight leading-snug">
        {question}
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 faq-answer leading-relaxed">
        {answer}
      </p>
    </div>
  );
};

/**
 * HorizontalScroller
 * Wraps children and creates a seamless horizontal looping animation.
 */
export const HorizontalScroller = ({
  children,
  speed = "40s",
  direction = "left",
}: {
  children: React.ReactNode;
  speed?: string;
  direction?: "left" | "right";
}) => {
  const animationClass =
    direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal";

  const style = { "--scroll-duration": speed } as React.CSSProperties;

  return (
    <div className="w-full overflow-hidden group relative scroller-mask py-1.5">
      <div className={`flex ${animationClass}`} style={style}>
        {/* Set 1 */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-5 sm:gap-6 px-3">
          {children}
        </div>
        {/* Set 2 (duplicate for seamless loop) */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-5 sm:gap-6 px-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * FaqSection
 * Assembles title, subtitle, and multiple horizontal rows.
 */
const FaqSection = ({ data }: { data: FaqData }) => {
  return (
    <section
      id="faq"
      className="relative flex flex-col items-center gap-8 sm:gap-12 md:gap-16 py-16 sm:py-24 md:py-32 w-full max-w-[100vw] overflow-hidden scroll-mt-24 z-10"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 text-center z-10 max-w-3xl px-4">
        <Ornament />
        <span className="font-mono text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#2d4d33]">
          006 · Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
          {data.mainTitle}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
          {data.mainSubtitle}{" "}
          <a
            href={EVENT.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-semibold underline underline-offset-4 decoration-[#8fc45a] hover:text-[#19401f] transition-colors"
          >
            Ask in Discord →
          </a>
        </p>
      </div>

      {/* 3 Horizontal Scroller Rows */}
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 z-10 w-full">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item, idx) => (
              <FaqCard key={item.id || idx} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
