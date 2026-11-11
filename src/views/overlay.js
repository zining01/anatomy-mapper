// Surgical-anatomy overlays: nerves, vessels, ducts and danger zones drawn on
// top of the subunit map. Views supply geometry only; names and reference text
// live in reference/structures.js, keyed by the same structure id.
import { spline, pathD } from "../geometry.js";

const curve = (pts) => (pts.length > 2 ? spline(pts, { steps: 8 }) : pts);
const blob = (pts) => spline(pts, { closed: true, steps: 6 });

/** A nerve / vessel / duct drawn as a smooth line through `pts`. */
export const line = (id, layer, pts, extra = {}) => ({ id, layer, kind: "line", pts: curve(pts), ...extra });

/** A hatched danger zone (smooth closed outline); `anchor` is where its "!" badge sits. */
export const zone = (id, pts, anchor, extra = {}) => ({ id, layer: "danger", kind: "zone", pts: blob(pts), anchor, ...extra });

/** A filled area such as a gland. */
export const area = (id, layer, pts, extra = {}) => ({ id, layer, kind: "area", pts: blob(pts), ...extra });

/** A point landmark: foramen, nerve exit / block point, pulse. */
export const point = (id, layer, at, extra = {}) => ({ id, layer, kind: "point", anchor: at, ...extra });

/** Relaxed skin tension lines (not interactive). */
export const rstl = (...lines) => lines.map((pts) => ({ id: "rstl", layer: "rstl", kind: "line", pts: curve(pts), passive: true }));

/**
 * Finalise overlay items for one side of a view. `place` maps authored points
 * to view coordinates (identity, or a mirror for the other side).
 */
export function placeOverlays(items, side, place = (pts) => pts) {
  return items.map((it, i) => {
    const pts = it.pts && place(it.pts);
    return {
      ...it,
      key: `${it.id}-${i}-${side ? side.key : "m"}`,
      sideKey: side ? side.key : null,
      pts,
      d: pts && pathD(pts, it.kind !== "line"),
      anchor: it.anchor && place([it.anchor])[0],
    };
  });
}
