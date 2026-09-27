/**
 * Clock numerals drawn in the grammar of the RECURSIVE wordmark.
 *
 * The wordmark is custom lettering, not a font, and no available face has
 * digits in its style, so these are built from its measured geometry. Every
 * glyph lives in a 100 x 268 box (the wordmark's cap proportion, w/h = 0.374):
 *
 *   - stems are 44 wide, bars 36-38 tall
 *   - counters are 11-wide slits (x 44..55) with rounded ends
 *   - outer corners are 40 x 38 elliptical arches
 *   - terminals are flat horizontal cuts, diagonals are thick slabs
 *
 * A glyph is a set of filled shapes minus a set of cuts, rendered through an
 * SVG mask so a cut can open onto the outside (the aperture of a 2, 3, 5 ...)
 * without the fills having to be traced as one outline.
 */

export const GLYPH_W = 100;
export const GLYPH_H = 268;

const RX = 40;
const RY = 38;
const SL = 44; // slit left edge
const SR = 55; // slit right edge

type Corners = { tl?: boolean; tr?: boolean; br?: boolean; bl?: boolean };

/** Rectangle with the wordmark's elliptical arches on the chosen corners. */
function arch(x0: number, y0: number, x1: number, y1: number, c: Corners): string {
  const p: string[] = [];
  p.push(`M${x0 + (c.tl ? RX : 0)} ${y0}`);
  p.push(`H${x1 - (c.tr ? RX : 0)}`);
  if (c.tr) p.push(`A${RX} ${RY} 0 0 1 ${x1} ${y0 + RY}`);
  p.push(`V${y1 - (c.br ? RY : 0)}`);
  if (c.br) p.push(`A${RX} ${RY} 0 0 1 ${x1 - RX} ${y1}`);
  p.push(`H${x0 + (c.bl ? RX : 0)}`);
  if (c.bl) p.push(`A${RX} ${RY} 0 0 1 ${x0} ${y1 - RY}`);
  p.push(`V${y0 + (c.tl ? RY : 0)}`);
  if (c.tl) p.push(`A${RX} ${RY} 0 0 1 ${x0 + RX} ${y0}`);
  return p.join("") + "Z";
}

const ALL: Corners = { tl: true, tr: true, br: true, bl: true };

function rect(x0: number, y0: number, x1: number, y1: number): string {
  return `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
}

/** A counter slit; a rounded end closes it, a square end opens into a cut. */
function slit(y0: number, y1: number, roundTop: boolean, roundBottom: boolean): string {
  const r = (SR - SL) / 2;
  const top = roundTop ? `M${SL} ${y0 + r}A${r} ${r} 0 0 1 ${SR} ${y0 + r}` : `M${SL} ${y0}H${SR}`;
  const bottom = roundBottom ? `V${y1 - r}A${r} ${r} 0 0 1 ${SL} ${y1 - r}` : `V${y1}H${SL}`;
  return `${top}${bottom}Z`;
}

function poly(...pts: [number, number][]): string {
  return "M" + pts.map(([x, y]) => `${x} ${y}`).join("L") + "Z";
}

export interface Glyph {
  fill: string[];
  cut: string[];
  /** Drawn as another glyph turned half a revolution (9 is a turned 6). */
  turn?: boolean;
}

// Cuts that open onto the outside run 4 units past the box (O): a cut edge
// lying exactly on a fill edge leaves an anti-aliased hairline behind.
const O = 4;

const SIX: Glyph = {
  fill: [arch(0, 0, 100, GLYPH_H, ALL)],
  cut: [slit(38, 122, true, false), rect(SL, 98, 100 + O, 122), slit(158, 232, true, true)],
};

export const GLYPHS: Record<string, Glyph> = {
  "0": {
    fill: [arch(0, 0, 100, GLYPH_H, ALL)],
    cut: [slit(38, 232, true, true)],
  },
  "1": {
    fill: [poly([38, 0], [82, 0], [82, GLYPH_H], [38, GLYPH_H], [38, 76], [8, 76], [8, 42])],
    cut: [],
  },
  "2": {
    // the arch stops at the left terminal; the right stem overlaps into the slab
    fill: [
      arch(0, 0, 100, 98, { tl: true, tr: true }),
      rect(SR, 90, 100, 124),
      poly([45, 120], [100, 120], [44, 232], [0, 232], [0, 210]),
      rect(0, 230, 100, GLYPH_H),
    ],
    cut: [slit(38, 104, true, false)],
  },
  "3": {
    fill: [arch(0, 0, 100, GLYPH_H, ALL)],
    cut: [
      slit(38, 116, true, false),
      rect(-O, 96, SR, 116),
      rect(-O, 115, 24, 153),
      rect(-O, 152, SR, 172),
      slit(152, 232, false, true),
      poly([100 + O, 112.2], [89, 134], [100 + O, 155.8]),
    ],
  },
  "4": {
    fill: [poly([50, 0], [100, 0], [100, GLYPH_H], [56, GLYPH_H], [56, 218], [0, 218], [0, 178])],
    cut: [poly([42, 178], [56, 178], [56, 84])],
  },
  "5": {
    fill: [rect(0, 0, 100, 38), rect(0, 0, SL, 142), arch(0, 104, 100, GLYPH_H, { tr: true, br: true, bl: true })],
    cut: [slit(142, 232, false, true), rect(-O, 142, SR, 176)],
  },
  "6": SIX,
  "7": {
    fill: [rect(0, 0, 100, 38), poly([56, 37], [100, 37], [66, GLYPH_H], [22, GLYPH_H])],
    cut: [],
  },
  "8": {
    fill: [arch(0, 0, 100, GLYPH_H, ALL)],
    cut: [
      slit(38, 116, true, true),
      slit(152, 232, true, true),
      poly([-O, 112.2], [11, 134], [-O, 155.8]),
      poly([100 + O, 112.2], [89, 134], [100 + O, 155.8]),
    ],
  },
  "9": { ...SIX, turn: true },
};

/**
 * The four-point sparkle cut into the wordmark's U, used for the colon.
 * Centred on (0, 0), arms reaching +-1; scale it where it is placed.
 */
export const SPARKLE =
  "M0 -1C0.07 -0.26 0.26 -0.07 1 0C0.26 0.07 0.07 0.26 0 1C-0.07 0.26 -0.26 0.07 -1 0C-0.26 -0.07 -0.07 -0.26 0 -1Z";
