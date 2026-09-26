"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HACKATHON_SCHEDULE, Milestone } from "@/data/shift8";
import { sound } from "@/lib/sound";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface ScheduleTimelineProps {
  elapsedSeconds: number;
  onJumpToMilestone: (milestone: Milestone) => void;
  forcedLunch: boolean;
}

export default function ScheduleTimeline({
  elapsedSeconds,
  onJumpToMilestone,
  forcedLunch,
}: ScheduleTimelineProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 z-20">
      {/* ── Header Pill ── */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-accent-bright,#8FC45A)] ring-2 ring-white/50"
            aria-hidden="true"
          />
          <span
            className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.14em] uppercase text-[var(--color-accent-bright,#8FC45A)]"
          >
            Shift-8 Master Schedule
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 text-[11px] font-mono text-white/70 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-sm"
        >
          <span>{isCollapsed ? "Expand Schedule" : "Collapse"}</span>
          {isCollapsed ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ── Milestone Cards ── */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-2.5"
          >
            {HACKATHON_SCHEDULE.map((item, index) => {
              const isPast = elapsedSeconds >= item.endSec;
              const isLive =
                (item.isLunch && forcedLunch) ||
                (elapsedSeconds >= item.startSec && elapsedSeconds < item.endSec);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onJumpToMilestone(item);
                  }}
                  title={`Jump countdown to ${item.shortTitle}`}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                    isLive
                      ? item.isLunch
                        ? "border-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.35)] scale-[1.02]"
                        : "border-[var(--color-accent-bright,#8FC45A)] shadow-[0_0_24px_rgba(143,196,90,0.35)] scale-[1.02]"
                      : isPast
                      ? "border-white/10 opacity-65 hover:opacity-100 hover:border-white/25"
                      : "border-white/15 hover:border-white/30"
                  }`}
                  style={{
                    background: isLive
                      ? item.isLunch
                        ? "linear-gradient(180deg, rgba(42, 28, 12, 0.85) 0%, rgba(22, 14, 6, 0.92) 100%)"
                        : "linear-gradient(180deg, rgba(20, 36, 22, 0.85) 0%, rgba(10, 18, 12, 0.92) 100%)"
                      : "linear-gradient(180deg, rgba(16, 27, 18, 0.6) 0%, rgba(8, 14, 9, 0.75) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <div>
                    {/* Timestamp & Status Pill */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          className={`w-3 h-3 ${
                            isLive
                              ? item.isLunch
                                ? "text-amber-300"
                                : "text-[var(--color-accent-bright,#8FC45A)]"
                              : "text-white/40"
                          }`}
                        />
                        <span
                          className="text-[11px] font-mono font-medium tracking-wide"
                          style={{
                            color: isLive
                              ? item.isLunch
                                ? "#FDE68A"
                                : "var(--color-accent-bright, #8FC45A)"
                              : "var(--color-night-text, #EEF5E6)",
                          }}
                        >
                          {item.timeRange}
                        </span>
                      </div>

                      {isLive ? (
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            item.isLunch
                              ? "bg-amber-400 text-black shadow-sm"
                              : "bg-[var(--color-accent-bright,#8FC45A)] text-black shadow-sm"
                          }`}
                        >
                          LIVE
                        </span>
                      ) : isPast ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-bright,#8FC45A)] opacity-70" />
                      ) : (
                        <span className="text-[9px] font-mono text-white/35">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-xs sm:text-sm font-medium tracking-tight line-clamp-2 transition-colors ${
                        isLive
                          ? item.isLunch
                            ? "text-amber-100"
                            : "text-white"
                          : "text-white/85 group-hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Jump action hint */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 group-hover:text-white/80 transition-colors">
                    <span className="text-white/40">
                      {item.isLunch ? "45 mins" : "Stage"}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-accent-bright,#8FC45A)]">
                      Jump →
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
