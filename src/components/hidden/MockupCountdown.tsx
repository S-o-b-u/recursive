"use client";

import React, { useState } from "react";
import { formatTime, LUNCH_SLOT, SUBMISSION_SLOT, TOTAL_HACKATHON_SECONDS } from "@/data/shift8";
import { perfLite } from "@/lib/device";
import { RecursiveDigit, Sparkle } from "./RecursiveDigit";
import s from "./stage.module.css";

/**
 * A slot with a countdown of its own, shown in place of the total while it
 * runs (a tap on the digits shows the total instead): lunch, and the final
 * submission window, which counts down to the submission deadline.
 */
export type CountdownWindow = { kind: "lunch" | "submit"; remainingSec: number };

const WINDOW_HEADING: Record<CountdownWindow["kind"], string> = {
  lunch: `Lunch & networking time (${LUNCH_SLOT.timeRange} PM)`,
  submit: `Final submission open · deadline ${SUBMISSION_SLOT.timeRange.split("–").pop()?.trim()} PM`,
};

interface MockupCountdownProps {
  remainingSeconds: number;
  slot: CountdownWindow | null;
  isRunning: boolean;
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
  slot,
  isRunning,
}: MockupCountdownProps) {
  // which slot's countdown was tapped away to show the total
  const [totalFor, setTotalFor] = useState<CountdownWindow["kind"] | null>(null);

  const isAllZero = remainingSeconds <= 0;
  const slotView = slot && !isAllZero && totalFor !== slot.kind ? slot : null;
  const { hours: h, minutes: m, seconds: sec } = formatTime(slotView ? slotView.remainingSec : remainingSeconds);

  let headerText = "Time left to hackathon start";
  if (isAllZero) {
    headerText = "Now is the time to pack your things!! This is the END";
  } else if (slotView) {
    headerText = WINDOW_HEADING[slotView.kind];
  } else if (isRunning || remainingSeconds < TOTAL_HACKATHON_SECONDS) {
    headerText = "Time left to hackathon finish";
  }

  return (
    <div className={s.count} data-window={slotView ? slotView.kind : "none"}>
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
        data-clickable={slot ? "1" : "0"}
        className={s.digits}
        onClick={() => {
          if (slot) setTotalFor(totalFor === slot.kind ? null : slot.kind);
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
