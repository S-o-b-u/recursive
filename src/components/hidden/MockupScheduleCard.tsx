"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import s from "./stage.module.css";

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  secondsOffset: number;
  /** When the slot ends, for the progress line on the current row. */
  endOffset: number;
  isLunch?: boolean;
}

export const MOCKUP_SCHEDULE: ScheduleItem[] = [
  {
    id: "shift-8-start",
    time: "10:00",
    title: "Shift-8 Starts",
    secondsOffset: 0,
    endOffset: 3600,
  },
  {
    id: "checkpoint-1",
    time: "11:00 – 01:00",
    title: "Sprint Checkpoint 1",
    secondsOffset: 3600,
    endOffset: 10800,
  },
  {
    id: "lunch-networking",
    time: "01:30 – 02:15",
    title: "Lunch & Networking",
    secondsOffset: 12600,
    endOffset: 15300,
    isLunch: true,
  },
  {
    id: "checkpoint-2",
    time: "02:15 – 04:30",
    title: "Sprint Checkpoint 2 & Devfolio",
    subtitle: "Submission Deadline",
    secondsOffset: 15300,
    endOffset: 23400,
  },
  {
    id: "code-freeze",
    time: "05:00",
    title: "Code Freeze",
    secondsOffset: 25200,
    endOffset: 28800,
  },
];

export function getActiveMockupMilestone(
  elapsedSeconds: number,
  forcedLunch?: boolean
): ScheduleItem {
  if (forcedLunch) {
    const lunchItem = MOCKUP_SCHEDULE.find((m) => m.isLunch);
    if (lunchItem) return lunchItem;
  }
  let active = MOCKUP_SCHEDULE[0];
  for (let i = 0; i < MOCKUP_SCHEDULE.length; i++) {
    if (elapsedSeconds >= MOCKUP_SCHEDULE[i].secondsOffset) {
      active = MOCKUP_SCHEDULE[i];
    } else {
      break;
    }
  }
  return active;
}

interface MockupScheduleCardProps {
  elapsedSeconds: number;
  isLunchActive: boolean;
  /** The row the NOW caption shows (lunch when it is forced). */
  activeId?: string;
  onSelectMilestone?: (seconds: number, isLunch?: boolean) => void;
}

/**
 * The current row's highlight is one element that glides from row to row when
 * the schedule moves on, rather than each row painting its own (which made it
 * jump). It is placed from the rows themselves, so it fits rows of any height
 * (the one with a subtitle is taller) at any size, and lands without gliding
 * the first time.
 */
function useCursor(cardRef: React.RefObject<HTMLDivElement | null>, currentId: string) {
  const [cursor, setCursor] = useState<{ y: number; h: number; glide: boolean } | null>(null);
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    const place = () => {
      const row = card.querySelector<HTMLElement>(`[data-milestone-id="${currentId}"]`);
      if (!row) return;
      const y = row.offsetTop;
      const h = row.offsetHeight;
      setCursor((c) => (c && c.y === y && c.h === h ? c : { y, h, glide: c !== null }));
    };
    place();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    ro?.observe(card);
    return () => ro?.disconnect();
  }, [cardRef, currentId]);
  return cursor;
}

export default function MockupScheduleCard({
  elapsedSeconds,
  isLunchActive,
  activeId,
  onSelectMilestone,
}: MockupScheduleCardProps) {
  const currentId = activeId ?? getActiveMockupMilestone(elapsedSeconds).id;
  const cardRef = useRef<HTMLDivElement>(null);
  const cursor = useCursor(cardRef, currentId);
  const currentIsLunch = Boolean(MOCKUP_SCHEDULE.find((m) => m.id === currentId)?.isLunch && isLunchActive);
  return (
    <div ref={cardRef} className={s.card}>
      {cursor && (
        <span
          aria-hidden="true"
          className={`${s.cursor} ${cursor.glide ? s.cursorGlide : ""}`}
          data-lunch={currentIsLunch ? "1" : "0"}
          style={{ transform: `translateY(${cursor.y}px)`, height: cursor.h }}
        />
      )}
      {MOCKUP_SCHEDULE.map((item) => {
        const isNow = item.id === currentId;
        const state = isNow ? "now" : elapsedSeconds >= item.endOffset ? "past" : "next";
        const progress = Math.min(
          1,
          Math.max(0, (elapsedSeconds - item.secondsOffset) / (item.endOffset - item.secondsOffset))
        );
        return (
          <div
            key={item.id}
            data-milestone-id={item.id}
            data-state={state}
            data-lunch={item.isLunch && isLunchActive ? "1" : "0"}
            className={s.item}
            onClick={() => onSelectMilestone?.(item.secondsOffset, item.isLunch)}
          >
            <span className={s.time}>{item.time}</span>
            <span className={s.title}>
              {item.title}
              {item.subtitle && <span className={s.sub}>{item.subtitle}</span>}
            </span>
            {isNow && (
              <span className={s.progress} aria-hidden="true">
                <i style={{ transform: `scaleX(${progress})` }} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
