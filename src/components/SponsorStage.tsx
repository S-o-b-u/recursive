"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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

type CardLayer = "front" | "back";

const CARD_POSITIONS: Array<{ top?: string, bottom?: string, left?: string, right?: string, width: string, height: string, theme: "white" | "green", layer: CardLayer, label: string, isRevealed?: boolean, name?: string, color?: string }> = [
  // Microsoft
  { top: "15%", left: "22%", width: "240px", height: "130px", theme: "white", layer: "back", label: "PLATINUM SPONSORS", isRevealed: true, name: "Microsoft", color: "#5e656b" },
  // Devfolio
  { top: "15%", left: "52%", width: "240px", height: "130px", theme: "green", layer: "back", label: "PLATINUM SPONSORS", isRevealed: true, name: "devfolio", color: "#ffffff" },
  // GitHub
  { top: "45%", left: "6%", width: "220px", height: "130px", theme: "green", layer: "front", label: "PLATINUM SPONSORS", isRevealed: true, name: "GitHub", color: "#ffffff" },
  // GDG
  { top: "45%", right: "6%", width: "220px", height: "130px", theme: "white", layer: "front", label: "COMMUNITY PARTNER", isRevealed: true, name: "GDG", color: "#616161" },
  // MLH (Unrevealed / Placeholder)
  { bottom: "12%", left: "22%", width: "200px", height: "120px", theme: "white", layer: "front", label: "MORE SPONSORS", isRevealed: false },
  // Angelhack (Unrevealed / Placeholder)
  { bottom: "12%", left: "42%", width: "190px", height: "120px", theme: "green", layer: "back", label: "COMING SOON", isRevealed: false },
  // Twilio (Unrevealed / Placeholder)
  { bottom: "12%", left: "58%", width: "180px", height: "120px", theme: "white", layer: "back", label: "MORE SPONSORS", isRevealed: false },
  // Polygon (Unrevealed / Placeholder)
  { bottom: "12%", right: "12%", width: "180px", height: "120px", theme: "white", layer: "front", label: "COMING SOON", isRevealed: false },
];

