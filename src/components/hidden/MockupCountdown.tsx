"use client";

import React, { useState } from "react";
import { formatTime } from "@/data/shift8";
import { perfLite } from "@/lib/device";
import { RecursiveDigit, Sparkle } from "./RecursiveDigit";
import s from "./stage.module.css";

interface MockupCountdownProps {
  remainingSeconds: number;
  isLunchTime: boolean;
  lunchRemainingSec: number;
  isRunning: boolean;
  isCodeFreeze?: boolean;
}

/**
 * A two-digit unit. Each numeral is keyed by its value, so a change drops the
 * new one in. The drop animates an HTML wrapper, not the <svg>: Chromium will
 * not run an SVG element's animation on the compositor, so it repainted the
 * masked glyph every frame. (Smartboards swap digits without the drop; see
 * stage.module.css.)
 */
function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className={s.group}>
      <div className={s.pair}>
        {[0, 1].map((i) => (
          <span key={i} className={s.cell}>
            <span key={value[i]} className={s.digit}>
              <RecursiveDigit ch={value[i]} />
            </span>
          </span>
        ))}
      </div>
      <span className={s.label}>{label}</span>
    </div>
  );
}

/** The colon is the wordmark's sparkle; it twinkles on each second while the clock runs. */
function Colon({ running, tick }: { running: boolean; tick: string }) {
  // Re-keyed each second so the twinkle restarts. Smartboards (html.perf-lite)
  // do not twinkle (see stage.module.css), so there is nothing to restart and
  // the two sparkles are left alone instead of being rebuilt every second.
  const twinkling = running && !perfLite();
  return (
    <div className={s.colon} data-running={running ? "1" : "0"} aria-hidden="true">
      <Sparkle key={twinkling ? "a" + tick : "a"} className={`${s.colonStar} ${twinkling ? s.twinkle : ""}`} />
      <Sparkle key={twinkling ? "b" + tick : "b"} className={`${s.colonStar} ${twinkling ? s.twinkle : ""}`} />
    </div>
  );
}

export default function MockupCountdown({
  remainingSeconds,
  isLunchTime,
  lunchRemainingSec,
  isRunning,
}: MockupCountdownProps) {
  const [showTotalDuringLunch, setShowTotalDuringLunch] = useState(false);

  const { hours, minutes, seconds } = formatTime(remainingSeconds);
  const lunchFormatted = formatTime(lunchRemainingSec);

  const lunchView = isLunchTime && !showTotalDuringLunch;
  const h = lunchView ? "00" : hours;
  const m = lunchView ? lunchFormatted.minutes : minutes;
  const sec = lunchView ? lunchFormatted.seconds : seconds;
  const isAllZero = remainingSeconds <= 0;

  let headerText = "Time left to hackathon start";
  if (isAllZero) {
    headerText = "Now is the time to pack your things!! This is the END";
  } else if (lunchView) {
    headerText = "Lunch & networking time (01:30 – 02:15 PM)";
  } else if (isRunning || remainingSeconds < 28800) {
    headerText = "Time left to hackathon finish";
  }

  return (
    <div className={s.count} data-lunch={lunchView ? "1" : "0"}>
      <div className={s.eyebrow} data-end={isAllZero ? "1" : "0"}>
        {!isAllZero && <Sparkle className={s.eyebrowStar} />}
        <span key={headerText} className={s.eyebrowText}>
          {headerText}
        </span>
        {!isAllZero && <Sparkle className={s.eyebrowStar} />}
      </div>

      <div
        role="timer"
        aria-label={`${h}:${m}:${sec}`}
        data-time={`${h}:${m}:${sec}`}
        data-clickable={isLunchTime ? "1" : "0"}
        className={s.digits}
        onClick={() => {
          if (isLunchTime) setShowTotalDuringLunch(!showTotalDuringLunch);
        }}
      >
        <Unit value={h} label="HOURS" />
        <Colon running={isRunning} tick={sec} />
        <Unit value={m} label="MINUTES" />
        <Colon running={isRunning} tick={sec} />
        <Unit value={sec} label="SECONDS" />
      </div>
    </div>
  );
}
