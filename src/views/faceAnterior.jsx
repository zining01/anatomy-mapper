// Face — anterior view with the facial aesthetic units and subunits
// (Gonzalez-Ulloa units; nasal subunits per Burget & Menick).
//
// Everything is authored for the viewer's LEFT half (= patient's RIGHT side)
// and mirrored about x = 150. Junction points are named so that every boundary
// is shared exactly by the two subunits on either side of it.
import { spline, seg, chain, rev, mirror, midline, pathD, labelPointOnLine } from "../geometry.js";
import { C, LEFT } from "./common.js";
import { headRegion, headPair, RIGHT } from "./catalog.js";
import { line, zone, area, point, rstl, placeOverlays } from "./overlay.js";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 14 });

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
const R_l = [142.3, 172], M_r = [150, 172.5]; // lower edge of the nasal root
const D = sp([J2, R_l, [142.6, 186], DT]); // dorsum / sidewall
const ST = sp([DT, [146, 200.5], M_dt]); // supratip break
const SUP_l = [139.6, 203.5], M_sup = [150, 206], M_inf = [150, 214.8];
const TLE = sp([DT, SUP_l, TL, ST1]); // lateral edge of the tip
const SUPL = sp([SUP_l, [145, 205.6], M_sup]); // supratip / tip
const INFL = sp([ST1, [145, 214.5], M_inf]); // tip / infratip lobule
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
const NBL = [6, 380], NB_ = [137, 380], M_nb = [150, 380], P_scm = [103.5, 300], PB_ = [116, 380];
const NECK = sp([NJ, P_scm, [103, 322], [96, 338], [78, 350], [52, 362], [28, 372], NBL]);
const SCM = sp([NA, [122, 316], [131, 346], NB_]); // anterior border of sternocleidomastoid
const SCMP = sp([P_scm, [108, 325], [113, 352], PB_]); // posterior border of sternocleidomastoid

// ---------------------------------------------------------------------------------------------
// Regions (names live in catalog.js)
// ---------------------------------------------------------------------------------------------
// Midline subunits: point lists run from the midline, around the patient's right half, back to
// the midline; the left half is added by mirroring.
const MIDLINE = {
  "fa-frontal-scalp": chain(seg(OUT, V, O_sp), SPL, seg(HAIR, SP_h, M_hair)),
  "fa-central-forehead": chain(seg(HAIR, M_hair, CF_top), CF, seg(BU, CF_bot, BrM_u), [BrM_u, G_tl], GT),
  "fa-glabella": chain(seg(GT, M_gt, G_tl), [G_tl, BrM_u], BM, [J1, J2], DTOP),
  "fa-nasal-root": chain(seg(DTOP, M_nas, J2), seg(D, J2, R_l), [R_l, M_r]),
  "fa-nasal-dorsum": chain([M_r, R_l], seg(D, R_l, DT), ST),
  "fa-nasal-supratip": chain(seg(ST, M_dt, DT), seg(TLE, DT, SUP_l), SUPL),
  "fa-nasal-tip": chain(rev(SUPL), seg(TLE, SUP_l, ST1), INFL),
  "fa-nasal-infratip": chain(rev(INFL), [ST1, ST2], TB),
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
  "fa-nasal-vestibule": chain([ST2, ST3], NB, rev(CLE)),
  "fa-medial-cheek": chain(seg(LCJ, J4, Z1), MZ, MB, seg(FOUT, FO1, AB), seg(AF, AB, AC_top), seg(NF, AC_top, J3), [J3, J4]),
  "fa-zygomatic-cheek": chain(seg(LCJ, LCb, Z1), MZ, seg(ZBB, Z2, ZB), seg(LS, ZB, TS_in), seg(TB2, TS_in, LCo), [LCo, LCb]),
  "fa-lateral-cheek": chain(seg(OUT, TS_out, G1), [G1, G2], seg(LS, G2, TS_in), [TS_in, TS_out]),
  "fa-buccal-cheek": chain(ZBB, MB, seg(FOUT, FO1, FE), [FE, LM], seg(CHL, LM, CJ), seg(JI, CJ, G2), seg(LS, G2, ZB)),
  "fa-melolabial-fold": chain(FOUT, rev(FIN)),
  "fa-lateral-upper-lip": chain(seg(NB, CB, NS), ALB, seg(FIN, AB, Cy), [Cy, Ca], seg(UVB, Ca, CP), seg(PC, CP, CB)),
  "fa-oral-commissure": chain([Ca, Cm, Cc, Cx], seg(FIN, Cx, Cy)),
  "fa-jawline": chain(seg(OUT, G1, CH_b), seg(CHL, CH_b, CJ), seg(JI, CJ, G2), [G2, G1]),
  "fa-ear": chain(seg(OUT, E_top, E_bot), EAR_OUT),
  "h-scm": chain(seg(NECK, NJ, P_scm), SCMP, [PB_, NB_], seg(SCM, NB_, NA), seg(OUT, NA, NJ)),
  "h-posterior-triangle": chain(seg(NECK, P_scm, NBL), [NBL, PB_], rev(SCMP)),
};

