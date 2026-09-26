"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TOTAL_HACKATHON_SECONDS,
  formatTime,
  getActiveMilestone,
} from "@/data/shift8";
import { sound } from "@/lib/sound";
import MinimalFlipClock from "@/components/hidden/MinimalFlipClock";
import {
  Play,
  Pause,
  RotateCcw,
  Utensils,
  FastForward,
} from "lucide-react";

interface ChairCountdownProps {
  elapsedSeconds: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onJumpToSeconds: (seconds: number) => void;
  speed: number;
  onCycleSpeed: () => void;
  forcedLunch: boolean;
  onToggleLunch: () => void;
}

export default function ChairCountdown({
  elapsedSeconds,
  isRunning,
  onTogglePlay,
  onReset,
  speed,
  onCycleSpeed,
  forcedLunch,
  onToggleLunch,
}: ChairCountdownProps) {
  const remainingSeconds = Math.max(0, TOTAL_HACKATHON_SECONDS - elapsedSeconds);
  const activeMilestone = getActiveMilestone(elapsedSeconds);

  const isLunchTime = forcedLunch || activeMilestone?.isLunch;

  let lunchRemainingSec = 0;
  if (forcedLunch) {
    lunchRemainingSec = Math.max(0, 2700 - (elapsedSeconds % 2700));
  } else if (activeMilestone?.isLunch) {
    lunchRemainingSec = Math.max(0, activeMilestone.endSec - elapsedSeconds);
  }

  const { hours, minutes, seconds } = formatTime(remainingSeconds);
  const lunchTime = formatTime(lunchRemainingSec);

  const [showLunchCountdown, setShowLunchCountdown] = useState(true);

  // Play audio chime on milestone change
  const prevMilestoneRef = useRef<string | null>(null);
  useEffect(() => {
    if (activeMilestone && activeMilestone.id !== prevMilestoneRef.current) {
      prevMilestoneRef.current = activeMilestone.id;
      if (isRunning) {
        if (activeMilestone.isLunch) sound.playLunch();
        else if (activeMilestone.isCodeFreeze) sound.playAlert();
        else sound.playStart();
      }
    }
  }, [activeMilestone, isRunning]);

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* ── Soft Downward Projection Beam to the Chair ── */}
      <div
        className="pointer-events-none absolute -bottom-24 sm:-bottom-32 md:-bottom-40 left-1/2 -translate-x-1/2 w-64 sm:w-80 md:w-96 h-28 sm:h-36 md:h-44 opacity-40 transition-all duration-700"
        style={{
          background: isLunchTime
            ? "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.45) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.25) 0%, rgba(143, 196, 90, 0.1) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── Floating Main Flip Clock Board (YouTube Style) ── */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="pointer-events-auto relative px-5 py-4 sm:px-8 sm:py-6 rounded-[28px] sm:rounded-[36px] flex flex-col items-center text-center max-w-[96vw] transition-all duration-500 shadow-2xl"
        style={{
          background: "rgba(10, 12, 10, 0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: isLunchTime
            ? "1px solid rgba(245, 158, 11, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: isLunchTime
            ? "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.18)"
            : "0 24px 60px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* ── Status Pill ── */}
        <div className="mb-3 sm:mb-4 flex items-center gap-2">
          {isLunchTime ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-500/20 border border-amber-400/50 text-amber-200 animate-pulse">
              <Utensils className="w-3.5 h-3.5 text-amber-300" />
              <span>Lunch & Networking Active</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium tracking-widest uppercase bg-white/[0.08] border border-white/15 text-white/90">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRunning ? "bg-emerald-400 animate-pulse" : "bg-white/40"
                }`}
              />
              <span>
                {activeMilestone
                  ? `${activeMilestone.badge} · ${activeMilestone.timeRange}`
                  : isRunning
                  ? "SHIFT-8 HACKATHON LIVE"
                  : "READY TO LAUNCH"}
              </span>
            </div>
          )}

          {speed > 1 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40">
              {speed}X SPEED
            </span>
          )}
        </div>

        {/* ── The 3 Flip Cards (Exact https://youtu.be/7_vp-dzMilA design) ── */}
        <div className="my-1 sm:my-2">
          <MinimalFlipClock
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            isLunch={Boolean(isLunchTime)}
            lunchMinutes={lunchTime.minutes}
            lunchSeconds={lunchTime.seconds}
            showLunchCountdown={showLunchCountdown}
          />
        </div>

        {/* If lunch mode is active, allow switching between lunch countdown and total hackathon countdown */}
        {isLunchTime && (
          <div className="mt-3 flex flex-col items-center">
            <button
              onClick={() => setShowLunchCountdown(!showLunchCountdown)}
              className="text-xs font-mono text-amber-300/80 hover:text-amber-100 underline underline-offset-4 cursor-pointer transition-colors"
            >
              {showLunchCountdown
                ? `Show Total Hackathon Time (${hours}:${minutes}:${seconds})`
                : "← Show Lunch Time Remaining"}
            </button>
            <p className="mt-1 text-xs text-amber-200/70 font-mono">
              Lunch ends at 02:15 PM · Refuel & network with teams!
            </p>
          </div>
        )}

        {/* ── Action Controls Bar ── */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {/* Start / Pause Button */}
          <button
            onClick={() => {
              sound.playClick();
              onTogglePlay();
            }}
            className={`group px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 shadow-xl ${
              isRunning
                ? "bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/50 shadow-amber-500/20"
                : "bg-white hover:bg-zinc-200 text-black border border-white/80 shadow-white/20 hover:scale-105 active:scale-95"
            }`}
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Hackathon</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              sound.playClick();
              onReset();
            }}
            title="Reset timer to 8 hours"
            className="px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white/80 hover:text-white border border-white/15 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (8h)</span>
          </button>

          {/* Lunch Time Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleLunch();
            }}
            title="Toggle Lunch Time Mode"
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md ${
              isLunchTime
                ? "bg-amber-400 text-black font-semibold shadow-amber-500/40"
                : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30"
            }`}
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{isLunchTime ? "Exit Lunch" : "Lunch Time"}</span>
          </button>

          {/* Fast Forward Multiplier */}
          <button
            onClick={() => {
              sound.playClick();
              onCycleSpeed();
            }}
            title="Fast-forward speed for testing/demos"
            className="px-3 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
          >
            <FastForward className="w-3 h-3" />
            <span>{speed}x</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
