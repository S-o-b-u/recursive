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
    <>
      <nav className="nav-root">
        <div className="nav-glass-pill">
          {/* Circular logo/asterisk mimicking the left button in the reference */}
          <a href="#" className="nav-logo-btn" aria-label="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-asterisk">
              <line x1="12" y1="4" x2="12" y2="20"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="6.34" y1="6.34" x2="17.66" y2="17.66"></line>
              <line x1="6.34" y1="17.66" x2="17.66" y2="6.34"></line>
            </svg>
          </a>

          <div className="nav-desktop-links">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <a href="#register" className="nav-register-btn">
            Register
          </a>

          {/* Mobile Toggle */}
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Glass Sheet */}
      {menuOpen && (
        <div className="nav-mobile-sheet">
          <div className="nav-mobile-content">
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
          </div>
        </div>
      )}

      <style>{`
        .nav-root {
          position: fixed;
          top: clamp(1rem, 3vh, 2rem);
          left: 0;
          width: 100%;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none; /* Let clicks pass through the full-width wrapper */
        }

        .nav-glass-pill {
          pointer-events: auto; /* Re-enable clicks for the pill itself */
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem;
          border-radius: 9999px;
          
          /* The Liquid Glass Material */
          background: rgba(250, 249, 246, 0.4);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          
          /* Light catching edges and depth */
          border-top: 1px solid rgba(255, 255, 255, 0.6);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.8),
            inset 0 -1px 2px rgba(0, 0, 0, 0.05);
            
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-logo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          color: var(--color-text);
          
          /* Inner pill button styling matching the reference */
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 2px 8px rgba(0,0,0,0.05),
            inset 0 2px 4px rgba(255,255,255,0.9),
            inset 0 -2px 4px rgba(0,0,0,0.02);
            
          transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms ease;
        }

        .nav-asterisk {
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Physical tactile feedback */
        .nav-logo-btn:active {
          transform: scale(0.92);
          background: rgba(255, 255, 255, 0.3);
        }

        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.75rem;
        }

        .nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          transition: color 150ms ease, background-color 150ms ease;
        }

        .nav-link:hover {
          color: var(--color-text);
          background-color: rgba(255, 255, 255, 0.3);
        }

        .nav-register-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 2.75rem;
          padding: 0 1.5rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text);
          text-decoration: none;
          
          /* Embossed glossy pill matching reference */
          background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%);
          border-top: 1px solid rgba(255,255,255,1);
          box-shadow: 
            0 4px 12px rgba(0,0,0,0.05),
            inset 0 2px 4px rgba(255,255,255,0.8),
            inset 0 -2px 4px rgba(0,0,0,0.05);
            
          transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), filter 150ms ease;
        }

        /* Physical tactile feedback */
        .nav-register-btn:active {
          transform: scale(0.95);
          filter: brightness(0.95);
        }

        .nav-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          color: var(--color-text);
          cursor: pointer;
          box-shadow: 
            0 2px 8px rgba(0,0,0,0.05),
            inset 0 2px 4px rgba(255,255,255,0.9),
            inset 0 -2px 4px rgba(0,0,0,0.02);
          transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-toggle:active {
          transform: scale(0.92);
        }

        .nav-mobile-sheet {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 90;
          background: rgba(250, 249, 246, 0.7);
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-mobile-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-mobile-link {
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--color-text);
          text-decoration: none;
          transition: transform 150ms ease;
        }
        
        .nav-mobile-link:active {
          transform: scale(0.95);
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Reduced Transparency Fallback */
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

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .nav-desktop-links {
            display: none;
          }
          .nav-toggle {
            display: flex;
          }
          .nav-register-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
