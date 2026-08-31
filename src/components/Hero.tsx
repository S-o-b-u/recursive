"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EVENT } from "@/data/hackathon";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import WarpText from "@/components/ui/WarpText";
import logoImg from "../../public/images/logo.png";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === "undefined") return true;
    return (
      document.documentElement.dataset.intro === "done" ||
      (!document.querySelector(".intro-scene") && !document.querySelector(".intro-root"))
    );
  });

  useEffect(() => {
    if (introFinished) return;
    const onIntroDone = () => setIntroFinished(true);
    window.addEventListener("recursive-intro-done", onIntroDone);

    const observer = new MutationObserver(() => {
      if (
        document.documentElement.dataset.intro === "done" ||
        !document.querySelector(".intro-root")
      ) {
        setIntroFinished(true);
      }
    });

    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-intro"],
      });
    }

    const fallbackTimer = setTimeout(() => setIntroFinished(true), 8500);

    return () => {
      window.removeEventListener("recursive-intro-done", onIntroDone);
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [introFinished]);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {/* ── 100% Crisp, Pure Video Background (Zero filters, no blur/jitter transforms) ── */}
      <div className="hero-video-wrap">
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
      </div>

      {/* ── Main Wordmark with WebGL WarpText ── */}
      <motion.div
        className="hero-center-content"
        ref={centerRef}
        initial={reduced ? false : { opacity: 0, y: 22 }}
        animate={introFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.08 }}
      >
        <div className="hero-warp-wrap">
          <WarpText
            src={logoImg.src || "/images/logo.png"}
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
              height: "100%",
              pointerEvents: "auto",
            }}
          />
        </div>
      </motion.div>

      {/* ── Bottom Floating Pill Dock ── */}
      <motion.div
        className="hero-bottom-area"
        ref={dockRef}
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={introFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.85, delay: 0.22, ease: EASE_OUT }}
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

      {/* ── Mossy Log Natural Divider Over Seam ── */}
      <div className="hero-log-divider" aria-hidden="true">
        <img
          src="/images/log.png"
          alt=""
          className="hero-log-img"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>

      {/* ── Simple Clean Chair Annotation (No Box, No Glow) ── */}
      <div className="hero-chair-annotation">
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
          <p className="chair-text" style={{ color: "#000000", textShadow: "none" }}>
            bro put a plastic chair on a hill<br />and called it a hackathon 
          </p>
          <span className="chair-sub" style={{ color: "#000000", textShadow: "none" }}>scroll for lore ↓</span>
        </a>
      </div>

      <style href="hero-style" precedence="default" suppressHydrationWarning>{`
        .hero {
          position: relative;
          height: 100svh;
          width: 100%;
          overflow-x: clip;
          overflow-y: visible;
          background: #e4e9dc;
          z-index: 10;
        }

        .hero-video-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
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
          /* The floor used to be 7.5rem, which on a 375px-tall landscape phone
             spent a third of the screen before the logo even started. */
          top: clamp(3.25rem, 12vh, 10.5rem);
          left: 0;
          right: 0;
          width: 100%;
          max-width: 1800px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 10;
          pointer-events: auto;
          will-change: transform, opacity;
          padding-inline: clamp(0.5rem, 2vw, 1.5rem);
        }

        .hero-warp-wrap {
          position: relative;
          width: 100%;
          max-width: min(96vw, 1600px);
          height: min(clamp(200px, 32vw, 420px), 40vh);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-wordmark {
          margin: 0;
          font-family: var(--font-display), var(--font-dm-sans), sans-serif;
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
          z-index: 30;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          pointer-events: auto;
        }

        .chair-arrow {
          color: #000000 !important;
          flex-shrink: 0;
          opacity: 1 !important;
          margin-top: 0.2rem;
          filter: none !important;
        }

        .chair-note {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          text-decoration: none;
          cursor: pointer;
        }
        .chair-note:hover .chair-text {
          opacity: 0.75;
        }

        .chair-text {
          font-family: var(--font-dm-sans), var(--font-display), sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          line-height: 1.32;
          letter-spacing: -0.015em;
          color: #000000 !important;
          margin: 0;
          text-shadow: none !important;
          transition: opacity 150ms ease;
        }

        .chair-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #000000 !important;
          letter-spacing: 0.02em;
          text-shadow: none !important;
        }

        /* ── Mossy Log Natural Divider Over Seam ── */
        .hero-log-divider {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          width: 100%;
          max-width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          z-index: 12;
        }

        .hero-log-img {
          width: clamp(1100px, 110vw, 2200px);
          max-width: none;
          height: auto;
          aspect-ratio: 2172 / 724;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          filter: none;
          transform: translateZ(0);
        }

        /* ── Bottom Unified Glass Dock ── */
        .hero-bottom-area {
          position: absolute;
          bottom: clamp(5rem, 11vh, 7rem);
          left: 0;
          right: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 25;
          will-change: transform, opacity;
          padding-inline: 1rem;
          pointer-events: auto;
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

        @media (max-width: 1024px) {
          .hero-center-content {
            top: clamp(4.5rem, 10.5vh, 7.2rem);
          }
          .hero-warp-wrap {
            height: min(clamp(150px, 28vw, 300px), 32vh);
          }
        }

        @media (max-width: 860px) {
          .hero-center-content {
            top: clamp(4.2rem, 9.5vh, 6.4rem);
          }
          .hero-warp-wrap {
            height: clamp(125px, 26vw, 220px);
          }
          .hero-chair-annotation {
            left: 50%;
            top: clamp(42%, 46vh, 50%);
            bottom: auto;
            transform: translateX(-50%);
            gap: 0.25rem;
            max-width: calc(100vw - 2rem);
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: center;
          }
          .chair-note {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .chair-arrow {
            width: 44px;
            height: 52px;
            margin-top: 0.1rem;
            transform: rotate(-90deg);
            opacity: 0.88;
            flex-shrink: 0;
          }
          .chair-arrow path {
            stroke-width: 6;
          }
          .chair-text {
            font-size: 0.78rem;
            line-height: 1.25;
            text-align: center;
            text-shadow: 0 1px 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5);
          }
          .chair-sub {
            font-size: 0.62rem;
            color: #3b5a32;
            text-align: center;
            text-shadow: 0 1px 6px rgba(255, 255, 255, 0.6);
          }
          .hero-log-img {
            width: clamp(950px, 130vw, 1500px);
          }
          .hero-log-divider {
            transform: translate(-50%, 50%);
          }
        }

        @media (max-width: 600px) {
          .hero-center-content {
            top: clamp(5.4rem, 11vh, 7.2rem);
            padding-inline: 0;
          }
          .hero-warp-wrap {
            height: clamp(140px, 34vw, 210px);
            max-width: 100vw;
          }
          .hero-chair-annotation {
            left: 50%;
            top: clamp(40%, 44vh, 48%);
            bottom: auto;
            transform: translateX(-50%);
            gap: 0.3rem;
            max-width: calc(100vw - 2rem);
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: center;
            z-index: 30;
          }
          .chair-arrow {
            width: 38px;
            height: 44px;
            margin-top: 0.05rem;
            transform: rotate(-90deg);
            opacity: 1 !important;
            color: #000000 !important;
            filter: none !important;
          }
          .chair-text {
            font-size: 0.84rem !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;
            color: #000000 !important;
            text-align: center !important;
            text-shadow: none !important;
          }
          .chair-sub {
            font-size: 0.68rem !important;
            font-weight: 700 !important;
            color: #000000 !important;
            text-align: center !important;
            text-shadow: none !important;
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
          .hero-log-img {
            width: clamp(720px, 160vw, 1000px);
          }
          .hero-log-divider {
            transform: translate(-50%, 50%);
          }
          .hero-bottom-area {
            bottom: clamp(3.6rem, 7vh, 5.2rem);
          }
        }

        @media (max-width: 480px) {
          .hero-center-content {
            top: clamp(5rem, 10.5vh, 6.8rem);
            padding-inline: 0;
          }
          .hero-warp-wrap {
            height: clamp(135px, 32vw, 195px);
            max-width: 100vw;
          }
          .hero-chair-annotation {
            top: clamp(39%, 43vh, 47%);
          }
          .chair-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}
