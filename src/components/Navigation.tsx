"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Timeline", href: "#timeline" },
  { label: "Tracks", href: "#tracks" },
  { label: "Prizes", href: "#prizes" },
  { label: "FAQ", href: "#faq" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav-root">
      <div className="section-inner nav-inner">
        <a href="#" className="nav-wordmark">
          Recursive
        </a>

        <div className="nav-desktop">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a href="#register" className="btn btn-primary nav-cta">
            Register
          </a>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </>
            ) : (
              <>
                <line x1="1" y1="5.5" x2="17" y2="5.5" />
                <line x1="1" y1="12.5" x2="17" y2="12.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="nav-mobile-link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            className="btn btn-primary"
            onClick={() => setMenuOpen(false)}
            style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
          >
            Register
          </a>
        </div>
      )}

      <style>{`
        .nav-root {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--color-bg);
          border-bottom: var(--border-width) solid var(--color-border);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 3.5rem;
        }
        .nav-wordmark {
          font-size: var(--font-size-sm);
          font-weight: 500;
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
        }
        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          letter-spacing: var(--tracking-wide);
          transition: color 200ms ease;
        }
        .nav-link:hover {
          color: var(--color-text);
        }
        .nav-cta {
          padding: 0.5rem 1.25rem;
          font-size: var(--font-size-xs);
        }
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--color-text);
        }
        .nav-mobile-menu {
          padding: 1rem var(--padding-x) 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-bottom: var(--border-width) solid var(--color-border);
        }
        .nav-mobile-link {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
