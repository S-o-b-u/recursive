"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(CustomEase, ScrollTrigger);

// Hardware-accelerated gentle ease-out curve for Phase 3 cinematic zoom-out
try {
  CustomEase.create("cinematicRevealEase", "0.25, 1, 0.5, 1");
} catch {}

// Cap animation updates to a stable 60 FPS delta-time step for 60Hz and low-spec hardware
gsap.ticker.fps(60);
gsap.ticker.lagSmoothing(500, 33);

/**
 * State-driven intro sequence enum
 * IDLE -> LOGO -> INTRO_TEXT -> CINEMATIC_REVEAL -> HERO_ACTIVE
 */
export type IntroState =
  | "IDLE"
  | "LOGO"
  | "INTRO_TEXT"
  | "CINEMATIC_REVEAL"
  | "HERO_ACTIVE";

const SEEN_KEY = "recursive:intro:v1";
const REPLAY_EVERY_LOAD = true;

interface SubtitleLine {
  words: string[];
  accent?: string;
  holdDuration: number;
}

const LINES: SubtitleLine[] = [
  { words: ["Welcome", "to", "the", "bottom."], holdDuration: 0.85 },
  { words: ["Do", "you", "know", "what's", "at", "the", "top?"], holdDuration: 0.95 },
  { words: ["Yep.", "A", "single", "plastic", "chair."], holdDuration: 0.95 },
  {
    words: ["Hundreds", "of", "hackers…", "but", "only", "ONE", "team", "gets", "to", "sit."],
    accent: "ONE",
    holdDuration: 1.35,
  },
  { words: ["So", "here's", "the", "dare:", "can", "you", "conquer", "it?"], holdDuration: 0.95 },
  { words: ["Let's", "find", "out."], holdDuration: 0.75 },
];

/** Keys the browser scrolls with; Lenis does not intercept these */
const SCROLL_KEYS = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
]);

