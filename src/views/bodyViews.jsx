// Whole-body site views (anterior & posterior). Sites are dots placed on the
// shared body figure; limb sites are given in limb-local coordinates via
// armPt / legPt so they stay aligned with the drawing.
import { RIGHT, LEFT, other, region, pair } from "./common.js";
import { mirror } from "../geometry.js";
import { line, point, placeOverlays } from "./overlay.js";
import { CX, VIEWBOX, BodyArt, arm, leg, armPt, legPt } from "./bodyFigure.jsx";

const site = (prefix, [id, name, dot, aliases = [], extra = {}]) => ({ id: prefix + id, name, dot, aliases, group: "body", ...extra });

function build(prefix, midline, paired, leftSide) {
  return [
    ...midline.map((m) => region(site(prefix, m))),
    ...paired.flatMap((p) => pair(site(prefix, p), CX, leftSide)),
  ];
}

// [id, name, dot, aliases, extra]. Paired sites are placed on the viewer's left.
const ANTERIOR_MIDLINE = [
  ["head", "Face / head — open the head views", [200, 48], ["head", "face"], { link: "faceAnterior", navigate: true }],
  ["ant-neck", "Anterior neck", [200, 118], ["throat"]],
  ["presternal", "Presternal (central chest)", [200, 170], ["sternum", "central chest"]],
  ["epigastric", "Epigastric", [200, 236], ["upper abdomen"]],
  ["umbilical", "Periumbilical", [200, 294], ["umbilicus", "belly button"]],
  ["suprapubic", "Suprapubic", [200, 338], ["lower abdomen"]],
  ["pubic", "Pubic region / genitalia", [200, 360], ["mons pubis", "genitals", "groin"]],
];
const ANTERIOR_PAIRED = [
  ["supraclav", "{Side} supraclavicular", [174, 127], ["{side} above collarbone"]],
  ["clavicle", "{Side} clavicular", [153, 139.5], ["{side} clavicle", "{side} collarbone"]],
  ["deltoid", "{Side} shoulder (deltoid)", armPt(-17, 22), ["{side} shoulder", "{side} deltoid"]],
  ["pectoral", "{Side} chest (pectoral)", [160, 166], ["{side} upper chest", "{side} pectoral"]],
  ["breast", "{Side} breast (nipple–areola)", [172, 194], ["{side} breast", "{side} nipple", "{side} areola"]],
  ["axilla", "{Side} axilla", [138, 206], ["{side} armpit", "{side} underarm"]],
  ["lat-chest", "{Side} lateral chest wall", [146, 230], ["{side} side of chest", "{side} ribs"]],
  ["upper-abdomen", "{Side} upper abdomen (hypochondrium)", [170, 250], ["{side} upper quadrant"]],
  ["flank", "{Side} flank", [151, 282], ["{side} side of abdomen", "{side} lateral abdomen"]],
  ["lower-abdomen", "{Side} lower abdomen (iliac fossa)", [170, 314], ["{side} lower quadrant"]],
  ["inguinal", "{Side} inguinal (groin)", [176, 351], ["{side} groin", "{side} inguinal crease"]],
  ["hip", "{Side} hip (iliac crest)", [146, 327], ["{side} iliac crest", "{side} hip bone"]],
  ["uparm", "{Side} upper arm (anterior)", armPt(-2, 72), ["{side} biceps", "{side} arm"]],
  ["med-uparm", "{Side} medial upper arm", armPt(12, 92), ["{side} inner arm", "{side} inner upper arm"]],
  ["antecub", "{Side} antecubital fossa", armPt(0, 139), ["{side} elbow crease", "{side} inner elbow"]],
  ["volar-forearm", "{Side} volar forearm", armPt(0, 192), ["{side} flexor forearm", "{side} inner forearm"]],
  ["volar-wrist", "{Side} volar wrist", armPt(0, 241), ["{side} wrist"]],
  ["palm", "{Side} palm", armPt(1, 260), ["{side} hand", "{side} palmar"], { link: "handPalmar" }],
  ["thumb", "{Side} thumb", armPt(-20.5, 278), ["{side} pollex"]],
  ["fingers", "{Side} fingers (palmar)", armPt(-1, 300), ["{side} finger", "{side} digits"], { link: "handPalmar" }],
  ["ant-thigh", "{Side} anterior thigh", legPt(-6, 66), ["{side} quadriceps", "{side} thigh"]],
  ["med-thigh", "{Side} medial thigh", legPt(16, 100), ["{side} inner thigh"]],
  ["lat-thigh", "{Side} lateral thigh", legPt(-30, 104), ["{side} outer thigh"]],
  ["knee", "{Side} knee (patella)", legPt(0, 148), ["{side} kneecap"]],
  ["shin", "{Side} pretibial (shin)", legPt(2, 222), ["{side} shin", "{side} lower leg", "{side} pretibial"]],
  ["lat-leg", "{Side} lateral lower leg", legPt(-14, 204), ["{side} outer lower leg", "{side} peroneal"]],
  ["med-malleolus", "{Side} medial malleolus", legPt(10.5, 294), ["{side} medial ankle", "{side} inner ankle"]],
  ["lat-malleolus", "{Side} lateral malleolus", legPt(-10.5, 295), ["{side} lateral ankle", "{side} outer ankle"]],
  ["ant-ankle", "{Side} anterior ankle", legPt(0, 284), ["{side} ankle"]],
  ["dorsal-foot", "{Side} dorsal foot", legPt(0, 312), ["{side} top of foot", "{side} foot"], { link: "footDorsal" }],
  ["toes", "{Side} toes", legPt(2, 328), ["{side} toe", "{side} hallux"], { link: "footDorsal" }],
];

