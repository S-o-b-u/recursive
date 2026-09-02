"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SPONSOR_SLOTS, EVENT } from "@/data/hackathon";
import MediaSlot from "@/components/ui/MediaSlot";
import Ornament from "@/components/ui/Ornament";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

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
    const ctx = gsap.context(() => {
      const state = { prog: 0 };

      const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
      const easeWindow = gsap.parseEase("power1.inOut");
      const easeLabel = gsap.parseEase("power1.inOut");
      const easePanel = gsap.parseEase("sine.inOut");
      const easePreview = gsap.parseEase("sine.inOut");

      // Precomputed once, called every frame: this is what actually removes
      // the per-frame cost, not the easing curves (those are cheap Math.pow
      // calls either way).
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

      // pointerEvents is a plain DOM write, not a GSAP tween target -- skip it
      // when it has not actually flipped, instead of writing it every frame.
      let bodyInteractive: boolean | null = null;
      let scrollUpInteractive: boolean | null = null;
      // Same idea for the two backdrops: opacity changes every frame, but
      // `visibility` flips twice in the whole pass.
      let backdropHidden: boolean | null = null;
      // The window geometry settles before the scrub does. Once the insets stop
      // moving there is nothing to repaint, and re-writing clip-path anyway
      // costs a raster of the whole stage.
      let lastInv = -1;

      /**
       * The window geometry, resolved to pixels once per refresh.
       *
       * --sxp-p used to be written every frame and several descendants derived
       * their insets, radius and opacity from it through calc(). That is a
       * lovely single-source-of-truth on paper, and it measured 4.25ms per
       * frame against a 0.02ms budget for writing the same values directly:
       * a custom property read by descendant rules invalidates all of them,
       * and style recalculation is exactly what a phone is slowest at.
       *
       * The clamp()/min() stay in the stylesheet (still one source of truth,
       * and still what paints the closed state before this effect runs); a
       * hidden probe asks the browser to resolve them to pixels, once, on
       * refresh. Per frame this is now arithmetic plus two element writes.
       */
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
        // New box, so the insets must be rewritten even at unchanged progress.
        lastInv = -1;
      };
      measure();

      /** Sub-ranges of the pass, in progress units. */
      const WINDOW_END = 0.55;
      const LABEL_END = 0.20;
      const PREVIEW_END = 0.24;
      const PANEL_IN = 0.20;
      const PANEL_LEN = 0.32;

      const apply = () => {
        const t = state.prog;

        // The window opens and closes with symmetric quadratic curve.
        const p = easeWindow(clamp01(t / WINDOW_END));
        const inv = 1 - p;
        if (inv !== lastInv) {
          lastInv = inv;
          const iy = Math.max(0, (stageH - winH) / 2) * inv;
          const ix = Math.max(0, (stageW - winW) / 2) * inv;
          const r = 28 * inv;
          const iyPx = iy + "px";
          const ixPx = ix + "px";

          if (frameEl) {
            frameEl.style.clipPath =
              "inset(" + iyPx + " " + ixPx + " " + iyPx + " " + ixPx + " round " + r + "px)";
          }
          if (keyline) {
            const ks = keyline.style;
            // One shorthand rather than four longhands: same box, a quarter of
            // the style writes.
            ks.inset = iyPx + " " + ixPx;
            ks.borderRadius = r + "px";
            ks.opacity = inv.toFixed(4);
          }
        }

        // Smooth bidirectional crossfade for the night field and local plate.
        // When opening, it gently reveals the sky. When closing (scrolling up),
        // it gracefully glides back into the dark night field without slamming to black.
        const op = Math.max(0, Math.min(1, (1 - p) * 2.8));
        const hide = t >= 0.75;
        const flip = hide !== backdropHidden;
        if (flip) backdropHidden = hide;
        const vis = hide ? "hidden" : "visible";
        const opStr = op.toFixed(4);
        if (plate) {
          plate.style.opacity = opStr;
          if (flip) plate.style.visibility = vis;
        }
        if (night) {
          night.style.opacity = opStr;
          if (flip) night.style.visibility = vis;
        }

        // The night-side labels step aside smoothly and return gracefully on close.
        const l = easeLabel(clamp01(t / LABEL_END));
        setIntro({ opacity: 1 - l, y: -24 * l });
        setOutro({ opacity: 1 - l, y: 24 * l });

        // The preview title inside the closed window fades in/out symmetrically.
        if (setPreview) {
          const pr = easePreview(clamp01(t / PREVIEW_END));
          setPreview({ opacity: 1 - pr, scale: 1 + 0.06 * pr });
        }

        // The panel arrives softly as the window expands and dissolves smoothly as it closes.
        const b = easePanel(clamp01((t - PANEL_IN) / PANEL_LEN));
        setBody({ opacity: b, y: 28 * (1 - b) });
        const bodyOn = b > 0.08;
        if (bodyOn !== bodyInteractive) {
          bodyInteractive = bodyOn;
          body.style.pointerEvents = bodyOn ? "auto" : "none";
        }

        // The up arrow button only appears once the stage has fully opened
        if (setScrollUp && scrollUpBtn) {
          const s = easePanel(clamp01((t - WINDOW_END) / 0.14));
          setScrollUp({ opacity: s, y: (1 - s) * -14 });
          const scrollUpOn = s > 0.15;
          if (scrollUpOn !== scrollUpInteractive) {
            scrollUpInteractive = scrollUpOn;
            scrollUpBtn.style.pointerEvents = scrollUpOn ? "auto" : "none";
          }
        }
      };

      // Paint the closed state before the first scroll event arrives.
      apply();

      gsap.fromTo(
        state,
        { prog: 0 },
        {
          prog: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: track,
            // Exactly the span the sticky child is stuck for.
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              apply();
            },
          },
        },
      );
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
              <div className="sxp-inner">
                <Ornament className="sxp-motif" />
                <span className="sxp-eyebrow">Supporters &amp; partners</span>
                <h2 className="sxp-heading">Our Sponsors</h2>
                <p className="sxp-lede">
                  {sealed
                    ? "The backers are lined up. Organization names stay sealed until the official reveal."
                    : "Organizations and platforms empowering the builders on the hill."}
                </p>

                {sealed ? (
                  <div className="sxp-seal">
                    <span className="sxp-seal-q" aria-hidden="true">
                      ?
                    </span>
                    <span className="sxp-seal-word">Yet to reveal</span>
                  </div>
                ) : (
                  <div className="sxp-wall">
                    {SPONSOR_SLOTS.map((slot) => (
                      <div className="sxp-cell" key={slot.expect}>
                        <MediaSlot
                          slot={slot}
                          ratio={RATIO}
                          fit="contain"
                          dither={false}
                          sizes="(max-width: 700px) 44vw, 22vw"
                        />
                      </div>
                    ))}
                  </div>
                )}

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
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          width: min(90vw, 44rem);
          pointer-events: none;
          text-align: center;
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
          will-change: clip-path;
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
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
          background-image: url("/images/cloud.jpg");
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
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
            0 40px 90px -34px rgba(0, 0, 0, 0.9),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
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
          padding-top: clamp(2.5rem, 5vh, 4.5rem);
          padding-bottom: clamp(2.5rem, 5vh, 4.5rem);
          opacity: 0;
          pointer-events: none;
        }

        .sxp-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: min(90vw, 68rem);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: clamp(0.45rem, 1.2vh, 0.85rem);
        }

        .sxp-motif {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
          margin-bottom: 0.25rem;
        }

        .sxp-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 0.95vw, 0.85rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3D6B22;
        }

        .sxp-heading {
          margin: 0.15rem 0 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(1.6rem, 9.53px + 4.38vw, 4.2rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
          word-spacing: -0.01em;
          color: #111a12;
        }

        .sxp-lede {
          margin: 0;
          max-width: 48rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.35vw, 1.15rem);
          line-height: 1.55;
          color: #2A3B28;
          text-wrap: pretty;
        }

        /* ── The sealed mark ── */
        .sxp-seal {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          margin-top: clamp(0.8rem, 2vh, 1.8rem);
          margin-bottom: clamp(0.4rem, 1.2vh, 1rem);
        }

        .sxp-seal-q {
          grid-area: 1 / 1;
          font-family: var(--font-hiruko), var(--font-display), Georgia, serif;
          font-weight: 700;
          font-size: clamp(8.5rem, 24vh, 15rem);
          line-height: 0.75;
          color: rgba(38, 70, 32, 0.32);
          filter: blur(7px);
          animation: sxp-seal-breathe 8s ease-in-out infinite;
          user-select: none;
        }

        .sxp-seal-word {
          grid-area: 1 / 1;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.6rem, 4.4vw, 3.1rem);
          line-height: 1;
          letter-spacing: 0.19em;
          text-transform: uppercase;
          color: #16300F;
          text-shadow:
            0 2px 0 rgba(255, 255, 255, 0.4),
            0 0 28px rgba(255, 255, 255, 0.8);
        }

        @keyframes sxp-seal-breathe {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.03); }
        }

        .sxp-wall {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.75rem, 1.8vw, 1.5rem);
          width: 100%;
          max-width: 68rem;
          margin-top: clamp(0.8rem, 2vh, 1.8rem);
        }

        .sxp-cta-wrap {
          margin-top: clamp(1rem, 2.4vh, 2rem);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        /* ── Scroll Navigation to Exit Frame (Beside Nav Bar) ── */
        .sxp-scrollup-wrap {
          position: absolute;
          top: clamp(1.25rem, 3.2vh, 2.25rem);
          right: clamp(1rem, 3.5vw, 2.2rem);
          z-index: 105;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .sxp-scrollup-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: auto;
          height: auto;
          padding: 0.35rem;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
          color: #1b3519;
          cursor: pointer;
          box-shadow: none;
          transition: all 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sxp-scrollup-btn:hover {
          background: transparent;
          border: none;
          color: #2F5527;
          box-shadow: none;
        }

        .sxp-scrollup-btn:hover .sxp-arrow-icon {
          transform: translateY(-3px);
        }

        .sxp-arrow-icon {
          width: 22px;
          height: 22px;
          transition: transform 200ms ease, color 200ms ease;
          filter: drop-shadow(0 1px 3px rgba(255, 255, 255, 0.9));
        }

        .sxp-scrollup-btn:active {
          transform: scale(0.92);
        }

        /* ── Narrower viewports ── */
        @media (max-width: 900px) {
          .sxp { --sxp-track: 280vh; }
          .sxp-stage {
            --sxp-win-w: min(88vw, 34rem);
          }
          .sxp-wall { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .sxp-body {
            padding-top: clamp(3rem, 6vh, 4.5rem);
            padding-bottom: clamp(2rem, 5vh, 4rem);
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

          /* The big blurred "?" behind YET TO REVEAL breathes (opacity + scale)
             on an 8s loop for as long as this section is mounted -- not just
             during the scroll-expand motion, but the whole time the user is
             anywhere near it, including while scrubbing through the section.
             filter: blur() on a large, continuously-transforming element is a
             real per-frame rasterisation cost, stacked on top of the clip-path
             recalculation the window itself already does every scrubbed frame.
             Freezing it keeps the soft blurred mark in place without repainting
             it every frame; the blur itself is untouched. */
          .sxp-seal-q {
            animation: none;
          }
        }

        @media (max-width: 620px) {
          .sxp-scrollup-wrap {
            top: clamp(1.2rem, 3vh, 1.85rem);
            right: clamp(0.6rem, 2.5vw, 1rem);
          }
          .sxp { --sxp-track: 250vh; }
          .sxp-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sxp-body {
            justify-content: center;
            padding-top: clamp(3.5rem, 8vh, 5rem);
            padding-bottom: clamp(2rem, 4vh, 3.5rem);
          }
          .sxp-inner {
            gap: clamp(0.42rem, 1.1vh, 0.75rem);
          }
          .sxp-motif {
            width: clamp(114px, 30vw, 160px);
            margin-bottom: 0.15rem;
          }
          .sxp-seal {
            margin-top: clamp(0.35rem, 1.1vh, 0.65rem);
          }
          .sxp-seal-word {
            font-size: 1.28rem;
            letter-spacing: 0.15em;
          }
          .sxp-seal-q {
            font-size: clamp(6rem, 15vh, 9rem);
            filter: none !important;
            animation: none !important;
            color: rgba(38, 70, 32, 0.18) !important;
          }
          .sxp-cta-wrap {
            margin-top: clamp(0.45rem, 1.2vh, 0.85rem);
            transform: scale(0.96);
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
