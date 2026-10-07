"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import MockupCountdown from "@/components/hidden/MockupCountdown";
import MockupScheduleCard, {
  getActiveMockupMilestone,
} from "@/components/hidden/MockupScheduleCard";
import NowStatusBadge from "@/components/hidden/NowStatusBadge";
import StageScene from "@/components/hidden/StageScene";
import { primeStageVideo } from "@/components/hidden/stage-video";
import { stageSans } from "@/components/hidden/stage-font";
import stage from "@/components/hidden/stage.module.css";
import { TOTAL_HACKATHON_SECONDS, getActiveMilestone } from "@/data/shift8";
import {
  CountdownSyncState,
  CountdownAction,
  DEFAULT_COUNTDOWN_STATE,
  computeElapsedSeconds,
  applyCountdownAction,
} from "@/lib/countdown-sync";
import { EVENT } from "@/data/hackathon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";

const UI_FONT = "var(--font-stage), var(--font-dm-sans), sans-serif";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

const PASSWORD = "@recursive#26";

/**
 * Unlocking is remembered on this device until Log out, so a refresh (or a
 * board that reloads) goes straight back to the stage. What is stored is a
 * fingerprint of the password, not the password, and a new PASSWORD has a
 * new fingerprint, so changing it signs every device out.
 */
const AUTH_KEY = "recursive:stage-auth";
const AUTH_TOKEN = (() => {
  let h = 0x811c9dc5; // FNV-1a
  for (let i = 0; i < PASSWORD.length; i++) {
    h ^= PASSWORD.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return "v1-" + h.toString(16);
})();

function rememberedLogin(): boolean {
  try {
    return window.localStorage.getItem(AUTH_KEY) === AUTH_TOKEN;
  } catch {
    return false; // storage blocked (private mode, locked-down kiosk): ask every time
  }
}

function rememberLogin(on: boolean) {
  try {
    if (on) window.localStorage.setItem(AUTH_KEY, AUTH_TOKEN);
    else window.localStorage.removeItem(AUTH_KEY);
  } catch {
    // not remembered; the session itself still works
  }
}

/**
 * The clock reads TOTAL - floor(remaining) = TOTAL - ceil(elapsed), so a state
 * that holds whole seconds shows exactly the same digits as one that holds
 * milliseconds, and the page only has to render when a second rolls over
 * (it used to render 20 times a second, 19 of them to change nothing).
 */
const wholeSecond = (seconds: number) => Math.ceil(seconds - 1e-6);

/** The cover-fit plate's proportions (the video is 1024 x 571 of useful picture). */
const PLATE_ASPECT = 1024 / 571;

/**
 * Where everything on the stage goes, in pixels, for a visible area of w x h.
 *
 * This used to be CSS built on vw/vh and min()/max(). Two problems: on Android
 * browsers 100vh is the viewport with the toolbar *hidden*, so while a toolbar
 * shows (it does on most smartboard browsers) the bottom of the stage hangs off
 * the screen until the page is scrolled; and old engines need a script to
 * evaluate min()/max() at all. The area is measured instead (see useVisibleBox)
 * and the layout is plain numbers.
 */
function stageVars(w: number, h: number): React.CSSProperties {
  const stageW = Math.max(w, h * PLATE_ASPECT);
  const stageH = Math.max(h, w / PLATE_ASPECT);
  // one stage pixel: 1 at a 1600px-wide plate, and never so big that a narrow or very wide window crops the clock
  const u = Math.min(stageW / 1600, w / 760, h / 820);
  // the schedule card rests on the hill, but never below the bottom of the visible area
  const cardTop = Math.min(0.7 * stageH, 0.5 * stageH + h / 2 - u * 236);
  // the NOW caption may run up to the visible area's right edge
  const nowMax = Math.max(0, w / 2 - 0.052 * stageW - 12);
  return {
    "--stage-w": `${stageW}px`,
    "--stage-h": `${stageH}px`,
    "--u": `${u}px`,
    "--card-top": `${cardTop}px`,
    "--now-max": `${nowMax}px`,
  } as React.CSSProperties;
}

/**
 * The size of the area the page can actually draw in. The element is
 * position: fixed, which browsers size to the *visible* viewport (toolbar
 * showing or not), and it is re-read on every resize of it.
 */
function useVisibleBox(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !active) return undefined;
    const read = () => {
      const w = el.clientWidth;
      const h = Math.min(el.clientHeight, window.innerHeight || el.clientHeight);
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }));
    };
    read();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(read) : null;
    ro?.observe(el);
    window.addEventListener("resize", read);
    window.addEventListener("orientationchange", read);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", read);
      window.removeEventListener("orientationchange", read);
    };
  }, [ref, active]);
  return box;
}

