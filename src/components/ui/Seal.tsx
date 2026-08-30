"use client";

import { useEffect, useId, useRef } from "react";
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";

/**
 * Seal — a section taped off, "not decided yet".
 *
 * Two long strips of deep-pine barrier tape crossed in a wide X over the
 * (dimmed, blurred) content, with a blob of green sealing WAX pressed dead on
 * the crossing: an irregular pooled edge, a glossy top-left catch, faint press
 * rings, and the recursive asterisk + "<word> / UNTIL THE REVEAL" *debossed*
 * into it. A whisper of the Register button's liquid-metal shader drifts under
 * the varnish.
 *
 * Render it as the last child of a `position: relative` wrapper. Shader is
 * optional (WebGL failure degrades to the CSS wax), self-pauses off-screen,
 * and honours prefers-reduced-motion. The `<style>` dedupes across instances.
 */

const RUN = " ·  SEALED UNTIL THE REVEAL  ".repeat(9);

/** Irregular wax blob + a slightly smaller inset for the raised-lip line. */
const WAX =
  "M121 13C159 12 191 31 208 64C219 85 217 107 221 130C225 152 214 179 189 197C167 212 143 219 120 221C96 219 69 210 47 193C24 175 16 149 15 125C14 102 19 80 24 61C39 30 70 14 121 13Z";
const WAX_INNER =
  "M121 32C152 31 178 47 192 74C201 91 199 109 203 129C207 147 199 169 178 184C160 196 141 202 121 204C101 202 78 194 60 180C41 165 34 143 33 123C32 104 36 86 41 70C53 45 78 32 121 32Z";

