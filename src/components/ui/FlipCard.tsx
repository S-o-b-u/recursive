"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

/**
 * FlipCard — two faces on one card, rotated about the Y axis.
 *
 * Flips on hover where a pointer can hover, on focus for keyboard, and on
 * press everywhere else — a touch device gets no hover, so the press has to
 * carry it. Pressing also *pins* the flip, which is why the state class and
 * the hover rule both resolve to the same 180°: whichever fires, the card
 * lands in one place instead of fighting itself.
 *
 * Structural only. Both faces inherit the card's radius and fill it edge to
 * edge; everything they look like comes from the caller.
 */
export default function FlipCard({
  front,
  back,
  ratio = "4 / 5",
  label,
  className = "",
  disabled = false,
}: {
  front: ReactNode;
  back: ReactNode;
  ratio?: string;
  /** Announced to screen readers as the button's purpose. */
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  const [pinned, setPinned] = useState(false);

  return (
    <div
      className={`fcd ${!disabled && pinned ? "is-flipped" : ""} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      style={{ aspectRatio: ratio } as CSSProperties}
    >
      <button
        type="button"
        className="fcd-shell"
        aria-pressed={!disabled && pinned}
        aria-label={label}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setPinned((p) => !p);
          }
        }}
      >
        <span className="fcd-face fcd-front">{front}</span>
        <span className="fcd-face fcd-back">{back}</span>
      </button>

      <style href="flip-card" precedence="default">{`
        .fcd {
          position: relative;
          width: 100%;
          perspective: 1400px;
        }

        .fcd-shell {
          position: absolute;
          inset: 0;
          display: block;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: var(--radius-lg);
          transform-style: preserve-3d;
          transition: transform 620ms cubic-bezier(0.22, 0.9, 0.24, 1);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          will-change: transform;
        }

        .fcd.is-disabled .fcd-shell {
          cursor: not-allowed;
        }

        .fcd:not(.is-disabled).is-flipped .fcd-shell,
        .fcd:not(.is-disabled) .fcd-shell:focus-visible {
          transform: rotateY(180deg);
        }

        @media (hover: hover) {
          .fcd:not(.is-disabled):hover .fcd-shell { transform: rotateY(180deg); }
        }

        .fcd:not(.is-disabled) .fcd-shell:focus-visible {
          outline: 2px solid rgba(143, 196, 90, 0.75);
          outline-offset: 6px;
        }

        .fcd-face {
          position: absolute;
          inset: 0;
          display: block;
          overflow: hidden;
          border-radius: var(--radius-lg);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          text-align: left;
        }

        .fcd-back { transform: rotateY(180deg) translate3d(0, 0, 0); }

        @media (max-width: 768px) {
          .fcd-shell {
            transition: transform 440ms cubic-bezier(0.22, 0.9, 0.24, 1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fcd-shell { transition-duration: 1ms; }
        }
      `}</style>
    </div>
  );
}
