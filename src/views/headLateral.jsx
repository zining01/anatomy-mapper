// Head & neck — lateral view. Authored as the RIGHT side (the patient faces the
// viewer's right); the left lateral view is its mirror image. Subunits shared
// with the anterior view use the same ids (see catalog.js).
import { spline, seg, chain, rev, mirror, pathD } from "../geometry.js";
import { C } from "./common.js";
import { headRegion, RIGHT, LEFT } from "./catalog.js";
import { EAR_GEOM } from "./ear.jsx";
import { line, zone, area, point, rstl, placeOverlays } from "./overlay.js";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 14 });

// --- The ear: a scaled copy of the detailed ear drawing ------------------------------
const earMap = (pts) => pts.map(([x, y]) => [138 + (x - 150) * 0.25, 184 + (y - 190) * 0.25]);
const EAR_L = earMap(EAR_GEOM.outline);
const [E_A1, RB, BACK_TOP, BACK_LOW] = earMap([EAR_GEOM.P.A1, EAR_GEOM.P.LA, EAR_GEOM.BACK_TOP, EAR_GEOM.P.BACK_LOW]);
const EAR_FRONT = earMap(EAR_GEOM.front); // lobule attachment (RB) → upper attachment (E_A1)
const EAR_INNER = EAR_GEOM.inner.map(earMap);

// --- Outline: back of neck → occiput → vertex → face profile → front of neck -------------
const PNB = [82, 380], NH = [64, 244], PO = [54, 88], FS = [198, 38], TR = [240, 74], GBp = [254, 134];
const NAS = [249, 160], DT = [268, 199], TCB = [270, 216], SN = [254, 221], VBU = [258, 232.5];
const STM = [253, 239.5], VBL = [255.5, 249], SM = [246, 256], ME = [238, 290], CM = [196, 300], ANB = [188, 380];
const ROOT_o = [254, 172], SUP_o = [271.2, 203.4], INF_o = [272.7, 211]; // profile ends of the root, supratip and infratip divisions
const OUTL = sp([PNB, [84, 344], [82, 306], [74, 270], NH, [52, 212], [44, 180], [41, 148], [44, 116], PO, [72, 62], [98, 44],
  [132, 32], [166, 30], FS, [222, 52], TR, [249, 100], [252.5, 120], GBp, [255, 146], NAS, ROOT_o, [261, 187], DT,
  [273, 207], TCB, [263, 220], SN, [255, 227], VBU, [259.5, 235.5], STM, [257.5, 244], VBL, SM, [249, 265], [253, 273],
  [250, 283], ME, [222, 293], CM, [191, 322], [189, 350], ANB]);

// --- Hairline & scalp divisions ------------------------------------------------------------
const TP = [212, 112], SB1 = [200, 146], SB2 = [196, 170], SB3 = [182, 170], HUB = [112, 112], HB2 = [106, 226];
const HLN = sp([TR, [234, 84], [224, 96], TP, [206, 128], SB1, SB2, SB3, [166, 161], E_A1]); // frontal & temporal hairline
const HBH = sp([BACK_TOP, [108, 175], [104, 200], HB2, [90, 238], NH]); // hairline behind the ear and at the nape
const TL = sp([TP, [184, 100], [148, 98], HUB]); // superior temporal line

// --- Brow & eye --------------------------------------------------------------------------------
const BT = [218, 151], BRF_u = [249, 142.5], BRF_l = [248, 148.5];
const BU = sp([BT, [226, 145.5], [238, 143], BRF_u]);
const BL = sp([BRF_l, [238, 148.8], [227, 150.2], BT]);
const TC = sp([TP, [214, 132], BT]); // temporal crest
const LCn = [222, 164], EF = [241, 161.5], UM_lc = [226, 159.6], LM_lc = [226, 166.6];
const UML = sp([LCn, UM_lc, [235, 157.2], EF]);
const LML = sp([LCn, LM_lc, [235, 167], EF]);
const LCt = [217, 157], LCb = [219, 172], LCo = [212, 165];
const NAS_in = [245, 162], NFl = [244.5, 172], Z1 = [232, 176.5];
const LCJ = sp([LCb, [226, 175.5], Z1, [240, 175.5], NFl]); // lid–cheek junction

