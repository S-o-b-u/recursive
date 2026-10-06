"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SPONSOR_SLOTS, EVENT } from "@/data/hackathon";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import Ornament from "@/components/ui/Ornament";
import { perfLite } from "@/lib/device";

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

/**
 * THE WALL — one tile per supporter.
 *
 * A checkerboard of deep-forest and fresh-leaf tiles, each with a cream medallion
 * for the logo and the name, a hairline and the tier underneath. Six across
 * and three down on a desktop, three across and flowing down the page on
 * anything smaller (see the `.sxt-*` rules below).
 *
 * The order is the page's hierarchy read left to right: partners first, then
 * sponsors, community, media. To add a supporter, add a tile; the checkerboard
 * and the sizing take care of themselves.
 */
const FLOW_QUERY = "(max-height: 420px)";

type Fit = "wide" | "mid" | "fat" | "square";

interface Tile {
  name: string;
  role: string;
  /** Full name, when `name` is shortened to fit. */
  title?: string;
  href?: string;
  /** What goes in the medallion. Decorative: the caption carries the name. */
  mark: ReactNode;
}

const logo = (src: string, w: number, h: number, fit: Fit) => (
  <img src={src} alt="" width={w} height={h} className={`sxt-logo sxt-logo--${fit}`} decoding="async" />
);

const TILES: Tile[] = [
  {
    name: "Aqyron Labs",
    role: "Partner",
    href: "https://aqyronlabs.com",
    mark: logo("/images/sponsors/aqyron-labs.png", 785, 568, "fat"),
  },
  {
    name: "Core Platform",
    role: "Partner",
    href: "https://coreplatform.in/",
    mark: logo("/images/sponsors/composio.png", 1024, 1024, "square"),
  },
  {
    name: "Devfolio",
    role: "Platform Partner",
    href: "https://devfolio.co",
    mark: logo("/images/sponsors/devfolio.png", 175, 42, "wide"),
  },
  {
    name: "ML Kolkata",
    role: "AI/ML Track Partner",
    href: "https://www.commudle.com/communities/ml-kolkata",
    mark: logo("/images/sponsors/ml-kolkata-torch.png", 392, 738, "mid"),
  },
  {
    name: ".xyz",
    role: "Domain Sponsor",
    href: "https://gen.xyz",
    mark: logo("/images/sponsors/xyz-logo-color.png", 301, 176, "mid"),
  },
  {
    name: "OSEN",
    role: "Sponsor",
    mark: logo("/images/sponsors/OSEN.png", 200, 54, "wide"),
  },
  {
    name: "2i Educare",
    role: "Sponsor",
    title: "2i Educare - Wing of 2nd Inning",
    href: "https://2ieducare.in",
    mark: logo("/images/sponsors/2i-educare.png", 928, 326, "mid"),
  },
  {
    name: "TMC Institute of Learning",
    role: "Sponsor",
    mark: logo("/images/sponsors/tmc-institute.png", 768, 590, "fat"),
  },
  {
    name: "Inst. of Academic Excellence",
    role: "Sponsor",
    title: "Institute of Academic Excellence (IAE)",
    mark: logo("/images/sponsors/ShortIAE1x111.png", 300, 300, "square"),
  },
  {
    name: "n8n",
    role: "Sponsor",
    href: "https://n8n.io",
    mark: logo("/images/sponsors/n8n.png", 576, 160, "wide"),
  },
  {
    name: "Mastra",
    role: "Sponsor",
    href: "https://mastra.ai",
    mark: logo("/images/sponsors/03_01_Mastra_Logo_ver4[black].png", 1536, 258, "wide"),
  },
  {
    name: "React Kolkata",
    role: "Community Partner",
    href: "https://reactkolkata.com",
    mark: logo("/images/sponsors/react-kolkata-logo-dark.png", 216, 69, "wide"),
  },
  {
    name: "Innofusion",
    role: "Community Partner",
    mark: logo("/images/sponsors/INNOFUSION%203.0%20logo.png", 200, 200, "square"),
  },
  {
    name: "MS Student Ambassador",
    role: "Community Partner",
    title: "Microsoft Student Ambassador",
    mark: logo("/images/sponsors/Stu_amb_clean.png", 140, 160, "square"),
  },
  {
    name: "GDG On Campus GNIT",
    role: "Community Partner",
    title: "Google Developer Groups On Campus - Guru Nanak Institute of Technology",
    href: "https://gdg.community.dev/gdg-on-campus-guru-nanak-institute-of-technology-kolkata-india/",
    mark: logo("/images/sponsors/gdg-gnit-logo.png", 857, 344, "mid"),
  },
  {
    name: "CodeRush X",
    role: "Community Partner",
    mark: logo("/images/sponsors/CodeRush%20X%20Logo-dark.png", 225, 52, "wide"),
  },
  {
    name: "GNIT Mahakash",
    role: "Community Partner",
    title: "GNIT Mahakash - The Space Club",
    mark: logo("/images/sponsors/FinalBlack.png", 190, 52, "wide"),
  },
  {
    name: "LNC Community",
    role: "Media Partner",
    href: "https://lnc-community.vercel.app",
    mark: logo("/images/sponsors/LNC.png", 195, 52, "wide"),
  },
  {
    name: "Eventopia",
    role: "Media Partner",
    href: "https://eventopia.in/",
    mark: logo("/images/sponsors/Eventopia-Logo-04.png", 170, 44, "wide"),
  },
];

