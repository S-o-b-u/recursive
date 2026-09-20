"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { NAV_LINKS, EVENT } from "@/data/hackathon";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import NavLink from "@/components/ui/NavLink";
import { triggerScrollExpand } from "@/lib/scroll-expand";
import { getLenis } from "@/lib/lenis";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkHash = () => {
      const h = window.location.hash || "";
      if (h) setActiveSection(h);
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    const sectionIds = ["about", "themes", "judges", "sponsors", "faq"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        }
      },
      { rootMargin: "-25% 0px -45% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("hashchange", checkHash);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.setAttribute("data-menu-open", "true");
      getLenis()?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
      getLenis()?.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
      getLenis()?.start();
    };
  }, [menuOpen]);

  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.dataset.intro === "done" || !document.querySelector(".intro-root");
    }
    return true;
  });

  useEffect(() => {
    if (introFinished) return;
    const onIntroDone = () => setIntroFinished(true);
    window.addEventListener("recursive-intro-done", onIntroDone);

    const observer = new MutationObserver(() => {
      if (
        document.documentElement.dataset.intro === "done" ||
        !document.querySelector(".intro-root")
      ) {
        setIntroFinished(true);
      }
    });

    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-intro"],
      });
    }

    const fallbackTimer = setTimeout(() => setIntroFinished(true), 16000);

    return () => {
      window.removeEventListener("recursive-intro-done", onIntroDone);
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [introFinished]);

  return (
    <>
      <nav className="nav-root">
        <motion.div
          className="nav-glass-container"
          initial={reduced ? false : { y: -22, opacity: 0 }}
          animate={
            introFinished
              ? { y: 0, opacity: 1 }
              : { y: -22, opacity: 0 }
          }
          // Enters after the intro's dissolve (0.65s from hand-off), not during
          // it. This pill carries a 36px backdrop blur and a glass card: fading
          // it in over a backdrop that is itself cross-fading meant re-blurring
          // its region on every frame of the costliest window in the sequence.
          // As a final beat after the hero has settled it costs nothing visible.
          transition={{ duration: reduced ? 0 : 0.7, ease: EASE_OUT, delay: reduced ? 0 : 0.85 }}
        >
          <LiquidGlassCard
            glowIntensity="sm"
            shadowIntensity="md"
            borderRadius="999px" /* completely pill-shaped */
            blurIntensity="lg"
            className="pointer-events-auto"
          >
            <div className="nav-glass-pill-layout">
              {/* Brand mark */}
              <NavLink href="/" className="nav-brand" ariaLabel={`${EVENT.name} — home`}>
                <span className="nav-wordmark">{EVENT.name}</span>
              </NavLink>

              <div className="nav-desktop-links">
                {NAV_LINKS.map((link) => {
                  const hash = link.href.startsWith("/#") ? link.href.slice(1) : link.href;
                  const isAct = activeSection === hash;
                  return (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      isActive={isAct}
                    />
                  );
                })}
              </div>

              {/* Mobile toggle */}
              <button
                className="nav-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <span className={`nav-toggle-icon ${menuOpen ? "is-open" : ""}`} aria-hidden="true">
                  <span className="nav-toggle-bar nav-toggle-bar-1" />
                  <span className="nav-toggle-bar nav-toggle-bar-2" />
                </span>
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
              begin="indefinite"
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
              begin="indefinite"
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

      {/* Editorial Linen Canvas Mobile Navigation (matching LimeIQ reference) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="limelq-nav-screen"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Bar */}
            <motion.div
              className="limelq-head"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/" onClick={() => setMenuOpen(false)} className="limelq-brand">
                {EVENT.name}
              </Link>

              <button
                type="button"
                className="limelq-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>

            {/* Menu List with Black Square Prefix & Hairline Dividers */}
            <div className="limelq-list">
              {[
                { label: "Home", href: "/" },
                { label: "The Chair", href: "/#about" },
                { label: "Themes", href: "/#themes" },
                { label: "Tracks", href: "/tracks" },
                { label: "Judges", href: "/#judges" },
                { label: "Sponsors", href: "/#sponsors" },
                { label: "FAQ", href: "/#faq" },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.24,
                    delay: 0.06 + idx * 0.022,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      setMenuOpen(false);
                      const isSamePage =
                        typeof window !== "undefined" &&
                        (item.href.startsWith("#") ||
                          (item.href.startsWith("/#") &&
                            window.location.pathname === "/"));
                      if (isSamePage) {
                        const hash = item.href.startsWith("/#")
                          ? item.href.slice(1)
                          : item.href;
                        const target = document.querySelector<HTMLElement>(hash);
                        if (target) {
                          e.preventDefault();
                          window.setTimeout(() => triggerScrollExpand(target), 120);
                          window.history.pushState(null, "", hash);
                        }
                      }
                    }}
                    className="limelq-item"
                  >
                    <span className="limelq-bullet" aria-hidden="true" />
                    <span className="limelq-text">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Row: Simple Discord Button */}
            <motion.div
              className="limelq-foot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={EVENT.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="limelq-discord-btn"
                aria-label="Join Discord"
              >
                <svg
                  className="limelq-discord-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  width="20"
                  height="20"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Join Discord</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style href="navigation-style" precedence="default" suppressHydrationWarning>{`
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
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
          padding: 0.5rem 0.85rem;
        }
        .nav-wordmark {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: 1.18rem;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--color-accent-deep);
          white-space: nowrap;
        }

        @media (max-width: 520px) {
          .nav-wordmark { font-size: 1.05rem; line-height: 1.1; }
          .nav-brand {
            padding: 0.35rem 0.65rem;
            transform: translate(3.5px, 2px);
          }
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
        .nav-link.is-active {
          color: #121A12;
          background-color: rgba(143, 196, 90, 0.32);
          font-weight: 600;
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

        .nav-toggle-icon {
          position: relative;
          width: 18px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .nav-toggle-bar {
          display: block;
          width: 18px;
          height: 2.75px;
          background: #121A12;
          border-radius: 999px;
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
          transform-origin: center;
        }
        .nav-toggle-icon.is-open .nav-toggle-bar-1 {
          transform: translateY(4.625px) rotate(45deg);
        }
        .nav-toggle-icon.is-open .nav-toggle-bar-2 {
          transform: translateY(-4.625px) rotate(-45deg);
        }

        /* ── Editorial Linen Canvas Mobile Navigation (matching LimeIQ reference) ── */
        .limelq-nav-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          z-index: 99999;
          /* Translucent frosted linen glass canvas — highly transparent */
          background: rgba(234, 229, 220, 0.52);
          backdrop-filter: blur(36px) saturate(190%);
          -webkit-backdrop-filter: blur(36px) saturate(190%);
          color: #121A12;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(1.4rem, 4vh, 2.2rem) clamp(1.25rem, 5.5vw, 2.4rem);
          padding-bottom: calc(clamp(1.4rem, 4vh, 2.2rem) + env(safe-area-inset-bottom, 0px));
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          will-change: transform, opacity;
        }

        /* Guarantee the hero log/branch is completely hidden when mobile menu is open */
        html[data-menu-open="true"] .hero-log-divider {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .limelq-head {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-bottom: clamp(1rem, 2.5vh, 1.6rem);
        }

        .limelq-brand {
          font-family: var(--font-display), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.45rem, 4.5vw, 1.85rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #121A12;
          text-decoration: none;
          text-align: center;
        }

        .limelq-close {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          width: 2.5rem;
          height: 2.5rem;
          background: transparent;
          border: none;
          color: #121A12;
          cursor: pointer;
          padding: 0;
          transition: transform 180ms var(--ease-out), opacity 180ms ease;
        }
        .limelq-close:hover { opacity: 0.7; }
        .limelq-close:active { transform: translateY(-50%) scale(0.9); }

        .limelq-list {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-block: auto;
        }

        .limelq-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding-block: clamp(0.6rem, 1.8vh, 0.95rem);
          border-bottom: 1px solid rgba(18, 26, 18, 0.2);
          text-decoration: none;
          color: #121A12;
          transition: transform 180ms var(--ease-out), color 180ms ease;
        }
        .limelq-item:first-child {
          border-top: 1px solid rgba(18, 26, 18, 0.2);
        }
        .limelq-item:hover,
        .limelq-item:active {
          transform: translateX(6px);
          color: #2D5824;
        }

        .limelq-bullet {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #121A12;
          margin-right: clamp(0.75rem, 2.5vw, 1.1rem);
          flex-shrink: 0;
          transition: background-color 180ms ease, transform 180ms ease;
        }
        .limelq-item:hover .limelq-bullet,
        .limelq-item:active .limelq-bullet {
          background: #2D5824;
          transform: scale(1.3);
        }

        .limelq-text {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.65rem, 5.5vw, 2.45rem);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: inherit;
        }

        .limelq-item--locked {
          opacity: 0.38;
          cursor: not-allowed;
          user-select: none;
        }
        .limelq-item--locked:hover,
        .limelq-item--locked:active {
          transform: none;
          color: #121A12;
        }
        .limelq-item--locked:hover .limelq-bullet,
        .limelq-item--locked:active .limelq-bullet {
          background: #121A12;
          transform: none;
        }

        .limelq-lock-badge {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #121A12;
          padding: 0.22rem 0.55rem;
          border-radius: 999px;
          background: rgba(18, 26, 18, 0.08);
          border: 1px solid rgba(18, 26, 18, 0.14);
        }

        .limelq-foot {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: clamp(1.2rem, 3vh, 2rem);
        }

        .limelq-discord-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.65rem 1.25rem;
          border-radius: 6px;
          background: #5865F2;
          color: #FFFFFF;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.88rem, 2.4vw, 0.95rem);
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(88, 101, 242, 0.35);
          transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .limelq-discord-btn:hover {
          background: #4752C4;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(88, 101, 242, 0.45);
        }

        .limelq-discord-btn:active {
          transform: scale(0.98);
        }

        .limelq-discord-icon {
          width: 1.15rem;
          height: 1.15rem;
          flex-shrink: 0;
        }

        .limelq-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #121A12;
          color: #F4F0E8;
          padding: 0.65rem 1.15rem;
          border-radius: 4px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.82rem, 2.2vw, 0.92rem);
          font-weight: 500;
          text-decoration: none;
          transition: background 180ms ease, transform 180ms ease;
        }
        .limelq-cta-btn:hover {
          background: #2D5824;
        }
        .limelq-cta-btn:active {
          transform: scale(0.97);
        }
        .limelq-cta-arrow {
          font-size: 1.05rem;
          line-height: 1;
        }

        @media (prefers-reduced-transparency: reduce) {
          .nav-glass-pill {
            background: var(--color-bg);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border: 1px solid var(--color-border);
          }
        }

        @media (max-width: 860px) {
          .nav-root {
            top: clamp(0.6rem, 1.8vh, 0.95rem);
          }

          .nav-glass-pill-layout {
            padding: 0.32rem 0.4rem 0.32rem 0.45rem;
            gap: 0.25rem;
          }

          .nav-brand {
            padding: 0.35rem 0.65rem;
            transform: translate(3.5px, 2px);
          }

          .nav-wordmark {
            font-size: 1.05rem;
            line-height: 1.1;
          }

          .nav-desktop-links, .nav-cta { display: none; }
          .nav-toggle {
            display: grid;
            width: 2.15rem;
            height: 2.15rem;
          }

          .nav-toggle-icon {
            width: 16px;
            height: 11px;
          }

          .nav-toggle-bar {
            width: 16px;
            height: 2.2px;
          }

          .nav-toggle-icon.is-open .nav-toggle-bar-1 {
            transform: translateY(4.4px) rotate(45deg);
          }
          .nav-toggle-icon.is-open .nav-toggle-bar-2 {
            transform: translateY(-4.4px) rotate(-45deg);
          }

          /* Frosted pill on phones -- as a fill, not a backdrop blur.
             This pill sits over the hero's video, and a backdrop-filter has to
             re-blur everything behind it on every frame the backdrop changes,
             which with moving grass is every frame, for the life of the page.
             At DPR 3 that is a ~1000x170px 28px blur per frame: the single
             most expensive thing on the hero for a phone GPU. The backdrop is
             a soft sky; a translucent warm-white fill reads the same at rest
             and costs nothing per frame. */
          .nav-glass-container > div,
          .nav-glass-container :global(.relative.isolate) {
            background: rgba(238, 234, 226, 0.80) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow:
              0 8px 32px rgba(0, 0, 0, 0.06),
              inset 0 1px 1px rgba(255, 255, 255, 0.5) !important;
            border: 1px solid rgba(255, 255, 255, 0.22) !important;
          }
        }
      `}</style>
    </>
  );
}
