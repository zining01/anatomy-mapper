// Hands (dorsal, palmar) and feet (dorsal, plantar), digit by digit.
//
// Each view shows both sides with the thumbs / great toes towards the centre
// and the digits pointing up. One hand and one foot are authored on the
// viewer's left and mirrored about x = 200. Dorsal views are drawn as the
// patient sees them (patient's left on the viewer's left); palmar and plantar
// views are drawn facing the examiner (patient's right on the viewer's left).
//
// Digits are built in their own frames (see `digit`): local y runs from the
// base of the digit to its tip, so phalanges and nails are simple spans.
import { spline, seg, chain, rev, mirror, pathD, frame } from "../geometry.js";
import { C, RIGHT, LEFT, other, region } from "./common.js";
import { line, point, placeOverlays } from "./overlay.js";
import { Shade } from "./shading.jsx";

const CX = 200;
const VIEWBOX = "0 38 400 308";
const sp = (pts) => spline(pts, { steps: 8 });

// ---------------------------------------------------------------------------
// Digits
// ---------------------------------------------------------------------------
/**
 * base   centre of the digit's base        angle  tilt from vertical (degrees, + = towards the centre line)
 * w      width at the base                 lens   lengths of the phalanges, proximal first
 */
function digit({ base, angle, w, lens, taper = 0.84 }) {
  const f = frame({ origin: base, angle: angle + 180 });
  const total = lens.reduce((a, b) => a + b, 0);
  const half = (ly) => (w / 2) * (1 - (1 - taper) * Math.max(0, ly / total));
  const r = half(total) * 0.98;
  const cap = Array.from({ length: 13 }, (_, i) => {
    const t = (Math.PI * i) / 12;
    return [r * Math.cos(t), total - r + r * Math.sin(t)];
  });
  const cuts = lens.reduce((acc, l) => [...acc, acc[acc.length - 1] + l], [0]);
  const span = (a, b, last) => f(last ? [[-half(a), a], [half(a), a], ...cap] : [[-half(a), a], [half(a), a], [half(b), b], [-half(b), b]]);
  const lastLen = lens[lens.length - 1];
  const n0 = total - lastLen * 0.66, n1 = total - lastLen * 0.13, nw = half(total) * 0.72;
  return {
    outline: f([[-half(-6), -6], [half(-6), -6], ...cap]),
    segments: lens.map((_, i) => span(cuts[i], cuts[i + 1], i === lens.length - 1)),
    nail: f(spline([[-nw, n0 + 2], [-nw * 0.8, n0], [nw * 0.8, n0], [nw, n0 + 2], [nw, n1 - 3], [nw * 0.7, n1], [-nw * 0.7, n1], [-nw, n1 - 3]], { closed: true, steps: 4 })),
    lunula: f(spline([[-nw * 0.75, n0 + 1.2], [0, n0 + lastLen * 0.14], [nw * 0.75, n0 + 1.2]], { steps: 6 })),
    creases: cuts.slice(1, -1).map((c) => f([[-half(c) * 0.8, c], [half(c) * 0.8, c]])),
    sides: [-1, 1].map((s) => f([[s * half(0) * 0.78, 2], [s * half(total) * 0.8, total - lastLen * 0.45]])),
    at: (lx, ly) => f([[lx, ly]])[0],
    total,
  };
}

const ORDINAL = { thumb: "1st", index: "2nd", middle: "3rd", ring: "4th", little: "5th" };
const FINGERS = [
  { key: "little", name: "little finger", base: [70, 172], angle: -13, w: 15, lens: [27, 18, 19] },
  { key: "ring", name: "ring finger", base: [90.5, 160], angle: -5, w: 17, lens: [34, 23, 21] },
  { key: "middle", name: "middle finger", base: [112, 155], angle: 1, w: 18, lens: [37, 26, 22] },
  { key: "index", name: "index finger", base: [133.5, 161], angle: 8, w: 17.5, lens: [34, 22, 21] },
  { key: "thumb", name: "thumb", base: [156, 222], angle: 40, w: 21, lens: [34, 27], taper: 0.88 },
].map((d) => ({ ...d, ...digit(d) }));
const PHALANX = ["proximal phalanx", "middle phalanx", "distal phalanx"];

