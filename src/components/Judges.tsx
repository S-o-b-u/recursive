"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { JUDGES, EVENT } from "@/data/hackathon";
import { RevealHeading, RevealBlock, ParallaxY } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import FlipCard from "@/components/ui/FlipCard";
import Seal from "@/components/ui/Seal";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Head-and-shoulders bust, one path, no seam. viewBox 0 0 240 262. */
const BUST =
  "M120 40c26 0 47 21 47 47 0 17-9 32-23 40 34 7 60 30 68 62 3 12 4 25 4 39l0 34-186 0 0-34c0-14 1-27 4-39 8-32 34-55 68-62-14-8-23-23-23-40 0-26 21-47 47-47z";

/**
/**
 * Confirmed panel seats and domains.
 * Index-matched to `JUDGES`.
 */
const SEATS = [
  {
    tag: "Technical architecture",
    domain: "Distributed & scalable systems",
    role: "Professor, CSE, Univ. of Calcutta | ACM Kolkata Chair",
    desc: "Systems architecture, distributed protocols, cloud resilience, and large-scale computing infrastructure.",
    stats: [
      { val: "30+ yrs", label: "Research & Academics" },
      { val: "ACM", label: "Chapter Chair" },
    ],
  },
  {
    tag: "Intelligent systems",
    domain: "AI, agents & cognitive systems",
    role: "Lead Research Scientist, TCS Research",
    desc: "Autonomous agentic workflows, knowledge graphs, cognitive computing, and applied machine learning models.",
    stats: [
      { val: "TCS", label: "Research Lab" },
      { val: "AI/ML", label: "Cognitive Systems" },
    ],
  },
  {
    tag: "Platform architecture",
    domain: "Generative AI & cloud platforms",
    role: "Founder & Lead, CORE Platform",
    desc: "High-scale cloud backends, API automation, agent tooling integrations, and rapid product venture delivery.",
    stats: [
      { val: "CORE", label: "Platform Founder" },
      { val: "GenAI", label: "Cloud Systems" },
    ],
  },
  {
    tag: "Applied AI & Cloud",
    domain: "Applied ML & hackathon mentorship",
    role: "AI Engineer, TCS | InnoFusion Organizer",
    desc: "Production LLM pipelines, multi-modal applications, cloud orchestration, and community hackathon architecture.",
    stats: [
      { val: "TCS", label: "AI Engineer" },
      { val: "Lead", label: "InnoFusion" },
    ],
  },
  {
    tag: "NLP & Deep Learning",
    domain: "NLP, embeddings & software systems",
    role: "Software Engineer & NLP Researcher",
    desc: "Language model fine-tuning, embeddings, vector search, and dependable backend software system architecture.",
    stats: [
      { val: "NLP", label: "Deep Learning" },
      { val: "Systems", label: "Software Engineer" },
    ],
  },
  {
    tag: "Product & Interface",
    domain: "Interface craft & frontend systems",
    role: "Software Engineer & Systems Developer",
    desc: "High-performance web applications, fluid micro-interactions, reactive architecture, and stage demo execution.",
    stats: [
      { val: "Fullstack", label: "Frontend Systems" },
      { val: "Mentor", label: "Hackathon Winner" },
    ],
  },
];

/**
 * Per-card scroll drift for the 6 cards.
 */
const DRIFT = [35, -35, 35, -35, 35, -35] as const;

function SealedFront({ index, seat }: { index: number; seat: (typeof SEATS)[number] }) {
  const qShift = ((index % 3) - 1) * 6;
  const gid = `jdp${index}`;

  return (
    <span className="jd-front">
      <svg className="jd-front-figure" viewBox="0 0 240 262" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}m`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(143,196,90,0.30)" />
            <stop offset="1" stopColor="rgba(143,196,90,0.06)" />
          </linearGradient>
        </defs>
        <path d={BUST} fill={`url(#${gid}m)`} />
      </svg>

      <span className="jd-front-q" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <text x={50 + qShift} y={74} textAnchor="middle">
            ?
          </text>
        </svg>
      </span>

      <span className="jd-grain" aria-hidden="true" />

      <span className="jd-front-meta">
        <span className="jd-front-seat">
          Seat {String(index + 1).padStart(2, "0")}
        </span>
        <span className="jd-front-domain">{seat.domain}</span>
      </span>

      <span className="jd-stamp">Sealed</span>
    </span>
  );
}

