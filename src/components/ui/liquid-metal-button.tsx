"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Two curves, named once.
 *
 * The press moves `transform` and it has to feel connected to the finger, so it
 * is short and does not overshoot. Two layers had been left on an 0.8s spring
 * (`all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`) that belongs to the text/icon
 * morph — routed through `all` that curve also lands on transform, which is why
 * those two wobbled while their siblings snapped.
 */
const EASE =
  "transform 0.22s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s ease, opacity 0.2s ease";
/** Same, for the layers whose box also resizes with `dimensions`. */
const EASE_SIZE = `${EASE}, width 0.4s ease, height 0.4s ease`;

/**
 * Every button used to mount its own WebGL ShaderMount. A page with a dozen of
 * them (hero, nav, about, themes, sponsors, footer…) opened 12+ live WebGL2
 * contexts on top of the two WarpText canvases — past the browser's ~16-context
 * ceiling, which evicts the oldest (the hero wordmark) and pins a phone GPU.
 *
 * So the shader is a progressive enhancement for devices that can actually spend
 * it: a fine pointer, a roomy viewport, motion allowed, no Save-Data. Everywhere
 * else the pill falls back to a pure-CSS liquid-metal surface (see the injected
 * `.shader-container-exploded` background + `.is-lite` sheen) — visually close,
 * zero GPU contexts.
 */
function preferLiteButton(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return false;
}

export interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  width?: number;
  height?: number;
  href?: string;
  target?: string;
  rel?: string;
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  icon,
  iconPosition = "left",
  className = "",
  width: customWidth,
  height: customHeight,
  href,
  target,
  rel,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const visibleRef = useRef(true);
  const hoverRef = useRef(false);
  // Default to true so SSR + initial mobile render use the pure-CSS metallic pill.
  // The effect sets it to false on capable desktop devices to mount the shader.
  const [lite, setLite] = useState(true);

  /**
   * What the shader should idle at right now.
   *
   * The observer parks it at 0 off screen, but hover and click used to write
   * 0.6 / 1 unconditionally — so leaving a button or clicking one and scrolling
   * away within the 300ms reset restarted a shader nothing could see, and it
   * kept running until the button happened to re-enter the viewport. Every
   * speed change goes through here instead.
   */
  const restSpeed = () => (!visibleRef.current ? 0 : hoverRef.current ? 1 : 0.6);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      const w = customWidth ?? 46;
      const h = customHeight ?? 46;
      return {
        width: w,
        height: h,
        innerWidth: w - 4,
        innerHeight: h - 4,
        shaderWidth: w,
        shaderHeight: h,
      };
    } else {
      const iconExtra = icon ? 24 : 0;
      const w = customWidth ?? Math.max(142, label.length * 9 + 44 + iconExtra);
      const h = customHeight ?? 46;
      return {
        width: w,
        height: h,
        innerWidth: w - 4,
        innerHeight: h - 4,
        shaderWidth: w,
        shaderHeight: h,
      };
    }
  }, [viewMode, customWidth, customHeight, label, icon]);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (typeof document !== "undefined" && !document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        /* CSS liquid-metal base. On capable devices the WebGL canvas overlays
           this; on phones/tablets (no shader) it IS the surface, so the pill
           never renders flat. */
        .shader-container-exploded {
          background:
            linear-gradient(135deg, #e2e6e9 0%, #b0b6bb 15%, #585d62 39%, #24272b 51%, #494e53 65%, #b9bfc4 88%, #e6eaed 100%);
        }
        .shader-container-exploded.is-lite::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background: linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.55) 50%, transparent 66%);
          background-size: 260% 100%;
          animation: lm-sheen 3.6s linear infinite;
          pointer-events: none;
        }
        @keyframes lm-sheen {
          from { background-position: 150% 0; }
          to { background-position: -170% 0; }
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Decide once, on the client, whether this button spends a WebGL context.
    const useLite = preferLiteButton();
    setLite(useLite);
    if (useLite) {
      // Pure-CSS pill — the injected metallic background + sheen carry it.
      return;
    }

    let observer: IntersectionObserver | null = null;
    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
          }

          shaderMount.current = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4,
              u_softness: 0.5,
              u_shiftRed: 0.3,
              u_shiftBlue: 0.3,
              u_distortion: 0,
              u_contour: 0,
              u_angle: 45,
              u_scale: 8,
              u_shape: 0,
              u_offsetX: 0.1,
              u_offsetY: -0.1,
            },
            undefined,
            0.6,
          );

          observer = new IntersectionObserver(
            ([entry]) => {
              visibleRef.current = entry.isIntersecting;
              shaderMount.current?.setSpeed?.(restSpeed());
            },
            { rootMargin: "100px" }
          );
          observer.observe(shaderRef.current);
        }
      } catch (error) {
        console.warn("LiquidMetalButton: Shader fallback to CSS animation", error);
        setLite(true);
      }
    };

    loadShader();

    return () => {
      observer?.disconnect();
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverRef.current = true;
    shaderMount.current?.setSpeed?.(restSpeed());
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    hoverRef.current = false;
    shaderMount.current?.setSpeed?.(restSpeed());
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        shaderMount.current?.setSpeed?.(restSpeed());
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            transition:
              EASE,
            transform: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transformStyle: "preserve-3d",
              transition:
                "transform 0.22s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {viewMode === "icon" && (
              icon || (
                <Sparkles
                  size={16}
                  style={{
                    color: "#ffffff",
                    filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
                    transform: "scale(1)",
                  }}
                />
              )
            )}
            {viewMode === "text" && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#f3f8ee",
                  fontFamily: "var(--font-display), var(--font-dm-sans), sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.012em",
                  wordSpacing: "0.02em",
                  textShadow: "0px 1px 2px rgba(0, 0, 0, 0.7)",
                  transform: "scale(1)",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                }}
              >
                {iconPosition === "left" && icon}
                <span>{label}</span>
                {iconPosition === "right" && icon}
              </span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                EASE,
              transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: "100px",
                background: "linear-gradient(180deg, rgba(32,32,32,0.85) 0%, rgba(0,0,0,0.92) 100%)",
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
                  : "none",
                transition:
                  EASE_SIZE,
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                EASE,
              transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                borderRadius: "100px",
                boxShadow: "none",
                transition:
                  EASE,
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className={`shader-container-exploded${lite ? " is-lite" : ""}`}
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: `${dimensions.shaderWidth}px`,
                  maxWidth: `${dimensions.shaderWidth}px`,
                  height: `${dimensions.shaderHeight}px`,
                  transition: "width 0.4s ease, height 0.4s ease",
                }}
              />
            </div>
          </div>

          {href ? (
            <a
              ref={buttonRef as any}
              href={href}
              target={target}
              rel={rel}
              onClick={handleClick as any}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                zIndex: 40,
                transformStyle: "preserve-3d",
                transform: "translateZ(25px)",
                transition:
                  EASE,
                overflow: "hidden",
                borderRadius: "100px",
                textDecoration: "none",
                display: "block",
              }}
              aria-label={label}
            >
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  style={{
                    position: "absolute",
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                    pointerEvents: "none",
                    animation: "ripple-animation 0.6s ease-out",
                  }}
                />
              ))}
            </a>
          ) : (
            <button
              ref={buttonRef}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                zIndex: 40,
                transformStyle: "preserve-3d",
                transform: "translateZ(25px)",
                transition:
                  EASE_SIZE,
                overflow: "hidden",
                borderRadius: "100px",
              }}
              aria-label={label}
            >
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  style={{
                    position: "absolute",
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                    pointerEvents: "none",
                    animation: "ripple-animation 0.6s ease-out",
                  }}
                />
              ))}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiquidMetalButton;