const TOES = [
  { key: "5", name: "5th (little) toe", base: [64, 110], angle: -13, w: 14.5, lens: [23] },
  { key: "4", name: "4th toe", base: [81, 99], angle: -8, w: 14.5, lens: [28] },
  { key: "3", name: "3rd toe", base: [98.5, 91], angle: -4, w: 15, lens: [32] },
  { key: "2", name: "2nd toe", base: [116.5, 86], angle: -1, w: 16, lens: [37] },
  { key: "1", name: "great toe (hallux)", base: [142, 90], angle: 3, w: 27, lens: [46], taper: 0.9 },
].map((d) => ({ ...d, ...digit({ taper: 0.9, ...d }) }));

// ---------------------------------------------------------------------------
// Hand: palm / dorsum and wrist (viewer's-left hand, thumb towards the centre)
// ---------------------------------------------------------------------------
const W_ul = [63, 286], W_ra = [131, 288], W_ul2 = [65, 326], W_ra2 = [128, 326];
const H_ULNAR = sp([W_ul, [57, 262], [55, 230], [57, 200], [61.5, 176]]); // ulnar border, wrist → little finger
const H_TOP = [[61.5, 176], [78.5, 170], [82, 162], [99, 159], [103, 155.5], [121, 154.5], [125, 160.5], [142.5, 163]]; // across the knuckles
const H_RADIAL = sp([[142.5, 163], [146, 186], [150, 204], [163, 212], [168, 232], [160, 254], [146, 272], W_ra]); // first web, thenar border
const HAND = chain(H_ULNAR, H_TOP, H_RADIAL);
const WRIST = [W_ul, W_ra, W_ra2, W_ul2];
// Palmar subdivisions share these internal points.
const P_a = [150, 204], P_b = [128, 222], P_c = [112, 250], P_d = [106, 287.3], P_e = [57, 214], P_f = [84, 222], P_g = [88, 252], P_h = [90, 286.8];
const THENAR_CREASE = sp([P_a, P_b, P_c, P_d]);
const HYPO_LINE = sp([P_f, P_g, P_h]);
const DISTAL_CREASE = sp([P_e, P_f, [110, 214], P_b]);

// ---------------------------------------------------------------------------
// Foot (viewer's-left foot, great toe towards the centre, toes up)
// ---------------------------------------------------------------------------
const F_h = [110, 322], F_l3 = [70, 262], F_l2 = [60, 206], F_l1 = [55, 150], F_lt = [56.5, 116];
const F_mt = [156.5, 94], F_m1 = [164, 150], F_m2 = [155, 206], F_m3 = [150, 262];
const F_LAT = sp([F_h, [97, 321], [84, 312], [75, 296], F_l3, [64, 234], F_l2, [56, 178], F_l1, [54, 130], F_lt]);
const F_TOP = [F_lt, [71.5, 107], [73.5, 100], [88.5, 96.5], [91, 92], [106, 89], [108.5, 86.5], [124.5, 85], [128.5, 88], F_mt];
const F_MED = sp([F_mt, [164, 120], F_m1, [161, 180], F_m2, [151, 234], F_m3, [146, 296], [137, 312], [123, 321], F_h]);
const FOOT = chain(F_LAT, F_TOP, F_MED);
const F_c1 = [110, 152], F_c2 = [108, 206], F_c3 = [110, 262]; // midline of the foot at each division

// ---------------------------------------------------------------------------
// Region builders
// ---------------------------------------------------------------------------
const GROUP_OF = { digit: "digit", nail: "nail", hand: "palm", wrist: "joint" };

/** Both sides of one shape. `infoKey` points at the reference notes in reference/regions.js. */
function both(spec, leftSide, infoKey) {
  const make = (side, pts) => ({ ...region({ ...spec, pts, side }), infoKey });
  return [make(leftSide, spec.pts), make(other(leftSide), rev(mirror(spec.pts, CX)))];
}

