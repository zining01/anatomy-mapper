// Head & neck — lateral view. Authored as the RIGHT side (the patient faces the
// viewer's right); the left lateral view is its mirror image. Subunits shared
// with the anterior view use the same ids (see catalog.js).
import { spline, seg, chain, rev, mirror, pathD } from "../geometry.js";
import { C } from "./common.js";
import { headRegion, RIGHT, LEFT } from "./catalog.js";
import { EAR_GEOM } from "./ear.jsx";

const CX = 150;
const sp = (pts) => spline(pts, { steps: 8 });

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
const OUTL = sp([PNB, [84, 344], [82, 306], [74, 270], NH, [52, 212], [44, 180], [41, 148], [44, 116], PO, [72, 62], [98, 44],
  [132, 32], [166, 30], FS, [222, 52], TR, [249, 100], [252.5, 120], GBp, [255, 146], NAS, [254, 172], [261, 187], DT,
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
const DI = sp([NAS_in, [250, 176], [256, 189], DT_in]); // dorsum / sidewall
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
const SA_b = [178, 380], TZ_b = [124, 380];
const SCMA = sp([RB, [156, 250], [164, 300], [172, 340], SA_b]); // anterior border of sternocleidomastoid
const TZ = sp([NH, [92, 300], [112, 350], TZ_b]); // anterior border of trapezius

// ---------------------------------------------------------------------------------------------------------
// Regions
// ---------------------------------------------------------------------------------------------------------
const MIDLINE = {
  "fa-frontal-scalp": chain(seg(OUTL, FS, TR), seg(HLN, TR, TP), [TP, FS]),
  "h-occipital-scalp": chain(seg(OUTL, PO, NH), seg(HBH, NH, BACK_TOP), [BACK_TOP, HUB, PO]),
  "fa-glabella": chain(seg(OUTL, GBp, NAS), [NAS, NAS_in, BRF_l, BRF_u]),
  "fa-nasal-dorsum": chain(seg(OUTL, NAS, DT), [DT, DT_in], rev(DI)),
  "fa-nasal-tip": chain(seg(OUTL, DT, TCB), [TCB, STb, ALT, TIP_b, DT_in]),
  "fa-columella": chain(seg(OUTL, TCB, SN), rev(CI)),
  "fa-upper-vermilion": chain(seg(OUTL, VBU, STM), rev(MLN), [CmL, CaL], UVB),
  "fa-lower-vermilion": chain(seg(OUTL, STM, VBL), rev(LVB), [CcL, CmL], MLN),
  "fa-lower-lip": chain(seg(OUTL, VBL, SM), LMC, seg(FIN, FE, CxL), [CxL, CcL], LVB),
  "fa-chin": chain(seg(OUTL, SM, ME), seg(MLB, ME, CHB), seg(CHL, CHB, FE), seg(LMC, FE, SM)),
  "h-submental": chain(seg(OUTL, ME, CM), [CM, SMB], seg(MLB, SMB, ME)),
  "fa-anterior-neck": chain(seg(OUTL, CM, ANB), [ANB, SA_b], rev(SCMA), seg(MLB, RB, SMB), [SMB, CM]),
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
  "fa-lateral-neck": chain(SCMA, [SA_b, TZ_b], rev(TZ), seg(HBH, NH, HB2), [HB2, BACK_LOW], seg(EAR_L, BACK_LOW, RB)),
  "h-posterolateral-neck": chain(seg(OUTL, NH, PNB), rev(TZ)),
};

// ---------------------------------------------------------------------------------------------------------
// Artwork & view assembly
// ---------------------------------------------------------------------------------------------------------
const HEAD = chain(OUTL);
const EYE = chain(UML, rev(LML));
const NOSTRIL = chain([NST, STb], seg(CI, STb, SN), [SN, ABS], rev(AR));

function build(side) {
  const flip = side === LEFT;
  const place = (pts) => (flip ? rev(mirror(pts, CX)) : pts);
  const regions = [
    ...Object.entries(MIDLINE).map(([id, pts]) => headRegion(id, place(pts))),
    ...Object.entries(SIDED).map(([id, pts]) => headRegion(id, place(pts), side)),
  ];
  const eyeClip = `hl-eye-${side.key}`;
  const irisX = flip ? 2 * CX - 236.5 : 236.5;
  const strands = [
    sp([[150, 44], [118, 54], [92, 76]]),
    sp([[80, 112], [70, 140], [72, 170]]),
    sp([[176, 52], [196, 70], [206, 92]]),
    sp([[112, 78], [104, 100], [98, 128]]),
  ].map(place);

  function Under() {
    return (
      <g>
        <path d={pathD(place(HEAD))} fill={C.skin} stroke={C.line} strokeWidth="2" strokeLinejoin="round" />
        {regions.map((r) => r.base && <path key={r.id} d={r.d} fill={r.base} />)}
      </g>
    );
  }
  function Over() {
    return (
      <g pointerEvents="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <clipPath id={eyeClip}><path d={pathD(place(EYE))} /></clipPath>
        </defs>
        <path d={pathD(place(EYE))} fill="#fbf8f4" />
        <g clipPath={`url(#${eyeClip})`}>
          <ellipse cx={irisX} cy="162" rx="2.6" ry="5.2" fill={C.iris} />
        </g>
        <path d={pathD(place(UML), false)} stroke={C.line} strokeWidth="1.5" />
        <path d={pathD(place(NOSTRIL))} fill={C.nostril} />
        <path d={pathD(place(MLN), false)} stroke={C.lipDeep} strokeWidth="1.2" />
        {EAR_INNER.map((p, i) => <path key={i} d={pathD(place(p))} stroke={C.line} strokeWidth="0.5" opacity="0.6" />)}
        <path d={pathD(place(EAR_L))} stroke={C.line} strokeWidth="1.3" />
        {strands.map((p, i) => <path key={i} d={pathD(p, false)} stroke={C.hairLine} strokeWidth="0.8" />)}
        <path d={pathD(place(HEAD))} stroke={C.line} strokeWidth="1.6" />
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
    note: "Double-click the ear for its subunits.",
  };
}

export const headRight = build(RIGHT);
export const headLeft = build(LEFT);
