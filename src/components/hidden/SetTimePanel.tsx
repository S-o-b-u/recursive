"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DAY_END_SEC,
  DAY_START_SEC,
  TOTAL_HACKATHON_SECONDS,
  elapsedForTimeOfDay,
  eventTimeOfDay,
  formatTime,
  formatTimeOfDay,
  getActiveMilestone,
} from "@/data/shift8";
import s from "./settime.module.css";

interface SetTimePanelProps {
  /** Where the countdown is now (elapsed seconds): the clock opens at that time of day. */
  elapsedNow: number;
  /** The server's clock (epoch ms), as this screen keeps it in sync. */
  serverNow: () => number;
  /** Put every screen at this point of the day, running or paused. */
  onApply: (elapsedSeconds: number, resume: boolean) => void;
  onClose: () => void;
}

const clampDay = (t: number) => Math.min(DAY_END_SEC, Math.max(DAY_START_SEC, Math.round(t)));

/**
 * How much bigger than its base size the panel is drawn: up to 1.5x on a
 * large screen. A smartboard shows the page 1920 CSS px wide on a 75-86" panel
 * and is worked by finger at arm's length, so the dial and the buttons grow
 * with the screen; a laptop or a phone keeps the base size. The panel never
 * outgrows the screen's height.
 */
function panelScale() {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth || 1280;
  const h = window.innerHeight || 720;
  return Math.max(1, Math.min(1.5, w / 1366, (h - 40) / 620));
}

/**
 * A clock hour (1-12) as the one hour of the event day it can mean: 9-11 are
 * morning, 12-4 afternoon. 5 to 8 never happen during hacking (null).
 */
function eventHour(h12: number): number | null {
  if (h12 >= 9 && h12 <= 11) return h12;
  if (h12 === 12) return 12;
  if (h12 >= 1 && h12 <= 4) return h12 + 12;
  return null;
}

/** Degrees clockwise from 12 o'clock of a pointer, around the dial's centre. */
function pointerOnDial(svg: SVGSVGElement, e: React.PointerEvent) {
  const r = svg.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  return {
    angle: ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360,
    reach: Math.hypot(dx, dy) / (r.width / 2), // 1 = the dial's edge
  };
}

/**
 * Set time: put the shared countdown at a time of the hackathon day, for when
 * something went wrong (a screen was off, the clock was paused by mistake,
 * the event slipped). The analog clock is set like a watch: the long hand
 * (grab near the rim) sets the minutes and carries the hour past 12, the
 * short hand (grab near the centre) sets the hour. The arrows set exact
 * hours, minutes and seconds. "Now" follows the real time in Kolkata, read
 * from the server's clock, so a board with a wrong clock or time zone does
 * not matter. Only 9:30 AM - 4:30 PM can be chosen.
 */
