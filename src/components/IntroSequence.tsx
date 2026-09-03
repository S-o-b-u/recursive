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
  [0.15, 0.95],
  [1.15, 2.0],
  [2.2, 3.2],
  [3.45, 4.95],
  [5.2, 6.1],
  [6.35, 7.3],
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
    const t = window.setTimeout(() => setShowChrome(true), 900);
    return () => window.clearTimeout(t);
  }, [phase]);

  // ── Pass 1: decide ──────────────────────────────────────────────────────
  // Runs before paint. Until it resolves, the component renders a bare dark
  // plate (see the "pending" branch below), so the hero never flashes.
  useLayoutEffect(() => {
    setLiteMedia(false);
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro");

    if (force === "0") {
      doneRef.current = true;
      if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
      setPhase("done");
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
    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!root || !scene || !media || !focus || !grade || !bloom || !bar) return;

    const prevRestoration = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {}
    // Belt-and-suspenders lock for the frame before Lenis is reachable. Only
    // safe when the scrollbar gutter is reserved — see GUTTER_STABLE.
    if (GUTTER_STABLE) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    window.scrollTo(0, 0);

    const introVid = videoRef.current;
    let cleanupVidListeners: (() => void) | null = null;
    /** Set once the hand-off intentionally stops the intro's plate. */
    let plateReleased = false;
    if (introVid) {
      introVid.muted = true;
      introVid.defaultMuted = true;
      introVid.playsInline = true;
      introVid.setAttribute("playsinline", "");
      introVid.setAttribute("webkit-playsinline", "");
      introVid.setAttribute("muted", "");

      // Every one of the listeners below exists to fight a plate that stopped
      // on its own (a decoder stall, a backgrounded tab, a mid-loop hiccup).
      // But the hand-off *deliberately* stops it, and these were winning that
      // argument too: introVid.pause() at the end of the dissolve fired
      // "pause", ensurePlaying() restarted it, and the intro's decoder kept
      // running over the hero's for as long as the subtree stayed mounted --
      // two 4K streams competing at precisely the moment the hero arrives.
      // Once the plate is deliberately released, these stand down.
      const ensurePlaying = () => {
        if (plateReleased || doneRef.current) return;
        if (introVid.paused) {
          introVid.play().catch(() => {});
        }
      };

      introVid.addEventListener("waiting", ensurePlaying);
      introVid.addEventListener("stalled", ensurePlaying);
      const onPause = () => {
        if (!doneRef.current) {
          ensurePlaying();
        }
      };
      introVid.addEventListener("pause", onPause);

      // Handle seamless video loop without freeze on mobile
      let looping = false;
      const onTimeUpdate = () => {
        if (looping) return;
        if (introVid.duration && Number.isFinite(introVid.duration)) {
          if (introVid.currentTime >= introVid.duration - 0.35) {
            looping = true;
            introVid.currentTime = 0;
            ensurePlaying();
            window.setTimeout(() => {
              looping = false;
            }, 300);
          }
        }
      };
      introVid.addEventListener("timeupdate", onTimeUpdate);
      introVid.addEventListener("seeked", ensurePlaying);
      const onEnded = () => {
        introVid.currentTime = 0;
        ensurePlaying();
      };
      introVid.addEventListener("ended", onEnded);

      ensurePlaying();

      cleanupVidListeners = () => {
        introVid.removeEventListener("waiting", ensurePlaying);
        introVid.removeEventListener("stalled", ensurePlaying);
        introVid.removeEventListener("pause", onPause);
        introVid.removeEventListener("timeupdate", onTimeUpdate);
        introVid.removeEventListener("seeked", ensurePlaying);
        introVid.removeEventListener("ended", onEnded);
      };
    }

    const onTouchKick = () => {
      if (plateReleased) return;
      if (videoRef.current && videoRef.current.paused && !doneRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };
    window.addEventListener("touchstart", onTouchKick, { passive: true });

    // Hold the scroll through Lenis. <SmoothScroll> mounts after this layout
    // effect, so the instance can be a frame or two late — retry briefly.
    //
    // <SmoothScroll> never constructs a Lenis instance on touch/mobile at all
    // (native momentum scroll instead) — same isTouch check as there. Without
    // this guard, grabLenis() polled every animation frame for the intro's
    // entire ~9s runtime on every phone, never finding one, purely because
    // there was nothing to give up on: one more source of needless per-frame
    // work stacked on the busiest, least-headroom window of the whole page.
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

    const heroVideo = () =>
      document.querySelector<HTMLVideoElement>("video.hero-video");

    // The hero mounts under the curtain and starts its own plate immediately,
    // so for the whole cold-open the device is decoding two copies of the same
    // 4K file -- and exactly one of them is on screen. The hidden one is pure
    // contention for the frames the intro is trying to hit, and it is worst on
    // the phones that can least afford it. Park it until warmHeroPlate wants it
    // back; finish() and the skip path both restart it, so it cannot be
    // stranded paused.
    const suspendHeroPlate = () => {
      const heroVid = heroVideo();
      if (!heroVid) return;
      try {
        heroVid.pause();
      } catch {}
    };

    const isMobileDevice = isTouch || liteMedia || prefersLiteMedia();

    // Coarse warm-up: start the hero's plate playing and roughly aligned on desktop.
    // On mobile / touch devices, do not spin up the second video early —
    // iOS WebKit will pause the active intro video if a second video starts playing!
    const warmHeroPlate = () => {
      if (isMobileDevice) return;
      const heroVid = heroVideo();
      if (!heroVid) return;
      try {
        const p = heroVid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch {}
    };



    // Resumes the hero's plate under the dissolve.
    const resumeHeroPlate = () => {
      const heroVid = heroVideo();
      if (!heroVid) return;
      try {
        const p = heroVid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch {}
    };

    // Give scroll back the moment the scene is gone rather than at the end of
    // the bloom. finish() cannot be brought forward for this because it also
    // sets phase to "done", and the component returns null in that phase --
    // which would cut the bloom recede off mid-fade.
    let released = false;
    const releaseScroll = () => {
      if (released || doneRef.current) return;
      released = true;
      if (GUTTER_STABLE) {
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
      // Not at effect time: <Hero> is a sibling whose mount effect calls play()
      // on its own plate, and passive effects run after this layout effect, so
      // a pause taken now is undone a tick later. The timeline does not start
      // until the warm gate opens, which is comfortably after that.
      tl.call(suspendHeroPlate, undefined, 0);

      // Opaque from frame 0, not faded up.
      //
      // This was a 0.35s fade from opacity 0, added to cover a 1-frame position
      // snap, and it was the entire black gap after a reload: the pending plate
      // has already unmounted by the time it runs and .intro-root is
      // transparent, so every frame of the fade was also a frame of dead dark
      // (or, with a warm cache, of the finished hero bleeding through the
      // half-opaque scene). Shortening it only shrinks the dip -- it still dips.
      //
      // There is nothing left to cover now: the pending plate paints this same
      // still, at this same frame-0 transform and grade, so the swap has no
      // visible seam. And the snap it guarded against cannot happen anyway --
      // fromTo applies its from-state via immediateRender, synchronously, before
      // the browser paints the frame the scene first appears on.
      tl.set(scene, { opacity: 1 }, 0);

      const isWideScreen = typeof window !== "undefined" && window.innerWidth >= 768;
      // On desktop, tablet, and widescreen devices, scale at 1.07 and yPercent at -3.2%
      // so the hill crest and plastic chair fit naturally in frame without aggressive cropping.
      const initialScale = isWideScreen ? 1.07 : 1.12;
      const initialYPercent = isWideScreen ? -3.2 : -5;

      // Pin media to starting transform immediately before paint — eliminates 1s jump
      gsap.set(media, {
        scale: initialScale,
        yPercent: initialYPercent,
        transformOrigin: "center center",
        force3D: true,
      });

      tl.to(
        media,
        { scale: 1, yPercent: 0, duration: 7.55, ease: "power1.inOut" },
        0,
      );

      tl.fromTo(grade, { opacity: 1 }, { opacity: 0, duration: 6.9, ease: "sine.inOut" }, 0.3);
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7.0, ease: "none" }, 0);

      lines.forEach((el, i) => {
        const [tin, tout] = CUES[i];
        const words = el.querySelectorAll<HTMLElement>(".intro-word");

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
        // Smoothly fade in at 1.0s
        tl.fromTo(
          skipWrap,
          { opacity: 0, y: 10, pointerEvents: "none" },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", pointerEvents: "auto" },
          1.0,
        );
        // Cleanly dismiss BEFORE hero page transition so it never lingers after transition
        tl.to(
          skipWrap,
          { opacity: 0, y: 8, duration: 0.35, ease: "power2.in", pointerEvents: "none" },
          6.7,
        );
      }

      // ── Hand-off ──────────────────────────────────────────────────────────
      if (!isMobileDevice) {
        tl.call(warmHeroPlate, undefined, 6.6);
      }

      // 2. Last line eases out on its own with soft deceleration
      const lastWords = lines[lines.length - 1].querySelectorAll<HTMLElement>(".intro-word");
      tl.to(
        lastWords,
        { opacity: 0, y: -12, scale: 0.98, duration: 0.58, ease: "power2.inOut", stagger: 0.024 },
        7.15,
      );

      // 3. A soft dawn glow rises from the hill line — masks the seam, then recedes.
      tl.fromTo(
        bloom,
        { opacity: 0, scale: 1.08 },
        { opacity: isMobileDevice ? 0.7 : 1, scale: 1, duration: 0.85, ease: "power1.inOut" },
        7.25,
      );

      // Pin the plate to exact identity at the dissolve start without micro-snap
      tl.set(media, { xPercent: 0, yPercent: 0, x: 0, y: 0, scale: 1, rotation: 0 }, 7.55);

      // Hand off to Hero: signal at 7.4s so Hero starts playing smoothly right before the dissolve
      const handoffTime = isMobileDevice ? 7.4 : 7.25;
      tl.call(() => {
        if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }, undefined, handoffTime);

      const dissolveDuration = isMobileDevice ? 0.65 : 0.85;
      tl.to(scene, { autoAlpha: 0, duration: dissolveDuration, ease: "power1.inOut" }, 7.55);

      // Once scene is fully transparent, ensure hero is playing and release introVid
      tl.call(() => {
        if (isMobileDevice && introVid) {
          try {
            plateReleased = true;
            introVid.pause();
          } catch {}
        }
        resumeHeroPlate();
      }, undefined, 7.55 + dissolveDuration + 0.1);

      tl.set(root, { pointerEvents: "none" }, 7.8);
      tl.call(releaseScroll, undefined, 8.3);

      // 5. Glow recedes over the settled landing page.
      tl.to(bloom, { opacity: 0, scale: 1.04, duration: 0.9, ease: "power1.inOut" }, 7.55 + dissolveDuration);
    }, root);

    const tl = tlRef.current!;

    // ── Synchronous start: video and timeline start in exact lockstep from frame 0 ──
    let started = false;
    const vid = videoRef.current;
    const startNow = () => {
      if (started || doneRef.current) return;
      started = true;
      if (vid) {
        if (vid.currentTime > 0.05) {
          try {
            vid.currentTime = 0;
          } catch {}
        }
        const p = vid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
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
      if (skipWrap) gsap.killTweensOf(skipWrap);
      gsap.killTweensOf(words);
      gsap.killTweensOf(wordInners);
      gsap.set(wordInners, { clearProps: "transform,textShadow" });

      warmHeroPlate();

      const q = gsap.timeline({ onComplete: finish });
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
        { opacity: 0.9, scale: 1, duration: 0.5, ease: "sine.out" },
        0.3,
      );
      q.call(
        () => {
          if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
          if (typeof window !== "undefined")
            window.dispatchEvent(new CustomEvent("recursive-intro-done"));
        },
        undefined,
        0.4,
      );
      q.to(scene, { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" }, 0.66);
      // No-ops when the plate is already running, so it is safe on the lite
      // path where freezePlates never paused it.
      q.call(resumeHeroPlate, undefined, 1.02);
      q.set(root, { pointerEvents: "none" }, 1.0);
      q.call(releaseScroll, undefined, 1.26);
      q.to(bloom, { opacity: 0, scale: 1.04, duration: 0.65, ease: "power1.inOut" }, 1.05);
    };

    return () => {
      bailRef.current = null;
      root.removeEventListener("wheel", block);
      root.removeEventListener("touchmove", block);
      window.clearInterval(watchdog);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("lenis:ready", onLenisReady);
      cancelAnimationFrame(lenisRaf);
      // If we unmount before the timeline releases scroll itself, undo the lock.
      if (lenisHooked && !doneRef.current) getLenis()?.start();
      // Same reasoning for the parked hero plate: finish() restarts it on the
      // normal routes, so this only covers an unmount that skipped them.
      if (!doneRef.current) resumeHeroPlate();
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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100%",
          minHeight: "100dvh",
          zIndex: 9998,
          overflow: "hidden",
          background: "#0a140c",
        }}
        className="intro-pending-plate"
      >
        {/* This plate is what the document paints first, before hydration has
            even decided whether the intro runs -- so on a reload it is on
            screen for as long as the phone needs to boot React. It used to be
            flat #0a140c, which is why reloading read as: finished page, hard
            cut to a slab of black, long dead pause, and only then the intro.
            Painting the intro's own opening frame here instead means the swap
            to the real scene has nothing to cut between -- same still, same
            framing, same grade -- so the black gap disappears.
            The transform mirrors the media's frame-0 state, and the gradient
            below is a copy of .intro-grade at opacity 1. */}
        {/* The grade differs between the two frame-0 states -- the desktop
            branch opens on brightness(0.46), the lite branch on no filter at
            all -- and getting it wrong trades the black gap for a brightness
            pop. prefersLiteMedia() is just media queries underneath, so the
            plate can mirror the same predicate in CSS and be correct before any
            JS has run. (saveData has no CSS equivalent; that path lands on the
            lite value, which is what it wants anyway.) */}
        <style>{
          ".intro-pending-plate img{filter:brightness(0.46) saturate(0.74) contrast(1.04)}" +
          "@media (pointer: coarse),(max-width: 860px),(prefers-reduced-motion: reduce){" +
          ".intro-pending-plate img{filter:none}}"
        }</style>
        <img
          src="/images/hero_poster.jpg"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: "scale(1.12) translateY(-5%)",
            // A 32x18 blur of the poster, inline, ~400 bytes. The preload above
            // makes the real still fast, but "fast" is still a network round
            // trip: on a cold cache the plate would paint flat black until it
            // lands, which is the whole bug coming back for first-time
            // visitors. This is in the HTML itself, so the opening frame is on
            // screen in the first paint no matter what the network is doing,
            // and the full-resolution still simply replaces it in place.
            backgroundImage: `url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAASACADASIAAhEBAxEB/8QAGgAAAgIDAAAAAAAAAAAAAAAAAAUDBAEGB//EACUQAAICAQIEBwAAAAAAAAAAAAECAAMRBCEFMVFhBhQiQXGBkf/EABcBAQEBAQAAAAAAAAAAAAAAAAACAQP/xAAZEQEBAAMBAAAAAAAAAAAAAAAAAQIDMUH/2gAMAwEAAhEDEQA/ANrrVWXPOShRFz8So0qZutVe3uZWbxBW21VbN3JxIucnQ6KgyKxQq9DF1fGqzs6lT8yx52q5fQ4J6TJsxvKOeXu76hyzMTnmTCpjkbn9hCR4kwrJKbkzFbsGGGI+4QnCj//Z)`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 116%, rgba(6,14,9,0) 32%, rgba(6,14,9,0.8) 76%, rgba(4,10,7,0.96) 100%), linear-gradient(180deg, rgba(6,13,9,0.7) 0%, rgba(6,13,9,0.24) 46%, rgba(6,13,9,0.48) 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="intro-root" role="dialog" aria-label="Intro" aria-live="polite">
      <div ref={sceneRef} className="intro-scene">
        <div className="intro-media-clip">
          <div ref={mediaRef} className="intro-media">
            <div ref={focusRef} className="intro-focus">
              <video
                ref={videoRef}
                src="/bg/hero_bg.mp4"
                poster="/images/hero_poster.jpg"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div ref={gradeRef} className="intro-grade" aria-hidden="true" />

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
          background: #0a140c;
          opacity: 0;
          contain: layout paint style;
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
            mix-blend-mode: normal !important;
            background: radial-gradient(72% 46% at 50% 74%,
              rgba(255, 244, 214, 0.42) 0%,
              rgba(252, 236, 198, 0.22) 30%,
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
