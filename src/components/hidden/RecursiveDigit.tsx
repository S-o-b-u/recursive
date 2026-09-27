"use client";

import React, { useId } from "react";
import { GLYPHS, GLYPH_W, GLYPH_H, SPARKLE } from "./recursive-glyphs";

/** One clock numeral in the RECURSIVE wordmark's lettering; sized by CSS height. */
export function RecursiveDigit({ ch, className }: { ch: string; className?: string }) {
  const id = "rg" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = GLYPHS[ch] ?? GLYPHS["0"];
  return (
    <svg
      viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
      // the cell sets the proportion; the clock draws the numerals a little wider than the wordmark
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={GLYPH_W} height={GLYPH_H}>
          <g transform={g.turn ? `rotate(180 ${GLYPH_W / 2} ${GLYPH_H / 2})` : undefined}>
            {g.fill.map((d, i) => (
              <path key={"f" + i} d={d} fill="#fff" />
            ))}
            {g.cut.map((d, i) => (
              <path key={"c" + i} d={d} fill="#000" />
            ))}
          </g>
        </mask>
      </defs>
      <rect width={GLYPH_W} height={GLYPH_H} fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

/** The wordmark's four-point sparkle, centred in a square viewBox. */
export function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-1 -1 2 2" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={SPARKLE} fill="currentColor" />
    </svg>
  );
}
