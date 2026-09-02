"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
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
  // Shader-backed skip button + the backdrop-filter ramp are mounted a beat
  // late so their compositing cost never lands on the opening frames.
  const [showChrome, setShowChrome] = useState(false);
  // Video plate enabled on all devices so grass animates during intro
  const [liteMedia, setLiteMedia] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const rackRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
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
      if (typeof ric === "function") ric(refreshTriggers, { timeout: 1200 });
      else window.setTimeout(refreshTriggers, 260);
    };

    if (typeof ric === "function") ric(unmount, { timeout: 900 });
    else window.setTimeout(unmount, 60);
  }, []);

  const skip = useCallback(() => {
    // A graceful bail defined inside the effect (it needs the scene refs); this
    // just triggers it. Never a whole-timeline fast-forward — that flickers
    // every beat past in half a second.
    if (bailRef.current) bailRef.current();
    else finish();
  }, [finish]);

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
    const rack = rackRef.current;
    const grade = gradeRef.current;
    const bloom = bloomRef.current;
    const bar = barRef.current;
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
    if (introVid) {
      introVid.muted = true;
      introVid.defaultMuted = true;
      introVid.playsInline = true;
      introVid.setAttribute("playsinline", "");
      introVid.setAttribute("webkit-playsinline", "");
      introVid.setAttribute("muted", "");
      introVid.play().catch(() => {});
    }

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

    // Coarse warm-up: start the hero's plate playing and roughly aligned, a
    // second before the cut, so it is decoding and buffered by hand-off time.
    const warmHeroPlate = () => {
      const introVid = videoRef.current;
      const heroVid = heroVideo();
      if (!introVid || !heroVid) return;
      try {
        const dur = heroVid.duration || introVid.duration;
        if (dur && Number.isFinite(dur) && introVid.readyState >= 2) {
          heroVid.currentTime = introVid.currentTime % dur;
        }
        const p = heroVid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch {}
    };

    // The actual fix for the desync: two independent <video>s of the same file
    // drift ~0.2s apart over the second between warm-up and the crossfade (and
    // one may loop mid-dissolve). So just before the scene fades, freeze BOTH
    // on the exact same frame — a paused pair cannot drift or shimmer. The seek
    // is invisible because the scene is still fully opaque. finish() resumes
    // the hero plate once the dissolve is done.
    const freezePlates = () => {
      const introVid = videoRef.current;
      const heroVid = heroVideo();
      if (!introVid || !heroVid) return;
      try {
        const dur = heroVid.duration || introVid.duration;
        const t =
          dur && Number.isFinite(dur) ? introVid.currentTime % dur : introVid.currentTime;
        introVid.pause();
        heroVid.pause();
        if (heroVid.readyState >= 1) heroVid.currentTime = t;
      } catch {}
    };

    // Both plates are paused on the same frame for the crossfade. The hero's
    // needs to be moving again by the time it is the only one on screen --
    // finish() used to do that, but it does not run until the bloom has fully
    // receded, which left the grass frozen for two thirds of a second right
    // after the reveal. Restarting the plate is separable from releasing
    // scroll, so it happens under the tail of the dissolve instead.
    const resumeHeroPlate = () => {
      const heroVid = heroVideo();
      if (!heroVid || !heroVid.paused) return;
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

      if (isLite) {
        // GPU compositor only on mobile: scale & yPercent without heavy filter re-rasterization
        tl.fromTo(
          media,
          { scale: 1.12, yPercent: -5 },
          { scale: 1, yPercent: 0, duration: 7.4, ease: "sine.inOut" },
          0,
        );
      } else {
        tl.fromTo(
          media,
          {
            scale: 1.13,
            yPercent: -6,
            filter: "brightness(0.46) saturate(0.74) contrast(1.04)",
          },
          {
            scale: 1,
            yPercent: 0,
            filter: "brightness(1) saturate(1) contrast(1)",
            duration: 7.4,
            ease: "sine.inOut",
          },
          0,
        );
        // Focus rack: cross-fade the pre-blurred still away rather than
        // animating a blur radius. Compositor-only.
        if (rack) {
          tl.fromTo(
            rack,
            { opacity: 1 },
            { opacity: 0, duration: 4.4, ease: "sine.out" },
            0,
          );
        }
      }

      tl.fromTo(grade, { opacity: 1 }, { opacity: 0, duration: 6.9, ease: "sine.inOut" }, 0.3);
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7.0, ease: "none" }, 0);

      lines.forEach((el, i) => {
        const [tin, tout] = CUES[i];
        const words = el.querySelectorAll<HTMLElement>(".intro-word");

        if (isLite) {
          tl.fromTo(
            words,
            { opacity: 0, yPercent: 22 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.62,
              ease: "power2.out",
              stagger: 0.045,
            },
            tin,
          );
          if (i < lines.length - 1) {
            tl.to(
              words,
              {
                opacity: 0,
                yPercent: -14,
                duration: 0.36,
                ease: "power1.in",
                stagger: 0.02,
              },
              tout,
            );
          }
        } else {
          tl.fromTo(
            words,
            { opacity: 0, yPercent: 26, filter: "blur(5px)" },
            {
              opacity: 1,
              yPercent: 0,
              filter: "blur(0px)",
              duration: 0.62,
              ease: "power2.out",
              stagger: 0.05,
            },
            tin,
          );
          if (i < lines.length - 1) {
            tl.to(
              words,
              {
                opacity: 0,
                yPercent: -16,
                filter: "blur(4px)",
                duration: 0.36,
                ease: "power1.in",
                stagger: 0.022,
              },
              tout,
            );
          }
        }
      });

      // ── Hand-off ──────────────────────────────────────────────────────────
      // 1. Warm the hero's plate ~1s ahead (playing, roughly aligned, buffered).
      //    This used to be desktop-only, on the theory that a phone should not
      //    run two decoders at once. But freezePlates still seeks the hero plate
      //    at 7.4 on every device, and the dissolve starts uncovering it at
      //    7.55: a cold seek on a phone does not land a decoded frame in 150ms,
      //    so the crossfade revealed a stale or blank plate. The phone needs the
      //    lead time more than the desktop does, not less -- and now that the
      //    plate is parked for the first six seconds, this is the only stretch
      //    where two decoders overlap at all.
      tl.call(warmHeroPlate, undefined, 6.6);

      // 2. Last line eases out on its own (not yanked by the scene fade).
      const lastWords = lines[lines.length - 1].querySelectorAll<HTMLElement>(".intro-word");
      if (isLite) {
        tl.to(
          lastWords,
          { opacity: 0, yPercent: -14, duration: 0.8, ease: "sine.inOut", stagger: 0.035 },
          7.15,
        );
      } else {
        tl.to(
          lastWords,
          { opacity: 0, yPercent: -14, filter: "blur(6px)", duration: 0.8, ease: "sine.inOut", stagger: 0.04 },
          7.15,
        );
      }

      // 3. A soft dawn glow rises from the hill line — masks the seam, then recedes.
      tl.fromTo(
        bloom,
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "sine.inOut" },
        7.25,
      );

      // 4. Freeze BOTH plates on the same frame, then dissolve between them —
      //    two paused videos cannot drift, so the grass does not shimmer. The
      //    0.15s gap lets the hero settle on the seeked frame behind the still-
      //    opaque scene. finish() resumes the hero plate.
      // Pin the plate to exact identity before the crossfade — the climb ends
      // here anyway, but this guarantees no residual transform can offset it
      // against the hero (that was the "not synced" double image).
      tl.set(media, { xPercent: 0, yPercent: 0, x: 0, y: 0, scale: 1, rotation: 0 }, 7.4);
      // Guarantee a perfectly sharp plate at the cut, whatever the rack tween
      // resolved to.
      if (rack) tl.set(rack, { opacity: 0 }, 7.4);
      tl.call(freezePlates, undefined, 7.4);
      tl.call(() => {
        if (typeof document !== "undefined") document.documentElement.dataset.intro = "done";
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }, undefined, 7.25);
      tl.to(scene, { autoAlpha: 0, duration: 0.9, ease: "sine.inOut" }, 7.55);
      tl.call(resumeHeroPlate, undefined, 8.05);
      tl.set(root, { pointerEvents: "none" }, 7.9);
      tl.call(releaseScroll, undefined, 8.45);

      // 5. Glow recedes over the settled landing page.
      tl.to(bloom, { opacity: 0, scale: 1.04, duration: 1.15, ease: "power1.inOut" }, 7.95);
    }, root);

    const tl = tlRef.current!;

    // ── Warm start ─────────────────────────────────────────────────────────
    // Hold the (paused) timeline until fonts, the first decoded video frame and
    // a couple of composited frames have settled — otherwise the opening beat
    // lands mid-decode / mid-font-swap and stutters on a cold reload.
    let started = false;
    let warmTimer = 0;
    const startNow = () => {
      if (started || doneRef.current) return;
      started = true;
      window.clearTimeout(warmTimer);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      tl.play(0);
    };
    const warmWaits: Promise<unknown>[] = [];
    const vid = videoRef.current;
    if (vid && vid.readyState < 2) {
      warmWaits.push(
        new Promise<void>((resolve) => {
          const onData = () => {
            vid.removeEventListener("loadeddata", onData);
            resolve();
          };
          vid.addEventListener("loadeddata", onData);
        }),
      );
    }
    if (document.fonts?.ready) warmWaits.push(document.fonts.ready);
    warmTimer = window.setTimeout(startNow, 340); // hard cap so it always runs
    Promise.all(warmWaits).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(startNow));
    });

    // Chrome (shader skip button + backdrop-filter ramp) mounts a beat late.
    const chromeTimer = window.setTimeout(() => setShowChrome(true), 700);

    // ── Graceful skip ─────────────────────────────────────────────────────
    // Not a whole-timeline scrub. Freeze where we are, match the hero plate,
    // and run a short version of the real hand-off: a touch of glow, dissolve.
    let bailing = false;
    bailRef.current = () => {
      if (bailing || doneRef.current) return;
      bailing = true;
      started = true;
      window.clearTimeout(warmTimer);
      tl.pause();

      const isLite = liteMedia || prefersLiteMedia();
      const words = root.querySelectorAll<HTMLElement>(".intro-word");
      const wordInners = root.querySelectorAll<HTMLElement>(".intro-word-i");
      gsap.killTweensOf([scene, bloom, media, focus, grade, bar]);
      if (rack) gsap.killTweensOf(rack);
      gsap.killTweensOf(words);
      gsap.killTweensOf(wordInners);
      gsap.set(wordInners, { clearProps: "transform,textShadow" });

      // Every device, now that the plate is parked at t=0: on lite this is what
      // gets it moving again, and without it the skip would dissolve onto a
      // frozen hero. (freezePlates stays desktop-only below -- the skip gives it
      // only ~40ms before the dissolve, which is not enough for a phone to land
      // a seek, and a slight drift between two copies of the same loop is a far
      // smaller fault than a stalled plate.)
      warmHeroPlate();

      // A compressed version of the real wind-down, not a hard cut: the text
      // drops away, the plate *eases* to its final framing + grade on sine
      // (never a lurch), the dawn glow rises over the tail of that settle, and
      // the scene dissolves into the hero.
      const q = gsap.timeline({ onComplete: finish });
      if (isLite) {
        q.to(words, { autoAlpha: 0, yPercent: -14, duration: 0.28, ease: "power2.in" }, 0);
        q.to(
          media,
          { xPercent: 0, yPercent: 0, x: 0, y: 0, scale: 1, rotation: 0, duration: 0.6, ease: "sine.inOut" },
          0,
        );
      } else {
        q.to(words, { autoAlpha: 0, yPercent: -16, filter: "blur(6px)", duration: 0.28, ease: "power2.in" }, 0);
        q.to(
          media,
          {
            xPercent: 0, yPercent: 0, x: 0, y: 0, scale: 1, rotation: 0,
            filter: "brightness(1) saturate(1) contrast(1)",
            duration: 0.6, ease: "sine.inOut",
          },
          0,
        );
        if (rack) q.to(rack, { opacity: 0, duration: 0.5, ease: "sine.inOut" }, 0);
      }
      q.to(grade, { opacity: 0, duration: 0.6, ease: "sine.inOut" }, 0.04);
      q.fromTo(
        bloom,
        { opacity: 0, scale: 1.1 },
        { opacity: 0.9, scale: 1, duration: 0.5, ease: "sine.out" },
        0.3,
      );
      if (!isLite) {
        q.call(freezePlates, undefined, 0.62);
      }
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
      window.clearTimeout(warmTimer);
      window.clearTimeout(chromeTimer);
      bailRef.current = null;
      root.removeEventListener("wheel", block);
      root.removeEventListener("touchmove", block);
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

  // "pending" (SSR + first client paint, before pass 1 decides): a bare dark
  // plate over the whole viewport. Same colour as .intro-scene, so if the intro
  // does play the swap is invisible; if it turns out to be skipped this is at
  // most one dark frame before the hero — never the bright chair flash that a
  // `return null` here produced.
  if (phase === "pending") {
    return (
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "#0a140c" }}
      />
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
              {/* The focus rack, pre-blurred. See .intro-rack. */}
              <img
                ref={rackRef}
                className="intro-rack"
                src="/images/hero_poster.jpg"
                alt=""
                aria-hidden="true"
                draggable={false}
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

        {showChrome && (
          <div className="intro-skip-wrap">
            <LiquidMetalButton label="Skip intro" onClick={skip} width={128} height={40} />
          </div>
        )}
      </div>

      <div ref={bloomRef} className="intro-bloom" aria-hidden="true" />

      <style href="intro-sequence" precedence="default" suppressHydrationWarning>{`
        .intro-root {
          position: fixed;
          inset: 0;
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
          inset: 0;
          overflow: hidden;
          background: #0a140c;
          opacity: 1;
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
          will-change: transform, filter;
          backface-visibility: hidden;
        }
        /* Separate layer so the focus rack never fights the climb's transform +
           colour-grade tween on .intro-media. */
        .intro-focus {
          position: absolute;
          inset: 0;
        }

        /* The focus rack used to be a blur radius animated from 9px to 0px
           over 4.4s on .intro-focus. A full-viewport gaussian re-rasterises the
           entire plate on every frame at a radius that changes on every frame,
           which is the most expensive thing in the whole cold-open -- and it
           overlaps the first three story lines, so it lands exactly where the
           intro can least afford it. (The lite branch already avoided it for
           precisely this reason; the problem is that "not lite" includes every
           weak laptop.)
           Same picture, none of the cost: stack a pre-blurred still on top and
           cross-fade it out. The blur is rasterised once, and opacity is a
           compositor property, so the rack is now free per frame.
           It lives inside .intro-focus (so inside .intro-media) deliberately --
           that way it inherits the identical climb transform and colour grade,
           and cannot drift against the video underneath it. scale() hides the
           transparent edge the blur samples in from outside the box. */
        .intro-rack {
          filter: blur(9px);
          transform: scale(1.06);
          will-change: opacity;
          pointer-events: none;
          /* Hidden by default: only the non-lite branch builds the rack tween,
             and its fromTo raises this to 1 before the first paint. On lite
             there is no rack at all, and this stays 0. */
          opacity: 0;
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
          background:
            radial-gradient(72% 46% at 50% 74%,
              rgba(255, 244, 214, 0.55) 0%,
              rgba(252, 236, 198, 0.30) 30%,
              rgba(214, 230, 196, 0.08) 58%,
              rgba(214, 230, 196, 0) 78%),
            linear-gradient(0deg, rgba(255, 240, 208, 0.14) 0%, rgba(255, 240, 208, 0) 42%);
        }

        .intro-captions {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .intro-line {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 0 7vw;
        }

        .intro-line-text {
          margin: 0;
          max-width: 20ch;
          text-align: center;
          font-family: var(--font-display), var(--font-dm-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(1.7rem, 5.4vw, 3.4rem);
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: #eef3e8;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.4);
        }

        .intro-word {
          display: inline-block;
          margin: 0 0.24em 0.12em 0;
          opacity: 0;
        }
        .intro-word-i {
          display: inline-block;
        }
        .intro-word.is-accent .intro-word-i {
          color: #a6e06a;
          text-shadow: 0 0 16px rgba(143, 196, 90, 0.45);
        }

        @media (max-width: 768px) {
          .intro-line-text {
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
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
          right: clamp(1rem, 3vw, 2rem);
          bottom: clamp(1.1rem, 3.4vh, 2rem);
          z-index: 1002;
          animation: intro-skip-in 420ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes intro-skip-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-root { display: none; }
        }
      `}</style>
    </div>
  );
}