// --- Nose ------------------------------------------------------------------------------------------
const DT_in = [262, 198], ACT = [249, 198], ABS = [251, 216.5];
const TIP_b = [262, 203], ALT = [264, 210.5], NST = [262, 214.5], STb = [267, 215.5];
const ROOT_i = [250, 176];
const DI = sp([NAS_in, ROOT_i, [256, 189], DT_in]); // dorsum / sidewall
const NF = sp([NAS_in, NFl, [246, 185], ACT]); // nasofacial junction
const AC = sp([ACT, [246, 205], [247.5, 212], ABS]); // alar crease
const AGR = sp([ACT, [255, 198.5], TIP_b]); // alar groove
const AR = sp([NST, [257, 215.8], ABS]); // alar rim
const CI = sp([STb, [262, 216.8], [257, 217.8], SN]); // columella / nostril

// --- Cheek, lips, chin -------------------------------------------------------------------------
const Z2 = [230, 200], ZB = [196, 196], FO1 = [243, 224], FE = [234, 258];
const CaL = [245, 237.5], CmL = [243, 240], CcL = [245, 243], CxL = [237, 248], CyL = [240, 234.5];
const MZ = sp([Z1, [231, 188], Z2]);
const ZBB = sp([ZB, [214, 200], Z2]);
const MB = sp([Z2, [236, 214], FO1]);
const ZA = sp([SB2, [204, 169], LCo]); // zygomatic arch
const FOUT = sp([ABS, FO1, [236, 234], [233, 246], FE]);
const FIN = sp([ABS, [246, 225], CyL, [237.5, 242], CxL, [236.5, 253], FE]);
const UVB = sp([CaL, [251, 235], VBU]);
const MLN = sp([CmL, [248, 239.8], STM]);
const LVB = sp([CcL, [250, 246.5], VBL]);
const LMC = sp([SM, [240, 257.5], FE]); // labiomental crease
const CJ = [229, 272], CHB = [226, 287.5], SMB = [200, 279], GO = [172, 262], RB_in = [162, 212];
const CHL = sp([FE, CJ, CHB]);
const MLB = sp([ME, CHB, SMB, GO, [164, 240], RB]); // lower border & ramus of the mandible
const JI = sp([CJ, [206, 268], [186, 256], [176, 238], RB_in]);
const PF = sp([SB2, ZB, RB_in]); // front of the preauricular cheek

// --- Neck ----------------------------------------------------------------------------------------------
const SA_b = [178, 380], TZ_b = [124, 380], S_hy = [164, 300], SP_b = [156, 380];
const SCMA = sp([RB, [156, 250], S_hy, [172, 340], SA_b]); // anterior border of sternocleidomastoid
const SCMP = sp([BACK_LOW, [131, 250], [140, 300], [150, 345], SP_b]); // posterior border of sternocleidomastoid
const TZ = sp([NH, [92, 300], [112, 350], TZ_b]); // anterior border of trapezius

// ---------------------------------------------------------------------------------------------------------
// Regions
// ---------------------------------------------------------------------------------------------------------
const MIDLINE = {
  "fa-frontal-scalp": chain(seg(OUTL, FS, TR), seg(HLN, TR, TP), [TP, FS]),
  "h-occipital-scalp": chain(seg(OUTL, PO, NH), seg(HBH, NH, BACK_TOP), [BACK_TOP, HUB, PO]),
  "fa-glabella": chain(seg(OUTL, GBp, NAS), [NAS, NAS_in, BRF_l, BRF_u]),
  "fa-nasal-root": chain(seg(OUTL, NAS, ROOT_o), [ROOT_o, ROOT_i], seg(DI, ROOT_i, NAS_in)),
  "fa-nasal-dorsum": chain(seg(OUTL, ROOT_o, DT), [DT, DT_in], seg(DI, DT_in, ROOT_i)),
  "fa-nasal-supratip": chain(seg(OUTL, DT, SUP_o), [TIP_b, DT_in]),
  "fa-nasal-tip": chain(seg(OUTL, SUP_o, INF_o), [ALT, TIP_b]),
  "fa-nasal-infratip": chain(seg(OUTL, INF_o, TCB), [TCB, STb, ALT]),
  "fa-columella": chain(seg(OUTL, TCB, SN), rev(CI)),
  "fa-upper-vermilion": chain(seg(OUTL, VBU, STM), rev(MLN), [CmL, CaL], UVB),
  "fa-lower-vermilion": chain(seg(OUTL, STM, VBL), rev(LVB), [CcL, CmL], MLN),
  "fa-lower-lip": chain(seg(OUTL, VBL, SM), LMC, seg(FIN, FE, CxL), [CxL, CcL], LVB),
  "fa-chin": chain(seg(OUTL, SM, ME), seg(MLB, ME, CHB), seg(CHL, CHB, FE), seg(LMC, FE, SM)),
  "h-submental": chain(seg(OUTL, ME, CM), [CM, SMB], seg(MLB, SMB, ME)),
  "fa-anterior-neck": chain(seg(OUTL, CM, ANB), [ANB, SA_b], seg(SCMA, SA_b, S_hy), [S_hy, CM]),
};

