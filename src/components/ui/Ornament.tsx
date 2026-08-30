/**
 * Ornament — the section divider that sits above every centred heading.
 *
 * Replaces the old two-swoop-and-a-bud motif, which read as a bow and arrow
 * rather than anything botanical. This is an engraver's rule instead: a laurel
 * pair sweeping out from a centred lozenge, each branch carrying alternating
 * leaves that shrink toward the tip, closed off by a hairline that fades into
 * the page. Symmetrical by mirroring one drawn branch, so both sides match to
 * the pixel.
 *
 * `tone` picks the ink — "light" for the sage sections above the valley,
 * "night" for everything below it. Pure SVG, no client JS; `currentColor`
 * carries the accent so a parent can override it.
 */

const LEAF = "M0 0C4.6 -1.6 8.4 -4.6 10.6 -9.4C5.2 -10.4 0.8 -5.8 0 0Z";

/** Where the leaves sit on the branch: x, y, rotation, scale, and which side. */
const LEAVES = [
  { x: 148, y: 20.4, r: -14, s: 1.0, flip: false },
  { x: 163, y: 23.2, r: 152, s: 0.86, flip: true },
  { x: 179, y: 24.8, r: -9, s: 0.88, flip: false },
  { x: 195, y: 26.6, r: 157, s: 0.72, flip: true },
  { x: 210, y: 27.8, r: -6, s: 0.7, flip: false },
  { x: 224, y: 29.2, r: 161, s: 0.56, flip: true },
] as const;

function Branch({ mirror }: { mirror: boolean }) {
  return (
    <g transform={mirror ? "translate(260 0) scale(-1 1)" : undefined}>
      {/* the stem — a long, shallow sweep that keeps flattening as it runs out */}
      <path
        d="M138 17.6C158 18.6 176 22 196 25.4C214 28.4 232 30.6 252 31.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.9"
      />
      {LEAVES.map((l, i) => (
        <path
          key={i}
          d={LEAF}
          fill="currentColor"
          opacity={0.9 - i * 0.07}
          transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s} ${l.flip ? -l.s : l.s})`}
        />
      ))}
      {/* seed at the very tip, then the rule that dissolves */}
      <circle cx="252" cy="31.4" r="1.15" fill="currentColor" opacity="0.55" />
    </g>
  );
}

export default function Ornament({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "night";
}) {
  return (
    <svg
      viewBox="0 0 260 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`orn orn-${tone} ${className}`.trim()}
      aria-hidden="true"
    >
      <Branch mirror={false} />
      <Branch mirror />

      {/* ── Centre: a lozenge with a hairline inside it, sat on a short stem ── */}
      <path
        d="M130 3.5L136.4 12.8L130 22.1L123.6 12.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M130 8.4L133.1 12.8L130 17.2L126.9 12.8Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M130 22.1V29.4"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* two small leaves at the foot of the stem, closing the composition */}
      <path
        d={LEAF}
        fill="currentColor"
        opacity="0.8"
        transform="translate(129 29.6) rotate(196) scale(0.62)"
      />
      <path
        d={LEAF}
        fill="currentColor"
        opacity="0.8"
        transform="translate(131 29.6) rotate(-16) scale(0.62)"
      />
      <circle cx="130" cy="33.6" r="1.35" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
