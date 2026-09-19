"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { getLenis } from "@/lib/lenis";
import { prefersLiteMedia } from "@/lib/device";

gsap.registerPlugin(ScrollTrigger);

/**
 * INTRO SEQUENCE — a ~9s cinematic cold-open that hands off to <Hero />.
 *
 * The story climbs from "the bottom" to the chair on the hill: the same
 * hero_bg.mp4 plate starts dark, low, pushed-in and out of focus, then racks
 * to sharp and lifts to the exact grade + framing the hero renders at.
 *
 * The story lines carry the site's signature warp — a pointer-reactive lens
 * with chromatic split, the same character as the RECURSIVE wordmark's WebGL.
 *
 * The hand-off is frame-synced, not just cross-faded: just before the cut the
 * hero's own looping <video> is seeked to this one's currentTime (hidden behind
 * the still-opaque scene). A soft dawn glow then rises over the seam while the
 * story scene dissolves away.
 *
 * Scroll is held with Lenis (`lenis.stop()`), not an overflow hack, and released
 * with `lenis.scrollTo(0, { immediate: true })` so the page is already smoothed
 * the instant the hero appears. Every tween runs GPU-only off GSAP's ticker —
 * the same clock Lenis is pumped from — so nothing contends for frames.
 *
 * Plays on every load of "/" (see REPLAY_EVERY_LOAD). Respects
 * prefers-reduced-motion. Force-play with ?intro=1, force-skip with ?intro=0.
 */

const SEEN_KEY = "recursive:intro:v1";

/**
 * true  → the cold-open plays on every full page load.
 * false → plays only once per tab session (sessionStorage-gated).
 * Flip to false before shipping if a per-visit replay feels like too much.
 */
const REPLAY_EVERY_LOAD = true;

type Line = { words: string[]; accent?: string };

const LINES: Line[] = [
  { words: ["Welcome", "to", "the", "bottom."] },
  { words: ["Do", "you", "know", "what's", "at", "the", "top?"] },
  { words: ["Yep.", "A", "single", "plastic", "chair."] },
  {
    words: ["Hundreds", "of", "hackers…", "but", "only", "ONE", "team", "gets", "to", "sit."],
    accent: "ONE",
  },
  { words: ["So", "here's", "the", "dare:", "can", "you", "conquer", "it?"] },
  { words: ["Let's", "find", "out."] },
];

// [enter, exit] in seconds. Short lines read fast; line 4 (the long one) gets
// extra room. Exits are quick and accelerate away, so the outgoing line is
// essentially gone by the time the next one starts — no smear between beats.
const CUES: [number, number][] = [
  [4.1, 5.05],
  [5.25, 6.2],
  [6.4, 7.5],
  [7.75, 9.45],
  [9.7, 10.75],
  [10.95, 11.95],
];

const WARP_RADIUS = 250;

/**
 * `overflow: hidden` on <html> removes the classic scrollbar, which widens the
 * layout viewport and re-crops every `object-fit: cover` plate — a visible zoom
 * + sideways slide when the lock is taken and again when it is released.
 *
 * globals.css reserves the gutter permanently with `scrollbar-gutter: stable`,
 * which makes the lock free. Where that is unsupported (Safari < 18.2) we skip
 * the overflow lock entirely and let Lenis + the event blockers hold scroll —
 * a dragged scrollbar is a far smaller sin than a jumping hero.
 */
const GUTTER_STABLE =
  typeof CSS !== "undefined" && typeof CSS.supports === "function"
    ? CSS.supports("scrollbar-gutter", "stable")
    : false;

/** Keys the browser scrolls with; Lenis does not intercept these. */
const SCROLL_KEYS = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
]);

