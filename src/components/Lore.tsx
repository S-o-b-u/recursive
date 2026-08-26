"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Chapter I — THE LORE
 * Pinned cinematic paragraph reveal powered by GSAP ScrollTrigger + Lenis.
 * Words illuminate progressively from muted to bright contrast as the visitor scrolls.
 */

const LORE_PARAGRAPH_1 =
  "Four plastic chairs resting on a silent green hill under an open sky. That is the whole premise of RECURSIVE. No fluorescent conference halls, no keynote speeches, and no corporate noise.";

const LORE_PARAGRAPH_2 =
  "Recursion and organic growth are the same phenomenon wearing different clothes. A fern unfurls by repeating one instruction at a smaller scale. A river branches by branching. You arrive with one small idea and a 36-hour deadline to see what it grows into. The fourth chair is empty — and it is waiting for you.";

export default function Lore() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const paragraphs = [LORE_PARAGRAPH_1, LORE_PARAGRAPH_2];

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!section || !container || words.length === 0) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(words, { opacity: 1, color: "#EFF3EB" });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 861px)",
          isMobile: "(max-width: 860px)",
        },
        (context) => {
          const { isDesktop } = context.conditions!;
          const pinDistance = isDesktop ? "220%" : "180%";

          // Pinned scroll timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${pinDistance}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });

          // 1. Initial subtle entrance for header
          tl.fromTo(
            [eyebrowRef.current, headingRef.current],
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.15 },
            0
          );

          // 2. Progressive word-by-word illumination
          tl.to(
            words,
            {
              opacity: 1,
              color: "#EFF3EB",
              stagger: 0.04,
              ease: "none",
              duration: 0.8,
            },
            0.1
          );

          // 3. Highlight the final statement
          const lastWords = words.slice(-8);
          tl.to(
            lastWords,
            {
              color: "#8FC45A",
              textShadow: "0 0 20px rgba(143, 196, 90, 0.4)",
              duration: 0.15,
            },
            0.85
          );
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  let wordIndexCounter = 0;

  return (
    <section ref={sectionRef} id="lore" className="lore-section" aria-label="The Lore">
      <div ref={containerRef} className="lore-content">
        <span ref={eyebrowRef} className="lore-eyebrow">
          The Lore
        </span>

        <h2 ref={headingRef} className="lore-heading">
          Why The Chair Exists
        </h2>

        <div className="lore-paragraphs">
          {paragraphs.map((pText, pIdx) => {
            const words = pText.split(/\s+/).filter(Boolean);
            return (
              <p key={pIdx} className="lore-paragraph">
                {words.map((word, wIdx) => {
                  const currentIndex = wordIndexCounter++;
                  return (
                    <span
                      key={`${pIdx}-${wIdx}`}
                      ref={(el) => {
                        wordsRef.current[currentIndex] = el;
                      }}
                      className="lore-word"
                    >
                      {word}
                      {wIdx < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </div>

      <style>{`
        .lore-section {
          position: relative;
          height: 100svh;
          width: 100%;
          background: 
            radial-gradient(ellipse 90% 45% at 50% 0%, rgba(92, 140, 58, 0.22) 0%, transparent 65%),
            radial-gradient(circle 700px at 50% 45%, rgba(47, 85, 39, 0.14) 0%, transparent 80%),
            linear-gradient(180deg, #182B14 0%, #122010 38%, #0D170D 100%);
          color: #EFF3EB;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(1.5rem, 6vw, 4rem);
          box-sizing: border-box;
        }

        .lore-content {
          width: 100%;
          max-width: 50rem;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .lore-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 1.2vw, 0.85rem);
          font-weight: 550;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8FC45A;
          margin-bottom: 0.75rem;
        }

        .lore-heading {
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(2.4rem, 6.5vw, 4.4rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.035em;
          color: #EFF3EB;
          margin: 0 0 clamp(1.75rem, 4.5vh, 3.25rem) 0;
          text-wrap: balance;
        }

        .lore-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          width: 100%;
        }

        .lore-paragraph {
          font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
          font-size: clamp(1.15rem, 2.3vw, 1.55rem);
          font-weight: 350;
          line-height: 1.68;
          letter-spacing: -0.015em;
          margin: 0;
          text-wrap: pretty;
        }

        .lore-word {
          display: inline-block;
          margin-right: 0.28em;
          color: rgba(239, 243, 235, 0.18);
          opacity: 0.18;
          will-change: opacity, color;
          transition: text-shadow 300ms ease;
        }

        @media (max-width: 640px) {
          .lore-heading {
            font-size: clamp(1.85rem, 8.5vw, 2.75rem);
            margin-bottom: 1.5rem;
          }
          .lore-paragraph {
            font-size: clamp(1.05rem, 4.2vw, 1.25rem);
            line-height: 1.62;
          }
        }
      `}</style>
    </section>
  );
}
