// Nail unit — a generic digit seen from above (left) and in sagittal section
// (right). Parts that appear in both drawings share an id, so selecting one
// highlights it in both. Reference notes live in reference/regions.js.
import { spline, pathD } from "../geometry.js";
import { C, region } from "./common.js";
import { Shade, streak, LIGHT } from "./shading.jsx";

const sp = (pts, closed = false) => spline(pts, { closed, steps: 8 });
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

// --- Dorsal view (digit pointing up) -------------------------------------------------------
const L = 32, R = 122, NLx = 45, NRx = 109; // sides of the digit and of the nail plate
const TIP = sp([[L, 122], [36, 84], [54, 56], [77, 47], [100, 56], [118, 84], [R, 122]]);
const FINGER = [...TIP, [R, 292], [L, 292]];
const freeEdge = sp([[NLx, 80], [58, 66], [77, 62], [96, 66], [NRx, 80]]);
const hypo = sp([[NLx, 92], [60, 79], [77, 75.5], [94, 79], [NRx, 92]]);
const lunula = sp([[NLx, 150], [60, 137], [77, 133], [94, 137], [NRx, 150]]);
const cuticle = sp([[NLx, 152], [60, 157.5], [77, 159], [94, 157.5], [NRx, 152]]);
const cuticleTop = sp([[NLx, 156.5], [60, 162.5], [77, 164], [94, 162.5], [NRx, 156.5]]);
const between = (a, b) => [...a, ...b.slice().reverse()];
const DORSAL = [
  ["nu-pulp", [...TIP.filter(([, y]) => y <= 96), ...hypo.slice().reverse()]],
  ["nu-hyponychium", between(freeEdge, hypo)],
  ["nu-bed", between(hypo, lunula)],
  ["nu-matrix", between(lunula, cuticle)],
  ["nu-cuticle", between(cuticle, cuticleTop)],
  ["nu-proximal-fold", [...cuticleTop, [NRx, 204], [NLx, 204]]],
  ["nu-lateral-fold", [...TIP.filter(([x, y]) => x < 77 && y > 84), [L, 204], [NLx, 204], [NLx, 86]]],
  ["nu-lateral-fold", [...TIP.filter(([x, y]) => x > 77 && y > 84).reverse(), [R, 204], [NRx, 204], [NRx, 86]]],
  ["nu-dip", rect(L, 204, R, 292)],
];

// --- Sagittal section (digit pointing right, dorsal surface up); about 3.6 units per mm ----
const SECTION_SKIN = [[206, 112], [236, 113], [270, 112.5], [290, 118], [292, 125], [330, 125.5], [372, 127], [372, 130.5], [367, 133.5],
  ...sp([[367, 133.5], [374, 150], [372, 175], [358, 200], [330, 214], [290, 218], [250, 216], [206, 214]])];
const BONE = sp([[229, 142], [250, 141], [275, 143.5], [305, 140.5], [335, 140], [350, 143.5], [352, 153], [344, 160], [325, 160], [300, 164], [270, 176], [245, 186], [229, 186], [225, 165]], true);
const MIDDLE_PHALANX = [[206, 139], ...sp([[206, 139], [214, 139.5], [220, 150], [221, 165], [218, 180], [212, 189], [206, 190]])];
const SECTION = [
  ["nu-pulp", [[366, 137], ...sp([[367, 133.5], [374, 150], [372, 175], [358, 200], [330, 214], [290, 218], [250, 216], [206, 214]]), [206, 197], [229, 191], [246, 188.5],
    [270, 178.5], [300, 166.5], [325, 162.5], [345, 162.5], [354.5, 154], [352.5, 143], [356, 136.5]]],
  ["nu-phalanx", BONE],
  ["nu-dip", [[219, 136], [229, 140], [225, 165], [229, 188], [219, 193], [222.5, 165]]],
  ["nu-extensor", [[206, 127.5], [232, 129.5], [246, 134.5], [251, 141], [232, 138.5], [206, 134.5]]],
  ["nu-proximal-fold", [[236, 114.5], [270, 114], [288.5, 119.5], [290.5, 125.2], [262, 130], [255, 132.8], [244, 128], [236, 126]]],
  ["nu-cuticle", [[288.5, 119.5], [297, 124.2], [290.5, 125.4]]],
  ["nu-matrix", [[255.5, 133.5], [264, 136], [290, 132.2], [302, 131.4], [302, 136.4], [288, 138.6], [266, 142.5], [256, 139.5]]],
  ["nu-bed", [[302, 131.4], [330, 130.2], [356, 130.8], [356, 136], [330, 135.8], [302, 136.4]]],
  ["nu-hyponychium", [[356, 130.8], [368, 131], [366, 137.4], [356, 136]]],
  ["nu-plate", [[262, 131], [290, 127], [330, 125.6], [372, 127], [372, 130.6], [330, 129.8], [290, 131.6], [264, 135.6]]],
];