export default function HiddenChairPage() {
  const router = useRouter();

  // Authentication gate: null until this device's remembered login is read
  // (storage only exists in the browser), then true/false.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.removeItem("chair_auth"); // the old per-tab flag
    } catch {}
    setIsAuthenticated(rememberedLogin());
  }, []);

  const handlePassSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputEl = document.getElementById("pass-input") as HTMLInputElement | null;
    const val = inputEl ? inputEl.value : passInput;
    if (val === PASSWORD || passInput === PASSWORD) {
      // Still inside the Enter press: browsers that gate every play() on a
      // gesture accept it now, and not once the stage has mounted.
      primeStageVideo();
      rememberLogin(true);
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  // Log out takes two taps (the first arms it for 3 s), so a stray touch on a
  // smartboard does not drop the stage to the password screen mid-event.
  useEffect(() => {
    if (!confirmLogout) return undefined;
    const t = window.setTimeout(() => setConfirmLogout(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirmLogout]);

  const handleLogout = () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }
    rememberLogin(false);
    setConfirmLogout(false);
    setPassInput("");
    setShowPass(false);
    setIsAuthenticated(false);
  };

  // Timer State (Server-Authoritative Synchronization across all devices)
  const serverStateRef = useRef<CountdownSyncState>(DEFAULT_COUNTDOWN_STATE);
  const serverOffsetRef = useRef<number>(0);
  const firstSyncRef = useRef<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [forcedLunch, setForcedLunch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Sync state from server response
  const applyServerSync = useCallback(
    (state: CountdownSyncState, serverTime: number, serverElapsed: number) => {
      // ── Version guard ────────────────────────────────────────────────────
      // Reject stale/out-of-order responses. An older version can arrive when
      // two rapid actions (e.g. reset then start) race through the network.
      if (state.version < serverStateRef.current.version) return;

      // ── Server-clock offset (EMA smoothed) ───────────────────────────────
      // Raw offset = how far server time is from local time (network latency included).
      // We use an exponential moving average (α = 0.15) so that latency spikes
      // don't cause visible time jumps in the 50ms tick loop.
      const rawOffset = serverTime - Date.now();
      if (firstSyncRef.current) {
        serverOffsetRef.current = rawOffset; // first sample: use raw directly
        firstSyncRef.current = false;
      } else {
        serverOffsetRef.current = serverOffsetRef.current * 0.85 + rawOffset * 0.15;
      }

      serverStateRef.current = state;
      setIsRunning(state.isRunning);
      setSpeed(state.speed);
      setForcedLunch(state.forcedLunch);

      if (!state.isRunning) {
        // Paused/reset: snap elapsed to the exact server value immediately.
        setElapsedSeconds(wholeSecond(state.accumulatedSeconds));
      } else {
        // Running: only correct the display if drift vs. server is significant
        // (> 2 s). Small differences are absorbed by the 50 ms local tick so
        // the display stays smooth without constant polling-induced jumps.
        const localElapsed = computeElapsedSeconds(state, Date.now() + serverOffsetRef.current);
        if (Math.abs(serverElapsed - localElapsed) > 2.0) {
          setElapsedSeconds(wholeSecond(serverElapsed));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Poll server state
  const fetchSyncState = useCallback(async () => {
    try {
      const res = await fetch("/api/countdown", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.state) {
        applyServerSync(data.state, data.serverTime, data.elapsedSeconds ?? 0);
      }
    } catch {
      // Ignore network errors during polling
    }
  }, [applyServerSync]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSyncState();
  }, [fetchSyncState]);

  // Periodic polling for multi-device sync (every 800ms). A tab nobody can
  // see does not poll (each poll is a server call); it catches up the moment
  // it is shown again.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) fetchSyncState();
    }, 800);
    const onShow = () => {
      if (!document.hidden) fetchSyncState();
    };
    document.addEventListener("visibilitychange", onShow);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [fetchSyncState]);

  // Local tick: sleeps until the clock's next whole second, then renders once.
  // (A 50ms interval used to re-render the whole stage 20 times a second for a
  // display that changes once; on a smartboard that alone kept the CPU busy.)
  // Restarted whenever the run state or speed changes, so a start is instant.
  useEffect(() => {
    if (!isRunning) return undefined;
    let timer = 0;
    const tick = () => {
      const state = serverStateRef.current;
      if (!state.isRunning) return;

      const cur = computeElapsedSeconds(state, Date.now() + serverOffsetRef.current);
      const whole = wholeSecond(cur);
      setElapsedSeconds(whole);
      if (cur >= TOTAL_HACKATHON_SECONDS) {
        setIsRunning(false);
        return;
      }
      // elapsed advances `speed` seconds per real second; the next whole second is this far off
      const wait = ((whole + 1e-6 - cur) / Math.max(1, state.speed)) * 1000 + 4;
      timer = window.setTimeout(tick, Math.max(8, wait));
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [isRunning, speed]);

  // Dispatch action to server with optimistic update for 0ms latency
  const dispatchAction = useCallback(async (action: CountdownAction) => {
    const serverNow = Date.now() + serverOffsetRef.current;
    const before = serverStateRef.current;
    const optimistic = applyCountdownAction(before, action, serverNow);
    // Apply optimistic update immediately so the UI feels instant
    serverStateRef.current = optimistic;
    setIsRunning(optimistic.isRunning);
    setSpeed(optimistic.speed);
    setForcedLunch(optimistic.forcedLunch);
    if (!optimistic.isRunning) {
      setElapsedSeconds(wholeSecond(optimistic.accumulatedSeconds));
    }

    try {
      const res = await fetch("/api/countdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.state) {
          // Reconcile with authoritative server response
          applyServerSync(data.state, data.serverTime, data.elapsedSeconds ?? 0);
        }
        return;
      }
      console.error("[countdown] The server did not take the action:", res.status);
    } catch (err) {
      console.error("[countdown] Failed to dispatch action:", err);
    }
    // The change never reached the server (bad connection, store down). Undo
    // the optimistic copy, whose higher version would otherwise make this
    // device ignore the server's real state, and show what the server has.
    if (serverStateRef.current === optimistic) serverStateRef.current = before;
    fetchSyncState();
  }, [applyServerSync, fetchSyncState]);

  // This page never scrolls, but the site-wide scroll engine (mounted in the root
  // layout) keeps itself busy anyway: ScrollTrigger re-requests an animation frame
  // forever, and so does GSAP's ticker, which makes the browser run a full frame
  // 60 times a second. On a smartboard that more than doubled the frames it had
  // to produce for a clock that changes once a second. Put both to sleep here
  // (GSAP wakes its ticker by itself if a tween is ever started); wake them when
  // leaving, so the home page's animations are exactly as they were.
  useEffect(() => {
    getLenis()?.stop();
    ScrollTrigger.disable();
    gsap.ticker.sleep();
    return () => {
      ScrollTrigger.enable();
      gsap.ticker.wake();
      getLenis()?.start();
    };
  }, []);

  // The stage covers the viewport and never scrolls; the home page's fixed cloud
  // backdrop behind it is a viewport-sized layer nobody can see (see globals.css).
  useEffect(() => {
    document.documentElement.classList.add("stage-page");
    return () => document.documentElement.classList.remove("stage-page");
  }, []);

  // Handle URL param jump if provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("t") || params.get("elapsed");
      if (t !== null && !isNaN(Number(t))) {
        dispatchAction({ type: "set", elapsedSeconds: Number(t) });
      }
    }
  }, [dispatchAction]);

  const remainingSeconds = Math.max(0, TOTAL_HACKATHON_SECONDS - elapsedSeconds);
  const activeMilestone = getActiveMilestone(elapsedSeconds);
  const isLunchTime = forcedLunch || activeMilestone?.isLunch;
  const activeMockupMilestone = getActiveMockupMilestone(elapsedSeconds, forcedLunch);

  // Inside the scheduled lunch slot, count down to its end, however lunch was
  // started: forcing it (L, or the Lunch row) jumps the clock to 01:30, where
  // the 45-minute cycle below would have read 15 minutes left.
  let lunchRemainingSec = 0;
  if (activeMilestone?.isLunch) {
    lunchRemainingSec = Math.max(0, activeMilestone.endSec - elapsedSeconds);
  } else if (forcedLunch) {
    lunchRemainingSec = Math.max(0, 2700 - (elapsedSeconds % 2700));
  }

  // Controls Handlers (all synchronized via dispatchAction)
  const handleTogglePlay = useCallback(() => {
    dispatchAction({ type: isRunning ? "pause" : "start" });
  }, [isRunning, dispatchAction]);

  const handleReset = useCallback(() => {
    dispatchAction({ type: "reset" });
  }, [dispatchAction]);

  const handleToggleLunch = useCallback(() => {
    dispatchAction({ type: "toggleLunch" });
  }, [dispatchAction]);

  const handleSelectMilestone = useCallback((sec: number, isLunch?: boolean) => {
    dispatchAction({ type: "set", elapsedSeconds: sec, forcedLunch: Boolean(isLunch) });
  }, [dispatchAction]);

  const handleCycleSpeed = useCallback(() => {
    const nextSpeed = speed === 1 ? 10 : speed === 10 ? 60 : 1;
    dispatchAction({ type: "speed", speed: nextSpeed });
  }, [speed, dispatchAction]);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAuthenticated) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        handleToggleLunch();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowControls((prev) => !prev);
      } else if (e.key === "Escape") {
        if (!document.fullscreenElement) {
          try { sessionStorage.setItem("recursive:skip-intro-for-anchor", "1"); } catch {}
          router.push("/?intro=0#hero");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, handleTogglePlay, handleToggleLunch, handleReset, toggleFullscreen, router]);

  const box = useVisibleBox(rootRef, isAuthenticated === true);

  // Not known yet (the first paint, before storage is read): the gate's
  // background alone, so a remembered device does not flash the password box.
  if (isAuthenticated === null) {
    return <div className="fixed inset-0" style={{ background: "#0A0D0A" }} />;
  }

  // Password Gate
  if (!isAuthenticated) {
    return (
      <div
        className={`${stageSans.variable} fixed inset-0 overflow-hidden bg-[#0A0D0A] flex flex-col items-center justify-center text-white select-none`}
        style={{ background: "#0A0D0A" }}
      >
        {/* Back Link */}
        <Link
          href="/?intro=0#hero"
          onClick={() => {
            try { sessionStorage.setItem("recursive:skip-intro-for-anchor", "1"); } catch {}
          }}
          className="absolute top-4 left-5 flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {EVENT.name}</span>
        </Link>

        {/* Minimal Password Prompt */}
        <form
          onSubmit={handlePassSubmit}
          className="flex flex-col items-center gap-3 p-6"
          style={{ fontFamily: UI_FONT }}
        >
          <div className="flex items-center gap-3">
            <label
              htmlFor="pass-input"
              className="text-sm tracking-wider text-zinc-300 font-bold whitespace-nowrap"
            >
              Enter Pass:
            </label>
            <div className="relative flex items-center">
              <input
                id="pass-input"
                type={showPass ? "text" : "password"}
                autoFocus
                autoComplete="off"
                value={passInput}
                onChange={(e) => {
                  setPassInput(e.target.value);
                  if (passError) setPassError(false);
                }}
                className={`w-52 sm:w-60 px-4 py-2 rounded-lg bg-zinc-900/90 border text-base font-mono text-white outline-none transition-all pr-9 placeholder:text-lg placeholder:tracking-widest placeholder:text-zinc-500 ${
                  passError
                    ? "border-red-500/80 ring-1 ring-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                    : "border-zinc-700/80 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/50"
                }`}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors cursor-pointer"
                title={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              className="px-2 py-1.5 bg-transparent hover:bg-transparent border-0 text-sm font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              Enter
            </button>
          </div>

          {passError && (
            <p className="text-xs font-semibold text-red-400 tracking-wide mt-1">
              Incorrect password. Try again.
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`${stageSans.variable} fixed inset-0 overflow-hidden bg-black text-white select-none`}
      style={{ touchAction: "none" }}
    >
      {/* ── The chair on the hill, lit for the hackathon's hour: 10:00 morning -> 18:00 dusk ── */}
      <StageScene hour={10 + elapsedSeconds / 3600} />

      {/* ── Subtle Floating Controls Bar ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-4 right-4 z-40 flex items-center justify-between pointer-events-none"
          >
            {/* Back Link */}
            <Link
              href="/?intro=0#hero"
              onClick={() => {
                try { sessionStorage.setItem("recursive:skip-intro-for-anchor", "1"); } catch {}
              }}
              className="pointer-events-auto group flex items-center gap-2 px-2 py-1.5 rounded-full bg-transparent hover:bg-black/20 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-all cursor-pointer active:scale-95"
              style={{
                fontFamily: UI_FONT,
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-white" />
              <span>Back to {EVENT.name}</span>
            </Link>

            {/* Quick Action Tools */}
            <div className="pointer-events-auto flex items-center gap-2">
              {/* Start / Pause Button */}
              <button
                id="toggle-play-btn"
                data-action={isRunning ? "pause" : "start"}
                onClick={handleTogglePlay}
                title={isRunning ? "Pause Countdown (Space)" : "Start Countdown (Space)"}
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 bg-transparent hover:bg-black/20 ${
                  isRunning
                    ? "text-amber-300"
                    : "text-white/90 hover:text-white"
                }`}
                style={{
                  fontFamily: UI_FONT,
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)",
                }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                id="reset-btn"
                onClick={handleReset}
                title="Reset to 8 Hours (R)"
                className="p-1.5 rounded-full bg-transparent hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)" }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Toggle */}
              <button
                onClick={handleCycleSpeed}
                title="Speed Multiplier for Demos"
                className="px-2 py-1.5 rounded-full bg-transparent hover:bg-black/20 text-white/70 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)" }}
              >
                {speed}x
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen Stage (F)"}
                className="p-1.5 rounded-full bg-transparent hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)" }}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>

              {/* Log out of this device (two taps) */}
              <button
                id="logout-btn"
                onClick={handleLogout}
                title={confirmLogout ? "Tap again to log out" : "Log out of this device"}
                className={`px-2 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors bg-transparent hover:bg-black/20 ${
                  confirmLogout ? "text-red-300" : "text-white/70 hover:text-white"
                }`}
                style={{
                  fontFamily: UI_FONT,
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)",
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{confirmLogout ? "Tap again to log out" : "Log out"}</span>
              </button>

              {/* Hide Controls Button */}
              <button
                onClick={() => setShowControls(false)}
                title="Hide Controls (Press H to toggle)"
                className="p-1.5 rounded-full bg-transparent hover:bg-black/20 text-white/50 hover:text-white transition-colors cursor-pointer"
                style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)" }}
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button to restore controls if hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          title="Show Controls (H)"
          className="absolute top-3 right-4 z-40 p-2 rounded-full bg-transparent hover:bg-black/20 text-white/60 hover:text-white transition-colors cursor-pointer"
          style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)" }}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ── Overlay locked to the cover-fit plate, so it tracks the chair at any size ── */}
      {box.w > 0 && (
      <div className={stage.stage} style={stageVars(box.w, box.h)}>
        {/* Countdown in the sky above the chair */}
        <div className={`${stage.anchor} ${stage.atCount}`}>
          <MockupCountdown
            remainingSeconds={remainingSeconds}
            isLunchTime={Boolean(isLunchTime)}
            lunchRemainingSec={lunchRemainingSec}
            isRunning={isRunning}
            isCodeFreeze={activeMockupMilestone?.id === "code-freeze"}
          />
        </div>

        {/* Schedule resting on the hill */}
        <div className={`${stage.anchor} ${stage.atCard}`}>
          <MockupScheduleCard
            elapsedSeconds={elapsedSeconds}
            isLunchActive={Boolean(isLunchTime)}
            activeId={activeMockupMilestone.id}
            onSelectMilestone={handleSelectMilestone}
          />
        </div>

        {/* NOW caption beside the chair */}
        <div className={`${stage.anchor} ${stage.atNow}`}>
          <NowStatusBadge item={activeMockupMilestone} isLunchActive={Boolean(isLunchTime)} />
        </div>
      </div>
      )}
    </div>
  );
}