export default function SetTimePanel({ elapsedNow, serverNow, onApply, onClose }: SetTimePanelProps) {
  const [tod, setTod] = useState(() => clampDay(DAY_START_SEC + elapsedNow));
  const [follow, setFollow] = useState(false);
  const [grab, setGrab] = useState<"hour" | "minute" | null>(null);
  const dialRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(panelScale);

  useEffect(() => {
    panelRef.current?.focus();
    const onResize = () => setScale(panelScale());
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // "Now": keep following the real time until a hand or an arrow is moved
  const realNow = () => eventTimeOfDay(serverNow());
  useEffect(() => {
    if (!follow) return undefined;
    const update = () => setTod(clampDay(realNow()));
    update();
    const t = window.setInterval(update, 250);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [follow]);

  const set = (t: number) => {
    setFollow(false);
    setTod(clampDay(t));
  };

  const fromPointer = (e: React.PointerEvent, hand: "hour" | "minute") => {
    const svg = dialRef.current;
    if (!svg) return;
    const { angle } = pointerOnDial(svg, e);
    const h24 = Math.floor(tod / 3600);
    const min = Math.floor((tod % 3600) / 60);
    if (hand === "minute") {
      const next = Math.round(angle / 6) % 60;
      // the minute hand carries the hour round, as on a watch
      let hour = h24;
      if (min >= 45 && next <= 15) hour += 1;
      else if (min <= 15 && next >= 45) hour -= 1;
      set(hour * 3600 + next * 60);
    } else {
      const h12 = Math.round(angle / 30) % 12 || 12;
      const h = eventHour(h12);
      if (h === null) set(h12 <= 6 ? DAY_END_SEC : DAY_START_SEC); // 5-6 past the end, 7-8 before the start
      else set(h * 3600 + (tod % 3600));
    }
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = dialRef.current;
    if (!svg) return;
    const hand = pointerOnDial(svg, e).reach < 0.55 ? "hour" : "minute";
    setGrab(hand);
    try {
      svg.setPointerCapture(e.pointerId);
    } catch {}
    fromPointer(e, hand);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (grab) fromPointer(e, grab);
  };
  // The hand ends where the finger left the glass: a busy board merges move
  // events, so the last move can fall short of the release point.
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (grab) fromPointer(e, grab);
    setGrab(null);
  };

  // what the screens will show
  const elapsed = elapsedForTimeOfDay(tod);
  const left = formatTime(TOTAL_HACKATHON_SECONDS - elapsed);
  const slot = getActiveMilestone(elapsed);
  const real = follow ? realNow() : null;
  const outside = real !== null && (real < DAY_START_SEC || real > DAY_END_SEC);

  const apply = (resume: boolean) => {
    // following "Now": take the time at the moment of the press, not of the last render
    onApply(elapsedForTimeOfDay(follow ? clampDay(realNow()) : tod), resume);
  };

  // the hands
  const hourAngle = ((tod / 3600) % 12) * 30;
  const minuteAngle = ((tod % 3600) / 60) * 6;
  const secondAngle = (tod % 60) * 6;
  /** a point on the dial: degrees clockwise from 12, distance from the centre */
  const polar = (angle: number, r: number) => {
    const a = (angle * Math.PI) / 180;
    return { x: Math.sin(a) * r, y: -Math.cos(a) * r };
  };
  const hand = (angle: number, length: number, tail = 0) => {
    const tip = polar(angle, length);
    const back = polar(angle + 180, tail);
    return { x1: back.x, y1: back.y, x2: tip.x, y2: tip.y };
  };

  const [hh, mm, ss] = formatTimeOfDay(tod).split(/[: ]/);
  const ampm = tod < 12 * 3600 ? "AM" : "PM";
  const stepper = (label: string, value: string, delta: number) => (
    <div className={s.field}>
      <button type="button" className={s.step} aria-label={`${label} up`} onClick={() => set(tod + delta)}>
        ▲
      </button>
      <span className={s.digits}>{value}</span>
      <button type="button" className={s.step} aria-label={`${label} down`} onClick={() => set(tod - delta)}>
        ▼
      </button>
    </div>
  );

  return (
    <div
      className={s.overlay}
      style={{ "--k": scale.toFixed(3) } as React.CSSProperties}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Set the countdown time"
        tabIndex={-1}
      >
        <div className={s.head}>
          <span className={s.title}>Set time</span>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close" title="Close (Esc)">
            ✕
          </button>
        </div>

        <svg
          ref={dialRef}
          className={s.dial}
          data-grab={grab ?? ""}
          viewBox="-100 -100 200 200"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => setGrab(null)}
          aria-hidden="true"
        >
          <circle r="97" className={s.face} />
          <circle r="53" className={s.hourZone} />
          {Array.from({ length: 60 }, (_, i) => {
            const major = i % 5 === 0;
            const a = polar(i * 6, major ? 82 : 87);
            const b = polar(i * 6, 92);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={major ? s.tickMajor : s.tick} />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const h12 = i + 1;
            const p = polar(h12 * 30, 70);
            return (
              <text
                key={h12}
                x={p.x}
                y={p.y}
                className={s.num}
                data-off={eventHour(h12) === null ? "1" : "0"}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {h12}
              </text>
            );
          })}
          <line {...hand(hourAngle, 44, 8)} className={s.hourHand} data-on={grab === "hour" ? "1" : "0"} />
          <line {...hand(minuteAngle, 74, 10)} className={s.minuteHand} data-on={grab === "minute" ? "1" : "0"} />
          <line {...hand(secondAngle, 82, 16)} className={s.secondHand} />
          <circle r="5" className={s.pin} />
        </svg>

        <div className={s.readout}>
          {stepper("Hours", hh, 3600)}
          <span className={s.colon}>:</span>
          {stepper("Minutes", mm, 60)}
          <span className={s.colon}>:</span>
          {stepper("Seconds", ss, 1)}
          <span className={s.ampm}>{ampm}</span>
        </div>

        <p className={s.preview}>
          Screens will show <b>{`${left.hours}:${left.minutes}:${left.seconds}`}</b> left
          {slot ? (
            <>
              {" · "}
              <b>{slot.title}</b>
            </>
          ) : elapsed >= TOTAL_HACKATHON_SECONDS ? (
            " · hacking over"
          ) : null}
        </p>
        {outside && real !== null && (
          <p className={s.note}>
            It is {formatTimeOfDay(real)} in Kolkata, outside hacking hours: the clock stops at{" "}
            {formatTimeOfDay(real < DAY_START_SEC ? DAY_START_SEC : DAY_END_SEC)}.
          </p>
        )}

        <div className={s.row}>
          <button
            type="button"
            className={`${s.btn} ${s.now}`}
            data-on={follow ? "1" : "0"}
            onClick={() => setFollow(true)}
            title="Follow the real time in Kolkata (from the server's clock)"
          >
            {follow ? "● Following real time" : "Now (IST)"}
          </button>
          <button type="button" className={s.btn} onClick={() => set(DAY_START_SEC)}>
            9:30 AM
          </button>
        </div>
        <div className={s.row}>
          <button type="button" id="set-time-resume" className={`${s.btn} ${s.primary}`} onClick={() => apply(true)}>
            Set &amp; resume
          </button>
          <button type="button" id="set-time-pause" className={s.btn} onClick={() => apply(false)}>
            Set, keep paused
          </button>
        </div>
        <p className={s.hint}>
          Drag the long hand for minutes, the short hand for hours. Applies to every screen.
        </p>
      </div>
    </div>
  );
}
