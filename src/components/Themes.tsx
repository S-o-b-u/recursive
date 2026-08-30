"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { TRACKS } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import MorphSlider, {
  type MorphSliderApi,
  type MorphSliderItem,
} from "@/components/ui/MorphSlider";
import { buildTrackTextures } from "@/lib/track-textures";

/** Autoplay dwell, shared by the slider and the rail's progress bar. */
const DWELL = 6;

export default function Themes() {
  const [active, setActive] = useState(0);
  const [slides, setSlides] = useState<MorphSliderItem[] | null>(null);
  const api = useRef<MorphSliderApi | null>(null);
  const brief = useRef<HTMLDivElement>(null);

  // Textures are painted on a canvas, so they can only be built once there is
  // a document. Built once and held in state — MorphSlider tears down and
  // rebuilds its WebGL engine whenever `items` changes identity.
  useEffect(() => {
    const images = buildTrackTextures(TRACKS.map((t) => t.media.src || undefined));
    setSlides(
      TRACKS.map((track, i) => ({ image: images[i], caption: track.title })),
    );
  }, []);

  /**
   * Re-play the brief on every slide change in the site's own reveal language,
   * rather than the generic fade-up this had before.
   *
   * The numbers are lifted straight from `reveal.tsx` so the swap is
   * indistinguishable from a RevealHeading / RevealBlock firing on scroll:
   * the title rides a line mask at yPercent 112 -> 0 on expo.out, the rule
   * draws itself on scaleX, and the supporting copy lifts and fades on
   * power3.out. Change them there and change them here.
   */
  useEffect(() => {
    const root = brief.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".th-brief-title .th-mask-inner",
        { yPercent: 112 },
        { yPercent: 0, ease: "expo.out", duration: 1.45 },
      );
      gsap.fromTo(
        ".th-brief-rule i",
        { scaleX: 0 },
        { scaleX: 1, ease: "expo.out", duration: 1.65, delay: 0.08 },
      );
      gsap.fromTo(
        ".th-brief-lift",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "expo.out",
          duration: 1.45,
          stagger: 0.07,
          delay: 0.04,
        },
      );
    }, root);

    return () => ctx.revert();
  }, [active]);

  const track = TRACKS[active] ?? TRACKS[0];
  const index = String(active + 1).padStart(2, "0");

  return (
    <section id="themes" className="th" aria-label="Tracks">
      <div className="th-inner">
        <RevealBlock y={14}>
          <div className="th-ornament-wrap">
            <Ornament tone="night" className="th-motif" />
          </div>
        </RevealBlock>

        <div className="th-head-wrap">
          <RevealBlock y={10}>
            <span className="th-eyebrow">004 · The four tracks</span>
          </RevealBlock>

          <RevealHeading
            className="th-heading"
            lines={["Four directions", "to build in."]}
          />

          <RevealBlock y={12} delay={0.06}>
            <p className="th-lede">
              One seat at the table for each. Pick the one you cannot stop
              thinking about — every track is judged on the same four criteria.
            </p>
          </RevealBlock>
        </div>

        {/* ── Stage: morphing plate on the left, the brief on the right ── */}
        <RevealBlock y={26} delay={0.1} className="th-stage-reveal">
          <div className="th-stage">
            <div className="th-plate">
              {slides && (
                <MorphSlider
                  items={slides}
                  apiRef={api}
                  startIndex={0}
                  transition="melt"
                  duration={1.25}
                  intensity={0.62}
                  scale={2.6}
                  aberration={0.4}
                  drift={0.5}
                  autoplay
                  autoplayDelay={DWELL}
                  radius={20}
                  overlayColor="#010301"
                  showCaptions={false}
                  showControls={false}
                  showIndicators={false}
                  onSlideChange={setActive}
                  className="th-morph"
                />
              )}

              {/* keyline + corner ticks, drawn over the canvas */}
              <span className="th-plate-frame" aria-hidden="true" />

              <span className="th-plate-index" aria-hidden="true">
                {index}
              </span>

              <span className="th-plate-hint">Drag to morph</span>
            </div>

            <div className="th-brief" ref={brief}>
              <span className="th-brief-seat th-brief-lift">{track.seat}</span>

              {/* Same two-span mask RevealHeading uses, so the title lifts out
                  of a clipped line instead of just fading in. */}
              <h3 className="th-brief-title">
                <span className="th-mask-line">
                  <span className="th-mask-inner">{track.title}</span>
                </span>
              </h3>

              <span className="th-brief-rule" aria-hidden="true">
                <i />
              </span>

              <p className="th-brief-line th-brief-lift">{track.line}</p>
              <p className="th-brief-summary th-brief-lift">{track.summary}</p>

              <ul className="th-prompts">
                {track.prompts.map((prompt) => (
                  <li key={prompt} className="th-brief-lift">
                    <svg viewBox="0 0 12 14" aria-hidden="true">
                      <path d="M6 13.4V4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M6.2 7.6C10 7 11.4 4 11.6 0.4C7.8 0.6 6 4 6.2 7.6Z" fill="currentColor" />
                      <path d="M5.6 10.6C2.4 10.2 1 8 0.6 5C3.8 5.2 5.4 7.6 5.6 10.6Z" fill="currentColor" />
                    </svg>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="th-brief-link th-brief-lift"
                aria-label="Read the full brief - Currently Locked"
                disabled
              >
                <span className="th-link-text-slot">
                  <span className="th-link-text-default">Read the full brief</span>
                  <span className="th-link-text-hover">Locked · Revealing Soon</span>
                </span>
                <span className="th-link-icon-slot" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="th-link-arrow">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="th-link-lock">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </RevealBlock>

        {/* ── Rail: four tabs, the active one carrying the dwell bar ── */}
        <RevealBlock y={16} delay={0.14} className="th-rail-reveal">
          <div className="th-rail" role="tablist" aria-label="Tracks">
            {TRACKS.map((t, i) => (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`th-tab ${i === active ? "is-active" : ""}`}
                onClick={() => api.current?.goToIndex(i)}
              >
                <span className="th-tab-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="th-tab-name">{t.title}</span>
                <span className="th-tab-bar" aria-hidden="true">
                  {i === active && <i key={active} />}
                </span>
              </button>
            ))}
          </div>
        </RevealBlock>
      </div>

      <style>{`
        .th {
          position: relative;
          width: 100%;
          background: transparent;
          color: #EEF5E6;
          /* Half the visible gap to the next section — the other half is its
             own padding-top. 13vh on both sides read as ~250px of dead field. */
          padding-block: clamp(3.25rem, 7.5vh, 6rem);
          overflow: hidden;
          z-index: 1;
        }

        .th-inner {
          position: relative;
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .th-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
        }

        .th-motif {
          width: clamp(190px, 22vw, 260px);
          height: auto;
          color: #7FB84E;
          opacity: 0.62;
        }

        .th-head-wrap { width: 100%; }

        .th-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8FC45A;
        }

        .th-heading {
          margin-top: 0.7rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          line-height: 1.12;
          letter-spacing: -0.028em;
          color: #F1F7E9;
        }
        .th-heading .rh-line { display: flex; justify-content: center; }

        .th-lede {
          margin: clamp(0.85rem, 1.8vh, 1.25rem) auto 0;
          max-width: 42rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1rem, 1.45vw, 1.15rem);
          line-height: 1.62;
          color: rgba(222, 235, 212, 0.6);
          text-wrap: pretty;
        }

        /* ── Stage ── */
        .th-stage-reveal {
          width: 100%;
          margin-top: clamp(2.75rem, 6vh, 4.5rem);
        }

        .th-stage {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(0, 1fr);
          gap: clamp(1.75rem, 4vw, 3.25rem);
          align-items: center;
          text-align: left;
        }

        /* ── Left: the morphing plate ── */
        .th-plate {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          border-radius: 20px;
          overflow: hidden;
          background: #060B05;
          box-shadow:
            0 30px 70px -34px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(190, 224, 168, 0.1);
        }

        .th-morph { width: 100%; height: 100%; }

        .th-plate-frame {
          position: absolute;
          inset: 12px;
          z-index: 3;
          border-radius: 12px;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(238, 248, 228, 0.16);
          /* corner ticks: keep the keyline only at the four corners */
          -webkit-mask:
            linear-gradient(#000 0 0) top left / 22px 22px no-repeat,
            linear-gradient(#000 0 0) top right / 22px 22px no-repeat,
            linear-gradient(#000 0 0) bottom left / 22px 22px no-repeat,
            linear-gradient(#000 0 0) bottom right / 22px 22px no-repeat;
          mask:
            linear-gradient(#000 0 0) top left / 22px 22px no-repeat,
            linear-gradient(#000 0 0) top right / 22px 22px no-repeat,
            linear-gradient(#000 0 0) bottom left / 22px 22px no-repeat,
            linear-gradient(#000 0 0) bottom right / 22px 22px no-repeat;
        }

        .th-plate-index {
          position: absolute;
          left: clamp(1rem, 2vw, 1.6rem);
          top: clamp(0.4rem, 1vw, 0.9rem);
          z-index: 4;
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: transparent;
          -webkit-text-stroke: 1.2px rgba(240, 250, 230, 0.42);
          pointer-events: none;
        }

        .th-plate-hint {
          position: absolute;
          right: clamp(1rem, 2vw, 1.5rem);
          bottom: clamp(0.9rem, 1.8vw, 1.3rem);
          z-index: 4;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240, 250, 230, 0.42);
          pointer-events: none;
        }

        /* ── Right: the brief ── */
        .th-brief {
          display: flex;
          flex-direction: column;
        }

        /* Mirrors .rh-line / .rh-inner in reveal.tsx, including the descender
           allowance that stops the mask clipping a 'y' or 'g'. */
        .th-mask-line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.09em;
          margin-bottom: -0.09em;
        }
        .th-mask-inner { display: block; }

        .th-brief-seat {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8FC45A;
        }

        .th-brief-title {
          margin: 0.75rem 0 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.35rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.026em;
          color: #F1F7E9;
          text-wrap: balance;
        }

        .th-brief-rule {
          display: block;
          width: 100%;
          height: 1px;
          margin-block: clamp(1rem, 2vw, 1.4rem);
        }
        .th-brief-rule i {
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(143, 196, 90, 0.34);
          transform-origin: left center;
        }

        .th-brief-line {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.02rem, 1.55vw, 1.22rem);
          font-weight: 450;
          line-height: 1.42;
          letter-spacing: -0.018em;
          color: rgba(233, 244, 224, 0.92);
          text-wrap: pretty;
        }

        .th-brief-summary {
          margin-top: 0.85rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.92rem, 1.2vw, 1rem);
          line-height: 1.66;
          color: rgba(214, 230, 203, 0.56);
          text-wrap: pretty;
        }

        .th-prompts {
          list-style: none;
          margin: clamp(1.1rem, 2.4vw, 1.6rem) 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.62rem;
        }

        .th-prompts li {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.85rem, 1.1vw, 0.94rem);
          line-height: 1.45;
          color: rgba(226, 240, 216, 0.76);
        }

        .th-prompts svg {
          flex: none;
          width: 0.72rem;
          height: auto;
          margin-top: 0.24em;
          color: rgba(143, 196, 90, 0.72);
        }

        .th-brief-link {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: clamp(1.3rem, 2.6vw, 1.9rem);
          padding: 0;
          padding-bottom: 3px;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(143, 196, 90, 0.34);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #B8DE8C;
          cursor: not-allowed;
          user-select: none;
          transition: color 200ms ease, border-color 200ms ease, gap 200ms ease;
        }

        .th-link-text-slot {
          display: inline-grid;
          grid-template-areas: "text";
          align-items: center;
        }

        .th-link-text-default {
          grid-area: text;
          display: inline-block;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .th-link-text-hover {
          grid-area: text;
          display: inline-block;
          opacity: 0;
          transform: translateY(4px);
          color: #FFDE7A;
          white-space: nowrap;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .th-link-icon-slot {
          display: inline-grid;
          place-items: center;
          width: 0.95rem;
          height: 0.95rem;
          flex-shrink: 0;
        }

        .th-link-arrow {
          grid-area: 1 / 1;
          width: 0.88rem;
          height: 0.88rem;
          opacity: 1;
          transform: scale(1);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .th-link-lock {
          grid-area: 1 / 1;
          width: 0.88rem;
          height: 0.88rem;
          color: #FFDE7A;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .th-brief-link:hover {
          color: #FFDE7A;
          border-color: rgba(255, 222, 122, 0.6);
        }

        .th-brief-link:hover .th-link-text-default {
          opacity: 0;
          transform: translateY(-4px);
        }

        .th-brief-link:hover .th-link-text-hover {
          opacity: 1;
          transform: translateY(0);
        }

        .th-brief-link:hover .th-link-arrow {
          opacity: 0;
          transform: scale(0.7);
        }

        .th-brief-link:hover .th-link-lock {
          opacity: 1;
          transform: scale(1);
        }

        /* ── Rail ── */
        .th-rail-reveal {
          width: 100%;
          margin-top: clamp(2.5rem, 5vh, 4rem);
        }

        .th-rail {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.6rem, 1.6vw, 1.25rem);
          width: 100%;
          border-top: 1px solid rgba(190, 224, 168, 0.13);
          padding-top: clamp(1rem, 2vw, 1.5rem);
        }

        .th-tab {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.4rem;
          padding: 0.35rem 0 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: opacity 240ms ease;
        }

        .th-tab-num {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.64rem;
          letter-spacing: 0.18em;
          color: rgba(190, 224, 168, 0.45);
          transition: color 240ms ease;
        }

        .th-tab-name {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.8rem, 1.1vw, 0.95rem);
          font-weight: 500;
          letter-spacing: -0.012em;
          line-height: 1.25;
          color: rgba(226, 240, 216, 0.48);
          transition: color 240ms ease;
          text-wrap: balance;
        }

        .th-tab:hover .th-tab-name { color: rgba(226, 240, 216, 0.8); }

        .th-tab.is-active .th-tab-num { color: #8FC45A; }
        .th-tab.is-active .th-tab-name { color: #F1F7E9; }

        .th-tab-bar {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          border-radius: 2px;
          background: rgba(190, 224, 168, 0.12);
          overflow: hidden;
        }

        /* the dwell bar — restarts on every slide change via its React key */
        .th-tab-bar i {
          display: block;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #5C8C3A, #B8DE8C);
          transform-origin: left center;
          animation: th-dwell ${DWELL}s linear forwards;
        }

        @keyframes th-dwell {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .th-tab:focus-visible {
          outline: 2px solid rgba(143, 196, 90, 0.7);
          outline-offset: 4px;
          border-radius: 4px;
        }

        @media (max-width: 900px) {
          .th-stage {
            grid-template-columns: minmax(0, 1fr);
            gap: clamp(1.5rem, 5vw, 2.25rem);
          }
          .th-plate { aspect-ratio: 4 / 3; }
          .th-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 1rem; }
        }

        @media (max-width: 460px) {
          .th-rail { grid-template-columns: minmax(0, 1fr); }
        }

        @media (prefers-reduced-motion: reduce) {
          .th-mask-inner { transform: none; }
        }
      `}</style>
    </section>
  );
}
