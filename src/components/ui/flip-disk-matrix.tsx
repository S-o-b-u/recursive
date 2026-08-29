"use client";

import React, { useCallback, useEffect, useState, memo } from "react";

// Minimal 5x7 Font Definition
function glyphBitmap(ch: string, cols: number, rows: number): boolean[][] {
  const glyphs: Record<string, number[]> = {
    "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
    "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
    "2": [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
    "3": [0b01110, 0b10001, 0b00001, 0b00110, 0b00001, 0b10001, 0b01110],
    "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
    "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
    "6": [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
    "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
    "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
    "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
    ":": [0b00000, 0b00100, 0b00000, 0b00000, 0b00000, 0b00100, 0b00000],
    " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
    "-": [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
    ".": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00100],
    "A": [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
    "B": [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
    "C": [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
    "D": [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
    "E": [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
    "F": [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
    "G": [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
    "H": [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
    "I": [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
    "J": [0b00011, 0b00001, 0b00001, 0b00001, 0b10001, 0b10001, 0b01110],
    "K": [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
    "L": [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
    "M": [0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b10001, 0b10001],
    "N": [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
    "O": [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
    "P": [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
    "Q": [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b01110, 0b00001],
    "R": [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
    "S": [0b01110, 0b10001, 0b10000, 0b01110, 0b00001, 0b10001, 0b01110],
    "T": [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
    "U": [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
    "V": [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
    "W": [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
    "X": [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
    "Y": [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
    "Z": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  };

  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  const chars = ch.toUpperCase().split("");
  const gw = 5;
  const gh = 7;
  const totalW = chars.length * (gw + 1) - 1;

  let ox = Math.max(0, Math.floor((cols - totalW) / 2));
  const oy = Math.max(0, Math.floor((rows - gh) / 2));

  for (const c of chars) {
    const rowsBits = glyphs[c] || glyphs[" "];
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        if (oy + y < rows && ox + x < cols) {
          grid[oy + y][ox + x] = !!(rowsBits[y] & (1 << (gw - 1 - x)));
        }
      }
    }
    ox += gw + 1;
  }
  return grid;
}

// Memoized Disk component — white/light theme with forest green "on" face
const Disk = memo(({ on }: { on: boolean }) => {
  return (
    <div
      className="fdm-disk-cell"
      style={{ perspective: "400px" }}
    >
      <div
        className="fdm-disk-flipper"
        style={{
          transformStyle: "preserve-3d",
          transform: on ? "rotateX(180deg)" : "rotateX(0deg)",
        }}
      />
    </div>
  );
});
Disk.displayName = "Disk";

export interface FlipDiskMatrixProps {
  displayText?: string;
  showControls?: boolean;
  cols?: number;
  rows?: number;
  className?: string;
}

export function FlipDiskMatrix({
  displayText,
  showControls = false,
  cols = 53,
  rows = 11,
  className = "",
}: FlipDiskMatrixProps) {
  const [mode, setMode] = useState<"time" | "wave" | "text" | "noise">("text");
  const [text, setText] = useState<string>(displayText || "FLIP");

  useEffect(() => {
    if (displayText !== undefined) {
      setText(displayText);
    }
  }, [displayText]);

  const [bits, setBits] = useState(() =>
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  const computeTarget = useCallback(
    (t: number): boolean[][] => {
      if (displayText !== undefined) {
        return glyphBitmap(displayText, cols, rows);
      }
      if (mode === "text" || mode === "time") {
        const display =
          mode === "time"
            ? new Date().toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            : text;
        return glyphBitmap(display, cols, rows);
      }
      if (mode === "wave") {
        return Array.from({ length: rows }, (_, y) =>
          Array.from({ length: cols }, (_, x) => {
            const v = Math.sin(x * 0.2 + t * 3) * Math.cos(y * 0.3 + t * 2);
            return v > 0.2;
          })
        );
      }
      return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() > 0.6)
      );
    },
    [displayText, mode, text, cols, rows]
  );

  useEffect(() => {
    let raf = 0;
    let last = 0;

    const getInterval = () => {
      if (mode === "wave") return 150;
      if (mode === "noise") return 250;
      return 1000;
    };

    const loop = (now: number) => {
      if (now - last > getInterval()) {
        last = now;
        const t = now / 1000;
        const next = computeTarget(t);

        setBits((prev) => {
          let changed = false;
          const newBits = prev.map((row, y) =>
            row.map((cell, x) => {
              if (cell !== next[y][x]) changed = true;
              return next[y][x];
            })
          );
          return changed ? newBits : prev;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [computeTarget, mode]);

  return (
    <div className={`fdm-root ${className}`}>
      {/* Internal Mode Switcher (only when showControls is true) */}
      {showControls && (
        <div className="fdm-controls">
          {(["time", "text", "wave", "noise"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`fdm-ctrl-btn ${mode === m ? "fdm-ctrl-active" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {showControls && mode === "text" && (
        <div className="fdm-text-input-wrap">
          <input
            type="text"
            value={text}
            maxLength={8}
            onChange={(e) => {
              const filtered = e.target.value.toUpperCase().replace(/[^A-Z0-9: .-]/g, "");
              setText(filtered);
            }}
            placeholder="TYPE"
            className="fdm-text-input"
          />
        </div>
      )}

      <div className="fdm-board">
        <div className="fdm-bezel">
          <div
            className="fdm-grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {bits.map((row, y) =>
              row.map((on, x) => (
                <Disk key={`${x}-${y}`} on={on} />
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .fdm-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }

        .fdm-controls {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem;
          background: rgba(255,255,255,0.7);
          border-radius: 0.5rem;
          border: 1px solid rgba(47,85,39,0.12);
        }

        .fdm-ctrl-btn {
          padding: 0.35rem 0.75rem;
          font-size: 0.68rem;
          font-family: var(--font-dm-sans), monospace;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-radius: 0.35rem;
          color: #5C6E50;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 150ms;
        }

        .fdm-ctrl-active {
          background: #2F5527;
          color: #fff;
          font-weight: 600;
        }

        .fdm-text-input-wrap {
          display: flex;
          justify-content: center;
        }

        .fdm-text-input {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-family: var(--font-dm-sans), monospace;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          text-align: center;
          background: #fff;
          border: 1px solid rgba(47,85,39,0.18);
          border-radius: 0.5rem;
          color: #111a12;
          outline: none;
        }

        .fdm-text-input:focus {
          border-color: #5C8C3A;
          box-shadow: 0 0 0 3px rgba(92,140,58,0.15);
        }

        /* ── Board Frame — clean white/frosted glass ── */
        .fdm-board {
          position: relative;
          width: 100%;
          max-width: 64rem;
          padding: clamp(0.35rem, 0.8vw, 0.75rem);
          border-radius: clamp(0.75rem, 1.5vw, 1.25rem);
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(47, 85, 39, 0.1);
          box-shadow:
            0 2px 24px rgba(22, 45, 26, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset;
        }

        /* ── Inner Bezel — slightly recessed white surface ── */
        .fdm-bezel {
          position: relative;
          background: rgba(248, 250, 246, 0.95);
          border-radius: clamp(0.5rem, 1vw, 0.85rem);
          padding: clamp(0.5rem, 1.2vw, 1rem);
          box-shadow:
            inset 0 1px 4px rgba(0, 0, 0, 0.04),
            inset 0 0 0 1px rgba(47, 85, 39, 0.05);
        }

        .fdm-grid {
          display: grid;
          width: 100%;
          height: 100%;
          gap: min(0.35vw, 2.5px);
        }

        /* ── Individual Disk ── */
        .fdm-disk-cell {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          perspective: 400px;
        }

        .fdm-disk-flipper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition: transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          border-radius: 50%;
        }

        .fdm-disk-flipper::before,
        .fdm-disk-flipper::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          backface-visibility: hidden;
        }

        /* OFF face — subtle warm stone */
        .fdm-disk-flipper::before {
          background: #e7e9e2;
          border: 1px solid rgba(200, 205, 195, 0.6);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        /* ON face — deep forest green */
        .fdm-disk-flipper::after {
          background: #2F5527;
          border: 1px solid #254A1F;
          box-shadow:
            inset 0 -1px 3px rgba(0, 0, 0, 0.2),
            0 0 4px rgba(92, 140, 58, 0.15);
          transform: rotateX(180deg);
        }

        .fdm-disk-cell:hover .fdm-disk-flipper {
          transition-duration: 80ms;
          transform: rotateX(90deg) !important;
        }

        @media (max-width: 640px) {
          .fdm-grid {
            gap: 1.5px;
          }
          .fdm-board {
            padding: 0.3rem;
          }
          .fdm-bezel {
            padding: 0.35rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FlipDiskMatrix;