const regions = [
  ...Object.entries(MIDLINE).map(([id, half]) => {
    const pts = midline(half, CX);
    return headRegion(id, pts, null, { dot: labelPointOnLine(pts, CX) });
  }),
  ...Object.entries(PAIRED).flatMap(([id, pts]) => headPair(id, pts, CX, RIGHT)),
];

// ---------------------------------------------------------------------------------------------
// Surgical anatomy (reference text lives in reference/structures.js)
// ---------------------------------------------------------------------------------------------
// Authored on the patient's right. On this drawing 1 unit is close to 1 mm (interpupillary
// distance = 64 units), so published landmark distances can be used directly.
const ring = (cx, cy, r, n = 10) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]);
const SO = [124, 147], STR = [134, 149.5], IO = [123, 189], MF = [125, 274]; // supraorbital, supratrochlear, infraorbital, mental exits
const ANATOMY = [
  // Glands & ducts
  area("parotid", "glands", [[60.5, 172], [70, 174], [76, 190], [77, 210], [80, 232], [83, 249], [78, 250], [69, 234], [64, 214], [61, 192]]),
  line("parotid-duct", "glands", [[77, 198], [92, 203], [104, 207], [108, 211]]),
  line("lacrimal", "glands", [[130.5, 160.6], [134, 161.6], [137.6, 164.6]]),
  line("lacrimal", "glands", [[130.5, 168.2], [134, 167.6], [137.6, 164.6]]),
  // Danger zones (Seckel)
  zone("vii-temporal", [[60, 187], [70, 162], [81, 141], [90, 127], [95, 141], [97, 162], [84, 172], [70, 181]], [80, 157]),
  zone("vii-marginal", [[82, 250], [96, 252], [112, 256], [122, 266], [120, 280], [110, 284], [98, 275], [88, 264]], [106, 269]),
  zone("zone-midcheek", [[100, 181], [112, 200], [123, 240], [110, 250], [84, 248], [80, 222], [88, 196]], [97, 222], { soft: true }),
  zone("v1-supraorbital", ring(127, 146, 9.5), [121, 138.5], { sensory: true }),
  zone("v2-infraorbital", ring(...IO, 7.5), [117.5, 184], { sensory: true }),
  zone("v3-mental", ring(...MF, 7.5), [119.5, 269], { sensory: true }),
  // Facial nerve
  line("vii-temporal", "motor", [[62, 188], [70, 170], [80, 152], [90, 134]]),
  line("vii-temporal", "motor", [[70, 170], [82, 158], [92, 151]]),
  line("vii-zygomatic", "motor", [[64, 194], [80, 186], [94, 178], [103, 172]]),
  line("vii-zygomatic", "motor", [[80, 186], [96, 188], [108, 186]]),
  line("vii-buccal", "motor", [[66, 200], [84, 200], [102, 206], [116, 210]]),
  line("vii-buccal", "motor", [[69, 208], [90, 216], [108, 226], [120, 236]]),
  line("vii-marginal", "motor", [[72, 222], [78, 242], [86, 256], [95, 266], [106, 270], [118, 266]]),
  // Sensory nerves
  line("v1-supraorbital", "sensory", [SO, [123, 130], [122, 105], [120, 84], [117, 60]]),
  line("v1-supraorbital", "sensory", [SO, [115, 130], [106, 108], [100, 88], [95, 64]]),
  point("v1-supraorbital", "sensory", SO),
  line("v1-supratrochlear", "sensory", [STR, [135, 130], [136, 105], [137, 84]]),
  point("v1-supratrochlear", "sensory", STR),
  point("v1-infratrochlear", "sensory", [138.6, 159.5]),
  line("v1-external-nasal", "sensory", [[146, 190], [147, 200], [148.4, 210]]),
  point("v1-external-nasal", "sensory", [146, 190]),
  line("v2-infraorbital", "sensory", [IO, [121, 181], [118, 176.5]]),
  line("v2-infraorbital", "sensory", [IO, [130, 196], [134, 206]]),
  line("v2-infraorbital", "sensory", [IO, [126, 210], [128, 228]]),
  line("v2-infraorbital", "sensory", [IO, [131, 214], [137, 231]]),
  point("v2-infraorbital", "sensory", IO),
  point("v2-zygomaticofacial", "sensory", [100, 187]),
  point("v2-zygomaticotemporal", "sensory", [89, 158]),
  line("v3-mental", "sensory", [MF, [130, 266], [134, 259]]),
  line("v3-mental", "sensory", [MF, [136, 270], [143, 264.5]]),
  line("v3-mental", "sensory", [MF, [131, 282], [139, 288]]),
  point("v3-mental", "sensory", MF),
  line("v3-auriculotemporal", "sensory", [[62, 181], [62.5, 160], [65.5, 140], [70, 118]]),
  // Vessels
  line("a-sta", "vessels", [[64.5, 183], [64.5, 164], [67, 146]]),
  line("a-sta", "vessels", [[67, 146], [77, 128], [90, 113], [104, 101]]),
  line("a-sta", "vessels", [[67, 146], [63, 124], [67, 100], [75, 78]]),
  line("a-facial", "vessels", [[97, 273], [101, 264], [108, 257], [110, 248], [117, 242], [119, 233], [127, 224]]),
  line("a-labial", "vessels", [[114, 244.5], [124, 241.5], [136, 241], [150, 242]]),
  line("a-labial", "vessels", [[112, 250], [124, 255.5], [136, 257.5], [150, 258]]),
  line("a-angular", "vessels", [[127, 224], [128.5, 212], [132, 198], [135.5, 182], [138.4, 167]]),
  line("a-angular", "vessels", [[130, 207], [136, 208.5], [142, 211.5]]),
  line("a-dorsal-nasal", "vessels", [[138.6, 162], [141, 172], [143.4, 186], [144.6, 198]]),
  line("a-supraorbital", "vessels", [[125.6, 147], [125, 128], [124.4, 104]]),
  line("v1-supratrochlear", "vessels", [[132.4, 149.5], [133.4, 128], [134.4, 104], [135.2, 86]]),
  // Relaxed skin tension lines
  ...rstl(
    [[96, 99], [124, 95], [150, 94]], [[92, 109], [122, 105.5], [150, 105]], [[90, 119], [122, 116], [150, 115.5]], [[92, 129], [120, 126.5], [136, 127]],
    [[143.5, 131], [142.6, 146]], [[143, 163.5], [150, 162.5]],
    [[95, 158], [86, 152.5]], [[94, 163], [83, 163.5]], [[95, 168], [86, 174.5]],
    [[105, 152.5], [117, 149], [130, 153.5]], [[104, 174.5], [116, 178], [128, 174.5]],
    [[108, 187], [102, 206], [100, 226], [104, 246]], [[95, 189], [88, 208], [87, 228], [93, 249]], [[82, 193], [76.5, 212], [78, 234]],
    [[68, 178], [67, 200], [70, 222]],
    [[133, 229], [132, 238]], [[140, 228], [139.4, 236.6]], [[122, 246], [114, 243]], [[122, 251], [115, 256]],
    [[133, 261], [131, 268]], [[142, 262], [141.4, 269]],
    [[129, 276], [140, 278.5], [150, 279]], [[122, 285], [136, 291], [150, 292]], [[86, 256], [98, 270], [112, 281]],
    [[114, 315], [130, 318], [150, 319]], [[110, 340], [130, 344], [150, 345]], [[108, 363], [128, 367], [150, 368]]
  ),
];
const overlays = [...placeOverlays(ANATOMY, RIGHT), ...placeOverlays(ANATOMY, LEFT, (pts) => mirror(pts, CX))];

