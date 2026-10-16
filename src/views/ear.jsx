// Ear — lateral surface of the auricle with its subunits. Authored upright as
// the RIGHT ear seen from the right (face toward the viewer's right), then
// tilted back ~12° as in life. The left ear view is its mirror image.
import { spline, seg, chain, rev, mirror, pathD, frame } from "../geometry.js";
import { C } from "./common.js";
import { headRegion, RIGHT, LEFT } from "./catalog.js";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 10 });

// Tilt: rotate every authored point about the centre of the ear.
const PIVOT = [150, 190];
const tiltFrame = frame({ origin: PIVOT, angle: -12 });
const T = (pts) => tiltFrame(pts.map(([x, y]) => [x - PIVOT[0], y - PIVOT[1]]));
const P = Object.fromEntries(
  Object.entries({
    A1: [210, 118], PA_top: [212, 90], HT: [102, 264], LA: [184, 288],
    S_top: [120, 58], F_top: [156, 49], IC_u: [199, 90], HR: [199, 112],
    A2: [204, 136], A3: [205, 152], T_bot: [206, 236], N_b: [198, 252],
    CR_end: [154, 140], BF_p: [113, 132], BF: [134, 122], BF2: [126, 140], CY_b: [124, 160],
    AT_top: [162, 240], AT_bl: [146, 256], IT: [195, 249],
    TOP: [128, 37], BACK_LOW: [118, 318],
  }).map(([k, v]) => [k, T([v])[0]])
);
// Helper so curves can mix named junctions (already tilted) and raw points.
const S = (...pts) => sp(pts.map((p) => (p.raw ? T([p.raw])[0] : p)));
const r = (x, y) => ({ raw: [x, y] });

// Outer edge: anterior helix attachment → over the top → helix tail → lobule.
const C_OUT = S(P.A1, P.PA_top, r(204, 62), r(184, 44), r(156, 36), P.TOP, r(100, 50), r(82, 72), r(72, 102), r(70, 138),
  r(74, 176), r(82, 212), r(92, 244), P.HT, r(106, 290), r(118, 318), r(138, 334), r(158, 336), r(172, 326), r(180, 308), P.LA);
// Inner edge of the helical rim.
const C_HIN = S(P.HT, r(99, 240), r(92, 210), r(86, 176), r(84, 140), r(87, 108), r(96, 82), r(106, 68), P.S_top, r(138, 51),
  P.F_top, r(176, 56), r(192, 70), P.IC_u, P.HR);
// Anterior border, where the ear meets the face.
const AB_E = S(P.A1, P.A2, P.A3, r(212, 170), r(215, 194), r(213, 218), P.T_bot, P.N_b, r(190, 270), P.LA);
// Helical root (crus helicis).
const CU = S(P.HR, r(188, 124), r(172, 134), P.CR_end);
const CLW = S(P.CR_end, r(170, 145), r(188, 143), P.A2);
// Antihelix and crura.
const AO = S(P.HT, r(110, 236), r(110, 200), r(110, 166), P.BF_p, r(115, 96), P.S_top); // scapha side
const SCA = S(P.F_top, r(146, 72), r(138, 98), P.BF); // superior crus / triangular fossa
const ICU = S(P.BF, r(154, 110), r(178, 98), P.IC_u); // inferior crus / triangular fossa
const ICL = S(P.BF2, r(150, 128), r(176, 118), P.HR); // inferior crus / cymba
const AA_E = S(P.BF2, P.CY_b, r(128, 190), r(136, 214), r(148, 232), P.AT_top); // antihelix / concha
const AHB = S(P.HT, r(122, 262), P.AT_bl); // antihelix / lobule
// Tragus & antitragus.
const ATU = S(P.AT_top, r(176, 236), r(188, 240), P.IT);
const ATL = S(P.IT, r(184, 258), r(166, 260), P.AT_bl);
const TI = S(P.A3, r(197, 166), r(193, 190), r(195, 214), P.T_bot);

const ellipse = (cx, cy, rx, ry, n = 40) =>
  T(Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((2 * Math.PI * i) / n), cy + ry * Math.sin((2 * Math.PI * i) / n)]));