export default function IntroSequence() {
  const [introState, setIntroState] = useState<IntroState>("IDLE");

  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressWrapRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const doneRef = useRef(false);

  // Helper references
  const heroVideo = () => document.querySelector<HTMLVideoElement>("video.hero-video");
  const heroVideoScale = () =>
    document.querySelector<HTMLElement>("#hero .hero-video-scale") ||
    document.querySelector<HTMLElement>("#hero .hero-video-wrap");

  // Release scroll lock smoothly
  const releaseScroll = useCallback(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Free GPU memory by removing will-change and clearing props
  const clearGpuLayers = useCallback(() => {
    try {
      const hvs = heroVideoScale();
      if (hvs) {
        hvs.style.willChange = "auto";
        gsap.set(hvs, { clearProps: "transform,willChange" });
      }
    } catch {}
  }, []);

  // Complete the transition and advance to HERO_ACTIVE
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    // 1. Remove will-change from elements to free GPU memory
    clearGpuLayers();

    // 2. Ensure hero background video continues seamless playback
    try {
      const hv = heroVideo();
      if (hv && hv.paused) {
        const p = hv.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    } catch {}

    // 3. Release scroll lock
    releaseScroll();

    // 4. Set dataset.intro to "done" and dispatch notification event
    if (typeof document !== "undefined") {
      document.documentElement.dataset.intro = "done";
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("recursive-intro-done"));
    }

    // 5. Hide and unmount overlay layer completely once HERO_ACTIVE is reached
    if (rootRef.current) {
      rootRef.current.style.pointerEvents = "none";
      rootRef.current.style.display = "none";
    }

    setIntroState("HERO_ACTIVE");

    // Refresh ScrollTrigger cleanly
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }, [clearGpuLayers, releaseScroll]);

  // Instant Skip Intro Handling
  const handleSkip = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    // 1. Instantly kill all ongoing RAF loops and tweens without lag
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    gsap.killTweensOf("*");

    // 2. Set camera container directly to base scale (1.0) and clear will-change
    try {
      const hvs = heroVideoScale();
      if (hvs) {
        hvs.style.transform = "scale(1.0) translate3d(0, 0, 0)";
        hvs.style.willChange = "auto";
        gsap.set(hvs, { clearProps: "transform,willChange" });
      }
    } catch {}

    // 3. Ensure hero video playback
    try {
      const hv = heroVideo();
      if (hv && hv.paused) {
        hv.play().catch(() => {});
      }
    } catch {}

    // 4. Set opacity to final values & unmount/hide overlay
    if (rootRef.current) {
      rootRef.current.style.pointerEvents = "none";
      rootRef.current.style.opacity = "0";
      rootRef.current.style.display = "none";
    }

    // 5. Release scroll lock immediately
    releaseScroll();

    // 6. Set data-intro="done" and dispatch completion event
    if (typeof document !== "undefined") {
      document.documentElement.dataset.intro = "done";
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("recursive-intro-done"));
    }

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    // 7. Jump directly to HERO_ACTIVE without lag
    setIntroState("HERO_ACTIVE");

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [releaseScroll]);

  // ── Pass 1: Lifecycle Decision Gate ──────────────────────────────────────
  useLayoutEffect(() => {
    if (doneRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro");

    let isInternalAnchorNav = false;
    let hasHash = false;
    try {
      if (typeof window !== "undefined") {
        isInternalAnchorNav = Boolean(sessionStorage.getItem("recursive:skip-intro-for-anchor"));
        hasHash = Boolean(window.location.hash && window.location.hash !== "#");
      }
    } catch {}

    // Skip condition check
    if (force === "0" || (force !== "1" && (isInternalAnchorNav || hasHash))) {
      doneRef.current = true;
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          try { sessionStorage.removeItem("recursive:skip-intro-for-anchor"); } catch {}
        }, 2000);
      }
      if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
      setIntroState("HERO_ACTIVE");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    if (!REPLAY_EVERY_LOAD) {
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}
    }

    if (force !== "1" && (reduce || seen)) {
      doneRef.current = true;
      if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
      setIntroState("HERO_ACTIVE");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }
      return;
    }

    // Sequence proceeds: IDLE -> LOGO
    if (typeof document !== "undefined") document.documentElement.dataset.intro = "playing";
    setIntroState("LOGO");
  }, []);

  // ── Pass 2: Sequence Execution Pipeline ─────────────────────────────────
  useLayoutEffect(() => {
    if (introState === "IDLE" || introState === "HERO_ACTIVE") return;

    const root = rootRef.current;
    const overlay = overlayRef.current;
    const branding = brandingRef.current;
    const bar = barRef.current;
    const progressWrap = progressWrapRef.current;
    const skipWrap = skipRef.current;
    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!root || !overlay) return;

    // Preserve scroll restoration setting
    const prevRestoration = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {}

    // Synchronously lock scroll and position at top
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 860);

    if (isTouch) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    window.scrollTo(0, 0);

    // Stop Lenis during sequence
    let lenisHooked = false;
    let lenisRaf = 0;
    const hookLenis = () => {
      const l = getLenis();
      if (l) {
        l.stop();
        l.scrollTo(0, { immediate: true, force: true });
        lenisHooked = true;
        return;
      }
      lenisRaf = requestAnimationFrame(hookLenis);
    };
    if (!isTouch) hookLenis();

    // Prevent default wheel and touch scrolling during intro
    const block = (e: Event) => e.preventDefault();
    root.addEventListener("wheel", block, { passive: false });
    root.addEventListener("touchmove", block, { passive: false });

    const blockKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", blockKeys, { passive: false });

    // Isolate 3D/video canvas into its own GPU composite layer
    const hvs = heroVideoScale();
    if (hvs) {
      hvs.style.willChange = "transform";
      hvs.style.transformOrigin = "50% 52%";
      hvs.style.transform = "scale(1.12) translate3d(0, 0, 0)";
    }

    // Ensure hero video is buffered and playing
    const hv = heroVideo();
    if (hv && hv.paused) {
      hv.play().catch(() => {});
    }

    // Build the master animation timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { force3D: true },
        onComplete: finish,
      });
      tlRef.current = tl;

      // ── Stage 1: Phase 1 (Logo Entry) ──────────────────────────────────
      // Fade in branding smoothly, hold briefly, fade out cleanly.
      // Animate ONLY composite-only properties (opacity and transform).
      if (branding) {
        tl.set(branding, { opacity: 0, y: 14, display: "flex" }, 0);
        tl.to(
          branding,
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
          0.1
        );
        // Hold briefly
        tl.to(
          branding,
          { opacity: 0, y: -10, duration: 0.45, ease: "power2.in" },
          1.55
        );
        // Clean up branding: toggle display: none so it consumes 0 GPU/layout resources
        tl.call(
          () => {
            if (branding) branding.style.display = "none";
            setIntroState("INTRO_TEXT");
          },
          undefined,
          2.05
        );
      }

      // Show Skip button with smooth composite fade
      if (skipWrap) {
        tl.fromTo(
          skipWrap,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.6
        );
      }

      // ── Stage 2: Phase 2 (Dialogue Sequence) ───────────────────────────
      // Subtitles over darkened scene; camera position locked at scale(1.12)
      // with zero movement to conserve GPU bandwidth during dialogue.
      // Text Overlap Cleanup: unmount/toggle display: none for outgoing text
      // before triggering the next subtitle.
      let currentTime = 2.15;
      const dialogueStartTime = currentTime;

      lines.forEach((lineEl, i) => {
        const item = LINES[i];
        const enterDur = 0.35;
        const holdDur = item.holdDuration;
        const exitDur = 0.26;
        const gap = 0.08;

        const enterTime = currentTime;
        const exitTime = enterTime + enterDur + holdDur;

        // Ensure display: flex right before this subtitle enters
        tl.call(
          () => {
            lineEl.style.display = "flex";
          },
          undefined,
          enterTime
        );

        // Animate subtitle in (composite transform + opacity only)
        tl.fromTo(
          lineEl,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: enterDur, ease: "power2.out" },
          enterTime
        );

        // Animate subtitle out
        tl.to(
          lineEl,
          { opacity: 0, y: -8, duration: exitDur, ease: "power2.in" },
          exitTime
        );

        // DOM thrashing / ghosting prevention: Immediately set display: none on completion
        tl.call(
          () => {
            lineEl.style.display = "none";
          },
          undefined,
          exitTime + exitDur
        );

        currentTime = exitTime + exitDur + gap;
      });

      const dialogueEndTime = currentTime;
      const dialogueDuration = dialogueEndTime - dialogueStartTime;

      // Progress bar fill tracking dialogue progression
      if (bar) {
        tl.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: dialogueDuration, ease: "none" },
          dialogueStartTime
        );
      }

      // Hide progress bar and skip button before cinematic reveal
      if (progressWrap) {
        tl.to(
          progressWrap,
          { opacity: 0, duration: 0.25, ease: "power1.out" },
          dialogueEndTime - 0.2
        );
      }
      if (skipWrap) {
        tl.to(
          skipWrap,
          { opacity: 0, y: 6, duration: 0.3, ease: "power2.in" },
          dialogueEndTime - 0.2
        );
      }

      // ── Stage 3: Phase 3 (Hardware-Accelerated Cinematic Reveal) ───────
      // * Lift the dark overlay using an opacity fade (opacity: 1 -> 0).
      // * Transition camera/canvas container from zoomed scale (1.12) to
      //   base scale (1.0) using gentle ease-out (cubic-bezier(0.25, 1, 0.5, 1)
      //   over ~1.4s).
      // * Do NOT re-render grass shaders or high-cost post-processing during this scale transition.
      const revealStart = dialogueEndTime;
      const revealDuration = 1.4;

      tl.call(
        () => {
          setIntroState("CINEMATIC_REVEAL");
        },
        undefined,
        revealStart
      );

      // 1. Lift dark overlay using pure opacity fade
      tl.to(
        overlay,
        { opacity: 0, duration: revealDuration, ease: "power2.inOut" },
        revealStart
      );

      // 2. Camera zoom-out from scale(1.12) to scale(1.0) with cubic-bezier(0.25, 1, 0.5, 1)
      if (hvs) {
        tl.to(
          hvs,
          {
            scale: 1.0,
            duration: revealDuration,
            ease: "cinematicRevealEase",
            force3D: true,
            transformOrigin: "50% 52%",
          },
          revealStart
        );
      }

      // ── Stage 4: Phase 4 (Hero UI Mount) ───────────────────────────────
      // Once the zoom-out settles, finish() is called to mount hero UI
      // and remove will-change GPU allocation.
      tl.call(
        () => {
          finish();
        },
        undefined,
        revealStart + revealDuration
      );
    }, root);

    // Watchdog timer: prevents freeze if tab suspended or timeline stalls
    let lastProgress = -1;
    let lastTime = performance.now();
    const watchdog = window.setInterval(() => {
      if (doneRef.current) {
        window.clearInterval(watchdog);
        return;
      }
      const tl = tlRef.current;
      if (!tl) return;

      const progress = tl.progress();
      const now = performance.now();
      if (progress !== lastProgress || document.hidden || tl.paused()) {
        lastProgress = progress;
        lastTime = now;
        return;
      }
      if (now - lastTime > 2500) {
        window.clearInterval(watchdog);
        finish();
      }
    }, 500);

    return () => {
      window.clearInterval(watchdog);
      root.removeEventListener("wheel", block);
      root.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
      cancelAnimationFrame(lenisRaf);
      if (lenisHooked && !doneRef.current) {
        getLenis()?.start();
      }
      try {
        history.scrollRestoration = prevRestoration;
      } catch {}
      ctx.revert();
      clearGpuLayers();
      tlRef.current = null;
    };
  }, [introState, finish, clearGpuLayers]);

  // Teardown: Unmount overlay completely once HERO_ACTIVE is reached
  if (introState === "HERO_ACTIVE") return null;

  // SSR / Pre-hydration Dark Pending Plate
  if (introState === "IDLE") {
    return (
      <div
        aria-hidden="true"
        className="intro-pending-plate"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100%",
          minHeight: "100dvh",
          zIndex: 9999,
          overflow: "hidden",
          background:
            "radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.48) 0%, rgba(52, 88, 38, 0) 62%), linear-gradient(180deg, #0A160A 0%, #010301 65%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "clamp(210px, 30vw, 360px)",
            aspectRatio: "744 / 220",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <img
            src="/images/ui/artifact.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "brightness(1.2) saturate(1.15) drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65))",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="intro-root"
      role="dialog"
      aria-label="Intro"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        zIndex: 9999,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      {/* Dark Overlay — Lifted in Phase 3 via composite opacity fade */}
      <div
        ref={overlayRef}
        className="intro-dark-overlay"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
          opacity: 1,
          willChange: "opacity",
          background:
            "radial-gradient(65% 55% at 50% 52%, rgba(4, 10, 6, 0.35) 0%, rgba(2, 7, 4, 0.8) 40%, rgba(1, 3, 1, 0.98) 78%, #010301 100%), linear-gradient(180deg, rgba(1, 4, 2, 0.96) 0%, rgba(2, 6, 3, 0.6) 45%, rgba(1, 2, 1, 0.98) 100%)",
        }}
      />

      {/* Phase 1: Logo / Branding Lockup */}
      <div
        ref={brandingRef}
        className="intro-branding-container"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 1.5rem",
          pointerEvents: "none",
          opacity: 0,
          transform: "translate3d(0, 14px, 0)",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="intro-artifact-mark"
          style={{
            position: "relative",
            width: "clamp(210px, 30vw, 360px)",
            aspectRatio: "744 / 220",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className="intro-artifact-aura"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-25% -20%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(143, 196, 90, 0.24) 0%, rgba(76, 133, 46, 0.06) 50%, transparent 72%)",
              filter: "blur(28px)",
              pointerEvents: "none",
            }}
          />
          <img
            src="/images/ui/artifact.png"
            alt="Recursive Artifact"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "brightness(1.2) saturate(1.15) drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65))",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>

        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display), var(--font-heading), var(--font-dm-sans), sans-serif",
              fontSize: "clamp(2rem, 5.4vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              color: "#ffffff",
              textShadow: "0 4px 28px rgba(0, 0, 0, 0.7)",
            }}
          >
            Hi There, Hackers!
          </h1>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace), monospace",
              fontSize: "clamp(0.72rem, 1.4vw, 0.86rem)",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.75)",
              textShadow: "0 0 16px rgba(120, 185, 75, 0.4)",
              marginTop: "8px",
            }}
          >
            RECURSIVE 2026
          </span>
        </div>
      </div>

      {/* Phase 2: Dialogue Subtitles (Each outgoing line is set to display: none) */}
      <div
        className="intro-captions"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        {LINES.map((line, i) => (
          <div
            key={i}
            className="intro-line"
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              inset: 0,
              display: "none", // Toggled to flex exclusively while active
              alignItems: "center",
              justifyContent: "center",
              padding: "0 clamp(1.5rem, 6vw, 6rem)",
              paddingBottom: "clamp(1.5rem, 5vh, 4rem)",
              opacity: 0,
              transform: "translate3d(0, 12px, 0)",
              willChange: "transform, opacity",
            }}
          >
            <p
              className="intro-line-text"
              style={{
                margin: 0,
                width: "100%",
                maxWidth: "clamp(22ch, 75vw, 36ch)",
                textAlign: "center",
                fontFamily: "var(--font-display), var(--font-dm-sans), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4.2vw, 3.6rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "#eef3e8",
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.6)",
              }}
            >
              {line.words.map((w, j) => {
                const isAccent = line.accent === w;
                return (
                  <span
                    key={j}
                    style={{
                      display: "inline-block",
                      margin: "0 0.24em 0.12em 0",
                      color: isAccent ? "#a6e06a" : "inherit",
                      textShadow: isAccent ? "0 0 16px rgba(143, 196, 90, 0.45)" : undefined,
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div
        ref={progressWrapRef}
        className="intro-progress"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "2px",
          zIndex: 25,
          background: "rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
        }}
      >
        <div
          ref={barRef}
          className="intro-progress-fill"
          style={{
            height: "100%",
            width: "100%",
            transform: "scaleX(0)",
            transformOrigin: "left center",
            background: "linear-gradient(90deg, #5c8c3a, #a6e06a)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Skip Intro Button: instantly kills loops and jumps directly to HERO_ACTIVE */}
      <div
        ref={skipRef}
        className="intro-skip-wrap"
        style={{
          position: "absolute",
          right: "clamp(1.2rem, 3.2vw, 3rem)",
          bottom: "clamp(1.2rem, 3.5vh, 3rem)",
          zIndex: 30,
          pointerEvents: "auto",
          willChange: "transform, opacity",
        }}
      >
        <button
          type="button"
          className="intro-skip-btn"
          onClick={handleSkip}
          aria-label="Skip Intro"
        >
          <span>Skip intro</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            style={{ transform: "translateY(0.5px)" }}
          >
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <style href="intro-styles" precedence="default" suppressHydrationWarning>{`
        .intro-skip-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.15rem;
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #f3f8ee;
          background: rgba(14, 26, 15, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          pointer-events: auto;
          transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease;
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        }
        .intro-skip-btn:hover {
          background: rgba(24, 44, 24, 0.9);
          border-color: rgba(166, 224, 106, 0.45);
          transform: translate3d(0, -1px, 0);
        }
        .intro-skip-btn:active {
          transform: translate3d(0, 0, 0) scale(0.97);
        }

        @media (max-width: 767px) {
          .intro-line-text {
            max-width: 20ch !important;
            font-size: clamp(1.65rem, 5.8vw, 2.3rem) !important;
            line-height: 1.16 !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-root { display: none !important; }
        }
      `}</style>
    </div>
  );
}