function handRegions(dorsal) {
  const leftSide = dorsal ? LEFT : RIGHT;
  const face = dorsal ? "dorsal" : "palmar";
  const p = dorsal ? "hd-" : "hp-";
  const out = [];
  const add = (id, name, aliases, kind, pts, infoKey) => out.push(...both({ id: p + id, name, aliases, group: GROUP_OF[kind], pts }, leftSide, infoKey));

  add("wrist", `{Side} ${dorsal ? "dorsal" : "volar"} wrist`, ["{side} wrist"], "wrist", WRIST, dorsal ? "bp-dorsal-wrist" : "ba-volar-wrist");
  if (dorsal) add("hand", "{Side} dorsal hand", ["{side} back of hand", "{side} dorsum of hand", "{side} metacarpal"], "hand", HAND, "bp-dorsal-hand");
  else {
    add("thenar", "{Side} thenar eminence", ["{side} base of thumb", "{side} palm"], "hand", chain(THENAR_CREASE, [P_d, W_ra], rev(seg(H_RADIAL, P_a, W_ra))), "ba-palm");
    add("hypothenar", "{Side} hypothenar eminence", ["{side} ulnar palm", "{side} palm"], "hand", chain(seg(H_ULNAR, W_ul, P_e), seg(DISTAL_CREASE, P_e, P_f), HYPO_LINE, [P_h, W_ul]), "ba-palm");
    add("mid-palm", "{Side} central palm", ["{side} palm", "{side} mid palm"], "hand", chain(seg(DISTAL_CREASE, P_f, P_b), seg(THENAR_CREASE, P_b, P_d), [P_d, P_h], rev(HYPO_LINE)), "ba-palm");
    add("distal-palm", "{Side} distal palm (metacarpal heads)", ["{side} palm", "{side} mcp"], "hand", chain(seg(H_ULNAR, P_e, [61.5, 176]), H_TOP, seg(H_RADIAL, [142.5, 163], P_a), seg(THENAR_CREASE, P_a, P_b), rev(DISTAL_CREASE)), "ba-palm");
  }
  for (const d of FINGERS) {
    const thumb = d.key === "thumb";
    const alias = [`{side} ${ORDINAL[d.key]} digit`, `{side} ${d.name}`, ...(thumb ? ["{side} pollex"] : [`{side} ${ORDINAL[d.key]} finger`])];
    d.segments.forEach((pts, i) => {
      const ph = thumb && i === 1 ? PHALANX[2] : PHALANX[i];
      const tip = i === d.segments.length - 1;
      const name = `{Side} ${face} ${d.name}, ${ph}${!dorsal && tip ? " (pulp)" : ""}`;
      add(`${d.key}-${i}`, name, [...alias, ...(tip && !dorsal ? ["{side} fingertip", "{side} pulp"] : [])], "digit", pts, dorsal ? "bp-dorsal-fingers" : thumb ? "ba-thumb" : "ba-fingers");
    });
    if (dorsal) add(`${d.key}-nail`, `{Side} ${thumb ? "thumb" : d.name} nail unit`, [...alias, "{side} nail", "{side} fingernail", "{side} nail fold", "{side} nail matrix"], "nail", d.nail, "nail-unit");
  }
  return out;
}

