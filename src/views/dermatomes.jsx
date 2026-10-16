// Dermatome maps (anterior & posterior), drawn on the shared body figure.
//
// Layout follows the ISNCSCI / ASIA dermatome chart and its key sensory points
// (e.g. C5 lateral antecubital fossa, T4 nipple, T10 umbilicus, L4 medial
// malleolus, S1 lateral heel). Each level is built from generous "pieces" that
// are clipped twice: to a body frame (trunk, arm or leg — so bands on the trunk
// cannot spill onto a limb) and to the body silhouette. That way only the
// internal boundaries between levels need to be drawn by hand.
//
// Pieces are authored for the viewer's left half; the other side is mirrored.
// Arm/leg pieces use limb-local coordinates (x < 0 lateral, x > 0 medial).
import { chain, rev, pathD } from "../geometry.js";
import { RIGHT, LEFT, other } from "./common.js";
import { CX, VIEWBOX, arm, leg, armPt, legPt, flipX, parts, Silhouette, BodyOverlay } from "./bodyFigure.jsx";

// ---------------------------------------------------------------------------
// Levels & colours
// ---------------------------------------------------------------------------
const hsl = (h, s, l) => `hsl(${h.toFixed(0)}, ${s}%, ${l}%)`;
const family = (prefix, nums, label, hue0, hue1, sat, light, dark, names = {}) =>
  nums.map((n, i) => {
    const h = hue0 + ((hue1 - hue0) * i) / Math.max(1, nums.length - 1);
    const l = names[n]?.l || (i % 2 ? dark : light);
    const short = names[n]?.short || prefix + n;
    return { key: (prefix + n).toLowerCase(), short, family: label, color: hsl(h, sat, l), colorHover: hsl(h, sat, l - 12), extra: names[n]?.extra || "" };
  });

const LEVELS = [
  ...family("V", [1, 2, 3], "Trigeminal (V1–V3)", 48, 8, 40, 84, 70, {
    1: { extra: " (ophthalmic)", l: 84 }, 2: { extra: " (maxillary)", l: 72 }, 3: { extra: " (mandibular)", l: 80 },
  }),
  ...family("C", [2, 3, 4, 5, 6, 7, 8], "Cervical (C2–C8)", 195, 232, 55, 82, 69),
  ...family("T", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "Thoracic (T1–T12)", 165, 92, 42, 84, 71),
  ...family("L", [1, 2, 3, 4, 5], "Lumbar (L1–L5)", 46, 18, 72, 80, 67),
  ...family("S", [1, 2, 3, 4], "Sacral (S1–S5)", 285, 330, 42, 84, 72, { 4: { short: "S4–5", extra: " (perianal)" } }),
];
const LEVEL = Object.fromEntries(LEVELS.map((l) => [l.key, l]));

export const FAMILIES = [...new Map(LEVELS.map((l) => [l.family, { label: l.family, swatch: l.color }])).values()];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const FAR = -60; // x well beyond the figure, used to extend boundaries sideways

/** Boundary across the trunk: a short polyline from the midline, extended outwards. */
const across = (...pts) => [...pts, [FAR, pts[pts.length - 1][1]]];

/** Straight-ish boundary y = yMid ± slope towards the side (rises laterally in front, falls behind). */
const sloped = (yMid, dy) => across(...[200, 185, 170, 155, 140].map((x) => [x, yMid + (dy * (200 - x)) / 60]));

/** Bands between consecutive boundaries: [[level, ...], boundaries] → pieces. */
const bands = (levels, lines) => levels.map((lv, i) => ({ level: lv, clip: "trunk", pts: chain(lines[i], rev(lines[i + 1])) }));

const halfEllipse = (cx, cy, rx, ry, n = 16) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = -Math.PI / 2 - (Math.PI * i) / n; // top → left → bottom
    return [cx + rx * Math.cos(a), cy - ry * Math.sin(a)];
  });

// Arm / trunk / leg frames. The cut between arm and trunk runs over the
// shoulder, through the axilla and down the gap between arm and body.
const Ac1 = armPt(-90, 4), Ac2 = armPt(-2, 2), Ac3 = armPt(16, 40), Ac4 = armPt(22, 60), Ac5 = armPt(24, 570);
const alongCut = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const cutAtY = (y) => alongCut(Ac4, Ac5, (y - Ac4[1]) / (Ac5[1] - Ac4[1]));