export default function IntroSequence() {
  const [phase, setPhase] = useState<"pending" | "playing" | "done">("pending");
  // Video plate enabled on all devices so grass animates during intro
  const [liteMedia, setLiteMedia] = useState(false);
  // The skip button is shader-backed. Its wrapper is always mounted -- the
  // timeline tweens it, and a null ref would silently drop those tweens -- but
  // the button itself waits. Mounted with the scene, it put a WebGL context
  // creation and a shader compile on the intro's opening frames, alongside the
  // first video decode and the first paint: the single worst moment to spend
  // several hundred synchronous milliseconds, and the cost swings with whether
  // the shader cache is warm, which is exactly the shape of an intermittent
  // freeze. It is invisible until the 1.0s fade-in anyway.
  const [showChrome, setShowChrome] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLDivElement>(null);
  const loaderOverlayRef = useRef<HTMLDivElement>(null);
  const artifactMarkRef = useRef<HTMLDivElement>(null);
  const welcomeBlockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const bailRef = useRef<(() => void) | null>(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    if (GUTTER_STABLE) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    // Resume the hero's plate — it was frozen for the crossfade so the two
    // videos could not drift. It picks up from the exact frame it held.
    try {
      const hv = document.querySelector<HTMLVideoElement>("video.hero-video");
      const p = hv?.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}

    // Release the scroll through Lenis so the hero arrives already smoothed,
    // pinned to the top with no jump.
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    } else {
      window.scrollTo(0, 0);
    }

    if (typeof document !== "undefined") {
      document.documentElement.dataset.intro = "done";
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("recursive-intro-done"));
    }

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }).requestIdleCallback;

    // Two separate costs, so they get two separate idle slots. Unmounting the
    // intro subtree (a video plus WebGL canvases) and refreshing every
    // ScrollTrigger on a 12,000px page each take most of a frame; run together
    // they drop two in a row exactly where the user takes over scrolling.
    const scrollHome = () => {
      const l = getLenis();
      if (l) l.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };

    const refreshTriggers = () => {
      scrollHome();
      ScrollTrigger.refresh();
    };

    const unmount = () => {
      setPhase("done");
      // Give the compositor a frame to settle after the subtree goes before
      // asking every trigger to re-measure.
      if (typeof ric === "function") ric(refreshTriggers, { timeout: 1500 });
      else window.setTimeout(refreshTriggers, 600);
    };

    if (typeof ric === "function") ric(unmount, { timeout: 1200 });
    else window.setTimeout(unmount, 500);
  }, []);

  const skip = useCallback(() => {
    // A graceful bail defined inside the effect (it needs the scene refs); this
    // just triggers it. Never a whole-timeline fast-forward — that flickers
    // every beat past in half a second.
    if (bailRef.current) bailRef.current();
    else finish();
  }, [finish]);

  useEffect(() => {
    if (phase !== "playing") return;
    // 1.4s, not 0.9s: the hero's WarpText compiles its shader at ~0.8s (see
    // that file), and stacking a second compile 100ms later put both on the
    // artifact's awakening. The button's own fade-in is at 1.6s, after this.
    const t = window.setTimeout(() => setShowChrome(true), 1400);
    return () => window.clearTimeout(t);
  }, [phase]);

  // ── Pass 1: decide ──────────────────────────────────────────────────────
  // Runs before paint. Until it resolves, the component renders a bare dark
  // plate (see the "pending" branch below), so the hero never flashes.
  useLayoutEffect(() => {
    if (doneRef.current) return;
    setLiteMedia(false);
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

    // On page reload of "/" without an anchor, the intro plays.
    // When navigating to an anchor (e.g. clicking "Back to all tracks"), skip intro immediately.
    if (force === "0" || (force !== "1" && (isInternalAnchorNav || hasHash))) {
      doneRef.current = true;
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          try { sessionStorage.removeItem("recursive:skip-intro-for-anchor"); } catch {}
        }, 2000);
      }
      if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
      setPhase("done");
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
      setPhase("done");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }
      return;
    }

    if (typeof document !== "undefined") document.documentElement.dataset.intro = "playing";
    setPhase("playing");
  }, []);

  // ── Pass 2: build ───────────────────────────────────────────────────────
  // Runs only once "playing" has committed, so every ref below is populated.
  useLayoutEffect(() => {
    if (phase !== "playing") return;

    const root = rootRef.current;
    const scene = sceneRef.current;
    const media = mediaRef.current;
    const focus = focusRef.current;
    const grade = gradeRef.current;
    const bloom = bloomRef.current;
    const bar = barRef.current;
    const skipWrap = skipRef.current;
    const loaderOverlay = loaderOverlayRef.current;
    const artifactMark = artifactMarkRef.current;
    const welcomeBlock = welcomeBlockRef.current;
    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!root || !scene || !media || !focus || !grade || !bloom || !bar) return;

    const prevRestoration = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {}
    // Belt-and-suspenders lock for the frame before Lenis is reachable. Only
    // safe when the scrollbar gutter is reserved — see GUTTER_STABLE.
    //
    // On touch devices this lock does a second, more important job: a page
    // that cannot scroll is a page whose browser toolbar stays put. The intro
    // root and scene are sized in dvh, so a toolbar that shows and hides on a
    // touch gesture resizes every full-bleed layer and re-crops the plate --
    // which on a phone reads as the whole intro shaking. (I removed the lock
    // on touch once as "insurance" against a relayout at the hand-off; that
    // relayout never happens -- overlay scrollbars have no width -- and the
    // shaking it let in was worse than the thing it guarded against.)
    const lockOverflow = GUTTER_STABLE;
    if (lockOverflow) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    window.scrollTo(0, 0);

    const heroVideo = () =>
      document.querySelector<HTMLVideoElement>("video.hero-video");
    const heroMediaTargets = () =>
      document.querySelectorAll<HTMLElement>("#hero .hero-video");

    const onTouchKick = () => {
      const hv = heroVideo();
      if (hv && hv.paused && !doneRef.current) {
        hv.play().catch(() => {});
      }
    };
    window.addEventListener("touchstart", onTouchKick, { passive: true });

    let cleanupVidListeners: (() => void) | null = () => {
      window.removeEventListener("touchstart", onTouchKick);
    };

    // Hold the scroll through Lenis. <SmoothScroll> mounts after this layout
    // effect, so the instance can be a frame or two late — retry briefly.
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 860);

    let lenisHooked = false;
    let lenisRaf = 0;
    const grabLenis = () => {
      const l = getLenis();
      if (l) {
        l.stop();
        l.scrollTo(0, { immediate: true, force: true });
        lenisHooked = true;
        return;
      }
      lenisRaf = requestAnimationFrame(grabLenis);
    };
    if (!isTouch) grabLenis();
    const onLenisReady = () => {
      if (!isTouch) grabLenis();
    };
    window.addEventListener("lenis:ready", onLenisReady);

    const block = (e: Event) => e.preventDefault();
    root.addEventListener("wheel", block, { passive: false });
    root.addEventListener("touchmove", block, { passive: false });

    // Keyboard scroll is not routed through Lenis, so hold it here too.
    const blockKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", blockKeys, { passive: false });

    const isMobileDevice = isTouch || liteMedia || prefersLiteMedia();

    // Give scroll back the moment the scene is gone rather than at the end of
    // the bloom. finish() cannot be brought forward for this because it also
    // sets phase to "done", and the component returns null in that phase.
    let released = false;
    const releaseScroll = () => {
      if (released || doneRef.current) return;
      released = true;
      if (lockOverflow) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
      const l = getLenis();
      if (l) {
        l.scrollTo(0, { immediate: true, force: true });
        l.start();
      } else {
        window.scrollTo(0, 0);
      }
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", force3D: true },
        smoothChildTiming: true,
        paused: true, // held until the warm-start gate below
        onComplete: finish,
      });
      tlRef.current = tl;

      const isLite = liteMedia || prefersLiteMedia();

      tl.set(root, { autoAlpha: 1 });
      tl.set(scene, { opacity: 1 }, 0);

      const isWideScreen = typeof window !== "undefined" && window.innerWidth >= 768;
      // On desktop, tablet, and widescreen devices, scale at 1.07 and yPercent at -3.2%
      // so the hill crest and plastic chair fit naturally in frame without aggressive cropping.
      const initialScale = isWideScreen ? 1.07 : 1.12;
      const initialYPercent = isWideScreen ? -3.2 : -5;

      // Pin media to starting transform immediately before paint
      const hm = heroMediaTargets();
      if (hm.length > 0) {
        gsap.set(hm, {
          scale: initialScale,
          yPercent: initialYPercent,
          transformOrigin: "center center",
          force3D: true,
        });
      }
      gsap.set(media, {
        scale: initialScale,
        yPercent: initialYPercent,
        transformOrigin: "center center",
        force3D: true,
      });

      // ── Stage 1 & 2: Artifact & Welcome Cascade ──
      if (loaderOverlay && artifactMark && welcomeBlock) {
        tl.set(loaderOverlay, { autoAlpha: 1 }, 0);
        tl.set(welcomeBlock, { opacity: 0, pointerEvents: "none" }, 0);

        const welcomeWordInners = Array.from(
          welcomeBlock.querySelectorAll<HTMLElement>(".intro-welcome-word-i"),
        );
        const welcomeSub = welcomeBlock.querySelector<HTMLElement>(".intro-welcome-sub");

        // Every tween in this stage is opacity or transform -- nothing else.
        //
        // This stage used to animate `filter` (a 32px drop-shadow, i.e. a
        // gaussian blur, on the artifact; blur() on every welcome word, in and
        // out; blur() on the whole mark on exit), `clip-path`, and
        // `letter-spacing`. Each of those is re-rasterised or re-laid-out on
        // every frame it changes, and they all ran together in the first four
        // seconds -- on top of hydration, the first video decode and the hero's
        // WebGL init. A single letter-spacing tween measured ~0.94ms of layout
        // per frame on a desktop, 31x the transform that replaces it; phones
        // are several times slower again. This is what "the artifact stutters
        // on load" was.
        //
        // The look survives: the wings unfurl on scaleX, the glow is the aura
        // (a static blur, rasterised once, moved on the compositor), the
        // tracking expansion is a scaleX, and the blur-to-focus reads the same
        // as a short opacity + lift at this duration.
        if (welcomeWordInners.length > 0) {
          tl.set(welcomeWordInners, { opacity: 0, y: 18 }, 0);
        }
        if (welcomeSub) {
          tl.set(welcomeSub, { opacity: 0, y: 10, scaleX: 0.9 }, 0);
        }

        const artifactImg = artifactMark.querySelector<HTMLElement>(".intro-artifact-img");
        const artifactAura = artifactMark.querySelector<HTMLElement>(".intro-artifact-aura");

        // Pin starting states synchronously BEFORE paint — eliminates any 1-frame jitter or pop
        gsap.set(artifactMark, { y: 0, opacity: 1, force3D: true });
        if (welcomeWordInners.length > 0) {
          gsap.set(welcomeWordInners, { opacity: 0, y: 18 });
        }
        if (welcomeSub) {
          gsap.set(welcomeSub, { opacity: 0, y: 10, scaleX: 0.9, transformOrigin: "center center" });
        }
        if (artifactImg) {
          // Continue exactly from the held state on the two plates before
          // this one. The pending plate's copy sat at opacity 1 / scale 1 and
          // this one must paint identically on its first frame, or the swap
          // shows as a flicker.
          gsap.set(artifactImg, {
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            transformOrigin: "center center",
            force3D: true,
          });
        }
        if (artifactAura) {
          gsap.set(artifactAura, {
            scale: 0.35,
            opacity: 0,
            transformOrigin: "center center",
            force3D: true,
          });
        }

        // Stage 1: Relic Awakening.
        //
        // This was a center-out unfurl from scaleX 0.28 / opacity 0. But the
        // mark has already been on screen for the whole load -- breathing on
        // the loading veil, held on the pending plate -- so entering it again
        // from nothing was the pop the visitor saw. It now wakes in place: one
        // slow breath as the aura blooms behind it, which is the emergence
        // beat the unfurl was carrying. Opacity and transform only.
        if (artifactImg) {
          tl.to(
            artifactImg,
            { scale: 1.035, duration: 0.55, ease: "sine.out" },
            0.05,
          );
          tl.to(
            artifactImg,
            { scale: 1, duration: 0.6, ease: "sine.inOut" },
            0.6,
          );
        } else {
          tl.fromTo(
            artifactMark,
            { opacity: 0, scale: 0.94, y: 16 },
            { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out" },
            0.05,
          );
        }

        // Luminous emerald aura expands smoothly from the core
        if (artifactAura) {
          tl.to(
            artifactAura,
            {
              scale: 1.25,
              opacity: 1,
              duration: 0.65,
              ease: "power2.out",
            },
            0.05,
          );
          tl.to(
            artifactAura,
            { scale: 1, opacity: 0.8, duration: 0.45, ease: "sine.out" },
            0.7,
          );
        }

        // Stage 2: Gentle continuous upward drift into crown position as wings settle
        tl.to(
          artifactMark,
          {
            y: isMobileDevice ? -20 : -32,
            duration: 0.85,
            ease: "sine.inOut",
          },
          1.1,
        );

        // "Hi There, Hackers!" word-level upward lift and blur-to-focus fade-in
        tl.set(welcomeBlock, { opacity: 1, pointerEvents: "auto" }, 1.15);
        if (welcomeWordInners.length > 0) {
          tl.to(
            welcomeWordInners,
            {
              opacity: 1,
              y: 0,
              duration: 0.68,
              ease: "power3.out",
              stagger: 0.09,
            },
            1.18,
          );
        }

        // "RECURSIVE 2026" slides in; the tracking expansion is a scaleX from
        // 0.9, which reads identically and stays on the compositor. The final
        // letter-spacing lives in the stylesheet.
        if (welcomeSub) {
          tl.to(
            welcomeSub,
            {
              opacity: 1,
              y: 0,
              scaleX: 1,
              duration: 0.65,
              ease: "power2.out",
            },
            1.48,
          );
        }

        // Holding drift: Gentle, ambient float of the complete greeting lockup
        tl.to(
          [artifactMark, welcomeBlock],
          {
            y: "-=5",
            duration: 1.1,
            ease: "sine.inOut",
          },
          2.0,
        );

        // Transition: Welcome words & artifact ease out with upward drift (matching intro lines exit)
        if (welcomeWordInners.length > 0) {
          tl.to(
            welcomeWordInners,
            {
              opacity: 0,
              y: -14,
              duration: 0.45,
              ease: "power2.in",
              stagger: 0.03,
            },
            3.05,
          );
        }
        if (welcomeSub) {
          tl.to(
            welcomeSub,
            { opacity: 0, y: -8, duration: 0.4, ease: "power2.in" },
            3.08,
          );
        }
        // The mark's exit was a blur(8px) tween on a container holding a
        // blur(28px) aura and a drop-shadowed image: nested filters, all
        // re-rasterised together every frame. It was the most expensive half
        // second of the whole intro. A slight shrink under the fade gives the
        // same softening.
        tl.to(
          artifactMark,
          {
            opacity: 0,
            y: "-=12",
            scale: 0.96,
            duration: 0.5,
            ease: "power2.in",
          },
          3.1,
        );

        // Fade in animation to intro start: Veil smoothly dissolves into cinematic climbing scene
        tl.to(
          loaderOverlay,
          { autoAlpha: 0, duration: 0.85, ease: "power2.inOut" },
          3.25,
        );
      }

      // Start the plate 0.35s before the veil begins to lift (3.25s) and 1.2s
      // before it is gone.
      tl.call(
        () => {
          const heroVid = heroVideo();
          if (!heroVid || doneRef.current) return;
          try {
            if (heroVid.currentTime > 0.05) heroVid.currentTime = 0;
          } catch {}
          const p = heroVid.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        },
        undefined,
        2.9,
      );

      // ── Stage 3: Slowly the intro story animation starts ──
      tl.to(
        heroMediaTargets(),
        {
          scale: 1,
          yPercent: 0,
          duration: 8.5,
          ease: "sine.inOut",
          onComplete: () => {
            const hm = heroMediaTargets();
            if (hm.length > 0) {
              gsap.set(hm, { clearProps: "transform" });
            }
          },
        },
        3.7,
      );
      tl.to(
        media,
        { scale: 1, yPercent: 0, duration: 8.5, ease: "sine.inOut" },
        3.7,
      );

      tl.fromTo(grade, { opacity: 1 }, { opacity: 0, duration: 7.6, ease: "sine.inOut" }, 3.8);
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 8.2, ease: "none" }, 3.9);

      lines.forEach((el, i) => {
        const [tin, tout] = CUES[i];
        const words = Array.from(el.querySelectorAll<HTMLElement>(".intro-word"));
        if (words.length === 0) return;

        tl.fromTo(
          words,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: "power3.out",
            stagger: 0.036,
          },
          tin,
        );
        if (i < lines.length - 1) {
          tl.to(
            words,
            {
              opacity: 0,
              y: -12,
              duration: 0.34,
              ease: "power2.in",
              stagger: 0.018,
            },
            tout,
          );
        }
      });

      if (skipWrap) {
        // Fades in at 1.6s, after the button has mounted at 1.4s.
        tl.fromTo(
          skipWrap,
          { opacity: 0, y: 10, pointerEvents: "none" },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", pointerEvents: "auto" },
          1.6,
        );
        // Cleanly dismiss BEFORE hero page transition so it never lingers after transition
        tl.to(
          skipWrap,
          { opacity: 0, y: 8, duration: 0.35, ease: "power2.in", pointerEvents: "none" },
          11.5,
        );
      }

      // ── Hand-off ──────────────────────────────────────────────────────────
      // 2. Last line eases out on its own with soft deceleration
      if (lines.length > 0) {
        const lastWords = Array.from(lines[lines.length - 1].querySelectorAll<HTMLElement>(".intro-word"));
        if (lastWords.length > 0) {
          tl.to(
            lastWords,
            { opacity: 0, y: -12, scale: 0.98, duration: 0.58, ease: "power2.inOut", stagger: 0.024 },
            11.9,
          );
        }
      }

      // 3. A soft dawn glow rises from the hill line, then recedes.
      tl.fromTo(
        bloom,
        { opacity: 0, scale: 1.05 },
        { opacity: isMobileDevice ? 0.35 : 0.45, scale: 1, duration: 0.75, ease: "sine.out" },
        12.0,
      );

      // Hand off to Hero: single unified video plate continues uninterrupted at 60fps
      const handoffTime = 12.15;
      const dissolveStart = 12.2;
      const dissolveDuration = 0.75;

      tl.call(() => {
        gsap.set(root, { background: "transparent" });
        if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }, undefined, handoffTime);

      tl.to(scene, { autoAlpha: 0, duration: dissolveDuration, ease: "power1.inOut" }, dissolveStart);

      tl.set(root, { pointerEvents: "none" }, dissolveStart + 0.15);
      tl.call(releaseScroll, undefined, dissolveStart + dissolveDuration + 0.05);

      // 5. Glow recedes over the settled landing page with buttery smooth sine ease
      tl.to(bloom, { opacity: 0, scale: 1.04, duration: 0.85, ease: "sine.inOut" }, dissolveStart + dissolveDuration);
    }, root);

    const tl = tlRef.current!;

    // ── Synchronous start ──
    // The timeline starts now; the plate starts from inside it at 2.9s (see
    // the tl.call above) rather than here, because nothing can see it for the
    // first three seconds.
    let started = false;
    const startNow = () => {
      if (started || doneRef.current) return;
      started = true;
      tl.play(0);
    };

    startNow();

    // ── Watchdog ──────────────────────────────────────────────────────────
    // The intro is a fixed, full-viewport overlay that holds scroll, so a stall
    // is not a cosmetic glitch: it is a page the visitor cannot use, with no
    // way out but a reload. The causes are all things that happen on real
    // phones and cannot be enumerated from here -- a decoder evicted under
    // memory pressure, a long GC, a compositor hiccup, a tab that came back
    // from the background in a strange state.
    //
    // So instead of guessing at causes, watch the only symptom that matters:
    // whether the timeline is still moving. A playing timeline advances every
    // single frame, so any wholly motionless stretch is already abnormal --
    // 2.5s of it is not a slow phone, it is a stuck one. Hand off when that
    // happens. A hard cut to the hero is a poor ending, but it is an ending.
    //
    // Two states are legitimately motionless and must not trip it: a
    // backgrounded tab (rAF is suspended by design) and a paused timeline
    // (the skip path pauses it to run its own outro).
    let lastProgress = -1;
    let lastMoved = performance.now();
    const watchdog = window.setInterval(() => {
      if (doneRef.current) {
        window.clearInterval(watchdog);
        return;
      }
      const now = performance.now();
      const progress = tl.progress();
      if (progress !== lastProgress || document.hidden || tl.paused()) {
        lastProgress = progress;
        lastMoved = now;
        return;
      }
      if (now - lastMoved > 2500) {
        window.clearInterval(watchdog);
        finish();
      }
    }, 500);

    // ── Graceful skip ─────────────────────────────────────────────────────
    let bailing = false;
    bailRef.current = () => {
      if (bailing || doneRef.current) return;
      bailing = true;
      started = true;
      tl.pause();

      const words = root.querySelectorAll<HTMLElement>(".intro-word");
      const wordInners = root.querySelectorAll<HTMLElement>(".intro-word-i");
      gsap.killTweensOf([scene, bloom, media, focus, grade, bar]);
      if (loaderOverlay) {
        gsap.killTweensOf([loaderOverlay, artifactMark, welcomeBlock]);
        const artImg = root.querySelector<HTMLElement>(".intro-artifact-img");
        const artAura = root.querySelector<HTMLElement>(".intro-artifact-aura");
        if (artImg) gsap.killTweensOf(artImg);
        if (artAura) gsap.killTweensOf(artAura);
      }
      const welcomeWordInners = root.querySelectorAll<HTMLElement>(".intro-welcome-word-i");
      const welcomeSub = root.querySelector<HTMLElement>(".intro-welcome-sub");
      if (welcomeWordInners.length > 0) gsap.killTweensOf(welcomeWordInners);
      if (welcomeSub) gsap.killTweensOf(welcomeSub);
      if (skipWrap) gsap.killTweensOf(skipWrap);
      gsap.killTweensOf(words);
      gsap.killTweensOf(wordInners);
      gsap.set(wordInners, { clearProps: "transform,textShadow" });

      const hm = heroMediaTargets();
      gsap.killTweensOf(hm);
      gsap.to(hm, {
        scale: 1,
        yPercent: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(hm, { clearProps: "transform" });
        },
      });

      const heroVid = heroVideo();
      if (heroVid && heroVid.paused) {
        heroVid.play().catch(() => {});
      }

      const q = gsap.timeline({ onComplete: finish });
      if (loaderOverlay) {
        q.to(loaderOverlay, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0);
      }
      if (skipWrap) {
        q.to(skipWrap, { opacity: 0, scale: 0.9, y: 6, duration: 0.22, ease: "power2.in", pointerEvents: "none" }, 0);
      }
      q.to(words, { autoAlpha: 0, yPercent: -14, duration: 0.28, ease: "power2.in" }, 0);
      q.to(
        media,
        { xPercent: 0, yPercent: 0, x: 0, y: 0, scale: 1, rotation: 0, duration: 0.6, ease: "sine.inOut" },
        0,
      );
      q.to(grade, { opacity: 0, duration: 0.6, ease: "sine.inOut" }, 0.04);
      q.fromTo(
        bloom,
        { opacity: 0, scale: 1.1 },
        { opacity: isMobileDevice ? 0.35 : 0.45, scale: 1, duration: 0.5, ease: "sine.out" },
        0.3,
      );
      q.call(
        () => {
          gsap.set(root, { background: "transparent" });
          if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
          if (typeof window !== "undefined")
            window.dispatchEvent(new CustomEvent("recursive-intro-done"));
        },
        undefined,
        0.4,
      );
      q.to(scene, { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" }, 0.66);
      q.set(root, { pointerEvents: "none" }, 1.0);
      q.call(releaseScroll, undefined, 1.26);
      q.to(bloom, { opacity: 0, scale: 1.04, duration: 0.65, ease: "sine.inOut" }, 1.05);
    };

    return () => {
      bailRef.current = null;
      root.removeEventListener("wheel", block);
      root.removeEventListener("touchmove", block);
      window.clearInterval(watchdog);
      window.removeEventListener("keydown", blockKeys);
      cleanupVidListeners?.();
      window.removeEventListener("lenis:ready", onLenisReady);
      cancelAnimationFrame(lenisRaf);
      // If we unmount before the timeline releases scroll itself, undo the lock.
      if (lenisHooked && !doneRef.current) getLenis()?.start();
      const hv = heroVideo();
      if (hv && hv.paused) hv.play().catch(() => {});
      try {
        history.scrollRestoration = prevRestoration;
      } catch {}
      ctx.revert();
      tlRef.current = null;
    };
  }, [phase, finish]);

  if (phase === "done") return null;

  // Pass 1: decide. In this render, phase is "pending". We render an opaque
  // dark backing plate so the document never paints a frame of the hero before
  // Pass 1 runs. Because the intro covers the whole viewport, this renders at
  // most one dark frame before the hero — never the bright chair flash that a
  // `return null` here produced.
  if (phase === "pending") {
    return (
      <div
        aria-hidden="true"
        className="intro-pending-plate"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
        {/* The same artifact the loading veil was just showing, held still at
            the exact state the intro's Stage 1 starts from. This plate is on
            screen for the whole hydration stall; it used to be empty, so the
            mark vanished here and reappeared later. */}
        {/* Inline on purpose: the component's stylesheet lives in the
            "playing" branch and is not on the page yet. These values must
            equal .track-loading-mark / .track-artifact in app/loading.tsx and
            .intro-artifact-mark / .intro-artifact-img below, or the mark
            shifts at one of the two swaps. */}
        <div
          className="intro-pending-mark"
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
    <div ref={rootRef} className="intro-root" role="dialog" aria-label="Intro" aria-live="polite">
      <div ref={sceneRef} className="intro-scene">
        <div className="intro-media-clip">
          <div ref={mediaRef} className="intro-media">
            <div ref={focusRef} className="intro-focus" />
          </div>
        </div>

        <div ref={gradeRef} className="intro-grade" aria-hidden="true" />

        {/* ── Initial Artifact & Welcome Screen ── */}
        <div ref={loaderOverlayRef} className="intro-loader-veil">
          <div className="intro-loader-content">
            <div ref={artifactMarkRef} className="intro-artifact-mark">
              <div className="intro-artifact-aura" aria-hidden="true" />
              <img
                src="/images/ui/artifact.png"
                alt=""
                className="intro-artifact-img"
                draggable={false}
              />
            </div>

            {/* Greeting Block */}
            <div ref={welcomeBlockRef} className="intro-welcome-block">
              <h1 className="intro-welcome-title" aria-label="Hi There, Hackers!">
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i">Hi</span>
                </span>
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i">There,</span>
                </span>
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i">Hackers!</span>
                </span>
              </h1>
              <span className="intro-welcome-sub">RECURSIVE 2026</span>
            </div>
          </div>
        </div>

        <div className="intro-captions">
          {LINES.map((line, i) => (
            <div
              key={i}
              className="intro-line"
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
            >
              <p className="intro-line-text">
                {line.words.map((w, j) => {
                  const isAccent = line.accent === w;
                  return (
                    <span key={j} className={`intro-word${isAccent ? " is-accent" : ""}`}>
                      <span className="intro-word-i" data-accent={isAccent ? "1" : undefined}>
                        {w}
                      </span>
                    </span>
                  );
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="intro-progress" aria-hidden="true">
          <div ref={barRef} className="intro-progress-fill" />
        </div>

        <div ref={skipRef} className="intro-skip-wrap">
          {showChrome && (
            <LiquidMetalButton label="Skip intro" onClick={skip} width={128} height={40} />
          )}
        </div>
      </div>

      <div ref={bloomRef} className="intro-bloom" aria-hidden="true" />

      <style href="intro-sequence" precedence="default" suppressHydrationWarning>{`
        .intro-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          z-index: 9999;
          overflow: hidden;
          background: transparent;
          opacity: 1;
          pointer-events: auto;
          -webkit-tap-highlight-color: transparent;
        }

        /* Everything that belongs to the story — fades out at the hand-off while
           the glow (a sibling, not a child) lingers over the landing page. */
        .intro-scene {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          background: transparent;
          opacity: 1;
          pointer-events: none;
          contain: layout paint style;
        }

        /* ── Initial Artifact Loader & Welcome Veil ── */
        .intro-loader-veil {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.48) 0%, rgba(52, 88, 38, 0) 62%),
            linear-gradient(180deg, #0A160A 0%, #010301 65%);
          pointer-events: none;
          overflow: hidden;
          will-change: opacity;
        }

        .intro-loader-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 680px;
          padding: 0 1.5rem;
        }

        /* Artifact Mark */
        .intro-artifact-mark,
        .intro-pending-mark {
          position: relative;
          width: clamp(210px, 30vw, 360px);
          aspect-ratio: 744 / 220;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity;
        }

        .intro-artifact-aura {
          position: absolute;
          inset: -25% -20%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(143, 196, 90, 0.22) 0%, rgba(76, 133, 46, 0.06) 50%, transparent 72%);
          filter: blur(28px);
          pointer-events: none;
          opacity: 0;
          transform: scale(0.35);
          will-change: transform, opacity;
        }

        .intro-artifact-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          /* Held: visible, at rest. This is the state the loading veil ends
             on and the pending plate holds, so the intro can take it over
             without a seam. Stage 1 brightens it from here rather than
             re-entering it from nothing. */
          opacity: 1;
          transform: none;
          /* Static, and already the *final* grade. It used to start at a 32px
             emerald drop-shadow and tween to this; a drop-shadow is a gaussian
             blur, and a changing radius re-rasterises the image every frame.
             Held still, it is rasterised once and composited from then on. The
             emerald bloom at the start is the aura's job. */
          filter: brightness(1.2) saturate(1.15) drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65));
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          will-change: transform, opacity;
        }

        .intro-welcome-block {
          position: absolute;
          top: calc(100% + 14px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .intro-welcome-title {
          margin: 0;
          font-family: var(--font-display), var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2rem, 5.4vw, 3.6rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: clamp(0.01em, 0.4vw, 0.03em);
          text-transform: none;
          color: #ffffff;
          text-shadow: 0 4px 28px rgba(0, 0, 0, 0.7);
          /* No filter here. A filter on this container is an effect node that
             has to be re-composited every time any child layer changes -- and
             the children are the animating words. The text-shadow alone carries
             the depth. */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3em;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .intro-welcome-title {
            font-size: clamp(1.75rem, 6.8vw, 2.3rem);
            line-height: 1.15;
            padding: 0 0.5rem;
            gap: 0.22em;
          }
        }

        .intro-welcome-word {
          display: inline-block;
        }

        .intro-welcome-word-i {
          display: inline-block;
          will-change: transform, opacity;
        }

        .intro-welcome-sub {
          font-family: var(--font-mono, monospace), monospace;
          font-size: clamp(0.72rem, 1.4vw, 0.86rem);
          font-weight: 600;
          letter-spacing: clamp(0.24em, 0.6vw, 0.34em);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          text-shadow: 0 0 16px rgba(120, 185, 75, 0.4);
          margin-top: 10px;
          display: inline-block;
          transform-origin: center center;
          /* letter-spacing is fixed above; it is not animated any more. It is
             a layout property, and will-change cannot promote it anyway. */
          will-change: transform, opacity;
        }

        .intro-media-clip { position: absolute; inset: 0; overflow: hidden; }

        /* No CSS transform/filter seed here. The intro is not in the SSR paint
           (it mounts only once phase is "playing"), and GSAP's fromTo applies
           the from-state synchronously before paint via immediateRender. A CSS
           translate of -6% here would leave GSAP a stray px y-offset its
           yPercent tween never clears, so the plate sat ~58px too high for the
           whole hand-off (the "not synced" double image). */
        .intro-media {
          position: absolute;
          inset: 0;
          will-change: transform;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }
        /* Separate layer so the focus rack never fights the climb's transform +
           colour-grade tween on .intro-media. */
        .intro-focus {
          position: absolute;
          inset: 0;
        }


        .intro-media video,
        .intro-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* Must match Hero's .hero-video so the frame-synced hand-off aligns. */
          object-position: center center;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Dark from above — you're at the bottom, looking up the hill. */
        .intro-grade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(120% 90% at 50% 116%, rgba(6,14,9,0) 32%, rgba(6,14,9,0.8) 76%, rgba(4,10,7,0.96) 100%),
            linear-gradient(180deg, rgba(6,13,9,0.7) 0%, rgba(6,13,9,0.24) 46%, rgba(6,13,9,0.48) 100%);
        }

        /* Dawn cresting the hill — low, wide, warm. Masks the cut, then recedes. */
        .intro-bloom {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          will-change: opacity, transform;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          background:
            radial-gradient(72% 46% at 50% 74%,
              rgba(255, 244, 214, 0.55) 0%,
              rgba(252, 236, 198, 0.30) 30%,
              rgba(214, 230, 196, 0.08) 58%,
              rgba(214, 230, 196, 0) 78%),
            linear-gradient(0deg, rgba(255, 240, 208, 0.14) 0%, rgba(255, 240, 208, 0) 42%);
        }

        @media (max-width: 860px), (pointer: coarse) {
          .intro-bloom {
            mix-blend-mode: screen !important;
            background: radial-gradient(72% 46% at 50% 74%,
              rgba(255, 244, 214, 0.35) 0%,
              rgba(252, 236, 198, 0.18) 30%,
              rgba(214, 230, 196, 0) 65%) !important;
          }
        }

        .intro-captions {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .intro-line {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(1.5rem, 6vw, 6rem);
          padding-bottom: clamp(1.5rem, 5vh, 4rem);
        }

        .intro-line-text {
          margin: 0;
          width: 100%;
          max-width: clamp(22ch, 75vw, 36ch);
          text-align: center;
          font-family: var(--font-display), var(--font-dm-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(1.8rem, 4.2vw, 3.6rem);
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: #eef3e8;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        }

        .intro-word {
          display: inline-block;
          margin: 0 0.24em 0.12em 0;
          opacity: 0;
          will-change: transform, opacity;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }
        .intro-word-i {
          display: inline-block;
          transform: translateZ(0);
        }
        .intro-word.is-accent .intro-word-i {
          color: #a6e06a;
          text-shadow: 0 0 16px rgba(143, 196, 90, 0.45);
        }

        /* Tablets & iPads (768px - 1024px) */
        @media (min-width: 768px) and (max-width: 1024px) {
          .intro-line {
            padding: 0 6vw;
            padding-bottom: 4vh;
          }
          .intro-line-text {
            max-width: 28ch;
            font-size: clamp(2.2rem, 4.4vw, 3.2rem);
            line-height: 1.18;
          }
        }

        /* Desktops & Laptops (1025px - 1599px) */
        @media (min-width: 1025px) {
          .intro-line {
            padding: 0 8vw;
            padding-bottom: 5vh;
          }
          .intro-line-text {
            max-width: 32ch;
            font-size: clamp(2.8rem, 3.6vw, 3.8rem);
            line-height: 1.16;
          }
        }

        /* Large & Ultrawide Screens (1600px+) */
        @media (min-width: 1600px) {
          .intro-line {
            padding: 0 10vw;
            padding-bottom: 6vh;
          }
          .intro-line-text {
            max-width: 36ch;
            font-size: clamp(3.4rem, 3.2vw, 4.4rem);
            line-height: 1.15;
          }
        }

        /* Mobile (< 768px) */
        @media (max-width: 767px) {
          .intro-line {
            padding: 0 7vw;
            padding-bottom: 2vh;
          }
          .intro-line-text {
            max-width: 20ch;
            font-size: clamp(1.65rem, 5.8vw, 2.3rem);
            line-height: 1.16;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
          }
          .intro-word.is-accent .intro-word-i {
            text-shadow: none !important;
          }
        }

        .intro-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          z-index: 1001;
          background: rgba(255, 255, 255, 0.1);
        }
        .intro-progress-fill {
          height: 100%;
          width: 100%;
          transform: scaleX(0);
          transform-origin: left center;
          background: linear-gradient(90deg, #5c8c3a, #a6e06a);
        }

        .intro-skip-wrap {
          position: absolute;
          right: clamp(1.2rem, 3vw, 2.8rem);
          bottom: clamp(1.2rem, 3.5vh, 2.8rem);
          z-index: 1002;
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }

        @media (min-width: 1025px) {
          .intro-skip-wrap {
            right: clamp(2rem, 3.5vw, 3.5rem);
            bottom: clamp(2rem, 4vh, 3.5rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-root { display: none; }
        }
      `}</style>
    </div>
  );
}
