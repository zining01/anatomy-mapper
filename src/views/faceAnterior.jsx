// Face — anterior view with the facial aesthetic units and subunits
// (Gonzalez-Ulloa units; nasal subunits per Burget & Menick).
//
// Everything is authored for the viewer's LEFT half (= patient's RIGHT side)
// and mirrored about x = 150. Junction points are named so that every boundary
// is shared exactly by the two subunits on either side of it.
import { spline, seg, chain, rev, mirror, midline, pathD, labelPointOnLine } from "../geometry.js";
import { C } from "./common.js";
import { headRegion, headPair, RIGHT } from "./catalog.js";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 8 });

// --- Head outline (vertex → menton) -------------------------------------------
const V = [150, 24], O_sp = [96, 37], HL_side = [57, 130], E_top = [58, 150], TS_out = [59, 168];
const E_bot = [64, 212], G1 = [78, 252], NJ = [101, 280], NA = [116, 290], CH_b = [130, 295], MEN = [150, 298];
const OUT = sp([V, [121, 27], O_sp, [77, 54], [64, 80], [58, 106], HL_side, E_top, TS_out, [61, 190], E_bot,
  [69, 232], G1, [90, 268], NJ, NA, CH_b, [141, 297.5], MEN]);

// --- Hairline & scalp ---------------------------------------------------------
const M_hair = [150, 80], CF_top = [120, 82], SP_h = [108, 85], TF_top = [86, 95];
const HAIR = sp([M_hair, CF_top, SP_h, TF_top, [70, 110], HL_side]);
const SPL = sp([O_sp, [103, 60], SP_h]); // frontal / temporoparietal scalp divide

// --- Forehead, glabella, brow ----------------------------------------------------
const BrL = [90, 149], CF_bot = [119, 134.5], BrM_u = [138, 143], J1 = [137, 151];
const BU = sp([BrL, [96, 141.5], [106, 136], CF_bot, [131, 138], BrM_u]); // brow upper edge
const BL = sp([J1, [127, 146.5], [112, 144], [99, 145], BrL]); // brow lower edge
const BM = sp([BrM_u, [139.8, 147], J1]); // brow head
const CF = sp([CF_top, [119, 108], CF_bot]); // central / lateral forehead divide (mid-brow line)
const TC = sp([TF_top, [83, 115], [85, 134], BrL]); // temporal crest
const G_tl = [139, 128], M_gt = [150, 127];
const GT = sp([G_tl, [145, 127.2], M_gt]);
const J2 = [141, 158], M_nas = [150, 157.5];
const DTOP = sp([J2, [145.5, 157.6], M_nas]);

// --- Eye --------------------------------------------------------------------------
const EM = [135, 165], EL = [101, 162], UM1 = [131, 160.5], UL1 = [104.5, 159], LM1 = [131, 168.3], LL1 = [104.5, 166];
const UMG = sp([EM, UM1, [124, 157.2], [116, 156.2], [108, 157.6], UL1, EL]); // upper lid margin
const LMG = sp([EM, LM1, [124, 170], [115, 170.2], [108, 168.5], LL1, EL]); // lower lid margin
const J3 = [137, 171], J4 = [131, 175.5], J5 = [133, 154];
const LCt = [93, 155], LCb = [99.5, 174], LCo = [90, 166];
const MS = sp([J2, [139.6, 164.5], J3]); // medial canthus / nasal sidewall
const Z1 = [114, 181.5];
const LCJ = sp([LCb, [106, 179], Z1, [123, 180.5], J4]); // lid–cheek junction