function frames(posterior) {
  // Trunk / leg boundary: inguinal crease in front, gluteal fold behind.
  const legCut = posterior
    ? [[200, 404], [186, 410], [166, 410], [148, 402], [136, 390], cutAtY(380)]
    : [[200, 371], [186, 362], [166, 346], [148, 330], cutAtY(312)];
  const X = legCut[legCut.length - 1];
  return {
    trunk: [[200, -40], ...legCut, Ac4, Ac3, Ac2, Ac1, [FAR, Ac1[1]], [FAR, -40]],
    arm: [Ac1, Ac2, Ac3, Ac4, X, Ac5, [FAR, Ac5[1]], [FAR, Ac1[1]]],
    leg: [...legCut, Ac5, [Ac5[0], 760], [200, 760]],
  };
}

// ---------------------------------------------------------------------------
// Anterior pieces (viewer's left = patient's right)
// ---------------------------------------------------------------------------
function anteriorPieces() {
  const head = [
    { level: "v1", clip: "trunk", pts: [[200, -20], [200, 76], [197, 74], [195.5, 66], [194, 60], [187, 57.5], [180, 56.5], [172, 57.5], [164, 52], [120, 40], [120, -20]] },
    { level: "v2", clip: "trunk", pts: [[200, 76], [197, 74], [195.5, 66], [194, 60], [187, 57.5], [180, 56.5], [172, 57.5], [176, 66], [182, 78], [190, 85], [200, 85]] },
    { level: "v3", clip: "trunk", pts: [[200, 85], [190, 85], [182, 78], [176, 66], [172, 57.5], [164, 52], [120, 40], [120, 64], [166, 68], [171, 76], [175, 86], [180, 96], [188, 103], [200, 106]] },
    { level: "c2", clip: "trunk", pts: [[200, 106], [188, 103], [180, 96], [175, 86], [171, 76], [166, 68], [120, 64], [FAR, 64], [FAR, 112], [184, 112], [200, 113]] },
  ];
  const T = [
    across([200, 113], [184, 112]), // C2/C3
    across([200, 128], [186, 127], [176, 126], [150, 120], [100, 110]), // C3/C4
    [[200, 158], [165, 157], Ac2, [FAR, Ac2[1]]], // C4/T2 (C5–T1 supply the arm)
    [[200, 174], [168, 174], [150, 180], [138, 192], Ac3, [FAR, Ac3[1]]], // T2/T3
    [[200, 190], [170, 188], [152, 192], [140, 202], Ac4, [FAR, Ac4[1]]], // T3/T4
    across([200, 205], [170, 203], [152, 206], [140, 214], [134, 228]), // T4/T5 (nipple in T4)
    sloped(221, -4), // T5/T6
    sloped(235, -6), // T6/T7 (xiphoid in T6)
    sloped(248, -8), // T7/T8
    sloped(260, -10), // T8/T9
    sloped(272, -12), // T9/T10
    sloped(296, -14), // T10/T11 (umbilicus in T10)
    across([200, 320], [170, 314], [146, 304]), // T11/T12
    across([200, 352], [186, 350], [167, 341], [150, 327], [138, 318]), // T12/L1 (inguinal ligament in T12)
    [[200, 520], [FAR, 520]],
  ];
  const trunk = bands(["c3", "c4", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "l1"], T);
  const A = (level, pts) => ({ level, clip: "arm", pts: arm(pts) });
  const armP = [
    A("c5", [[-90, -30], [-2, -30], [-2, 145], [-90, 150]]),
    A("c6", [[-90, 150], [-2, 145], [-2, 248], [-5.8, 262], [-5.8, 420], [-90, 420]]),
    A("c7", [[-2, 248], [2.2, 250], [2.2, 420], [-5.8, 420], [-5.8, 262]]),
    A("c8", [[-2, 195], [90, 190], [90, 420], [2.2, 420], [2.2, 250], [-2, 248]]),
    A("t1", [[-2, 120], [90, 116], [90, 190], [-2, 195]]),
    A("t2", [[-2, -30], [90, -30], [90, 116], [-2, 120]]),
  ];
  const L = (level, pts) => ({ level, clip: "leg", pts: leg(pts) });
  const L4L5 = [[-90, 150], [-22, 162], [-8, 195], [-3, 240], [3, 295], [11, 316], [14, 420]];
  const L5S1 = [[-90, 268], [-14, 294], [-11, 316], [-9, 420]];
  const legP = [
    L("l1", [[-90, -60], [60, -60], [60, 40], [-90, 8]]),
    L("l2", [[-90, 8], [60, 40], [60, 118], [-90, 55]]),
    L("l3", [[-90, 55], [60, 118], [60, 170], [0, 150], [-90, 126]]),
    L("l4", chain([[-90, 126], [0, 150], [60, 170], [60, 420]], rev(L4L5))),
    L("l5", chain(L4L5, rev(L5S1))),
    L("s1", chain(L5S1, [[-90, 420]])),
  ];
  const mid = (a, b) => (b - a) / 2 + a;
  const yAt = (line, x) => {
    for (let i = 0; i < line.length - 1; i++) {
      const [x0, y0] = line[i], [x1, y1] = line[i + 1];
      if ((x <= x0 && x >= x1) || (x >= x0 && x <= x1)) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1);
    }
    return line[line.length - 1][1];
  };
  const band = (i, x) => [x, mid(yAt(T[i], x), yAt(T[i + 1], x))];
  // Key sensory points (dots) and label positions.
  const marks = {
    v1: { label: [190, 30] },
    v2: { label: [184, 71] },
    v3: { label: [176, 79] },
    c2: { label: [190, 109.5] },
    c3: { dot: [186, 120], label: [190, 121] },
    c4: { dot: [128, 149], label: [158, 145] },
    t2: { dot: [141, 182], label: [168, 166], labels: [armPt(9, 66)] },
    c5: { dot: armPt(-14, 128), label: armPt(-11, 80) },
    c6: { label: armPt(-9, 200) },
    c7: { label: armPt(-1.8, 286) },
    c8: { label: armPt(8, 226) },
    t1: { dot: armPt(14, 128), label: armPt(8, 158) },
    l1: { dot: legPt(4, 16), label: [190, 361], labels: [legPt(-10, 12)] },
    l2: { dot: legPt(8, 76), label: legPt(-6, 66) },
    l3: { dot: legPt(15, 146), label: legPt(-4, 116) },
    l4: { dot: legPt(11.5, 290), label: legPt(7, 226) },
    l5: { dot: legPt(0, 318), label: legPt(-13, 226) },
    s1: { label: legPt(-15, 309), size: 5 },
  };
  ["t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12"].forEach((lv, i) => {
    marks[lv] = { dot: band(i + 3, 172), label: band(i + 3, 186) };
  });
  return { pieces: [...head, ...trunk, ...armP, ...legP], marks };
}

