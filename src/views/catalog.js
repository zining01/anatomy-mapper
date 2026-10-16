// Names, search aliases and groups for every head & neck region.
//
// Views only supply geometry; they refer to regions by id. A region that is
// visible in several views (e.g. the right nasal ala on the anterior and the
// right lateral view) uses the same id everywhere, so selecting it in one view
// shows it selected in the others. "{Side}" / "{side}" are filled with
// Right/Left for paired regions.
import { C, RIGHT, LEFT, other, region } from "./common.js";
import { mirror, rev, labelPoint } from "../geometry.js";

export const CATALOG = {
  // Scalp
  "fa-frontal-scalp": { name: "Frontal scalp", aliases: ["hairline", "front of scalp"], group: "scalp", base: "hair" },
  "h-temporal-scalp": { name: "{Side} temporal scalp", aliases: ["{side} side of scalp", "{side} temporoparietal scalp"], group: "scalp", base: "hair" },
  "h-parietal-scalp": { name: "{Side} parietal scalp", aliases: ["{side} upper side of scalp"], group: "scalp", base: "hair" },
  "h-vertex-scalp": { name: "Vertex scalp", aliases: ["crown", "top of head"], group: "scalp", base: "hair" },
  "h-occipital-scalp": { name: "Occipital scalp", aliases: ["back of head", "occiput"], group: "scalp", base: "hair" },

  // Forehead & temple
  "fa-central-forehead": { name: "Central forehead", aliases: ["forehead", "frontal"], group: "forehead" },
  "fa-lateral-forehead": { name: "{Side} lateral forehead", aliases: ["{side} forehead"], group: "forehead" },
  "fa-glabella": { name: "Glabella", aliases: ["between the brows", "frown lines"], group: "forehead" },
  "fa-temple": { name: "{Side} temple", aliases: ["{side} temporal"], group: "forehead" },

  // Brow & eyelids
  "fa-eyebrow": { name: "{Side} eyebrow", aliases: ["{side} brow", "{side} supercilium"], group: "eye", base: "brow" },
  "fa-upper-eyelid": { name: "{Side} upper eyelid", aliases: ["{side} upper lid"], group: "eye" },
  "fa-lower-eyelid": { name: "{Side} lower eyelid", aliases: ["{side} lower lid", "{side} infraorbital"], group: "eye" },
  "fa-medial-canthus": { name: "{Side} medial canthus", aliases: ["{side} inner corner of eye", "{side} inner canthus"], group: "eye" },
  "fa-lateral-canthus": { name: "{Side} lateral canthus", aliases: ["{side} outer corner of eye", "{side} crow's feet"], group: "eye" },

  // Nose (Burget & Menick subunits)
  "fa-nasal-dorsum": { name: "Nasal dorsum", aliases: ["nose bridge", "dorsum", "radix", "nasal root"], group: "nose" },
  "fa-nasal-sidewall": { name: "{Side} nasal sidewall", aliases: ["{side} side of nose"], group: "nose" },
  "fa-nasal-tip": { name: "Nasal tip", aliases: ["tip of nose", "supratip", "infratip lobule"], group: "nose" },
  "fa-nasal-ala": { name: "{Side} nasal ala", aliases: ["{side} ala", "{side} nostril", "{side} alar"], group: "nose" },
  "fa-soft-triangle": { name: "{Side} soft triangle", aliases: ["{side} soft tissue facet"], group: "nose" },
  "fa-columella": { name: "Columella", aliases: ["nasal columella"], group: "nose" },

  // Cheek
  "fa-medial-cheek": { name: "{Side} medial cheek", aliases: ["{side} infraorbital cheek", "{side} cheek"], group: "cheek" },
  "fa-zygomatic-cheek": { name: "{Side} zygomatic (malar) cheek", aliases: ["{side} malar", "{side} cheekbone"], group: "cheek" },
  "fa-lateral-cheek": { name: "{Side} preauricular (lateral) cheek", aliases: ["{side} preauricular", "{side} in front of ear", "{side} pretragal"], group: "cheek" },
  "fa-buccal-cheek": { name: "{Side} buccal cheek", aliases: ["{side} lower cheek", "{side} jowl"], group: "cheek" },
  "fa-melolabial-fold": { name: "{Side} melolabial (nasolabial) fold", aliases: ["{side} nasolabial fold", "{side} smile line"], group: "cheek" },

  // Lips
  "fa-philtrum": { name: "Philtrum", aliases: ["philtral", "central upper lip"], group: "lip" },
  "fa-lateral-upper-lip": { name: "{Side} lateral upper lip", aliases: ["{side} upper lip", "{side} cutaneous upper lip"], group: "lip" },
  "fa-upper-vermilion": { name: "Upper lip vermilion", aliases: ["upper lip red", "cupid's bow"], group: "lip", base: "lip" },
  "fa-lower-vermilion": { name: "Lower lip vermilion", aliases: ["lower lip red"], group: "lip", base: "lipDeep" },
  "fa-oral-commissure": { name: "{Side} oral commissure", aliases: ["{side} corner of mouth", "{side} angle of mouth"], group: "lip" },
  "fa-lower-lip": { name: "Cutaneous lower lip", aliases: ["lower lip skin", "labiomental", "mental crease"], group: "lip" },

  // Chin & jaw
  "fa-chin": { name: "Chin (mentum)", aliases: ["mental", "chin"], group: "chin" },
  "fa-jawline": { name: "{Side} jawline (mandibular)", aliases: ["{side} jaw", "{side} mandible"], group: "chin" },
  "h-submental": { name: "Submental", aliases: ["under the chin", "double chin"], group: "chin" },

  // Ear (whole ear on the head views; subunits on the ear views)
  "fa-ear": { name: "{Side} ear", aliases: ["{side} auricle", "{side} pinna"], group: "ear", base: "skinShade", link: "ear" },
  "h-posterior-auricle": { name: "{Side} posterior auricle (back of ear)", aliases: ["{side} back of ear", "{side} cranial surface of ear"], group: "ear", base: "skinShade" },
  "h-postauricular": { name: "{Side} postauricular (mastoid) skin", aliases: ["{side} behind ear", "{side} retroauricular", "{side} mastoid"], group: "ear" },
  "ear-helix": { name: "{Side} helix", aliases: ["{side} helical rim", "{side} ear rim"], group: "helix" },
  "ear-helical-root": { name: "{Side} helical root (crus helicis)", aliases: ["{side} crus of helix"], group: "helix" },
  "ear-scapha": { name: "{Side} scapha", aliases: ["{side} scaphoid fossa"], group: "antihelix", base: "#e6ccb3" },
  "ear-superior-crus": { name: "{Side} superior crus of antihelix", aliases: ["{side} superior crus"], group: "antihelix" },
  "ear-triangular-fossa": { name: "{Side} triangular fossa", aliases: ["{side} fossa triangularis"], group: "antihelix", base: "#e6ccb3" },
  "ear-inferior-crus": { name: "{Side} inferior crus of antihelix", aliases: ["{side} inferior crus"], group: "antihelix" },
  "ear-antihelix": { name: "{Side} antihelix", aliases: ["{side} anthelix"], group: "antihelix" },
  "ear-cymba": { name: "{Side} cymba conchae (superior concha)", aliases: ["{side} concha", "{side} conchal bowl"], group: "concha", base: "skinDeep" },
  "ear-cavum": { name: "{Side} cavum conchae (inferior concha)", aliases: ["{side} concha", "{side} conchal bowl"], group: "concha", base: "skinDeep" },
  "ear-meatus": { name: "{Side} external auditory canal (meatus)", aliases: ["{side} ear canal", "{side} external acoustic meatus"], group: "concha", base: "#a5826b" },
  "ear-tragus": { name: "{Side} tragus", aliases: [], group: "tragus" },
  "ear-antitragus": { name: "{Side} antitragus", aliases: [], group: "tragus" },
  "ear-lobule": { name: "{Side} earlobe (lobule)", aliases: ["{side} lobule", "{side} ear lobe"], group: "lobule" },

  // Neck
  "fa-anterior-neck": { name: "Anterior neck", aliases: ["throat", "front of neck"], group: "neck", base: "skinShade" },
  "fa-lateral-neck": { name: "{Side} lateral neck", aliases: ["{side} side of neck", "{side} sternocleidomastoid"], group: "neck", base: "skinShade" },
  "h-posterolateral-neck": { name: "{Side} posterolateral neck", aliases: ["{side} back of neck", "{side} trapezius"], group: "neck", base: "skinShade" },
  "h-nuchal": { name: "Posterior neck (nuchal)", aliases: ["nape", "back of neck", "nuchal"], group: "neck", base: "skinShade" },
};

/** Build a catalogued region. `side` is RIGHT/LEFT for paired regions, null for midline ones. */
export function headRegion(id, pts, side = null, extra = {}) {
  const c = CATALOG[id];
  if (!c) throw new Error("Unknown head region: " + id);
  const link = c.link === "ear" ? (side === LEFT ? "earLeft" : "earRight") : c.link;
  const base = c.base && (C[c.base] || c.base);
  return region({ ...c, ...extra, id, side, pts, link, base });
}

/** A paired region authored on the viewer's left half of a symmetric drawing centred on `cx`. */
export function headPair(id, pts, cx, leftSide, extra = {}) {
  const dot = extra.dot || labelPoint(pts);
  return [
    headRegion(id, pts, leftSide, { ...extra, dot }),
    headRegion(id, rev(mirror(pts, cx)), other(leftSide), { ...extra, dot: [2 * cx - dot[0], dot[1]] }),
  ];
}

export { RIGHT, LEFT };
