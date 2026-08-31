"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import { EVENT } from "@/data/hackathon";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const wordmark = wordmarkRef.current;
    if (!footer || !wordmark) return;

    const ctx = gsap.context(() => {
      // Scrubbed parallax reveal for the giant text
      // As you scroll the footer into view, the text slides up smoothly
      gsap.fromTo(
        wordmark,
        { y: "55%" },
        {
          y: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer 
      ref={footerRef}
      className="footer-shell relative w-full px-2 pb-2 pt-16 md:px-4 md:pb-4 md:pt-24 bg-[#e4e9dc] flex flex-col justify-end"
    >
      <div className="bg-[#111a12] text-[#e4e9dc] rounded-[2rem] md:rounded-[3rem] w-full flex flex-col overflow-hidden relative">
        
        {/* ── Top Content ── */}
        <div className="flex flex-col md:flex-row justify-between items-start p-6 pt-12 md:p-16 lg:px-20 lg:pt-24 pb-0 md:pb-0 z-10 w-full gap-12 md:gap-8">
          
          {/* Left / Primary CTA */}
          <div className="flex flex-col gap-6 md:gap-10 max-w-lg">
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-heading font-medium leading-[1.05] tracking-[-0.02em]">
              Let's start<br />from nothin'
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <a 
                href={EVENT.devfolioUrl}
                className="px-5 md:px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#111a12] transition-colors duration-300 text-[0.65rem] md:text-xs font-medium tracking-widest uppercase font-mono text-center"
              >
                Apply Now ↗
              </a>
              <a 
                href={`mailto:${EVENT.email}`}
                className="px-5 md:px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#111a12] transition-colors duration-300 text-[0.65rem] md:text-xs font-medium tracking-widest uppercase font-mono text-center"
              >
                Drop us an email @
              </a>
            </div>
          </div>

          {/* Right / Links */}
          <div className="flex flex-row justify-between md:justify-start w-full md:w-auto gap-12 sm:gap-24 md:mr-4 lg:mr-12">
            <div className="flex flex-col gap-3">
              <span className="text-[0.6rem] md:text-[0.65rem] font-mono uppercase tracking-[0.2em] text-white/40 mb-1 md:mb-2">Socials</span>
              <a href={EVENT.socials.instagram} className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">Instagram</a>
              <a href={EVENT.socials.x} className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">Twitter / X</a>
              <a href={EVENT.socials.linkedin} className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">LinkedIn</a>
              <a href={EVENT.socials.github} className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">GitHub</a>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[0.6rem] md:text-[0.65rem] font-mono uppercase tracking-[0.2em] text-white/40 mb-1 md:mb-2">Explore</span>
              <Link href="/tracks" className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">Tracks</Link>
              <Link href="/prizes" className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">Prizes</Link>
              <Link href="/schedule" className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">Schedule</Link>
              <Link href="/sponsors" className="text-base md:text-xl font-medium hover:text-white/60 transition-colors">Sponsors</Link>
            </div>
          </div>
        </div>

        {/* ── Bottom Credits Line ── */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-6 md:px-16 lg:px-20 mt-12 md:mt-24 z-10 text-[0.6rem] md:text-[0.65rem] font-mono uppercase tracking-[0.1em] md:tracking-[0.15em] text-white/40 gap-6">
          <span>&copy;2026 — {EVENT.venue}</span>
          <button onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            Back to top ↑
          </button>
        </div>

        {/* ── Giant Wordmark Animation ── */}
        <div className="w-full mt-6 md:mt-8 flex justify-center items-end overflow-hidden z-0 select-none relative h-[18vw] md:h-[18vw]">
          <div 
            ref={wordmarkRef}
            className="absolute bottom-[-10%] md:bottom-[-8%] left-0 w-full text-center font-heading font-bold text-[17.5vw] md:text-[17.2vw] leading-[0.75] tracking-[-0.03em] whitespace-nowrap text-[#e4e9dc]"
          >
            {EVENT.name}
          </div>
        </div>
      </div>
    </footer>
  );
}
