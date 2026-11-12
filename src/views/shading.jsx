// Soft shading for the drawings: blurred shadows and highlights clipped to the
// figure, plus an "inner shadow" that rounds off the silhouette. Purely
// decorative — none of it takes pointer events.
import { pathD } from "../geometry.js";

export const SHADE = "#8a5536";
export const LIGHT = "#fff3e2";

/** Ellipse as a point list (so it can be mirrored / placed like any other shape). */
export const ell = (cx, cy, rx, ry, rot = 0, n = 20) => {
  const a = (rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return Array.from({ length: n }, (_, i) => {
    const t = (2 * Math.PI * i) / n, x = rx * Math.cos(t), y = ry * Math.sin(t);
    return [cx + x * c - y * s, cy + x * s + y * c];
  });
};

/** A filled soft shape. o = opacity, b = blur radius. */
export const blob = (pts, o, b, color = SHADE) => ({ pts, o, b, color });
/** A soft stroke along an open line. w = width. */
export const streak = (pts, w, o, b, color = SHADE) => ({ pts, w, o, b, color, open: true });

/**
 * Shading clipped to `clip` (one or more closed point lists, drawn as a union).
 *   edge   strength of the inner shadow along the silhouette (0 = none)
 *   depth  how far the inner shadow reaches
 *   items  blob() / streak() shapes
 *   place  maps authored points to view coordinates (e.g. a mirror)
 */
export function Shade({ id, clip, items = [], edge = 0.55, depth = 5, place = (p) => p }) {
  const clips = clip.map((p) => pathD(place(p)));
  const blurs = [...new Set(items.map((it) => it.b))];
  return (
    <g pointerEvents="none">
      <defs>
        <clipPath id={`${id}-clip`}>{clips.map((d, i) => <path key={i} d={d} />)}</clipPath>
        {blurs.map((b) => (
          <filter key={b} id={`${id}-b${String(b).replace(".", "_")}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={b} />
          </filter>
        ))}
        <filter id={`${id}-edge`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={depth} result="soft" />
          <feComponentTransfer in="soft" result="outside">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feFlood floodColor={SHADE} floodOpacity={edge} />
          <feComposite operator="in" in2="outside" />
          <feComposite operator="in" in2="SourceAlpha" />
        </filter>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {items.map((it, i) => {
          const d = pathD(place(it.pts), !it.open);
          const filter = `url(#${id}-b${String(it.b).replace(".", "_")})`;
          return it.open ? (
            <path key={i} d={d} fill="none" stroke={it.color} strokeWidth={it.w} strokeLinecap="round" strokeLinejoin="round" opacity={it.o} filter={filter} />
          ) : (
            <path key={i} d={d} fill={it.color} opacity={it.o} filter={filter} />
          );
        })}
      </g>
      {edge > 0 && <g filter={`url(#${id}-edge)`}>{clips.map((d, i) => <path key={i} d={d} />)}</g>}
    </g>
  );
}

/** Fine hair strands radiating from a crown point, to be clipped to the hair-bearing regions. */
export function strands(crown, from, to, step, length, bend = 10) {
  const out = [];
  for (let a = from; a <= to; a += step) {
    const r = (a * Math.PI) / 180, dx = Math.cos(r), dy = Math.sin(r);
    const wob = ((a * 7) % 5) - 2;
    out.push([
      [crown[0] + 10 * dx, crown[1] + 10 * dy],
      [crown[0] + length * 0.5 * dx - (bend + wob) * dy, crown[1] + length * 0.5 * dy + (bend + wob) * dx],
      [crown[0] + length * dx - bend * 0.6 * dy, crown[1] + length * dy + bend * 0.6 * dx],
    ]);
  }
  return out;
}