export default function Seal({ word = "SEALED" }: { word?: string }) {
  const shaderHost = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: external lib, untyped mount
  const mount = useRef<any>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const id = (name: string) => `seal-${name}-${uid}`;

  useEffect(() => {
    const el = shaderHost.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      mount.current = new ShaderMount(
        el,
        liquidMetalFragmentShader,
        {
          u_colorBack: [0.08, 0.2, 0.1, 1],
          u_colorTint: [0.32, 0.52, 0.26, 1],
          u_repetition: 2,
          u_softness: 0.96,
          u_shiftRed: 0.05,
          u_shiftBlue: 0.06,
          u_distortion: 0.06,
          u_contour: 0.12,
          u_angle: 210,
          u_shape: 1,
          u_scale: 2.4,
          u_offsetX: 0,
          u_offsetY: 0,
        },
        undefined,
        reduce ? 0 : 0.16,
      );
    } catch {
      /* wax reads fine without it */
    }
    return () => {
      mount.current?.dispose?.();
      mount.current = null;
    };
  }, []);

  return (
    <div className="jseal" aria-hidden="true">
      <div className="jseal-tape jseal-tape-a">
        <div className="jseal-track">
          <span className="jseal-run">{RUN}</span>
          <span className="jseal-run">{RUN}</span>
        </div>
      </div>
      <div className="jseal-tape jseal-tape-b">
        <div className="jseal-track jseal-track--rev">
          <span className="jseal-run">{RUN}</span>
          <span className="jseal-run">{RUN}</span>
        </div>
      </div>

      <div className="jseal-wax">
        <svg viewBox="0 0 240 240" role="img" aria-label={`${word} — sealed until the reveal`}>
          <defs>
            <radialGradient id={id("fill")} cx="40%" cy="34%" r="74%">
              <stop offset="0" stopColor="#164a29" />
              <stop offset="0.42" stopColor="#0f3a21" />
              <stop offset="0.72" stopColor="#1f5230" />
              <stop offset="0.9" stopColor="#0c2c16" />
              <stop offset="1" stopColor="#081f0f" />
            </radialGradient>
            <linearGradient id={id("rim")} x1="0.18" y1="0.04" x2="0.86" y2="1">
              <stop offset="0" stopColor="rgba(232,244,224,0.92)" />
              <stop offset="0.38" stopColor="rgba(226,240,216,0.06)" />
              <stop offset="1" stopColor="rgba(8,22,12,0.55)" />
            </linearGradient>
            <path id={id("arcTop")} d="M36 120 A88 88 0 0 1 204 120" fill="none" />
            <path id={id("arcBot")} d="M40 120 A84 84 0 0 0 200 120" fill="none" />

            <filter id={id("deboss")} x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b" />
              <feOffset in="b" dx="0" dy="2.6" result="lo" />
              <feFlood floodColor="#071e0c" floodOpacity="0.72" result="lc" />
              <feComposite in="lc" in2="lo" operator="in" result="ls" />
              <feOffset in="b" dx="0" dy="-2.2" result="ho" />
              <feFlood floodColor="#5fae52" floodOpacity="0.6" result="hc" />
              <feComposite in="hc" in2="ho" operator="in" result="hs" />
              <feMerge>
                <feMergeNode in="hs" />
                <feMergeNode in="ls" />
              </feMerge>
            </filter>

            <clipPath id={id("clip")}>
              <path d={WAX} />
            </clipPath>
          </defs>

          <path className="jseal-drop" d={WAX} />
          <path className="jseal-body" d={WAX} fill={`url(#${id("fill")})`} />

          <g clipPath={`url(#${id("clip")})`}>
            <g className="jseal-rings" stroke="#0a2712" fill="none">
              <circle cx="122" cy="118" r="96" strokeWidth="2.4" />
              <circle cx="122" cy="118" r="72" strokeWidth="1.8" />
              <circle cx="122" cy="118" r="50" strokeWidth="1.5" />
            </g>
            <g className="jseal-ridge" stroke="#376b41" fill="none">
              <circle cx="122" cy="118" r="94" strokeWidth="1.6" />
              <circle cx="122" cy="118" r="70" strokeWidth="1.4" />
            </g>

            <g className="jseal-legend" fill="#0b2812" filter={`url(#${id("deboss")})`}>
              <text>
                <textPath href={`#${id("arcTop")}`} startOffset="50%" textAnchor="middle">
                  {word}
                </textPath>
              </text>
              <text>
                <textPath href={`#${id("arcBot")}`} startOffset="50%" textAnchor="middle">
                  UNTIL&#8201;&#8201;THE&#8201;&#8201;REVEAL
                </textPath>
              </text>
            </g>

            <g
              className="jseal-mark"
              stroke="#0e3319"
              strokeWidth="14"
              strokeLinecap="round"
              filter={`url(#${id("deboss")})`}
            >
              <line x1="120" y1="70" x2="120" y2="166" />
              <line x1="72" y1="118" x2="168" y2="118" />
              <line x1="85.6" y1="83.6" x2="154.4" y2="152.4" />
              <line x1="85.6" y1="152.4" x2="154.4" y2="83.6" />
            </g>
          </g>

          <foreignObject x="18" y="16" width="204" height="208" clipPath={`url(#${id("clip")})`}>
            <div ref={shaderHost} className="jseal-liquid" />
          </foreignObject>

          <path d={WAX} fill="none" stroke={`url(#${id("rim")})`} strokeWidth="4" />
          <path className="jseal-lip" d={WAX_INNER} fill="none" stroke="rgba(8,22,12,0.42)" strokeWidth="2.5" />
        </svg>
        <div className="jseal-gloss" />
      </div>

      <style href="seal" precedence="default">{`
        .jseal {
          position: absolute;
          inset: clamp(-2.5rem, -4vw, -1.25rem) -9%;
          z-index: 3;
          pointer-events: none;
        }
        .jseal::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(130% 100% at 50% 44%, rgba(237,243,229,0) 52%, rgba(230,237,221,0.45) 100%);
        }

        .jseal-tape {
          position: absolute;
          left: 50%;
          top: 44%;
          width: 250%;
          margin-left: -125%;
          height: clamp(40px, 5.2vw, 56px);
          display: flex;
          align-items: center;
          overflow: hidden;
          color: rgba(238, 244, 229, 0.95);
          background:
            linear-gradient(180deg, rgba(178, 158, 118, 0.22) 0%, rgba(178, 158, 118, 0) 14%),
            linear-gradient(180deg, rgba(30, 60, 28, 0.97) 0%, rgba(13, 31, 11, 0.98) 100%);
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 15%, #000 85%, transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0%, #000 15%, #000 85%, transparent 100%);
          filter: drop-shadow(0 14px 26px rgba(12, 26, 12, 0.5));
        }
        .jseal-tape-a { transform: translateY(-50%) rotate(-35deg); }
        .jseal-tape-b { transform: translateY(-50%) rotate(33deg); }

        .jseal-track { display: flex; flex: none; animation: jseal-scroll 34s linear infinite; }
        .jseal-track--rev { animation-direction: reverse; }
        .jseal-run {
          flex: none;
          white-space: nowrap;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.68rem, 1.3vw, 0.88rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }
        @keyframes jseal-scroll { to { transform: translateX(-50%); } }

        .jseal-wax {
          position: absolute;
          left: 50%;
          top: 44%;
          width: clamp(152px, 19vw, 216px);
          aspect-ratio: 1;
          transform: translate(-50%, -50%) rotate(-4deg);
          animation: jseal-press 760ms var(--ease-out) both;
        }
        .jseal-wax svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }

        .jseal-drop {
          fill: rgba(9, 22, 11, 0.46);
          transform: translate(4px, 13px);
          filter: blur(9px);
        }
        .jseal-rings { opacity: 0.32; }
        .jseal-ridge { opacity: 0.3; }
        .jseal-lip { opacity: 0.7; }
        .jseal-legend text {
          font-family: var(--font-geist-mono), monospace;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .jseal-liquid {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          opacity: 0.14;
          mix-blend-mode: soft-light;
        }
        .jseal-liquid canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        }

        .jseal-gloss {
          position: absolute;
          inset: 5% 9% 32% 6%;
          border-radius: 52% 48% 44% 56% / 60% 58% 42% 40%;
          pointer-events: none;
          mix-blend-mode: screen;
          background: radial-gradient(56% 42% at 32% 18%, rgba(255,255,255,0.55), rgba(255,255,255,0) 62%);
          animation: jseal-gloss 10s ease-in-out infinite alternate;
        }

        @keyframes jseal-gloss {
          0%   { transform: translate(0, 0); opacity: 0.9; }
          100% { transform: translate(7%, 5%); opacity: 0.55; }
        }
        @keyframes jseal-press {
          0%   { opacity: 0; transform: translate(-50%, -50%) rotate(-4deg) scale(1.18); }
          58%  { opacity: 1; }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(-4deg) scale(1); }
        }

        @media (max-width: 1024px) {
          .jseal-tape {
            width: 300%;
            margin-left: -150%;
          }
          .jseal-tape-a { transform: translateY(-50%) rotate(-45deg); }
          .jseal-tape-b { transform: translateY(-50%) rotate(43deg); }
        }

        @media (max-width: 768px) {
          .jseal-tape {
            width: 360%;
            margin-left: -180%;
            height: clamp(38px, 6.2vw, 48px);
          }
          .jseal-tape-a { transform: translateY(-50%) rotate(-54deg); }
          .jseal-tape-b { transform: translateY(-50%) rotate(52deg); }
          .jseal-wax { width: clamp(120px, 30vw, 150px); }
        }

        @media (max-width: 480px) {
          .jseal-tape {
            width: 400%;
            margin-left: -200%;
          }
          .jseal-tape-a { transform: translateY(-50%) rotate(-58deg); }
          .jseal-tape-b { transform: translateY(-50%) rotate(56deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .jseal-track,
          .jseal-gloss,
          .jseal-wax { animation: none; }
        }
      `}</style>
    </div>
  );
}