// --- Nose ---------------------------------------------------------------------------
const DT = [142, 198], M_dt = [150, 201], TL = [138.5, 209.5], ST1 = [139.5, 213], ST2 = [143.2, 217.4], ST3 = [139.5, 219.5];
const D = sp([J2, [142.3, 172], [142.6, 186], DT]); // dorsum / sidewall
const ST = sp([DT, [146, 200.5], M_dt]); // supratip break
const TLE = sp([DT, [139.6, 203.5], TL, ST1]); // lateral edge of the tip
const AC_top = [131.5, 204], AB = [129, 222];
const AG = sp([TL, [135, 206], AC_top]); // alar groove
const NF = sp([J3, [134.5, 182], [132.5, 194], AC_top]); // nasofacial junction
const AF = sp([AC_top, [127.5, 209], [126.5, 216], AB]); // alar-facial groove
const M_tb = [150, 218.6];
const TB = sp([ST2, [147, 218.4], M_tb]); // tip / columella
const CL = [144.2, 221.3], CB = [143.7, 225.1], M_sub = [150, 226.5];
const CLE = sp([ST2, CL, CB]);
const CBOT = sp([CB, [147, 226.2], M_sub]);
const NS = [138.6, 224.6];
const NB = sp([ST3, [137.7, 222], NS, [141, 225.6], CB]); // nostril margin (alar rim + sill)
const ALB = sp([NS, [133, 224.6], AB]); // alar base

// --- Cheek & lips ---------------------------------------------------------------------
const FO1 = [121, 230], FE = [116, 266];
const FOUT = sp([AB, FO1, [115, 240], [112, 250], [113, 259], FE]); // melolabial fold, cheek side
const Cy = [120.3, 240.5], Cx = [117.6, 254];
const FIN = sp([AB, [125, 230.5], Cy, [117.8, 248], Cx, [117.4, 260], FE]); // melolabial fold, lip side
const Ca = [127, 244.5], Cm = [125.5, 248], Cc = [127, 252], CP = [143, 236.8], M_cu = [150, 239];
const UVB = sp([Ca, [134, 240.5], CP, [147, 238.6], M_cu]); // upper vermilion border (Cupid's bow)
const M_st = [150, 249.8];
const MLN = sp([Cm, [133, 249], [141, 249.6], M_st]); // stomion
const M_lv = [150, 260];
const LVB = sp([Cc, [133, 256.5], [141, 259.2], M_lv]); // lower vermilion border
const PC = sp([CB, [143.6, 230], CP]); // philtral column
const LM = [124, 268.5], M_lm = [150, 270.5];
const LMC = sp([LM, [136, 269.6], M_lm]); // labiomental crease
const CJ = [122.5, 281];
const CHL = sp([LM, CJ, CH_b]); // lateral chin border
const G2 = [89, 250], ZB = [72.5, 212], TS_in = [70, 168.5];
const LS = sp([TS_in, [70.5, 190], ZB, [78, 232], G2]); // lateral (preauricular) cheek strip
const JI = sp([G2, [99, 262], [110, 272], CJ]); // upper edge of the jawline strip
const Z2 = [109, 205];
const ZBB = sp([ZB, [90, 209], Z2]); // zygomatic / buccal
const MZ = sp([Z1, [111, 193], Z2]); // medial / zygomatic
const MB = sp([Z2, [113, 217], FO1]); // medial / buccal
const TB2 = sp([LCo, [80, 167.5], TS_in, TS_out]); // temple / cheek

// --- Ear & neck ---------------------------------------------------------------------------
const EAR_OUT = sp([E_bot, [58, 221], [51, 219], [46, 205], [43, 184], [43, 164], [46, 152], [52, 146], E_top]);
const NBL = [6, 380], NB_ = [137, 380], M_nb = [150, 380];
const NECK = sp([NJ, [103.5, 300], [103, 322], [96, 338], [78, 350], [52, 362], [28, 372], NBL]);
const SCM = sp([NA, [122, 316], [131, 346], NB_]); // anterior border of sternocleidomastoid

