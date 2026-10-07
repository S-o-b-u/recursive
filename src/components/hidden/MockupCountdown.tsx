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
 * One numeral. On a change the old numeral slides down and out while the new
 * one drops in from above, like a rolling counter; both are keyed by the
 * change count so each change replays the pair. The motion is on HTML
 * wrappers, not the <svg>: Chromium will not run an SVG element's animation
 * on the compositor, so it repainted the masked glyph every frame.
 * (Smartboards swap numerals without either motion; see stage.module.css.)
 */
function Cell({ ch }: { ch: string }) {
  const [roll, setRoll] = useState({ cur: ch, old: null as string | null, n: 0 });
  if (roll.cur !== ch) setRoll({ cur: ch, old: roll.cur, n: roll.n + 1 }); // derived from the previous render
  return (
    <span className={s.cell}>
      {roll.old !== null && !perfLite() && (
        <span key={"out" + roll.n} className={s.digitOut} aria-hidden="true">
          <RecursiveDigit ch={roll.old} />
        </span>
      )}
      <span key={"in" + roll.n} className={s.digit}>
        <RecursiveDigit ch={ch} />
      </span>
    </span>
  );
}

/** A two-digit unit. */
function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className={s.group}>
      <div className={s.pair}>
        <Cell ch={value[0]} />
        <Cell ch={value[1]} />
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