/**
 * ID Badge Pass card face matching conference credential design.
 * Features outer laminate frame, top lanyard slot & strap with arrow glyph,
 * vertical theme color block, grayscale cutout portrait, and bottom
 * monogram emblem + high-contrast nameplate.
 */
function PhotoFront({
  index,
  judge,
}: {
  index: number;
  judge: (typeof JUDGES)[number];
}) {
  return (
    <span className="jd-badge-card">
      {/* Top Lanyard Clip & Punch Hole */}
      <span className="jd-badge-top" aria-hidden="true">
        <span className="jd-badge-slot-clip">
          <span className="jd-badge-strap">
            <svg
              className="jd-badge-strap-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
          <span className="jd-badge-slot" />
        </span>
      </span>

      {/* Middle: Portrait Area with Vertical Theme Accent Bar */}
      <span className="jd-badge-body">
        <span className="jd-badge-stripe" aria-hidden="true" />
        <span className="jd-badge-neutral" aria-hidden="true" />
        <span className="jd-badge-photo-wrap">
          <Image
            src={judge.photo.src as string}
            alt={judge.name}
            fill
            sizes="(max-width: 680px) 185px, (max-width: 1024px) 45vw, 360px"
            className="jd-badge-photo"
            priority={index < 3}
          />
        </span>
      </span>

      {/* Bottom: Left Dark Monogram Box + Right Clean White Nameplate */}
      <span className="jd-badge-bottom">
        <span className="jd-badge-box" aria-hidden="true">
          <svg className="jd-badge-box-mark" viewBox="0 0 40 40" fill="none">
            {/* Left starburst rays */}
            <path
              d="M12 9V31M6 14L18 26M6 26L18 14M3 20H21"
              stroke="#8FC45A"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Right stacked seat digits */}
            <text
              x="29"
              y="19"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="800"
              fontFamily="var(--font-geist-mono), monospace"
            >
              0
            </text>
            <text
              x="29"
              y="31"
              textAnchor="middle"
              fill="#8FC45A"
              fontSize="11"
              fontWeight="800"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {index + 1}
            </text>
          </svg>
        </span>
        <span className="jd-badge-info">
          <span className="jd-badge-name" title={judge.name}>{judge.name}</span>
          <span className="jd-badge-role" title={judge.role}>{judge.role}</span>
        </span>
      </span>
    </span>
  );
}

function SeatBack({
  index,
  seat,
  judge,
}: {
  index: number;
  seat: (typeof SEATS)[number];
  judge: (typeof JUDGES)[number];
}) {
  return (
    <span className="jd-back">
      <span className="jd-back-slot-wrap" aria-hidden="true">
        <span className="jd-back-slot" />
      </span>

      <span className="jd-back-content">
        <span className="jd-back-tag">
          Seat {String(index + 1).padStart(2, "0")} · {seat.tag}
        </span>
        <span className="jd-back-title">{judge.name}</span>
        <span className="jd-back-role">{seat.role}</span>
        <span className="jd-back-rule" aria-hidden="true" />
        <span className="jd-back-desc">{seat.desc}</span>

        <span className="jd-back-stats">
          {seat.stats.map((s) => (
            <span className="jd-back-stat" key={s.label}>
              <span className="jd-back-val">{s.val}</span>
              <span className="jd-back-lbl">{s.label}</span>
            </span>
          ))}
        </span>
        <span className="jd-back-hint">Turn card over ↺</span>
      </span>
    </span>
  );
}

