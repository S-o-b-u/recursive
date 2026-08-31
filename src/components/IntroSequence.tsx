"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import GradualBlur from "@/components/ui/GradualBlur";
import { getLenis } from "@/lib/lenis";

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

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
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

    setPhase("done");
    requestAnimationFrame(() => {
      const l = getLenis();
      if (l) l.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    });
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
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro");

    if (force === "0") {
      doneRef.current = true;
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
      setPhase("done");
      return;
    }

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

    // Hold the scroll through Lenis. <SmoothScroll> mounts after this layout
    // effect, so the instance can be a frame or two late — retry briefly.
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
    grabLenis();
    const onLenisReady = () => grabLenis();
    window.addEventListener("lenis:ready", onLenisReady);

    const block = (e: Event) => e.preventDefault();
    root.addEventListener("wheel", block, { passive: false });
    root.addEventListener("touchmove", block, { passive: false });

    // Keyboard scroll is not routed through Lenis, so hold it here too.
    const blockKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", blockKeys, { passive: false });

    // ── Signature warp: a pointer lens + chromatic split on the live line ─────
    const ptr = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      on: 0,
      onT: 0,
    };
    let activeLine = -1;
    let centers: { el: HTMLElement; cx: number; cy: number }[] = [];

    const activateLine = (i: number) => {
      activeLine = i;
      centers = Array.from(
        lines[i].querySelectorAll<HTMLElement>(".intro-word-i"),
      ).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };
    const deactivateLines = () => {
      activeLine = -1;
      const els = centers.map((c) => c.el);
      centers = [];
      if (!els.length) return;
      // The chromatic glow is subtle and the line fades right after — clearing it
      // now is invisible. The *position* is what must not snap: a hard reset of a
      // pointer-displaced word reads as a sideways slide, so ease it home.
      els.forEach((el) => {
        el.style.textShadow = el.dataset.accent ? "0 0 26px rgba(143,196,90,0.45)" : "";
      });
      gsap.to(els, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
        onComplete: () => els.forEach((el) => (el.style.transform = "")),
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      ptr.tx = e.clientX;
      ptr.ty = e.clientY;
      ptr.onT = 1;
    };
    const onLeave = () => {
      ptr.onT = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    // Driven off GSAP's ticker — the same clock Lenis is pumped from — with
    // frame-rate-independent smoothing so it stays buttery at any refresh rate.
    const smooth = (dt: number, rate: number) => 1 - Math.pow(1 - rate, dt / 16.667);

    const warpTick = (_t: number, dt: number) => {
      const kp = smooth(dt, 0.16);
      const ko = smooth(dt, 0.09);
      ptr.x += (ptr.tx - ptr.x) * kp;
      ptr.y += (ptr.ty - ptr.y) * kp;
      ptr.on += (ptr.onT - ptr.on) * ko;
      if (activeLine < 0 || !centers.length) return;

      const now = performance.now() * 0.001;

      for (let k = 0; k < centers.length; k++) {
        const { el, cx, cy } = centers[k];
        const dx = cx - ptr.x;
        const dy = cy - ptr.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const lin = Math.max(0, 1 - d / WARP_RADIUS) * ptr.on;
        const s = lin * lin * (3 - 2 * lin); // smoothstep

        // A near-imperceptible idle sway so the words feel alive between passes.
        const idle = 0.6;
        const ix = Math.sin(now * 0.9 + k * 0.7) * idle;
        const iy = Math.cos(now * 0.75 + k * 0.9) * idle;

        if (s < 0.0015) {
          el.style.transform = `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0)`;
          el.style.textShadow = el.dataset.accent ? "0 0 26px rgba(143,196,90,0.45)" : "";
          continue;
        }

        const ux = dx / d;
        const uy = dy / d;
        const push = s * 10;
        el.style.transform =
          `translate3d(${(-ux * push + ix).toFixed(2)}px, ${(-uy * push + iy).toFixed(2)}px, 0) ` +
          `scale(${(1 + s * 0.12).toFixed(3)})`;

        const ca = s * 3.2;
        el.style.textShadow =
          (el.dataset.accent ? "0 0 26px rgba(143,196,90,0.45), " : "") +
          `${ca.toFixed(2)}px 0 rgba(74,210,255,${(0.55 * s).toFixed(2)}), ` +
          `${(-ca).toFixed(2)}px 0 rgba(255,74,120,${(0.5 * s).toFixed(2)})`;
      }
    };
    gsap.ticker.add(warpTick);

    const heroVideo = () =>
      document.querySelector<HTMLVideoElement>("video.hero-video");

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

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", force3D: true },
        smoothChildTiming: true,
        paused: true, // held until the warm-start gate below
        onComplete: finish,
      });
      tlRef.current = tl;

      tl.set(root, { autoAlpha: 1 });

      // The climb: dark, low → the hero's natural grade + framing. Transform +
      // cheap colour filter only, so it composites clean for the full 7.4s.
      // Ends at identity — pixel-identical to the hero's untransformed <video>.
      // The "from" here matches the CSS initial state on .intro-media exactly,
      // so JS taking over from first paint produces no jump.
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
      // Focus rack on its own layer, resolved early so the costly full-frame
      // blur is never live for long. "from" matches .intro-focus CSS.
      tl.fromTo(
        focus,
        { filter: "blur(9px)" },
        { filter: "blur(0px)", duration: 4.4, ease: "sine.out" },
        0,
      );
      tl.fromTo(grade, { opacity: 1 }, { opacity: 0, duration: 6.9, ease: "sine.inOut" }, 0.3);
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7.0, ease: "none" }, 0);

      lines.forEach((el, i) => {
        const [tin, tout] = CUES[i];
        const words = el.querySelectorAll<HTMLElement>(".intro-word");

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
        tl.call(activateLine, [i], tin + 0.45);

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
      });

      // ── Hand-off ──────────────────────────────────────────────────────────
      // 1. Warm the hero's plate ~1s ahead (playing, roughly aligned, buffered).
      tl.call(warmHeroPlate, undefined, 6.6);
      tl.call(deactivateLines, undefined, 7.05);

      // 2. Last line eases out on its own (not yanked by the scene fade).
      const lastWords = lines[lines.length - 1].querySelectorAll<HTMLElement>(".intro-word");
      tl.to(
        lastWords,
        { opacity: 0, yPercent: -14, filter: "blur(6px)", duration: 0.8, ease: "sine.inOut", stagger: 0.04 },
        7.15,
      );

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
      tl.set(focus, { clearProps: "filter" }, 7.4);
      tl.call(freezePlates, undefined, 7.4);
      tl.to(scene, { autoAlpha: 0, duration: 0.9, ease: "sine.inOut" }, 7.55);
      tl.set(root, { pointerEvents: "none" }, 7.9);

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
      activeLine = -1;

      const words = root.querySelectorAll<HTMLElement>(".intro-word");
      const wordInners = root.querySelectorAll<HTMLElement>(".intro-word-i");
      gsap.killTweensOf([scene, bloom, media, focus, grade, bar]);
      gsap.killTweensOf(words);
      gsap.killTweensOf(wordInners);
      gsap.set(wordInners, { clearProps: "transform,textShadow" });

      warmHeroPlate();

      // A compressed version of the real wind-down, not a hard cut: the text
      // drops away, the plate *eases* to its final framing + grade on sine
      // (never a lurch), the dawn glow rises over the tail of that settle, and
      // the scene dissolves between two frozen frames into the hero. ~1.7s.
      const q = gsap.timeline({ onComplete: finish });
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
      q.to(focus, { filter: "blur(0px)", duration: 0.5, ease: "sine.inOut" }, 0);
      q.to(grade, { opacity: 0, duration: 0.6, ease: "sine.inOut" }, 0.04);
      q.fromTo(
        bloom,
        { opacity: 0, scale: 1.1 },
        { opacity: 0.9, scale: 1, duration: 0.5, ease: "sine.out" },
        0.3,
      );
      q.call(freezePlates, undefined, 0.62);
      q.to(scene, { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" }, 0.66);
      q.set(root, { pointerEvents: "none" }, 1.0);
      q.to(bloom, { opacity: 0, scale: 1.04, duration: 0.65, ease: "power1.inOut" }, 1.05);
    };

    return () => {
      window.clearTimeout(warmTimer);
      window.clearTimeout(chromeTimer);
      bailRef.current = null;
      root.removeEventListener("wheel", block);
      root.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("lenis:ready", onLenisReady);
      cancelAnimationFrame(lenisRaf);
      gsap.ticker.remove(warpTick);
        // If we unmount before the timeline releases scroll itself, undo the lock.
      if (lenisHooked && !doneRef.current) getLenis()?.start();
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

        {showChrome && (
          <>
            <div className="intro-skip-wrap">
              <LiquidMetalButton label="Skip intro" onClick={skip} width={128} height={40} />
            </div>

            <GradualBlur
              target="parent"
              position="bottom"
              height="6.5rem"
              strength={2.2}
              divCount={4}
              curve="bezier"
              exponential
              opacity={1}
            />
          </>
        )}
      </div>

      <div ref={bloomRef} className="intro-bloom" aria-hidden="true" />

      <style>{`
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
        /* Separate layer so the focus-rack blur tween never fights the climb's
           transform + colour-grade tween on .intro-media. */
        .intro-focus {
          position: absolute;
          inset: 0;
          will-change: filter;
        }
        .intro-media video {
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
          text-shadow: 0 2px 30px rgba(0, 0, 0, 0.5);
        }

        .intro-word {
          display: inline-block;
          margin: 0 0.24em 0.12em 0;
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        .intro-word-i {
          display: inline-block;
          will-change: transform;
        }
        .intro-word.is-accent .intro-word-i {
          color: #a6e06a;
          text-shadow: 0 0 26px rgba(143, 196, 90, 0.45);
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
