// Head & neck — posterior view. Authored on the viewer's left half, which is the
// patient's LEFT side when seen from behind, then mirrored about x = 150.
import { spline, seg, chain, rev, mirror, midline, pathD, labelPointOnLine } from "../geometry.js";
import { C } from "./common.js";
import { headRegion, headPair, LEFT } from "./catalog.js";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 8 });

// Outline: vertex → side of head → mastoid → side of neck → trapezius → edge of view.
const V = [150, 26], V_l = [104, 36], E_top = [60, 148], E_bot = [68, 200], MAS = [78, 210], SH = [0, 356];
const OUT = sp([V, V_l, [82, 52], [65, 84], [58, 118], E_top, [62, 176], E_bot, MAS, [91, 238], [96, 270], [91, 298],
  [64, 322], [30, 340], SH]);

// Back of the ear (cranial surface of the auricle) projecting beyond the outline.
const EAR_OUT = sp([E_bot, [60, 214], [49, 210], [42, 192], [40, 170], [44, 152], [52, 145], E_top]);

// Scalp divisions & nape hairline.
const VA = [118, 66], M_va = [150, 74], PE = [100, 150], OB = [100, 221], NL_t = [124, 231], M_nh = [150, 234];
const VARC = sp([V_l, VA, [134, 72], M_va]); // edge of the vertex (crown)
const OL = sp([VA, [106, 110], PE, [98, 186], OB]); // lateral edge of the occipital scalp
const NAPE = sp([MAS, OB, NL_t, M_nh]); // nape hairline

// Neck.
const NL_b = [128, 380], M_b = [150, 380], CORNER = [0, 380];
const NL = sp([NL_t, [124, 280], [126, 330], NL_b]); // lateral edge of the central nuchal area

const MIDLINE = {
  "h-vertex-scalp": chain(seg(OUT, V, V_l), VARC),
  "h-occipital-scalp": chain(seg(VARC, M_va, VA), OL, seg(NAPE, OB, M_nh)),
  "h-nuchal": chain(seg(NAPE, M_nh, NL_t), NL, [NL_b, M_b]),
};

const SIDED = {
  "h-parietal-scalp": chain(seg(OUT, V_l, E_top), [E_top, PE], rev(seg(OL, VA, PE)), seg(VARC, VA, V_l)),
  "h-postauricular": chain(seg(OUT, E_top, MAS), seg(NAPE, MAS, OB), seg(OL, OB, PE), [PE, E_top]),
  "h-posterior-auricle": chain(seg(OUT, E_top, E_bot), EAR_OUT),
  "h-posterolateral-neck": chain(seg(OUT, MAS, SH), [SH, CORNER, NL_b], rev(NL), seg(NAPE, NL_t, MAS)),
};

const regions = [
  ...Object.entries(MIDLINE).map(([id, half]) => {
    const pts = midline(half, CX);
    return headRegion(id, pts, null, { dot: labelPointOnLine(pts, CX) });
  }),
  ...Object.entries(SIDED).flatMap(([id, pts]) => headPair(id, pts, CX, LEFT)),
];

const both = (pts) => [pts, mirror(pts, CX)];
const HEAD = midline(chain(OUT, [CORNER]), CX);
const STRANDS = [
  sp([[150, 60], [140, 96], [138, 140], [142, 190]]),
  sp([[124, 80], [114, 120], [112, 170], [116, 214]]),
  sp([[96, 60], [80, 100], [76, 140]]),
  sp([[150, 30], [124, 40], [104, 60]]),
];

function Under() {
  return (
    <g>
      <path d={pathD(HEAD)} fill={C.skinShade} stroke={C.line} strokeWidth="2" strokeLinejoin="round" />
      {regions.map((r) => r.base && <path key={r.id} d={r.d} fill={r.base} />)}
    </g>
  );
}

function Over() {
  return (
    <g pointerEvents="none" fill="none" strokeLinecap="round">
      {STRANDS.flatMap(both).map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.hairLine} strokeWidth="0.8" />)}
      {both(sp([[56, 160], [50, 172], [52, 192], [60, 204]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.9" />
      ))}
      {/* spine of the neck & vertebra prominens */}
      <path d={pathD(sp([[150, 250], [150, 300], [150, 350]]), false)} stroke={C.lineSoft} strokeWidth="0.9" />
      <ellipse cx="150" cy="362" rx="5" ry="3.5" stroke={C.lineSoft} strokeWidth="0.9" />
    </g>
  );
}

export default {
  key: "headPosterior",
  label: "Head & neck — posterior",
  short: "Posterior",
  viewBox: "0 0 300 380",
  kind: "regions",
  Under,
  Over,
  regions,
};