const PARTS = {
  "nu-proximal-fold": { name: "Proximal nail fold", aliases: ["eponychium", "posterior nail fold", "pnf"], group: "nailfold" },
  "nu-cuticle": { name: "Cuticle", aliases: ["eponychium"], group: "nailfold" },
  "nu-lateral-fold": { name: "Lateral nail fold", aliases: ["paronychium", "nail wall", "lateral groove"], group: "nailfold" },
  "nu-matrix": { name: "Nail matrix (lunula)", aliases: ["lunula", "germinal matrix", "nail root"], group: "nailmatrix" },
  "nu-bed": { name: "Nail bed", aliases: ["sterile matrix"], group: "nailbed" },
  "nu-plate": { name: "Nail plate", aliases: ["nail"], group: "nailbed" },
  "nu-hyponychium": { name: "Hyponychium / free edge", aliases: ["onychodermal band", "distal groove", "free margin of nail"], group: "nailbed" },
  "nu-pulp": { name: "Digital pulp (fingertip)", aliases: ["fingertip", "pulp", "tuft"], group: "palm" },
  "nu-phalanx": { name: "Distal phalanx", aliases: ["bone", "terminal phalanx", "tuft"], group: "deep" },
  "nu-extensor": { name: "Extensor tendon insertion", aliases: ["terminal extensor tendon", "mallet"], group: "deep" },
  "nu-dip": { name: "Distal interphalangeal (DIP) joint", aliases: ["dip joint", "distal interphalangeal", "myxoid cyst"], group: "deep" },
};

const regions = [...DORSAL, ...SECTION].map(([id, pts]) => region({ id, pts, ...PARTS[id] }));

// Labels: [text, anchor on the drawing, label position, text-anchor].
const LABELS = [
  ["Free edge", [100, 70], [132, 62]], ["Hyponychium", [102, 84], [132, 82]], ["Nail bed (under plate)", [104, 112], [132, 108]],
  ["Lunula (distal matrix)", [100, 144], [132, 138]], ["Cuticle", [100, 159.5], [132, 158]], ["Proximal nail fold", [102, 182], [132, 180]],
  ["Lateral nail fold", [116, 196], [132, 200]], ["Skin over DIP joint", [112, 250], [132, 250]],
  ["Extensor tendon", [224, 131], [207, 90], "start"], ["Proximal nail fold", [268, 118], [262, 72], "middle"], ["Cuticle", [293, 122.5], [308, 98], "middle"],
  ["Nail plate", [336, 127.6], [344, 84], "middle"], ["Hyponychium", [362, 134], [394, 106], "end"],
  ["Matrix", [276, 138], [262, 240], "middle"], ["Nail bed", [330, 133], [322, 240], "middle"], ["Distal phalanx", [300, 152], [300, 256], "middle"],
  ["DIP joint", [223, 176], [222, 240], "middle"], ["Pulp", [350, 190], [372, 232], "middle"],
];