function footRegions(dorsal) {
  const leftSide = dorsal ? LEFT : RIGHT;
  const p = dorsal ? "fd-" : "fp-";
  const out = [];
  const add = (id, name, aliases, kind, pts, infoKey) => out.push(...both({ id: p + id, name, aliases, group: GROUP_OF[kind], pts }, leftSide, infoKey));
  const band = (la, lb, ma, mb, ca, cb) => ({
    whole: chain(seg(F_LAT, la, lb), [lb, cb, mb], seg(F_MED, mb, ma), [ma, ca, la]),
    lateral: chain(seg(F_LAT, la, lb), [lb, cb, ca, la]),
    medial: chain([ca, cb, mb], seg(F_MED, mb, ma), [ma, ca]),
  });
  const fore = chain(seg(F_LAT, F_l1, F_lt), F_TOP, seg(F_MED, F_mt, F_m1), [F_m1, F_c1, F_l1]);
  const mid = band(F_l2, F_l1, F_m2, F_m1, F_c2, F_c1);
  const hind = band(F_l3, F_l2, F_m3, F_m2, F_c3, F_c2);
  const heel = chain(seg(F_LAT, F_h, F_l3), [F_l3, F_c3, F_m3], seg(F_MED, F_m3, F_h));

  if (dorsal) {
    add("ankle", "{Side} anterior ankle", ["{side} ankle"], "wrist", heel, "ba-ant-ankle");
    add("lat-malleolus", "{Side} lateral malleolus", ["{side} lateral ankle", "{side} outer ankle"], "wrist", hind.lateral, "ba-lat-malleolus");
    add("med-malleolus", "{Side} medial malleolus", ["{side} medial ankle", "{side} inner ankle"], "wrist", hind.medial, "ba-med-malleolus");
    add("midfoot", "{Side} dorsal midfoot", ["{side} dorsum of foot", "{side} top of foot", "{side} instep"], "hand", mid.whole, "ba-dorsal-foot");
    add("forefoot", "{Side} dorsal forefoot (metatarsal)", ["{side} dorsum of foot", "{side} top of foot", "{side} metatarsal"], "hand", fore, "ba-dorsal-foot");
  } else {
    const middle = band(F_l3, F_l1, F_m3, F_m1, F_c3, F_c1);
    add("heel", "{Side} plantar heel", ["{side} heel", "{side} calcaneal", "{side} sole"], "hand", heel, "bp-heel");
    add("lat-midfoot", "{Side} lateral plantar midfoot", ["{side} sole", "{side} lateral sole"], "hand", middle.lateral, "bp-heel");
    add("arch", "{Side} plantar arch (instep)", ["{side} sole", "{side} medial arch", "{side} instep"], "hand", middle.medial, "bp-heel");
    add("ball", "{Side} plantar forefoot (ball of foot)", ["{side} sole", "{side} ball of foot", "{side} metatarsal heads"], "hand", fore, "bp-heel");
  }
  for (const d of TOES) {
    const alias = [`{side} toe`, ...(d.key === "1" ? ["{side} big toe", "{side} hallux", "{side} 1st toe"] : [])];
    add(`toe-${d.key}`, `{Side} ${dorsal ? "dorsal" : "plantar"} ${d.name}`, alias, "digit", d.segments[0], "ba-toes");
    if (dorsal) add(`toe-${d.key}-nail`, `{Side} ${d.name} nail unit`, [...alias, "{side} toenail", "{side} nail"], "nail", d.nail, "nail-unit");
  }
  return out;
}

// ---------------------------------------------------------------------------
// Artwork
// ---------------------------------------------------------------------------
const sides = (pts) => [pts, mirror(pts, CX)];

function Art({ parts, details, dorsal, leftSide, id }) {
  const all = parts.flatMap(sides);
  return (
    <g>
      {all.map((p, i) => <path key={"o" + i} d={pathD(p)} fill={C.line} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />)}
      {all.map((p, i) => <path key={"f" + i} d={pathD(p)} fill={dorsal ? C.skin : "#f6e6d6"} />)}
      <Shade id={id} clip={all} depth={4.5} edge={0.5} />
      <g pointerEvents="none" fill="none" stroke={C.lineSoft} strokeWidth="0.9" strokeLinecap="round">
        {details.flatMap(sides).map((p, i) => <path key={i} d={pathD(p, false)} />)}
      </g>
      {[leftSide, other(leftSide)].map((s, i) => (
        <text key={s.key} x={i ? 2 * CX - 100 : 100} y="341" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a3917f" fontFamily="system-ui, sans-serif" style={{ userSelect: "none" }}>
          {s.Side.toUpperCase()}
        </text>
      ))}
    </g>
  );
}

function Nails({ digits }) {
  return (
    <g pointerEvents="none">
      {digits.flatMap((d) => sides(d.nail)).map((p, i) => <path key={i} d={pathD(p)} fill="#f8ece6" stroke={C.line} strokeWidth="0.7" />)}
      {digits.flatMap((d) => sides(d.lunula)).map((p, i) => <path key={"l" + i} d={pathD(p, false)} fill="none" stroke={C.lineSoft} strokeWidth="0.7" />)}
    </g>
  );
}