const POSTERIOR_MIDLINE = [
  ["head", "Back of head — open the head views", [200, 48], ["back of head", "occiput"], { link: "headPosterior", navigate: true }],
  ["nuchal", "Posterior neck (nuchal)", [200, 116], ["nape", "back of neck"]],
  ["interscap", "Interscapular (upper back, midline)", [200, 180], ["between shoulder blades"]],
  ["thoracic", "Mid back (thoracic spine)", [200, 244], ["middle of back", "spine"]],
  ["lumbar", "Lumbar (lower back, midline)", [200, 304], ["lower back", "lumbar spine"]],
  ["sacral", "Sacral", [200, 340], ["sacrum", "tailbone"]],
  ["natal-cleft", "Natal (intergluteal) cleft", [200, 377], ["gluteal cleft", "intergluteal"]],
  ["perianal", "Perianal", [200, 399], ["anus", "perianal skin"]],
];
const POSTERIOR_PAIRED = [
  ["suprascap", "{Side} upper back (suprascapular)", [168, 146], ["{side} trapezius", "{side} top of shoulder"]],
  ["post-shoulder", "{Side} posterior shoulder", armPt(-16, 22), ["{side} back of shoulder", "{side} posterior deltoid"]],
  ["scapular", "{Side} scapular", [164, 190], ["{side} shoulder blade", "{side} scapula"]],
  ["post-axilla", "{Side} posterior axillary fold", [140, 210], ["{side} back of armpit"]],
  ["midback", "{Side} mid back (paraspinal)", [174, 244], ["{side} middle back"]],
  ["post-flank", "{Side} flank (posterior)", [150, 284], ["{side} loin", "{side} side of back"]],
  ["lowback", "{Side} lower back (paraspinal)", [176, 312], ["{side} lumbar"]],
  ["buttock", "{Side} buttock (gluteal)", [166, 380], ["{side} gluteal", "{side} bottom"]],
  ["post-uparm", "{Side} posterior upper arm", armPt(0, 72), ["{side} triceps", "{side} back of arm"]],
  ["elbow", "{Side} elbow (olecranon)", armPt(0, 136), ["{side} olecranon", "{side} point of elbow"]],
  ["dorsal-forearm", "{Side} dorsal forearm", armPt(0, 192), ["{side} extensor forearm", "{side} outer forearm"]],
  ["dorsal-wrist", "{Side} dorsal wrist", armPt(0, 241), ["{side} back of wrist"]],
  ["dorsal-hand", "{Side} dorsal hand", armPt(1, 262), ["{side} back of hand", "{side} knuckles"], { link: "handDorsal" }],
  ["dorsal-fingers", "{Side} fingers (dorsal)", armPt(-1, 300), ["{side} nails", "{side} back of fingers"], { link: "handDorsal" }],
  ["post-thigh", "{Side} posterior thigh", legPt(-4, 90), ["{side} hamstring", "{side} back of thigh"]],
  ["popliteal", "{Side} popliteal fossa", legPt(0, 158), ["{side} back of knee"]],
  ["calf", "{Side} calf", legPt(0, 210), ["{side} gastrocnemius", "{side} back of leg"]],
  ["achilles", "{Side} posterior ankle (Achilles)", legPt(0, 282), ["{side} achilles", "{side} heel cord"]],
  ["heel", "{Side} heel", legPt(0, 318), ["{side} calcaneal", "{side} sole", "{side} plantar"], { link: "footPlantar" }],
];