export default function Judges() {
  // Every name still blank means the whole panel is under wraps.
  const sealed = JUDGES.every((j) => j.name.trim().length === 0 && !j.photo.src);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    const drift1 = section.querySelector<HTMLElement>(".jd-drift-1");
    const drift2 = section.querySelector<HTMLElement>(".jd-drift-2");
    if (!drift1 || !drift2) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        drift1,
        { x: 35 },
        {
          x: -110,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        }
      );

      gsap.fromTo(
        drift2,
        { x: -110 },
        {
          x: 35,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="judges" ref={sectionRef} className="jd" aria-label="Mentors and Judges">
      <div className="jd-inner">
        <RevealBlock y={14}>
          <div className="jd-ornament-wrap">
            <Ornament tone="night" className="jd-motif" />
          </div>
        </RevealBlock>

        <div className="jd-head-wrap">
          <RevealBlock y={10}>
            <span className="jd-eyebrow">The panel &amp; mentors</span>
          </RevealBlock>

          <RevealHeading className="jd-heading" lines={["Mentors & Judges"]} />

          <RevealBlock y={12} delay={0.06}>
            <p className="jd-lede">
              Distinguished researchers, academic leaders, and platform engineers guiding and evaluating teams throughout Recursive 2026.
            </p>
          </RevealBlock>
        </div>

        {/* ── Six conference pass cards (3x2 grid), one per judge ── */}
        <RevealBlock
          y={24}
          delay={0.1}
          stagger={0.07}
          selector=".jd-cell"
          className="jd-grid-reveal"
        >
          <div className="jd-grid-wrap" data-sealed={sealed ? "true" : "false"}>
            <div className="jd-grid">
              {JUDGES.map((judge, i) => {
                const seat = SEATS[i % SEATS.length];
                const filled = judge.name.trim().length > 0 && !!judge.photo.src;

                return (
                  <ParallaxY
                    className="jd-cell"
                    distance={DRIFT[i % DRIFT.length]}
                    key={judge.photo.expect}
                  >
                    <FlipCard
                      ratio="var(--jd-ratio, 3 / 4.25)"
                      disabled={!filled}
                      label={
                        filled
                          ? `${judge.name} — ${judge.role}. Turn the pass for details.`
                          : `${seat.domain} — seat ${i + 1}. Locked.`
                      }
                      front={
                        filled ? (
                          <PhotoFront index={i} judge={judge} />
                        ) : (
                          <SealedFront index={i} seat={seat} />
                        )
                      }
                      back={<SeatBack index={i} seat={seat} judge={judge} />}
                    />
                  </ParallaxY>
                );
              })}
            </div>

            {/* ── Mobile: Smooth Infinite Marquee Tracks (< 680px) ── */}
            <div className="jd-marquee-wrap" aria-label="Mentors and judges scrolling carousel">
              {/* Row 1 — All 6 judges scrolling left */}
              <div className="jd-drift jd-drift-1">
                <div className="jd-marquee-track jd-marquee-track-1">
                  {[...JUDGES, ...JUDGES].map((judge, idx) => {
                    const originalIdx = idx % JUDGES.length;
                    const seat = SEATS[originalIdx];
                    const filled = judge.name.trim().length > 0 && !!judge.photo.src;

                    return (
                      <div className="jd-marquee-card" key={`m1-${idx}-${judge.photo.expect}`}>
                        <FlipCard
                          ratio="3 / 4.25"
                          disabled={!filled}
                          label={
                            filled
                              ? `${judge.name} — ${judge.role}. Turn pass for details.`
                              : `${seat.domain} — seat ${originalIdx + 1}.`
                          }
                          front={
                            filled ? (
                              <PhotoFront index={originalIdx} judge={judge} />
                            ) : (
                              <SealedFront index={originalIdx} seat={seat} />
                            )
                          }
                          back={<SeatBack index={originalIdx} seat={seat} judge={judge} />}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2 — Offset judges scrolling right */}
              <div className="jd-drift jd-drift-2">
                <div className="jd-marquee-track jd-marquee-track-2">
                  {[...JUDGES.slice(3), ...JUDGES.slice(0, 3), ...JUDGES.slice(3), ...JUDGES.slice(0, 3)].map((judge, idx) => {
                    const originalIdx = (idx + 3) % JUDGES.length;
                    const seat = SEATS[originalIdx];
                    const filled = judge.name.trim().length > 0 && !!judge.photo.src;

                    return (
                      <div className="jd-marquee-card" key={`m2-${idx}-${judge.photo.expect}`}>
                        <FlipCard
                          ratio="3 / 4.25"
                          disabled={!filled}
                          label={
                            filled
                              ? `${judge.name} — ${judge.role}. Turn pass for details.`
                              : `${seat.domain} — seat ${originalIdx + 1}.`
                          }
                          front={
                            filled ? (
                              <PhotoFront index={originalIdx} judge={judge} />
                            ) : (
                              <SealedFront index={originalIdx} seat={seat} />
                            )
                          }
                          back={<SeatBack index={originalIdx} seat={seat} judge={judge} />}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Barrier tape and wax over the whole panel if sealed */}
            {sealed && <Seal word="PANEL SEALED" />}
          </div>
        </RevealBlock>

        <RevealBlock y={14} delay={0.12}>
          <div className="jd-foot-wrap">
            <p className="jd-foot-note">
              Hover a pass — or tap it on a phone — to inspect credentials &amp; background.
            </p>

            <a
              href="#tracks"
              className="jd-explore-btn jd-explore-btn-active"
              aria-label="Explore Tracks & Challenges"
            >
              <span className="jd-btn-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="jd-badge-btn-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <span className="jd-btn-text-default">Explore Tracks &amp; Mentorship</span>
              <span className="jd-btn-text-hover">View Hackathon Tracks →</span>
            </a>
          </div>
        </RevealBlock>
      </div>

      <style href="judges-style" precedence="default" suppressHydrationWarning>{`
        .jd {
          position: relative;
          width: 100%;
          background: transparent;
          color: #EEF5E6;
          /* Stacked with the neighbouring sections' padding this is the whole
             gap between them, so it is half of what reads on screen. */
          padding-block: clamp(3.25rem, 7.5vh, 6rem);
          overflow: hidden;
          z-index: 1;
        }

        .jd-inner {
          position: relative;
          max-width: 78rem;
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
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
        }

        .jd-head-wrap { width: 100%; }

        .jd-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8FC45A;
        }

        .jd-heading {
          margin-top: 0.7rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          line-height: 1.15;
          letter-spacing: -0.035em;
          word-spacing: -0.01em;
          color: #F1F7E9;
        }
        .jd-heading .rh-line { display: flex; justify-content: center; }

        .jd-lede {
          margin: clamp(0.85rem, 1.8vh, 1.25rem) auto 0;
          max-width: 44rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1rem, 1.45vw, 1.15rem);
          line-height: 1.62;
          color: rgba(222, 235, 212, 0.6);
          text-wrap: pretty;
        }

        /* ── Grid ── */
        .jd-grid-reveal {
          width: 100%;
          margin-top: clamp(2.75rem, 6vh, 4.5rem);
        }

        /* Seal renders as the last child of this, so it needs to be the
           positioned ancestor. */
        .jd-grid-wrap {
          position: relative;
          width: 100%;
          max-width: 76rem;
          margin-inline: auto;
        }

        .jd-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: 100%;
          gap: clamp(1.4rem, 2.5vw, 2.4rem);
        }

        .jd .jseal {
          position: absolute;
          inset: clamp(-2.5rem, -4vw, -1.25rem) -9%;
          z-index: 10;
          pointer-events: none;
        }

        .jd .jseal-tape-a { transform: translateY(-50%) rotate(-42deg); }
        .jd .jseal-tape-b { transform: translateY(-50%) rotate(40deg); }

        /* When sealed, the cards stay locked behind the wax seal */
        .jd-grid-wrap[data-sealed="true"] .jd-cell .px-in {
          opacity: 0.82;
        }
        .jd-grid-wrap[data-sealed="true"] .jd-marquee-card {
          opacity: 0.88;
        }

        .jd .jseal::before {
          background: radial-gradient(130% 100% at 50% 44%,
            rgba(1, 3, 1, 0) 46%,
            rgba(1, 3, 1, 0.72) 100%);
        }

        /* ── Sealed front face (fallback) ── */
        .jd-front {
          position: absolute;
          inset: 0;
          display: block;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background:
            radial-gradient(118% 76% at 50% 6%, rgba(78, 122, 52, 0.34) 0%, rgba(78, 122, 52, 0) 56%),
            linear-gradient(168deg, #16240F 0%, #080F06 100%);
          box-shadow:
            inset 0 0 0 1px rgba(190, 224, 168, 0.14),
            inset 0 1px 0 rgba(214, 240, 190, 0.16);
        }

        .jd-front-figure {
          position: absolute;
          left: 50%;
          bottom: -2%;
          width: 76%;
          transform: translateX(-50%);
          animation: jd-breathe 7.5s ease-in-out infinite;
        }

        @keyframes jd-breathe {
          0%, 100% { opacity: 0.9; transform: translateX(-50%) scale(1); }
          50%      { opacity: 1;   transform: translateX(-50%) scale(1.015); }
        }

        .jd-front-q {
          position: absolute;
          inset: 0 0 22% 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .jd-front-q svg { width: 32%; filter: blur(0.4px); }
        .jd-front-q text {
          font-family: var(--font-hiruko), var(--font-display), Georgia, serif;
          font-weight: 700;
          font-size: 78px;
          fill: rgba(200, 232, 172, 0.3);
        }

        .jd-grain {
          position: absolute;
          inset: 0;
          opacity: 0.4;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .jd-front-meta {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
          padding: clamp(0.9rem, 2vw, 1.25rem);
          background: linear-gradient(180deg, rgba(4, 10, 3, 0) 0%, rgba(4, 10, 3, 0.82) 46%);
        }

        .jd-front-seat {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(143, 196, 90, 0.9);
        }

        .jd-front-domain {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(0.92rem, 1.3vw, 1.06rem);
          font-weight: 500;
          line-height: 1.24;
          letter-spacing: -0.018em;
          color: #F1F7E9;
          text-wrap: balance;
        }

        .jd-stamp {
          position: absolute;
          top: clamp(0.75rem, 1.6vw, 1rem);
          right: clamp(0.75rem, 1.6vw, 1rem);
          padding: 0.24rem 0.6rem;
          border-radius: var(--radius-pill);
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.62rem, 0.9vw, 0.7rem);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(214, 240, 190, 0.72);
          border: 1px solid rgba(190, 224, 168, 0.24);
          background: rgba(8, 18, 6, 0.88);
        }

        /* ── Conference ID Badge Pass (Front Face) ── */
        .jd-badge-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg, 22px);
          overflow: hidden;
          background: #F4F7F2;
          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.45),
            0 4px 14px rgba(0, 0, 0, 0.25),
            inset 0 0 0 1px rgba(255, 255, 255, 0.95),
            inset 0 1px 0 rgba(255, 255, 255, 1);
          border: 1px solid rgba(190, 224, 168, 0.35);
          padding: clamp(6px, 1.1vw, 10px);
          user-select: none;
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 320ms ease, border-color 320ms ease;
        }

        .fcd:hover .jd-badge-card,
        .jd-marquee-card:hover .jd-badge-card {
          box-shadow:
            0 22px 52px rgba(0, 0, 0, 0.58),
            0 0 28px rgba(143, 196, 90, 0.25),
            inset 0 0 0 1px rgba(255, 255, 255, 1);
          border-color: rgba(143, 196, 90, 0.65);
        }

        /* Top Lanyard Header & Punch Slot */
        .jd-badge-top {
          position: relative;
          width: 100%;
          height: clamp(38px, 9.8%, 46px);
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          z-index: 4;
        }

        .jd-badge-slot-clip {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .jd-badge-strap {
          position: absolute;
          top: -22px;
          width: clamp(36px, 11%, 44px);
          height: 28px;
          background: #142217;
          border-radius: 3px 3px 2px 2px;
          box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 3;
        }

        .jd-badge-strap-icon {
          width: 14px;
          height: 14px;
          color: #FFFFFF;
          stroke: #FFFFFF;
        }

        .jd-badge-slot {
          width: clamp(42px, 13%, 52px);
          height: clamp(8px, 2.3%, 10px);
          border-radius: 9999px;
          background: #081109;
          box-shadow:
            inset 0 2px 3px rgba(0, 0, 0, 0.8),
            0 1px 0 rgba(255, 255, 255, 0.85);
          z-index: 2;
        }

        /* Badge Portrait Area */
        .jd-badge-body {
          position: relative;
          flex: 1;
          width: 100%;
          min-height: 0;
          display: flex;
          overflow: hidden;
          background: #DCE4D8;
          border-radius: 4px 4px 0 0;
        }

        /* Vertical Theme Accent Bar */
        .jd-badge-stripe {
          width: 35%;
          height: 100%;
          background: linear-gradient(180deg, #96CF60 0%, #6EAD3B 100%);
          box-shadow: inset -1px 0 3px rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }

        /* Neutral right area behind photo */
        .jd-badge-neutral {
          flex: 1;
          height: 100%;
          background: linear-gradient(145deg, #E5EBE1 0%, #D4DDD0 100%);
        }

        /* Cutout photo container */
        .jd-badge-photo-wrap {
          position: absolute;
          top: clamp(8px, 1.5vw, 14px);
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
        }

        .jd-badge-photo {
          object-fit: contain !important;
          object-position: bottom center !important;
          filter: grayscale(100%) contrast(1.12) brightness(0.97);
          transition: filter 350ms ease, transform 350ms cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: bottom center;
        }

        .fcd:hover .jd-badge-photo,
        .jd-marquee-card:hover .jd-badge-photo {
          filter: grayscale(15%) contrast(1.06) brightness(1);
          transform: scale(1.02);
        }

        /* Bottom Information Block */
        .jd-badge-bottom {
          position: relative;
          width: 100%;
          height: clamp(62px, 18.5%, 76px);
          display: flex;
          flex-shrink: 0;
          z-index: 3;
          border-radius: 0 0 4px 4px;
          overflow: hidden;
          border-top: 1px solid rgba(18, 36, 20, 0.08);
        }

        /* Dark square monogram badge on the left */
        .jd-badge-box {
          width: 35%;
          height: 100%;
          background: #0A160D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.55);
        }

        .jd-badge-box-mark {
          width: clamp(34px, 80%, 42px);
          height: clamp(34px, 80%, 42px);
        }

        /* Clean light panel on the right with Name and Role */
        .jd-badge-info {
          flex: 1;
          min-width: 0;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-inline: clamp(0.7rem, 1.4vw, 1.05rem);
          padding-block: 0.35rem;
          text-align: left;
        }

        .jd-badge-name {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.9rem, 1.2vw, 1.06rem);
          font-weight: 700;
          line-height: 1.18;
          letter-spacing: -0.02em;
          color: #121F14;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .jd-badge-role {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.7rem, 0.86vw, 0.78rem);
          font-weight: 500;
          line-height: 1.25;
          color: #556B58;
          margin-top: 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Back face: The pass dossier ── */
        .jd-back {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          padding: clamp(0.85rem, 1.8vw, 1.35rem);
          border-radius: var(--radius-lg, 18px);
          background:
            radial-gradient(110% 70% at 12% 0%, rgba(92, 140, 58, 0.28) 0%, rgba(92, 140, 58, 0) 58%),
            linear-gradient(165deg, #182B14 0%, #070F06 100%);
          box-shadow:
            inset 0 0 0 1px rgba(190, 224, 168, 0.22),
            inset 0 1px 0 rgba(214, 240, 190, 0.24);
          overflow: hidden;
        }

        .jd-back-slot-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: clamp(0.45rem, 1vh, 0.75rem);
        }

        .jd-back-slot {
          width: clamp(38px, 12.5%, 48px);
          height: clamp(7px, 2%, 9px);
          border-radius: 9999px;
          background: #020603;
          box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(190, 224, 168, 0.15);
        }

        .jd-back-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          text-align: left;
        }

        .jd-back-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9FD066;
        }

        .jd-back-title {
          margin-top: 0.4rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #F2F8EA;
        }

        .jd-back-role {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.76rem;
          font-weight: 500;
          color: rgba(200, 226, 185, 0.75);
          margin-top: 0.15rem;
        }

        .jd-back-rule {
          display: block;
          width: 2rem;
          height: 1px;
          margin: 0.55rem 0;
          background: rgba(143, 196, 90, 0.45);
        }

        .jd-back-desc {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.74rem, 0.95vw, 0.82rem);
          line-height: 1.5;
          color: rgba(206, 226, 194, 0.68);
        }

        .jd-back-stats {
          display: flex;
          gap: clamp(0.75rem, 1.8vw, 1.35rem);
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(190, 224, 168, 0.16);
        }

        .jd-back-stat {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .jd-back-val {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(0.95rem, 1.35vw, 1.35rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: #F2F8EA;
        }

        .jd-back-lbl {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(200, 226, 185, 0.55);
        }

        .jd-back-hint {
          margin-top: 0.4rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(143, 196, 90, 0.6);
          text-align: center;
        }

        /* ── Footer ── */
        .jd-foot-wrap {
          margin-top: clamp(2.25rem, 4.5vh, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.15rem;
        }

        .jd-foot-note {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(206, 226, 194, 0.42);
        }

        .jd-explore-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.72rem clamp(1.25rem, 16.87px + 0.87vw, 1.75rem);
          border-radius: var(--radius-pill);
          background: rgba(18, 38, 16, 0.85);
          border: 1px solid rgba(190, 224, 168, 0.22);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #E9F4DE;
          user-select: none;
          overflow: hidden;
          min-width: 17rem;
          transition: transform 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        .jd-explore-btn-active {
          cursor: pointer !important;
          pointer-events: auto !important;
          background: rgba(18, 38, 16, 0.9);
          border-color: rgba(143, 196, 90, 0.35);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
          text-decoration: none;
        }

        .jd-explore-btn-active:hover {
          background: rgba(26, 54, 23, 0.95);
          border-color: rgba(143, 196, 90, 0.65);
          box-shadow: 0 0 24px rgba(143, 196, 90, 0.22);
          transform: translateY(-2px);
        }

        .jd-btn-icon-wrap {
          display: grid;
          place-items: center;
          width: 1.25rem;
          height: 1.25rem;
          color: #9FD066;
          transition: color 220ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .jd-badge-btn-icon {
          width: 0.95rem;
          height: 0.95rem;
        }

        .jd-btn-text-default {
          display: inline-block;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .jd-btn-text-hover {
          position: absolute;
          left: 3.2rem;
          opacity: 0;
          transform: translateY(8px);
          color: #8FC45A;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: opacity 200ms ease, transform 200ms ease;
          white-space: nowrap;
        }

        .jd-explore-btn-active:hover .jd-btn-icon-wrap {
          color: #8FC45A;
          transform: scale(1.15);
        }

        .jd-explore-btn-active:hover .jd-btn-text-default {
          opacity: 0;
          transform: translateY(-8px);
        }

        .jd-explore-btn-active:hover .jd-btn-text-hover {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 960px) {
          .jd-grid-wrap {
            max-width: 48rem;
          }
          .jd-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(1rem, 2.2vw, 1.5rem);
          }
          .jd .jseal-tape-a { transform: translateY(-50%) rotate(-45deg); }
          .jd .jseal-tape-b { transform: translateY(-50%) rotate(43deg); }
        }

        /* ── Mobile Marquee Cards (< 680px) ── */
        .jd-marquee-wrap {
          display: none;
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          overflow: hidden;
          padding-block: 0.25rem;
        }

        .jd-marquee-wrap::before,
        .jd-marquee-wrap::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 10vw;
          z-index: 5;
          pointer-events: none;
        }
        .jd-marquee-wrap::before {
          left: 0;
          background: linear-gradient(to right, rgba(14, 26, 16, 0.95) 0%, transparent 100%);
        }
        .jd-marquee-wrap::after {
          right: 0;
          background: linear-gradient(to left, rgba(14, 26, 16, 0.95) 0%, transparent 100%);
        }

        .jd-drift {
          width: 100%;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .jd-marquee-track {
          display: flex;
          width: max-content;
          gap: 0.85rem;
          padding-block: 0.35rem;
          will-change: transform;
          touch-action: pan-y;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .jd-marquee-card {
          width: clamp(146px, 43vw, 182px);
          flex-shrink: 0;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .jd-marquee-card:hover,
        .jd-marquee-card:active {
          transform: scale(1.04);
          z-index: 10;
        }

        .jd-marquee-track-1 {
          animation: jd-marquee-scroll-left 26s linear infinite;
        }

        .jd-marquee-track-2 {
          animation: jd-marquee-scroll-right 30s linear infinite;
        }

        .jd-marquee-wrap:hover .jd-marquee-track,
        .jd-marquee-wrap:active .jd-marquee-track,
        .jd-marquee-wrap:focus-within .jd-marquee-track,
        .jd-marquee-track:hover,
        .jd-marquee-track:active {
          animation-play-state: paused !important;
        }

        @keyframes jd-marquee-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes jd-marquee-scroll-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        @media (max-width: 680px) {
          .jd-front-figure {
            animation: none !important;
          }
          .jd-front-q svg {
            filter: none !important;
          }
          .jd-grid {
            display: none !important;
          }
          .jd-marquee-wrap {
            display: flex !important;
            flex-direction: column;
            gap: 0.75rem;
          }
          .jd-marquee-track {
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .jd-grid-reveal {
            margin-top: clamp(1.75rem, 4.5vh, 2.75rem);
          }
          .jd .jseal {
            position: absolute;
            inset: -1rem -4vw;
            z-index: 20;
            pointer-events: none;
            display: block;
          }
          .jd .jseal-tape {
            height: clamp(34px, 5.5vw, 44px);
          }
          .jd .jseal-tape-a { transform: translateY(-50%) rotate(-32deg); }
          .jd .jseal-tape-b { transform: translateY(-50%) rotate(30deg); }
          .jd .jseal-wax {
            width: clamp(105px, 28vw, 135px);
          }

          /* Mobile Badge pass adjustments */
          .jd-badge-card { padding: 5px; border-radius: 16px; }
          .jd-badge-top { height: 26px; }
          .jd-badge-strap { top: -14px; width: 28px; height: 20px; }
          .jd-badge-strap-icon { width: 10px; height: 10px; }
          .jd-badge-slot { width: 30px; height: 6px; }
          .jd-badge-stripe { width: 28%; }
          .jd-badge-bottom { height: 46px; }
          .jd-badge-box { width: 28%; }
          .jd-badge-box-mark { width: 24px; height: 24px; }
          .jd-badge-info { padding: 0.15rem 0.35rem; }
          .jd-badge-name { font-size: 0.74rem; line-height: 1.15; }
          .jd-badge-role { font-size: 0.58rem; margin-top: 0.05rem; }
          .jd-back { padding: 0.55rem 0.5rem; }
          .jd-back-slot-wrap { margin-bottom: 0.25rem; }
          .jd-back-slot { width: 30px; height: 5px; }
          .jd-back-tag { font-size: 0.54rem; letter-spacing: 0.08em; }
          .jd-back-title { font-size: 0.8rem; line-height: 1.15; margin-top: 0.15rem; }
          .jd-back-role { font-size: 0.64rem; margin-top: 0.05rem; }
          .jd-back-rule { margin: 0.25rem 0; width: 1.2rem; }
          .jd-back-desc { font-size: 0.64rem; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .jd-back-stats { margin-top: auto; padding-top: 0.25rem; gap: 0.45rem; }
          .jd-back-val { font-size: 0.95rem; }
          .jd-back-lbl { font-size: 0.55rem; }
          .jd-back-hint { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .jd-front-figure { animation: none; }
          .jd-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
