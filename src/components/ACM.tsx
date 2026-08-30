"use client";

import Image from "next/image";
import { RevealBlock } from "@/components/ui/reveal";

const SUBLOGOS = [
  { src: "/college_logo/jis.png", alt: "JIS Group", width: 88, height: 30 },
  { src: "/college_logo/aicte.png", alt: "AICTE Approved", width: 40, height: 30 },
  { src: "/college_logo/naac.png", alt: "NAAC Accredited", width: 84, height: 30 },
  { src: "/college_logo/nba.png", alt: "NBA Accredited", width: 40, height: 30 },
];

const PILLARS = [
  {
    title: "Collaborate",
    desc: "Team sprints & peer learning",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Learn",
    desc: "Hands-on tech workshops",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    title: "Innovate",
    desc: "Turning ideas into products",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .4 1.9 1.1 2.6.76.76 1.23 1.52 1.41 2.5" />
      </svg>
    ),
  },
  {
    title: "Inspire",
    desc: "Mentorship & community outreach",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function ACM() {
  return (
    <section id="acm" className="acm-stage" aria-label="About GNIT ACM Student Chapter">

      {/* ── Background Watermark Typographic Accents ── */}
      <div className="acm-watermarks" aria-hidden="true">
        <span className="acm-wm acm-wm-left">PRESENTED BY</span>
        <span className="acm-wm acm-wm-right">ORGANIZED BY</span>
      </div>

      <div className="acm-container">

        {/* ── TOP HEADER SECTION ── */}
        <div className="acm-header">
          {/* Top rule with diamond accent */}
          <RevealBlock y={8} className="acm-rule-wrap">
            <span className="acm-line" />
            <span className="acm-diamond">✦</span>
            <span className="acm-line" />
          </RevealBlock>

          <RevealBlock y={10} delay={0.04}>
            <p className="acm-eyebrow-text">ORGANIZED BY</p>
          </RevealBlock>

          {/* GNIT ACM Logo */}
          <RevealBlock y={18} delay={0.08} className="acm-logo-wrap">
            <Image
              src="/college_logo/gnitacm.png"
              alt="GNIT ACM Student Chapter"
              width={340}
              height={98}
              className="acm-hero-logo"
              priority
            />
          </RevealBlock>

          {/* Tagline */}
          <RevealBlock y={12} delay={0.12} className="acm-tagline-wrap">
            <p className="acm-tagline-main">
              The Official ACM Student Chapter of Guru Nanak Institute of Technology
            </p>
            <p className="acm-tagline-sub">
              Uniting passionate minds to build, learn, and innovate.
            </p>
          </RevealBlock>

          <RevealBlock y={8} delay={0.15} className="acm-mini-diamond">
            <span>✧</span>
          </RevealBlock>
        </div>

        {/* ── LIQUID GLASS REDESIGNED MAIN CARD ── */}
        <RevealBlock y={25} delay={0.18} className="acm-card-reveal">
          <div className="acm-card">
            {/* Ambient liquid light refractions */}
            <div className="acm-glass-lighting" aria-hidden="true" />

            {/* Top Bar inside Card */}
            <div className="acm-card-topbar">
              <div className="acm-badge">
                <span className="acm-badge-pulse" />
                <span className="acm-badge-txt">ACM STUDENT CHAPTER</span>
              </div>
              <div className="acm-card-location-tag">
                <span>GURU NANAK INSTITUTE OF TECHNOLOGY • SODEPUR, KOLKATA</span>
              </div>
            </div>

            {/* Split Content Grid */}
            <div className="acm-card-grid">

              {/* Left Column: Mission & 4 Feature Pillars */}
              <div className="acm-card-left">
                <div className="acm-card-heading-wrap">
                  <span className="acm-card-eyebrow">ABOUT OUR CHAPTER</span>
                  <h3 className="acm-card-title">
                    Where curious minds build, learn &amp; innovate together.
                  </h3>
                </div>

                <p className="acm-card-narrative">
                  The ACM Chapter at GNIT is a community of curious learners, problem solvers, and future innovators.
                  We believe in collaborative learning, open discussions, and building real-world solutions
                  through code and creativity.
                </p>

                {/* 4 Liquid Glass Mini-Cards */}
                <div className="acm-pillars">
                  {PILLARS.map((p) => (
                    <div className="acm-pillar-card" key={p.title}>
                      <div className="acm-pillar-icon-box">
                        {p.icon}
                      </div>
                      <div className="acm-pillar-text">
                        <h4 className="acm-pillar-title">{p.title}</h4>
                        <p className="acm-pillar-desc">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Architectural Campus Illustration in Liquid Glass Frame */}
              <div className="acm-card-right">
                <div className="acm-building-window">
                  <Image
                    src="/images/acm_building.jpg"
                    alt="Guru Nanak Institute of Technology Campus"
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                    className="acm-building-img"
                  />
                  <div className="acm-building-glare" />
                  <div className="acm-building-pill">
                    <span className="acm-pill-dot" />
                    <span>GNIT CAMPUS BLOCK</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Bottom Sub-Panel: In Collaboration With ── */}
            <div className="acm-collab-section">
              <div className="acm-collab-header">
                <span className="acm-collab-dot" />
                <span className="acm-collab-label">IN COLLABORATION WITH</span>
                <span className="acm-collab-dot" />
              </div>

              <div className="acm-collab-logos">
                {SUBLOGOS.map((s) => (
                  <div className="acm-collab-pill" key={s.src}>
                    <Image
                      src={s.src}
                      alt={s.alt}
                      width={s.width}
                      height={s.height}
                      className="acm-collab-img"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </RevealBlock>

      </div>

      <style>{`
        /* ─────────────────────────────────────────
           Stage Container (Seamless Sky Background)
        ───────────────────────────────────────── */
        .acm-stage {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          padding-top: clamp(4rem, 8vh, 6.5rem);
          padding-bottom: clamp(4.5rem, 9vh, 7rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
          background: transparent;
        }

        /* ─────────────────────────────────────────
           Typographic Watermarks
        ───────────────────────────────────────── */
        .acm-watermarks {
          position: absolute;
          top: clamp(2rem, 5vh, 4rem);
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          padding-inline: clamp(2rem, 6vw, 6rem);
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .acm-wm {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.4rem, 5.8vw, 5.2rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px rgba(105, 92, 70, 0.24);
          opacity: 0.7;
        }

        /* ─────────────────────────────────────────
           Main Content Wrap
        ───────────────────────────────────────── */
        .acm-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 74rem;
          margin-inline: auto;
          padding-inline: clamp(1rem, 3.5vw, 2.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ─────────────────────────────────────────
           Header Section
        ───────────────────────────────────────── */
        .acm-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          max-width: 48rem;
          margin-bottom: clamp(1.8rem, 3.8vh, 2.8rem);
        }

        .acm-rule-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          max-width: 24rem;
          margin-bottom: 0.6rem;
        }

        .acm-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(78, 108, 62, 0.45), transparent);
        }

        .acm-diamond {
          font-size: 0.65rem;
          color: #4A6E35;
        }

        .acm-eyebrow-text {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 0.95vw, 0.82rem);
          font-weight: 600;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #3D6228;
          margin: 0 0 clamp(0.8rem, 1.8vh, 1.3rem);
        }

        .acm-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(0.9rem, 2vh, 1.4rem);
        }

        .acm-hero-logo {
          width: auto;
          height: clamp(52px, 7.5vw, 76px);
          object-fit: contain;
          filter: drop-shadow(0 4px 18px rgba(0, 40, 160, 0.12));
          transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .acm-hero-logo:hover {
          transform: scale(1.025);
        }

        .acm-tagline-wrap {
          margin: 0 0 0.5rem;
        }

        .acm-tagline-main {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.3vw, 1.15rem);
          font-weight: 500;
          line-height: 1.45;
          color: #1A2919;
          margin: 0 0 0.2rem;
        }

        .acm-tagline-sub {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.88rem, 1.15vw, 1.02rem);
          font-weight: 400;
          line-height: 1.45;
          color: #41523E;
          margin: 0;
        }

        .acm-mini-diamond {
          color: #4A6E35;
          font-size: 0.75rem;
          margin-top: 0.6rem;
        }

        /* ─────────────────────────────────────────
           LIQUID GLASS REDESIGNED CARD
        ───────────────────────────────────────── */
        .acm-card-reveal {
          width: 100%;
        }

        .acm-card {
          position: relative;
          width: 100%;
          /* Liquid glass multi-tier ambient substrate */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.75) 0%,
            rgba(242, 248, 255, 0.58) 40%,
            rgba(240, 250, 242, 0.68) 100%
          );
          backdrop-filter: blur(36px) saturate(190%) brightness(1.02);
          -webkit-backdrop-filter: blur(36px) saturate(190%) brightness(1.02);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: clamp(20px, 2.6vw, 30px);
          box-shadow:
            0 28px 70px -15px rgba(20, 38, 22, 0.14),
            0 1px 0 rgba(255, 255, 255, 0.95) inset,
            inset 0 -1px 2px rgba(180, 210, 230, 0.25),
            inset 0 0 0 1px rgba(255, 255, 255, 0.6);
          overflow: hidden;
          padding: clamp(1.8rem, 3.6vw, 3rem) clamp(1.6rem, 3.4vw, 2.8rem) clamp(1.6rem, 3vw, 2.4rem);
        }

        /* Soft ambient liquid glow inside card */
        .acm-glass-lighting {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 20% 15%,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(235, 245, 255, 0.25) 45%,
            transparent 75%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* Top Bar inside Card */
        .acm-card-topbar {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: clamp(1.5rem, 3vh, 2.2rem);
          padding-bottom: clamp(0.9rem, 2vh, 1.2rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.65);
        }

        .acm-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 #fff;
        }

        .acm-badge-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4A8C2A;
          box-shadow: 0 0 0 3px rgba(74, 140, 42, 0.2);
        }

        .acm-badge-txt {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #1B351E;
        }

        .acm-card-location-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #556B52;
        }

        /* Card Split Grid */
        .acm-card-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.18fr 0.92fr;
          gap: clamp(1.8rem, 3.5vw, 3.2rem);
          align-items: center;
        }

        /* Left Story Column */
        .acm-card-left {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .acm-card-heading-wrap {
          margin-bottom: 0.75rem;
        }

        .acm-card-eyebrow {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.7rem, 0.9vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #355C22;
          margin-bottom: 0.35rem;
        }

        .acm-card-title {
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(1.2rem, 1.7vw, 1.5rem);
          font-weight: 700;
          line-height: 1.34;
          letter-spacing: -0.02em;
          color: #122013;
          margin: 0;
        }

        .acm-card-narrative {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.88rem, 1.15vw, 1rem);
          font-weight: 400;
          line-height: 1.65;
          color: #2D3D2B;
          margin: 0 0 clamp(1.4rem, 2.6vh, 2rem);
          text-wrap: pretty;
        }

        /* 4 Liquid Glass Mini-Cards */
        .acm-pillars {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.65rem, 1.2vw, 1rem);
          width: 100%;
        }

        .acm-pillar-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: clamp(0.75rem, 1.2vw, 0.95rem) clamp(0.85rem, 1.4vw, 1.1rem);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.92);
          box-shadow:
            0 4px 16px -2px rgba(20, 40, 20, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      background 220ms ease;
        }

        .acm-pillar-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.88);
          box-shadow:
            0 10px 24px -4px rgba(20, 45, 25, 0.09),
            inset 0 1px 0 #fff;
        }

        .acm-pillar-icon-box {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(235, 245, 230, 0.9) 0%, rgba(220, 238, 214, 0.85) 100%);
          border: 1px solid rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2F5824;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .acm-pillar-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .acm-pillar-title {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.82rem, 0.96vw, 0.92rem);
          font-weight: 700;
          color: #152414;
          margin: 0 0 0.1rem;
        }

        .acm-pillar-desc {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.7rem, 0.82vw, 0.78rem);
          line-height: 1.35;
          color: #556B52;
          margin: 0;
        }

        /* Right Column: Architectural Illustration Frame */
        .acm-card-right {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: clamp(230px, 26vw, 320px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .acm-building-window {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: clamp(230px, 26vw, 320px);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 16px 36px -10px rgba(15, 30, 20, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .acm-building-img {
          object-fit: cover;
          object-position: center center;
          filter: sepia(0.08) contrast(1.04) brightness(0.98);
        }

        .acm-building-glare {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.35) 0%,
            transparent 50%,
            rgba(235, 245, 230, 0.2) 100%
          );
          pointer-events: none;
        }

        .acm-building-pill {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #1A3018;
          user-select: none;
        }

        .acm-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4A8C2A;
        }

        /* ─────────────────────────────────────────
           Collaboration Sub-Section
        ───────────────────────────────────────── */
        .acm-collab-section {
          position: relative;
          z-index: 1;
          margin-top: clamp(1.8rem, 3.2vh, 2.5rem);
          padding-top: clamp(1.2rem, 2.4vh, 1.7rem);
          border-top: 1px solid rgba(255, 255, 255, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .acm-collab-header {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: clamp(1rem, 2vh, 1.4rem);
        }

        .acm-collab-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4A8C2A;
          opacity: 0.7;
        }

        .acm-collab-label {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.7rem, 0.88vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2F4E24;
        }

        .acm-collab-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(0.8rem, 1.8vw, 1.4rem);
        }

        .acm-collab-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.3rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.92);
          box-shadow:
            0 4px 14px -3px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1),
                      background 200ms ease,
                      box-shadow 200ms ease;
        }

        .acm-collab-pill:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 8px 20px -4px rgba(20, 40, 20, 0.08),
            inset 0 1px 0 #fff;
        }

        .acm-collab-img {
          width: auto;
          height: clamp(24px, 3vw, 30px);
          object-fit: contain;
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.06));
        }

        /* ─────────────────────────────────────────
           Responsive Breakdown
        ───────────────────────────────────────── */
        @media (max-width: 960px) {
          .acm-card-grid {
            grid-template-columns: 1fr;
            gap: 1.8rem;
          }
          .acm-card-right {
            min-height: 220px;
            order: -1;
          }
          .acm-watermarks {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .acm-pillars {
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }
          .acm-card-topbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
          }
        }
      `}</style>
    </section>
  );
}
