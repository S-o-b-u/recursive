"use client";

import { useState } from "react";
import { JUDGES, EVENT } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import MorphSlider, { MorphSliderItem } from "@/components/ui/MorphSlider";
import Seal from "@/components/ui/Seal";

/**
 * Botanical Crown Flourish Motif.
 */
function BotanicalMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M80 4C80 4 76 13 66 16C56 18 42 14 32 19C24 23 20 31 12 33C7 34 3 32 0 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 4C80 4 84 13 94 16C104 18 118 14 128 19C136 23 140 31 148 33C153 34 157 32 160 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 1C77 4 74 7 74 10C74 13 77 14.5 80 14.5C83 14.5 86 13 86 10C86 7 83 4 80 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="20" r="1.7" fill="currentColor" />
      <circle cx="80" cy="27" r="1.2" fill="currentColor" />
      <circle cx="80" cy="33" r="0.9" fill="currentColor" />
    </svg>
  );
}

const MENTOR_SLIDES: (MorphSliderItem & {
  tag: string;
  name: string;
  role: string;
  desc: string;
  stat1: { val: string; label: string };
  stat2: { val: string; label: string };
  stat3: { val: string; label: string };
})[] = [
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    caption: "Systems Architecture",
    tag: "TECHNICAL ARCHITECTURE",
    name: "Distributed & Scalable Systems",
    role: "Full-Stack & Cloud Mentors",
    desc: "Hands-on guidance on systems design, backend performance, local-first sync protocols, and real-time infrastructure.",
    stat1: { val: "8h", label: "Live Support" },
    stat2: { val: "1:1", label: "Mentor Sessions" },
    stat3: { val: "4x", label: "Tracks" },
  },
  {
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    caption: "AI & Generative Pipelines",
    tag: "INTELLIGENT AGENTS",
    name: "AI, Agents & Machine Learning",
    role: "ML & Applied Intelligence",
    desc: "Refining agentic workflows, prompt engineering, vector search, and procedural generation for complex systems.",
    stat1: { val: "24/7", label: "Lab Access" },
    stat2: { val: "100%", label: "Hands-on" },
    stat3: { val: "6+", label: "Specialists" },
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    caption: "Interface & Interaction",
    tag: "PRODUCT & DESIGN",
    name: "UI/UX, Craft & Typography",
    role: "Creative Technologists",
    desc: "Elevating interface polish, WebGL shaders, kinetic typography, and fluid micro-interactions for demo presentation.",
    stat1: { val: "Top Tier", label: "Design Polish" },
    stat2: { val: "3D / WebGL", label: "Shader Help" },
    stat3: { val: "Demo Ready", label: "Pitch Prep" },
  },
  {
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
    caption: "Hardware & Edge Compute",
    tag: "EMBEDDED SYSTEMS",
    name: "IoT & Hardware Prototyping",
    role: "Hardware & Sensor Lab",
    desc: "Assisting with low-power microcontrollers, sensor arrays, firmware debugging, and physical computing.",
    stat1: { val: "Onsite", label: "Hardware Kits" },
    stat2: { val: "ESP32 / Pi", label: "Test Rigs" },
    stat3: { val: "Live Demos", label: "Stage Ready" },
  },
];