export default function SponsorStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollUpRef = useRef<HTMLButtonElement>(null);

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
      const easeWindow = gsap.parseEase("power2.inOut");
      const easeLabel = gsap.parseEase("power2.in");
      const easePanel = gsap.parseEase("power2.out");

      /** Sub-ranges of the pass, in progress units. */
      const WINDOW_END = 0.46;
      const LABEL_END = 0.16;
      const PREVIEW_END = 0.20;
      const PANEL_IN = 0.20;
      const PANEL_LEN = 0.26;

      const apply = () => {
        const t = state.prog;

        // The window opens.
        setP(easeWindow(clamp01(t / WINDOW_END)));

        // The night-side labels step aside early.
        const l = easeLabel(clamp01(t / LABEL_END));
        gsap.set(intro, { opacity: 1 - l, y: -30 * l });
        gsap.set(outro, { opacity: 1 - l, y: 30 * l });

        // The preview title inside the closed window fades out as the window opens.
        if (preview) {
          const pr = clamp01(t / PREVIEW_END);
          gsap.set(preview, { opacity: 1 - pr, scale: 1 + 0.08 * pr });
        }

        // The panel arrives once there is room for it.
        const b = easePanel(clamp01((t - PANEL_IN) / PANEL_LEN));
        gsap.set(body, {
          opacity: b,
          y: 36 * (1 - b),
          pointerEvents: b > 0.05 ? "auto" : "none",
        });

        // ── Animate the Sponsor Cards ──
        if (body) {
          const cards = body.querySelectorAll(".sponsor-card");
          cards.forEach((card, i) => {
            const cardEl = card as HTMLElement;
            const start = PANEL_IN + (i * 0.012); 
            const cardProg = easePanel(clamp01((t - start) / (PANEL_LEN - 0.05)));
            const targetRot = parseFloat(cardEl.dataset.rot || "0");
            gsap.set(cardEl, {
              opacity: cardProg,
              scale: 0.8 + (0.2 * cardProg),
              y: 50 * (1 - cardProg),
              rotation: targetRot * cardProg,
            });
          });
        }

        // The frameless up arrow fades in as the stage opens and reaches full visibility
        if (scrollUpBtn) {
          const s = easePanel(clamp01((t - 0.28) / 0.18));
          gsap.set(scrollUpBtn, {
            opacity: s,
            y: (1 - s) * -10,
            pointerEvents: s > 0.1 ? "auto" : "none",
          });
        }
      };

      // Paint the closed state before the first scroll event arrives.
      apply();

      // fromTo, not to: `invalidateOnRefresh` re-reads a to() tween's start on
      // every refresh, and a resize is a refresh — it would re-capture the
      // start from this proxy mid-flight and collapse the range.
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
            scrub: 0.7,
            invalidateOnRefresh: true,
            onRefresh: apply,
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

            <div ref={bodyRef} className="sxp-body" style={{ backgroundColor: '#f5f7f3' }}>
              <div className="sxp-inner relative flex flex-col items-center justify-center w-full h-full max-w-[1400px]">
                
                {/* ── Background Accents ── */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  {/* Left Side Text */}
                  <div className="hidden lg:flex absolute top-[35%] left-[5%] flex-col text-sm font-heading font-semibold tracking-[0.15em] uppercase leading-relaxed text-[#2A3B28]">
                    <span>INNOVATE.</span>
                    <span>COLLABORATE.</span>
                    <span className="text-[#659F54]">CREATE IMPACT.</span>
                  </div>
                  {/* Left Lines */}
                  <div className="hidden lg:block absolute top-[38%] left-[2%] w-[100px] h-[60px] border-l-[1.5px] border-b-[1.5px] border-[#2A3B28] opacity-80" />
                  <div className="hidden lg:block absolute top-[22%] left-[18%] w-[40px] h-[80px] border-l-[1.5px] border-t-[1.5px] border-[#2A3B28] opacity-80" />
                  <div className="hidden lg:block absolute top-[10%] left-[20%] text-[#659F54] text-3xl font-black rotate-[-15deg] font-mono leading-none">
                    -`<br/>&nbsp;-
                  </div>

                  {/* Right Side Text */}
                  <div className="hidden lg:flex absolute bottom-[20%] right-[3%] items-center gap-3 text-sm font-heading font-semibold tracking-[0.15em] uppercase leading-tight text-[#2A3B28]">
                    <div className="text-right">AND MANY<br/><span className="text-[#659F54]">MORE!</span></div>
                    <div className="flex flex-col gap-1.5 mt-1">
                       <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#2A3B28] border-b-[5px] border-b-transparent"></div>
                       <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#2A3B28] border-b-[5px] border-b-transparent"></div>
                    </div>
                  </div>
                  {/* Right Side Stacked Squares */}
                  <div className="hidden lg:flex absolute top-[30%] right-[8%] flex-col gap-3">
                     <div className="w-6 h-6 border-[1.5px] border-[#2A3B28] opacity-80" />
                     <div className="w-6 h-6 border-[1.5px] border-[#2A3B28] opacity-80" />
                     <div className="w-6 h-6 border-[1.5px] border-[#2A3B28] opacity-80" />
                  </div>
                  <div className="hidden lg:block absolute top-[45%] right-[5%] w-[80px] h-[1.5px] bg-[#2A3B28] opacity-80" />

                  {/* Geometric Circles */}
                  <div className="absolute top-[15%] left-[42%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-[#85bd76] to-[#59944a] opacity-80 blur-[2px]" />
                  <div className="absolute bottom-[0%] right-[15%] w-[180px] h-[180px] rounded-full bg-gradient-to-br from-[#85bd76] to-[#59944a] opacity-80 blur-[2px]" />
                  <div className="absolute bottom-[-10%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#dbe8d6] opacity-60 blur-[4px]" />
                </div>

                {/* ── Headings ── */}
                <div className="flex flex-col items-center z-20 mb-8 md:mb-12 text-center pointer-events-none mt-4 md:mt-10">
                  <h3 className="font-bebas text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-wide text-[#232623] uppercase leading-none" style={{ fontFamily: "var(--font-bebas), sans-serif", textShadow: "0 2px 10px rgba(255,255,255,0.8)" }}>
                    OUR AMAZING SPONSORS
                  </h3>
                  <p className="font-heading font-bold text-[0.65rem] sm:text-[0.75rem] md:text-sm tracking-widest uppercase text-[#232623] mt-4 sm:mt-6">
                    Powering Innovation. Building the future.
                  </p>
                </div>

                {/* ── The main Gratitude + Cards area ── */}
                <div className="relative w-full h-[450px] sm:h-[550px] md:h-[650px] flex items-center justify-center mt-0 sm:mt-[-2rem] md:mt-[-4rem]">
                   
                   {/* Back Layer Cards */}
                   <div className="absolute inset-0 z-10 w-full h-full pointer-events-none hidden sm:block">
                     {CARD_POSITIONS.filter(c => c.layer === "back").map((pos, i) => (
                       <div 
                         key={`back-${i}`} 
                         className={`sponsor-card absolute flex flex-col items-center justify-center p-3 sm:p-4 shadow-xl sm:rounded-none ${pos.theme === 'green' ? 'bg-[#15341d] text-white border-white/5' : 'bg-white text-[#111a12] border-black/5'}`}
                         style={{ 
                           top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom,
                           width: `clamp(90px, 16vw, ${pos.width})`, height: `clamp(60px, 10vw, ${pos.height})`,
                           border: pos.theme === 'green' ? 'none' : '1px solid rgba(0,0,0,0.05)'
                         }}
                       >
                         <div className="flex-1 flex items-center justify-center">
                            {pos.isRevealed ? (
                              <span className="font-heading font-black text-xl sm:text-2xl md:text-4xl tracking-tight" style={{ color: pos.color || 'inherit' }}>
                                {pos.name}
                              </span>
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 md:w-10 md:h-10">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            )}
                         </div>
                         <div className={`text-[0.45rem] sm:text-[0.55rem] md:text-[0.65rem] font-heading font-medium tracking-wide uppercase mt-auto ${pos.theme === 'green' ? 'text-white/60' : 'text-black/60'} text-center leading-tight`}>
                           {pos.label}
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Giant GRATITUDE Text (z-20) */}
                   <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <h1 
                        className="font-bebas text-[28vw] md:text-[18rem] lg:text-[22rem] tracking-tight text-white uppercase leading-none select-none origin-center"
                        style={{ 
                          fontFamily: "var(--font-bebas), sans-serif",
                          textShadow: "0 25px 40px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.8)",
                          WebkitTextStroke: "1px rgba(0,0,0,0.05)"
                        }}
                      >
                        GRATITUDE
                      </h1>
                   </div>

                   {/* Paper Airplane (z-25) */}
                   <div className="absolute z-[25] top-[55%] left-[32%] md:top-[60%] md:left-[36%] -rotate-[12deg] pointer-events-none">
                      <svg width="60" height="40" viewBox="0 0 24 24" fill="#659F54" className="drop-shadow-lg w-10 md:w-16">
                         <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                   </div>

                   {/* Front Layer Cards (z-30) */}
                   <div className="absolute inset-0 z-30 w-full h-full pointer-events-none hidden sm:block">
                     {CARD_POSITIONS.filter(c => c.layer === "front").map((pos, i) => (
                       <div 
                         key={`front-${i}`} 
                         className={`sponsor-card absolute flex flex-col items-center justify-center p-3 sm:p-4 shadow-xl sm:rounded-none ${pos.theme === 'green' ? 'bg-[#15341d] text-white border-white/5' : 'bg-white text-[#111a12] border-black/5'}`}
                         style={{ 
                           top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom,
                           width: `clamp(90px, 16vw, ${pos.width})`, height: `clamp(60px, 10vw, ${pos.height})`,
                           border: pos.theme === 'green' ? 'none' : '1px solid rgba(0,0,0,0.05)'
                         }}
                       >
                         <div className="flex-1 flex items-center justify-center">
                            {pos.isRevealed ? (
                              <span className="font-heading font-black text-xl sm:text-2xl md:text-4xl tracking-tight" style={{ color: pos.color || 'inherit' }}>
                                {pos.name}
                              </span>
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 md:w-10 md:h-10">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            )}
                         </div>
                         <div className={`text-[0.45rem] sm:text-[0.55rem] md:text-[0.65rem] font-heading font-medium tracking-wide uppercase mt-auto ${pos.theme === 'green' ? 'text-white/60' : 'text-black/60'} text-center leading-tight`}>
                           {pos.label}
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Mobile fallback layout (all cards on top) */}
                   <div className="absolute inset-0 z-30 w-full h-full pointer-events-none sm:hidden flex flex-wrap items-center justify-center gap-2 px-4 mt-8">
                      {CARD_POSITIONS.map((pos, i) => (
                         <div 
                           key={`mob-${i}`} 
                           className={`sponsor-card flex flex-col items-center justify-center p-2 shadow-lg border rounded ${pos.theme === 'green' ? 'bg-[#15341d] text-white' : 'bg-white text-[#111a12]'}`}
                           style={{ width: '45%', height: '80px' }}
                         >
                           <div className="flex-1 flex items-center justify-center">
                              {pos.isRevealed ? (
                                <span className="font-heading font-black text-xl tracking-tight" style={{ color: pos.color || 'inherit' }}>
                                  {pos.name}
                                </span>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              )}
                           </div>
                           <div className={`text-[0.4rem] font-heading font-medium tracking-wide uppercase mt-auto ${pos.theme === 'green' ? 'text-white/60' : 'text-black/60'} text-center leading-tight`}>
                             {pos.label}
                           </div>
                         </div>
                      ))}
                   </div>
                </div>
                
                <div className="sxp-cta-wrap z-[40] mt-12 sm:mt-16 md:mt-0 relative">
                  <LiquidMetalButton
                    label="Partner with this edition"
                    href={`mailto:${EVENT.email}`}
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

          {/* ── Frameless Up Arrow in Top Right Corner (Appears when opened) ── */}
          <button
            ref={scrollUpRef}
            type="button"
            onClick={scrollUp}
            aria-label="Scroll up to previous section"
            className="sxp-scrollup-arrow"
            title="Scroll up"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sxp-arrow-svg"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style href="sponsor-stage" precedence="default" suppressHydrationWarning>{`
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
          opacity: clamp(0, calc((1 - var(--sxp-p)) * 6.7), 1);
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
          padding-top: clamp(3rem, 7vh, 5.5rem);
          padding-bottom: clamp(3rem, 7vh, 5.5rem);
          opacity: 0;
          pointer-events: none;
        }

        .sxp-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 62rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: clamp(0.35rem, 0.9vh, 0.65rem);
        }

        .sxp-motif {
          width: clamp(78px, 36.13px + 11.63vw, 185px);
          height: auto;
          color: #2F5527;
          opacity: 0.92;
          margin-bottom: 0.15rem;
        }

        .sxp-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.7rem, 0.95vw, 0.82rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3D6B22;
        }

        .sxp-heading {
          margin: 0.15rem 0 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(1.581rem, 9.53px + 4.38vw, 4.1rem);
          line-height: 1.05;
          letter-spacing: -0.028em;
          color: #111a12;
        }

        .sxp-lede {
          margin: 0;
          max-width: 44rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.95rem, 1.35vw, 1.15rem);
          line-height: 1.5;
          color: #2A3B28;
          text-wrap: pretty;
        }

        /* ── The sealed mark ── */
        .sxp-seal {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          margin-top: clamp(0.4rem, 1.2vh, 1rem);
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
          gap: clamp(0.7rem, 1.6vw, 1.35rem);
          width: 100%;
          max-width: 62rem;
          margin-top: clamp(0.8rem, 2vh, 1.6rem);
        }

        .sxp-cta-wrap {
          margin-top: clamp(0.7rem, 1.8vh, 1.4rem);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        /* ── Clean Frameless Up Arrow in Top Right Corner ── */
        .sxp-scrollup-arrow {
          position: absolute;
          top: clamp(1.2rem, 3vh, 2.2rem);
          right: clamp(1.2rem, 3.5vw, 2.5rem);
          z-index: 120;
          background: transparent;
          border: none;
          outline: none;
          width: 48px;
          height: 48px;
          padding: 0;
          margin: 0;
          color: #142617;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 220ms ease, transform 220ms ease;
          will-change: transform, opacity;
        }

        .sxp-scrollup-arrow:hover {
          color: #2b541d;
        }

        .sxp-scrollup-arrow:hover .sxp-arrow-svg {
          transform: translateY(-4px);
        }

        .sxp-arrow-svg {
          transition: transform 240ms cubic-bezier(0.23, 1, 0.32, 1);
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.16)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.9));
        }

        .sxp-scrollup-arrow:active {
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
            padding-top: clamp(4rem, 8vh, 6rem);
            padding-bottom: clamp(4rem, 8vh, 6rem);
          }
        }

        @media (max-width: 620px) {
          .sxp { --sxp-track: 260vh; }
          .sxp-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sxp-body {
            justify-content: center;
            padding-top: clamp(2rem, 5vh, 3.5rem);
            padding-bottom: clamp(2rem, 5vh, 3.5rem);
          }
          .sxp-inner {
            gap: clamp(0.42rem, 1.1vh, 0.75rem);
          }
          .sxp-motif {
            width: 100px;
            margin-bottom: 0.1rem;
          }
          .sxp-heading {
            font-size: 1.95rem;
          }
          .sxp-lede {
            font-size: 0.86rem;
            line-height: 1.4;
            max-width: 22rem;
          }
          .sxp-seal {
            margin-top: clamp(0.35rem, 1.1vh, 0.65rem);
          }
          .sxp-seal-word {
            font-size: 1.28rem;
          }
          .sxp-seal-q {
            font-size: clamp(6rem, 24vw, 8.5rem);
            filter: blur(6px);
          }
          .sxp-cta-wrap {
            margin-top: clamp(0.45rem, 1.2vh, 0.8rem);
            transform: scale(0.96);
          }
        }

        /* Short viewports: the ornament is the first thing to give. */
        @media (max-height: 720px) {
          .sxp-motif { display: none; }
          .sxp-wall { gap: 0.6rem; }
        }

        /* Landscape phones */
        @media (max-height: 520px) {
          .sxp-body {
            padding-top: clamp(1.5rem, 4vh, 2.5rem);
            padding-bottom: clamp(1.5rem, 4vh, 2.5rem);
          }
          .sxp-eyebrow { font-size: 0.62rem; letter-spacing: 0.18em; }
          .sxp-heading { font-size: clamp(1.3rem, 3.4vw, 2rem); }
          .sxp-lede {
            font-size: 0.82rem;
            line-height: 1.35;
            max-width: 34rem;
          }
          .sxp-seal { margin-top: 0.1rem; }
          .sxp-seal-word { font-size: clamp(1rem, 2.6vw, 1.5rem); }
          .sxp-seal-q { font-size: clamp(2.2rem, 6vw, 3.4rem); }
          .sxp-cta-wrap { margin-top: 0.35rem; transform: scale(0.9); }
        }
      `}</style>
    </section>
  );
}
