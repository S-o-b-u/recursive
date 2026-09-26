"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import MockupCountdown from "@/components/hidden/MockupCountdown";
import MockupScheduleCard, {
  getActiveMockupMilestone,
} from "@/components/hidden/MockupScheduleCard";
import NowStatusBadge from "@/components/hidden/NowStatusBadge";
import SeamlessBackgroundVideo from "@/components/hidden/SeamlessBackgroundVideo";
import { TOTAL_HACKATHON_SECONDS, getActiveMilestone } from "@/data/shift8";
import {
  CountdownSyncState,
  CountdownAction,
  DEFAULT_COUNTDOWN_STATE,
  computeElapsedSeconds,
  applyCountdownAction,
} from "@/lib/countdown-sync";
import { EVENT } from "@/data/hackathon";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
} from "lucide-react";

const PASSWORD = "@recursive#26";

export default function HiddenChairPage() {
  const router = useRouter();

  // Authentication Gate State - Always prompts on every entry
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("chair_auth");
    }
  }, []);

  const handlePassSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputEl = document.getElementById("pass-input") as HTMLInputElement | null;
    const val = inputEl ? inputEl.value : passInput;
    if (val === PASSWORD || passInput === PASSWORD) {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  // Timer State (Server-Authoritative Synchronization across all devices)
  const serverStateRef = useRef<CountdownSyncState>(DEFAULT_COUNTDOWN_STATE);
  const serverOffsetRef = useRef<number>(0);
  const firstSyncRef = useRef<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
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
        setElapsedSeconds(state.accumulatedSeconds);
      } else {
        // Running: only correct the display if drift vs. server is significant
        // (> 2 s). Small differences are absorbed by the 50 ms local tick so
        // the display stays smooth without constant polling-induced jumps.
        const localElapsed = computeElapsedSeconds(state, Date.now() + serverOffsetRef.current);
        if (Math.abs(serverElapsed - localElapsed) > 2.0) {
          setElapsedSeconds(serverElapsed);
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

  // Periodic polling for multi-device sync (every 800ms)
  useEffect(() => {
    const interval = setInterval(fetchSyncState, 800);
    return () => clearInterval(interval);
  }, [fetchSyncState]);

  // Smooth local tick loop with sub-second precision
  useEffect(() => {
    const interval = setInterval(() => {
      const state = serverStateRef.current;
      if (!state.isRunning) return;

      const serverNow = Date.now() + serverOffsetRef.current;
      const cur = computeElapsedSeconds(state, serverNow);
      setElapsedSeconds(cur);
      if (cur >= TOTAL_HACKATHON_SECONDS) {
        setIsRunning(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Dispatch action to server with optimistic update for 0ms latency
  const dispatchAction = useCallback(async (action: CountdownAction) => {
    const serverNow = Date.now() + serverOffsetRef.current;
    const optimistic = applyCountdownAction(serverStateRef.current, action, serverNow);
    // Apply optimistic update immediately so the UI feels instant
    serverStateRef.current = optimistic;
    setIsRunning(optimistic.isRunning);
    setSpeed(optimistic.speed);
    setForcedLunch(optimistic.forcedLunch);
    if (!optimistic.isRunning) {
      setElapsedSeconds(optimistic.accumulatedSeconds);
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
      }
    } catch (err) {
      console.error("[countdown] Failed to dispatch action:", err);
    }
  }, [applyServerSync]);

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

  let lunchRemainingSec = 0;
  if (forcedLunch) {
    lunchRemainingSec = Math.max(0, 2700 - (elapsedSeconds % 2700));
  } else if (activeMilestone?.isLunch) {
    lunchRemainingSec = Math.max(0, activeMilestone.endSec - elapsedSeconds);
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

  // Password Gate
  if (!isAuthenticated) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#0A0D0A] flex flex-col items-center justify-center text-white select-none">
        {/* Back Link */}
        <Link
          href="/?intro=0#hero"
          onClick={() => {
            try { sessionStorage.setItem("recursive:skip-intro-for-anchor", "1"); } catch {}
          }}
          className="absolute top-4 left-5 flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {EVENT.name}</span>
        </Link>

        {/* Minimal Password Prompt */}
        <form
          onSubmit={handlePassSubmit}
          className="flex flex-col items-center gap-3 p-6"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          <div className="flex items-center gap-3">
            <label
              htmlFor="pass-input"
              className="text-sm font-mono tracking-wider text-zinc-300 font-semibold whitespace-nowrap"
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
              className="px-2 py-1.5 bg-transparent hover:bg-transparent border-0 text-sm font-mono font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              Enter
            </button>
          </div>

          {passError && (
            <p className="text-xs font-mono text-red-400 tracking-wide mt-1">
              Incorrect password. Try again.
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white select-none">
      {/* ── Seamless Dual-Buffer Background Video with the Chair on the Hill ── */}
      <SeamlessBackgroundVideo
        src="/videos/hackathon-chair-seamless.mp4"
        poster="/videos/chair-poster.jpg"
      />

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
                fontFamily: "var(--font-dm-sans), sans-serif",
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
                  fontFamily: "var(--font-dm-sans), sans-serif",
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

      {/* ── EXACT POSITIONING 16:9 STAGE MATCHING MOCKUP (media_1790452367835.jpg) ── */}
      {/* 
        This stage scales and anchors in exact lockstep with the background video,
        preserving pixel-perfect placement relative to the solitary chair across
        any screen size, resolution, and aspect ratio.
      */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "max(100vw, calc(100vh * (1024 / 571)))",
          height: "max(100vh, calc(100vw / (1024 / 571)))",
        }}
      >
        {/* 1. Countdown Section (Title + Digits + Labels) at Top = 28.5%, Center X = 50.39% */}
        <div
          className="absolute pointer-events-auto"
          style={{
            top: "28.5%",
            left: "50.39%",
            transform: "translateX(-50%)",
          }}
        >
          <MockupCountdown
            remainingSeconds={remainingSeconds}
            isLunchTime={Boolean(isLunchTime)}
            lunchRemainingSec={lunchRemainingSec}
            isRunning={isRunning}
            isCodeFreeze={activeMockupMilestone?.id === "code-freeze"}
          />
        </div>

        {/* 2. Schedule Card at Top = 70%, Center X = 49.90% resting lower on the grassy hill */}
        <div
          className="absolute pointer-events-auto"
          style={{
            top: "70%",
            left: "49.90%",
            transform: "translateX(-50%)",
          }}
        >
          <MockupScheduleCard
            elapsedSeconds={elapsedSeconds}
            isLunchActive={Boolean(isLunchTime)}
            onSelectMilestone={handleSelectMilestone}
          />
        </div>

        {/* 3. Now Status Badge on the right side of the chair */}
        <div
          className="absolute pointer-events-auto"
          style={{
            top: "51.8%",
            left: "55.2%",
            transform: "translateY(-50%)",
          }}
        >
          <NowStatusBadge
            item={activeMockupMilestone}
            isLunchActive={Boolean(isLunchTime)}
          />
        </div>


      </div>
    </div>
  );
}
