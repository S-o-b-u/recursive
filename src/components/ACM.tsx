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
  "Recursive is organized by the ACM Student Chapter at Guru Nanak Institute of Technology, in collaboration with the Department of Information Technology. The chapter brings together developers, designers, and builders from across Kolkata for eight hours of focused work and honest software craft.",
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

        {/* ── Main chapter logo, large & centered ── */}
        <RevealBlock y={20} delay={0.06} className="acm-logo-block">
          <div className="acm-logo-plate">
            <Image
              src="/college_logo/gnitacm.png"
              alt="GNIT ACM Student Chapter"
              width={340}
              height={110}
              className="acm-main-logo"
              priority
            />
          </div>
        </RevealBlock>

        {/* ── Accreditation sublogos ── */}
        <RevealBlock y={12} delay={0.12} className="acm-sublogos-block">
          <div className="acm-sublogos">
            {SUBLOGOS.map((s) => (
              <span className="acm-sublogo-plate" key={s.src}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  className="acm-sublogo"
                />
              </span>
            ))}
          </div>
        </RevealBlock>

        {/* ── Thin rule separator ── */}
        <RevealBlock y={8} delay={0.14}>
          <div className="acm-rule-mid" />
        </RevealBlock>

        {/* ── Organizer blurb ── */}
        <div className="acm-story-wrap">
          <RevealWords paragraphs={STORY} className="acm-story" />
        </div>

        {/* ── Location line at bottom ── */}
        <RevealBlock y={10} delay={0.18} className="acm-footer-block">
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
           Giant watermark
           — Dual scrolling marquee
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
          max-width: 40rem;
          height: 1px;
          background: rgba(15, 22, 35, 0.1);
          margin-top: clamp(2rem, 4vh, 3rem);
        }

        /* ─────────────────────────────────────────
           Main logo
        ───────────────────────────────────────── */
        .acm-logo-block {
          display: flex;
          justify-content: center;
        }

        /* The chapter and accreditation marks are brand-coloured artwork on
           transparency — navy, maroon, teal. Against the night field they sink,
           so each one sits on its own light plate instead of being recoloured. */
        .acm-logo-plate {
          display: inline-flex;
          padding: clamp(1rem, 2.4vw, 1.5rem) clamp(1.4rem, 3vw, 2.1rem);
          border-radius: var(--radius-lg);
          background: rgba(241, 246, 234, 0.95);
          box-shadow:
            0 26px 64px -34px rgba(0, 0, 0, 0.95),
            inset 0 0 0 1px rgba(190, 224, 168, 0.28);
        }

        .acm-main-logo {
          width: auto;
          height: clamp(64px, 10vw, 96px);
          object-fit: contain;
        }

        /* ─────────────────────────────────────────
           Sublogos
        ───────────────────────────────────────── */
        .acm-sublogos-block {
          margin-top: clamp(1.75rem, 3.5vh, 2.5rem);
        }

        .acm-sublogos {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(1.4rem, 3vw, 2.5rem);
        }

        .acm-sublogo-plate {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0.85rem;
          border-radius: 12px;
          background: rgba(241, 246, 234, 0.9);
          box-shadow: inset 0 0 0 1px rgba(190, 224, 168, 0.22);
          opacity: 0.82;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .acm-sublogo-plate:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .acm-sublogo {
          width: auto;
          height: clamp(22px, 3vw, 28px);
          object-fit: contain;
        }

        /* ─────────────────────────────────────────
           Story paragraph
        ───────────────────────────────────────── */
        .acm-story-wrap {
          margin-top: clamp(2.5rem, 5vh, 4rem);
          width: 100%;
          max-width: 66rem;
        }

        .acm-story .rw-para {
          margin: 0 auto;
          max-width: 64rem;
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
           Location footer line
        ───────────────────────────────────────── */
        .acm-footer-block {
          margin-top: clamp(2rem, 4vh, 3rem);
        }

        .acm-location {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(15, 22, 35, 0.38);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
