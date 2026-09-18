"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SPONSOR_SLOTS, EVENT } from "@/data/hackathon";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import Ornament from "@/components/ui/Ornament";

gsap.registerPlugin(ScrollTrigger);

/**
 * SPONSOR STAGE — the scroll-expand window that carries the page out of night.
 *
 * A small rounded window sits on the black field the judges section leaves
 * behind. Scrolling opens it until it is the whole viewport, and what is behind
 * it turns out to be the sky: the sponsors live inside, on cloud, in the site's
 * daylight palette. Keep scrolling and the stage releases into "Organized by",
 * which is already on that same sky — so there is nothing to cross.
 *
 * Three decisions do most of the work:
 *
 * 1. The window opens with `clip-path`, not width/height. The sky behind it
 *    never moves or resizes; the clip simply uncovers more of it. That is what
 *    makes it read as a window onto something already there rather than a box
 *    being inflated — and it costs no layout.
 *
 * 2. That sky is painted with exactly the parameters `body` uses for the same
 *    file — cover, centre-top, over the viewport box. The stage is `100vh` and
 *    stuck, so its box *is* the viewport: the instant the clip reaches the
 *    edges, the stage and the page background are the same pixels. The hand-off
 *    to ACM is invisible because there is no hand-off.
 *
 * 3. One scalar, `--sxp-p`, drives everything. CSS derives the insets and the
 *    radius from it, so the frame and the keyline (which is a sibling, outside
 *    the clip) stay locked together without duplicating the geometry. GSAP
 *    tweens a proxy and writes the property — it cannot read a `calc()` custom
 *    property back, so it is never asked to.
 *
 * Pinning is `position: sticky`, not ScrollTrigger's pin: Lenis drives native
 * scroll and sticky is native too, so the two cannot disagree. ScrollTrigger is
 * only asked for a scrubbed progress value.
 */

const RATIO = "16 / 9";