// ---------------------------------------------------------------------------------------------
// Artwork
// ---------------------------------------------------------------------------------------------
const both = (pts) => [pts, mirror(pts, CX)];
const EYE = chain(UMG, rev(LMG));
const HEAD = midline(chain(OUT), CX);

function Under({ k = 1 }) {
  return (
    <g>
      <path d={pathD(HEAD)} fill={C.skin} stroke={C.line} strokeWidth={2.2 * k} />
      {regions.map((r) => r.base && <path key={r.id} d={r.d} fill={r.base} />)}
    </g>
  );
}

function Over({ k = 1 }) {
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
      {both(UMG).map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.line} strokeWidth={1.6 * k} />)}
      {both(LMG).map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth={0.8 * k} />)}
      {both(spline([[129, 153.5], [118, 151], [107, 152.5]])).map((p, i) => (
        <path key={i} d={pathD(p, false)} stroke={C.lineSoft} strokeWidth={0.7 * k} />
      ))}
      {/* mouth */}
      <path d={pathD(midline(MLN, CX), false)} stroke={C.lipDeep} strokeWidth={1.3 * k} />
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
  overlays,
  zooms: [
    { label: "Eyes", viewBox: "76 112 148 84" },
    { label: "Nose", viewBox: "110 148 80 88" },
    { label: "Lips & chin", viewBox: "96 214 108 92" },
    { label: "Neck", viewBox: "40 250 220 130" },
  ],
};