export default function Judges() {
  const [activeSlide, setActiveSlide] = useState(0);

  // When all judge names are empty, the entire panel is sealed
  const sealed = JUDGES.every((j) => j.name.trim().length === 0 && !j.photo.src);

  const current = MENTOR_SLIDES[activeSlide] || MENTOR_SLIDES[0];

  return (
    <section id="judges" className="jd" aria-label="Mentors and Judges">
      <div className="jd-inner">
        {/* ── Top Botanical Ornament ── */}
        <RevealBlock y={14}>
          <div className="jd-ornament-wrap">
            <BotanicalMotif className="jd-motif" />
          </div>
        </RevealBlock>

        {/* ── Centered Header ── */}
        <div className="jd-head-wrap">
          <RevealBlock y={10}>
            <span className="jd-eyebrow">005 · THE PANEL & MENTORS</span>
          </RevealBlock>
          <RevealHeading
            className="jd-heading"
            lines={["Mentors & Judges"]}
          />
          <RevealBlock y={12} delay={0.06}>
            <p className="jd-lede">
              {sealed
                ? "The mentors and judging panel are locked. Individual profiles remain sealed until the official reveal."
                : "Experienced builders, designers, and researchers guiding teams through the 8-hour sprint."}
            </p>
          </RevealBlock>
        </div>

        {/* ── Layered Morph Carousel Stage ── */}
        <div className="jd-carousel-wrapper" data-sealed={sealed ? "true" : "false"}>
          {/* Peeking Background Card Left */}
          <div className="jd-peek-card jd-peek-left" aria-hidden="true" />

          {/* Peeking Background Card Right */}
          <div className="jd-peek-card jd-peek-right" aria-hidden="true" />

          {/* Main Active Center Card */}
          <div className="jd-main-card">
            {/* Left: WebGL Morph Slider Shader Box */}
            <div className="jd-slider-box">
              <MorphSlider
                items={MENTOR_SLIDES}
                startIndex={0}
                transition="melt"
                intensity={0.55}
                aberration={0.35}
                drift={0.4}
                autoplay={!sealed}
                autoplayDelay={5}
                radius={22}
                showCaptions={true}
                showControls={false}
                showIndicators={false}
                onSlideChange={setActiveSlide}
                className="jd-morph-stage"
              />
            </div>

            {/* Right: Mentor Details & Impact Metrics */}
            <div className="jd-info-box">
              <div className="jd-info-header">
                <span className="jd-tag">{current.tag}</span>
                <h3 className="jd-title">{current.name}</h3>
                <p className="jd-role-text">{current.role}</p>
              </div>

              <p className="jd-desc">{current.desc}</p>

              <div className="jd-action-row">
                <a
                  href={EVENT.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jd-read-link"
                >
                  <span>Connect with Mentors</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="jd-arrow">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Stats Row */}
              <div className="jd-stats-row">
                <div className="jd-stat-item">
                  <span className="jd-stat-val">{current.stat1.val}</span>
                  <span className="jd-stat-lbl">{current.stat1.label}</span>
                </div>
                <div className="jd-stat-divider" />
                <div className="jd-stat-item">
                  <span className="jd-stat-val">{current.stat2.val}</span>
                  <span className="jd-stat-lbl">{current.stat2.label}</span>
                </div>
                <div className="jd-stat-divider" />
                <div className="jd-stat-item">
                  <span className="jd-stat-val">{current.stat3.val}</span>
                  <span className="jd-stat-lbl">{current.stat3.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Keep Seal on this Page when Sealed ── */}
          {sealed && <Seal word="PANEL SEALED" />}
        </div>

        {/* ── Bottom Carousel Pagination & Explore Button ── */}
        <RevealBlock y={14} delay={0.12}>
          <div className="jd-foot-wrap">
            <div className="jd-dots-row">
              {MENTOR_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Slide ${idx + 1}`}
                  className={`jd-dot ${idx === activeSlide ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(idx)}
                />
              ))}
            </div>

            <a
              href={EVENT.devfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="jd-explore-btn"
            >
              <span>Explore All Mentors & Judges</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="jd-explore-arrow">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </RevealBlock>
      </div>

      <style>{`
        .jd {
          position: relative;
          width: 100%;
          background: transparent;
          color: #111a12;
          padding-block: clamp(5.5rem, 13vh, 10rem);
          overflow: hidden;
          z-index: 1;
        }

        .jd-inner {
          position: relative;
          max-width: 76rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .jd-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
        }

        .jd-motif {
          width: clamp(110px, 14vw, 150px);
          height: auto;
          color: #2F5527;
          opacity: 0.85;
        }

        .jd-head-wrap {
          width: 100%;
          text-align: center;
        }

        .jd-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          font-weight: 550;
          letter-spacing: 0.08em;
          color: #5C8C3A;
          text-transform: uppercase;
        }

        .jd-heading {
          margin-top: 0.5rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          line-height: 1.15;
          letter-spacing: -0.028em;
          color: #111a12;
          text-align: center;
        }

        .jd-heading .rh-line {
          display: flex;
          justify-content: center;
        }

        .jd-lede {
          margin: clamp(0.75rem, 1.8vh, 1.25rem) auto 0;
          max-width: 44rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1.02rem, 1.5vw, 1.2rem);
          font-weight: 400;
          line-height: 1.6;
          color: #334731;
        }

        /* ── Carousel Wrapper & 3D Layering ── */
        .jd-carousel-wrapper {
          position: relative;
          width: 100%;
          max-width: 68rem;
          margin-top: clamp(2.5rem, 5vh, 4rem);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .jd-peek-card {
          position: absolute;
          top: 50%;
          width: 90%;
          height: 82%;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.42);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(47, 85, 39, 0.12);
          box-shadow: 0 10px 30px rgba(22, 45, 26, 0.06);
          pointer-events: none;
          z-index: 0;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .jd-peek-left {
          left: -4%;
          transform: translateY(-50%) scale(0.94);
          opacity: 0.6;
        }

        .jd-peek-right {
          right: -4%;
          transform: translateY(-50%) scale(0.94);
          opacity: 0.6;
        }

        /* ── Main Active Card ── */
        .jd-main-card {
          position: relative;
          z-index: 1;
          width: 100%;
          display: grid;
          grid-template-columns: minmax(280px, 340px) 1fr;
          gap: clamp(1.5rem, 3vw, 2.5rem);
          padding: clamp(1.25rem, 2.5vw, 2rem);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 20px 50px rgba(22, 45, 26, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.95);
          text-align: left;
          align-items: center;
        }

        /* ── Left: Morph Slider Container ── */
        .jd-slider-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          min-height: 280px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }

        .jd-morph-stage {
          width: 100%;
          height: 100%;
          border-radius: 22px;
        }

        /* ── Right: Details & Stats ── */
        .jd-info-box {
          display: flex;
          flex-direction: column;
          gap: clamp(0.75rem, 1.5vh, 1.25rem);
          padding-right: 0.5rem;
        }

        .jd-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: #5C8C3A;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .jd-title {
          margin: 0.3rem 0 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.25rem, 2vw, 1.65rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #111A12;
          line-height: 1.25;
        }

        .jd-role-text {
          margin: 0.2rem 0 0;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: #566A55;
        }

        .jd-desc {
          margin: 0;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          line-height: 1.58;
          color: #2F3E31;
        }

        .jd-action-row {
          margin-top: 0.25rem;
        }

        .jd-read-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #2F5527;
          border-bottom: 1.5px solid rgba(47, 85, 39, 0.35);
          padding-bottom: 2px;
          transition: color 200ms ease, border-color 200ms ease, gap 200ms ease;
        }

        .jd-arrow {
          width: 0.88rem;
          height: 0.88rem;
          transition: transform 200ms ease;
        }

        .jd-read-link:hover {
          color: #5C8C3A;
          border-color: #5C8C3A;
          gap: 0.65rem;
        }

        .jd-read-link:hover .jd-arrow {
          transform: translateX(2px);
        }

        /* ── Stats Grid ── */
        .jd-stats-row {
          display: flex;
          align-items: center;
          gap: clamp(0.75rem, 2vw, 1.5rem);
          padding-top: 1rem;
          border-top: 1px solid rgba(47, 85, 39, 0.12);
        }

        .jd-stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .jd-stat-val {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(1.4rem, 2.2vw, 1.85rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #111A12;
          line-height: 1;
        }

        .jd-stat-lbl {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          color: #566A55;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .jd-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(47, 85, 39, 0.15);
        }

        /* ── Sealed State ── */
        .jd-carousel-wrapper[data-sealed="true"] .jd-main-card {
          filter: blur(2px) saturate(0.85);
          opacity: 0.85;
          pointer-events: none;
        }

        /* ── Bottom Controls & Dots ── */
        .jd-foot-wrap {
          margin-top: clamp(2rem, 4vh, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .jd-dots-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .jd-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(47, 85, 39, 0.25);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.3s ease, background 0.3s ease;
        }

        .jd-dot.is-active {
          width: 24px;
          background: #2F5527;
        }

        .jd-explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.65rem 1.5rem;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(47, 85, 39, 0.18);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #16241A;
          box-shadow: 0 4px 16px rgba(22, 45, 26, 0.05);
          transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }

        .jd-explore-arrow {
          width: 0.9rem;
          height: 0.9rem;
          transition: transform 200ms ease;
        }

        .jd-explore-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 8px 24px rgba(22, 45, 26, 0.1);
        }

        .jd-explore-btn:hover .jd-explore-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 820px) {
          .jd-main-card {
            grid-template-columns: 1fr;
          }
          .jd-slider-box {
            min-height: 240px;
          }
          .jd-peek-card {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
