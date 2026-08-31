"use client";

import Image from "next/image";
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
 * What each seat on the panel covers.
 *
 * The names are still sealed — `JUDGES` carries six empty entries until each
 * person confirms — but the domains are locked, so the back of every card has
 * something real on it rather than six copies of "TBA". Index-matched to
 * `JUDGES`; fill a judge's `name`/`role`/`photo.src` and the front face swaps
 * from the sealed print to the portrait on its own.
 */
const SEATS = [
  {
    tag: "Technical architecture",
    domain: "Distributed & scalable systems",
    role: "Full-stack, cloud & infrastructure",
    desc: "Systems design, backend performance, local-first sync protocols, and the real-time infrastructure underneath it all.",
    stats: [
      { val: "8h", label: "On the floor" },
      { val: "1:1", label: "Mentor slots" },
    ],
  },
  {
    tag: "Intelligent agents",
    domain: "AI, agents & machine learning",
    role: "Applied ML & research",
    desc: "Agentic workflows, retrieval and vector search, evaluation loops, and procedural generation for systems that refine their own output.",
    stats: [
      { val: "24/7", label: "Lab access" },
      { val: "6+", label: "Specialists" },
    ],
  },
  {
    tag: "Product & design",
    domain: "Interface, craft & typography",
    role: "Creative technologists",
    desc: "Interface polish, WebGL and shader work, kinetic typography, and the fluid micro-interactions that carry a demo.",
    stats: [
      { val: "3D", label: "Shader help" },
      { val: "Demo", label: "Pitch prep" },
    ],
  },
  {
    tag: "Embedded systems",
    domain: "IoT & hardware prototyping",
    role: "Hardware & sensor lab",
    desc: "Low-power microcontrollers, sensor arrays, firmware debugging, and physical computing you can put on a table.",
    stats: [
      { val: "Kits", label: "On site" },
      { val: "ESP32", label: "Test rigs" },
    ],
  },
  {
    tag: "Trust & security",
    domain: "Security, privacy & resilience",
    role: "Security engineering",
    desc: "Threat modelling, auth and key handling, dependency hygiene, and the failure modes that only show up under load.",
    stats: [
      { val: "Audit", label: "Walkthroughs" },
      { val: "0-day", label: "War stories" },
    ],
  },
  {
    tag: "Story & venture",
    domain: "Pitching, product & venture",
    role: "Founders & operators",
    desc: "Framing the problem, cutting scope honestly, and telling the judges in two minutes why any of it matters.",
    stats: [
      { val: "2 min", label: "Pitch drills" },
      { val: "Top 6", label: "Stage coaching" },
    ],
  },
  {
    tag: "Bio & Climate",
    domain: "Climate tech & bio-computation",
    role: "Regenerative systems & data",
    desc: "Low-power sensing arrays, emissions accounting, carbon transparency protocols, and environmental data models.",
    stats: [
      { val: "Field", label: "Sensor kits" },
      { val: "Open", label: "Climate data" },
    ],
  },
  {
    tag: "Open web & tools",
    domain: "Devtools, protocols & compilers",
    role: "Core infrastructure engineering",
    desc: "Local-first sync, edge runtimes, custom DSLs, debugging tools, and peer-to-peer protocols for resilient apps.",
    stats: [
      { val: "CRDTs", label: "Sync patterns" },
      { val: "Wasm", label: "Toolchain" },
    ],
  },
  {
    tag: "Autonomous systems",
    domain: "Vision, robotics & edge compute",
    role: "Applied robotics & perception",
    desc: "Camera pipelines, spatial tracking, edge inference models, and physical computing that reacts in real-time.",
    stats: [
      { val: "Edge", label: "Inference GPUs" },
      { val: "0.2s", label: "Control loops" },
    ],
  },
];

/**
 * Per-card scroll drift, alternating direction so the grid shears past itself
 * on the way down — the same trick the sponsor wall uses on its mosaic.
 */
const DRIFT = [45, -45, 45, -45, 45, -45, 45, -45, 45] as const;