const SIDED = {
  "h-parietal-scalp": chain(seg(OUTL, PO, FS), [FS, TP], TL, [HUB, PO]),
  "h-temporal-scalp": chain(seg(HLN, TP, E_A1), seg(EAR_L, E_A1, BACK_TOP), [BACK_TOP, HUB], rev(TL)),
  "fa-lateral-forehead": chain(seg(OUTL, TR, GBp), [GBp, BRF_u], rev(BU), rev(TC), seg(HLN, TP, TR)),
  "fa-temple": chain(seg(HLN, TP, SB2), ZA, [LCo, LCt, BT], rev(TC)),
  "fa-eyebrow": chain(BU, [BRF_u, BRF_l], BL),
  "fa-upper-eyelid": chain(BL, [BT, LCt, UM_lc], seg(UML, UM_lc, EF), [EF, NAS_in, BRF_l]),
  "fa-lateral-canthus": chain([LCt], seg(UML, UM_lc, LCn), seg(LML, LCn, LM_lc), [LCb, LCo]),
  "fa-lower-eyelid": chain(seg(LML, EF, LM_lc), [LM_lc, LCb], LCJ, seg(NF, NFl, NAS_in), [NAS_in, EF]),
  "fa-nasal-sidewall": chain(DI, [DT_in, TIP_b], rev(AGR), rev(NF)),
  "fa-nasal-ala": chain([TIP_b, ALT, NST], AR, rev(AC), AGR),
  "fa-soft-triangle": [ALT, STb, NST],
  "fa-nasal-vestibule": chain([NST, STb], seg(CI, STb, SN), [SN, ABS], rev(AR)),
  "fa-medial-cheek": chain(seg(LCJ, NFl, Z1), MZ, MB, seg(FOUT, FO1, ABS), rev(AC), seg(NF, ACT, NFl)),
  "fa-zygomatic-cheek": chain(seg(LCJ, LCb, Z1), MZ, rev(ZBB), seg(PF, ZB, SB2), ZA, [LCo, LCb]),
  "fa-buccal-cheek": chain(ZBB, MB, seg(FOUT, FO1, FE), seg(CHL, FE, CJ), JI, seg(PF, RB_in, ZB)),
  "fa-lateral-cheek": chain(seg(HLN, SB2, E_A1), rev(EAR_FRONT), [RB, RB_in], seg(PF, RB_in, SB2)),
  "fa-melolabial-fold": chain(FOUT, rev(FIN)),
  "fa-lateral-upper-lip": chain([ABS, SN], seg(OUTL, SN, VBU), rev(UVB), [CaL, CyL], seg(FIN, CyL, ABS)),
  "fa-oral-commissure": chain([CaL, CmL, CcL, CxL], seg(FIN, CxL, CyL)),
  "fa-jawline": chain(seg(MLB, CHB, RB), [RB, RB_in], rev(JI), seg(CHL, CJ, CHB)),
  "fa-ear": EAR_L,
  "h-postauricular": chain(seg(EAR_L, BACK_TOP, BACK_LOW), [BACK_LOW, HB2], seg(HBH, HB2, BACK_TOP)),
  "h-submandibular": chain(seg(MLB, SMB, RB), seg(SCMA, RB, S_hy), [S_hy, CM, SMB]),
  "h-scm": chain(SCMA, [SA_b, SP_b], rev(SCMP), seg(EAR_L, BACK_LOW, RB)),
  "h-posterior-triangle": chain(SCMP, [SP_b, TZ_b], rev(TZ), seg(HBH, NH, HB2), [HB2, BACK_LOW]),
  "h-posterolateral-neck": chain(seg(OUTL, NH, PNB), rev(TZ)),
};

