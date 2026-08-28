"use client";

import { useMemo, type CSSProperties } from "react";

/**
 * ATMOSPHERE — a barely-there drift of spores and the odd firefly.
 *
 * Meant to sit behind the content of the forest-dark sections and give their
 * flat green expanses a sense of living air. It is deliberately faint: you
 * should feel it before you notice it.
 *
 * Design constraints that keep it cheap and safe:
 *  - Pure CSS. No canvas, no rAF, no ResizeObserver. Every mote is a single
 *    blurred radial-gradient dot floated on the compositor via `transform`.
 *  - One shared @keyframes; each mote only varies CSS custom properties, so the
 *    browser animates them all off the same timeline with no per-node styles.
 *  - Deterministic layout. Positions come from a seeded hash of the index, not
 *    Math.random(), so the server and client render byte-identical markup — no
 *    hydration mismatch, no first-paint reshuffle.
 *  - `mix-blend-mode: screen` means motes only *add* light — luminous over the
 *    forest dark, invisible anywhere bright, so it can never muddy content.
 *  - Honors prefers-reduced-motion (the layer is hidden) and
 *    prefers-reduced-transparency (blur dropped).
 *
 * Drop it in as the first child of a `position: relative` section with a
 * `z-index` set (so it forms a stacking context) and give it `zIndex={-1}` —
 * it then paints above the section's own background and below all its content,
 * whether that content is positioned or not.
 */

const PALETTE: { core: string; halo: string }[] = [
  { core: "rgba(178, 232, 120, 0.9)", halo: "rgba(143, 196, 90, 0)" },
  { core: "rgba(198, 240, 150, 0.85)", halo: "rgba(120, 180, 80, 0)" },
  { core: "rgba(120, 180, 92, 0.8)", halo: "rgba(92, 140, 58, 0)" },
  { core: "rgba(255, 226, 148, 0.92)", halo: "rgba(240, 200, 120, 0)" }, // firefly
];

/** Small deterministic PRNG (Mulberry32) — stable across SSR/CSR. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Mote = {
  left: number;
  top: number;
  size: number;
  dx: number;
  dy: number;
  dur: number;
  delay: number;
  peak: number;
  blur: number;
  glow: number;
  color: { core: string; halo: string };
};

function buildMotes(count: number, seed: number): Mote[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const isFirefly = rand() > 0.78;
    const color = isFirefly
      ? PALETTE[PALETTE.length - 1]
      : PALETTE[Math.floor(rand() * (PALETTE.length - 1))];
    const size = isFirefly ? 3 + rand() * 3 : 2.5 + rand() * 6;
    return {
      left: rand() * 100,
      top: rand() * 100,
      size,
      // gentle, mostly-upward drift with a little sideways sway
      dx: (rand() - 0.5) * 60,
      dy: -(24 + rand() * 70),
      dur: 13 + rand() * 16,
      delay: -rand() * 30,
      // Fireflies burn brighter and steadier; spores are soft and low.
      peak: isFirefly ? 0.72 + rand() * 0.28 : 0.3 + rand() * 0.42,
      blur: isFirefly ? 0.5 + rand() * 1.2 : 1 + rand() * 3,
      // A luminous halo, strongest on the fireflies.
      glow: isFirefly ? 7 + rand() * 11 : rand() * 4,
      color,
    };
  });
}

export default function Atmosphere({
  count = 16,
  seed = 1,
  zIndex = -1,
  opacity = 1,
  className = "",
}: {
  count?: number;
  /** Change to reshuffle the field deterministically between sections. */
  seed?: number;
  zIndex?: number;
  opacity?: number;
  className?: string;
}) {
  const motes = useMemo(() => buildMotes(count, seed), [count, seed]);

  return (
    <div className={`atmo ${className}`} aria-hidden="true" style={{ zIndex, opacity }}>
      {motes.map((m, i) => (
        <span
          key={i}
          className="atmo-mote"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              background: `radial-gradient(circle, ${m.color.core} 0%, ${m.color.halo} 70%)`,
              filter: `blur(${m.blur}px)`,
              boxShadow: m.glow > 0.5 ? `0 0 ${m.glow}px ${m.color.core}` : undefined,
              "--dx": `${m.dx}px`,
              "--dy": `${m.dy}px`,
              "--peak": m.peak,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      <style href="atmosphere" precedence="default">{`
        .atmo {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          mix-blend-mode: screen;
          contain: layout paint style;
        }
        .atmo-mote {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          will-change: transform, opacity;
          animation-name: atmo-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes atmo-float {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0; }
          12%, 88% { opacity: var(--peak, 0.4); }
          50% { transform: translate3d(var(--dx, 10px), var(--dy, -50px), 0); }
        }
        @media (prefers-reduced-transparency: reduce) {
          .atmo-mote { filter: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .atmo { display: none; }
        }
      `}</style>
    </div>
  );
}
