"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { EVENT } from "@/data/hackathon";
import { prefersLiteMedia } from "@/lib/device";
import WarpText from "@/components/ui/WarpText";
import DevfolioButton from "@/components/DevfolioButton";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const videoScaleRef = useRef<HTMLDivElement>(null);

  // Background video plate showing the hill and moving grass on all devices
  const [useVideo, setUseVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    try {
      video.load();
    } catch {}

    const playHero = () => {
      video.play().catch(() => {});
    };

    const introPlaying = () =>
      typeof document !== "undefined" &&
      document.documentElement.dataset.intro !== "done";
    // The intro sets this the moment it wants the plate moving (2.9s in, just
    // before its veil lifts). Until then the plate is held.
    const plateArmed = () => video.dataset.plate === "on";

    // While the intro is up and has not armed the plate, decoding is wasted:
    // the plate is under an opaque veil for the first 3.25s. But the first
    // play() must still happen, because iOS Safari fetches nothing until
    // playback is requested, preload or not -- and a cold fetch starting at
    // 2.9s puts the grass on screen late on cellular. So: let the observer's
    // initial play() start the download, then stop the decoder on the first
    // frame. The poster and frame 0 are the same picture.
    const hold = () => {
      if (introPlaying() && !plateArmed() && !video.paused) video.pause();
    };
    video.addEventListener("playing", hold);

    if (introPlaying()) {
      window.addEventListener("recursive-intro-done", playHero, { once: true });
    } else {
      playHero();
    }

    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Under the intro this is the fetch trigger (see hold above); once
            // the intro is done it is the normal scroll-back-into-view resume.
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      }, { threshold: 0.05 });
      io.observe(video);
      return () => {
        window.removeEventListener("recursive-intro-done", playHero);
        video.removeEventListener("playing", hold);
        io.disconnect();
      };
    }

    return () => {
      window.removeEventListener("recursive-intro-done", playHero);
      video.removeEventListener("playing", hold);
    };
  }, []);

  // Hidden UI sits at opacity 0.002, not 0. At exactly 0 the compositor
  // treats a layer as invisible and does not rasterise it, so the wordmark
  // texture, buttons and annotation were all painted for the first time in
  // the opening frames of the hand-off -- a stall right on the cut with the
  // main thread idle. Any non-zero opacity keeps them rasterised. It was 0.01
  // for a while, and 1% of a black wordmark on the bright sky the grade now
  // reveals is ~2.5 grey levels: a faint ghost of the logo during the last
  // lines. 0.002 is half a level, below what 8-bit output can show.
  const [introFinished, setIntroFinished] = useState(false);

  // Sync intro state on mount
  useEffect(() => {
    if (document.documentElement.dataset.intro === "done") {
      setIntroFinished(true);
    }
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

    const fallbackTimer = setTimeout(() => setIntroFinished(true), 16000);

    return () => {
      window.removeEventListener("recursive-intro-done", onIntroDone);
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [introFinished]);


  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {/* ── 100% Crisp, Pure Video Background with Smooth GPU Scale Container ── */}
      <div className="hero-video-wrap">
        <div className="hero-video-scale" ref={videoScaleRef}>
          {/* The still poster is always painted first: it is the hero background
              on phones / data-saver / reduced-motion (where the 4K loop never
              loads), and the instant, crisp paint under the video everywhere
              else — so the hero is never a flat empty plate. */}
          <img
            className="hero-video hero-poster"
            src="/images/hero/hero_poster_v3.jpg"
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{
              opacity: videoPlaying ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
          />
          {useVideo && (
            <video
              ref={videoRef}
              className="hero-video"
              src="/bg/hero_loop_pp.mp4"
              poster="/images/hero/hero_poster_v3.jpg"
              autoPlay={false}
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              onPlaying={() => setVideoPlaying(true)}
            />
          )}
        </div>
      </div>

      {/* ── Foreground Content in Responsive Flex Column Layout ── */}
      <div className="hero-content-flex">
        {/* Upper Zone: 0 to 50svh (Sky above chair). Logo is positioned at the bottom of this zone */}
        <div className="hero-sky-zone">
          <motion.div
            id="headingrow"
            className="hero-center-content"
            ref={centerRef}
            initial={reduced ? false : { opacity: 0.002, y: 14 }}
            animate={
              introFinished
                ? { opacity: 1, y: 0 }
                : { opacity: 0.002, y: 14 }
            }
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.02 }}
          >
            <h1 className="sr-only">
              RECURSIVE 2026 — ACM Hackathon by GNIT Kolkata ACM Student Chapter
            </h1>
            {/* ── Powered By Eyebrow Badge: Aqyron Labs ── */}
            <a
              href="https://aqyronlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-partner-badge"
              title="Powered by Aqyron Labs (aqyronlabs.com)"
              aria-label="Powered by Aqyron Labs (aqyronlabs.com)"
            >
              <span className="hero-partner-tag">POWERED BY</span>
              <span className="hero-partner-divider" aria-hidden="true" />
              <img
                src="/images/sponsors/aqyron-labs.png"
                alt="Aqyron Labs"
                className="hero-partner-logo"
                width={785}
                height={568}
              />
              <span className="hero-partner-name">Aqyron Labs</span>
              <span className="hero-partner-dot" aria-hidden="true" />
              <span className="hero-partner-domain">aqyronlabs.com</span>
              <svg
                className="hero-partner-arrow"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.5 2.5H9.5V8.5M9.5 2.5L2.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <div className="hero-warp-wrap">
              <WarpText
                src="/images/brand/logo.png"
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
        </div>

        {/* Lower Zone: 50svh to 100svh (Chair & Hill down to action dock) */}
        <div className="hero-ground-zone">
          <motion.div
            className="hero-bottom-area"
            ref={dockRef}
            initial={reduced ? false : { opacity: 0.002, y: 14 }}
            animate={
              introFinished
                ? { opacity: 1, y: 0 }
                : { opacity: 0.002, y: 14 }
            }
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
          >
            <div className="hero-action-dock-split">
              <DevfolioButton />
              <a
                href={EVENT.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-discord-btn"
                aria-label="Join Discord"
              >
                <svg
                  className="hero-discord-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Join Discord</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mossy Log Natural Divider Over Seam ── */}
      <div className="hero-log-divider" aria-hidden="true">
        <img
          src="/images/hero/log.png"
          alt=""
          className="hero-log-img"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>

      {/* ── Simple Clean Chair Annotation (No Box, No Glow) ── */}
      <motion.div
        className="hero-chair-annotation"
        initial={reduced ? false : { opacity: 0.002 }}
        animate={introFinished ? { opacity: 1 } : { opacity: 0.002 }}
        transition={{ duration: 0.6, delay: 0.12, ease: EASE_OUT }}
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

        <a href="#about" className="chair-note" aria-label="Scroll to learn about the chair" style={{ color: "#000000", textDecoration: "none" }}>
          <p className="chair-text" style={{ color: "#000000", WebkitTextFillColor: "#000000", opacity: 1, textShadow: "none" }}>
            bro put a plastic chair on a hill<br />and called it a hackathon 
          </p>
          <span className="chair-sub" style={{ color: "#000000", WebkitTextFillColor: "#000000", opacity: 1, textShadow: "none" }}>scroll for lore ↓</span>
        </a>
      </motion.div>

      <style href="hero-style" precedence="default" suppressHydrationWarning>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          height: 100vh;
          height: 100dvh;
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

        /* ── Clean Video Plate Container — Direct Hardware Composition ── */
        .hero-video-scale {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* ── 100% Clean Video Plate — Direct GPU Composition ── */
        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          pointer-events: none;
        }

        /* ── Fluid Flex Column Container for Foreground ── */
        .hero-content-flex {
          position: relative;
          z-index: 20;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          height: 100svh;
          min-height: 100vh;
          min-height: 100dvh;
          min-height: 100svh;
          max-height: 100vh;
          max-height: 100dvh;
          max-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          pointer-events: none;
          overflow: hidden;
        }

        /* ── Upper Zone (0 to 50svh): Sky above chair. Positions logo with breathing room above chair ── */
        .hero-sky-zone {
          position: relative;
          width: 100%;
          height: 50vh;
          height: 50dvh;
          height: 50svh;
          flex: 0 0 50svh;
          max-height: 50svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-top: clamp(4.2rem, 7svh, 5.5rem);
          padding-bottom: clamp(1.5rem, 3.8svh, 3.2rem);
          padding-inline: clamp(0.75rem, 2vw, 1.5rem);
          box-sizing: border-box;
          pointer-events: none;
        }

        /* ── Top Center Block: Wordmark (#headingrow) ── */
        #headingrow,
        .hero-center-content {
          position: relative;
          width: 100%;
          max-width: 1920px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: auto;
          will-change: transform, opacity;
          padding-inline: clamp(0.5rem, 1.5vw, 1.2rem);
          flex-shrink: 0;
        }

        /* ── Official Partner Eyebrow Badge (Aqyron Labs) ── */
        .hero-partner-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.35rem, 0.7vw, 0.55rem);
          height: clamp(30px, 3.8svh, 36px);
          padding: 0 clamp(0.65rem, 1.2vw, 1.0rem);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(18, 36, 21, 0.13);
          box-shadow:
            0 2px 8px rgba(18, 36, 21, 0.05),
            0 1px 2px rgba(18, 36, 21, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
          text-decoration: none;
          cursor: pointer;
          pointer-events: auto;
          margin-bottom: clamp(0.4rem, 1.0svh, 0.8rem);
          transition:
            transform 220ms cubic-bezier(0.23, 1, 0.32, 1),
            background 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
          user-select: none;
          -webkit-user-select: none;
          z-index: 25;
        }

        .hero-partner-badge:hover {
          background: rgba(255, 255, 255, 0.94);
          border-color: rgba(18, 36, 21, 0.24);
          transform: translateY(-1.5px);
          box-shadow:
            0 6px 18px rgba(18, 36, 21, 0.10),
            0 2px 4px rgba(18, 36, 21, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .hero-partner-badge:active {
          transform: translateY(0) scale(0.98);
        }

        .hero-partner-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.56rem, 0.68vw, 0.64rem);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #234320;
          opacity: 0.88;
        }

        .hero-partner-divider {
          width: 1px;
          height: clamp(12px, 1.4svh, 15px);
          background: rgba(18, 36, 21, 0.16);
          flex-shrink: 0;
        }

        .hero-partner-logo {
          height: clamp(17px, 2.1svh, 22px);
          width: auto;
          max-width: clamp(24px, 3.0vw, 32px);
          object-fit: contain;
          display: block;
          flex-shrink: 0;
        }

        .hero-partner-name {
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(0.74rem, 0.9vw, 0.86rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #0e1e10;
          white-space: nowrap;
        }

        .hero-partner-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(18, 36, 21, 0.35);
          flex-shrink: 0;
        }

        .hero-partner-domain {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.64rem, 0.78vw, 0.72rem);
          font-weight: 500;
          color: #3b5839;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .hero-partner-arrow {
          width: clamp(9px, 1.1vw, 11px);
          height: clamp(9px, 1.1vw, 11px);
          color: #234320;
          opacity: 0.55;
          flex-shrink: 0;
          transition: transform 220ms ease, opacity 220ms ease;
        }

        .hero-partner-badge:hover .hero-partner-arrow {
          opacity: 0.9;
          transform: translate(1px, -1px);
        }

        .hero-warp-wrap {
          position: relative;
          width: 100%;
          max-width: min(92vw, 1150px);
          aspect-ratio: 1559 / 702;
          height: clamp(125px, min(24svh, 25vw), 285px);
          max-height: 28svh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-inline: auto;
        }

        .hero-warp-wrap canvas,
        .hero-warp-wrap img,
        .hero-warp-wrap .warp-text {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain !important;
          margin-inline: auto !important;
        }

        /* ── Lower Zone (50svh to 100svh): Hill slope & dock ── */
        .hero-ground-zone {
          position: relative;
          width: 100%;
          height: 50vh;
          height: 50dvh;
          height: 50svh;
          flex: 0 0 50svh;
          max-height: 50svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: clamp(2.4rem, 5svh, 4.2rem);
          padding-inline: clamp(0.75rem, 2vw, 1.5rem);
          box-sizing: border-box;
          pointer-events: none;
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
          left: calc(50% + 64px);
          top: 52%;
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
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          z-index: 12;
          overflow: visible;
        }

        .hero-log-img {
          width: 115vw;
          min-width: 100vw;
          max-width: none;
          flex-shrink: 0;
          height: auto;
          aspect-ratio: 2172 / 724;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          image-rendering: -webkit-optimize-contrast;
          filter: drop-shadow(0 14px 20px rgba(10, 24, 12, 0.12));
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* ── Bottom Unified Glass Dock ── */
        .hero-bottom-area {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 25;
          will-change: transform, opacity;
          padding-inline: 1rem;
          pointer-events: auto;
          flex-shrink: 0;
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

        .hero-discord-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 44px;
          padding: 0 1.15rem;
          border-radius: 6px;
          background: #FFFFFF;
          color: #23272A;
          border: 1px solid rgba(0, 0, 0, 0.12);
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          white-space: nowrap;
        }

        .hero-discord-btn:hover {
          background: #F8F9FE;
          color: #5865F2;
          border-color: rgba(88, 101, 242, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(88, 101, 242, 0.18);
        }

        .hero-discord-btn:active {
          transform: scale(0.98);
          background: #ECEFFB;
        }

        .hero-discord-icon {
          color: #5865F2;
          width: 1.15rem;
          height: 1.15rem;
          flex-shrink: 0;
          transition: transform 180ms ease;
        }

        .hero-discord-btn:hover .hero-discord-icon {
          transform: scale(1.06);
        }

        @media (max-width: 1024px) {
          .hero-sky-zone {
            padding-top: clamp(4.0rem, 6.8svh, 5.2rem);
            padding-bottom: clamp(1.4rem, 3.6svh, 3.0rem);
          }
          .hero-ground-zone {
            padding-bottom: clamp(2.4rem, 4.8svh, 3.8rem);
          }
          .hero-warp-wrap {
            max-width: min(90vw, 920px);
            height: clamp(115px, min(23svh, 24vw), 250px);
            max-height: 26svh;
            margin-inline: auto;
          }
        }

        @media (max-width: 860px) {
          .hero-partner-badge {
            height: clamp(28px, 3.4svh, 32px) !important;
            padding: 0 clamp(0.55rem, 1.5vw, 0.85rem) !important;
            margin-bottom: clamp(0.3rem, 0.8svh, 0.55rem) !important;
          }
          .hero-partner-domain,
          .hero-partner-dot {
            display: none !important;
          }
          .hero-warp-wrap {
            width: 100% !important;
            max-width: min(90vw, 720px) !important;
            height: clamp(110px, min(21svh, 26vw), 215px) !important;
            max-height: 24svh !important;
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

        @media (max-width: 600px) {
          .hero-sky-zone {
            padding-top: clamp(3.8rem, 6.2svh, 4.8rem);
            padding-bottom: clamp(2.2rem, 6.0svh, 3.6rem);
            padding-inline: clamp(0.5rem, 2.5vw, 1rem);
          }
          .hero-ground-zone {
            padding-bottom: clamp(2.2rem, 4.5svh, 3.4rem);
            padding-inline: clamp(0.5rem, 2.5vw, 1rem);
          }
          .hero-partner-badge {
            height: 27px !important;
            padding: 0 0.65rem !important;
            gap: 0.35rem !important;
            margin-bottom: 0.3rem !important;
          }
          .hero-partner-tag {
            font-size: 0.52rem !important;
            letter-spacing: 0.12em !important;
          }
          .hero-partner-divider {
            height: 11px !important;
          }
          .hero-partner-logo {
            height: 15px !important;
          }
          .hero-partner-name {
            font-size: 0.72rem !important;
          }
          .hero-partner-arrow {
            width: 8px !important;
            height: 8px !important;
          }
          .hero-warp-wrap {
            width: min(90vw, 420px) !important;
            max-width: min(90vw, 420px) !important;
            height: clamp(105px, min(19svh, 32vw), 160px) !important;
            max-height: 20svh !important;
            margin-inline: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .hero-warp-wrap canvas,
          .hero-warp-wrap img,
          .hero-warp-wrap .warp-text {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
            margin-inline: auto !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 14px);
            right: 10px;
            width: auto;
            max-width: calc(50% - 16px);
            top: 51.5%;
            transform: translateY(-50%);
            gap: 0.35rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            z-index: 30;
          }
          .chair-arrow {
            width: 30px;
            height: 24px;
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
          .chair-note {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            min-width: 0;
          }
          .chair-text {
            font-size: clamp(0.56rem, 2.2vw, 0.68rem) !important;
            font-weight: 800 !important;
            line-height: 1.22 !important;
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
            text-align: left !important;
            text-shadow: none !important;
            white-space: normal !important;
            word-break: normal !important;
            overflow-wrap: break-word !important;
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
            max-width: 17rem;
            align-items: center;
          }

          .hero-action-dock-split .block {
            width: 100%;
          }
          .hero-action-dock-split .devfolio-button-wrapper,
          .hero-dock-btn-glass,
          .hero-dock-btn-primary,
          .hero-discord-btn {
            width: 100%;
            max-width: 255px;
          }
          .hero-log-img {
            width: clamp(720px, 160vw, 1000px);
            transform: translate3d(0, 0, 0);
          }
          .hero-log-divider {
            transform: translate(-50%, 50%);
          }
        }

        @media (max-width: 480px) {
          .hero-warp-wrap {
            width: min(92vw, 370px) !important;
            max-width: min(92vw, 370px) !important;
            height: clamp(100px, min(18svh, 34vw), 150px) !important;
            max-height: 19svh !important;
            margin-inline: auto !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 12px);
            right: 8px;
            width: auto;
            max-width: calc(50% - 14px);
            top: 51.5%;
            gap: 0.28rem;
          }
          .chair-arrow {
            width: 26px;
            height: 20px;
          }
          .chair-arrow path {
            stroke-width: 5;
          }
          .chair-text {
            font-size: 0.52rem !important;
            line-height: 1.15 !important;
            white-space: normal !important;
            word-break: normal !important;
            overflow-wrap: break-word !important;
          }
          .chair-sub {
            font-size: 0.42rem !important;
          }
        }

        /* Specifically tailored for 6.0" and 6.1" phones (iPhone 12/13/14/15/16 at 390px/393px, Pixel, Galaxy) */
        @media (max-width: 420px) {
          .hero-partner-badge {
            height: 25px !important;
            padding: 0 0.55rem !important;
            gap: 0.3rem !important;
            margin-bottom: 0.25rem !important;
          }
          .hero-partner-tag {
            font-size: 0.48rem !important;
          }
          .hero-partner-divider {
            height: 10px !important;
          }
          .hero-partner-logo {
            height: 14px !important;
          }
          .hero-partner-name {
            font-size: 0.68rem !important;
          }
          .hero-sky-zone {
            padding-bottom: clamp(2.4rem, 6.6svh, 4.0rem);
          }
          .hero-warp-wrap {
            width: min(94vw, 345px) !important;
            max-width: min(94vw, 345px) !important;
            height: clamp(95px, min(17.5svh, 35vw), 145px) !important;
            max-height: 18.5svh !important;
            margin-inline: auto !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 10px);
            right: 6px;
            width: auto;
            max-width: calc(50% - 12px);
            top: 51.5%;
            gap: 0.25rem;
          }
          .chair-arrow {
            width: 22px;
            height: 18px;
          }
          .chair-arrow path {
            stroke-width: 4.8;
          }
          .chair-text {
            font-size: 0.49rem !important;
            line-height: 1.14 !important;
            white-space: normal !important;
            word-break: normal !important;
            overflow-wrap: break-word !important;
          }
          .chair-sub {
            font-size: 0.39rem !important;
          }
        }

        /* Short / Landscape Viewports: scale down smoothly without colliding */
        @media (max-height: 560px) {
          .hero-partner-badge {
            height: 24px !important;
            margin-bottom: 0.2rem !important;
          }
          .hero-partner-domain,
          .hero-partner-dot {
            display: none !important;
          }
          .hero-sky-zone {
            height: 52svh !important;
            flex: 0 0 52svh !important;
            padding-top: 3.0rem !important;
            padding-bottom: 0.75rem !important;
          }
          .hero-ground-zone {
            height: 48svh !important;
            flex: 0 0 48svh !important;
            padding-bottom: 1.2rem !important;
          }
          .hero-warp-wrap {
            height: clamp(75px, 20svh, 110px) !important;
          }
        }
      `}</style>
    </section>
  );
}