// ---------------------------------------------------------------------------------------------------------
// Surgical anatomy (reference text lives in reference/structures.js)
// ---------------------------------------------------------------------------------------------------------
// On this drawing 1 cm is about 9 units (tragus to lateral canthus = 70 units). Key landmarks:
// tragus [154, 182], ear canal [146, 181], lobule attachment RB, lateral brow BT, lateral canthus LCn,
// angle of the mandible GO, facial artery crossing the mandible at [201, 278], oral commissure CmL.
const ring = (cx, cy, r, n = 10) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]);
const SO = [242, 149], STR = [247, 150], IO = [237, 185], MF = [235, 268], ERB = [134, 268], GON = [62, 212];
const ANATOMY = [
  // Glands & ducts
  area("parotid", "glands", [[155, 175], [170, 176], [184, 184], [188, 198], [183, 214], [177, 232], [168, 247], [160, 238], [155.5, 222], [154, 208], [156.5, 196]]),
  line("parotid-duct", "glands", [[188, 199], [202, 203], [214, 207], [218, 212]]),
  // Danger zones (Seckel zones 1–7 and Erb's point)
  zone("vii-temporal", [[154, 188], [170, 172], [190, 153], [208, 138], [220, 130], [222, 146], [215, 167], [196, 174], [172, 184]], [199, 158]),
  zone("vii-marginal", [[176, 252], [192, 260], [210, 262], [230, 256], [240, 266], [234, 282], [214, 288], [194, 284], [176, 270]], [213, 275]),
  zone("xi-accessory", [[127, 250], [139, 256], [138, 274], [128, 298], [116, 326], [108, 342], [98, 336], [106, 308], [116, 280], [122, 260]], [119, 300]),
  zone("zone-midcheek", [[224, 181], [236, 214], [243, 240], [214, 250], [176, 260], [190, 226], [206, 198]], [214, 226], { soft: true }),
  zone("c-great-auricular", ring(144.5, 240, 10.5), [137.5, 233], { sensory: true }),
  zone("v1-supraorbital", ring(243.5, 148, 8.5), [237.5, 141.5], { sensory: true }),
  zone("v2-infraorbital", ring(...IO, 7), [232, 180.5], { sensory: true }),
  zone("v3-mental", ring(...MF, 7), [230, 263.5], { sensory: true }),
  // Motor nerves
  line("vii-trunk", "motor", [[146, 203], [152, 200.5], [158, 199]]),
  line("vii-temporal", "motor", [[158, 199], [166, 184], [178, 170], [196, 152], [219, 137]]),
  line("vii-temporal", "motor", [[178, 170], [194, 161], [212, 154]]),
  line("vii-temporal", "motor", [[170, 179], [182, 158], [196, 140], [208, 127]]),
  line("vii-zygomatic", "motor", [[159, 199], [178, 190], [198, 182], [216, 172]]),
  line("vii-zygomatic", "motor", [[178, 190], [200, 190], [224, 186]]),
  line("vii-buccal", "motor", [[160, 201], [182, 200], [206, 203], [232, 206]]),
  line("vii-buccal", "motor", [[160, 203], [186, 212], [210, 220], [236, 228]]),
  line("vii-marginal", "motor", [[158, 204], [162, 232], [172, 257], [187, 274], [201, 276], [216, 270], [230, 263]]),
  line("vii-cervical", "motor", [[157, 206], [163, 240], [174, 272], [182, 300]]),
  line("xi-accessory", "motor", [[132.5, 258], [124, 282], [114, 310], [106, 334]]),
  point("xi-accessory", "motor", ERB),
  // Sensory nerves
  line("v1-supraorbital", "sensory", [SO, [240, 125], [232, 95], [216, 66], [196, 48]]),
  line("v1-supraorbital", "sensory", [SO, [232, 128], [220, 104], [204, 80], [184, 62]]),
  point("v1-supraorbital", "sensory", SO),
  line("v1-supratrochlear", "sensory", [STR, [247.5, 128], [246, 104], [241, 84]]),
  point("v1-supratrochlear", "sensory", STR),
  point("v1-infratrochlear", "sensory", [246.5, 161]),
  line("v1-external-nasal", "sensory", [[258, 191], [264, 200], [268, 208]]),
  point("v1-external-nasal", "sensory", [258, 191]),
  line("v2-infraorbital", "sensory", [IO, [235.5, 181], [234, 178]]),
  line("v2-infraorbital", "sensory", [IO, [246, 196], [252, 206]]),
  line("v2-infraorbital", "sensory", [IO, [242, 208], [247, 228]]),
  line("v2-infraorbital", "sensory", [IO, [239.5, 214], [242.5, 232]]),
  point("v2-infraorbital", "sensory", IO),
  point("v2-zygomaticofacial", "sensory", [224, 184]),
  point("v2-zygomaticotemporal", "sensory", [208, 160]),
  line("v3-mental", "sensory", [MF, [241, 258], [248, 251.5]]),
  line("v3-mental", "sensory", [MF, [243, 266], [250, 262]]),
  line("v3-mental", "sensory", [MF, [240, 278], [246, 284]]),
  point("v3-mental", "sensory", MF),
  line("v3-auriculotemporal", "sensory", [[155.5, 189], [156, 172], [158.5, 152], [164, 128], [172, 106]]),
  line("c-great-auricular", "sensory", [ERB, [143, 248], [148, 228], [150, 213]]),
  line("c-great-auricular", "sensory", [[143.5, 246], [137, 232], [133, 219]]),
  line("c-lesser-occipital", "sensory", [ERB, [127, 244], [121, 222], [114, 198], [108, 172]]),
  line("c-transverse-cervical", "sensory", [ERB, [150, 270], [168, 274], [184, 282]]),
  line("c-supraclavicular", "sensory", [ERB, [136, 300], [142, 336], [150, 372]]),
  line("c-supraclavicular", "sensory", [ERB, [129, 308], [128, 344], [130, 376]]),
  line("c-greater-occipital", "sensory", [GON, [55, 184], [54, 154], [60, 124], [74, 92]]),
  point("c-greater-occipital", "sensory", GON),
  // Vessels
  line("a-sta", "vessels", [[158.5, 192], [159, 176], [161, 160], [164, 146]]),
  line("a-sta", "vessels", [[164, 146], [178, 131], [198, 115], [218, 100], [232, 88]]),
  line("a-sta", "vessels", [[164, 146], [163, 124], [157, 100], [147, 78]]),
  line("a-facial", "vessels", [[201, 279], [205, 266], [214, 259], [218, 248], [228, 242], [234, 231], [248, 220]]),
  line("a-labial", "vessels", [[231, 238.5], [240, 235.6], [250, 234]]),
  line("a-labial", "vessels", [[229, 243], [238, 247], [249, 248.5]]),
  line("a-angular", "vessels", [[248, 220], [245.6, 206], [245, 190], [244.6, 176], [245.4, 164]]),
  line("a-dorsal-nasal", "vessels", [[246.4, 162.5], [251, 174], [257, 186], [262, 196]]),
  line("a-supraorbital", "vessels", [[243.6, 149], [241.6, 126], [234, 98]]),
  line("v1-supratrochlear", "vessels", [[248.6, 150], [249, 128], [247.6, 104]]),
  line("a-occipital", "vessels", [[75, 227], [66, 200], [62.5, 170], [67, 136], [81, 104]]),
  line("a-posterior-auricular", "vessels", [[134, 217], [120, 195], [112, 165], [111, 146]]),
  line("v-external-jugular", "vessels", [[160, 230], [155.5, 256], [149, 290], [146.5, 330], [150, 374]]),
  // Relaxed skin tension lines
  ...rstl(
    [[223, 98], [238, 96], [250, 97]], [[215, 110], [234, 108], [251, 109]], [[211, 122], [232, 120], [252, 121]], [[213, 134], [232, 132], [253, 133]],
    [[218, 160], [207, 154]], [[217, 165], [204, 165.5]], [[218, 170], [207, 177]], [[200, 141], [195, 152], [197, 163]],
    [[224, 172.5], [232, 174.5], [240, 172.5]],
    [[227, 187], [223, 206], [225, 228], [231, 246]], [[212, 189], [206, 210], [208, 234], [217, 254]], [[196, 201], [190, 222], [194, 246], [205, 262]],
    [[178, 197], [174, 216], [177, 238]], [[160, 173], [158.5, 192], [162, 211]],
    [[248, 226], [249, 233]], [[241, 239], [234, 237.5]], [[248, 251.5], [246, 257.5]], [[236, 275], [244, 281]], [[188, 267], [205, 278], [224, 284]],
    [[150, 262], [170, 290], [192, 305]], [[143, 300], [166, 327], [190, 335]], [[130, 332], [158, 358], [188, 365]], [[86, 300], [104, 320], [122, 330]]
  ),
];

