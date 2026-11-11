// Nose — basal (worm's-eye) view: the infratip lobule, soft triangles, columella,
// alar rims and nostril sills, which are foreshortened on the frontal view.
// Authored on the viewer's left (= patient's right) and mirrored about x = 150.
// Subunits use the same ids as the face views (see catalog.js).
import { spline, seg, chain, rev, mirror, midline, pathD, labelPointOnLine } from "../geometry.js";
import { C } from "./common.js";
import { headRegion, headPair, RIGHT, LEFT } from "./catalog.js";
import { line, placeOverlays } from "./overlay.js";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 12 });

// Outer contour: tip → alar rim → alar base.
const T = [150, 40], O1 = [120, 50], O2 = [98, 78], O3 = [78, 128], AB = [74, 208];
const OUT = sp([T, [134, 42], O1, [108, 62], O2, [88, 100], O3, [68, 156], [61, 182], [64, 198], AB]);
// Nostril: apex NA, medial (columellar) edge, lateral (alar) edge, floor.
const NA = [128, 98], Pc = [135, 120], Pl = [112, 106], NF_m = [132, 196], NF_l = [105, 198];
const NM = sp([NA, Pc, [138, 150], [137, 178], NF_m]);
const NL = sp([NA, Pl, [104, 130], [97, 160], [96, 184], NF_l]);
const NFL = sp([NF_l, [118, 202.5], NF_m]);
// Base of the nose where it meets the lip, and the tip / infratip divide.
const CB = [134, 212.6], M_sn = [150, 214], M_ti = [150, 66], M_c = [150, 120];
const BASE = sp([AB, [96, 212], [116, 213.4], CB]);
const TIPL = sp([O1, [134, 62], M_ti]);
// Upper lip and cheek around the nasal base.
const PH_b = [135, 256], M_b = [150, 256], LIP_l = [60, 224], LIP_b = [50, 256], EDGE_b = [14, 256], EDGE_t = [14, 122];

const MIDLINE = {
  "fa-nasal-tip": chain(seg(OUT, T, O1), TIPL),
  "fa-nasal-infratip": chain(rev(TIPL), [O1, NA], seg(NM, NA, Pc), [Pc, M_c]),
  "fa-columella": chain([M_c, Pc], seg(NM, Pc, NF_m), [NF_m, CB, M_sn]),
  "fa-philtrum": [M_sn, CB, PH_b, M_b],
};
const PAIRED = {
  "fa-soft-triangle": chain(seg(OUT, O1, O2), [O2, Pl], seg(NL, Pl, NA), [NA, O1]),
  "fa-nasal-ala": chain(seg(OUT, O2, AB), [AB, NF_l], seg(NL, NF_l, Pl), [Pl, O2]),
  "fa-nasal-vestibule": chain(NL, [NF_l, AB], BASE, [CB, NF_m], rev(NM)),
  "fa-lateral-upper-lip": chain(rev(BASE), [AB, LIP_l, LIP_b, PH_b, CB]),
  "fa-medial-cheek": chain(seg(OUT, O3, AB), [AB, LIP_l, LIP_b, EDGE_b, EDGE_t, O3]),
};

const regions = [
  ...Object.entries(MIDLINE).map(([id, half]) => {
    const pts = midline(half, CX);
    return headRegion(id, pts, null, { dot: labelPointOnLine(pts, CX) });
  }),
  ...Object.entries(PAIRED).flatMap(([id, pts]) => headPair(id, pts, CX, RIGHT, id === "fa-nasal-vestibule" ? { dot: [116, 207.5] } : {})),
].map((r) => ({ ...r, base: null })); // the nostril itself is drawn below; the sill stays skin-coloured

const ANATOMY = [
  line("a-labial", "vessels", [[143.5, 213], [144.5, 170], [144.5, 126], [140, 100]]), // columellar branch
];
const overlays = [...placeOverlays(ANATOMY, RIGHT), ...placeOverlays(ANATOMY, LEFT, (pts) => mirror(pts, CX))];

const both = (pts) => [pts, mirror(pts, CX)];
const NOSE = midline(chain(OUT, BASE, [CB, M_sn]), CX);
const NOSTRIL = chain(NL, NFL, rev(NM));

function Under() {
  return (
    <g>
      <rect x="14" y="122" width="272" height="134" fill={C.skinShade} />
      <path d={pathD(NOSE)} fill={C.skin} stroke={C.line} strokeWidth="2" strokeLinejoin="round" />
      {both(NOSTRIL).map((p, i) => <path key={i} d={pathD(p)} fill={C.nostril} />)}
    </g>
  );
}

function Over() {
  return (
    <g pointerEvents="none" fill="none" strokeLinecap="round">
      {both(NOSTRIL).map((p, i) => <path key={i} d={pathD(p)} stroke={C.line} strokeWidth="1" />)}
      {both(sp([[142, 222], [141, 238], [139, 254]])).map((p, i) => <path key={"p" + i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.9" />)}
      {both(sp([[72, 212], [62, 228], [54, 250]])).map((p, i) => <path key={"m" + i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.9" />)}
    </g>
  );
}

export default {
  key: "noseBase",
  label: "Nose — base (worm's-eye view)",
  short: "Nasal base",
  viewBox: "0 26 300 240",
  kind: "regions",
  Under,
  Over,
  regions,
  overlays,
  note: "Seen from below with the head tilted back: the tip is at the top, the upper lip at the bottom.",
};
