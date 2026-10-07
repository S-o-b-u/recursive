"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { HACKATHON_SCHEDULE } from "@/data/shift8";
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
  isSubmission?: boolean;
}

/** The day's schedule (src/data/shift8.ts is the one place it is written down). */
export const MOCKUP_SCHEDULE: ScheduleItem[] = HACKATHON_SCHEDULE.map((m) => ({
  id: m.id,
  time: m.timeRange,
  title: m.title,
  subtitle: m.subtitle,
  secondsOffset: m.startSec,
  endOffset: m.endSec,
  isLunch: m.isLunch,
  isSubmission: m.isSubmission,
}));

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

/** Slots in the left column: the morning, up to the end of lunch; the afternoon fills the right. */
const LEFT_COLUMN_ROWS = Math.max(1, MOCKUP_SCHEDULE.findIndex((m) => m.isLunch) + 1);

type Cursor = { x: number; y: number; w: number; h: number; glide: boolean };

/**
 * The whole day is on the card, in two columns (morning | afternoon), so it
 * fits on the hill under the chair. The current slot's highlight is one
 * element that glides from slot to slot as the day moves on (across to the
 * other column too), rather than each row painting its own. It is placed from
 * the rows themselves, so it fits rows of any height (the current row shows
 * its subtitle) at any size, and it lands without moving the first time.
 */
function useCursor(listRef: React.RefObject<HTMLDivElement | null>, currentId: string) {
  const [cursor, setCursor] = useState<Cursor | null>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const place = () => {
      const row = list.querySelector<HTMLElement>(`[data-milestone-id="${currentId}"]`);
      if (!row) return;
      const next = { x: row.offsetLeft, y: row.offsetTop, w: row.offsetWidth, h: row.offsetHeight };
      setCursor((c) =>
        c && c.x === next.x && c.y === next.y && c.w === next.w && c.h === next.h
          ? c
          : { ...next, glide: c !== null }
      );
    };
    place();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    ro?.observe(list);
    return () => ro?.disconnect();
  }, [listRef, currentId]);
  return cursor;
}

export default function MockupScheduleCard({
  elapsedSeconds,
  isLunchActive,
  activeId,
  onSelectMilestone,
}: MockupScheduleCardProps) {
  const currentId = activeId ?? getActiveMockupMilestone(elapsedSeconds).id;
  const listRef = useRef<HTMLDivElement>(null);
  const cursor = useCursor(listRef, currentId);
  const current = MOCKUP_SCHEDULE.find((m) => m.id === currentId);
  const tone = current?.isLunch && isLunchActive ? "lunch" : current?.isSubmission ? "submit" : "day";

  const row = (item: ScheduleItem) => {
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
        data-tone={isNow ? tone : "day"}
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
  };

  return (
    <div className={s.card}>
      <div ref={listRef} className={s.cardList}>
        {cursor && (
          <span
            aria-hidden="true"
            className={`${s.cursor} ${cursor.glide ? s.glide : ""}`}
            data-tone={tone}
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
              width: cursor.w,
              height: cursor.h,
            }}
          />
        )}
        <div className={s.cardColumn}>{MOCKUP_SCHEDULE.slice(0, LEFT_COLUMN_ROWS).map(row)}</div>
        <div className={s.cardColumn}>{MOCKUP_SCHEDULE.slice(LEFT_COLUMN_ROWS).map(row)}</div>
      </div>
    </div>
  );
}
