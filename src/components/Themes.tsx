"use client";

import type { CSSProperties } from "react";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import Atmosphere from "@/components/ui/Atmosphere";

interface TrackData {
  slug: string;
  seat: string;
  type: "grid-tape" | "lined-clip" | "kraft-tape" | "deckled-clip";
  title: string;
  subtitle: string;
  rot: string;
  yOffset: string;
  prompts: string[];
}

const TRACKS_CONFIG: TrackData[] = [
  {
    slug: "aiml",
    seat: "01",
    type: "grid-tape",
    title: "AI & Machine Learning",
    subtitle: "Autonomous intelligence & generative swarms",
    rot: "-4.5deg",
    yOffset: "0px",
    prompts: [
      "Autonomous Multi-Agent Swarms",
      "Multimodal Neural Generative Tools",
      "Edge AI & Local-Weight Inference",
      "Automated Reasoning & Tool Use",
      "Synthetic Data Engine Pipelines",
    ],
  },
  {
    slug: "cybersec",
    seat: "02",
    type: "lined-clip",
    title: "CyberSecurity & Defense",
    subtitle: "Zero-trust perimeters & cryptographic proofs",
    rot: "-1.5deg",
    yOffset: "14px",
    prompts: [
      "Zero-Knowledge Proofs & Privacy",
      "Automated Vulnerability Hunting",
      "Decentralized Identity & Auth",
      "Next-Gen Network Honeypots",
      "Cryptographic Threat Intelligence",
    ],
  },
  {
    slug: "fintech",
    seat: "03",
    type: "kraft-tape",
    title: "FinTech & Web3",
    subtitle: "Modern liquidity & programmable value rails",
    rot: "2deg",
    yOffset: "4px",
    prompts: [
      "Smart Contract Auditing & Security",
      "Programmable Micro-Payment Streams",
      "Decentralized Liquidity & Markets",
      "Graph-Neural Fraud Detection",
      "Autonomous Financial Agents",
    ],
  },
  {
    slug: "open",
    seat: "04",
    type: "deckled-clip",
    title: "Open Innovation",
    subtitle: "Hardware, biotech & the untamed craft",
    rot: "5deg",
    yOffset: "18px",
    prompts: [
      "Hardware Hacking & Custom Silicon",
      "BioTech & Environmental Sensors",
      "Novel Developer Compilers & DX",
      "Spatial Interfaces & Experimental Games",
      "The Untamed Wildcard Invention",
    ],
  },
];

