"use client";

import React from "react";
import { ScheduleItem } from "./MockupScheduleCard";
import s from "./stage.module.css";

interface NowStatusBadgeProps {
  item: ScheduleItem;
  isLunchActive: boolean;
}

/** The caption beside the chair: what is happening right now. */
export default function NowStatusBadge({ item, isLunchActive }: NowStatusBadgeProps) {
  const isLunch = Boolean(item.isLunch || isLunchActive);
  return (
    <div className={s.now} data-lunch={isLunch ? "1" : "0"} aria-live="polite">
      <span className={s.nowRule} aria-hidden="true" />
      <span className={s.nowBody}>
        <span className={s.nowLabel}>
          <span className={s.nowDot} aria-hidden="true" />
          Now
        </span>
        <span key={item.id} className={s.nowTitle}>
          {item.title}
        </span>
      </span>
    </div>
  );
}