export default function SponsorStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollUpRef = useRef<HTMLDivElement>(null);

  const sealed = SPONSOR_SLOTS.every((slot) => !slot.src);

  const scrollUp = () => {
    if (typeof window !== "undefined") {
      const track = trackRef.current;
      if (track) {
        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, trackTop - window.innerHeight * 0.5),
          behavior: "smooth",
        });
      } else {
        window.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const intro = introRef.current;
    const outro = outroRef.current;
    const preview = previewRef.current;
    const body = bodyRef.current;
    const scrollUpBtn = scrollUpRef.current;
    if (!track || !stage || !intro || !outro || !body) return;

    const plate = stage.querySelector<HTMLElement>(".sxp-plate");
    const night = stage.querySelector<HTMLElement>(".sxp-night");
    const frameEl = stage.querySelector<HTMLElement>(".sxp-frame");
    const keyline = stage.querySelector<HTMLElement>(".sxp-keyline");
    const setP = (v: number) => stage.style.setProperty("--sxp-p", v.toFixed(4));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      gsap.set([intro, outro], { opacity: 0 });
      if (preview) gsap.set(preview, { opacity: 0 });
      gsap.set(body, { opacity: 1, y: 0 });
      if (scrollUpBtn) gsap.set(scrollUpBtn, { opacity: 1, y: 0, pointerEvents: "auto" });
      return;
    }

    setP(0);

    /**
     * One function of scroll progress drives every part of the stage.
     *
     * This used to be a scrubbed timeline whose tweens each owned a piece of
     * the state — the window in a custom property written from an onUpdate, the
     * labels and the panel in element tweens. Those pieces could fall out of
     * step with each other: a refresh re-measures without necessarily
     * re-rendering every tween, `invalidateOnRefresh` re-reads a to() tween's
     * start, and a context revert restores element styles but not a property
     * written by hand. Any of those left the window shut with the panel showing
     * through it, and nothing would put it right until the next scroll.
     *
     * Deriving all of it from a single progress value removes the disagreement
     * entirely: there is one number, and everything else is computed from it on
     * every update and every refresh.
     */
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 860 ||
        window.matchMedia("(pointer: coarse)").matches);

    const ctx = gsap.context(() => {
      const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
      const easeWindow = gsap.parseEase("sine.out");
      const easeLabel = gsap.parseEase("power1.out");
      const easePanel = gsap.parseEase("power1.out");
      const easePreview = gsap.parseEase("sine.out");

      // Precomputed once, called every frame
      const setIntro = gsap.quickSetter(intro, "css") as (
        v: Record<string, number>,
      ) => void;
      const setOutro = gsap.quickSetter(outro, "css") as (
        v: Record<string, number>,
      ) => void;
      const setPreview = preview
        ? (gsap.quickSetter(preview, "css") as (v: Record<string, number>) => void)
        : null;
      const setBody = gsap.quickSetter(body, "css") as (
        v: Record<string, number>,
      ) => void;
      const setScrollUp = scrollUpBtn
        ? (gsap.quickSetter(scrollUpBtn, "css") as (v: Record<string, number>) => void)
        : null;

      let bodyInteractive: boolean | null = null;
      let scrollUpInteractive: boolean | null = null;

      let lastInv = -1;
      let lastOp = -1;
      let lastL = -1;
      let lastPr = -1;
      let lastB = -1;
      let lastS = -1;

      let winW = 0;
      let winH = 0;
      let stageW = 0;
      let stageH = 0;

      const measure = () => {
        const probe = document.createElement("div");
        probe.style.cssText =
          "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;" +
          "width:var(--sxp-win-w);height:var(--sxp-win-h);";
        stage.appendChild(probe);
        const pr = probe.getBoundingClientRect();
        winW = pr.width;
        winH = pr.height;
        probe.remove();
        const sr = stage.getBoundingClientRect();
        stageW = sr.width;
        stageH = sr.height;
        lastInv = -1;
        lastOp = -1;
        lastL = -1;
        lastPr = -1;
        lastB = -1;
        lastS = -1;
      };
      measure();

      /** Sub-ranges of the pass, in progress units. */
      const WINDOW_END = 0.55;
      const LABEL_END = 0.20;
      const PREVIEW_END = 0.24;
      const PANEL_IN = 0.20;
      const PANEL_LEN = 0.32;

      const apply = (t: number) => {
        // 1. The window opens and closes with organic, gentle sine.out curve.
        const p = easeWindow(clamp01(t / WINDOW_END));
        const inv = 1 - p;
        if (Math.abs(inv - lastInv) > 0.0004 || (inv <= 0.001 && lastInv > 0.001) || (inv >= 0.999 && lastInv < 0.999)) {
          lastInv = inv;
          if (inv <= 0.001) {
            if (frameEl) {
              frameEl.style.clipPath = "inset(0px 0px 0px 0px round 0px)";
            }
            if (keyline) {
              keyline.style.opacity = "0";
            }
          } else {
            const iy = Math.max(0, (stageH - winH) / 2) * inv;
            const ix = Math.max(0, (stageW - winW) / 2) * inv;
            const r = 28 * inv;
            const iyPx = iy < 0.2 ? "0px" : iy.toFixed(1) + "px";
            const ixPx = ix < 0.2 ? "0px" : ix.toFixed(1) + "px";
            const rPx = r < 0.2 ? "0px" : r.toFixed(1) + "px";

            if (frameEl) {
              frameEl.style.clipPath =
                "inset(" + iyPx + " " + ixPx + " " + iyPx + " " + ixPx + " round " + rPx + ")";
            }
            if (keyline) {
              const ks = keyline.style;
              ks.inset = iyPx + " " + ixPx;
              ks.borderRadius = rPx;
              ks.opacity = Math.max(0, (inv - 0.06) / 0.94).toFixed(3);
            }
          }
        }

        // 2. Smooth bidirectional crossfade for the night field.
        const op = Math.max(0, Math.min(1, (1 - p) * 2.8));
        if (Math.abs(op - lastOp) > 0.008 || (op === 0 && lastOp !== 0) || (op === 1 && lastOp !== 1)) {
          lastOp = op;
          const opStr = op.toFixed(3);
          if (night) night.style.opacity = opStr;
          if (plate) plate.style.opacity = opStr;
        }

        // 3. The night-side labels step aside smoothly and return gracefully on close.
        const l = easeLabel(clamp01(t / LABEL_END));
        if (Math.abs(l - lastL) > 0.008 || (l === 0 && lastL !== 0) || (l === 1 && lastL !== 1)) {
          lastL = l;
          setIntro({ opacity: 1 - l, y: -24 * l });
          setOutro({ opacity: 1 - l, y: 24 * l });
        }

        // 4. The preview title inside the closed window fades in/out symmetrically.
        if (setPreview) {
          const pr = easePreview(clamp01(t / PREVIEW_END));
          if (Math.abs(pr - lastPr) > 0.008 || (pr === 0 && lastPr !== 0) || (pr === 1 && lastPr !== 1)) {
            lastPr = pr;
            setPreview({ opacity: 1 - pr, scale: 1 + 0.06 * pr });
          }
        }

        // 5. The panel arrives softly as the window expands and dissolves smoothly as it closes.
        const b = easePanel(clamp01((t - PANEL_IN) / PANEL_LEN));
        if (Math.abs(b - lastB) > 0.008 || (b === 0 && lastB !== 0) || (b === 1 && lastB !== 1)) {
          lastB = b;
          setBody({ opacity: b, y: 28 * (1 - b) });
          const bodyOn = b > 0.08;
          if (bodyOn !== bodyInteractive) {
            bodyInteractive = bodyOn;
            body.style.pointerEvents = bodyOn ? "auto" : "none";
          }
        }

        // 6. The up arrow button only appears once the stage has fully opened
        if (setScrollUp && scrollUpBtn) {
          const s = easePanel(clamp01((t - WINDOW_END) / 0.14));
          if (Math.abs(s - lastS) > 0.008 || (s === 0 && lastS !== 0) || (s === 1 && lastS !== 1)) {
            lastS = s;
            setScrollUp({ opacity: s, y: (1 - s) * -14 });
            const scrollUpOn = s > 0.15;
            if (scrollUpOn !== scrollUpInteractive) {
              scrollUpInteractive = scrollUpOn;
              scrollUpBtn.style.pointerEvents = scrollUpOn ? "auto" : "none";
            }
          }
        }
      };

      // Paint the closed state before the first scroll event arrives.
      apply(0);

      const state = { prog: 0 };
      const tween = gsap.to(state, {
        prog: 1,
        ease: "none",
        paused: true,
        onUpdate: () => {
          apply(state.prog);
        },
      });

      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        animation: tween,
        scrub: isTouch ? 0.14 : 0.2,
        fastScrollEnd: false,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          apply(state.prog);
        },
      });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section id="sponsors" className="sxp" aria-label="Sponsors">
      <div ref={trackRef} className="sxp-track">
        <div ref={stageRef} className="sxp-stage">
          {/* The black field the window is cut into — continuous with the
              judges section above. */}
          <div className="sxp-night" aria-hidden="true" />

          {/* Night-side label, before the window is open. */}
          {/* Split above and below the window. Stacked in one block above it,
              the copy ran under the fixed nav as soon as the frame got bigger;
              this way both halves have room and the window sits between them. */}
          <div ref={introRef} className="sxp-label sxp-intro">
            <span className="sxp-intro-eyebrow">Supporters &amp; partners</span>
            <p className="sxp-intro-line">
              None of this runs on good vibes alone.
            </p>
          </div>

          <div ref={outroRef} className="sxp-label sxp-outro">
            <p className="sxp-intro-sub">
              Somebody pays for the wifi, the food and the prize pool.
            </p>
            <span className="sxp-intro-hint">Keep scrolling</span>
          </div>

          {/* The window. clip-path opens it; nothing inside moves. */}
          <div className="sxp-frame">
            <div className="sxp-plate" aria-hidden="true" />

            {/* Preview title inside the frame before it expands (matches reference) */}
            <div ref={previewRef} className="sxp-frame-preview" aria-hidden="true">
              <h2 className="sxp-preview-title">OUR SPONSORS</h2>
            </div>

            <div ref={bodyRef} className="sxp-body">
              <div className="sxp-stage-layout">
                {/* ── Left Artifacts Wing (Ideas doodle, Victoria Memorial polaroid with botanical branch) ── */}
                <div className="sxp-artifacts-wing sxp-wing-left" aria-hidden="true">
                  <div className="sxp-artifact-item sxp-art-doodle-left">
                    <img
                      src="/images/ui/doodle_ideas_impact.png"
                      alt=""
                      className="sxp-art-img sxp-doodle-ideas-img"
                      width={159}
                      height={127}
                    />
                  </div>
                  <div className="sxp-polaroid-group sxp-polaroid-group-left">
                    <img
                      src="/images/ui/polaroid_victoria.png"
                      alt=""
                      className="sxp-art-img sxp-polaroid-victoria-img"
                      width={240}
                      height={217}
                    />
                  </div>
                </div>

                {/* ── Center Stage Content (Headers, Cards, CTA) ── */}
                <div className="sxp-inner">
                  <div className="sxp-ornament-wrap">
                    <Ornament className="sxp-crown" tone="light" />
                  </div>
                  <span className="sxp-eyebrow">Supporters &amp; partners</span>
                  <h2 className="sxp-heading">Our Sponsors</h2>

                  {/* ── Top Tier: Platform Partner (Devfolio) + Sponsor (OSEN) + Domain Sponsor (.xyz) ── */}
                  <div className="sxp-top-tier-row">
                    <div className="sxp-top-card-col">
                      <span className="sxp-tier-badge">PLATFORM PARTNER</span>
                      <div className="sxp-devfolio-card-wrap">
                        <img
                          src="/images/ui/devfolio_rays.png"
                          alt=""
                          className="sxp-rays sxp-rays-left"
                          aria-hidden="true"
                          width={48}
                          height={48}
                        />
                        <a
                          href="https://devfolio.co"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card sxp-devfolio-card"
                          title="Devfolio"
                        >
                          <div className="sxp-devfolio-content">
                            <img
                              src="/images/sponsors/devfolio.png"
                              alt="Devfolio"
                              className="sxp-devfolio-logo"
                              width={175}
                              height={42}
                            />
                            <div className="sxp-devfolio-divider" aria-hidden="true" />
                            <div className="sxp-devfolio-tagline">
                              <span>BUILD</span>
                              <span>FOR</span>
                              <span>BUILDERS</span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="sxp-top-card-col">
                      <span className="sxp-tier-badge">SPONSOR</span>
                      <div className="sxp-osen-card-wrap">
                        <div
                          className="sxp-partner-card sxp-float-card-alt sxp-osen-card"
                          title="OSEN"
                          role="img"
                          aria-label="OSEN"
                        >
                          <img
                            src="/images/sponsors/OSEN.png"
                            alt="OSEN"
                            className="sxp-partner-logo sxp-osen-logo"
                            width={200}
                            height={54}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="sxp-top-card-col">
                      <span className="sxp-tier-badge">DOMAIN SPONSOR</span>
                      <div className="sxp-xyz-card-wrap">
                        <a
                          href="https://gen.xyz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card sxp-xyz-card"
                          title=".xyz"
                          aria-label=".xyz"
                        >
                          <img
                            src="/images/sponsors/xyz-logo-color.png"
                            alt=".xyz"
                            className="sxp-partner-logo sxp-xyz-logo"
                            width={301}
                            height={176}
                          />
                        </a>
                        <img
                          src="/images/ui/devfolio_rays.png"
                          alt=""
                          className="sxp-rays sxp-rays-right"
                          aria-hidden="true"
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Community Partners ── */}
                  <div className="sxp-partner-tier sxp-community-tier">
                    <span className="sxp-tier-badge">COMMUNITY PARTNERS</span>
                    <div className="sxp-community-grid">
                      {/* Left column */}
                      <div className="sxp-community-col">
                        <a
                          href="https://reactkolkata.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card sxp-react-kolkata-card"
                          title="React Kolkata"
                          aria-label="React Kolkata"
                        >
                          <img
                            src="/images/sponsors/react-kolkata-logo-dark.png"
                            alt="React Kolkata"
                            className="sxp-partner-logo sxp-react-kolkata-logo"
                            width={216}
                            height={69}
                          />
                        </a>
                        <div
                          className="sxp-partner-card sxp-float-card-alt sxp-innofusion-card"
                          title="Innofusion"
                          role="img"
                          aria-label="Innofusion"
                        >
                          <div className="sxp-innofusion-content">
                            <img
                              src="/images/sponsors/INNOFUSION%203.0%20logo.png"
                              alt="Innofusion"
                              className="sxp-innofusion-logo"
                              width={40}
                              height={40}
                            />
                            <span className="sxp-innofusion-brand">Innofusion</span>
                          </div>
                        </div>
                      </div>

                      {/* Center column */}
                      <div className="sxp-community-col sxp-community-center">
                        <div
                          className="sxp-partner-card sxp-float-card sxp-stuamb-card"
                          title="Microsoft Student Ambassador"
                          role="img"
                          aria-label="Microsoft Student Ambassador"
                        >
                          <img
                            src="/images/sponsors/Stu_amb_clean.png"
                            alt="Microsoft Student Ambassador"
                            className="sxp-partner-logo sxp-stuamb-logo"
                            width={140}
                            height={160}
                          />
                        </div>
                        <a
                          href="https://gdg.community.dev/gdg-on-campus-guru-nanak-institute-of-technology-kolkata-india/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card-alt sxp-gdg-card"
                          title="Google Developer Groups On Campus • Guru Nanak Institute of Technology"
                          aria-label="Google Developer Groups On Campus GNIT"
                        >
                          <img
                            src="/images/sponsors/gdg-gnit-logo.png"
                            alt="GDG On Campus GNIT"
                            className="sxp-partner-logo sxp-gdg-logo"
                            width={857}
                            height={344}
                          />
                        </a>
                      </div>

                      {/* Right column */}
                      <div className="sxp-community-col">
                        <div
                          className="sxp-partner-card sxp-float-card sxp-coderush-card"
                          title="CodeRush X"
                          role="img"
                          aria-label="CodeRush X"
                        >
                          <img
                            src="/images/sponsors/CodeRush%20X%20Logo-dark.png"
                            alt="CodeRush X"
                            className="sxp-partner-logo sxp-coderush-logo"
                            width={225}
                            height={52}
                          />
                        </div>
                        <div
                          className="sxp-partner-card sxp-float-card-alt sxp-mahakash-card"
                          title="GNIT Mahakash - The Space Club"
                          role="img"
                          aria-label="GNIT Mahakash - The Space Club"
                        >
                          <img
                            src="/images/sponsors/FinalBlack.png"
                            alt="GNIT Mahakash"
                            className="sxp-partner-logo sxp-mahakash-logo"
                            width={190}
                            height={52}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Media Partners ── */}
                  <div className="sxp-partner-tier sxp-media-tier">
                    <span className="sxp-tier-badge">MEDIA PARTNERS</span>
                    <div className="sxp-media-grid">
                      <a
                        href="https://lnc-community.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sxp-partner-card sxp-float-card sxp-lnc-card"
                        title="LNC Community"
                        aria-label="LNC Community"
                      >
                        <img
                          src="/images/sponsors/LNC.png"
                          alt="LNC Community"
                          className="sxp-partner-logo sxp-lnc-logo"
                          width={195}
                          height={52}
                        />
                      </a>
                      <div
                        className="sxp-partner-card sxp-float-card-alt sxp-eventopia-card"
                        title="Eventopia"
                        role="img"
                        aria-label="Eventopia"
                      >
                        <img
                          src="/images/sponsors/Eventopia-Logo-04.png"
                          alt="Eventopia"
                          className="sxp-partner-logo sxp-eventopia-logo"
                          width={170}
                          height={44}
                        />
                      </div>
                    </div>
                  </div>

                  <span className="sxp-unrevealed-note">
                    More community partners &amp; sponsors revealing soon.
                  </span>

                  <div className="sxp-cta-wrap">
                    <LiquidMetalButton
                      label="Partner with this edition"
                      href={EVENT.sponsorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      iconPosition="right"
                      icon={
                        <svg
                          viewBox="0 0 24 24"
                          width={14}
                          height={14}
                          style={{ marginLeft: 2, display: "inline-block" }}
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12h14M13 6l6 6-6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>

                {/* ── Right Artifacts Wing (Howrah Bridge polaroid with washi tape & botanical branch, Tomorrow doodle) ── */}
                <div className="sxp-artifacts-wing sxp-wing-right" aria-hidden="true">
                  <div className="sxp-polaroid-group sxp-polaroid-group-right">
                    <img
                      src="/images/ui/polaroid_howrah.png"
                      alt=""
                      className="sxp-art-img sxp-polaroid-howrah-img"
                      width={250}
                      height={189}
                    />
                  </div>
                  <div className="sxp-artifact-item sxp-art-doodle-right">
                    <img
                      src="/images/ui/doodle_building_tomorrow.png"
                      alt=""
                      className="sxp-art-img sxp-doodle-tomorrow-img"
                      width={165}
                      height={134}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sibling of the frame, so the clip does not eat it. Same geometry,
              because both read it off the stage. */}
          <span className="sxp-keyline" aria-hidden="true" />

          {/* ── Scroll Navigation to Exit Frame (Beside Nav Bar) ── */}
          <div ref={scrollUpRef} className="sxp-scrollup-wrap">
            <button
              type="button"
              onClick={scrollUp}
              aria-label="Scroll up to previous section"
              className="sxp-scrollup-btn"
              title="Scroll up"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sxp-arrow-icon"
                aria-hidden="true"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .sxp {
          position: relative;
          width: 100%;
          /* The track supplies the scroll distance; the stage inside is one
             viewport tall and sticks for the difference. */
          --sxp-track: 320vh;
        }

        .sxp-track {
          position: relative;
          height: var(--sxp-track);
        }

        /* Every child derives its geometry from --sxp-p, so it lives here on
           the shared ancestor rather than on any one of them. */
        .sxp-stage {
          --sxp-p: 0;
          /* Wide, not square. A near-square window left broad bands of dead
             black either side of it; a 16:9 plate fills the eye and reads as a
             viewport onto the sky rather than a porthole. Height is derived so
             the ratio holds at every width. */
          --sxp-win-w: clamp(20rem, 68vw, 62rem);
          --sxp-win-h: min(calc(var(--sxp-win-w) * 0.5625), 52vh);
          --sxp-iy: calc((100% - var(--sxp-win-h)) / 2 * (1 - var(--sxp-p)));
          --sxp-ix: calc((100% - var(--sxp-win-w)) / 2 * (1 - var(--sxp-p)));
          --sxp-r: calc(28px * (1 - var(--sxp-p)));
          /* One source of truth: natural 2.75:1 aspect ratio scaling (756 / 2079 = 36.4%) */
          --sxp-hands-h: min(clamp(280px, 36.4vw, 1400px), 66vh);
          --sxp-hands-lift: clamp(0rem, 0.8vh, 1.2rem);

          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        /* Both the black field and the sky plate retire once the window is
           open — see the note on .sxp-plate for why. */
        .sxp-night,
        .sxp-plate {
          opacity: clamp(0, calc((1 - var(--sxp-p)) * 2.8), 1);
          will-change: opacity;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }

        .sxp-night {
          position: absolute;
          inset: 0;
          background: var(--color-night);
        }

        /* ── Night-side label ── */
        .sxp-label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) translateZ(0);
          -webkit-transform: translateX(-50%) translateZ(0);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          width: min(90vw, 44rem);
          pointer-events: none;
          text-align: center;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        /* Both anchored off the window edge, so they keep their clearance
           whatever size it is. */
        .sxp-intro {
          bottom: calc(50% + var(--sxp-win-h) / 2 + clamp(1.2rem, 3vh, 2.4rem));
        }

        .sxp-outro {
          top: calc(50% + var(--sxp-win-h) / 2 + clamp(1.2rem, 3vh, 2.4rem));
        }

        .sxp-intro-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8FC45A;
        }

        .sxp-intro-line {
          margin: 0.1rem 0 0.2rem;
          max-width: 26ch;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.35rem, 3.4vw, 2.35rem);
          font-weight: 500;
          line-height: 1.16;
          letter-spacing: -0.026em;
          color: #F1F7E9;
          text-wrap: balance;
        }

        .sxp-intro-sub {
          margin: 0;
          max-width: 40ch;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          line-height: 1.55;
          color: rgba(214, 232, 202, 0.62);
          text-wrap: pretty;
        }

        .sxp-intro-hint {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(206, 226, 194, 0.4);
        }

        /* ── The window ── */
        .sxp-frame {
          position: absolute;
          inset: 0;
          z-index: 2;
          contain: paint;
          will-change: clip-path;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          clip-path: inset(
            var(--sxp-iy) var(--sxp-ix) var(--sxp-iy) var(--sxp-ix)
            round var(--sxp-r)
          );
        }

        /* The sky behind the window.
           These four declarations are copied from the body::before plate in
           globals.css on purpose. That plate is fixed to the viewport; this one
           is inset 0 on a stuck 100vh stage, which is the same box. Same file,
           same box, same cover/centre-top: once the clip reaches the edges the
           two are the same pixels, and the exit into ACM has nothing to cross.
           If the page backdrop ever moves, move this with it.

           It also has to *stop* existing. The stage only equals the viewport
           while it is stuck; the moment the track runs out and it scrolls away,
           its plate travels with it while the page's fixed backdrop does not,
           and the two slide apart into a visible seam. So both this and the
           black behind it fade out over the last of the opening — at which
           point they are painting exactly what the page backdrop is painting,
           so removing them changes nothing on screen and there is no longer
           anything that can drift. */
        .sxp-plate {
          position: absolute;
          inset: 0;
          background-color: var(--color-bg);
          background-image: url("/images/bg/cloud.jpg");
          background-size: cover;
          background-position: center 25%;
          background-repeat: no-repeat;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }

        .sxp-keyline {
          position: absolute;
          top: var(--sxp-iy);
          bottom: var(--sxp-iy);
          left: var(--sxp-ix);
          right: var(--sxp-ix);
          z-index: 4;
          border-radius: var(--sxp-r);
          pointer-events: none;
          /* Fades itself out as the window loses its edge. */
          opacity: calc(1 - var(--sxp-p));
          box-shadow:
            0 0 0 1px rgba(238, 248, 228, 0.22),
            0 24px 50px -16px rgba(0, 0, 0, 0.75),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          will-change: opacity;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        /* ── Preview title inside the frame before it expands (matches reference) ── */
        .sxp-frame-preview {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          place-items: center;
          pointer-events: none;
          user-select: none;
          padding-inline: clamp(1rem, 3vw, 2.5rem);
          will-change: transform, opacity;
          transform: translateZ(0);
        }

        .sxp-preview-title {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(3.2rem, 9.2vw, 8rem);
          font-weight: 700;
          font-style: italic;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #121A12;
          text-align: center;
          line-height: 0.92;
          margin: 0;
          text-shadow: 0 4px 28px rgba(255, 255, 255, 0.85);
        }

        /* ── Sponsors, inside ── */
        .sxp-body {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-inline: var(--padding-x);
          padding-top: clamp(4.5rem, 8vh, 5.8rem);
          padding-bottom: clamp(1.2rem, 2.5vh, 2.2rem);
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* ── Main Stage Layout wrapping Wings & Center ── */
        .sxp-stage-layout {
          position: relative;
          width: 100%;
          max-width: min(98vw, 98rem);
          margin-inline: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* ── Side Artifacts Wings ── */
        .sxp-artifacts-wing {
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(210px, 19vw, 280px);
          pointer-events: none;
          z-index: 1;
          user-select: none;
        }

        .sxp-wing-left {
          left: max(0.5rem, calc(50% - 33.5rem));
        }

        .sxp-wing-right {
          right: max(0.5rem, calc(50% - 33.5rem));
        }

        /* ── Left wing: doodle on top (alongside Devfolio), Victoria polaroid lower (matching tablet) ── */
        .sxp-art-doodle-left {
          position: absolute;
          top: clamp(21%, 23.5vh, 26%);
          left: clamp(1.2rem, 2.5vw, 3.6rem);
          z-index: 3;
        }

        /* Victoria Memorial: positioned lower alongside partners with clean spacing (matching tablet) */
        .sxp-polaroid-group.sxp-polaroid-group-left {
          position: absolute;
          top: clamp(48%, 51vh, 56%);
          left: clamp(-4.6rem, -4.5vw, -3.2rem);
          z-index: 1;
        }

        /* ── Right wing: Howrah bridge alongside domain sponsor without overlapping (matching tablet) ── */
        .sxp-polaroid-group.sxp-polaroid-group-right {
          position: absolute;
          top: clamp(25%, 28vh, 31%);
          left: auto;
          right: clamp(-3.6rem, -3.8vw, -2.4rem);
          z-index: 1;
        }

        .sxp-art-doodle-right {
          position: absolute;
          top: clamp(60%, 64vh, 68%);
          right: clamp(0.2rem, 1.2vw, 1.8rem);
          z-index: 3;
        }

        /* Polaroid groups */
        .sxp-polaroid-group {
          position: relative;
        }

        .sxp-polaroid-victoria-img {
          position: relative;
          z-index: 2;
          width: clamp(200px, 18vw, 255px);
          height: auto;
          transform: rotate(-10deg);
          filter: drop-shadow(0 20px 38px rgba(0, 0, 0, 0.40)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sxp-wing-left:hover .sxp-polaroid-victoria-img {
          transform: scale(1.03) rotate(-8deg);
        }

        .sxp-polaroid-howrah-img {
          position: relative;
          z-index: 2;
          width: clamp(205px, 18.5vw, 265px);
          height: auto;
          transform: rotate(8.5deg);
          filter: drop-shadow(0 20px 38px rgba(0, 0, 0, 0.40)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sxp-wing-right:hover .sxp-polaroid-howrah-img {
          transform: scale(1.03) rotate(10.5deg);
        }

        .sxp-doodle-ideas-img {
          width: clamp(115px, 10.5vw, 155px);
          height: auto;
          display: block;
          transform: rotate(-9deg);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sxp-wing-left:hover .sxp-doodle-ideas-img {
          transform: scale(1.04) rotate(-7deg);
        }

        .sxp-doodle-tomorrow-img {
          width: clamp(120px, 11vw, 160px);
          height: auto;
          display: block;
          transform: rotate(9deg);
          filter: brightness(1.25) contrast(1.1) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.22));
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), filter 280ms ease;
        }

        .sxp-wing-right:hover .sxp-doodle-tomorrow-img {
          transform: scale(1.04) rotate(11deg);
          filter: brightness(1.35) contrast(1.15) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.18));
        }

        /* ── Center Content Cluster ── */
        .sxp-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: min(90vw, 64rem);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
        }

        /* Ambient cloud mist aura disabled so cards match Campus Address transparent background */
        .sxp-inner::before {
          display: none !important;
        }

        .sxp-ornament-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: clamp(0.35rem, 0.8vh, 0.65rem);
        }

        .sxp-crown {
          width: clamp(114px, 56.87px + 15.87vw, 260px) !important;
          height: auto !important;
          opacity: 0.88;
          display: block;
          user-select: none;
          pointer-events: none;
        }

        .sxp-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2e4b2a;
          opacity: 0.95;
          margin-bottom: 0.45rem;
        }

        .sxp-heading {
          margin: 0 0 clamp(0.35rem, 0.8vh, 0.6rem);
          font-family: var(--font-dm-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 5.2vw, 3.8rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #122415;
        }

        .sxp-lede {
          margin: 0 0 clamp(0.35rem, 0.7vh, 0.6rem);
          max-width: 44rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.35vw, 1.12rem);
          line-height: 1.48;
          color: #384f36;
          text-wrap: pretty;
        }

        .sxp-partner-tier {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin-top: clamp(0.1rem, 0.3vh, 0.25rem);
          margin-bottom: 0;
          z-index: 10;
        }

        .sxp-top-tier-row {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: clamp(14px, 1.8vw, 24px);
          margin-top: clamp(0.05rem, 0.2vh, 0.2rem);
          z-index: 10;
        }

        .sxp-top-card-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .sxp-community-tier {
          margin-top: clamp(0.25rem, 0.6vh, 0.5rem);
          margin-bottom: 0;
        }

        .sxp-media-tier {
          margin-top: clamp(0.25rem, 0.6vh, 0.5rem);
        }

        .sxp-media-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 1.5vw, 20px);
        }

        .sxp-tier-badge-placeholder {
          opacity: 0 !important;
          pointer-events: none !important;
          user-select: none !important;
        }

        .sxp-partner-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 1.5vw, 20px);
          width: 100%;
          max-width: 1020px;
        }

        .sxp-community-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 1.5vw, 20px);
          width: 100%;
          max-width: 1020px;
        }

        .sxp-community-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(8px, 1vw, 14px);
        }

        .sxp-community-center {
          flex-shrink: 0;
        }

        .sxp-tier-badge {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2d4c29;
          margin-bottom: 0.15rem;
          opacity: 0.92;
        }

        /* ── iOS Liquid Frosted Glass Cards (Transparent Cloud View - matching Campus Address) ── */
        .sxp-partner-card {
          position: relative;
          width: clamp(195px, 16.5vw, 245px);
          height: clamp(66px, 7.2vh, 78px);
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1.2rem;
          box-sizing: border-box;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 48%, rgba(220, 245, 215, 0.04) 100%);
          backdrop-filter: blur(10px) saturate(160%);
          -webkit-backdrop-filter: blur(10px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.32);
          border-bottom: 1px solid rgba(22, 45, 26, 0.06);
          box-shadow:
            inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 1.5px 0 rgba(22, 45, 26, 0.03),
            0 8px 24px -8px rgba(18, 38, 22, 0.06);
          border-radius: 20px;
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease, background 260ms ease, border-color 260ms ease;
          user-select: none;
        }

        .sxp-partner-card:hover {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 48%, rgba(220, 245, 215, 0.08) 100%);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.55);
          box-shadow:
            inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.75),
            0 14px 36px -10px rgba(18, 38, 22, 0.09);
        }

        .sxp-partner-logo {
          height: clamp(24px, 3vh, 32px);
          width: auto;
          object-fit: contain;
          display: block;
        }

        /* ── Top Tier: Devfolio, OSEN & XYZ Card Wraps with Radiant Rays ── */
        .sxp-devfolio-card-wrap,
        .sxp-osen-card-wrap,
        .sxp-xyz-card-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .sxp-rays {
          position: absolute;
          width: clamp(36px, 3.6vw, 46px);
          height: auto;
          pointer-events: none;
          z-index: 4;
        }

        /* Shifted to left of Devfolio card, mirrored to radiate upwards-left */
        .sxp-rays-left {
          top: -24px;
          left: -16px;
          transform: scaleX(-1);
        }

        /* Positioned on right side of OSEN card, radiating upwards-right */
        .sxp-rays-right {
          top: -24px;
          right: -16px;
        }

        .sxp-devfolio-card {
          flex: 0 0 auto !important;
          width: clamp(225px, 18.5vw, 275px) !important;
          height: clamp(68px, 7.5vh, 80px) !important;
          border-radius: 20px !important;
          padding: 0 !important;
          text-decoration: none;
        }

        .sxp-devfolio-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding-inline: clamp(0.85rem, 1.4vw, 1.3rem);
        }

        .sxp-devfolio-logo {
          height: clamp(22px, 2.8vh, 30px);
          width: auto;
          object-fit: contain;
        }

        .sxp-devfolio-divider {
          width: 1px;
          height: clamp(22px, 2.8vh, 30px);
          background: rgba(0, 0, 0, 0.12);
          margin-inline: clamp(0.55rem, 0.9vw, 0.85rem);
          flex-shrink: 0;
        }

        .sxp-devfolio-tagline {
          display: flex;
          flex-direction: column;
          gap: 2.5px;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.52rem, 0.62vw, 0.58rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          line-height: 1.25;
          color: #172c1a;
          text-align: left;
          flex-shrink: 0;
        }

        /* ── Individual Partner Card Branding & Logo Sizes ── */
        .sxp-react-kolkata-logo {
          width: clamp(120px, 12vw, 155px);
          height: auto;
          max-height: 38px;
          object-fit: contain;
          display: block;
        }

        .sxp-innofusion-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.45rem, 0.8vw, 0.7rem);
        }

        .sxp-innofusion-logo {
          height: clamp(26px, 3.2vh, 32px);
          width: clamp(26px, 3.2vh, 32px);
          object-fit: contain;
          display: block;
          flex-shrink: 0;
        }

        .sxp-innofusion-brand {
          font-family: var(--font-display), var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 800;
          font-size: clamp(0.95rem, 1.25vw, 1.15rem);
          letter-spacing: 0.05em;
          word-spacing: 0.2em;
          color: #111a12;
          line-height: 1;
          white-space: nowrap;
        }



        .sxp-coderush-logo {
          width: clamp(120px, 12vw, 155px);
          height: auto;
          max-height: 36px;
          object-fit: contain;
          display: block;
        }

        .sxp-mahakash-logo {
          width: clamp(140px, 13.5vw, 180px);
          height: auto;
          max-height: clamp(46px, 5.2vh, 56px);
          object-fit: contain;
          display: block;
        }

        .sxp-stuamb-card {
          width: clamp(146px, 12.2vw, 175px) !important;
          height: clamp(146px, 12.2vw, 175px) !important;
          aspect-ratio: 1 / 1;
          border-radius: clamp(20px, 1.6vw, 24px) !important;
          padding: 0.35rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .sxp-stuamb-logo {
          height: clamp(118px, 13.5vh, 150px);
          width: auto;
          max-height: 94%;
          max-width: 92%;
          object-fit: contain;
          display: block;
        }

        .sxp-gdg-card {
          width: clamp(185px, 15.5vw, 235px) !important;
          height: clamp(74px, 8.4vh, 88px) !important;
          text-decoration: none;
          padding: 0.4rem 0.8rem !important;
        }

        .sxp-gdg-logo {
          width: clamp(150px, 13.5vw, 205px);
          height: auto;
          max-height: clamp(58px, 6.8vh, 72px);
          max-width: 94%;
          object-fit: contain;
          display: block;
        }

        .sxp-eventopia-logo {
          width: clamp(110px, 11vw, 145px);
          height: auto;
          max-height: 32px;
          object-fit: contain;
          display: block;
        }

        .sxp-osen-card {
          width: clamp(135px, 11vw, 165px) !important;
          height: clamp(68px, 7.5vh, 80px) !important;
          border-radius: 20px !important;
          padding: 0 0.65rem !important;
        }

        .sxp-osen-logo {
          width: clamp(102px, 8.6vw, 125px);
          height: auto;
          max-height: 40px;
          object-fit: contain;
          display: block;
        }

        .sxp-xyz-card {
          width: clamp(105px, 8.2vw, 130px) !important;
          height: clamp(68px, 7.5vh, 80px) !important;
          border-radius: 20px !important;
          padding: 0 0.5rem !important;
          text-decoration: none;
        }

        .sxp-xyz-logo {
          width: auto;
          height: clamp(30px, 3.4vh, 38px);
          max-height: 38px;
          max-width: 86%;
          object-fit: contain;
          display: block;
        }

        .sxp-lnc-card {
          width: clamp(195px, 16.5vw, 245px) !important;
          height: clamp(66px, 7.2vh, 78px) !important;
          border-radius: 20px !important;
          text-decoration: none;
        }

        .sxp-lnc-logo {
          width: clamp(110px, 11vw, 145px);
          height: auto;
          max-height: 38px;
          object-fit: contain;
          display: block;
        }

        .sxp-unrevealed-note {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.74rem, 0.88vw, 0.82rem);
          color: #3b5039;
          letter-spacing: -0.01em;
          margin-top: clamp(0.35rem, 0.7vh, 0.6rem);
          margin-bottom: 0;
          opacity: 0.88;
        }

        .sxp-cta-wrap {
          margin-top: clamp(0.35rem, 0.8vh, 0.65rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* ── Narrower viewports responsive adjustments for wings ── */
        /* ── Narrower viewports responsive adjustments for wings ── */
        @media (max-width: 1440px) {
          .sxp-wing-left {
            left: max(0.5rem, calc(50% - clamp(30.5rem, 37vw, 34rem)));
            transform: scale(0.92);
          }
          .sxp-wing-right {
            right: max(0.5rem, calc(50% - clamp(30.5rem, 37vw, 34rem)));
            transform: scale(0.92);
          }
        }

        @media (max-width: 1260px) {
          .sxp-wing-left {
            left: max(0.2rem, calc(50% - clamp(27rem, 35vw, 30.5rem)));
            transform: scale(0.85);
            opacity: 0.92;
          }
          .sxp-wing-right {
            right: max(0.2rem, calc(50% - clamp(27rem, 35vw, 30.5rem)));
            transform: scale(0.85);
            opacity: 0.92;
          }
        }

        @media (max-width: 1080px) {
          /* ── Artifacts side wings positioning matching desktop reference ── */
          .sxp-artifacts-wing {
            width: clamp(170px, 20vw, 230px);
          }

          .sxp-wing-left {
            left: clamp(0.05rem, 0.6vw, 0.6rem);
            transform-origin: left center;
            transform: scale(0.72);
            opacity: 0.92;
          }

          .sxp-wing-right {
            right: clamp(0.05rem, 0.6vw, 0.6rem);
            transform-origin: right center;
            transform: scale(0.72);
            opacity: 0.92;
          }

          /* Left Doodle: shifted nicely outside Devfolio card */
          .sxp-art-doodle-left {
            top: clamp(21%, 23.5vh, 26%);
            left: clamp(0.2rem, 0.8vw, 1.2rem);
            transform: scale(0.86);
          }

          /* Victoria Memorial: positioned lower alongside partners with clean spacing */
          .sxp-polaroid-group.sxp-polaroid-group-left {
            top: clamp(48%, 51vh, 56%);
            left: clamp(-3.8rem, -4.0vw, -2.6rem);
          }

          /* Howrah Bridge: alongside domain sponsor & coderush without overlapping cards */
          .sxp-polaroid-group.sxp-polaroid-group-right {
            top: clamp(25%, 28vh, 31%);
            left: auto;
            right: clamp(-3.4rem, -3.6vw, -2.2rem);
          }

          /* Right Doodle: brighter and positioned cleanly */
          .sxp-art-doodle-right {
            top: clamp(60%, 64vh, 68%);
            right: clamp(0.2rem, 1.0vw, 1.4rem);
            transform: scale(0.90);
          }

          .sxp-doodle-tomorrow-img {
            width: clamp(125px, 12vw, 160px) !important;
            filter: brightness(1.35) contrast(1.15) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.18)) !important;
          }

          /* ── Community Partners: 3-column layout matching desktop ── */
          .sxp-community-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: clamp(12px, 1.8vw, 18px) !important;
            width: 100% !important;
            max-width: none !important;
          }

          .sxp-community-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: clamp(8px, 1vw, 12px) !important;
            flex: 0 0 auto !important;
          }

          .sxp-community-center {
            flex: 0 0 auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Reset all vertical transform staggers so cards never collide */
          .sxp-react-kolkata-card,
          .sxp-coderush-card,
          .sxp-mahakash-card,
          .sxp-gdg-card,
          .sxp-stuamb-card {
            transform: none !important;
          }

          .sxp-react-kolkata-card:hover,
          .sxp-coderush-card:hover,
          .sxp-mahakash-card:hover,
          .sxp-gdg-card:hover,
          .sxp-stuamb-card:hover {
            transform: translateY(-2px) scale(1.015) !important;
          }

          .sxp-community-grid .sxp-partner-card:not(.sxp-stuamb-card) {
            flex: 0 0 auto !important;
            width: clamp(170px, 20vw, 215px) !important;
            height: clamp(58px, 6.8vh, 68px) !important;
            border-radius: 18px;
          }

          /* Restored student ambassador card size */
          .sxp-community-grid .sxp-stuamb-card {
            flex: 0 0 auto !important;
            width: clamp(134px, 13.5vw, 160px) !important;
            height: clamp(134px, 13.5vw, 160px) !important;
            aspect-ratio: 1 / 1 !important;
            border-radius: clamp(20px, 1.6vw, 24px) !important;
            padding: 0.35rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .sxp-community-grid .sxp-stuamb-card .sxp-stuamb-logo {
            height: clamp(108px, 12vh, 135px) !important;
            width: auto !important;
            max-height: 94% !important;
            max-width: 92% !important;
          }

          .sxp-community-grid .sxp-gdg-card {
            width: clamp(170px, 18vw, 215px) !important;
            height: clamp(66px, 7.6vh, 78px) !important;
          }

          .sxp-community-grid .sxp-gdg-logo {
            max-height: clamp(50px, 5.8vh, 60px) !important;
            width: clamp(135px, 15vw, 175px) !important;
          }

          /* Fixed INNOFUSION: ensure logo & brand stay comfortably inside the card */
          .sxp-innofusion-card {
            padding: 0 clamp(0.5rem, 0.8vw, 0.8rem) !important;
          }

          .sxp-innofusion-content {
            gap: clamp(0.35rem, 0.5vw, 0.55rem) !important;
            width: 100% !important;
            justify-content: center !important;
          }

          .sxp-innofusion-logo {
            height: clamp(23px, 2.7vh, 27px) !important;
            width: clamp(23px, 2.7vh, 27px) !important;
            flex-shrink: 0 !important;
          }

          .sxp-innofusion-brand {
            font-size: clamp(0.78rem, 1.1vw, 0.95rem) !important;
            letter-spacing: 0.02em !important;
            word-spacing: 0.08em !important;
            white-space: nowrap !important;
          }

          .sxp-devfolio-card {
            flex: 0 0 auto !important;
            width: clamp(215px, 26vw, 255px) !important;
            height: 64px !important;
            border-radius: 18px !important;
          }

          .sxp-devfolio-content {
            padding-inline: 0.9rem !important;
          }

          .sxp-devfolio-divider {
            margin-inline: 0.55rem !important;
          }

          .sxp-top-tier-row {
            gap: clamp(10px, 1.4vw, 16px) !important;
          }

          .sxp-osen-card {
            width: clamp(120px, 14vw, 145px) !important;
            height: 64px !important;
            border-radius: 18px !important;
            padding: 0 0.5rem !important;
          }

          .sxp-xyz-card {
            width: clamp(96px, 10.5vw, 118px) !important;
            height: 64px !important;
            border-radius: 18px !important;
            padding: 0 0.45rem !important;
          }

          .sxp-osen-logo {
            max-height: 34px !important;
          }

          .sxp-xyz-logo {
            max-height: 30px !important;
            max-width: 86% !important;
          }

          .sxp-media-grid {
            gap: clamp(12px, 1.6vw, 18px) !important;
          }

          .sxp-lnc-card,
          .sxp-media-grid .sxp-eventopia-card {
            width: clamp(170px, 22vw, 215px) !important;
            height: clamp(56px, 6.5vh, 66px) !important;
            border-radius: 18px !important;
          }
        }

        /* ── Scroll Navigation to Exit Frame (Hidden to match mockup) ── */
        .sxp-scrollup-wrap {
          display: none;
        }

        @media (max-width: 900px) {
          .sxp { --sxp-track: 280vh; }
          .sxp-stage {
            --sxp-win-w: min(88vw, 34rem);
          }
          .sxp-body {
            padding-top: clamp(3.5rem, 7vh, 4.8rem);
            padding-bottom: clamp(1.8rem, 4vh, 3rem);
          }
        }

        @media (max-width: 860px) {
          .sxp {
            --sxp-track: 260vh;
          }
          .sxp-preview-title {
            text-shadow: none;
          }
          .sxp-keyline {
            box-shadow: 0 0 0 1px rgba(238, 248, 228, 0.22);
          }

          .sxp-body {
            justify-content: center;
            padding-top: clamp(3.2rem, 4.5vh, 4.2rem);
            padding-bottom: clamp(2rem, 3.5vh, 3.2rem);
            overflow-y: auto;
          }

          .sxp-artifacts-wing {
            width: clamp(150px, 20vw, 200px);
          }

          .sxp-wing-left {
            left: 0;
            transform-origin: left center;
            transform: scale(0.60);
            opacity: 0.90;
          }

          .sxp-wing-right {
            right: 0;
            transform-origin: right center;
            transform: scale(0.60);
            opacity: 0.90;
          }

          /* Shift ideas doodle cleanly away from Devfolio */
          .sxp-art-doodle-left {
            top: clamp(21%, 23.5vh, 26%);
            left: clamp(0rem, 0.4vw, 0.6rem);
            transform: scale(0.82);
          }

          /* Brighter & larger tomorrow doodle on tablet */
          .sxp-doodle-tomorrow-img {
            width: clamp(115px, 12.5vw, 145px) !important;
            filter: brightness(1.4) contrast(1.15) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.16)) !important;
          }

          .sxp-art-doodle-right {
            top: clamp(60%, 64vh, 68%);
            right: clamp(0.2rem, 0.6vw, 1.0rem);
            transform: scale(0.82);
          }

          .sxp-polaroid-group.sxp-polaroid-group-left {
            top: clamp(48%, 51vh, 56%);
            left: clamp(-3.2rem, -3.6vw, -2.0rem);
          }

          .sxp-polaroid-group.sxp-polaroid-group-right {
            top: clamp(25%, 28vh, 31%);
            left: auto;
            right: clamp(-3.2rem, -3.8vw, -2.0rem);
          }

          .sxp-community-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 10px !important;
            width: 100% !important;
            max-width: none !important;
          }

          .sxp-community-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            flex: 0 0 auto !important;
          }

          .sxp-community-grid .sxp-partner-card:not(.sxp-stuamb-card) {
            flex: 0 0 auto !important;
            width: clamp(140px, 18vw, 168px) !important;
            height: 52px !important;
            border-radius: 16px !important;
          }

          /* Restored student ambassador card size */
          .sxp-community-grid .sxp-stuamb-card {
            flex: 0 0 auto !important;
            width: clamp(112px, 14.5vw, 126px) !important;
            height: clamp(112px, 14.5vw, 126px) !important;
            aspect-ratio: 1 / 1 !important;
            border-radius: 18px !important;
            padding: 0.35rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .sxp-community-grid .sxp-stuamb-card .sxp-stuamb-logo {
            height: clamp(88px, 10.5vh, 104px) !important;
            width: auto !important;
            max-height: 94% !important;
            max-width: 92% !important;
          }

          .sxp-community-grid .sxp-gdg-card {
            width: clamp(145px, 18vw, 175px) !important;
            height: 60px !important;
          }

          .sxp-community-grid .sxp-gdg-logo {
            max-height: clamp(44px, 5.0vh, 50px) !important;
            width: clamp(115px, 15vw, 145px) !important;
          }

          /* Fixed INNOFUSION on portrait tablet */
          .sxp-innofusion-card {
            padding: 0 0.45rem !important;
          }

          .sxp-innofusion-content {
            gap: 0.35rem !important;
          }

          .sxp-innofusion-logo {
            height: 22px !important;
            width: 22px !important;
          }

          .sxp-innofusion-brand {
            font-size: 0.76rem !important;
            letter-spacing: 0.01em !important;
            word-spacing: 0.05em !important;
          }

          .sxp-devfolio-card {
            flex: 0 0 auto !important;
            width: clamp(230px, 31vw, 260px) !important;
            height: 58px !important;
            border-radius: 16px !important;
          }

          .sxp-devfolio-content {
            padding-inline: clamp(0.85rem, 1.3vw, 1.15rem) !important;
          }

          .sxp-devfolio-divider {
            margin-inline: clamp(0.45rem, 0.7vw, 0.65rem) !important;
          }

          .sxp-top-tier-row {
            flex-wrap: nowrap !important;
            gap: clamp(8px, 1.2vw, 12px) !important;
          }

          .sxp-osen-card {
            width: clamp(102px, 13vw, 125px) !important;
            height: 58px !important;
            border-radius: 16px !important;
            padding: 0 0.4rem !important;
          }

          .sxp-xyz-card {
            width: clamp(80px, 10vw, 98px) !important;
            height: 58px !important;
            border-radius: 16px !important;
            padding: 0 0.35rem !important;
          }

          .sxp-osen-logo {
            max-height: 31px !important;
          }

          .sxp-xyz-logo {
            max-height: 26px !important;
            max-width: 86% !important;
          }

          .sxp-media-grid {
            gap: 10px !important;
          }

          .sxp-lnc-card,
          .sxp-media-grid .sxp-eventopia-card {
            flex: 0 0 auto !important;
            width: clamp(155px, 21vw, 185px) !important;
            height: 54px !important;
            border-radius: 18px !important;
          }
        }

        @media (max-width: 620px) {
          .sxp-artifacts-wing {
            display: none !important;
          }
          .sxp { --sxp-track: 250vh; }
          .sxp-body {
            justify-content: center !important;
            align-items: center !important;
            padding-top: clamp(2.6rem, 5.5vh, 4rem) !important;
            padding-bottom: clamp(1.2rem, 2.5vh, 2rem) !important;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          .sxp-ornament-wrap {
            margin-bottom: clamp(0.15rem, 0.5vh, 0.35rem) !important;
          }
          .sxp-crown {
            width: clamp(114px, 56.87px + 15.87vw, 260px) !important;
            height: auto !important;
            margin-bottom: 0.05rem !important;
          }
          .sxp-eyebrow {
            font-size: 0.54rem !important;
            letter-spacing: 0.14em !important;
            margin-bottom: 0.05rem !important;
            color: #1b381a;
            font-weight: 600;
          }
          .sxp-heading {
            font-size: clamp(1.4rem, 5.2vw, 1.85rem) !important;
            margin-bottom: 0.05rem !important;
          }
          .sxp-lede {
            font-size: 0.72rem !important;
            line-height: 1.28 !important;
            max-width: 19rem !important;
            margin-bottom: 0.15rem !important;
            color: #263e24;
          }
          .sxp-tier-badge {
            font-size: 0.54rem !important;
            letter-spacing: 0.12em !important;
            margin-bottom: 0.04rem !important;
          }
          .sxp-inner {
            gap: 0.1rem !important;
            align-items: center !important;
          }
          .sxp-inner::before {
            width: 100vw;
            height: 100%;
            background: radial-gradient(
              ellipse 90% 75% at 50% 45%,
              rgba(255, 255, 255, 0.98) 0%,
              rgba(255, 255, 255, 0.88) 45%,
              rgba(255, 255, 255, 0.5) 75%,
              transparent 95%
            );
            filter: blur(28px);
          }
          .sxp-partner-tier {
            gap: 0.1rem !important;
            margin-top: 0.05rem !important;
            align-items: center !important;
          }
          .sxp-platform-tier {
            margin-top: 0 !important;
          }
          .sxp-community-tier {
            margin-top: 0.15rem !important;
            margin-bottom: 0 !important;
          }

          /* Top tier: Devfolio on top, OSEN + XYZ side-by-side row on mobile */
          .sxp-top-tier-row {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: flex-end !important;
            justify-content: center !important;
            gap: 6px 8px !important;
            width: min(94vw, 350px) !important;
          }
          .sxp-top-tier-row > .sxp-top-card-col:first-child {
            width: 100% !important;
          }
          .sxp-top-card-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .sxp-devfolio-card-wrap,
          .sxp-osen-card-wrap,
          .sxp-xyz-card-wrap {
            margin-top: 0 !important;
          }
          .sxp-devfolio-rays,
          .sxp-rays {
            display: none !important;
          }
          .sxp-devfolio-card {
            flex: 0 0 auto !important;
            width: clamp(190px, 55vw, 225px) !important;
            height: 46px !important;
            border-radius: 14px !important;
          }
          .sxp-devfolio-content {
            padding-inline: 0.5rem !important;
          }
          .sxp-devfolio-logo {
            height: 16px !important;
            width: auto !important;
          }
          .sxp-devfolio-divider {
            height: 15px !important;
            margin-inline: 0.32rem !important;
          }
          .sxp-devfolio-tagline {
            font-size: 0.42rem !important;
            gap: 1px !important;
          }
          .sxp-osen-card {
            flex: 0 0 auto !important;
            width: clamp(100px, 30vw, 118px) !important;
            height: 46px !important;
            border-radius: 14px !important;
            padding: 0 0.35rem !important;
          }
          .sxp-xyz-card {
            flex: 0 0 auto !important;
            width: clamp(80px, 23vw, 95px) !important;
            height: 46px !important;
            border-radius: 14px !important;
            padding: 0 0.25rem !important;
          }
          .sxp-osen-logo {
            max-height: 25px !important;
            width: auto !important;
            max-width: 90% !important;
          }
          .sxp-xyz-logo {
            max-height: 19px !important;
            width: auto !important;
            max-width: 86% !important;
          }

          /* Community grid: 3-column balanced composition fitting within viewport */
          .sxp-community-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
            max-width: 350px !important;
            margin-inline: auto !important;
          }
          .sxp-community-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            flex: 0 0 auto !important;
          }
          .sxp-community-grid .sxp-partner-card:not(.sxp-stuamb-card) {
            flex: 0 0 auto !important;
            width: clamp(100px, 28vw, 114px) !important;
            height: 42px !important;
            border-radius: 12px !important;
            padding: 0 0.35rem !important;
          }
          .sxp-react-kolkata-card,
          .sxp-coderush-card,
          .sxp-mahakash-card,
          .sxp-gdg-card,
          .sxp-stuamb-card,
          .sxp-osen-card,
          .sxp-xyz-card {
            transform: none !important;
          }
          .sxp-react-kolkata-card:hover,
          .sxp-coderush-card:hover,
          .sxp-mahakash-card:hover,
          .sxp-gdg-card:hover,
          .sxp-stuamb-card:hover,
          .sxp-osen-card:hover,
          .sxp-xyz-card:hover {
            transform: translateY(-2px) scale(1.015) !important;
          }
          .sxp-react-kolkata-logo {
            max-height: 18px !important;
            width: auto !important;
            max-width: 88% !important;
          }
          .sxp-innofusion-card {
            padding: 0 0.35rem !important;
          }
          .sxp-innofusion-content {
            gap: 0.25rem !important;
          }
          .sxp-innofusion-logo {
            height: 16px !important;
            width: 16px !important;
          }
          .sxp-innofusion-brand {
            font-size: 0.63rem !important;
            letter-spacing: 0.01em !important;
            font-weight: 700 !important;
            white-space: nowrap !important;
          }
          .sxp-stuamb-card {
            flex: 0 0 auto !important;
            width: clamp(84px, 23vw, 92px) !important;
            height: clamp(84px, 23vw, 92px) !important;
            aspect-ratio: 1 / 1 !important;
            border-radius: 14px !important;
            padding: 0.25rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .sxp-stuamb-logo {
            max-height: 64px !important;
            width: auto !important;
            max-width: 88% !important;
          }
          .sxp-gdg-card {
            width: clamp(96px, 27vw, 114px) !important;
            height: 48px !important;
          }
          .sxp-gdg-logo {
            max-height: 32px !important;
            width: clamp(78px, 22vw, 96px) !important;
            max-width: 90% !important;
          }
          .sxp-coderush-logo {
            max-height: 16px !important;
            width: auto !important;
            max-width: 88% !important;
          }
          .sxp-mahakash-logo {
            max-height: 20px !important;
            width: auto !important;
            max-width: 90% !important;
          }

          /* Media partners: side by side on phone */
          .sxp-media-grid {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
            width: min(94vw, 350px) !important;
          }
          .sxp-media-grid .sxp-lnc-card,
          .sxp-media-grid .sxp-eventopia-card {
            flex: 0 0 auto !important;
            width: clamp(140px, 42vw, 156px) !important;
            height: 44px !important;
            border-radius: 12px !important;
            padding: 0 0.4rem !important;
          }
          .sxp-lnc-logo {
            max-height: 20px !important;
            width: auto !important;
            max-width: 85% !important;
          }
          .sxp-eventopia-logo {
            max-height: 15px !important;
            width: auto !important;
            max-width: 88% !important;
          }
          .sxp-unrevealed-note {
            font-size: 0.64rem !important;
            margin-top: 0.15rem !important;
            margin-bottom: 0 !important;
            text-align: center !important;
            padding-inline: 0.6rem !important;
          }
          .sxp-cta-wrap {
            margin-top: 0.18rem !important;
            transform: scale(0.85) !important;
          }
        }

        /* ── Larger Viewports (1440p / Ultrawide) ── */
        @media (min-width: 1440px) {
          .sxp-inner {
            max-width: 74rem;
            gap: clamp(0.6rem, 1.4vh, 1rem);
          }
          .sxp-wall {
            max-width: 74rem;
            gap: 1.75rem;
          }
        }

        /* Short viewports: the ornament is the first thing to give. */
        @media (max-height: 720px) {
          .sxp-motif { display: none; }
          .sxp-wall { gap: 0.6rem; }
        }


      `}</style>
    </section>
  );
}
