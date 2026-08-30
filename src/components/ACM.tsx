"use client";

import Image from "next/image";
import { RevealBlock, RevealWords } from "@/components/ui/reveal";

const SUBLOGOS = [
  { src: "/college_logo/jis.png",   alt: "JIS Group",         width: 95,  height: 32 },
  { src: "/college_logo/aicte.png", alt: "AICTE Approved",    width: 44,  height: 32 },
  { src: "/college_logo/naac.png",  alt: "NAAC Accredited",   width: 44,  height: 32 },
  { src: "/college_logo/nba.png",   alt: "NBA Accredited",    width: 44,  height: 32 },
];

const STORY = [
  "The chapter brings together developers, designers, and builders from across Kolkata for eight hours of focused work and honest software craft.",
];

export default function ACM() {
  return (
    <section id="acm" className="acm" aria-label="Organizers of Recursive">

      {/* ── Watermark text layer behind everything ── */}
      <div className="acm-watermark" aria-hidden="true">
        <div className="acm-marquee acm-marquee-left">
          <div className="acm-marquee-track">
            <span>PRESENTED BY ✦ PRESENTED BY ✦ PRESENTED BY ✦ PRESENTED BY ✦&nbsp;</span>
            <span>PRESENTED BY ✦ PRESENTED BY ✦ PRESENTED BY ✦ PRESENTED BY ✦&nbsp;</span>
          </div>
        </div>
        <div className="acm-marquee acm-marquee-right">
          <div className="acm-marquee-track">
            <span>ORGANIZED BY ✦ ORGANIZED BY ✦ ORGANIZED BY ✦ ORGANIZED BY ✦&nbsp;</span>
            <span>ORGANIZED BY ✦ ORGANIZED BY ✦ ORGANIZED BY ✦ ORGANIZED BY ✦&nbsp;</span>
          </div>
        </div>
      </div>

      <div className="acm-inner">

        {/* ── Thin rule at the top ── */}
        <RevealBlock y={8}>
          <div className="acm-rule-top" />
        </RevealBlock>

        {/* ── Eyebrow ── */}
        <RevealBlock y={10} delay={0.03} className="acm-eyebrow-block">
          <p className="acm-eyebrow">Organized by</p>
        </RevealBlock>

        {/* ── Main chapter logo, monochrome on dark ── */}
        <RevealBlock y={20} delay={0.06} className="acm-logo-block">
          <Image
            src="/college_logo/gnitacm.png"
            alt="GNIT ACM Student Chapter"
            width={420}
            height={135}
            className="acm-main-logo"
            priority
          />
        </RevealBlock>

        {/* ── Collaboration line ── */}
        <RevealBlock y={10} delay={0.09} className="acm-collab-block">
          <p className="acm-collab">
            in collaboration with the{" "}
            <span className="acm-collab-dept">Department of Information Technology</span>
          </p>
        </RevealBlock>

        {/* ── Thin rule separator ── */}
        <RevealBlock y={8} delay={0.12}>
          <div className="acm-rule-mid" />
        </RevealBlock>

        {/* ── Organizer blurb ── */}
        <div className="acm-story-wrap">
          <RevealWords paragraphs={STORY} className="acm-story" />
        </div>

        {/* ── Accreditation sublogos ── */}
        <RevealBlock y={10} delay={0.16} className="acm-sublogos-block">
          <div className="acm-sublogos">
            {SUBLOGOS.map((s) => (
              <Image
                key={s.src}
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                className="acm-sublogo"
              />
            ))}
          </div>
        </RevealBlock>

        {/* ── Location line at bottom ── */}
        <RevealBlock y={10} delay={0.2} className="acm-footer-block">
          <p className="acm-location">
            Sodepur, Kolkata · October 08, 2026
          </p>
        </RevealBlock>

      </div>

      <style>{`
        /* ─────────────────────────────────────────
           Section shell
        ───────────────────────────────────────── */
        .acm {
          position: relative;
          width: 100%;
          color: #0f1623;
          /* Same tightening as the sections above — this one ran even wider
             (22vh) and left the biggest hole in the run. */
          padding-top: clamp(5rem, 11vh, 8.5rem);
          padding-bottom: clamp(5.5rem, 12vh, 9rem);
          overflow: hidden;
          z-index: 1;
          background: transparent;
        }

        /* ─────────────────────────────────────────
           Giant watermark — Dual scrolling marquee
        ───────────────────────────────────────── */
        .acm-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          z-index: 0;
          overflow: hidden;
          width: 100vw;
          left: 50%;
          transform: translateX(-50%);
          /* Hollow out the middle and both ends: the rows read as a band top
             and bottom, and the panel sits in clear air between them. */
          mask-image:
            radial-gradient(ellipse 68% 58% at 50% 50%, transparent 56%, black 94%),
            linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%);
          -webkit-mask-image:
            radial-gradient(ellipse 68% 58% at 50% 50%, transparent 56%, black 94%),
            linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
          justify-content: space-between;
          padding-block: clamp(1rem, 4vh, 3rem);
        }

        .acm-marquee {
          width: 100%;
          overflow: hidden;
          display: flex;
          white-space: nowrap;
          padding: 0.5rem 0;
        }

        .acm-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        .acm-marquee-track span {
          display: inline-block;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(4rem, 11vw, 9.5rem);
          line-height: 0.9;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1.2px rgba(28, 48, 26, 0.14);
          padding: 0 2vw;
        }

        .acm-marquee-left .acm-marquee-track {
          animation: acm-scroll-left 60s linear infinite;
        }

        .acm-marquee-right .acm-marquee-track {
          animation: acm-scroll-right 60s linear infinite;
        }

        @keyframes acm-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes acm-scroll-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        /* ─────────────────────────────────────────
           Content layer
        ───────────────────────────────────────── */
        .acm-inner {
          position: relative;
          z-index: 1;
          max-width: 82rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* ─────────────────────────────────────────
           Rules
        ───────────────────────────────────────── */
        .acm-rule-top {
          width: clamp(2rem, 6vw, 4rem);
          height: 1.5px;
          background: rgba(15, 22, 35, 0.18);
          margin-bottom: clamp(2.5rem, 5vh, 3.5rem);
        }

        .acm-rule-mid {
          width: 100%;
          max-width: 32rem;
          height: 1px;
          background: rgba(15, 22, 35, 0.1);
          margin-top: clamp(2rem, 4vh, 3rem);
        }

        /* ─────────────────────────────────────────
           Eyebrow
        ───────────────────────────────────────── */
        .acm-eyebrow-block {
          display: flex;
          justify-content: center;
        }

        .acm-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.68rem, 0.95vw, 0.78rem);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(143, 196, 90, 0.75);
          margin: 0 0 clamp(1.8rem, 3.5vh, 2.8rem);
        }

        /* ─────────────────────────────────────────
           Main logo — vibrant natural colors on dark
        ───────────────────────────────────────── */
        .acm-logo-block {
          display: flex;
          justify-content: center;
        }

        .acm-main-logo {
          width: auto;
          height: clamp(56px, 8.5vw, 84px);
          object-fit: contain;
          filter: drop-shadow(0 0 16px rgba(45, 100, 255, 0.28)) brightness(1.25) contrast(1.05);
          opacity: 0.98;
          transition: transform 250ms ease, opacity 250ms ease;
        }

        .acm-main-logo:hover {
          opacity: 1;
          transform: scale(1.02);
        }

        /* ─────────────────────────────────────────
           Collaboration line
        ───────────────────────────────────────── */
        .acm-collab-block {
          margin-top: clamp(1.5rem, 3vh, 2.2rem);
        }

        .acm-collab {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.88rem, 1.25vw, 1.05rem);
          font-weight: 400;
          line-height: 1.6;
          letter-spacing: -0.005em;
          color: rgba(214, 232, 202, 0.55);
          margin: 0;
        }

        .acm-collab-dept {
          color: rgba(214, 232, 202, 0.85);
          font-weight: 500;
        }

        /* ─────────────────────────────────────────
           Story paragraph
        ───────────────────────────────────────── */
        .acm-story-wrap {
          margin-top: clamp(2.5rem, 5vh, 4rem);
          width: 100%;
          max-width: 52rem;
        }

        .acm-story .rw-para {
          margin: 0 auto;
          max-width: 50rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1.05rem, 1.7vw, 1.35rem);
          font-weight: 400;
          line-height: 1.82;
          letter-spacing: -0.008em;
          color: rgba(15, 22, 35, 0.65);
          text-align: center;
          text-wrap: balance;
        }

        /* ─────────────────────────────────────────
           Sublogos — colorful, slightly larger, no bg
        ───────────────────────────────────────── */
        .acm-sublogos-block {
          margin-top: clamp(2.5rem, 5vh, 3.5rem);
        }

        .acm-sublogos {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(1.8rem, 4vw, 3.2rem);
        }

        .acm-sublogo {
          width: auto;
          height: clamp(26px, 3.4vw, 36px);
          object-fit: contain;
          opacity: 0.85;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .acm-sublogo:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        /* ─────────────────────────────────────────
           Location footer line
        ───────────────────────────────────────── */
        .acm-footer-block {
          margin-top: clamp(2.5rem, 5vh, 3.5rem);
        }

        .acm-location {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(15, 22, 35, 0.38);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
