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
        <div className="flex flex-col md:flex-row justify-between items-start p-8 md:p-16 lg:px-20 lg:pt-24 pb-0 md:pb-0 z-10 w-full gap-16 md:gap-8">
          
          {/* Left / Primary CTA */}
          <div className="flex flex-col gap-8 md:gap-10 max-w-lg">
            <h2 className="text-[2.5rem] md:text-5xl lg:text-[4.5rem] font-heading font-medium leading-[1.05] tracking-[-0.02em]">
              Let's start<br />from nothin'
            </h2>
            <div className="flex flex-wrap gap-4">
              <a 
                href={EVENT.devfolioUrl}
                className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#111a12] transition-colors duration-300 text-xs font-medium tracking-widest uppercase font-mono"
              >
                Apply Now ↗
              </a>
              <a 
                href={`mailto:${EVENT.email}`}
                className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#111a12] transition-colors duration-300 text-xs font-medium tracking-widest uppercase font-mono"
              >
                Drop us an email @
              </a>
            </div>
          </div>

          {/* Right / Links */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 md:mr-12 lg:mr-20">
            <div className="flex flex-col gap-3">
              <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Socials</span>
              <a href={EVENT.socials.instagram} className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">Instagram</a>
              <a href={EVENT.socials.x} className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">Twitter / X</a>
              <a href={EVENT.socials.linkedin} className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">LinkedIn</a>
              <a href={EVENT.socials.github} className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">GitHub</a>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Explore</span>
              <Link href="/tracks" className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">Tracks</Link>
              <Link href="/prizes" className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">Prizes</Link>
              <Link href="/schedule" className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">Schedule</Link>
              <Link href="/sponsors" className="text-lg md:text-xl font-medium hover:text-white/60 transition-colors">Sponsors</Link>
            </div>
          </div>
        </div>

        {/* ── Bottom Credits Line ── */}
        <div className="flex justify-between items-center px-8 md:px-16 lg:px-20 mt-16 md:mt-24 z-10 text-[0.65rem] font-mono uppercase tracking-[0.15em] text-white/40">
          <span>&copy;2026 — {EVENT.venue}</span>
          <button onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            Back to top ↑
          </button>
        </div>

        {/* ── Giant Wordmark Animation ── */}
        <div className="w-full mt-4 flex justify-center items-end overflow-hidden z-0 select-none relative h-[25vw] md:h-[22vw]">
          <div 
            ref={wordmarkRef}
            className="absolute bottom-[-10%] md:bottom-[-6%] left-0 w-full text-center font-heading font-bold text-[24vw] md:text-[23vw] leading-[0.75] tracking-[-0.03em] whitespace-nowrap text-[#e4e9dc]"
          >
            {EVENT.name}
          </div>
        </div>
      </div>
    </footer>
  );
}
