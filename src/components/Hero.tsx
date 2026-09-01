"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EVENT } from "@/data/hackathon";
import { prefersLiteMedia } from "@/lib/device";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import WarpText from "@/components/ui/WarpText";
import { Lock } from "lucide-react";
import logoImg from "../../public/images/logo.png";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  // Background video plate showing the hill and moving grass on all devices
  const [useVideo, setUseVideo] = useState(true);
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("muted", "");
      video.play().catch(() => {});
      if (typeof IntersectionObserver !== "undefined") {
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        }, { threshold: 0.05 });
        io.observe(video);
        return () => io.disconnect();
      }
    }
  }, []);

  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === "undefined") return true;
    return (
      document.documentElement.dataset.intro === "done" ||
      (!document.querySelector(".intro-scene") && !document.querySelector(".intro-root"))
    );
  });

  // The initializer above runs during render -- before IntroSequence has
  // committed its DOM or set data-intro -- so "no intro elements on the page"
  // is indistinguishable from "the intro has not mounted yet". Left alone, the
  // hero concludes the intro is already over, plays its entrance behind the
  // curtain, and is sitting perfectly still by the time the curtain lifts.
  // That is what made the hand-off read flat. Re-check once after mount, when
  // the sibling's DOM definitely exists.
  useEffect(() => {
    // data-intro is the dependable signal: IntroSequence is rendered before
    // this component, so its effect (which sets "playing", or "done" when the
    // intro is skipped) has already run by the time this one does. Querying for
    // .intro-root instead is not reliable -- the pending phase renders
    // different markup.
    if (document.documentElement.dataset.intro !== "done") setIntroFinished(false);
  }, []);

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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {/* ── 100% Crisp, Pure Video Background (Zero filters, no blur/jitter transforms) ── */}
      <div className="hero-video-wrap">
        {/* The still poster is always painted first: it is the hero background
            on phones / data-saver / reduced-motion (where the 4K loop never
            loads), and the instant, crisp paint under the video everywhere
            else — so the hero is never a flat empty plate. */}
        <img
          className="hero-video hero-poster"
          src="/images/hero_poster.jpg"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
        {useVideo && (
          <video
            ref={videoRef}
            className="hero-video"
            src="/bg/hero_bg.mp4"
            poster="/images/hero_poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Main Wordmark with WebGL WarpText ── */}
      <motion.div
        className="hero-center-content"
        ref={centerRef}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={
          introFinished
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 14 }
        }
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.02 }}
        style={{
          top: isMobile ? "clamp(7.8rem, 18.5vh, 10.5rem)" : undefined,
        }}
      >
        <div className="hero-warp-wrap">
          <WarpText
            src={logoImg.src || "/images/logo.png"}
            color="linear-gradient(180deg, #070e08 0%, #111c14 55%, #1d3320 100%)"
            warpStrength={0.035}
            warpScale={1.5}
            speed={0.35}
            pointerInfluence={0.22}
            pointerStrength={0.10}
            refraction={0.005}
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
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={
          introFinished
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 14 }
        }
        transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
      >
        <div className="hero-action-dock-split">
          <div className="hero-locked-wrap" title="Registration currently locked · Revealing soon">
            <LiquidMetalButton
              label="Register on Devfolio"
              width={190}
              height={46}
              iconPosition="right"
              icon={
                <Lock
                  size={15}
                  style={{
                    color: "#ffffff",
                    stroke: "#ffffff",
                    marginLeft: "2px",
                    display: "inline-block",
                    verticalAlign: "middle",
                    filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.4))",
                  }}
                  aria-hidden="true"
                />
              }
            />
          </div>

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

        <a href="#about" className="chair-note" aria-label="Scroll to learn about the chair" style={{ color: "#000000", textDecoration: "none" }}>
          <p className="chair-text" style={{ color: "#000000", WebkitTextFillColor: "#000000", opacity: 1, textShadow: "none" }}>
            bro put a plastic chair on a hill<br />and called it a hackathon 
          </p>
          <span className="chair-sub" style={{ color: "#000000", WebkitTextFillColor: "#000000", opacity: 1, textShadow: "none" }}>scroll for lore ↓</span>
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
          top: clamp(5.6rem, 12vh, 8.2rem);
          left: 0;
          right: 0;
          width: 100%;
          max-width: 1920px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 10;
          pointer-events: auto;
          will-change: transform, opacity;
          padding-inline: clamp(0.5rem, 1.5vw, 1.2rem);
        }

        .hero-warp-wrap {
          position: relative;
          width: 100%;
          max-width: min(92vw, 1120px);
          height: clamp(165px, 24vw, 280px);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-wordmark {
          margin: 0;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(3.8rem, 11.5vw, 7.8rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
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
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          opacity: 1 !important;
        }
        @media (hover: hover) {
          .chair-note:hover .chair-text {
            opacity: 0.8;
          }
        }

        .chair-text {
          font-family: var(--font-dm-sans), var(--font-display), sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          line-height: 1.32;
          letter-spacing: -0.015em;
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          opacity: 1 !important;
          margin: 0;
          text-shadow: none !important;
        }

        .chair-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          opacity: 1 !important;
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
            top: clamp(5.0rem, 11vh, 7.0rem);
          }
          .hero-warp-wrap {
            max-width: min(94vw, 940px);
            height: clamp(140px, 25vw, 230px);
          }
        }

        @media (max-width: 860px) {
          .hero-center-content {
            top: clamp(7.5rem, 18vh, 10.5rem);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .hero-warp-wrap {
            width: min(76vw, calc(22vh * 2.22)) !important;
            max-width: min(76vw, 540px) !important;
            aspect-ratio: 1559 / 702 !important;
            height: auto !important;
            max-height: 22vh !important;
            margin-inline: auto !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-chair-annotation {
            left: calc(50% + 24px);
            top: 53.5%;
            transform: translateY(-50%);
            gap: 0.4rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
          .chair-note {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
          .chair-arrow {
            width: 54px;
            height: 42px;
            margin-top: 0;
            transform: none;
            opacity: 1 !important;
            color: #000000 !important;
            filter: none !important;
            flex-shrink: 0;
          }
          .chair-arrow path {
            stroke-width: 5.5;
          }
          .chair-text {
            font-size: 0.78rem !important;
            font-weight: 800 !important;
            line-height: 1.25 !important;
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
            text-align: left !important;
            text-shadow: none !important;
            white-space: nowrap;
          }
          .chair-sub {
            font-size: 0.62rem !important;
            font-weight: 700 !important;
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
            text-align: left !important;
            text-shadow: none !important;
          }
          .hero-log-img {
            width: clamp(950px, 130vw, 1500px);
          }
          .hero-log-divider {
            transform: translate(-50%, 50%);
          }
        }

        .hero-locked-wrap {
          display: inline-flex;
          position: relative;
          cursor: not-allowed;
          opacity: 0.9;
          transition: opacity 180ms ease;
        }

        .hero-locked-wrap:hover {
          opacity: 1;
        }

        .hero-locked-wrap * {
          pointer-events: none;
        }

        @media (max-width: 600px) {
          .hero-center-content {
            top: clamp(7.8rem, 18.5vh, 10.5rem) !important;
            padding-inline: clamp(0.5rem, 2vw, 1rem);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .hero-warp-wrap {
            width: min(72vw, calc(19vh * 2.22)) !important;
            max-width: min(72vw, 360px) !important;
            aspect-ratio: 1559 / 702 !important;
            height: auto !important;
            max-height: 19vh !important;
            margin-inline: auto !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-warp-wrap canvas,
          .hero-warp-wrap img,
          .hero-warp-wrap .warp-text {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 36px);
            top: 51.5%;
            transform: translateY(-50%);
            gap: 0.35rem;
            max-width: 44vw;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            z-index: 30;
          }
          .chair-arrow {
            width: 34px;
            height: 26px;
            margin-top: 0;
            transform: none;
            opacity: 1 !important;
            color: #000000 !important;
            filter: none !important;
            flex-shrink: 0;
          }
          .chair-arrow path {
            stroke-width: 6;
          }
          .chair-note {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
          .chair-text {
            font-size: clamp(0.58rem, 2vw, 0.68rem) !important;
            font-weight: 800 !important;
            line-height: 1.22 !important;
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
            text-align: left !important;
            text-shadow: none !important;
            white-space: normal;
          }
          .chair-sub {
            font-size: clamp(0.48rem, 1.5vw, 0.56rem) !important;
            font-weight: 700 !important;
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
            text-align: left !important;
            text-shadow: none !important;
          }
          .hero-action-dock-split {
            flex-direction: column;
            width: calc(100vw - 2.5rem);
            max-width: 20rem;
            align-items: center;
          }
          .hero-locked-wrap {
            display: flex;
            justify-content: center;
            width: 100%;
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
            transform: translate3d(0, 0, 0);
          }
          .hero-log-divider {
            transform: translate(-50%, 50%);
          }
          .hero-bottom-area {
            bottom: clamp(3.2rem, 6.5vh, 4.8rem);
            transform: translate3d(0, 0, 0);
          }
        }

        @media (max-width: 480px) {
          .hero-center-content {
            top: clamp(8rem, 17.5vh, 11rem);
            padding-inline: 0;
          }
          .hero-warp-wrap {
            height: clamp(165px, 44vw, 235px);
            max-width: 100vw;
            width: 100vw;
          }
          .hero-chair-annotation {
            left: calc(50% + 32px);
            top: 51.5%;
          }
          .chair-arrow {
            width: 30px;
            height: 24px;
          }
          .chair-text {
            font-size: 0.58rem !important;
            line-height: 1.18 !important;
          }
          .chair-sub {
            font-size: 0.48rem !important;
          }
        }
      `}</style>
    </section>
  );
}