function Under() {
  return (
    <g>
      <path d={pathD(FINGER)} fill={C.skin} stroke={C.line} strokeWidth="2" strokeLinejoin="round" />
      <path d={pathD([...freeEdge, ...lunula.slice().reverse()])} fill="#f3c9bd" />
      <path d={pathD(between(freeEdge, hypo))} fill="#fbf6ee" />
      <path d={pathD(between(lunula, cuticle))} fill="#fbeee6" />
      <path d={pathD(SECTION_SKIN)} fill={C.skin} stroke={C.line} strokeWidth="2" strokeLinejoin="round" />
      <path d={pathD(MIDDLE_PHALANX)} fill="#f7f1e3" stroke={C.lineSoft} strokeWidth="1" />
      <path d={pathD(BONE)} fill="#f7f1e3" />
      <path d={pathD(SECTION.find(([id]) => id === "nu-matrix")[1])} fill="#e8a9b4" />
      <path d={pathD(SECTION.find(([id]) => id === "nu-bed")[1])} fill="#f3c9bd" />
      <path d={pathD(SECTION.find(([id]) => id === "nu-extensor")[1])} fill="#e9dcc0" />
      <path d={pathD(sp([[206, 193], [232, 192], [252, 188], [266, 181]]), false)} fill="none" stroke="#e9dcc0" strokeWidth="5" strokeLinecap="round" />
      <path d={pathD(SECTION.find(([id]) => id === "nu-plate")[1])} fill="#fbf6ee" />
      <Shade id="nu" clip={[FINGER, SECTION_SKIN]} depth={5} edge={0.5}
        items={[streak([[62, 96], [60, 126], [60, 146]], 5, 0.5, 2.5, LIGHT), streak([[66, 172], [66, 280]], 12, 0.3, 6, LIGHT)]} />
    </g>
  );
}

function Over() {
  const text = { fontSize: 6.6, fontFamily: "system-ui, sans-serif", fill: "#4a3d33", style: { userSelect: "none" } };
  return (
    <g pointerEvents="none">
      <path d={pathD(BONE)} fill="none" stroke={C.line} strokeWidth="1" />
      <path d={pathD(SECTION.find(([id]) => id === "nu-plate")[1])} fill="none" stroke={C.line} strokeWidth="0.8" />
      {LABELS.map(([t, [ax, ay], [lx, ly], anchor = "start"], i) => (
        <g key={i}>
          <line x1={ax} y1={ay} x2={anchor === "start" ? lx - 1.5 : lx} y2={ly + (ly > ay + 20 ? -6 : anchor === "start" && lx < 200 ? -2 : 2)} stroke="#8a7a6c" strokeWidth="0.5" />
          <circle cx={ax} cy={ay} r="1" fill="#8a7a6c" />
          <text x={lx} y={ly} textAnchor={anchor} {...text}>{t}</text>
        </g>
      ))}
      {/* cuticle to extensor insertion */}
      <g stroke="#b3261e" strokeWidth="0.6" fill="none">
        <path d="M249 108V102M291.5 108V102M249 105H291.5" />
      </g>
      <text x="270" y="100" textAnchor="middle" {...text} fill="#b3261e" fontWeight="700">≈ 12 mm</text>
      <text x="77" y="306" textAnchor="middle" {...text} fontWeight="700" fill="#a3917f">DORSAL VIEW</text>
      <text x="290" y="306" textAnchor="middle" {...text} fontWeight="700" fill="#a3917f">SAGITTAL SECTION</text>
    </g>
  );
}

export default {
  key: "nailUnit",
  label: "Nail unit — dorsal view and sagittal section",
  short: "Nail unit",
  viewBox: "20 40 380 272",
  kind: "regions",
  Under,
  Over,
  regions,
  note: "A generic digit; parts shown in both drawings are linked. For a specific digit use the hand and foot views.",
};