const overlaysFor = (items, leftSide) => [...placeOverlays(items, leftSide), ...placeOverlays(items, other(leftSide), (pts) => mirror(pts, CX))];

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------
const HAND_PARTS = [chain(HAND, [W_ra2, W_ul2]), ...FINGERS.map((d) => d.outline)];
const KNUCKLES = FINGERS.filter((d) => d.key !== "thumb").map((d) => sp([d.at(-d.w * 0.3, -3), d.at(0, -6.5), d.at(d.w * 0.3, -3)]));
const DORSAL_HAND_LINES = [...FINGERS.flatMap((d) => d.creases), ...KNUCKLES, sp([[66, 288], [96, 290.5], [128, 289.5]])];
const PALM_LINES = [...FINGERS.flatMap((d) => d.creases), ...FINGERS.map((d) => [d.at(-d.w * 0.4, 0), d.at(d.w * 0.4, 0)]), THENAR_CREASE, DISTAL_CREASE,
  sp([[60, 232], [90, 236], [118, 228], [140, 208]]), sp([[66, 288], [96, 290.5], [128, 289.5]])];

const web2 = (a, b) => [(a.base[0] + b.base[0]) / 2, (a.base[1] + b.base[1]) / 2 + 3];
const web = (a, b) => [(a.base[0] + b.base[0]) / 2, (a.base[1] + b.base[1]) / 2 + 4]; // web space between two fingers
const [LITTLE, RING, MIDDLE, INDEX] = FINGERS;
const HAND_DORSAL_ANATOMY = [
  line("b-radial-sensory", "sensory", [[123, 326], [127, 292], [140, 266], [152, 246], [166, 224]]),
  line("b-radial-sensory", "sensory", [[140, 266], [141, 236], [136, 192], INDEX.at(0, 6)]),
  line("b-radial-sensory", "sensory", [[134, 276], [128, 236], [121, 190], web(MIDDLE, INDEX)]),
  line("n-dorsal-ulnar", "sensory", [[73, 326], [69, 290], [65, 244], [68, 200], LITTLE.at(0, 6)]),
  line("n-dorsal-ulnar", "sensory", [[66.5, 262], [76, 232], [86, 196], web(LITTLE, RING)]),
  line("v-cephalic", "vessels", [[72, 218], [98, 206], [128, 210], [146, 230], [141, 270], [127, 296], [119, 326]]),
  line("v-basilic", "vessels", [[72, 218], [60.5, 250], [63, 290], [68, 326]]),
  point("b-radial-sensory", "danger", [137, 270]),
  point("b-dorsal-hand", "danger", [100, 226]),
  ...FINGERS.filter((d) => d.key === "middle").map((d) => point("b-digital", "danger", d.at(0, d.total - 31))),
];
const thenarBase = [128, 262];
const HAND_PALMAR_ANATOMY = [
  line("n-median", "motor", [[98, 326], [99.5, 290], [101, 266]]),
  line("n-median", "motor", [[101, 266], [116, 222], web(MIDDLE, INDEX)]),
  line("n-median", "motor", [[101, 266], [102, 220], web(RING, MIDDLE)]),
  line("n-median", "motor", [[101, 266], [128, 236], [144, 206]]),
  line("b-recurrent-median", "motor", [[102, 270], [116, 264], [127, 262]]),
  line("n-ulnar", "motor", [[80, 326], [80.5, 290], [82, 262], [80, 220], web(LITTLE, RING)]),
  line("n-ulnar", "motor", [[82, 262], [68, 222], LITTLE.at(5, 4)]),
  line("a-radial", "vessels", [[123, 326], [124.5, 294], [140, 274]]),
  line("a-ulnar", "vessels", [[74.5, 326], [75.5, 290], [77, 268]]),
  line("a-palmar-arch", "vessels", [[77, 268], [86, 246], [104, 238], [124, 240], [136, 250]]),
  ...FINGERS.flatMap((d) => d.sides.map((s) => line("b-digital", "danger", s))),
  point("b-recurrent-median", "danger", thenarBase),
  point("b-volar-wrist", "danger", [97, 306]),
  point("b-digital", "danger", FINGERS[2].at(0, 18)),
];

const FOOT_PARTS = [FOOT, ...TOES.map((d) => d.outline)];
const FOOT_DORSAL_LINES = [sp([[84, 248], [78, 262], [82, 278]]), sp([[142, 244], [147, 258], [143, 274]]),
  ...[[92, 132, 100, 240], [108, 126, 110, 236], [124, 124, 119, 236], [142, 128, 128, 240]].map(([a, b, c, d]) => [[a, b], [c, d]])];