function SealedFront({ index, seat }: { index: number; seat: (typeof SEATS)[number] }) {
  const qShift = ((index % 3) - 1) * 6;
  const gid = `jdp${index}`;

  return (
    <span className="jd-front">
      <svg className="jd-front-figure" viewBox="0 0 240 262" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}m`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(143,196,90,0.34)" />
            <stop offset="1" stopColor="rgba(143,196,90,0.06)" />
          </linearGradient>
          <filter id={`${gid}s`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
        </defs>
        <path d={BUST} fill={`url(#${gid}m)`} filter={`url(#${gid}s)`} />
      </svg>

      <span className="jd-front-q" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <text x={50 + qShift} y="74" textAnchor="middle">
            ?
          </text>
        </svg>
      </span>

      <span
        className="jd-grain"
        aria-hidden="true"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

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

function PhotoFront({
  index,
  judge,
}: {
  index: number;
  judge: (typeof JUDGES)[number];
}) {
  return (
    <span className="jd-front jd-front-filled">
      <Image
        src={judge.photo.src as string}
        alt={judge.name}
        fill
        sizes="(max-width: 620px) 90vw, (max-width: 1000px) 44vw, 30vw"
        className="jd-front-photo"
      />
      <span className="jd-front-scrim" aria-hidden="true" />
      <span className="jd-front-meta">
        <span className="jd-front-seat">
          Seat {String(index + 1).padStart(2, "0")}
        </span>
        <span className="jd-front-domain">{judge.name}</span>
        <span className="jd-front-role">{judge.role}</span>
      </span>
    </span>
  );
}

function SeatBack({ seat }: { seat: (typeof SEATS)[number] }) {
  return (
    <span className="jd-back">
      <span className="jd-back-tag">{seat.tag}</span>
      <span className="jd-back-title">{seat.domain}</span>
      <span className="jd-back-rule" aria-hidden="true" />
      <span className="jd-back-role">{seat.role}</span>
      <span className="jd-back-desc">{seat.desc}</span>

      <span className="jd-back-stats">
        {seat.stats.map((s) => (
          <span className="jd-back-stat" key={s.label}>
            <span className="jd-back-val">{s.val}</span>
            <span className="jd-back-lbl">{s.label}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Judges() {
  // Every name still blank means the whole panel is under wraps.
  const sealed = JUDGES.every((j) => j.name.trim().length === 0 && !j.photo.src);

  return (
    <section id="judges" className="jd" aria-label="Mentors and Judges">
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
              {sealed
                ? "Nine seats, nine domains — locked. The mentor & judge lineup stays sealed until the official reveal."
                : "Experienced builders, designers, and researchers guiding teams through the 8-hour sprint."}
            </p>
          </RevealBlock>
        </div>

        {/* ── Nine flip cards (3x3 grid), one per seat ── */}
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
                      ratio="var(--jd-ratio, 4 / 5)"
                      disabled={!filled}
                      label={
                        filled
                          ? `${judge.name} — ${judge.role}. Turn the card for details.`
                          : `${seat.domain} — seat ${i + 1}. Locked.`
                      }
                      front={
                        filled ? (
                          <PhotoFront index={i} judge={judge} />
                        ) : (
                          <SealedFront index={i} seat={seat} />
                        )
                      }
                      back={<SeatBack seat={seat} />}
                    />
                  </ParallaxY>
                );
              })}
            </div>

            {/* ── Mobile: Smooth Infinite Marquee Tracks with Hover/Touch Pause (< 680px) ── */}
            <div className="jd-marquee-wrap" aria-label="Mentors and judges scrolling carousel">
              {/* Row 1 — Seats 1 to 5 scrolling left */}
              <div className="jd-marquee-track jd-marquee-track-1">
                {[...JUDGES.slice(0, 5), ...JUDGES.slice(0, 5)].map((judge, idx) => {
                  const originalIdx = idx % 5;
                  const seat = SEATS[originalIdx];
                  const filled = judge.name.trim().length > 0 && !!judge.photo.src;

                  return (
                    <div className="jd-marquee-card" key={`m1-${idx}-${judge.photo.expect}`}>
                      <FlipCard
                        ratio="3 / 4.4"
                        disabled={!filled}
                        label={
                          filled
                            ? `${judge.name} — ${judge.role}.`
                            : `${seat.domain} — seat ${originalIdx + 1}.`
                        }
                        front={
                          filled ? (
                            <PhotoFront index={originalIdx} judge={judge} />
                          ) : (
                            <SealedFront index={originalIdx} seat={seat} />
                          )
                        }
                        back={<SeatBack seat={seat} />}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Row 2 — Seats 6 to 9 scrolling right */}
              <div className="jd-marquee-track jd-marquee-track-2">
                {[...JUDGES.slice(5, 9), ...JUDGES.slice(5, 9), ...JUDGES.slice(5, 9)].map((judge, idx) => {
                  const originalIdx = 5 + (idx % 4);
                  const seat = SEATS[originalIdx];
                  const filled = judge.name.trim().length > 0 && !!judge.photo.src;

                  return (
                    <div className="jd-marquee-card" key={`m2-${idx}-${judge.photo.expect}`}>
                      <FlipCard
                        ratio="3 / 4.4"
                        disabled={!filled}
                        label={
                          filled
                            ? `${judge.name} — ${judge.role}.`
                            : `${seat.domain} — seat ${originalIdx + 1}.`
                        }
                        front={
                          filled ? (
                            <PhotoFront index={originalIdx} judge={judge} />
                          ) : (
                            <SealedFront index={originalIdx} seat={seat} />
                          )
                        }
                        back={<SeatBack seat={seat} />}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barrier tape and wax over the whole panel: the seats are set,
                the names are not. */}
            {sealed && <Seal word="PANEL SEALED" />}
          </div>
        </RevealBlock>

        <RevealBlock y={14} delay={0.12}>
          <div className="jd-foot-wrap">
            <p className="jd-foot-note">
              {sealed
                ? "Mentor & judge profiles are currently locked · Revealing soon"
                : "Hover a card — or tap it on a phone — to read the seat."}
            </p>

            <button
              type="button"
              className="jd-explore-btn"
              aria-label="Explore all mentors and judges - Currently Locked"
              disabled
            >
              <span className="jd-btn-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="jd-lock-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span className="jd-btn-text-default">Explore all mentors &amp; judges</span>
              <span className="jd-btn-text-hover">Locked · Revealing Soon</span>
            </button>
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
          color: #7FB84E;
          opacity: 0.62;
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
          letter-spacing: -0.028em;
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
          max-width: 86rem;
          margin-inline: auto;
        }

        .jd-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: 100%;
          gap: clamp(1.2rem, 2.8vw, 2.2rem);
        }

        .jd .jseal {
          position: absolute;
          inset: clamp(-2.5rem, -4vw, -1.25rem) -9%;
          z-index: 10;
          pointer-events: none;
        }

        .jd .jseal-tape-a { transform: translateY(-50%) rotate(-42deg); }
        .jd .jseal-tape-b { transform: translateY(-50%) rotate(40deg); }

        /* Set the panel back behind the tape and wax: a light defocus plus a
           knock-down in brightness. It clears on hover or keyboard focus, so
           the cards are still readable and still turn — only the names are
           sealed, not the seats. No pointer-events lock for the same reason. */
        /* The defocus sits on .px-in — the element ParallaxY transforms — and
           NOT on .jd-grid above it. A filter on an ancestor of moving children
           has to re-blur the whole grid every scroll frame; on the moving
           element itself the blur rasterises once and the drift is a plain
           composited translate. Same look, a fraction of the cost. */
        .jd-grid-wrap[data-sealed="true"] .jd-cell .px-in {
          filter: blur(3.4px) saturate(0.9) brightness(0.78);
          transition: filter 450ms var(--ease-out);
        }
        .jd-grid-wrap[data-sealed="true"]:hover .jd-cell .px-in,
        .jd-grid-wrap[data-sealed="true"]:focus-within .jd-cell .px-in {
          filter: blur(0px) saturate(1) brightness(0.98);
        }

        /* Seal was drawn for the sage sections: its vignette is a pale wash
           that would ring the panel in light on the night field. */
        .jd .jseal::before {
          background: radial-gradient(130% 100% at 50% 44%,
            rgba(1, 3, 1, 0) 46%,
            rgba(1, 3, 1, 0.72) 100%);
        }

        /* ── Front face: the print that has not developed ── */
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

        /* real portrait, once one exists */
        .jd-front-photo { object-fit: cover; }
        .jd-front-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(3, 8, 2, 0) 42%, rgba(3, 8, 2, 0.88) 100%);
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

        .jd-front-role {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.8rem;
          color: rgba(214, 232, 202, 0.62);
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
          background: rgba(8, 18, 6, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        /* ── Back face: the seat brief ── */
        .jd-back {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          padding: clamp(1.1rem, 2.4vw, 1.6rem);
          border-radius: var(--radius-lg);
          background:
            radial-gradient(110% 70% at 12% 0%, rgba(92, 140, 58, 0.3) 0%, rgba(92, 140, 58, 0) 58%),
            linear-gradient(165deg, #1B2E16 0%, #070E05 100%);
          box-shadow:
            inset 0 0 0 1px rgba(190, 224, 168, 0.18),
            inset 0 1px 0 rgba(214, 240, 190, 0.2);
        }

        .jd-back-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.19em;
          text-transform: uppercase;
          color: #9FD066;
        }

        .jd-back-title {
          margin-top: 0.55rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #F2F8EA;
          text-wrap: balance;
        }

        .jd-back-rule {
          display: block;
          width: 2.25rem;
          height: 1px;
          margin: 0.8rem 0;
          background: rgba(143, 196, 90, 0.45);
        }

        .jd-back-role {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(200, 226, 185, 0.72);
        }

        .jd-back-desc {
          margin-top: 0.6rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.79rem, 1.02vw, 0.87rem);
          line-height: 1.58;
          color: rgba(206, 226, 194, 0.6);
        }

        .jd-back-stats {
          display: flex;
          gap: clamp(0.9rem, 2vw, 1.5rem);
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(190, 224, 168, 0.16);
        }

        .jd-back-stat {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .jd-back-val {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(1.0rem, 12.56px + 0.957vw, 1.55rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: #F2F8EA;
        }

        .jd-back-lbl {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.66rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(200, 226, 185, 0.55);
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
          background: rgba(226, 244, 208, 0.07);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(190, 224, 168, 0.22);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #E9F4DE;
          cursor: not-allowed;
          user-select: none;
          overflow: hidden;
          min-width: 17rem;
          transition: transform 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        .jd-btn-icon-wrap {
          display: grid;
          place-items: center;
          width: 1.25rem;
          height: 1.25rem;
          color: #9FD066;
          transition: color 220ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .jd-lock-icon {
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
          color: #FFDE7A;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: opacity 200ms ease, transform 200ms ease;
          white-space: nowrap;
        }

        .jd-explore-btn:hover {
          background: rgba(235, 175, 45, 0.12);
          border-color: rgba(255, 215, 90, 0.45);
          box-shadow: 0 0 20px rgba(240, 190, 60, 0.16);
          transform: translateY(-1px);
        }

        .jd-explore-btn:hover .jd-btn-icon-wrap {
          color: #FFDE7A;
          transform: scale(1.18);
        }

        .jd-explore-btn:hover .jd-btn-text-default {
          opacity: 0;
          transform: translateY(-8px);
        }

        .jd-explore-btn:hover .jd-btn-text-hover {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 960px) {
          .jd-grid-wrap {
            max-width: 48rem;
          }
          .jd-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(1rem, 2.4vw, 1.8rem);
          }
          .jd-front-domain {
            font-size: clamp(0.85rem, 1.8vw, 1.05rem);
          }
          .jd-back-title {
            font-size: clamp(0.85rem, 1.8vw, 1.08rem);
          }
          .jd .jseal-tape-a { transform: translateY(-50%) rotate(-45deg); }
          .jd .jseal-tape-b { transform: translateY(-50%) rotate(43deg); }
        }

        @media (max-width: 960px) {
          .jd-grid-wrap {
            max-width: 56rem;
          }
          .jd-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(0.9rem, 2.5vw, 1.6rem);
          }
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
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .jd-marquee-track {
          display: flex;
          width: max-content;
          gap: 0.85rem;
          padding-block: 0.35rem;
          will-change: transform;
          touch-action: pan-y;
        }

        .jd-marquee-track-1 {
          animation: jd-marquee-scroll-left 28s linear infinite;
        }

        .jd-marquee-track-2 {
          animation: jd-marquee-scroll-right 32s linear infinite;
        }

        .jd-marquee-wrap:hover .jd-marquee-track,
        .jd-marquee-wrap:active .jd-marquee-track,
        .jd-marquee-wrap:focus-within .jd-marquee-track,
        .jd-marquee-track:hover,
        .jd-marquee-track:active {
          animation-play-state: paused !important;
        }

        .jd-marquee-card {
          width: clamp(140px, 42vw, 185px);
          flex-shrink: 0;
          transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .jd-marquee-card:hover,
        .jd-marquee-card:active {
          transform: scale(1.04);
          z-index: 10;
        }

        @keyframes jd-marquee-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes jd-marquee-scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 680px) {
          .jd-grid {
            display: none !important;
          }
          .jd-marquee-wrap {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
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
          .jd-front-meta {
            padding: 0.55rem 0.5rem;
            gap: 0.15rem;
          }
          .jd-front-seat { font-size: 0.64rem; letter-spacing: 0.12em; }
          .jd-front-domain { font-size: 0.88rem; line-height: 1.18; }
          .jd-front-role { font-size: 0.72rem; }
          .jd-stamp { font-size: 0.66rem; padding: 0.16rem 0.4rem; top: 0.35rem; right: 0.35rem; }
          .jd-back { padding: 0.6rem 0.55rem; }
          .jd-back-tag { font-size: 0.66rem; letter-spacing: 0.1em; }
          .jd-back-title { font-size: 0.88rem; line-height: 1.18; margin-top: 0.15rem; }
          .jd-back-rule { margin: 0.3rem 0; width: 1.2rem; }
          .jd-back-role { font-size: 0.72rem; }
          .jd-back-desc { font-size: 0.72rem; line-height: 1.36; margin-top: 0.25rem; }
          .jd-back-stats { margin-top: auto; padding-top: 0.3rem; gap: 0.45rem; }
          .jd-back-val { font-size: 1.05rem; }
          .jd-back-lbl { font-size: 0.66rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .jd-front-figure { animation: none; }
          .jd-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
