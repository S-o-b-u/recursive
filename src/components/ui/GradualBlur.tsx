"use client";

/**
 * GRADUAL BLUR — ported from the React Bits component to TSX.
 *
 * A stack of absolutely-positioned layers, each with a progressively larger
 * `backdrop-filter: blur()` and a mask that only lets it show over its own slice
 * of the bar. Stacked, they read as one continuous ramp from sharp to soft
 * instead of the hard edge a single blurred div gives you.
 *
 * Deviations from the published source, all deliberate:
 *   • TSX with real types (the original is .jsx).
 *   • CSS inlined through React 19's <style href precedence> instead of a
 *     side-car .css import — safer inside the App Router, and this component is
 *     mounted once so there is nothing to dedupe anyway.
 *   • `mathjs` is listed as a dependency upstream but never actually used, so it
 *     is not installed here.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

export interface GradualBlurProps {
  /** Which edge the bar sits on. */
  position?: Position;
  /** Peak blur, in rem, reached at the far end of the ramp. */
  strength?: number;
  /** Thickness of the bar. Any CSS length. */
  height?: string;
  /** Thickness when horizontal (`left` / `right`). */
  width?: string;
  /** Number of stacked layers. More = smoother ramp, more compositing cost. */
  divCount?: number;
  /** Bias the ramp so most of the blur happens late. */
  exponential?: boolean;
  /** `page` = fixed to the viewport. `parent` = absolute inside the nearest positioned ancestor. */
  target?: "page" | "parent";
  /** Distribution of blur across the layers. */
  curve?: Curve;
  opacity?: number;
  zIndex?: number;
  /** Fade the whole bar in when it scrolls into view. */
  animated?: boolean;
  duration?: string;
  easing?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CURVES: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const DIRECTIONS: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

const r1 = (n: number) => Math.round(n * 10) / 10;

export default function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  target = "parent",
  curve = "linear",
  opacity = 1,
  zIndex = 1000,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  className = "",
  style,
  children,
}: GradualBlurProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!animated);

  useEffect(() => {
    if (!animated) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [animated]);

  const layers = useMemo(() => {
    const count = Math.max(1, Math.round(divCount));
    const step = 100 / count;
    const ease = CURVES[curve] ?? CURVES.linear;
    const direction = DIRECTIONS[position] ?? DIRECTIONS.bottom;

    return Array.from({ length: count }, (_, index) => {
      const i = index + 1;
      const progress = ease(i / count);

      // exponential biases the ramp so the last layers carry most of the blur —
      // the sharp end stays genuinely sharp instead of already-soft.
      const blur = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * count + 1) * strength;

      const p1 = r1(step * i - step);
      const p2 = r1(step * i);
      const p3 = r1(step * i + step);
      const p4 = r1(step * i + step * 2);

      let stops = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) stops += `, black ${p3}%`;
      if (p4 <= 100) stops += `, transparent ${p4}%`;

      const mask = `linear-gradient(${direction}, ${stops})`;

      return (
        <div
          key={i}
          className="gb-layer"
          style={{
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blur.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
            opacity,
          }}
        />
      );
    });
  }, [curve, divCount, exponential, opacity, position, strength]);

  const vertical = position === "top" || position === "bottom";
  const page = target === "page";

  const containerStyle: CSSProperties = {
    position: page ? "fixed" : "absolute",
    // `page` bars have to clear in-page chrome, so lift them a band above it.
    zIndex: page ? zIndex + 100 : zIndex,
    opacity: visible ? 1 : 0,
    transition: animated ? `opacity ${duration} ${easing}` : undefined,
    ...(vertical
      ? { left: 0, right: 0, height, [position]: 0 }
      : { top: 0, bottom: 0, width: width ?? height, [position]: 0 }),
    ...style,
  };

  return (
    <>
      <div
        ref={ref}
        aria-hidden={children ? undefined : true}
        className={`gradual-blur${className ? ` ${className}` : ""}`}
        style={containerStyle}
      >
        <div className="gb-inner">{layers}</div>
        {children}
      </div>

      <style href="gradual-blur" precedence="default">{`
        .gradual-blur {
          pointer-events: none;
          isolation: isolate;
        }
        .gb-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .gb-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform;
        }
        /* A blur ramp is decoration. If the user has asked the OS for less
           transparency, drop it rather than fight the preference. */
        @media (prefers-reduced-transparency: reduce) {
          .gradual-blur { display: none; }
        }
      `}</style>
    </>
  );
}
