import { pathD, labelPoint, mirror, rev } from "../geometry.js";

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
export const C = {
  skin: "#f3e0cd",
  skinShade: "#e9d0b8",
  skinDeep: "#dfc1a6",
  line: "#9a7656",
  lineSoft: "#c7a789",
  hair: "#ddc9b2",
  hairLine: "#c2a98d",
  brow: "#c2a084",
  lip: "#d8a196",
  lipDeep: "#c3867a",
  iris: "#7b6450",
  pupil: "#3b2e25",
  nostril: "#a27b63",
};

// Colour used for each subunit group (dots, legend and the optional tint).
export const GROUPS = {
  scalp: { label: "Scalp", color: "#7d6ea6" },
  forehead: { label: "Forehead / temple", color: "#b7832a" },
  eye: { label: "Brow / eyelids", color: "#24877f" },
  nose: { label: "Nose", color: "#c0562e" },
  cheek: { label: "Cheek", color: "#3d6b8a" },
  lip: { label: "Lips", color: "#a23e6b" },
  chin: { label: "Chin / jaw", color: "#6f7d2a" },
  ear: { label: "Ear", color: "#4f7f39" },
  helix: { label: "Helix", color: "#4f7f39" },
  antihelix: { label: "Antihelix / scapha / fossa", color: "#24877f" },
  concha: { label: "Concha / canal", color: "#3d6b8a" },
  tragus: { label: "Tragus / antitragus", color: "#b7832a" },
  lobule: { label: "Lobule", color: "#a23e6b" },
  periauricular: { label: "Periauricular skin", color: "#8b6a4c" },
  neck: { label: "Neck", color: "#8b6a4c" },
  body: { label: "Body site", color: "#3d6b8a" },
};

// ---------------------------------------------------------------------------
// Laterality
// ---------------------------------------------------------------------------
// Drawings are authored for one side; `side` objects describe how to label a
// shape once it is placed on the patient's right or left.
export const RIGHT = { key: "r", Side: "Right", side: "right" };
export const LEFT = { key: "l", Side: "Left", side: "left" };
export const other = (s) => (s === RIGHT ? LEFT : RIGHT);

/** Fill "{Side}" / "{side}" placeholders in a name or alias. */
export const sided = (text, s) => (s ? text.replace(/\{Side\}/g, s.Side).replace(/\{side\}/g, s.side) : text);

/**
 * Build a clickable region.
 *   pts      polygon (list of [x, y]); omit for dot-only sites
 *   dot      marker position; defaults to the polygon's visual centre
 *   base     fill used when drawing the artwork underneath
 *   link     key of another view this region opens on double-click
 *   navigate if true, a single click opens `link` instead of selecting
 */
export function region({ id, name, aliases = [], group, pts, dot, base, link, navigate, side }) {
  return {
    id: side ? `${id}-${side.key}` : id,
    name: sided(name, side),
    aliases: aliases.map((a) => sided(a, side).toLowerCase()),
    group,
    d: pts ? pathD(pts) : null,
    pts,
    dot: dot || (pts ? labelPoint(pts) : null),
    base,
    link,
    navigate,
  };
}

/**
 * Create the pair of regions for a shape authored on the viewer's left half of
 * a symmetric drawing (centre `cx`). `leftSide` says which patient side the
 * authored half represents (RIGHT on anterior views, LEFT on posterior views).
 */
export function pair(spec, cx, leftSide) {
  const { pts } = spec;
  const dot = spec.dot || (pts ? labelPoint(pts) : null);
  return [
    region({ ...spec, dot, side: leftSide }),
    region({
      ...spec,
      side: other(leftSide),
      pts: pts && rev(mirror(pts, cx)),
      dot: dot && [2 * cx - dot[0], dot[1]],
    }),
  ];
}
