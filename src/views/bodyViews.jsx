// Whole-body site views (anterior & posterior). Sites are dots placed on the
// shared body figure; limb sites are given in limb-local coordinates via
// armPt / legPt so they stay aligned with the drawing.
import { RIGHT, LEFT, region, pair } from "./common.js";
import { CX, VIEWBOX, BodyArt, armPt, legPt } from "./bodyFigure.jsx";

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
  ["deltoid", "{Side} shoulder (deltoid)", armPt(-17, 22), ["{side} shoulder", "{side} deltoid"]],
  ["pectoral", "{Side} chest (pectoral)", [160, 166], ["{side} upper chest", "{side} pectoral"]],
  ["breast", "{Side} breast (nipple–areola)", [172, 194], ["{side} breast", "{side} nipple", "{side} areola"]],
  ["axilla", "{Side} axilla", [138, 206], ["{side} armpit", "{side} underarm"]],
  ["lat-chest", "{Side} lateral chest wall", [146, 230], ["{side} side of chest", "{side} ribs"]],
  ["upper-abdomen", "{Side} upper abdomen (hypochondrium)", [170, 250], ["{side} upper quadrant"]],
  ["flank", "{Side} flank", [151, 282], ["{side} side of abdomen", "{side} lateral abdomen"]],
  ["lower-abdomen", "{Side} lower abdomen (iliac fossa)", [170, 314], ["{side} lower quadrant"]],
  ["inguinal", "{Side} inguinal (groin)", [176, 351], ["{side} groin", "{side} inguinal crease"]],
  ["uparm", "{Side} upper arm (anterior)", armPt(0, 72), ["{side} biceps", "{side} arm"]],
  ["antecub", "{Side} antecubital fossa", armPt(0, 139), ["{side} elbow crease", "{side} inner elbow"]],
  ["volar-forearm", "{Side} volar forearm", armPt(0, 192), ["{side} flexor forearm", "{side} inner forearm"]],
  ["volar-wrist", "{Side} volar wrist", armPt(0, 241), ["{side} wrist"]],
  ["palm", "{Side} palm", armPt(1, 260), ["{side} hand", "{side} palmar"]],
  ["thumb", "{Side} thumb", armPt(-20.5, 278), ["{side} pollex"]],
  ["fingers", "{Side} fingers (palmar)", armPt(-1, 300), ["{side} finger", "{side} digits"]],
  ["ant-thigh", "{Side} anterior thigh", legPt(-6, 66), ["{side} quadriceps", "{side} thigh"]],
  ["med-thigh", "{Side} medial thigh", legPt(16, 100), ["{side} inner thigh"]],
  ["lat-thigh", "{Side} lateral thigh", legPt(-30, 104), ["{side} outer thigh"]],
  ["knee", "{Side} knee (patella)", legPt(0, 148), ["{side} kneecap"]],
  ["shin", "{Side} pretibial (shin)", legPt(-2, 216), ["{side} shin", "{side} lower leg"]],
  ["ant-ankle", "{Side} anterior ankle", legPt(0, 291), ["{side} ankle"]],
  ["dorsal-foot", "{Side} dorsal foot", legPt(0, 312), ["{side} top of foot", "{side} foot"]],
  ["toes", "{Side} toes", legPt(2, 328), ["{side} toe", "{side} hallux"]],
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
  ["dorsal-hand", "{Side} dorsal hand", armPt(1, 262), ["{side} back of hand", "{side} knuckles"]],
  ["dorsal-fingers", "{Side} fingers (dorsal)", armPt(-1, 300), ["{side} nails", "{side} back of fingers"]],
  ["post-thigh", "{Side} posterior thigh", legPt(-4, 90), ["{side} hamstring", "{side} back of thigh"]],
  ["popliteal", "{Side} popliteal fossa", legPt(0, 158), ["{side} back of knee"]],
  ["calf", "{Side} calf", legPt(0, 210), ["{side} gastrocnemius", "{side} back of leg"]],
  ["achilles", "{Side} posterior ankle (Achilles)", legPt(0, 282), ["{side} achilles", "{side} heel cord"]],
  ["heel", "{Side} heel", legPt(0, 318), ["{side} calcaneal", "{side} sole", "{side} plantar"]],
];

export const bodyAnterior = {
  key: "bodyAnterior",
  label: "Body — anterior",
  short: "Anterior",
  viewBox: VIEWBOX,
  kind: "dots",
  Under: () => <BodyArt posterior={false} />,
  regions: build("ba-", ANTERIOR_MIDLINE, ANTERIOR_PAIRED, RIGHT),
  note: "The dashed dot opens the detailed head views.",
};

export const bodyPosterior = {
  key: "bodyPosterior",
  label: "Body — posterior",
  short: "Posterior",
  viewBox: VIEWBOX,
  kind: "dots",
  Under: () => <BodyArt posterior />,
  regions: build("bp-", POSTERIOR_MIDLINE, POSTERIOR_PAIRED, LEFT),
  note: "Seen from behind, the patient's left is on the viewer's left. The dashed dot opens the head views.",
};