// ---------------------------------------------------------------------------------------------
// Regions (names live in catalog.js)
// ---------------------------------------------------------------------------------------------
// Midline subunits: point lists run from the midline, around the patient's right half, back to
// the midline; the left half is added by mirroring.
const MIDLINE = {
  "fa-frontal-scalp": chain(seg(OUT, V, O_sp), SPL, seg(HAIR, SP_h, M_hair)),
  "fa-central-forehead": chain(seg(HAIR, M_hair, CF_top), CF, seg(BU, CF_bot, BrM_u), [BrM_u, G_tl], GT),
  "fa-glabella": chain(seg(GT, M_gt, G_tl), [G_tl, BrM_u], BM, [J1, J2], DTOP),
  "fa-nasal-dorsum": chain(seg(DTOP, M_nas, J2), D, ST),
  "fa-nasal-tip": chain(seg(ST, M_dt, DT), TLE, [ST1, ST2], TB),
  "fa-columella": chain(seg(TB, M_tb, ST2), CLE, CBOT),
  "fa-philtrum": chain(seg(CBOT, M_sub, CB), PC, seg(UVB, CP, M_cu)),
  "fa-upper-vermilion": chain(seg(UVB, M_cu, Ca), [Ca, Cm], MLN),
  "fa-lower-vermilion": chain(seg(MLN, M_st, Cm), [Cm, Cc], LVB),
  "fa-lower-lip": chain(seg(LVB, M_lv, Cc), [Cc, Cx], seg(FIN, Cx, FE), [FE, LM], LMC),
  "fa-chin": chain(seg(LMC, M_lm, LM), CHL, seg(OUT, CH_b, MEN)),
  "fa-anterior-neck": chain(seg(OUT, MEN, NA), SCM, [NB_, M_nb]),
};

// Paired subunits, drawn on the patient's right (viewer's left) and mirrored.
const PAIRED = {
  "h-temporal-scalp": chain(seg(OUT, O_sp, HL_side), seg(HAIR, HL_side, SP_h), seg(SPL, SP_h, O_sp)),
  "fa-lateral-forehead": chain(seg(HAIR, CF_top, TF_top), TC, seg(BU, BrL, CF_bot), seg(CF, CF_bot, CF_top)),
  "fa-temple": chain(seg(HAIR, TF_top, HL_side), seg(OUT, HL_side, TS_out), seg(TB2, TS_out, LCo), [LCo, LCt, BrL], seg(TC, BrL, TF_top)),
  "fa-eyebrow": chain(BU, BM, BL),
  "fa-upper-eyelid": chain([J5, UM1], seg(UMG, UM1, UL1), [UL1, LCt, BrL], seg(BL, BrL, J1), [J1, J5]),
  "fa-medial-canthus": chain([J5, J1, J2], MS, [J3, J4, LM1], seg(LMG, LM1, EM), seg(UMG, EM, UM1)),
  "fa-lateral-canthus": chain(seg(UMG, UL1, EL), seg(LMG, EL, LL1), [LL1, LCb, LCo, LCt]),
  "fa-lower-eyelid": chain(seg(LMG, LM1, LL1), [LL1, LCb], LCJ, [J4, LM1]),
  "fa-nasal-sidewall": chain(D, seg(TLE, DT, TL), AG, seg(NF, AC_top, J3), seg(MS, J3, J2)),
  "fa-nasal-ala": chain(seg(AG, AC_top, TL), seg(TLE, TL, ST1), [ST1, ST3], seg(NB, ST3, NS), ALB, seg(AF, AB, AC_top)),
  "fa-soft-triangle": [ST1, ST2, ST3],
  "fa-medial-cheek": chain(seg(LCJ, J4, Z1), MZ, MB, seg(FOUT, FO1, AB), seg(AF, AB, AC_top), seg(NF, AC_top, J3), [J3, J4]),
  "fa-zygomatic-cheek": chain(seg(LCJ, LCb, Z1), MZ, seg(ZBB, Z2, ZB), seg(LS, ZB, TS_in), seg(TB2, TS_in, LCo), [LCo, LCb]),
  "fa-lateral-cheek": chain(seg(OUT, TS_out, G1), [G1, G2], seg(LS, G2, TS_in), [TS_in, TS_out]),
  "fa-buccal-cheek": chain(ZBB, MB, seg(FOUT, FO1, FE), [FE, LM], seg(CHL, LM, CJ), seg(JI, CJ, G2), seg(LS, G2, ZB)),
  "fa-melolabial-fold": chain(FOUT, rev(FIN)),
  "fa-lateral-upper-lip": chain(seg(NB, CB, NS), ALB, seg(FIN, AB, Cy), [Cy, Ca], seg(UVB, Ca, CP), seg(PC, CP, CB)),
  "fa-oral-commissure": chain([Ca, Cm, Cc, Cx], seg(FIN, Cx, Cy)),
  "fa-jawline": chain(seg(OUT, G1, CH_b), seg(CHL, CH_b, CJ), seg(JI, CJ, G2), [G2, G1]),
  "fa-ear": chain(seg(OUT, E_top, E_bot), EAR_OUT),
  "fa-lateral-neck": chain(NECK, [NBL, NB_], seg(SCM, NB_, NA), seg(OUT, NA, NJ)),
};