function TileFace({ tile }: { tile: Tile }) {
  return (
    <>
      <span className="sxt-disc" aria-hidden="true">
        <span className="sxt-disc-in">{tile.mark}</span>
      </span>
      <span className="sxt-cap">
        <span className="sxt-name">{tile.name}</span>
        <span className="sxt-rule" aria-hidden="true" />
        <span className="sxt-role">{tile.role}</span>
      </span>
    </>
  );
}


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
    // Smartboards: top, bottom, left, right night panels (see .sxp-shutters).
    const shutters = perfLite()
      ? Array.from(stage.querySelectorAll<HTMLElement>(".sxp-shutter"))
      : [];
    const shutterWrap = shutters.length ? stage.querySelector<HTMLElement>(".sxp-shutters") : null;
    const setP = (v: number) => stage.style.setProperty("--sxp-p", v.toFixed(4));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      shutters.forEach((el) => {
        el.style.display = "none";
      });
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

    // Tablets, phones and short screens get the wall in the page's flow (see FLOW_QUERY):
    // no window to open, so nothing below clips, fades or moves.
    const flowMQ = window.matchMedia(FLOW_QUERY);
    let flow = flowMQ.matches;

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
      let lastBodyY = 999999;

      let winW = 0;
      let winH = 0;
      let stageW = 0;
      let stageH = 0;
      let bodyScrollH = 0;

      const measure = () => {
        flow = flowMQ.matches;
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

        const inner = stage.querySelector<HTMLElement>(".sxp-inner");
        const cs = window.getComputedStyle(body);
        const padTop = parseFloat(cs.paddingTop) || 0;
        const padBottom = parseFloat(cs.paddingBottom) || 0;
        bodyScrollH = (inner ? inner.offsetHeight : body.scrollHeight) + padTop + padBottom;

        lastInv = -1;
        lastOp = -1;
        lastL = -1;
        lastPr = -1;
        lastB = -1;
        lastS = -1;
        lastBodyY = 999999;
      };
      measure();

      /** Sub-ranges of the pass, in progress units. */
      const WINDOW_END = 0.38;
      const LABEL_END = 0.16;
      const PREVIEW_END = 0.20;
      const PANEL_IN = 0.16;
      const PANEL_LEN = 0.22;

      /** Panels' inner edges onto the window's, which is inset iy/ix from the stage. */
      const placeShutters = (iy: number, ix: number) => {
        const [top, bottom, left, right] = shutters;
        const hh = stageH / 2;
        const hw = stageW / 2;
        top.style.transform = "translate3d(0," + (iy - hh).toFixed(1) + "px,0)";
        bottom.style.transform = "translate3d(0," + (hh - iy).toFixed(1) + "px,0)";
        left.style.transform = "translate3d(" + (ix - hw).toFixed(1) + "px,0,0)";
        right.style.transform = "translate3d(" + (hw - ix).toFixed(1) + "px,0,0)";
      };

      const apply = (t: number) => {
        // 1. The window opens and closes with organic, gentle sine.out curve.
        const p = easeWindow(clamp01(t / WINDOW_END));
        const inv = 1 - p;
        if (Math.abs(inv - lastInv) > 0.0004 || (inv <= 0.001 && lastInv > 0.001) || (inv >= 0.999 && lastInv < 0.999)) {
          lastInv = inv;
          if (shutters.length === 4) {
            const open = inv <= 0.001 || flow;
            placeShutters(
              open ? 0 : Math.max(0, (stageH - winH) / 2) * inv,
              open ? 0 : Math.max(0, (stageW - winW) / 2) * inv,
            );
          } else if (inv <= 0.001 || flow) {
            if (frameEl) {
              frameEl.style.clipPath = "none";
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
        if (flow) {
          if (night) night.style.display = "none";
          if (plate) plate.style.display = "none";
        } else {
          const op = Math.max(0, Math.min(1, (1 - p) * 2.8));
          if (Math.abs(op - lastOp) > 0.008 || (op === 0 && lastOp !== 0) || (op === 1 && lastOp !== 1)) {
            lastOp = op;
            const opStr = op.toFixed(3);
            if (night) {
              night.style.display = op <= 0.001 ? "none" : "";
              night.style.opacity = opStr;
            }
            if (plate) plate.style.opacity = opStr;
            // The panels are the night here, so they retire with it.
            if (shutterWrap) shutterWrap.style.opacity = opStr;
          }
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
        if (flow) {
          if (lastB !== 1) {
            lastB = 1;
            setBody({ opacity: 1, y: 0 });
            if (bodyInteractive !== true) {
              bodyInteractive = true;
              body.style.pointerEvents = "auto";
            }
          }
        } else {
          if (t <= WINDOW_END) {
            const b = easePanel(clamp01((t - PANEL_IN) / PANEL_LEN));
            const curY = 28 * (1 - b);
            if (
              Math.abs(b - lastB) > 0.008 ||
              (b === 0 && lastB !== 0) ||
              (b === 1 && lastB !== 1) ||
              lastBodyY < -0.5
            ) {
              lastB = b;
              lastBodyY = curY;
              setBody({ opacity: b, y: curY });
              const bodyOn = b > 0.08;
              if (bodyOn !== bodyInteractive) {
                bodyInteractive = bodyOn;
                body.style.pointerEvents = bodyOn ? "auto" : "none";
              }
            }
          } else {
            // Window is open; if content is taller than stage (e.g. mobile), scroll through it
            const maxScroll = Math.max(0, bodyScrollH - stageH + 30);
            const scrollP = clamp01((t - WINDOW_END) / (1 - WINDOW_END));
            const targetY = -scrollP * maxScroll;
            if (Math.abs(targetY - lastBodyY) > 0.5 || lastB !== 1) {
              lastB = 1;
              lastBodyY = targetY;
              setBody({ opacity: 1, y: targetY });
              if (bodyInteractive !== true) {
                bodyInteractive = true;
                body.style.pointerEvents = "auto";
              }
            }
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
                {/* ── Centre: heading, the wall, the invitation ── */}
                <div className="sxp-inner">
                  <div className="sxp-ornament-wrap">
                    <Ornament className="sxp-crown" tone="light" />
                  </div>
                  <span className="sxp-eyebrow">Supporters &amp; partners</span>
                  <h2 className="sxp-heading">Our Sponsors</h2>

                  <ul className="sxt-grid" role="list">
                    {TILES.map((tile) => (
                      <li key={tile.name} className="sxt-tile">
                        {tile.href ? (
                          <a
                            href={tile.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sxt-link"
                            title={tile.title ?? tile.name}
                          >
                            <TileFace tile={tile} />
                          </a>
                        ) : (
                          <div className="sxt-link" title={tile.title ?? tile.name}>
                            <TileFace tile={tile} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="sxt-foot">
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
            </div>
          </div>

          {/* Sibling of the frame, so the clip does not eat it. Same geometry,
              because both read it off the stage. */}
          <span className="sxp-keyline" aria-hidden="true" />

          {/* Smartboards (html.perf-lite) open the window by sliding four
              night panels apart instead. Re-clipping the frame repaints the
              whole stage on every scroll frame; moving the panels is
              compositor work. */}
          <div className="sxp-shutters" aria-hidden="true">
            <span className="sxp-shutter sxp-shutter-t" />
            <span className="sxp-shutter sxp-shutter-b" />
            <span className="sxp-shutter sxp-shutter-l" />
            <span className="sxp-shutter sxp-shutter-r" />
          </div>

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
          height: 100dvh;
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
          background-position: center top;
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

        /* The smartboard window: the frame stays unclipped and the night is
           four solid panels, each half the stage, translated by the apply()
           loop so their inner edges sit on the window's. Square corners and
           no keyline, which is the price of never repainting. */
        .sxp-shutters {
          display: none;
        }
        .perf-lite .sxp-shutters {
          display: block;
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          will-change: opacity;
        }
        .sxp-shutter {
          position: absolute;
          background: var(--color-night);
          will-change: transform;
        }
        .sxp-shutter-t { top: 0; left: 0; right: 0; height: 50%; }
        .sxp-shutter-b { bottom: 0; left: 0; right: 0; height: 50%; }
        .sxp-shutter-l { top: 0; bottom: 0; left: 0; width: 50%; }
        .sxp-shutter-r { top: 0; bottom: 0; right: 0; width: 50%; }
        .perf-lite .sxp-frame {
          clip-path: none !important;
          will-change: auto;
        }
        .perf-lite .sxp-night,
        .perf-lite .sxp-keyline {
          display: none !important;
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
          padding-top: clamp(4.7rem, 7vh, 5.2rem);
          padding-bottom: clamp(0.8rem, 1.8vh, 1.4rem);
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* ── The wall's size ──
           One number, --sxt-w, is the width of the whole wall; every size
           inside it is a fraction of that, so it scales as one piece. It is as
           wide as the screen allows, but never so wide that its three rows
           stop fitting under the heading: --sxt-chrome is everything on the
           stage that is not the wall (nav clearance, heading, footer row), and
           a row of tiles is --sxt-k columns tall, so 3 rows fit when
           width = 6 / (3 * k) * the height left over. --sxt-fs is the type
           size as a fraction of the wall's width. The chrome figures are
           measured, plus a little air; they shrink with the screen's height
           because the nav clearance does.
           Each band below restates every variable it touches, in full: the
           compatibility script for old Android browsers evaluates min()/max()
           per rule, so a rule must carry all of its own inputs. */
        .sxp-stage {
          --sxt-chrome: calc(14.6rem + 10vh);
          --sxt-k: 1.4195;
          --sxt-fs: 0.0135;
          --sxt-w: min(94vw, 76rem);
          --sxt-wing: min(min(15rem, calc(var(--sxt-w) * 0.22)), calc((100vw - var(--sxt-w)) / 2 + 2rem));
        }

        /* ── Main stage layout wrapping the wings and the centre ── */
        .sxp-stage-layout {
          position: relative;
          width: 100%;
          max-width: min(98vw, 98rem);
          margin-inline: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }



        /* ── Centre cluster ── */
        .sxp-inner {
          position: relative;
          z-index: 2;
          width: var(--sxt-w);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .sxp-ornament-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: clamp(0.12rem, 0.3vh, 0.3rem);
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
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2e4b2a;
          opacity: 0.95;
          margin-bottom: 0.15rem;
        }

        .sxp-heading {
          margin: 0;
          font-family: var(--font-dm-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(1.9rem, 3.4vw, 2.7rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #122415;
        }

        /* ═══════════════════════════ THE WALL: TIERED BENTO ═══════════════════════════
           A 4-7-8 Tiered Bento Glassmorphic Grid across 56 columns:
           - Tier 1 (4 Headline & Platform Partners): span 14 cols each (4 * 14 = 56 cols)
           - Tier 2 (7 Official Sponsors): span 8 cols each (7 * 8 = 56 cols)
           - Tier 3 (8 Community & Media Partners): span 7 cols each (8 * 7 = 56 cols)
        */
        .sxt-grid {
          list-style: none;
          margin: clamp(0.8rem, 2vh, 1.3rem) 0 0;
          padding: 0;
          width: var(--sxt-w);
          display: grid;
          grid-template-columns: repeat(56, minmax(0, 1fr));
          gap: 14px;
          text-align: left;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        /* Tier 1: 4 feature cards (14 cols each = 56 cols) */
        .sxt-tile:nth-child(-n+4) {
          grid-column: span 14;
        }
        /* Tier 2: 7 cards (8 cols each = 56 cols) */
        .sxt-tile:nth-child(n+5):nth-child(-n+11) {
          grid-column: span 8;
        }
        /* Tier 3: 8 cards (7 cols each = 56 cols) */
        .sxt-tile:nth-child(n+12) {
          grid-column: span 7;
        }

        .sxt-tile {
          position: relative;
          min-width: 0;
          --ink: #122415;
          --ink-dim: #2E4B2A;
          --ring: rgba(143, 196, 90, 0.45);
          --ring-hi: rgba(143, 196, 90, 0.9);
          --drop: rgba(18, 36, 21, 0.12);
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 20px;
          box-shadow: 0 8px 24px -6px rgba(18, 36, 21, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.55);
          color: var(--ink);
          transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease, background 0.28s ease, border-color 0.28s ease;
        }

        .sxt-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(18, 36, 21, 0.14), 0 0 0 1.5px rgba(143, 196, 90, 0.6);
          background: rgba(255, 255, 255, 0.42);
        }

        /* Row 1 feature styling: horizontal wide card */
        .sxt-tile:nth-child(-n+4) .sxt-link {
          flex-direction: row;
          align-items: center;
          padding: 22px 28px;
          gap: 22px;
          text-align: left;
        }
        .sxt-tile:nth-child(-n+4) .sxt-disc {
          width: 150px;
          height: 68px;
          margin-bottom: 0;
          flex-shrink: 0;
        }
        .sxt-tile:nth-child(-n+4) .sxt-logo {
          max-height: 64px;
          max-width: 150px;
        }
        .sxt-tile:nth-child(-n+4) .sxt-cap {
          align-items: flex-start;
          text-align: left;
        }
        .sxt-tile:nth-child(-n+4) .sxt-name {
          font-size: 1.05rem;
          min-height: auto;
          justify-content: flex-start;
          text-align: left;
        }
        .sxt-tile:nth-child(-n+4) .sxt-rule {
          margin: 6px 0;
          width: 36px;
        }
        .sxt-tile:nth-child(-n+4) .sxt-role {
          font-size: 0.72rem;
        }

        /* Rows 2 & 3: vertical card */
        .sxt-tile:nth-child(n+5) .sxt-link {
          padding: 22px 14px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: 100%;
        }
        .sxt-tile:nth-child(n+5):nth-child(-n+11) .sxt-disc {
          width: 100%;
          height: 70px;
          margin-bottom: 12px;
        }
        .sxt-tile:nth-child(n+5):nth-child(-n+11) .sxt-logo {
          max-height: 60px;
          max-width: 135px;
        }

        .sxt-tile:nth-child(n+12) .sxt-link {
          padding: 18px 10px 14px;
        }
        .sxt-tile:nth-child(n+12) .sxt-disc {
          width: 100%;
          height: 58px;
          margin-bottom: 10px;
        }
        .sxt-tile:nth-child(n+12) .sxt-logo {
          max-height: 48px;
          max-width: 115px;
        }

        .sxt-link {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          color: inherit;
          text-decoration: none;
          outline: none;
          cursor: default;
        }

        a.sxt-link {
          cursor: pointer;
        }

        .sxt-link:focus-visible {
          box-shadow: inset 0 0 0 0.2em var(--ink);
        }

        /* Free floating logo stage (no restricting border or box) */
        .sxt-disc {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        .sxt-disc::before {
          display: none;
        }

        .sxt-disc-in {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }

        .sxt-cap {
          display: flex;
          flex-direction: column;
          margin-top: 0;
          align-items: center;
          text-align: center;
          width: 100%;
        }

        .sxt-name {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 2.1em;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.012em;
          color: #122415;
        }

        .sxt-tile:nth-child(n+12) .sxt-name {
          font-size: 0.78rem;
        }

        .sxt-rule {
          display: block;
          height: 1px;
          width: 24px;
          margin: 4px auto;
          background: rgba(143, 196, 90, 0.5);
        }

        .sxt-role {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          line-height: 1.25;
          color: #3B6B34;
        }

        .sxt-tile:nth-child(n+12) .sxt-role {
          font-size: 0.62rem;
        }

        /* ── Free floating large logos ── */
        .sxt-logo {
          display: block;
          flex: none;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(18, 36, 21, 0.05));
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        a.sxt-link:hover .sxt-logo,
        a.sxt-link:focus-visible .sxt-logo {
          transform: scale(1.08);
        }

        /* ── Below the wall: partner with this edition CTA ── */
        .sxt-foot {
          width: var(--sxt-w);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: clamp(0.7rem, 1.8vh, 1.2rem);
        }

        .sxp-cta-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        /* ── Scroll Navigation to Exit Frame (Hidden to match mockup) ── */
        .sxp-scrollup-wrap {
          display: none;
        }

        /* ── No gutter left for the polaroids ── */
        @media (max-width: 1200px) {
          .sxp-artifacts-wing {
            display: none;
          }
        }

        /* ── Short screens (laptops with the browser's toolbars on): the wall
              is height-limited, so give it every pixel the heading can spare. ── */
        @media (min-width: 901px) and (max-height: 820px) {
          .sxp-stage {
            --sxt-chrome: 15.9rem;
            --sxt-k: 1.3727;
            --sxt-fs: 0.015;
            --sxt-w: min(94vw, 74rem);
            --sxt-wing: min(min(15rem, calc(var(--sxt-w) * 0.22)), calc((100vw - var(--sxt-w)) / 2 + 2rem));
          }
          .sxt-grid {
            gap: 10px;
            margin-top: 0.6rem;
          }
          .sxt-tile:nth-child(-n+4) .sxt-link {
            padding: 16px 20px;
            gap: 16px;
          }
          .sxt-tile:nth-child(-n+4) .sxt-disc {
            width: 125px;
            height: 56px;
          }
          .sxt-tile:nth-child(-n+4) .sxt-logo {
            max-height: 54px;
            max-width: 125px;
          }
          .sxt-tile:nth-child(n+5) .sxt-link {
            padding: 16px 10px 14px;
          }
          .sxt-tile:nth-child(n+5):nth-child(-n+11) .sxt-disc {
            height: 58px;
            margin-bottom: 8px;
          }
          .sxt-tile:nth-child(n+5):nth-child(-n+11) .sxt-logo {
            max-height: 50px;
            max-width: 120px;
          }
          .sxt-tile:nth-child(n+12) .sxt-disc {
            height: 48px;
            margin-bottom: 8px;
          }
          .sxt-tile:nth-child(n+12) .sxt-logo {
            max-height: 40px;
            max-width: 100px;
          }
          .sxp-crown {
            width: clamp(80px, 7vw, 110px) !important;
          }
          .sxp-heading {
            font-size: clamp(1.6rem, 2.5vw, 2.1rem);
          }
          .sxp-body {
            padding-top: 4.2rem;
            padding-bottom: 0.5rem;
          }
        }

        @media (min-width: 901px) and (max-height: 700px) {
          .sxp-stage {
            --sxt-chrome: 12.6rem;
            --sxt-k: 1.3727;
            --sxt-fs: 0.015;
            --sxt-w: min(94vw, 70rem);
            --sxt-wing: min(min(15rem, calc(var(--sxt-w) * 0.22)), calc((100vw - var(--sxt-w)) / 2 + 2rem));
          }
          .sxp-ornament-wrap,
          .sxp-eyebrow {
            display: none;
          }
          .sxp-body {
            padding-top: 3.6rem;
            padding-bottom: 0.4rem;
          }
          .sxp-heading {
            font-size: clamp(1.4rem, 2.2vw, 1.8rem);
          }
          .sxt-grid {
            gap: 8px;
            margin-top: 0.5rem;
          }
          .sxt-tile:nth-child(-n+4) .sxt-link {
            padding: 12px 16px;
            gap: 12px;
          }
          .sxt-tile:nth-child(-n+4) .sxt-disc {
            width: 105px;
            height: 48px;
          }
          .sxt-tile:nth-child(-n+4) .sxt-logo {
            max-height: 46px;
            max-width: 105px;
          }
          .sxt-tile:nth-child(n+5) .sxt-link {
            padding: 12px 6px 10px;
          }
          .sxp-cta-wrap {
            transform: scale(0.88);
            transform-origin: right center;
          }
        }

        /* ═══════════ Tablets and mobile viewports (<= 900px) ═══════════
           Preserves the opening window transition animation,
           then smoothly scrolls through the 2-column bento cards. */
        @media (max-width: 900px) {
          .sxp {
            --sxp-track: 280vh;
          }
          .sxp-stage {
            position: sticky;
            top: 0;
            height: 100vh;
            height: 100dvh;
            max-height: 100dvh;
            overflow: hidden;
            --sxp-win-w: clamp(16rem, 82vw, 22rem);
            --sxp-win-h: min(calc(var(--sxp-win-w) * 0.5625), 45vh);
            --sxt-w: min(calc(100vw - 2 * var(--padding-x)), 34rem);
          }
          .sxp-artifacts-wing {
            display: none !important;
          }
          .sxp-label {
            width: min(92vw, 26rem);
          }
          .sxp-intro {
            bottom: calc(50% + var(--sxp-win-h) / 2 + clamp(0.9rem, 2.2vh, 1.8rem));
          }
          .sxp-outro {
            top: calc(50% + var(--sxp-win-h) / 2 + clamp(0.9rem, 2.2vh, 1.8rem));
          }
          .sxp-intro-line {
            font-size: clamp(1.2rem, 5vw, 1.6rem);
          }
          .sxp-intro-sub {
            font-size: clamp(0.78rem, 3.2vw, 0.9rem);
          }
          .sxp-preview-title {
            font-size: clamp(2.2rem, 8vw, 3.2rem);
          }
          .sxp-body {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: auto;
            min-height: 100%;
            justify-content: flex-start;
            padding-top: clamp(3.2rem, 7vh, 4.4rem);
            padding-bottom: clamp(2rem, 5vh, 3.2rem);
          }
          .sxp-stage-layout {
            display: block;
          }
          .sxp-crown {
            width: clamp(114px, 56.87px + 15.87vw, 220px) !important;
          }
          .sxp-eyebrow {
            font-size: 0.56rem;
            letter-spacing: 0.15em;
            font-weight: 600;
            color: #1b381a;
          }
          .sxp-heading {
            font-size: clamp(1.5rem, 6vw, 2.1rem);
          }
          .sxt-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
            padding: 0 4px;
            margin-top: 0.9rem;
            background: transparent;
            box-shadow: none;
            border: none;
          }
          .sxt-tile:nth-child(-n+4),
          .sxt-tile:nth-child(n+5):nth-child(-n+11),
          .sxt-tile:nth-child(n+12) {
            grid-column: span 1;
          }
          .sxt-tile:last-child {
            grid-column: span 2;
            max-width: 220px;
            justify-self: center;
            width: 100%;
          }
          .sxt-tile {
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.42);
            box-shadow: 0 8px 20px -4px rgba(18, 36, 21, 0.05);
          }
          .sxt-tile:nth-child(-n+4) .sxt-link,
          .sxt-tile:nth-child(n+5) .sxt-link {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 18px 12px 14px;
            gap: 0;
          }
          .sxt-tile:nth-child(-n+4) .sxt-disc,
          .sxt-tile:nth-child(n+5) .sxt-disc {
            width: 100%;
            height: 54px;
            margin-bottom: 8px;
          }
          .sxt-tile:nth-child(-n+4) .sxt-logo,
          .sxt-tile:nth-child(n+5) .sxt-logo {
            max-height: 48px;
            max-width: 120px;
          }
          .sxt-disc-in {
            width: 100%;
            height: 100%;
            background: transparent;
            box-shadow: none;
            border: none;
            border-radius: 0;
            padding: 0;
          }
          .sxt-tile:nth-child(-n+4) .sxt-cap,
          .sxt-tile:nth-child(n+5) .sxt-cap {
            align-items: center;
            text-align: center;
          }
          .sxt-name,
          .sxt-tile:nth-child(-n+4) .sxt-name,
          .sxt-tile:nth-child(n+12) .sxt-name {
            font-size: 0.82rem;
            min-height: 2.2em;
            justify-content: center;
            text-align: center;
          }
          .sxt-rule,
          .sxt-tile:nth-child(-n+4) .sxt-rule {
            width: 24px;
            margin: 4px auto;
          }
          .sxt-role,
          .sxt-tile:nth-child(-n+4) .sxt-role,
          .sxt-tile:nth-child(n+12) .sxt-role {
            font-size: 0.62rem;
          }
          .sxt-foot {
            justify-content: center;
            margin-top: 1.1rem;
          }
          .sxp-cta-wrap {
            justify-content: center;
            transform: none;
          }
        }

        /* ═══════════ Ultra-short landscape screens (<= 420px) ═══════════ */
        @media (max-height: 420px) {
          .sxp-track {
            height: auto;
          }
          .sxp-stage {
            position: relative;
            top: auto;
            height: auto;
            overflow: visible;
          }
          .sxp-night,
          .sxp-plate,
          .sxp-keyline,
          .sxp-shutters,
          .sxp-intro,
          .sxp-outro,
          .sxp-frame-preview,
          .sxp-artifacts-wing {
            display: none !important;
          }
          .sxp-frame {
            position: relative;
            clip-path: none !important;
            contain: none;
            transform: none !important;
          }
          .sxp-body {
            position: relative;
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: none !important;
          }
        }

      `}</style>
    </section>
  );
}