// Danger points (reference text in reference/structures.js), placed on the viewer's left.
const ANTERIOR_DANGER = [
  point("xi-accessory", "danger", [184, 110]),
  point("b-supraclavicular", "danger", [163, 129]),
  point("b-axilla", "danger", [146, 192]),
  point("b-antecubital", "danger", armPt(8, 131)),
  point("b-volar-wrist", "danger", armPt(-8, 232)),
  point("b-digital", "danger", armPt(10, 293)),
  point("b-femoral", "danger", [186, 368]),
  point("b-peroneal", "danger", legPt(-21, 170)),
  point("b-saphenous", "danger", legPt(15, 276)),
  point("b-dorsal-foot", "danger", legPt(-8, 308)),
];
const POSTERIOR_DANGER = [
  point("xi-accessory", "danger", [181, 121]),
  point("b-ulnar-elbow", "danger", armPt(10, 131)),
  point("b-radial-sensory", "danger", armPt(-12, 228)),
  point("b-dorsal-hand", "danger", armPt(-8, 255)),
  point("b-digital", "danger", armPt(10, 293)),
  point("b-popliteal", "danger", legPt(10, 150)),
  point("b-peroneal", "danger", legPt(-21, 172)),
  point("b-sural", "danger", legPt(-12, 284)),
];
// Nerves and vessels of the limbs. Arm and leg courses are written in limb-local coordinates
// (x < 0 lateral, x > 0 medial; y down the limb: elbow crease ≈ 139, wrist ≈ 241, knee ≈ 148,
// ankle ≈ 290), so they follow the drawing if the figure is adjusted.
const armLine = (id, layer, pts) => line(id, layer, arm(pts));
const legLine = (id, layer, pts) => line(id, layer, leg(pts));
const ANTERIOR_ANATOMY = [
  // major nerves
  line("xi-accessory", "motor", [[186, 104], [181, 114], [173, 126]]),
  armLine("n-median", "motor", [[13, 34], [10.5, 90], [5, 137], [1, 190], [0, 243], [-2, 257]]),
  armLine("n-ulnar", "motor", [[16, 40], [15.5, 95], [16.5, 136], [12, 190], [10, 242], [9, 257]]),
  armLine("n-radial", "motor", [[-13, 100], [-11.5, 124], [-10, 146]]),
  line("n-femoral", "motor", [[167, 345], legPt(-5, 16), legPt(-8, 44)]),
  legLine("b-peroneal", "motor", [[-23, 156], [-21.5, 168], [-16, 177]]),
  legLine("n-deep-peroneal", "motor", [[-16, 177], [-9, 230], [-2.5, 290], [3, 326]]),
  // cutaneous nerves
  line("c-supraclavicular", "sensory", [[185, 108], [181, 124], [178, 142]]),
  line("c-supraclavicular", "sensory", [[185, 108], [172, 128], [160, 143]]),
  line("c-supraclavicular", "sensory", [[185, 108], [162, 126], [140, 148]]),
  line("n-intercostobrachial", "sensory", [[151, 197], armPt(15, 46), armPt(11, 78)]),
  armLine("n-mabc", "sensory", [[9, 100], [8, 140], [6.5, 200], [6, 228]]),
  armLine("n-labc", "sensory", [[-6, 133], [-10, 165], [-12, 214]]),
  armLine("b-radial-sensory", "sensory", [[-10, 146], [-13, 190], [-14.5, 230], [-19, 262]]),
  line("n-lfcn", "sensory", [[150, 331], legPt(-22, 26), legPt(-27.5, 76), legPt(-26, 126)]),
  legLine("b-saphenous", "sensory", [[13, 128], [6, 150], [1, 163]]),
  legLine("b-saphenous", "sensory", [[13, 128], [15, 170], [12.5, 222], [7.5, 292]]),
  legLine("n-superficial-peroneal", "sensory", [[-17, 180], [-18.5, 240], [-9, 291], [-4, 318]]),
  // vessels
  armLine("a-brachial", "vessels", [[14.5, 30], [12.5, 80], [8, 118], [3, 137], [1.5, 150]]),
  armLine("a-radial", "vessels", [[1.5, 150], [-6, 188], [-8.5, 238]]),
  armLine("a-ulnar", "vessels", [[1.5, 150], [7, 186], [8, 242]]),
  armLine("a-palmar-arch", "vessels", [[8, 242], [8, 258], [2, 264], [-5, 262]]),
  line("v-cephalic", "vessels", [[143, 147], armPt(-10, 34), armPt(-15, 96), armPt(-10, 136), armPt(-14.5, 188), armPt(-15.5, 238)]),
  armLine("v-basilic", "vessels", [[15, 74], [16, 116], [11, 139], [14, 196], [13.5, 238]]),
  armLine("v-basilic", "vessels", [[-9.5, 141], [0, 138], [10.5, 133]]),
  line("a-femoral", "vessels", [[172.5, 347], legPt(6, 32), legPt(12, 82), legPt(9.5, 118)]),
  line("v-great-saphenous", "vessels", [legPt(8, 12), legPt(17, 72), legPt(17.5, 150), legPt(15.5, 222), legPt(9.5, 291), legPt(5, 313)]),
  legLine("a-anterior-tibial", "vessels", [[-12, 174], [-6.5, 232], [0, 291], [4, 320]]),
];
const POSTERIOR_ANATOMY = [
  line("xi-accessory", "motor", [[183, 110], [178, 123], [168, 136]]),
  armLine("n-axillary", "motor", [[8, 24], [-6, 29], [-18, 35]]),
  armLine("n-radial", "motor", [[9, 32], [-3, 68], [-13, 104], [-14, 134]]),
  armLine("n-ulnar", "motor", [[14, 62], [12, 110], [11.5, 136], [13, 190], [12.5, 226]]),
  line("n-sciatic", "motor", [[167, 390], legPt(-5, 60), legPt(-3, 118)]),
  legLine("n-tibial", "motor", [[-3, 118], [0, 160], [2.5, 222], [9, 292]]),
  legLine("b-peroneal", "motor", [[-3, 118], [-14, 150], [-21.5, 171]]),
  armLine("b-radial-sensory", "sensory", [[-14, 168], [-13, 228], [-16, 262]]),
  armLine("n-dorsal-ulnar", "sensory", [[12.5, 226], [13, 244], [10.5, 268]]),
  line("n-pfcn", "sensory", [[171, 398], legPt(2, 72), legPt(2.5, 138)]),
  legLine("b-sural", "sensory", [[-2.5, 166], [-3, 230], [-9.5, 286], [-12, 301]]),
  armLine("v-cephalic", "vessels", [[-16, 196], [-15.5, 240], [-12, 262]]),
  armLine("v-basilic", "vessels", [[15, 176], [14.5, 240], [9, 262]]),
  legLine("a-popliteal", "vessels", [[5, 116], [1.5, 150], [1, 174]]),
  legLine("a-posterior-tibial", "vessels", [[1, 174], [5.5, 232], [10.5, 291]]),
  legLine("v-small-saphenous", "vessels", [[1.5, 160], [0.5, 232], [-6.5, 286], [-10.5, 305]]),
  legLine("v-great-saphenous", "vessels", [[19, 96], [17.5, 150], [16, 222], [12, 287]]),
];
const ZOOMS = [
  { label: "Head, neck & trunk", viewBox: "100 6 200 380" },
  { label: "Arms", viewBox: "30 120 340 372" },
  { label: "Hips & thighs", viewBox: "110 300 180 230" },
  { label: "Legs & feet", viewBox: "110 480 180 226" },
];

