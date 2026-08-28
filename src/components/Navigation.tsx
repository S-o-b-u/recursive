"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { NAV_LINKS, EVENT } from "@/data/hackathon";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import NavLink from "@/components/ui/NavLink";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const isHome = window.location.pathname === "/";
    const isIntroDisabled = new URLSearchParams(window.location.search).get("intro") === "0";
    const isIntroDone = document.documentElement.dataset.intro === "done";

    if (isHome && !isIntroDisabled && !isIntroDone) {
      setIntroActive(true);
    }

    const handleIntroDone = () => {
      setIntroActive(false);
    };

    window.addEventListener("intro:done", handleIntroDone);

    return () => {
      window.removeEventListener("intro:done", handleIntroDone);
    };
  }, []);

  return (
    <>
      <nav className="nav-root">
        <motion.div
          className="nav-glass-container"
          initial={reduced ? false : { y: -22, opacity: 0 }}
          animate={{ y: introActive ? -22 : 0, opacity: introActive ? 0 : 1 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: EASE_OUT, delay: reduced || introActive ? 0 : 0.2 }}
        >
          <LiquidGlassCard
            glowIntensity="sm"
            shadowIntensity="md"
            borderRadius="999px" /* completely pill-shaped */
            blurIntensity="lg"
            className="pointer-events-auto"
          >
            <div className="nav-glass-pill-layout">
              {/* Brand mark — recursive asterisk */}
              <NavLink href="/" className="nav-brand" ariaLabel={`${EVENT.name} — home`}>
                <span className="nav-logo-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="nav-asterisk">
                    <line x1="12" y1="4" x2="12" y2="20" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" />
                    <line x1="6.34" y1="17.66" x2="17.66" y2="6.34" />
                  </svg>
                </span>
                <span className="nav-wordmark">{EVENT.name}</span>
              </NavLink>

              <div className="nav-desktop-links">
                {NAV_LINKS.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>

              <LiquidMetalButton
                label="Register"
                href={EVENT.devfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                width={104}
                height={38}
                className="nav-cta-liquid-metal"
              />

              {/* Mobile toggle */}
              <button
                className="nav-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="9" x2="20" y2="9" />
                      <line x1="4" y1="15" x2="20" y2="15" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </nav>

      {/* Liquid ripple for the nav-link outline — referenced by CSS `filter` */}
      <svg
        className="nav-wave-defs"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="nav-wave" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022 0.05"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="7s"
              values="0.022 0.05; 0.04 0.022; 0.022 0.05"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* gentler ripple for the item's own text/label */}
        <filter id="nav-wave-txt" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.03"
            numOctaves="2"
            seed="4"
            result="n"
          >
            <animate
              attributeName="baseFrequency"
              dur="5.5s"
              values="0.014 0.03; 0.028 0.016; 0.014 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Mobile glass sheet */}
      {menuOpen && (
        <div className="nav-mobile-sheet">
          <div className="nav-mobile-content">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="nav-mobile-link"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={EVENT.devfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary nav-mobile-cta"
            >
              Register on Devfolio
            </a>
          </div>
        </div>
      )}

      <style>{`
        .nav-root {
          position: fixed;
          top: clamp(0.75rem, 2.2vh, 1.5rem);
          left: 0;
          width: 100%;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none; /* only the pill catches clicks */
          transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
        }

        .nav-root[data-intro-active="true"],
        html[data-intro="playing"] .nav-root,
        html[data-intro="pending"] .nav-root {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translateY(-24px) !important;
        }

        .nav-glass-container {
          pointer-events: auto;
          width: max-content;          /* never full-width */
          max-width: calc(100vw - 1.5rem);
        }

        .nav-glass-pill-layout {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem;
        }

        .nav-brand {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-shrink: 0;
          padding: 3px 0.55rem 3px 3px;
        }
        .nav-wordmark {
          font-family: var(--font-display), var(--font-geist-sans), sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--color-accent-deep);
          white-space: nowrap;
        }
        .nav-logo-btn {
          display: grid;
          place-items: center;
          width: 2.3rem;
          height: 2.3rem;
          border-radius: 50%;
          color: var(--color-accent-deep);
          background: rgba(255, 255, 255, 0.6);
          box-shadow:
            0 2px 8px rgba(22, 45, 26, 0.08),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
          transition: transform 200ms var(--ease-out), color 200ms ease;
          flex-shrink: 0;
        }
        .nav-asterisk { width: 1.1rem; height: 1.1rem; }
        .nav-brand:hover .nav-logo-btn { transform: rotate(45deg); color: var(--color-accent); }
        .nav-brand:active .nav-logo-btn { transform: scale(0.92); }

        @media (max-width: 520px) {
          .nav-wordmark { display: none; }
        }

        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          padding-inline: 0.3rem;
        }
        .nav-link {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          font-size: 0.85rem;
          font-weight: 500;
          color: #3d4f3b;
          padding: 0.5rem 0.8rem;
          border-radius: var(--radius-pill);
          transition: color 160ms ease, background-color 160ms ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--color-accent-deep);
          background-color: rgba(255, 255, 255, 0.5);
        }
        /* full static outline under the travelling highlight */
        .nav-link.is-hovered,
        .nav-link.is-tapped,
        .nav-brand.is-hovered,
        .nav-brand.is-tapped {
          box-shadow: inset 0 0 0 1px rgba(92, 140, 58, 0.26);
        }
        .nav-brand.is-hovered {
          background-color: rgba(255, 255, 255, 0.5);
        }

        /* item content — ripples like the hero wordmark while active */
        .nav-link-body {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
        }
        .nav-brand .nav-link-body { gap: 0.55rem; }
        .nav-link-txt { display: inline-block; }

        .nav-link.is-hovered .nav-link-body,
        .nav-brand.is-hovered .nav-link-body {
          filter: url(#nav-wave-txt);
        }
        .nav-link.is-tapped .nav-link-body,
        .nav-brand.is-tapped .nav-link-body {
          filter: url(#nav-wave-txt);
        }

        /* Liquid outline — a conic-gradient border that lights up, spins on
           hover, and ripples through the #nav-wave turbulence filter. */
        @property --nav-a {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .nav-link-ring {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: var(--radius-pill);
          padding: 1.5px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 200ms var(--ease-out);
          background: conic-gradient(
            from var(--nav-a),
            rgba(143, 196, 90, 0) 0deg,
            var(--color-accent-bright) 55deg,
            #eef8df 100deg,
            var(--color-accent) 160deg,
            rgba(143, 196, 90, 0) 240deg,
            rgba(143, 196, 90, 0) 360deg
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
        }
        .nav-link.is-hovered .nav-link-ring,
        .nav-brand.is-hovered .nav-link-ring {
          opacity: 0.85;
          animation: nav-ring-spin 2.4s linear infinite;
          filter: url(#nav-wave) drop-shadow(0 0 4px rgba(143, 196, 90, 0.45));
        }
        .nav-link.is-tapped .nav-link-ring,
        .nav-brand.is-tapped .nav-link-ring {
          opacity: 1;
          animation: nav-ring-spin 0.7s linear infinite;
          filter: url(#nav-wave) drop-shadow(0 0 6px rgba(143, 196, 90, 0.6));
        }
        @keyframes nav-ring-spin {
          to { --nav-a: 360deg; }
        }

        .nav-link-ripple {
          position: absolute;
          z-index: 1;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          background: radial-gradient(
            circle,
            rgba(143, 196, 90, 0.55) 0%,
            rgba(143, 196, 90, 0) 70%
          );
          animation: nav-link-ripple 0.62s var(--ease-out) forwards;
        }
        @keyframes nav-link-ripple {
          to { transform: translate(-50%, -50%) scale(7); opacity: 0; }
        }

        .nav-wave-defs { position: absolute; width: 0; height: 0; }

        @media (prefers-reduced-motion: reduce) {
          .nav-link.is-hovered .nav-link-ring,
          .nav-link.is-tapped .nav-link-ring,
          .nav-brand.is-hovered .nav-link-ring,
          .nav-brand.is-tapped .nav-link-ring {
            animation: none;
            filter: none;
          }
          .nav-link-ripple { display: none; }
        }
        
        .nav-cta-glass {
          border-radius: var(--radius-pill);
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.825rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #f3f8ee;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-pill);
          background: transparent;
          transition: filter 180ms var(--ease-out), transform 180ms var(--ease-out);
          white-space: nowrap;
        }
        .nav-cta:hover { filter: brightness(1.06); }
        .nav-cta:active { transform: scale(0.96); }

        .nav-toggle {
          display: none;
          place-items: center;
          width: 2.3rem;
          height: 2.3rem;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.6);
          color: var(--color-accent-deep);
          cursor: pointer;
          box-shadow:
            0 2px 8px rgba(22, 45, 26, 0.08),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
          transition: transform 160ms var(--ease-out);
        }
        .nav-toggle:active { transform: scale(0.92); }

        .nav-mobile-sheet {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: rgba(239, 243, 235, 0.78);
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
          display: grid;
          place-items: center;
          animation: nav-fade-in 300ms var(--ease-out);
        }
        .nav-mobile-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.35rem;
        }
        .nav-mobile-link {
          font-size: 1.6rem;
          font-weight: 300;
          letter-spacing: var(--tracking-snug);
          color: var(--color-text);
        }
        .nav-mobile-cta { margin-top: 0.75rem; }

        @keyframes nav-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-transparency: reduce) {
          .nav-glass-pill {
            background: var(--color-bg);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border: 1px solid var(--color-border);
          }
          .nav-mobile-sheet {
            background: var(--color-bg);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }

        @media (max-width: 860px) {
          .nav-desktop-links, .nav-cta { display: none; }
          .nav-toggle { display: grid; }
        }
      `}</style>
    </>
  );
}
