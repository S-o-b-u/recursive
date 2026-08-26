"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { NAV_LINKS, EVENT } from "@/data/hackathon";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <>
      <nav className="nav-root">
        <motion.div
          className="nav-glass-container"
          initial={reduced ? false : { y: -22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: EASE_OUT, delay: reduced ? 0 : 0.2 }}
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
              <Link href="/" className="nav-brand" aria-label={`${EVENT.name} — home`}>
                <span className="nav-logo-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="nav-asterisk">
                    <line x1="12" y1="4" x2="12" y2="20" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" />
                    <line x1="6.34" y1="17.66" x2="17.66" y2="6.34" />
                  </svg>
                </span>
                <span className="nav-wordmark">{EVENT.name}</span>
              </Link>

              <div className="nav-desktop-links">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                ))}
              </div>

              <LiquidGlassCard
                glowIntensity="sm"
                shadowIntensity="sm"
                borderRadius="999px"
                blurIntensity="sm"
                tone="dark"
                className="nav-cta-glass"
              >
                <a
                  href={EVENT.devfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-cta"
                >
                  Register
                </a>
              </LiquidGlassCard>

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
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-shrink: 0;
          padding-right: 0.3rem;
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
