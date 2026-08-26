"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENT } from "@/data/hackathon";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import WarpText from "@/components/ui/WarpText";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const center = centerRef.current;
    const dock = dockRef.current;

    if (!section || !center || !dock || reduced) return;

    const ctx = gsap.context(() => {
      // Cinematic scroll: wordmark & buttons lift & fade, video subtly scales into the bottom blend
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(
        center,
        {
          y: -50,
          opacity: 0,
          ease: "none",
        },
        0
      )
      .to(
        dock,
        {
          y: -30,
          opacity: 0,
          ease: "none",
        },
        0
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {/* ── 100% Crisp, Pure Video Background (Zero filters, no blur/jitter transforms) ── */}
      <video
        ref={videoRef}
        className="hero-video"
        src="/bg/hero_bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* ── Main Wordmark with WebGL WarpText ── */}
      <motion.div
        className="hero-center-content"
        ref={centerRef}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <WarpText
          src="/logo.png"
          color="#111a12"
          warpStrength={0.08}
          warpScale={1.7}
          speed={0.55}
          pointerInfluence={0.42}
          pointerStrength={0.38}
          refraction={0.018}
          ripple
          style={{
            width: "100%",
            maxWidth: "min(78vw, 640px)",
            height: "clamp(85px, 13vw, 150px)",
            pointerEvents: "auto",
          }}
        />
      </motion.div>

      {/* ── Bottom Floating Pill Dock ── */}
      <motion.div
        className="hero-bottom-area"
        ref={dockRef}
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
      >
        <div className="hero-action-dock-split">
          <LiquidMetalButton
            label="Register on Devfolio"
            href={EVENT.devfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            width={190}
            height={46}
          />

          <LiquidMetalButton
            label="Join Discord"
            href={EVENT.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            width={145}
            height={46}
            icon={
              <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", color: "#ffffff", fill: "currentColor" }} aria-hidden="true">
                <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z" />
              </svg>
            }
          />
        </div>
      </motion.div>

      {/* ── Simple Clean Chair Annotation (No Box, No Glow) ── */}
      <motion.div
        className="hero-chair-annotation"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
      >
        <svg
          className="chair-arrow"
          width="96"
          height="76"
          viewBox="0 0 120 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M110,35 C80,10 45,65 60,75 C80,90 90,45 60,45 C35,45 30,65 5,65"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30,40 L5,65 L30,90"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <a href="#about" className="chair-note" aria-label="Scroll to learn about the chair">
          <p className="chair-text">
            bro put a plastic chair on a hill<br />and called it a hackathon 
          </p>
          <span className="chair-sub">scroll for lore ↓</span>
        </a>
      </motion.div>

      <style>{`
        .hero {
          position: relative;
          height: 100svh;
          width: 100%;
          overflow: hidden;
          background: #e4e9dc;
        }

        /* ── 100% Clean Video Plate — Unscaled & Hardware Accelerated for Pure Clarity ── */
        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* ── Top Center Block: Wordmark with WebGL Warp ── */
        .hero-center-content {
          position: absolute;
          top: clamp(12%, 16vh, 20%);
          left: 0;
          right: 0;
          width: 100%;
          max-width: 1100px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 10;
          pointer-events: auto;
          will-change: transform, opacity;
          padding-inline: 1rem;
        }

        .hero-wordmark {
          margin: 0;
          font-family: var(--font-display), var(--font-geist-sans), sans-serif;
          font-weight: 800;
          font-size: clamp(3.8rem, 11.5vw, 7.8rem);
          line-height: 0.9;
          letter-spacing: -0.035em;
          text-transform: uppercase;
          color: #111a12;
          text-shadow: 0 1px 18px rgba(255, 255, 255, 0.4);
        }

        /* ── Simple Clean Chair Annotation ── */
        .hero-chair-annotation {
          position: absolute;
          left: calc(50% + 72px);
          top: 53.5%;
          transform: translateY(-50%);
          z-index: 15;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          pointer-events: auto;
        }

        .chair-arrow {
          color: #1a291c;
          flex-shrink: 0;
          opacity: 0.7;
          margin-top: 0.2rem;
        }

        .chair-note {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          text-decoration: none;
          cursor: pointer;
        }
        .chair-note:hover .chair-text {
          opacity: 0.7;
        }

        .chair-text {
          font-family: var(--font-hiruko), var(--font-geist-sans), sans-serif;
          font-size: 1rem;
          font-weight: 900;
          line-height: 1.35;
          letter-spacing: -0.015em;
          color: #111a12;
          margin: 0;
          white-space: nowrap;
          transition: opacity 150ms ease;
        }

        .chair-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 450;
          color: #566a55;
          letter-spacing: -0.01em;
        }

        /* ── Bottom Unified Glass Dock ── */
        .hero-bottom-area {
          position: absolute;
          bottom: clamp(2.5rem, 6vh, 4rem);
          left: 0;
          right: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 20;
          will-change: transform, opacity;
          padding-inline: 1rem;
        }

        .hero-action-dock-split {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-dock-btn-glass {
          border-radius: var(--radius-pill);
        }

        .hero-dock-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #f3f8ee;
          background: transparent;
          padding: 0.65rem 1.35rem;
          border-radius: var(--radius-pill);
          transition: filter 250ms ease;
          white-space: nowrap;
        }
        .block:hover .hero-dock-btn-primary {
          filter: brightness(1.08);
        }

        .hero-dock-btn-discord {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #F3F8EE;
          background: transparent;
          padding: 0.65rem 1.35rem;
          border-radius: var(--radius-pill);
          transition: filter 250ms ease;
          white-space: nowrap;
        }
        .block:hover .hero-dock-btn-discord {
          filter: brightness(1.15);
        }

        .hero-discord-icon {
          color: #FFFFFF;
          width: 1.15rem;
          height: 1.15rem;
        }

        @media (max-width: 860px) {
          .hero-chair-annotation {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .hero-center-content {
            top: 22%;
          }
          .hero-wordmark {
            font-size: clamp(2.8rem, 14vw, 4.5rem);
          }
          .hero-action-dock-split {
            flex-direction: column;
            width: calc(100vw - 2.5rem);
            max-width: 20rem;
          }
          .hero-action-dock-split .block {
            width: 100%;
          }
          .hero-dock-btn-glass,
          .hero-dock-btn-primary,
          .hero-dock-btn-discord {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