// ---------------------------------------------------------------------------
// Posterior pieces (viewer's left = patient's left)
// ---------------------------------------------------------------------------
function posteriorPieces() {
  const q = (t) => alongCut(Ac2, Ac3, t);
  const T = [
    [[200, -40], [FAR, -40]],
    across([200, 100], [186, 98], [100, 90]), // C2/C3 (C2 = occipital scalp)
    across([200, 120], [186, 119], [176, 124], [150, 118], [100, 108]), // C3/C4
    [[200, 146], [165, 150], [140, 155], Ac2, [FAR, Ac2[1]]], // C4/T1
    [[200, 156], [170, 160], [148, 168], q(0.25), [FAR, q(0.25)[1]]], // T1/T2
    [[200, 168], [170, 172], [150, 180], q(0.5), [FAR, q(0.5)[1]]], // T2/T3
    [[200, 181], [170, 185], [150, 192], [140, 198], q(0.75), [FAR, q(0.75)[1]]], // T3/T4
    [[200, 194], [170, 199], [150, 205], [140, 212], Ac4, [FAR, Ac4[1]]], // T4/T5
    sloped(207, 14), sloped(220, 14), sloped(233, 14), sloped(246, 14), sloped(259, 14), sloped(272, 14),
    sloped(286, 14), sloped(300, 14), // … T12/L1
    sloped(314, 16), // L1/L2
    sloped(328, 20), // L2/L3
    sloped(348, 32), // L3/S2 (L1–L3 cross the upper buttock; S2 the lower buttock)
    [[200, 520], [FAR, 520]],
  ];
  const trunk = bands(["c2", "c3", "c4", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "l1", "l2", "l3", "s2"], T);
  const S45 = halfEllipse(200, 392, 7, 11);
  const sacral = [
    { level: "s3", clip: "trunk", pts: chain(halfEllipse(200, 388, 20, 26), rev(S45)) },
    { level: "s4", clip: "trunk", pts: S45 },
  ];
  const A = (level, pts) => ({ level, clip: "arm", pts: arm(pts) });
  const armP = [
    A("c5", [[-90, -30], [2, -30], [2, 150], [-90, 150]]),
    A("t2", [[2, -30], [90, -30], [90, 120], [2, 124]]),
    A("t1", [[2, 124], [90, 120], [90, 196], [5, 200], [5, 150], [2, 150]]),
    A("c6", [[-90, 150], [-6, 150], [-6, 250], [-5.8, 262], [-5.8, 420], [-90, 420]]),
    A("c7", [[-6, 150], [5, 150], [5, 250], [2.2, 262], [2.2, 420], [-5.8, 420], [-5.8, 262], [-6, 250]]),
    A("c8", [[5, 200], [90, 196], [90, 420], [2.2, 420], [2.2, 262], [5, 250]]),
  ];
  const L = (level, pts) => ({ level, clip: "leg", pts: leg(pts) });
  const legP = [
    L("l2", [[-90, -60], [-14, -60], [-14, 140], [-90, 140]]),
    L("s2", [[-14, -60], [12, -60], [12, 155], [8, 200], [2, 242], [-8, 200], [-14, 140]]),
    L("l3", [[12, -60], [90, -60], [90, 155], [12, 155]]),
    L("l5", [[-90, 140], [-14, 140], [-8, 200], [-18, 228], [-90, 240]]),
    L("s1", [[-90, 240], [-18, 228], [-8, 200], [2, 242], [4, 300], [6, 420], [-90, 420]]),
    L("l4", [[12, 155], [90, 155], [90, 420], [6, 420], [4, 300], [2, 242], [8, 200]]),
  ];
  const yMid = (i) => {
    const a = T[i][0][1], b = T[i + 1][0][1];
    return (a + b) / 2;
  };
  const marks = {
    c2: { dot: [190, 70], label: [188, 58] },
    c3: { label: [190, 110] },
    c4: { label: [160, 138] },
    c5: { label: armPt(-10, 100) },
    c6: { dot: armPt(-20, 280), label: armPt(-12, 210) },
    c7: { dot: armPt(-1.5, 306), label: armPt(-0.5, 210) },
    c8: { dot: armPt(13, 300), label: armPt(11, 230) },
    t1: { label: [186, yMid(3)], labels: [armPt(10, 165)] },
    t2: { label: [186, yMid(4)], labels: [armPt(10, 70)] },
    l1: { label: [186, yMid(15)] },
    l2: { label: [186, yMid(16)], labels: [legPt(-26, 60)] },
    l3: { label: [186, yMid(17)], labels: [legPt(16, 100)] },
    s1: { dot: legPt(-9, 318), label: legPt(-15, 262) },
    s2: { dot: legPt(-1, 152), label: legPt(-1, 80), labels: [[158, 384]] },
    s3: { dot: [183, 400], label: [184, 380] },
    s4: { dot: [197, 396], label: [200, 391], size: 4.2, single: true },
    l4: { label: legPt(13, 228) },
    l5: { label: legPt(-15, 190) },
  };
  ["t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12"].forEach((lv, i) => {
    marks[lv] = { label: [186, yMid(i + 5)] };
  });
  return { pieces: [...trunk, ...sacral, ...armP, ...legP], marks };
}

