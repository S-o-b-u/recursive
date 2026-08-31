"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CornerBadge({ className = "" }: { className?: string }) {
  const [revealed, setRevealed] = useState(false);

  // Completion is signalled three ways (the dataset flip, the custom event,
  // and again from finish()), and on the skip path finish() lands ~1.5s after
  // the bail already signalled. Without this latch the badge unrolled, then
  // restarted from zero once the hero was already on screen.
  const fired = useRef(false);

  useEffect(() => {
    let mounted = true;
    let timer1: ReturnType<typeof setTimeout> | undefined;
    let timer2: ReturnType<typeof setTimeout> | undefined;

    const triggerEmergence = () => {
      if (!mounted || fired.current) return;
      fired.current = true;
      setRevealed(true);
    };

    // Check if intro is actively playing right now in the DOM
    const isPlaying =
      typeof document !== "undefined" &&
      (document.documentElement.dataset.intro === "playing" ||
        !!document.querySelector(".intro-scene"));

    if (!isPlaying) {
      timer1 = setTimeout(triggerEmergence, 250);
    }

    // Intro is playing: listen for completion / skip signal
    const onIntroDone = () => {
      timer2 = setTimeout(triggerEmergence, 100);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("recursive-intro-done", onIntroDone);
    }

    let observer: MutationObserver | undefined;
    if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
      observer = new MutationObserver(() => {
        if (
          document.documentElement.dataset.intro === "done" ||
          !document.querySelector(".intro-scene")
        ) {
          timer2 = setTimeout(triggerEmergence, 100);
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-intro"],
      });
    }

    return () => {
      mounted = false;
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
      if (typeof window !== "undefined") {
        window.removeEventListener("recursive-intro-done", onIntroDone);
      }
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className={`corner-badge-wrap ${revealed ? "corner-badge-revealed" : "corner-badge-pending"} ${className}`}
    >
      <Link href="/#about" className="corner-badge" aria-label="Shift to the power 8 The ACM Hackathon">
        <span className="corner-bar-lead" aria-hidden="true">|</span>
        <span className="corner-emergence-mask">
          <span className="corner-emerging-text">
            <span className="corner-shift">
              Shift<sup className="corner-pow">8</sup>
            </span>
            <span className="corner-space">&nbsp;</span>
            <span className="corner-sub">The ACM Hackathon</span>
          </span>
        </span>
      </Link>

      <style href="corner-badge" precedence="default" suppressHydrationWarning>{`
        /* ── Top-Left Corner Badge (Emerging from |) ── */
        .corner-badge-wrap {
          position: absolute;
          top: clamp(0.85rem, 2.2vh, 1.8rem);
          left: clamp(0.85rem, 2.8vw, 2.8rem);
          z-index: 20;
          pointer-events: auto;
        }

        .corner-badge-pending {
          visibility: hidden;
          opacity: 0;
        }

        .corner-badge-revealed {
          visibility: visible;
          opacity: 1;
        }

        .corner-badge {
          display: inline-flex;
          align-items: baseline;
          gap: 0.35rem;
          padding: 0.25rem 0;
          background: transparent;
          border: none;
          box-shadow: none;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 1.3vw, 0.85rem);
          font-weight: 550;
          color: #122013;
          letter-spacing: -0.01em;
          text-decoration: none;
          user-select: none;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .corner-badge:hover {
          opacity: 0.75;
          transform: translateY(-1px);
        }

        .corner-bar-lead {
          color: #386B20;
          font-weight: 800;
          font-size: clamp(0.82rem, 1.4vw, 0.95rem);
          line-height: 1;
          display: inline-block;
          animation: corner-bar-pulse 1.3s ease-in-out infinite;
        }

        /* Emergence Mask: unrolls outward from | */
        .corner-emergence-mask {
          display: inline-flex;
          align-items: baseline;
          overflow: hidden;
          white-space: nowrap;
          max-width: 0;
          opacity: 0;
        }

        .corner-badge-revealed .corner-emergence-mask {
          max-width: 360px;
          opacity: 1;
          animation: corner-unroll-width 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Inner Text: slides outward from behind the | bar to the right */
        .corner-emerging-text {
          display: inline-flex;
          align-items: baseline;
          white-space: nowrap;
          transform: translateX(-100%);
        }

        .corner-badge-revealed .corner-emerging-text {
          transform: translateX(0);
          animation: corner-slide-emerge 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .corner-shift {
          font-weight: 700;
          color: #111e13;
          display: inline-flex;
          align-items: baseline;
        }

        .corner-pow {
          font-size: 0.72em;
          vertical-align: super;
          line-height: 0;
          font-weight: 800;
          color: #2F5527;
          margin-left: 1px;
        }

        .corner-space {
          font-size: 0.75em;
        }

        .corner-sub {
          color: #354E33;
          font-weight: 500;
        }

        @keyframes corner-unroll-width {
          0% {
            max-width: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            max-width: 360px;
            opacity: 1;
          }
        }

        @keyframes corner-slide-emerge {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes corner-bar-pulse {
          0%, 100% {
            opacity: 1;
            transform: scaleY(1);
            text-shadow: 0 0 6px rgba(56, 107, 32, 0.55);
          }
          50% {
            opacity: 0.45;
            transform: scaleY(0.92);
            text-shadow: none;
          }
        }

        /* ── Tablet & Mobile Responsiveness (Cleanly placed lower below Navbar, Frameless like Desktop) ── */
        @media (max-width: 960px) {
          .corner-badge-wrap {
            top: clamp(5.2rem, 11vh, 6.2rem);
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
          }
          .corner-badge {
            font-size: clamp(0.72rem, 2.4vw, 0.85rem);
            gap: 0.35rem;
            padding: 0.25rem 0;
            background: transparent;
            border: none;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
          .corner-badge-revealed .corner-emergence-mask {
            max-width: 340px;
          }
          @keyframes corner-unroll-width {
            0%   { max-width: 0; opacity: 0; }
            10%  { opacity: 1; }
            100% { max-width: 340px; opacity: 1; }
          }
        }

        @media (max-width: 480px) {
          .corner-badge-wrap {
            top: clamp(4.7rem, 9.5vh, 5.4rem);
            left: 50%;
            transform: translateX(-50%);
          }
          .corner-badge {
            font-size: clamp(0.66rem, 2.9vw, 0.76rem);
            gap: 0.25rem;
            padding: 0.2rem 0;
          }
          .corner-badge-revealed .corner-emergence-mask {
            max-width: 280px;
          }
          @keyframes corner-unroll-width {
            0%   { max-width: 0; opacity: 0; }
            10%  { opacity: 1; }
            100% { max-width: 280px; opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}