/* Metallic Paper Clip Vector */
function MetalPaperClip({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Soft Drop Shadow */}
      <path
        d="M6 14V38C6 42.5 9.5 46 14 46C18.5 46 22 42.5 22 38V10C22 4.5 17.5 0 12 0C6.5 0 2 4.5 2 10V38C2 44.5 7.5 50 14 50C20.5 50 26 44.5 26 38V12"
        stroke="rgba(0,0,0,0.38)"
        strokeWidth="2.8"
        strokeLinecap="round"
        transform="translate(1.5, 2)"
      />
      {/* Specular Metallic Wire */}
      <path
        d="M6 14V38C6 42.5 9.5 46 14 46C18.5 46 22 42.5 22 38V10C22 4.5 17.5 0 12 0C6.5 0 2 4.5 2 10V38C2 44.5 7.5 50 14 50C20.5 50 26 44.5 26 38V12"
        stroke="url(#clipMetallicGrad)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="clipMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8d8b5" />
          <stop offset="25%" stopColor="#87734f" />
          <stop offset="50%" stopColor="#cfbc93" />
          <stop offset="75%" stopColor="#574932" />
          <stop offset="100%" stopColor="#9c8762" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Themes() {
  return (
    <section id="themes" className="th" aria-label="Themes & Tracks">
      <Atmosphere zIndex={-1} seed={37} count={18} opacity={0.8} />

      <div className="th-inner">
        <div className="th-header-wrap">
          <RevealHeading
            className="th-heading"
            lines={["Build one of", "these four."]}
          />
          <RevealBlock y={16}>
            <p className="th-lede">
              Four specialized tracks pinned to the board. Hover or tap each paper note to explore.
            </p>
          </RevealBlock>
        </div>

        {/* ── Studio Board with 4 Distinct Tactile Paper Notes ── */}
        <div className="th-wall-board">
          <div className="th-paper-fan">
            {TRACKS_CONFIG.map((card) => (
              <div
                key={card.slug}
                className="th-card-wrapper"
                style={
                  {
                    "--card-rot": card.rot,
                    "--card-y": card.yOffset,
                  } as CSSProperties
                }
              >
                {/* ── TYPE 1: Torn Grid Notebook Page with Diagonal Masking Tape (AIML) ── */}
                {card.type === "grid-tape" && (
                  <div className="th-memo-card th-shape-grid-tape">
                    {/* Top Hanging Tape pinned to the wall */}
                    <div className="th-top-hanging-tape th-tape-aiml" aria-hidden="true" />

                    {/* Layer 1: Rough Deckled Kraft Backing */}
                    <div className="th-backing-kraft" aria-hidden="true" />

                    {/* Layer 2: Torn Grid Notebook Sheet */}
                    <div className="th-sheet-grid">
                      {/* Top Torn Perforations */}
                      <div className="th-perfs-row" aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span key={i} className="th-perf-hole" />
                        ))}
                      </div>

                      {/* Printable Content */}
                      <div className="th-memo-content">
                        <span className="th-track-tag th-tag-forest">Track {card.seat}</span>
                        <h3 className="th-card-title th-ink-forest">{card.title}</h3>
                        <p className="th-card-subtitle">{card.subtitle}</p>

                        <div className="th-card-divider" />

                        <ul className="th-card-bullets">
                          {card.prompts.map((p, idx) => (
                            <li key={idx} className="th-bullet-item">
                              <span className="th-bullet-dot th-dot-forest" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TYPE 2: Lined Studio Index Card with Metallic Paperclip (CyberSec) ── */}
                {card.type === "lined-clip" && (
                  <div className="th-memo-card th-shape-lined-clip">
                    {/* Top Hanging Tape pinned to the wall */}
                    <div className="th-top-hanging-tape th-tape-cyber" aria-hidden="true" />

                    {/* Kraft Cardboard Backing */}
                    <div className="th-backing-kraft-lined" aria-hidden="true" />

                    {/* Lined Legal Notebook Sheet */}
                    <div className="th-sheet-lined">
                      {/* Left Punch Hole Tab */}
                      <div className="th-left-binder-punches" aria-hidden="true">
                        <span className="th-binder-hole" />
                        <span className="th-binder-hole" />
                        <span className="th-binder-hole" />
                      </div>

                      {/* Metallic Paper Clip on Top Left */}
                      <MetalPaperClip className="th-clip-top-left" />

                      {/* Printable Content */}
                      <div className="th-memo-content">
                        <span className="th-track-tag th-tag-navy">Track {card.seat}</span>
                        <h3 className="th-card-title th-ink-navy">{card.title}</h3>
                        <p className="th-card-subtitle">{card.subtitle}</p>

                        <div className="th-card-divider" />

                        <ul className="th-card-bullets">
                          {card.prompts.map((p, idx) => (
                            <li key={idx} className="th-bullet-item">
                              <span className="th-bullet-dot th-dot-navy" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TYPE 3: Spiral Kraft Notebook with Grid Washi Tape (FinTech) ── */}
                {card.type === "kraft-tape" && (
                  <div className="th-memo-card th-shape-kraft-tape">
                    {/* Top Hanging Tape pinned to the wall */}
                    <div className="th-top-hanging-tape th-tape-fintech" aria-hidden="true" />

                    {/* Spiral Kraft Sheet */}
                    <div className="th-sheet-kraft">
                      {/* Left Spiral Binder Teeth */}
                      <div className="th-left-spiral-strip" aria-hidden="true">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <span key={i} className="th-spiral-tooth" />
                        ))}
                      </div>

                      {/* Bottom-Right Grid Washi Tape */}
                      <div className="th-corner-washi-tape" aria-hidden="true" />

                      {/* Printable Content */}
                      <div className="th-memo-content">
                        <span className="th-track-tag th-tag-amber">Track {card.seat}</span>
                        <h3 className="th-card-title th-ink-amber">{card.title}</h3>
                        <p className="th-card-subtitle">{card.subtitle}</p>

                        <div className="th-card-divider" />

                        <ul className="th-card-bullets">
                          {card.prompts.map((p, idx) => (
                            <li key={idx} className="th-bullet-item">
                              <span className="th-bullet-dot th-dot-amber" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TYPE 4: Deckled White Note with Corner Paperclip on Kraft (Open) ── */}
                {card.type === "deckled-clip" && (
                  <div className="th-memo-card th-shape-deckled-clip">
                    {/* Top Hanging Tape pinned to the wall */}
                    <div className="th-top-hanging-tape th-tape-open" aria-hidden="true" />

                    {/* Layered Kraft Shadow */}
                    <div className="th-backing-kraft-deckled" aria-hidden="true" />

                    {/* Deckled White Sheet */}
                    <div className="th-sheet-deckled">
                      {/* Metallic Paperclip on Top Right */}
                      <MetalPaperClip className="th-clip-top-right" />

                      {/* Printable Content */}
                      <div className="th-memo-content">
                        <span className="th-track-tag th-tag-plum">Track {card.seat}</span>
                        <h3 className="th-card-title th-ink-plum">{card.title}</h3>
                        <p className="th-card-subtitle">{card.subtitle}</p>

                        <div className="th-card-divider" />

                        <ul className="th-card-bullets">
                          {card.prompts.map((p, idx) => (
                            <li key={idx} className="th-bullet-item">
                              <span className="th-bullet-dot th-dot-plum" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .th {
          position: relative;
          width: 100%;
          background: radial-gradient(130% 90% at 50% 30%, #162e1c 0%, #0d1910 100%);
          background-color: #0d1910;
          color: #f3f8ee;
          padding-block: clamp(6.5rem, 14vh, 11rem);
          overflow: hidden;
          z-index: 10;
        }

        .th-inner {
          position: relative;
          max-width: 86rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          z-index: 2;
        }

        .th-header-wrap {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .th-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.3rem, 6.4vw, 5.2rem);
          line-height: 0.94;
          letter-spacing: -0.022em;
          text-transform: uppercase;
          text-align: center;
          color: #f3f8ee;
        }

        .th-lede {
          margin-top: clamp(1rem, 2.5vh, 1.6rem);
          max-width: 44rem;
          margin-inline: auto;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1.02rem, 1.6vw, 1.25rem);
          font-weight: 380;
          line-height: 1.5;
          color: #8da488;
          text-align: center;
        }

        /* ── Wall Board with Overlapping Real Paper Notes ── */
        .th-wall-board {
          position: relative;
          margin-top: clamp(3.5rem, 8vh, 6rem);
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .th-paper-fan {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          width: 100%;
          max-width: 84rem;
          padding-top: 2.5rem;
          padding-bottom: 2rem;
          position: relative;
        }

        .th-card-wrapper {
          position: relative;
          flex: 0 1 290px;
          min-width: 245px;
          margin-inline: -1.2rem;
          transform: translateY(var(--card-y)) rotate(var(--card-rot));
          transform-origin: center bottom;
          transition:
            transform 420ms cubic-bezier(0.23, 1, 0.32, 1),
            filter 300ms ease,
            z-index 0ms;
          z-index: 2;
          cursor: pointer;
        }

        /* Hover: lift the paper note off the wall */
        .th-card-wrapper:hover {
          transform: translateY(-26px) rotate(0deg) scale(1.05);
          z-index: 30;
        }

        .th-memo-card {
          position: relative;
          width: 100%;
          min-height: 410px;
          filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.48));
          transition: filter 380ms ease;
        }

        .th-card-wrapper:hover .th-memo-card {
          filter: drop-shadow(0 32px 64px rgba(0, 0, 0, 0.65));
        }

        /* ── SHARED MEMO CONTENT STYLING ── */
        .th-memo-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
        }

        /* ── TRACK TAG WITH REALISTIC HIGHLIGHTER MARKER STROKE ── */
        .th-track-tag {
          position: relative;
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.12rem 0.5rem;
          margin-bottom: 0.45rem;
          text-transform: uppercase;
          width: fit-content;
          background: transparent;
          border-radius: 0;
          z-index: 1;
        }

        .th-track-tag::before {
          content: "";
          position: absolute;
          inset: -1px -4px -1px -4px;
          background: var(--marker-color);
          opacity: 0.9;
          border-radius: 2px 5px 3px 6px;
          transform: rotate(var(--marker-tilt, -0.8deg)) skewX(-4deg);
          mix-blend-mode: multiply;
          z-index: -1;
          pointer-events: none;
        }

        .th-tag-forest {
          color: #0e2a16;
          --marker-color: #bef264; /* Vibrant Sprout Marker */
          --marker-tilt: -1.2deg;
        }

        .th-tag-navy {
          color: #0a1b30;
          --marker-color: #93c5fd; /* Soft Blue Marker */
          --marker-tilt: 0.8deg;
        }

        .th-tag-amber {
          color: #3b1808;
          --marker-color: #fde047; /* Yellow Highlighter */
          --marker-tilt: -0.6deg;
        }

        .th-tag-plum {
          color: #2b0c1b;
          --marker-color: #f472b6; /* Pink Marker */
          --marker-tilt: 1deg;
        }

        .th-card-title {
          margin: 0;
          font-family: var(--font-display), var(--font-geist-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(1.22rem, 1.8vw, 1.48rem);
          line-height: 1.12;
          letter-spacing: -0.025em;
        }

        .th-ink-forest { color: #112215; }
        .th-ink-navy   { color: #0d1a29; }
        .th-ink-amber  { color: #2b1409; }
        .th-ink-plum   { color: #220e18; }

        .th-card-subtitle {
          margin: 0.35rem 0 0;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.78rem;
          font-weight: 450;
          line-height: 1.38;
          letter-spacing: -0.01em;
          color: #3b4d3e;
        }

        .th-card-divider {
          height: 1px;
          width: 100%;
          background: rgba(0, 0, 0, 0.12);
          margin-block: 0.75rem 0.85rem;
        }

        .th-card-bullets {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.48rem;
        }

        .th-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 0.48rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.78rem;
          font-weight: 460;
          line-height: 1.34;
          letter-spacing: -0.01em;
          color: #1a2a1d;
        }

        .th-bullet-dot {
          width: 5.5px;
          height: 5.5px;
          border-radius: 50% 45% 55% 48% / 48% 54% 46% 52%;
          margin-top: 0.42rem;
          flex-shrink: 0;
          transform: rotate(-10deg);
        }
        .th-dot-forest { background: #1e5934; }
        .th-dot-navy   { background: #174278; }
        .th-dot-amber  { background: #87360e; }
        .th-dot-plum   { background: #6e193f; }

        /* ── REALISTIC HANGING TAPE ATTACHED ABOVE EACH CARD ── */
        .th-top-hanging-tape {
          position: absolute;
          top: -18px;
          left: 50%;
          width: 96px;
          height: 32px;
          transform: translateX(-50%) rotate(var(--tape-tilt, -1deg));
          backdrop-filter: blur(4px);
          clip-path: polygon(
            0% 4%, 2% 0%, 98% 0%, 100% 4%, 
            96% 20%, 100% 40%, 95% 60%, 100% 80%, 96% 100%, 
            0% 100%, 4% 80%, 0% 60%, 5% 40%, 0% 20%
          );
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
          z-index: 25;
          pointer-events: none;
        }

        .th-top-hanging-tape::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.25) 0%,
            transparent 45%,
            rgba(0, 0, 0, 0.08) 55%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* 1. Frosted Masking Tape (AIML) */
        .th-tape-aiml {
          --tape-tilt: -2.5deg;
          background: rgba(248, 244, 230, 0.85);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        /* 2. Slate/Cobalt Washed Studio Tape (CyberSec) */
        .th-tape-cyber {
          --tape-tilt: 1.8deg;
          background: rgba(238, 243, 248, 0.82);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        /* 3. Grid Washi Tape (FinTech) */
        .th-tape-fintech {
          --tape-tilt: -1.2deg;
          background-color: rgba(242, 230, 210, 0.85);
          background-image:
            linear-gradient(rgba(100, 70, 40, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 70, 40, 0.12) 1px, transparent 1px);
          background-size: 6px 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.35);
        }

        /* 4. Cream Parchment Tape (Open) */
        .th-tape-open {
          --tape-tilt: 2.2deg;
          background: rgba(246, 238, 226, 0.85);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        /* ── SHAPE 1: GRID PAPER (AIML) ── */
        .th-shape-grid-tape {
          position: relative;
        }

        .th-backing-kraft {
          position: absolute;
          inset: -12px -12px -12px -12px;
          background: #8e7c65;
          background-image:
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.15) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px);
          border-radius: 4px;
          transform: rotate(-1.5deg);
          clip-path: polygon(
            0% 5%, 2% 1%, 6% 4%, 12% 1%, 20% 3%, 32% 0%, 45% 3%, 58% 1%, 70% 4%, 82% 1%, 92% 3%, 100% 6%,
            98% 14%, 100% 24%, 97% 35%, 100% 46%, 98% 58%, 100% 70%, 97% 82%, 100% 92%, 96% 98%,
            90% 97%, 82% 100%, 72% 98%, 60% 100%, 48% 97%, 36% 100%, 24% 98%, 12% 100%, 4% 97%, 0% 95%,
            3% 84%, 0% 72%, 2% 60%, 0% 48%, 3% 36%, 1% 22%, 3% 12%
          );
        }

        .th-sheet-grid {
          position: relative;
          width: 100%;
          min-height: 410px;
          background-color: #eaf2e3;
          background-image:
            linear-gradient(rgba(30, 65, 35, 0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 65, 35, 0.09) 1px, transparent 1px);
          background-size: 14px 14px;
          padding: 2.2rem 1.65rem 1.8rem;
          clip-path: polygon(
            0% 0%, 100% 0%,
            99% 12%, 100% 22%, 98% 34%, 100% 45%, 98% 56%, 100% 68%, 98% 80%, 100% 90%, 97% 99%,
            88% 98%, 76% 100%, 64% 98%, 52% 100%, 40% 98%, 28% 100%, 16% 98%, 4% 100%, 1% 98%,
            2% 88%, 0% 76%, 2% 64%, 0% 50%, 2% 38%, 0% 24%, 2% 12%
          );
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }

        .th-perfs-row {
          position: absolute;
          top: -2px;
          left: 14px;
          right: 14px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }

        .th-perf-hole {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(40, 50, 35, 0.5);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
        }

        /* ── SHAPE 2: LINED INDEX CARD WITH METALLIC PAPERCLIP (CyberSec) ── */
        .th-shape-lined-clip {
          position: relative;
        }

        .th-backing-kraft-lined {
          position: absolute;
          inset: -10px -8px -14px -8px;
          background: #7d848f;
          background-image:
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.15) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px);
          border-radius: 4px;
          transform: rotate(1deg);
          clip-path: polygon(
            0% 0%, 100% 0%,
            98% 15%, 100% 30%, 97% 48%, 100% 65%, 98% 82%, 100% 94%,
            94% 96%, 86% 100%, 78% 95%, 70% 100%, 60% 94%, 50% 100%, 40% 95%, 30% 100%, 20% 94%, 10% 100%, 2% 96%,
            0% 85%, 2% 70%, 0% 55%, 2% 40%, 0% 25%, 2% 10%
          );
        }

        .th-sheet-lined {
          position: relative;
          width: 100%;
          min-height: 410px;
          background-color: #eaf1f8;
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 22px,
            rgba(35, 80, 160, 0.14) 23px
          );
          border-left: 3px solid rgba(210, 65, 65, 0.38);
          padding: 2.2rem 1.65rem 1.8rem 2.2rem;
          clip-path: polygon(
            0% 0%, 100% 0%,
            99% 14%, 100% 28%, 98% 42%, 100% 56%, 98% 70%, 100% 84%, 97% 96%,
            90% 95%, 80% 99%, 70% 96%, 58% 100%, 46% 95%, 34% 99%, 22% 96%, 10% 99%, 2% 96%,
            0% 85%, 2% 70%, 0% 55%, 2% 40%, 0% 25%, 2% 10%
          );
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }

        .th-left-binder-punches {
          position: absolute;
          left: -14px;
          top: 30px;
          bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .th-binder-hole {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #14281a;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.8);
        }

        .th-clip-top-left {
          position: absolute;
          top: -14px;
          left: 20px;
          width: 22px;
          height: 48px;
          z-index: 10;
          pointer-events: none;
          transform: rotate(-6deg);
        }

        /* ── SHAPE 3: SPIRAL KRAFT NOTEBOOK (FinTech) ── */
        .th-shape-kraft-tape {
          position: relative;
        }

        .th-sheet-kraft {
          position: relative;
          width: 100%;
          min-height: 410px;
          background: #f5e8d3;
          background-image:
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.08) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px);
          padding: 2.2rem 1.65rem 1.8rem 2.4rem;
          clip-path: polygon(
            4% 2%, 16% 0%, 30% 2%, 46% 0%, 62% 2%, 78% 0%, 92% 2%, 99% 4%,
            98% 12%, 100% 22%, 97% 34%, 100% 46%, 98% 58%, 100% 70%, 97% 82%, 100% 92%, 96% 98%,
            90% 97%, 78% 100%, 66% 97%, 52% 100%, 38% 97%, 24% 100%, 12% 98%, 4% 99%,
            1% 94%, 3% 84%, 0% 74%, 3% 64%, 0% 54%, 3% 44%, 0% 34%, 3% 24%, 0% 14%, 2% 6%
          );
          box-shadow: 0 4px 14px rgba(0,0,0,0.22);
        }

        .th-left-spiral-strip {
          position: absolute;
          left: 6px;
          top: 25px;
          bottom: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .th-spiral-tooth {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(60, 45, 30, 0.45);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
        }

        .th-corner-washi-tape {
          position: absolute;
          bottom: -8px;
          right: -8px;
          width: 45px;
          height: 20px;
          background: rgba(235, 220, 195, 0.8);
          background-image:
            linear-gradient(rgba(100, 70, 40, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 70, 40, 0.15) 1px, transparent 1px);
          background-size: 6px 6px;
          transform: rotate(35deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          pointer-events: none;
        }

        /* ── SHAPE 4: DECKLED TINTED NOTE WITH PAPERCLIP (Open Innovation) ── */
        .th-shape-deckled-clip {
          position: relative;
        }

        .th-backing-kraft-deckled {
          position: absolute;
          inset: -12px -10px -12px -10px;
          background: #8c6a74;
          background-image:
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.15) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px);
          border-radius: 4px;
          transform: rotate(-2deg);
          clip-path: polygon(
            0% 6%, 4% 1%, 10% 4%, 20% 0%, 32% 3%, 46% 0%, 60% 4%, 74% 1%, 86% 4%, 96% 1%, 100% 7%,
            98% 18%, 100% 32%, 96% 46%, 100% 60%, 97% 74%, 100% 88%, 96% 97%,
            90% 99%, 78% 96%, 64% 100%, 50% 97%, 36% 100%, 22% 96%, 8% 100%, 1% 96%,
            3% 84%, 0% 70%, 3% 54%, 0% 40%, 3% 26%, 1% 14%
          );
        }

        .th-sheet-deckled {
          position: relative;
          width: 100%;
          min-height: 410px;
          background: #faedf2;
          padding: 2.2rem 1.65rem 1.8rem;
          clip-path: polygon(
            2% 4%, 8% 1%, 18% 3%, 30% 0%, 44% 3%, 58% 1%, 72% 3%, 86% 0%, 96% 3%, 99% 6%,
            98% 14%, 100% 26%, 97% 38%, 100% 50%, 98% 64%, 100% 76%, 97% 88%, 99% 96%,
            92% 98%, 80% 96%, 68% 99%, 54% 96%, 40% 99%, 26% 96%, 12% 99%, 3% 96%,
            2% 86%, 0% 72%, 2% 58%, 0% 44%, 2% 30%, 0% 16%, 2% 8%
          );
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }

        .th-clip-top-right {
          position: absolute;
          top: -14px;
          right: 22px;
          width: 22px;
          height: 48px;
          z-index: 10;
          pointer-events: none;
          transform: rotate(8deg);
        }

        /* ── Responsive adjustments ── */
        @media (max-width: 1024px) {
          .th-card-wrapper {
            flex: 0 1 270px;
            margin-inline: -1.8rem;
          }
        }

        @media (max-width: 768px) {
          .th-paper-fan {
            flex-wrap: wrap;
            gap: 2.8rem 1.25rem;
            padding-inline: 0.5rem;
          }
          .th-card-wrapper {
            flex: 1 1 270px;
            max-width: 330px;
            margin-inline: 0;
            transform: rotate(0deg) translateY(0);
          }
          .th-card-wrapper:hover {
            transform: translateY(-10px) scale(1.03);
          }
        }
      `}</style>
    </section>
  );
}