const dangers = (items, leftSide) => [...placeOverlays(items, leftSide), ...placeOverlays(items, other(leftSide), (pts) => mirror(pts, CX))];

export const bodyAnterior = {
  key: "bodyAnterior",
  label: "Body — anterior",
  short: "Anterior",
  viewBox: VIEWBOX,
  kind: "dots",
  Under: ({ k }) => <BodyArt posterior={false} k={k} />,
  regions: build("ba-", ANTERIOR_MIDLINE, ANTERIOR_PAIRED, RIGHT),
  overlays: dangers([...ANTERIOR_ANATOMY, ...ANTERIOR_DANGER], RIGHT),
  zooms: ZOOMS,
  note: "Double-click a dashed dot for the detailed hand or foot view; the head dot opens the head views.",
};

export const bodyPosterior = {
  key: "bodyPosterior",
  label: "Body — posterior",
  short: "Posterior",
  viewBox: VIEWBOX,
  kind: "dots",
  Under: ({ k }) => <BodyArt posterior k={k} />,
  regions: build("bp-", POSTERIOR_MIDLINE, POSTERIOR_PAIRED, LEFT),
  overlays: dangers([...POSTERIOR_ANATOMY, ...POSTERIOR_DANGER], LEFT),
  zooms: ZOOMS,
  note: "Seen from behind, the patient's left is on the viewer's left. Double-click a dashed dot for the detailed view.",
};
