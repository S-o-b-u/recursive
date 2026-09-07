import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRACKS, TRACK_CRITERIA } from "@/data/hackathon";
import { TRACK_DETAILS } from "@/data/track-details";
import TrackBackButton from "@/components/TrackBackButton";
import Ornament from "@/components/ui/Ornament";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TRACKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = TRACKS.find((t) => t.slug === slug);
  if (!track) return { title: "Track Not Found" };

  return {
    title: `${track.title} — Track Brief`,
    description: track.summary,
  };
}

export default async function TrackDetailPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const trackIndex = TRACKS.findIndex((t) => t.slug === slug);
  if (trackIndex === -1) notFound();

  const track = TRACKS[trackIndex];
  const detail = TRACK_DETAILS[slug];
  const criteria = TRACK_CRITERIA[slug] || [
    "Originality & Vision",
    "Technical Craft & Execution",
    "Demo & Presentation Quality",
  ];

  const prevTrack = TRACKS[(trackIndex - 1 + TRACKS.length) % TRACKS.length];
  const nextTrack = TRACKS[(trackIndex + 1) % TRACKS.length];

  return (
    <main className="tb-main">
      {/* ── Bespoke Track Brief Hero Header ── */}
      <header className="tb-hero">
        <div className="tb-hero-inner">
          {/* ── Top Bar: Clean Breadcrumb ── */}
          <nav className="tb-hero-nav" aria-label="Track Navigation">
            <TrackBackButton />
          </nav>

          {/* ── Section Header Motif ── */}
          <div className="tb-ornament-wrap">
            <Ornament tone="night" className="tb-motif" />
          </div>

          {/* ── Split Hero: Track Title & Image (Left), The Mandate (Right) ── */}
          <div className="tb-split-hero">
            {/* ── Left Column: Title & Artwork ── */}
            <div className="tb-left-col">
              <div className="tb-hero-head">
                <span className="tb-hero-eyebrow">THE SIX TRACKS · {track.seat.toUpperCase()}</span>
                <h1 className="tb-hero-title">{track.title}</h1>
                <p className="tb-hero-quote">&ldquo;{track.line}&rdquo;</p>
              </div>

              {track.media.src && (
                <div className="tb-media-wrap">
                  <div className="tb-media-hero">
                    <img
                      src={track.media.src}
                      alt={track.title}
                      className="tb-media-img"
                    />

                    {/* Giant outlined Bebas track numeral */}
                    <span className="tb-media-index" aria-hidden="true">
                      0{trackIndex + 1}
                    </span>

                    {/* Dual-layer gloss & vignette depth */}
                    <div className="tb-media-vignette" aria-hidden="true" />
                    <span className="tb-media-gloss" aria-hidden="true" />
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Column: The Mandate ── */}
            <div className="tb-right-col">
              <div className="tb-mandate-card">
                <div className="tb-mandate-top">
                  <span className="tb-section-eyebrow">The Mandate</span>
                  <h2 className="tb-mandate-title">Why this track exists</h2>
                  <p className="tb-summary-text">{track.summary}</p>
                  {detail?.vision && <p className="tb-vision-text">{detail.vision}</p>}
                </div>

                {detail?.whoShouldBuild && (
                  <div className="tb-target-box">
                    <span className="tb-box-badge">Who Should Build Here</span>
                    <p className="tb-box-desc">{detail.whoShouldBuild}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <article className="tb-content">
        <div className="tb-inner">

          {/* ── Seat Story & Heritage Banner ── */}
          {detail?.seatStory && (
            <section className="tb-section tb-seat-lore-section">
              <div className="tb-seat-lore-content">
                <div className="tb-seat-lore-meta">
                  <span className="tb-seat-eyebrow">HERITAGE &amp; LORE · {track.seat.toUpperCase()}</span>
                  <h2 className="tb-seat-title">{detail.seatTitle}</h2>
                </div>
                <p className="tb-seat-text">{detail.seatStory}</p>
              </div>
            </section>
          )}

          {/* ── Core Exploration Prompts ── */}
          <section className="tb-section">
            <span className="tb-section-eyebrow">Directional Prompts</span>
            <h2 className="tb-section-title">Core prompts to spark your build</h2>
            <div className="tb-prompts-grid">
              {track.prompts.map((prompt, idx) => (
                <div key={idx} className="tb-prompt-card">
                  <div className="tb-prompt-icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 12 14" className="tb-leaf-icon">
                      <path d="M6 13.4V4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M6.2 7.6C10 7 11.4 4 11.6 0.4C7.8 0.6 6 4 6.2 7.6Z" fill="currentColor" />
                      <path d="M5.6 10.6C2.4 10.2 1 8 0.6 5C3.8 5.2 5.4 7.6 5.6 10.6Z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="tb-prompt-title">{prompt}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Starter Ideas ── */}
          {detail?.starterIdeas && detail.starterIdeas.length > 0 && (
            <section className="tb-section">
              <span className="tb-section-eyebrow">Sample Concepts</span>
              <h2 className="tb-section-title">Concrete starter ideas to build upon</h2>
              <div className="tb-ideas-grid">
                {detail.starterIdeas.map((idea, idx) => (
                  <div key={idx} className="tb-idea-card">
                    <div className="tb-idea-head">
                      <span className="tb-idea-num">0{idx + 1}</span>
                      {idea.tagline && <span className="tb-idea-tagline">{idea.tagline}</span>}
                    </div>
                    <h3 className="tb-idea-heading">{idea.title}</h3>
                    <p className="tb-idea-desc">{idea.desc}</p>
                    {idea.stack && idea.stack.length > 0 && (
                      <div className="tb-idea-tags">
                        {idea.stack.map((stk, sIdx) => (
                          <span key={sIdx} className="tb-idea-chip">
                            {stk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 8-Hour Sprint Playbook ── */}
          {detail?.sprintPlaybook && detail.sprintPlaybook.length > 0 && (
            <section className="tb-section">
              <span className="tb-section-eyebrow">Execution Roadmap</span>
              <h2 className="tb-section-title">The 8-Hour Craft Timeline</h2>
              <p className="tb-section-sub">
                Eight hours demands military clarity and continuous momentum. Here is how top-tier teams pace their build from the opening bell to the live demo.
              </p>
              <div className="tb-playbook-grid">
                {detail.sprintPlaybook.map((step, idx) => (
                  <div key={idx} className="tb-playbook-card">
                    <div className="tb-playbook-top">
                      <span className="tb-playbook-phase">{step.phase}</span>
                      <span className="tb-playbook-hours">{step.hours}</span>
                    </div>
                    <h3 className="tb-playbook-heading">{step.title}</h3>
                    <p className="tb-playbook-focus">{step.focus}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── The Winning Edge vs Pitfalls Matrix ── */}
          {((detail?.theWinningEdge && detail.theWinningEdge.length > 0) ||
            (detail?.pitfallsToAvoid && detail.pitfallsToAvoid.length > 0)) && (
            <section className="tb-section">
              <span className="tb-section-eyebrow">Judges&rsquo; Playbook</span>
              <h2 className="tb-section-title">What wins vs. what disqualifies</h2>
              <div className="tb-edge-grid">
                {detail?.theWinningEdge && detail.theWinningEdge.length > 0 && (
                  <div className="tb-edge-card tb-edge-win">
                    <div className="tb-edge-head">
                      <div className="tb-edge-badge tb-badge-win">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="tb-edge-icon" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>The Winning Edge</span>
                      </div>
                      <p className="tb-edge-summary">What elevates a project from good to undeniable track champion:</p>
                    </div>
                    <ul className="tb-edge-list">
                      {detail.theWinningEdge.map((edge, idx) => (
                        <li key={idx} className="tb-edge-item">
                          <span className="tb-edge-bullet tb-bullet-win" />
                          <span>{edge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detail?.pitfallsToAvoid && detail.pitfallsToAvoid.length > 0 && (
                  <div className="tb-edge-card tb-edge-trap">
                    <div className="tb-edge-head">
                      <div className="tb-edge-badge tb-badge-trap">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="tb-edge-icon" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Pitfalls to Avoid</span>
                      </div>
                      <p className="tb-edge-summary">Common traps that sink otherwise capable hackathon teams:</p>
                    </div>
                    <ul className="tb-edge-list">
                      {detail.pitfallsToAvoid.map((pitfall, idx) => (
                        <li key={idx} className="tb-edge-item">
                          <span className="tb-edge-bullet tb-bullet-trap" />
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Suggested Tech Stack & Tools ── */}
          {detail?.suggestedStack && detail.suggestedStack.length > 0 && (
            <section className="tb-section">
              <span className="tb-section-eyebrow">Tooling &amp; Infrastructure</span>
              <h2 className="tb-section-title">Recommended stack &amp; starter kits</h2>
              <div className="tb-stack-wrap">
                {detail.suggestedStack.map((tech) => (
                  <span key={tech} className="tb-stack-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── Judging & Evaluation Focus ── */}
          <section className="tb-section">
            <span className="tb-section-eyebrow">Judging Focus</span>
            <h2 className="tb-section-title">How this track is scored</h2>
            <div className="tb-criteria-list">
              {criteria.map((crit, idx) => (
                <div key={idx} className="tb-criterion-row">
                  <span className="tb-crit-idx">Point 0{idx + 1}</span>
                  <div className="tb-crit-content">
                    <p className="tb-crit-text">{crit}</p>
                  </div>
                </div>
              ))}
            </div>

            {detail?.submissionTips && (
              <div className="tb-tips-box">
                <h3 className="tb-tips-title">Pro-Tips for Hackathon Day</h3>
                <ul className="tb-tips-list">
                  {detail.submissionTips.map((tip, idx) => (
                    <li key={idx} className="tb-tip-item">
                      <span className="tb-tip-bullet" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* ── Closing Call to Action ── */}
          <section className="tb-closing-cta">
            <div className="tb-closing-cta-inner">
              <div className="tb-closing-cta-info">
                <span className="tb-section-eyebrow">Ready to Ship?</span>
                <h3 className="tb-closing-cta-heading">Claim your seat in {track.title}</h3>
                <p className="tb-closing-cta-desc">
                  Join hundreds of ambitious builders, designers, and systems architects for 8 hours of intense focus, dedicated mentorship, and live stage presentations at GNIT.
                </p>
              </div>
            </div>
          </section>

          {/* ── Track Switcher: Prev / Next ── */}
          <nav className="tb-switcher" aria-label="Other Tracks">
            <Link href={`/tracks/${prevTrack.slug}`} className="tb-switch-link tb-switch-prev">
              <svg viewBox="0 0 24 24" className="tb-switch-arrow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="tb-switch-kicker">Prev Track</span>
              <span className="tb-switch-sep" aria-hidden="true">—</span>
              <span className="tb-switch-title">{prevTrack.title}</span>
            </Link>

            <Link href={`/tracks/${nextTrack.slug}`} className="tb-switch-link tb-switch-next">
              <span className="tb-switch-title">{nextTrack.title}</span>
              <span className="tb-switch-sep" aria-hidden="true">—</span>
              <span className="tb-switch-kicker">Next Track</span>
              <svg viewBox="0 0 24 24" className="tb-switch-arrow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </div>
      </article>

      <style>{`
        .tb-main {
          color: #EFF3EB;
          background: #060B05;
          min-height: 100vh;
          font-family: var(--font-dm-sans), system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* ── Hero Header ── */
        .tb-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding-top: clamp(6.5rem, 13vh, 8.5rem);
          padding-bottom: clamp(3rem, 6vh, 4.5rem);
          color: #EFF3EB;
          background: #060B05;
        }

        .tb-hero-inner {
          position: relative;
          z-index: 1;
          max-width: min(88rem, calc(100vw - 2.5rem));
          margin: 0 auto;
          padding-inline: clamp(0.75rem, 1.8vw, 1.5rem);
        }

        .tb-hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
          flex-wrap: wrap;
        }

        .tb-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1.25rem, 2.5vh, 2rem);
        }

        .tb-motif {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
        }

        .tb-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: none;
          color: rgba(200, 222, 192, 0.85);
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          text-decoration: none;
          cursor: pointer;
          transition: transform 180ms ease, color 180ms ease;
        }

        .tb-back-btn:hover {
          transform: translateX(-3px);
          background: transparent;
          border: none;
          color: #FFFFFF;
        }

        .tb-back-icon {
          width: 0.95rem;
          height: 0.95rem;
          transition: transform 180ms ease;
        }

        .tb-back-btn:hover .tb-back-icon {
          transform: translateX(-2px);
        }

        /* ── Split Hero Layout ── */
        .tb-split-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
          align-items: stretch;
        }

        @media (min-width: 960px) {
          .tb-split-hero {
            grid-template-columns: 1.04fr 1fr;
            gap: clamp(0.75rem, 1.4vw, 1.15rem);
          }
        }

        .tb-left-col {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .tb-right-col {
          display: flex;
          flex-direction: column;
        }

        .tb-mandate-card {
          padding: clamp(1.2rem, 1.8vw, 1.65rem);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .tb-mandate-top {
          display: flex;
          flex-direction: column;
        }

        .tb-mandate-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.45rem, 2.4vw, 2rem);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #F4F8EE;
          margin-bottom: 1rem;
        }

        .tb-hero-head {
          margin-bottom: 0;
        }

        .tb-hero-eyebrow {
          display: block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8FC45A;
          margin-bottom: 0.5rem;
        }

        .tb-hero-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #EFF3EB;
          margin-bottom: 0.65rem;
        }

        .tb-hero-quote {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.96rem, 1.25vw, 1.12rem);
          font-style: italic;
          font-weight: 400;
          color: rgba(222, 235, 212, 0.88);
          line-height: 1.55;
          letter-spacing: -0.01em;
          max-width: 38rem;
        }

        .tb-media-wrap {
          position: relative;
          width: 100%;
          border-radius: 8px;
        }
        .tb-media-hero {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 1514 / 1039;
          border-radius: 8px;
          overflow: hidden;
          background: #060B05;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 24px 60px -12px rgba(0, 0, 0, 0.8),
            0 8px 24px -4px rgba(0, 0, 0, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.28),
            inset 0 -1px 2px rgba(0, 0, 0, 0.7);
        }

        .tb-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: contrast(1.06) saturate(1.12) brightness(1.02);
          transition: transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tb-media-wrap:hover .tb-media-img {
          transform: scale(1.035);
        }

        .tb-media-index {
          position: absolute;
          left: clamp(1rem, 2.2vw, 1.6rem);
          top: clamp(0.5rem, 1.2vw, 1rem);
          z-index: 4;
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(3.2rem, 6.5vw, 5.2rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: transparent;
          -webkit-text-stroke: 1.4px rgba(255, 255, 255, 0.38);
          pointer-events: none;
          transition: -webkit-text-stroke 300ms ease;
        }

        .tb-media-wrap:hover .tb-media-index {
          -webkit-text-stroke: 1.4px rgba(255, 255, 255, 0.65);
        }
        .tb-media-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 62%, rgba(6, 11, 5, 0.45) 100%);
        }

        .tb-media-gloss {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.03) 30%, transparent 60%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        /* ── Content Section ── */
        .tb-content {
          position: relative;
          padding: clamp(2rem, 4vh, 3.5rem) clamp(0.75rem, 1.8vw, 1.5rem) clamp(6rem, 12vh, 9rem);
          background: #060B05;
          color: #EFF3EB;
        }

        :global(.footer-shell),
        :global(footer.footer-shell) {
          display: none !important;
        }

        .tb-inner {
          max-width: min(88rem, calc(100vw - 2.5rem));
          margin: 0 auto;
        }

        .tb-section {
          margin-bottom: clamp(2.8rem, 6vw, 4.5rem);
        }

        .tb-section-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8FC45A;
          display: block;
          margin-bottom: 0.45rem;
        }

        .tb-section-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.5rem, 3.2vw, 2.2rem);
          font-weight: 500;
          line-height: 1.16;
          letter-spacing: -0.02em;
          color: #F4F8EE;
          margin-bottom: 1.25rem;
        }

        .tb-section-sub {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.96rem;
          color: rgba(222, 235, 212, 0.78);
          line-height: 1.6;
          margin-top: -0.75rem;
          margin-bottom: 1.5rem;
          max-width: 48rem;
        }

        /* ── Seat Story & Heritage Banner ── */
        .tb-seat-lore-section {
          margin-bottom: clamp(2.8rem, 6vw, 4.5rem);
          position: relative;
        }

        .tb-seat-lore-content {
          position: relative;
          padding: 0.5rem 0 0.5rem 1.75rem;
          border-left: 2px solid rgba(143, 196, 90, 0.45);
          background: transparent;
        }

        .tb-seat-lore-meta {
          margin-bottom: 0.85rem;
        }

        .tb-seat-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 550;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8FC45A;
          display: block;
          margin-bottom: 0.35rem;
        }

        .tb-seat-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.4rem, 2.4vw, 1.95rem);
          font-weight: 500;
          color: #F4F8EE;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .tb-seat-text {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1.02rem, 1.25vw, 1.14rem);
          line-height: 1.76;
          letter-spacing: -0.01em;
          color: rgba(238, 245, 230, 0.92);
          text-wrap: pretty;
          max-width: 62rem;
        }

        .tb-summary-text {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(1.02rem, 1.35vw, 1.16rem);
          font-weight: 400;
          line-height: 1.65;
          letter-spacing: -0.01em;
          color: rgba(238, 245, 230, 0.94);
          margin-bottom: 1rem;
        }

        .tb-vision-text {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: -0.005em;
          color: rgba(222, 235, 212, 0.8);
        }

        .tb-target-box {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          border-radius: 0;
          box-shadow: none;
        }

        .tb-box-badge {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8FC45A;
          display: block;
          margin-bottom: 0.4rem;
        }

        .tb-box-desc {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          line-height: 1.6;
          color: rgba(222, 235, 212, 0.88);
        }

        .tb-prompts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .tb-prompt-card {
          padding: 1.25rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
        }

        .tb-prompt-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(92, 140, 58, 0.35);
          transform: translateY(-2px);
        }

        .tb-prompt-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border-radius: 0;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .tb-leaf-icon {
          width: 0.75rem;
          height: 0.75rem;
          color: #8FC45A;
        }

        .tb-prompt-title {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.9375rem;
          line-height: 1.55;
          letter-spacing: -0.01em;
          color: #EFF3EB;
          font-weight: 500;
        }

        .tb-ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
        }

        .tb-idea-card {
          padding: 1.4rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
          display: flex;
          flex-direction: column;
        }

        .tb-idea-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(92, 140, 58, 0.35);
          transform: translateY(-2px);
        }

        .tb-idea-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.45rem;
          flex-wrap: wrap;
        }

        .tb-idea-num {
          font-family: var(--font-bebas), sans-serif;
          font-size: 1.5rem;
          line-height: 1;
          letter-spacing: 0.02em;
          color: #8FC45A;
        }

        .tb-idea-tagline {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.78rem;
          font-style: normal;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: #8FC45A;
        }

        .tb-idea-heading {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1.08rem;
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.015em;
          color: #FFFFFF;
          margin-bottom: 0.45rem;
        }

        .tb-idea-desc {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          line-height: 1.62;
          color: rgba(222, 235, 212, 0.78);
          margin-bottom: auto;
        }

        .tb-idea-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .tb-idea-chip {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: rgba(200, 222, 192, 0.85);
          letter-spacing: 0.02em;
        }

        /* ── 8-Hour Sprint Playbook ── */
        .tb-playbook-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.15rem;
        }

        .tb-playbook-card {
          padding: 1.4rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: transform 200ms ease, border-color 200ms ease;
        }

        .tb-playbook-card:hover {
          transform: translateY(-2px);
          border-color: rgba(92, 140, 58, 0.35);
        }

        .tb-playbook-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .tb-playbook-phase {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8FC45A;
        }

        .tb-playbook-hours {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(222, 235, 212, 0.65);
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: none;
        }

        .tb-playbook-heading {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #F4F8EE;
          margin-bottom: 0.45rem;
          line-height: 1.35;
          letter-spacing: -0.015em;
        }

        .tb-playbook-focus {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.875rem;
          line-height: 1.6;
          color: rgba(222, 235, 212, 0.76);
        }

        /* ── The Winning Edge vs Pitfalls ── */
        .tb-edge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.35rem;
        }

        .tb-edge-card {
          padding: clamp(1.35rem, 2vw, 1.85rem);
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .tb-edge-win {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(143, 196, 90, 0.22);
          border-left: 3px solid #8FC45A;
        }

        .tb-edge-trap {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(242, 158, 109, 0.2);
          border-left: 3px solid #F29E6D;
        }

        .tb-edge-head {
          margin-bottom: 1.15rem;
        }

        .tb-edge-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: none;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 0.5rem;
        }

        .tb-badge-win {
          color: #8FC45A;
        }

        .tb-badge-trap {
          color: #F29E6D;
        }

        .tb-edge-icon {
          width: 0.85rem;
          height: 0.85rem;
        }

        .tb-edge-summary {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.88rem;
          color: rgba(222, 235, 212, 0.78);
          line-height: 1.5;
        }

        .tb-edge-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tb-edge-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.9rem;
          line-height: 1.58;
          color: #EFF3EB;
        }

        .tb-edge-bullet {
          width: 5px;
          height: 5px;
          border-radius: 1px;
          margin-top: 0.48rem;
          flex-shrink: 0;
        }

        .tb-bullet-win {
          background: #8FC45A;
        }

        .tb-bullet-trap {
          background: #F29E6D;
        }

        .tb-stack-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .tb-stack-chip {
          padding: 0.35rem 0.75rem;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: #D6E6CC;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }

        .tb-stack-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(143, 196, 90, 0.35);
          color: #FFFFFF;
        }

        .tb-criteria-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .tb-criterion-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding: 0.95rem 1.25rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .tb-crit-idx {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8FC45A;
          flex-shrink: 0;
        }

        .tb-crit-text {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.95rem;
          line-height: 1.55;
          color: #EFF3EB;
          font-weight: 450;
        }

        .tb-tips-box {
          margin-top: 1.5rem;
          padding: 1.25rem 1.5rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(143, 196, 90, 0.2);
          border-left: 3px solid #8FC45A;
        }

        .tb-tips-title {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #8FC45A;
          margin-bottom: 0.65rem;
        }

        .tb-tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tb-tip-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.9rem;
          line-height: 1.55;
          color: rgba(222, 235, 212, 0.88);
        }

        .tb-tip-bullet {
          width: 4px;
          height: 4px;
          border-radius: 1px;
          background: #8FC45A;
          margin-top: 0.48rem;
          flex-shrink: 0;
        }

        .tb-closing-cta {
          margin-bottom: clamp(2.8rem, 6vw, 4.5rem);
          padding: clamp(1.8rem, 3.2vw, 2.5rem);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }

        .tb-closing-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .tb-closing-cta-info {
          max-width: 38rem;
        }

        .tb-closing-cta-heading {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.4rem, 2.4vw, 2rem);
          font-weight: 500;
          color: #EFF3EB;
          line-height: 1.2;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .tb-closing-cta-desc {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.95rem;
          color: rgba(222, 235, 212, 0.82);
          line-height: 1.6;
        }

        .tb-closing-cta-action {
          flex-shrink: 0;
        }

        .tb-switcher {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.75rem;
          padding-top: 2.5rem;
          padding-bottom: 1.5rem;
          margin-top: 2rem;
          border-top: 1px solid rgba(143, 196, 90, 0.16);
          position: relative;
        }

        .tb-switcher::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(143, 196, 90, 0.45), transparent);
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .tb-switcher {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.35rem;
          }

          .tb-switch-next {
            align-self: flex-end;
          }
        }

        .tb-switch-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          border: none;
          padding: 0.35rem 0;
          text-decoration: none;
          cursor: pointer;
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tb-switch-link:active {
          transform: scale(0.985);
        }

        .tb-switch-prev:hover {
          transform: translateX(-4px);
        }

        .tb-switch-next:hover {
          transform: translateX(4px);
        }

        .tb-switch-arrow {
          width: 1.15rem;
          height: 1.15rem;
          color: #8FC45A;
          flex-shrink: 0;
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), color 180ms ease;
        }

        .tb-switch-prev:hover .tb-switch-arrow {
          transform: translateX(-3px);
          color: #A8E866;
        }

        .tb-switch-next:hover .tb-switch-arrow {
          transform: translateX(3px);
          color: #A8E866;
        }

        .tb-switch-kicker {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
          font-weight: 500;
          color: #8FC45A;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          white-space: nowrap;
          transition: color 180ms ease;
        }

        .tb-switch-sep {
          color: rgba(143, 196, 90, 0.4);
          font-size: 0.95rem;
          user-select: none;
          transition: color 180ms ease;
        }

        .tb-switch-title {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1.08rem;
          font-weight: 600;
          letter-spacing: -0.012em;
          color: #EFF3EB;
          white-space: nowrap;
          transition: color 180ms ease, text-shadow 180ms ease;
        }

        .tb-switch-link:hover .tb-switch-title {
          color: #FFFFFF;
          text-shadow: 0 0 16px rgba(239, 243, 235, 0.28);
        }

        .tb-switch-link:hover .tb-switch-sep {
          color: rgba(143, 196, 90, 0.8);
        }

        .tb-switch-link:hover .tb-switch-kicker {
          color: #A8E866;
        }
      `}</style>
    </main>
  );
}
