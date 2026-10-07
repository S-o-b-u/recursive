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

/** Rows the card shows at once: the one before, the current one and the next three. */
const VISIBLE_ROWS = 5;

interface MockupScheduleCardProps {
  elapsedSeconds: number;
  isLunchActive: boolean;
  /** The row the NOW caption shows (lunch when it is forced). */
  activeId?: string;
  onSelectMilestone?: (seconds: number, isLunch?: boolean) => void;
}

type Layout = {
  /** the current row's highlight */
  cursorY: number;
  cursorH: number;
  /** the visible stretch of the list */
  viewY: number;
  viewH: number;
  /** false for the first placement, which lands without moving */
  glide: boolean;
};

/**
 * The day has more slots than fit on the hill under the chair, so the card is
 * a window onto the list: the slot before, the current one and the next
 * three. As the day moves on, the list scrolls up in the window and the
 * highlight (one element, not each row's own background) glides onto the new
 * current row. Both are placed from the rows themselves, so rows of any
 * height (a subtitle makes one taller) and any size work, and both land
 * without moving the first time.
 */
function useScheduleLayout(
  listRef: React.RefObject<HTMLDivElement | null>,
  currentId: string,
  first: number
) {
  const [layout, setLayout] = useState<Layout | null>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const place = () => {
      const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-milestone-id]"));
      const row = rows.find((r) => r.dataset.milestoneId === currentId);
      const top = rows[first];
      const bottom = rows[Math.min(rows.length, first + VISIBLE_ROWS) - 1];
      if (!row || !top || !bottom) return;
      const next = {
        cursorY: row.offsetTop,
        cursorH: row.offsetHeight,
        viewY: top.offsetTop,
        viewH: bottom.offsetTop + bottom.offsetHeight - top.offsetTop,
      };
      setLayout((l) =>
        l &&
        l.cursorY === next.cursorY &&
        l.cursorH === next.cursorH &&
        l.viewY === next.viewY &&
        l.viewH === next.viewH
          ? l
          : { ...next, glide: l !== null }
      );
    };
    place();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    ro?.observe(list);
    return () => ro?.disconnect();
  }, [listRef, currentId, first]);
  return layout;
}

export default function MockupScheduleCard({
  elapsedSeconds,
  isLunchActive,
  activeId,
  onSelectMilestone,
}: MockupScheduleCardProps) {
  const currentId = activeId ?? getActiveMockupMilestone(elapsedSeconds).id;
  const index = Math.max(0, MOCKUP_SCHEDULE.findIndex((m) => m.id === currentId));
  const first = Math.max(0, Math.min(index - 1, MOCKUP_SCHEDULE.length - VISIBLE_ROWS));
  const listRef = useRef<HTMLDivElement>(null);
  const layout = useScheduleLayout(listRef, currentId, first);
  const current = MOCKUP_SCHEDULE[index];
  const tone = current?.isLunch && isLunchActive ? "lunch" : current?.isSubmission ? "submit" : "day";
  const glide = layout?.glide ? s.glide : "";
  return (
    <div className={s.card}>
      <div
        className={`${s.cardView} ${glide}`}
        style={layout ? { height: layout.viewH } : undefined}
      >
        <div
          ref={listRef}
          className={`${s.cardList} ${glide}`}
          style={layout ? { transform: `translateY(${-layout.viewY}px)` } : undefined}
        >
          {layout && (
            <span
              aria-hidden="true"
              className={`${s.cursor} ${glide}`}
              data-tone={tone}
              style={{ transform: `translateY(${layout.cursorY}px)`, height: layout.cursorH }}
            />
          )}
          {MOCKUP_SCHEDULE.map((item, i) => {
            const isNow = item.id === currentId;
            const state = isNow ? "now" : elapsedSeconds >= item.endOffset ? "past" : "next";
            const progress = Math.min(
              1,
              Math.max(0, (elapsedSeconds - item.secondsOffset) / (item.endOffset - item.secondsOffset))
            );
            const shown = i >= first && i < first + VISIBLE_ROWS;
            return (
              <div
                key={item.id}
                data-milestone-id={item.id}
                data-state={state}
                data-tone={isNow ? tone : "day"}
                aria-hidden={shown ? undefined : true}
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
      </div>
    </div>
  );
}