// Subunits (names live in catalog.js).
const SHAPES = {
  "ear-helix": chain(seg(C_OUT, P.A1, P.HT), seg(C_HIN, P.HT, P.HR)),
  "ear-helical-root": chain(CU, CLW, seg(AB_E, P.A2, P.A1)),
  "ear-scapha": chain(seg(C_HIN, P.HT, P.S_top), rev(AO)),
  "ear-superior-crus": chain(seg(AO, P.BF_p, P.S_top), seg(C_HIN, P.S_top, P.F_top), SCA, [P.BF, P.BF_p]),
  "ear-triangular-fossa": chain(seg(C_HIN, P.F_top, P.IC_u), rev(ICU), rev(SCA)),
  "ear-inferior-crus": chain(ICU, seg(C_HIN, P.IC_u, P.HR), rev(ICL), [P.BF2, P.BF]),
  "ear-antihelix": chain(seg(AO, P.BF_p, P.HT), AHB, [P.AT_bl, P.AT_top], rev(AA_E), [P.BF2, P.BF, P.BF_p]),
  "ear-cymba": chain(CU, [P.CR_end, P.CY_b], seg(AA_E, P.CY_b, P.BF2), ICL),
  "ear-cavum": chain(CLW, seg(AB_E, P.A2, P.A3), TI, seg(AB_E, P.T_bot, P.N_b), [P.N_b, P.IT], rev(ATU), seg(AA_E, P.AT_top, P.CY_b), [P.CY_b, P.CR_end]),
  "ear-meatus": ellipse(182, 186, 8, 11),
  "ear-tragus": chain(seg(AB_E, P.A3, P.T_bot), rev(TI)),
  "ear-antitragus": chain(ATU, ATL, [P.AT_bl, P.AT_top]),
  "ear-lobule": chain(seg(C_OUT, P.HT, P.LA), seg(AB_E, P.LA, P.N_b), [P.N_b, P.IT], ATL, rev(AHB)),
  "fa-lateral-cheek": chain(seg(C_OUT, P.PA_top, P.A1), AB_E, S(P.LA, r(204, 330), r(240, 320), r(264, 268), r(270, 200), r(260, 130), r(242, 86), P.PA_top)),
  "h-postauricular": chain(seg(C_OUT, P.TOP, P.BACK_LOW), S(P.BACK_LOW, r(98, 336), r(70, 318), r(48, 268), r(38, 200), r(40, 130), r(54, 74), r(84, 42), P.TOP)),
};

const EAR = chain(C_OUT, rev(AB_E));

// Shared with the head views, which draw a scaled copy of this ear.
export const EAR_GEOM = {
  outline: EAR,
  front: rev(AB_E), // lobule attachment → upper helix attachment
  P,
  BACK_TOP: T([[82, 72]])[0],
  inner: Object.entries(SHAPES).filter(([id]) => id.startsWith("ear-")).map(([, pts]) => pts),
};
const SHADING = [
  S(r(92, 120), r(98, 94), r(112, 76)), // under the upper helix
  S(r(128, 118), r(132, 96), r(140, 76)), // superior crus ridge
  S(r(117, 230), r(119, 196), r(118, 160)), // antihelix ridge
  S(r(160, 150), r(150, 176), r(152, 206), r(166, 226)), // depth of the cavum
];

function build(side) {
  const flip = side === LEFT;
  const place = (pts) => (flip ? rev(mirror(pts, CX)) : pts);
  const regions = Object.entries(SHAPES).map(([id, pts]) =>
    headRegion(id, place(pts), side, id.startsWith("ear-") ? {} : { group: "periauricular" })
  );
  const ear = place(EAR);

  function Under() {
    return (
      <g>
        <rect x="0" y="0" width="300" height="380" rx="14" fill={C.skin} />
        <path d={pathD(ear)} fill={C.skinShade} />
        {regions.map((r) => r.base && <path key={r.id} d={r.d} fill={r.base} />)}
      </g>
    );
  }
  function Over() {
    return (
      <g pointerEvents="none" fill="none" strokeLinecap="round">
        {SHADING.map((l, i) => <path key={i} d={pathD(place(l), false)} stroke={C.line} strokeWidth="0.8" opacity="0.45" />)}
        <path d={pathD(ear)} stroke={C.line} strokeWidth="1.8" />
      </g>
    );
  }

  return {
    key: flip ? "earLeft" : "earRight",
    label: `Ear — ${flip ? "left" : "right"} (lateral surface)`,
    short: flip ? "Left ear" : "Right ear",
    viewBox: "0 0 300 380",
    kind: "regions",
    Under,
    Over,
    regions,
    note: "The posterior auricle is on the posterior head view.",
  };
}

export const earRight = build(RIGHT);
export const earLeft = build(LEFT);