const FOOT_PLANTAR_LINES = [sp([[58, 150], [84, 138], [112, 134], [140, 138], [163, 148]]), sp([[128, 166], [118, 200], [118, 236], [128, 262]])];
const FOOT_DORSAL_ANATOMY = [
  line("n-deep-peroneal", "motor", [[111, 304], [117, 244], [125, 184], [128.5, 108]]),
  line("n-superficial-peroneal", "sensory", [[90, 312], [95, 262], [106, 204], [114, 132], TOES[3].at(0, 6)]),
  line("n-superficial-peroneal", "sensory", [[95, 262], [90, 204], [84, 140], TOES[1].at(0, 5)]),
  line("b-sural", "sensory", [[82, 304], [74.5, 262], [64.5, 206], [59, 150], [59.5, 124]]),
  line("b-saphenous", "sensory", [[142.5, 304], [146.5, 260], [151.5, 208], [157, 176]]),
  line("a-anterior-tibial", "vessels", [[115, 304], [121, 244], [129, 184], [131.5, 124]]),
  line("a-anterior-tibial", "vessels", [[129, 184], [108, 172], [84, 176]]),
  line("v-great-saphenous", "vessels", [[138, 306], [142.5, 256], [144, 206], [128, 158], [104, 150]]),
  line("v-small-saphenous", "vessels", [[104, 150], [80, 160], [68.5, 226], [78, 300]]),
  point("b-dorsal-foot", "danger", [122, 182]),
  point("b-saphenous", "danger", [150, 232]),
  point("b-sural", "danger", [84, 286]),
  point("b-digital", "danger", TOES[4].at(0, 8)),
];

const FOOT_PLANTAR_ANATOMY = [
  line("n-tibial", "motor", [[140, 302], [139, 284], [137.5, 268]]),
  line("n-tibial", "sensory", [[139, 286], [126, 296], [110, 300]]), // medial calcaneal branches
  line("n-plantar", "motor", [[137.5, 268], [136, 222], [132, 170], TOES[4].at(-6, 4)]),
  line("n-plantar", "motor", [[136, 222], [122, 160], web2(TOES[3], TOES[2])]),
  line("n-plantar", "motor", [[137.5, 268], [112, 236], [88, 188], [78, 140], web2(TOES[1], TOES[0])]),
  line("a-posterior-tibial", "vessels", [[143.5, 300], [143, 274], [122, 238], [96, 196], [88, 164]]),
  line("a-posterior-tibial", "vessels", [[88, 164], [112, 150], [140, 158], [146, 190], [143, 274]]),
];

const view = (key, label, short, dorsal, regions, artProps, nails, overlays, note) => ({
  key, label, short, viewBox: VIEWBOX, kind: "regions", regions, overlays, note,
  Under: () => <Art {...artProps} id={key} dorsal={dorsal} leftSide={dorsal ? LEFT : RIGHT} />,
  Over: nails ? () => <Nails digits={nails} /> : undefined,
});

const OWN = "Dorsal views are drawn as the patient sees them: left hand or foot on the left.";
const FACING = "Drawn facing the examiner: the patient's right is on the left of the picture.";

export const handDorsal = view("handDorsal", "Hands — dorsal", "Hands, dorsal", true, handRegions(true),
  { parts: HAND_PARTS, details: DORSAL_HAND_LINES }, FINGERS, overlaysFor(HAND_DORSAL_ANATOMY, LEFT), OWN);
export const handPalmar = view("handPalmar", "Hands — palmar", "Hands, palmar", false, handRegions(false),
  { parts: HAND_PARTS, details: PALM_LINES }, null, overlaysFor(HAND_PALMAR_ANATOMY, RIGHT), FACING);
export const footDorsal = view("footDorsal", "Feet — dorsal", "Feet, dorsal", true, footRegions(true),
  { parts: FOOT_PARTS, details: FOOT_DORSAL_LINES }, TOES, overlaysFor(FOOT_DORSAL_ANATOMY, LEFT), OWN);
export const footPlantar = view("footPlantar", "Feet — plantar", "Feet, plantar", false, footRegions(false),
  { parts: FOOT_PARTS, details: FOOT_PLANTAR_LINES }, null, overlaysFor(FOOT_PLANTAR_ANATOMY, RIGHT), FACING);
