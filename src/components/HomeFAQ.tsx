"use client";

import React from "react";
import { FAQS, EVENT } from "@/data/hackathon";

export default function HomeFAQ() {
  return (
    <section
      id="faq"
      className="relative flex flex-col items-center justify-center py-20 sm:py-28 md:py-36 px-4 w-full bg-transparent scroll-mt-28 z-10"
    >
      {/* ── Main Clean White Container Sheet matching WhatsApp Image ── */}
      <div className="relative w-full max-w-[560px] md:max-w-[620px] bg-white rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 md:p-12 shadow-[0_24px_70px_rgba(0,0,0,0.08)] border border-black/[0.08] flex flex-col">
        {/* Header: Title + Count + Circular Arrow Button */}
        <div className="flex items-start justify-between w-full mb-8 sm:mb-10">
          <div className="flex flex-col items-start text-left">
            <h2 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-none font-sans">
              FAQs
            </h2>
            <span className="font-mono text-sm sm:text-base text-black/80 tracking-widest mt-3 sm:mt-4">
              ( {String(FAQS.length).padStart(2, "0")} )
            </span>
          </div>

          <a
            href={EVENT.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask questions on Discord"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200 mt-1 flex-shrink-0 group shadow-sm"
            title="Ask in Discord"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform rotate-90 group-hover:scale-110 transition-transform"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Vertical Stack of Black Pill Cards with White Question Capsules */}
        <div className="flex flex-col gap-4 sm:gap-5 w-full">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-black text-white rounded-[26px] sm:rounded-[32px] p-3 sm:p-3.5 flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.01]"
            >
              {/* White Question Capsule */}
              <div className="bg-[#fcfcfd] text-black font-semibold text-sm sm:text-base md:text-[1.02rem] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full w-full flex items-center text-left leading-snug tracking-tight">
                {faq.q}
              </div>

              {/* White Answer Text on Black Body */}
              <p className="text-white/95 text-xs sm:text-[0.92rem] px-5 sm:px-6 pt-0.5 pb-2 leading-relaxed text-left font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
