import Link from "next/link";
import { EVENT, NAV_LINKS } from "@/data/hackathon";

const SECONDARY = [
  { label: "Sponsors", href: "/sponsors" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "Team", href: "/team" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="footer-mark" aria-hidden="true">
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" />
            <line x1="6.34" y1="17.66" x2="17.66" y2="6.34" />
          </svg>
          <p className="footer-wordmark">{EVENT.name}</p>
          <p className="footer-tagline">{EVENT.tagline}</p>
        </div>

        <nav className="footer-cols" aria-label="Footer">
          <div>
            <p className="footer-col-label">Event</p>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="footer-col-label">More</p>
            {SECONDARY.map((l) => (
              <Link key={l.href} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="footer-col-label">Elsewhere</p>
            <a href={EVENT.discordUrl} target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>
            <a href={EVENT.socials.x} target="_blank" rel="noopener noreferrer" className="footer-link">X</a>
            <a href={EVENT.socials.instagram} target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
            <a href={EVENT.socials.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          </div>
        </nav>
      </div>

      <div className="footer-base">
        <p>
          © {new Date().getFullYear()} {EVENT.name}. {EVENT.format}.
        </p>
        <a href={`mailto:${EVENT.email}`} className="footer-link footer-email">
          {EVENT.email}
        </a>
      </div>

      <style>{`
        .footer {
          background: var(--color-bg-deep);
          color: #dfe8d9;
          padding: clamp(3rem, 7vw, 5rem) 0 2rem;
        }
        .footer-inner {
          max-width: var(--max-width);
          margin-inline: auto;
          padding-inline: var(--padding-x);
          display: grid;
          gap: clamp(2.5rem, 6vw, 5rem);
          grid-template-columns: 1fr;
        }
        .footer-mark { width: 1.5rem; height: 1.5rem; color: var(--color-accent-bright); }
        .footer-wordmark {
          margin-top: 0.9rem;
          font-size: 1.35rem;
          font-weight: 300;
          letter-spacing: 0.14em;
        }
        .footer-tagline {
          margin-top: 0.4rem;
          max-width: 24ch;
          color: #9cb195;
          font-size: var(--font-size-sm);
          line-height: var(--leading-relaxed);
        }
        .footer-cols {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 2rem;
        }
        .footer-col-label {
          font-size: var(--font-size-xs);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          color: #6f8569;
          margin-bottom: 0.9rem;
        }
        .footer-link {
          display: block;
          font-size: var(--font-size-sm);
          color: #cfdcc8;
          padding: 0.28rem 0;
          transition: color 160ms ease;
        }
        .footer-link:hover { color: var(--color-accent-bright); }
        .footer-base {
          max-width: var(--max-width);
          margin: clamp(2.5rem, 6vw, 4rem) auto 0;
          padding: 1.5rem var(--padding-x) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: space-between;
          font-size: var(--font-size-xs);
          color: #7e9377;
        }
        .footer-email { padding: 0; }

        @media (min-width: 820px) {
          .footer-inner { grid-template-columns: 1.1fr 1.4fr; }
        }
        @media (max-width: 520px) {
          .footer-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </footer>
  );
}