// ---------------------------------------------------------------------------
// View assembly
// ---------------------------------------------------------------------------
function build(posterior) {
  const leftSide = posterior ? LEFT : RIGHT;
  const { pieces, marks } = posterior ? posteriorPieces() : anteriorPieces();
  const fr = frames(posterior);
  const clips = {
    body: parts(posterior).map((p) => pathD(p)),
    trunkL: [pathD(fr.trunk)], trunkR: [pathD(flipX(fr.trunk))],
    armL: [pathD(fr.arm)], armR: [pathD(flipX(fr.arm))],
    legL: [pathD(fr.leg)], legR: [pathD(flipX(fr.leg))],
  };
  const fx = ([x, y]) => [2 * CX - x, y];

  const regions = [];
  for (const side of [leftSide, other(leftSide)]) {
    const mirrored = side !== leftSide;
    for (const lv of LEVELS) {
      const own = pieces.filter((p) => p.level === lv.key);
      if (!own.length) continue;
      const m = marks[lv.key] || {};
      const place = (p) => (p && mirrored ? fx(p) : p);
      regions.push({
        id: `derm-${lv.key}-${side.key}`,
        name: `${side.Side} ${lv.short}${lv.extra} dermatome`,
        short: lv.short,
        aliases: [lv.short.toLowerCase(), `${side.side} ${lv.short.toLowerCase()}`, "dermatome", "shingles", "zoster"],
        group: "dermatome",
        color: lv.color,
        colorHover: lv.colorHover,
        pieces: own.map((p) => ({ clip: p.clip + (mirrored ? "R" : "L"), d: pathD(mirrored ? flipX(p.pts) : p.pts) })),
        dot: place(m.dot),
        labels: m.single && mirrored ? [] : [m.label, ...(m.labels || [])].filter(Boolean).map(place),
        labelSize: m.size,
      });
    }
  }

  return {
    key: posterior ? "dermPosterior" : "dermAnterior",
    label: `Dermatomes — ${posterior ? "posterior" : "anterior"}`,
    short: posterior ? "Posterior" : "Anterior",
    viewBox: VIEWBOX,
    kind: "dermatomes",
    Under: () => <Silhouette posterior={posterior} />,
    Over: () => <BodyOverlay posterior={posterior} />,
    clips,
    regions,
    note: "Dots mark the ISNCSCI key sensory points. Dermatomes overlap and vary between individuals.",
  };
}

export const dermAnterior = build(false);
export const dermPosterior = build(true);
