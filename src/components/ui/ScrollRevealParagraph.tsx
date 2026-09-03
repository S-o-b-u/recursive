"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WarpText from "./WarpText";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ScrollRevealParagraphProps {
  /** Text content. Can be a single string or an array of paragraph strings. */
  text: string | string[];
  /** Optional title / heading above the paragraph */
  heading?: string;
  /** Optional eyebrow / subtitle tag above the heading */
  eyebrow?: string;
  /** Visual tone: "dark" (deep forest / obsidian) or "light" (sage / parchment) */
  tone?: "dark" | "light";
  /** Whether to pin the container in place during the scroll reveal for a full cinematic beat */
  pin?: boolean;
  /** Scroll scrub speed / duration multiplier when pinned (e.g., "150vh", "200vh") */
  pinDistance?: string;
  /** Additional container className */
  className?: string;
  /** Additional paragraph typography className */
  paragraphClassName?: string;
}

export function ScrollRevealParagraph({
  text,
  heading,
  eyebrow,
  tone = "dark",
  pin = false,
  pinDistance = "160vh",
  className = "",
  paragraphClassName = "",
}: ScrollRevealParagraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const paragraphs = Array.isArray(text) ? text : [text];

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const textBlock = textBlockRef.current;
    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!container || words.length === 0) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(words, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Inactive/Active colors based on tone
      const inactiveColor =
        tone === "dark"
          ? "rgba(239, 243, 235, 0.18)"
          : "rgba(22, 36, 26, 0.18)";
      const activeColor =
        tone === "dark" ? "#EFF3EB" : "#111A12";

      // Set initial states
      gsap.set(words, {
        opacity: 0.18,
        color: inactiveColor,
      });

      if (pin) {
        // Pinned full-viewport cinematic reading beat
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: `+=${pinDistance}`,
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
          },
        });

        // Stagger illumination across all words
        tl.to(words, {
          opacity: 1,
          color: activeColor,
          stagger: 0.1,
          ease: "none",
        });
      } else {
        // In-flow scrubbed reveal as user scrolls past
        gsap.to(words, {
          opacity: 1,
          color: activeColor,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: textBlock || container,
            start: "top 78%",
            end: "bottom 38%",
            scrub: 0.6,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [tone, pin, pinDistance, text]);

  let wordIndexCounter = 0;

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal-container ${
        tone === "dark" ? "scroll-reveal--dark" : "scroll-reveal--light"
      } ${pin ? "scroll-reveal--pinned" : ""} ${className}`}
    >
      <div className="scroll-reveal-inner" ref={textBlockRef}>
        {eyebrow && <span className="scroll-reveal-eyebrow">{eyebrow}</span>}
        {heading && (
          <div className="mb-6 flex justify-center">
            <WarpText
              text={heading}
              color={tone === "dark" ? "#EFF3EB" : "#16241A"}
              fontSize="clamp(1.4375rem, 8.21px + 4.109vw, 3.8rem)"
              fontWeight={700}
              fontFamily="var(--font-display), Georgia, serif"
              letterSpacing="-0.035em"
              style={{
                width: "100%",
                maxWidth: "24ch",
                height: "clamp(32px, 11.65px + 5.652vw, 84px)",
                pointerEvents: "auto",
              }}
            />
          </div>
        )}

        <div className={`scroll-reveal-paragraphs ${paragraphClassName}`}>
          {paragraphs.map((pText, pIdx) => {
            const words = pText.split(/\s+/).filter(Boolean);
            return (
              <p key={pIdx} className="scroll-reveal-para">
                {words.map((word, wIdx) => {
                  const currentIndex = wordIndexCounter++;
                  return (
                    <span
                      key={`${pIdx}-${wIdx}`}
                      ref={(el) => {
                        wordsRef.current[currentIndex] = el;
                      }}
                      className="scroll-reveal-word"
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
        .scroll-reveal-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(4rem, 10vh, 8rem) clamp(1.5rem, 6vw, 4rem);
          box-sizing: border-box;
        }

        .scroll-reveal--pinned {
          min-height: 100vh;
          min-height: 100dvh;
          height: 100vh;
          height: 100dvh;
          padding: 0 clamp(1.5rem, 6vw, 4rem);
          overflow: hidden;
        }

        .scroll-reveal--dark {
          background-color: var(--color-bg-deep, #101b12);
          color: #eff3eb;
        }

        .scroll-reveal--light {
          background-color: var(--color-bg, #eff3eb);
          color: #111a12;
        }

        .scroll-reveal-inner {
          width: 100%;
          max-width: 52rem;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .scroll-reveal-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 1.1vw, 0.85rem);
          font-weight: 550;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8fc45a;
          margin-bottom: 1rem;
        }

        .scroll-reveal-heading {
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(2.5rem, 6.5vw, 4.5rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin: 0 0 clamp(1.75rem, 4vh, 3rem) 0;
          text-wrap: balance;
        }

        .scroll-reveal-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .scroll-reveal-para {
          font-family: var(--font-dm-sans), system-ui, -apple-system, sans-serif;
          font-size: clamp(1.0rem, 12.56px + 0.957vw, 1.55rem);
          font-weight: 350;
          line-height: 1.68;
          letter-spacing: -0.015em;
          margin: 0;
          text-wrap: pretty;
        }

        .scroll-reveal-word {
          display: inline-block;
          margin-right: 0.28em;
          will-change: opacity, color;
          transition: transform 120ms ease-out;
        }

        @media (max-width: 640px) {
          .scroll-reveal-heading {
            font-size: clamp(2rem, 9vw, 3rem);
            margin-bottom: 1.5rem;
          }
          .scroll-reveal-para {
            font-size: clamp(1.05rem, 4.5vw, 1.25rem);
            line-height: 1.6;
          }
        }
      `}</style>
    </div>
  );
}

export default ScrollRevealParagraph;
