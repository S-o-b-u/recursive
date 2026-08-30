/**
 * Procedural cover art for the track slider.
 *
 * `TRACKS[].media.src` is still empty — no artwork has been shot for the four
 * tracks yet — but the morph shader needs a real texture per slide or every
 * frame falls back to flat #181818. So each track gets a painted plate instead
 * of a placeholder box: a deep base, a few soft light pools, and a set of
 * nested rings drifting off-centre, which is the recursion motif the event is
 * named after. Swap a real photo into `media.src` and it wins automatically.
 *
 * Canvas, not SVG: WebGL texture upload from an SVG data URI is inconsistent
 * across browsers, a PNG data URL never is. Client-only — call it from an
 * effect, never during render.
 */

export type TrackPalette = {
  /** Backdrop, darkest. */
  base: string;
  /** The two light pools. */
  glow: [string, string];
  /** Ring + hatch ink. */
  line: string;
};

/** One palette per track, in `TRACKS` order. Wraps if tracks are added. */
export const TRACK_PALETTES: TrackPalette[] = [
  { base: "#0B1A0C", glow: ["#4E8F32", "#9BD35C"], line: "#C6EE93" },
  { base: "#07161A", glow: ["#1E6E70", "#5FC8B0"], line: "#9FE7D6" },
  { base: "#141007", glow: ["#8A6320", "#E0AE4C"], line: "#F2D79B" },
  { base: "#150B1B", glow: ["#5C3382", "#B072D9"], line: "#DCB8F0" },
];

const W = 1024;
const H = 640;

function pool(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(0.45, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function paint(palette: TrackPalette, seed: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Deterministic per-track jitter, so the four plates read as a set but never
  // as the same picture recoloured.
  const j = (n: number) => ((Math.sin(seed * 12.9898 + n * 78.233) + 1) / 2);

  ctx.fillStyle = palette.base;
  ctx.fillRect(0, 0, W, H);

  ctx.globalCompositeOperation = "lighter";
  pool(ctx, W * (0.24 + j(1) * 0.2), H * (0.28 + j(2) * 0.2), W * 0.52, palette.glow[0], 0.5);
  pool(ctx, W * (0.7 + j(3) * 0.16), H * (0.68 + j(4) * 0.18), W * 0.4, palette.glow[1], 0.34);
  pool(ctx, W * (0.52 + j(5) * 0.1), H * (0.1 + j(6) * 0.1), W * 0.3, palette.glow[1], 0.16);
  ctx.globalCompositeOperation = "source-over";

  // ── Nested rings, each one nudged along a slow drift: recursion, drawn. ──
  const cx = W * (0.36 + j(7) * 0.3);
  const cy = H * (0.5 + j(8) * 0.16);
  const dx = (j(9) - 0.5) * 26;
  const dy = (j(10) - 0.5) * 26;
  ctx.strokeStyle = palette.line;
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    ctx.globalAlpha = 0.16 * (1 - t) + 0.03;
    ctx.lineWidth = 1 + (1 - t) * 1.6;
    ctx.beginPath();
    ctx.arc(cx + dx * i, cy + dy * i, 34 + i * i * 3.6, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // ── Hairline hatch, raking across at the palette angle ──
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.42 + j(11) * 0.84);
  ctx.strokeStyle = palette.line;
  ctx.globalAlpha = 0.05;
  ctx.lineWidth = 1;
  for (let x = -W; x < W; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x, -H);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  // ── Vignette, so the shader's own edge falloff has something to sit on ──
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.72);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // ── Grain: a small noise tile blown up, cheaper than per-pixel on 1024×640 ──
  const nw = 220;
  const nh = 138;
  const noise = document.createElement("canvas");
  noise.width = nw;
  noise.height = nh;
  const nctx = noise.getContext("2d");
  if (nctx) {
    const img = nctx.createImageData(nw, nh);
    for (let i = 0; i < nw * nh; i++) {
      const v = 120 + Math.random() * 135;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 26;
    }
    nctx.putImageData(img, 0, 0);
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(noise, 0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
  }

  return canvas.toDataURL("image/png");
}

/**
 * Painted plate per track, in order. Falls back to the real `src` where one
 * exists, so dropping artwork into `/public` replaces the generated plate with
 * no code change.
 */
export function buildTrackTextures(sources: (string | undefined)[]): string[] {
  return sources.map((src, i) =>
    src ? src : paint(TRACK_PALETTES[i % TRACK_PALETTES.length], i + 1),
  );
}
