import Image from "next/image";
import type { Slot } from "@/data/hackathon";
import RetroDither, {
  type RetroDitherOptions,
} from "@/components/canvasui/RetroDither";

/**
 * A media placeholder that turns into real media the moment you fill in `src`.
 *
 * Empty  → a labelled box showing the exact path to drop the file at.
 * Filled → <Image fill> or an autoplaying muted <video>, cropped to the ratio,
 *          wrapped in the RetroDither lens so the cursor drags a dithered
 *          window across it.
 *
 * The dither only mounts for slots that actually have a `src`. That matters:
 * every instance takes a WebGL2 context and browsers cap you at roughly sixteen,
 * while this page carries twenty-plus slots. Empty placeholders create none.
 *
 * The <style> carries href + precedence so React dedupes it — this renders
 * twenty-plus times per page and shouldn't emit twenty copies of the CSS.
 */

/** The lens settings, one place so every image on the site matches. */
const DITHER: RetroDitherOptions = {
  radius: 0.5,
  softness: 1,
  pixelSize: 2,
  levels: 4,
  colorize: 0.1,
  contrast: 0.6,
  brightness: 0,
  strength: 0.75,
  baseStrength: 0,
  invert: 0,
  scanlines: 0,
  pattern: "bayer",
  trail: 0.4,
  degauss: 0.8,
  followSpeed: 3,
  darkColor: [0, 0, 0],
  lightColor: [1, 1, 1],
};

export default function MediaSlot({
  slot,
  ratio = "4 / 3",
  fit = "cover",
  sizes = "(max-width: 860px) 100vw, 33vw",
  className = "",
  tone = "light",
  dither = true,
}: {
  slot: Slot;
  ratio?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  className?: string;
  tone?: "light" | "dark";
  /** Opt out for marks that must stay pixel-exact, e.g. a sponsor logo. */
  dither?: boolean;
}) {
  const { label, expect, src, kind = "image" } = slot;

  const media = src ? (
    kind === "video" ? (
      <video
        className="ms-media"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        style={{ objectFit: fit }}
      />
    ) : (
      <Image
        src={src}
        alt={label}
        fill
        sizes={sizes}
        className="ms-media"
        style={{ objectFit: fit }}
      />
    )
  ) : null;

  return (
    <div
      className={`ms ms-${tone} ${className}`}
      style={{ aspectRatio: ratio }}
      data-filled={src ? "true" : "false"}
    >
      {media ? (
        dither ? (
          <RetroDither className="ms-dither" {...DITHER}>
            {media}
          </RetroDither>
        ) : (
          media
        )
      ) : (
        <div className="ms-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ms-icon">
            <rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="8.75" cy="9.75" r="1.6" fill="currentColor" />
            <path d="M4 17l4.6-4.4a1.7 1.7 0 0 1 2.3 0L20 20.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="ms-label">{label}</span>
          <code className="ms-path">{expect}</code>
        </div>
      )}

      <style href="media-slot" precedence="default">{`
        .ms {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.45);
        }
        .ms[data-filled="false"] {
          border: 1px dashed rgba(47, 85, 39, 0.28);
        }
        .ms-dark[data-filled="false"] {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(230, 240, 225, 0.24);
        }

        /* RetroDither renders its own relative wrapper; stretch it over the
           ratio box so <Image fill> still has a sized ancestor. */
        .ms-dither {
          position: absolute;
          inset: 0;
        }

        .ms-media {
          width: 100%;
          height: 100%;
          display: block;
        }

        .ms-empty {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 1rem;
          text-align: center;
          color: var(--color-text-tertiary);
        }
        .ms-dark .ms-empty { color: rgba(214, 230, 205, 0.55); }

        .ms-icon { width: 1.5rem; height: 1.5rem; opacity: 0.75; }

        .ms-label {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--color-text-secondary);
        }
        .ms-dark .ms-label { color: rgba(230, 240, 225, 0.8); }

        .ms-path {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.66rem;
          letter-spacing: -0.01em;
          opacity: 0.72;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