const regions = [
  ...Object.entries(MIDLINE).map(([id, half]) => {
    const pts = midline(half, CX);
    return headRegion(id, pts, null, { dot: labelPointOnLine(pts, CX) });
  }),
  ...Object.entries(PAIRED).flatMap(([id, pts]) => headPair(id, pts, CX, RIGHT)),
];

// ---------------------------------------------------------------------------------------------
// Artwork
// ---------------------------------------------------------------------------------------------
const both = (pts) => [pts, mirror(pts, CX)];
const EYE = chain(UMG, rev(LMG));
const NOSTRIL = chain([ST2, ST3], NB, rev(CLE));
const HEAD = midline(chain(OUT), CX);

function Under() {
  return (
    <g>
      <path d={pathD(HEAD)} fill={C.skin} stroke={C.line} strokeWidth="2.2" />
      {regions.map((r) => r.base && <path key={r.id} d={r.d} fill={r.base} />)}
    </g>
  );
}

function Over() {
  return (
    <g pointerEvents="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        {both(EYE).map((e, i) => (
          <clipPath key={i} id={`fa-eye-${i}`}><path d={pathD(e)} /></clipPath>
        ))}
      </defs>
      {/* eyes */}
      {both(EYE).map((e, i) => {
        const cx = i ? 2 * CX - 118 : 118;
        return (
          <g key={i}>
            <path d={pathD(e)} fill="#fbf8f4" />
            <g clipPath={`url(#fa-eye-${i})`}>
              <circle cx={cx} cy="163" r="6.6" fill={C.iris} />
              <circle cx={cx} cy="163" r="2.7" fill={C.pupil} />
              <circle cx={cx + 1.8} cy="161.3" r="1.1" fill="#fff" opacity="0.8" />
            </g>
          </g>
        );
      })}
      {both(UMG).map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.line} strokeWidth="1.6" />)}
      {both(LMG).map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.8" />)}
      {both(spline([[129, 153.5], [118, 151], [107, 152.5]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.7" />
      ))}
      {/* nostrils, mouth */}
      {both(NOSTRIL).map((p, i) => <path key={i} d={pathD(p)} fill={C.nostril} />)}
      <path d={pathD(midline(MLN, CX), false)} stroke={C.lipDeep} strokeWidth="1.3" />
      {/* ear detail */}
      {both(spline([[57, 156], [50, 156], [48, 170], [50, 190], [56, 206]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.9" />
      ))}
      {/* hair texture */}
      {both(spline([[136, 46], [120, 52], [104, 66]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.hairLine} strokeWidth="0.8" />
      ))}
      {both(spline([[82, 62], [72, 82], [68, 104]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.hairLine} strokeWidth="0.8" />
      ))}
      {/* neck: clavicle hints */}
      {both(spline([[143, 376], [118, 368], [86, 366]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth="0.9" />
      ))}
    </g>
  );
}

export default {
  key: "faceAnterior",
  label: "Face — anterior",
  short: "Face",
  viewBox: "0 0 300 380",
  kind: "regions",
  Under,
  Over,
  regions,
};