// ---------------------------------------------------------------------------------------------------------
// Artwork & view assembly
// ---------------------------------------------------------------------------------------------------------
const HEAD = chain(OUTL);
const EYE = chain(UML, rev(LML));
const ZOOMS = [
  { label: "Temple & cheek", box: [140, 96, 116, 116] },
  { label: "Eye", box: [194, 126, 68, 62] },
  { label: "Nose", box: [226, 150, 56, 80] },
  { label: "Lips & chin", box: [204, 212, 70, 88] },
  { label: "Neck", box: [56, 196, 176, 184] },
];

function build(side) {
  const flip = side === LEFT;
  const place = (pts) => (flip ? rev(mirror(pts, CX)) : pts);
  const regions = [
    ...Object.entries(MIDLINE).map(([id, pts]) => headRegion(id, place(pts))),
    ...Object.entries(SIDED).map(([id, pts]) => headRegion(id, place(pts), side)),
  ];
  const overlays = placeOverlays(ANATOMY, side, (pts) => (flip ? mirror(pts, CX) : pts));
  const zooms = ZOOMS.map(({ label, box: [x, y, w, h] }) => ({ label, viewBox: `${flip ? 2 * CX - x - w : x} ${y} ${w} ${h}` }));
  const eyeClip = `hl-eye-${side.key}`;
  const irisX = flip ? 2 * CX - 236.5 : 236.5;
  const strands = [
    sp([[150, 44], [118, 54], [92, 76]]),
    sp([[80, 112], [70, 140], [72, 170]]),
    sp([[176, 52], [196, 70], [206, 92]]),
    sp([[112, 78], [104, 100], [98, 128]]),
  ].map(place);

  function Under({ k = 1 }) {
    return (
      <g>
        <path d={pathD(place(HEAD))} fill={C.skin} stroke={C.line} strokeWidth={2 * k} strokeLinejoin="round" />
        {regions.map((r) => r.base && <path key={r.id} d={r.d} fill={r.base} />)}
      </g>
    );
  }
  function Over({ k = 1 }) {
    return (
      <g pointerEvents="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <clipPath id={eyeClip}><path d={pathD(place(EYE))} /></clipPath>
        </defs>
        <path d={pathD(place(EYE))} fill="#fbf8f4" />
        <g clipPath={`url(#${eyeClip})`}>
          <ellipse cx={irisX} cy="162" rx="2.6" ry="5.2" fill={C.iris} />
        </g>
        <path d={pathD(place(UML), false)} stroke={C.line} strokeWidth={1.5 * k} />
        <path d={pathD(place(MLN), false)} stroke={C.lipDeep} strokeWidth={1.2 * k} />
        {EAR_INNER.map((p, i) => <path key={i} d={pathD(place(p))} stroke={C.line} strokeWidth={0.5 * k} opacity="0.6" />)}
        <path d={pathD(place(EAR_L))} stroke={C.line} strokeWidth={1.3 * k} />
        {strands.map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.hairLine} strokeWidth={0.8 * k} />)}
        <path d={pathD(place(HEAD))} stroke={C.line} strokeWidth={1.6 * k} />
      </g>
    );
  }

  return {
    key: flip ? "headLeft" : "headRight",
    label: `Head & neck — ${flip ? "left" : "right"} lateral`,
    short: flip ? "Left lateral" : "Right lateral",
    viewBox: "0 0 300 380",
    kind: "regions",
    Under,
    Over,
    regions,
    overlays,
    zooms,
    note: "Double-click the ear for its subunits.",
  };
}

export const headRight = build(RIGHT);
export const headLeft = build(LEFT);
