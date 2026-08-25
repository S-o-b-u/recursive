const FOOTER_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Email", href: "mailto:hello@recursive.dev" },
];

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="section-inner footer-inner">
        <span className="footer-wordmark">Recursive</span>

        <div className="footer-links">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="footer-link">
              {link.label}
            </a>
          ))}
        </div>

        <span className="footer-copy">© 2026 Recursive</span>
      </div>

      <style>{`
        .footer-root {
          border-top: var(--border-width) solid var(--color-border);
        }
        .footer-inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.25rem;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        .footer-wordmark {
          font-size: var(--font-size-sm);
          font-weight: 500;
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .footer-link {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          letter-spacing: var(--tracking-wide);
          transition: color 200ms ease;
        }
        .footer-link:hover {
          color: var(--color-text);
        }
        .footer-copy {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          letter-spacing: var(--tracking-wide);
        }
      `}</style>
    </footer>
  );
}
