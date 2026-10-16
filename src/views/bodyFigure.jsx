// Shared whole-body figure (≈7.5 heads tall, anatomical position: palms
// forward, arms slightly abducted). Used by the body-site views and the
// dermatome maps.
//
// Geometry is authored for the viewer's LEFT half and mirrored about x = 200.
// Arms and legs are drawn in local "limb frames" (see geometry.frame): local x
// runs across the limb (negative = lateral, positive = medial) and local y runs
// down the limb, so landmarks such as "lateral epicondyle" are easy to place.
import { spline, chain, rev, mirror, pathD, frame } from "../geometry.js";
import { C } from "./common.js";

export const CX = 200;
export const VIEWBOX = "0 0 400 710";
const sp = (pts, steps = 8) => spline(pts, { steps });
export const flipX = (pts) => mirror(pts, CX);

// --- Limb frames (viewer-left side; the other side is the mirror image) ------------------
export const ARM_ORIGIN = [124, 160]; // glenohumeral joint
export const LEG_ORIGIN = [174, 360]; // hip joint
export const arm = frame({ origin: ARM_ORIGIN, angle: 12 });
export const leg = frame({ origin: LEG_ORIGIN, angle: 1.2 });
export const armPt = (x, y) => arm([[x, y]])[0];
export const legPt = (x, y) => leg([[x, y]])[0];

// --- Parts --------------------------------------------------------------------------------
const HEAD_HALF = sp([[200, 16], [184, 18], [173, 27], [168, 40], [166, 54], [167, 66], [170, 78], [175, 89], [183, 98], [192, 103], [200, 105]]);
export const HEAD = chain(HEAD_HALF, rev(flipX(HEAD_HALF)));
const EAR = sp([[168, 56], [163, 57], [160.5, 64], [161.5, 73], [165, 79], [169, 79]]);
const EAR_SHAPE = chain(EAR, [[171, 70]]);

const TORSO_HALF = sp([[200, 92], [180, 94], [179, 108], [177, 121], [166, 129], [152, 135], [136, 140], [124, 146], [114, 156],
  [116, 176], [126, 190], [137, 197], [137, 214], [139, 236], [142, 256], [144, 272], [142, 292], [138, 314], [134, 338],
  [133, 352], [142, 362], [162, 368], [186, 370], [200, 369]]);
export const TORSO = chain(TORSO_HALF, rev(flipX(TORSO_HALF)));

// Buttocks (posterior view only) — the cleft hides the perineum from behind.
const BUTTOCK = sp([[200, 346], [182, 344], [158, 350], [141, 364], [136, 382], [144, 398], [162, 409], [184, 410], [200, 404]]);

// Arm, palm forward. Fingers: index, middle, ring, little from lateral to medial.
const ARM_LOCAL = chain(
  sp([[-8, -20], [-20, -8], [-25, 8], [-26, 26], [-23, 50], [-20, 72], [-19, 96], [-18, 118], [-19, 132], [-20, 148], [-19, 170],
    [-16, 200], [-13, 226], [-12.5, 238], [-14, 248], [-17, 254]]),
  sp([[-17, 254], [-21, 262], [-24, 272], [-24.5, 282], [-22.5, 289], [-19.5, 288], [-17.5, 281], [-16, 272], [-13.5, 267]], 6), // thumb
  sp([[-13.5, 267], [-13.6, 285], [-13, 302], [-11.5, 310.5], [-8.5, 313], [-6.2, 310], [-5.7, 304]], 6), // index
  sp([[-5.7, 304], [-5, 312], [-2.8, 318.5], [0.3, 319], [2, 315], [2.3, 306]], 6), // middle
  sp([[2.3, 306], [3.2, 312], [5.6, 316], [8.4, 315], [9.8, 310], [10.1, 302]], 6), // ring
  sp([[10.1, 302], [11.2, 306.5], [13.5, 308], [15.6, 305], [16.5, 297], [17, 284], [16.6, 264], [14.5, 249], [12, 238]], 6), // little
  sp([[12, 238], [14, 215], [16, 190], [17.5, 165], [18.5, 150], [17.5, 135], [16.5, 112], [16.5, 88], [17, 64], [18, 46], [16, 20], [8, -18]])
);

// Leg. The anterior view shows the dorsum of the foot and toes; the posterior view the heel.
const LEG_LAT = sp([[-14, -12], [-36, -22], [-40, -4], [-41, 14], [-38, 40], [-35, 70], [-31, 100], [-27, 128], [-23, 148], [-22, 160],
  [-21, 175], [-22, 192], [-20, 215], [-16, 245], [-12.5, 275], [-12, 290], [-12.5, 298]]);
const LEG_MED = sp([[12, 288], [13, 270], [16, 245], [19.5, 215], [21, 198], [19, 178], [18, 162], [18.5, 150], [18, 130], [19.5, 100],
  [22, 70], [24.5, 40], [26, 14], [22, -2], [14, -12]]);
const FOOT_FRONT = chain(
  sp([[-12.5, 298], [-14, 304], [-17, 314], [-18, 322], [-17, 327.5]], 6),
  sp([[-17, 327.5], [-14, 330.5], [-10, 331.5], [-6, 332.5], [-1, 333.5], [4, 334.5], [9, 334.5], [13, 332.5], [16, 328]], 6),
  sp([[16, 328], [17, 320], [14, 309], [12.5, 296], [12, 288]], 6)
);
const FOOT_BACK = sp([[-12.5, 298], [-13.5, 308], [-13, 320], [-9, 328.5], [0, 331.5], [8, 329], [12.5, 321], [13.5, 308], [12.5, 296], [12, 288]]);

export function parts(posterior) {
  const armL = arm(ARM_LOCAL);
  const legL = leg(chain(LEG_LAT, posterior ? FOOT_BACK : FOOT_FRONT, LEG_MED));
  const list = [HEAD, EAR_SHAPE, flipX(EAR_SHAPE), TORSO, armL, flipX(armL), legL, flipX(legL)];
  if (posterior) list.push(BUTTOCK.concat(rev(flipX(BUTTOCK)).slice(1)));
  return list;
}

/** SVG path data for the whole silhouette (union of parts; use with nonzero fill). */
export const silhouetteD = (posterior) => parts(posterior).map((p) => pathD(p)).join("");

// --- Drawing ---------------------------------------------------------------------------------
const both = (pts) => [pts, flipX(pts)];
const line = (pts, key, extra = {}) => <path key={key} d={pathD(pts, false)} {...extra} />;

const HAIR_FRONT = chain(sp([[166, 50], [168, 34], [178, 21], [200, 16]]), sp([[200, 16], [222, 21], [232, 34], [234, 50]]),
  sp([[234, 50], [228, 38], [216, 31], [200, 29], [184, 31], [172, 38], [166, 50]]));
const HAIR_BACK = chain(HEAD_HALF.slice(0, -4), rev(flipX(HEAD_HALF.slice(0, -4))));

function Details({ posterior, bare = false }) {
  const soft = { stroke: C.lineSoft, strokeWidth: 1 };
  const out = [];
  let k = 0;
  const add = (pts, extra = soft) => out.push(line(pts, k++, extra));
  const addBoth = (pts, extra = soft) => both(pts).forEach((p) => add(p, extra));
  const armBoth = (pts, extra) => addBoth(arm(pts), extra);
  const legBoth = (pts, extra) => addBoth(leg(pts), extra);

  both(EAR).forEach((p) => out.push(<path key={k++} d={pathD(p)} fill={bare ? "none" : C.skin} stroke={C.line} strokeWidth="1.1" />));

  if (!posterior) {
    if (!bare) out.push(<path key={k++} d={pathD(HAIR_FRONT)} fill={C.hair} />);
    // face
    both([[184, 59], [189, 57], [194, 59]]).forEach((p) => add(sp(p), { stroke: C.line, strokeWidth: 1.1 }));
    both(sp([[183, 52], [189, 50], [195, 52]])).forEach((p) => add(p, { stroke: C.brow, strokeWidth: 1.6 }));
    add(sp([[198, 63], [197.5, 72], [196, 76], [200, 78], [204, 76]]));
    add(sp([[193, 87], [200, 88.5], [207, 87]]), { stroke: C.lipDeep, strokeWidth: 1.2 });
    // neck & chest
    addBoth(sp([[183, 100], [189, 116], [195, 130]]));
    addBoth(sp([[196, 134], [176, 135], [152, 138], [130, 147]]), { stroke: C.lineSoft, strokeWidth: 1.2 });
    addBoth(sp([[200, 202], [188, 204], [172, 202], [158, 192], [150, 180]]));
    out.push(<circle key={k++} cx="172" cy="194" r="2.2" fill={C.skinDeep} stroke={C.line} strokeWidth="0.6" />);
    out.push(<circle key={k++} cx="228" cy="194" r="2.2" fill={C.skinDeep} stroke={C.line} strokeWidth="0.6" />);
    addBoth(sp([[200, 224], [184, 236], [166, 256], [156, 268]]));
    add([[200, 208], [200, 330]], { stroke: C.lineSoft, strokeWidth: 0.7 });
    out.push(<ellipse key={k++} cx="200" cy="284" rx="2.4" ry="3.2" fill={C.skinDeep} stroke={C.line} strokeWidth="0.7" />);
    addBoth(sp([[146, 322], [166, 342], [186, 360], [194, 368]]));
    // arms: elbow crease, wrist crease, palm creases, finger separations
    armBoth(sp([[-15, 136], [0, 141], [15, 136]]));
    armBoth(sp([[-12, 242], [0, 244], [12, 241]]));
    armBoth(sp([[-6, 252], [-11, 262], [-12, 272]]));
    armBoth(sp([[-12, 274], [0, 276], [15, 270]]));
    armBoth([[-5.7, 304], [-6, 293]]);
    armBoth([[2.3, 306], [2.2, 294]]);
    armBoth([[10.1, 302], [10, 292]]);
    // knees, ankles, toes
    both(leg(sp([[-10, 144], [-9, 136], [0, 133], [9, 136], [10, 146], [8, 158], [0, 163], [-8, 158], [-10, 146]]))).forEach((p) =>
      out.push(<path key={k++} d={pathD(p)} fill="none" {...soft} />)
    );
    legBoth([[1, 333.5], [1, 324]]);
    legBoth([[-5, 332.5], [-5.5, 325]]);
    legBoth([[-10, 331.5], [-10.5, 325]]);
  } else {
    if (!bare) out.push(<path key={k++} d={pathD(HAIR_BACK)} fill={C.hair} />);
    // neck, spine, scapulae
    add([[200, 112], [200, 346]], { stroke: C.lineSoft, strokeWidth: 0.9, strokeDasharray: "3 3" });
    addBoth(sp([[182, 104], [180, 120], [166, 131], [140, 142]]));
    addBoth(sp([[146, 160], [162, 158], [182, 160]]));
    addBoth(sp([[182, 156], [180, 186], [176, 212], [170, 224], [160, 206], [148, 182], [142, 166]]));
    // lumbar dimples, natal cleft, gluteal folds
    out.push(<circle key={k++} cx="188" cy="338" r="1.6" fill={C.lineSoft} />);
    out.push(<circle key={k++} cx="212" cy="338" r="1.6" fill={C.lineSoft} />);
    add([[200, 350], [200, 404]], { stroke: C.line, strokeWidth: 1 });
    addBoth(sp([[198, 405], [182, 410], [162, 408], [148, 400]]));
    // elbows, hands, knees, heels
    armBoth(sp([[-6, 138], [0, 134], [6, 138]]));
    armBoth(sp([[-12, 240], [0, 242], [12, 239]]));
    armBoth(sp([[-11, 268], [-4, 270], [4, 270], [12, 266]]));
    armBoth([[-5.7, 304], [-6, 294]]);
    armBoth([[2.3, 306], [2.2, 296]]);
    armBoth([[10.1, 302], [10, 293]]);
    legBoth(sp([[-15, 160], [0, 163], [15, 160]]));
    legBoth(sp([[-4, 240], [-2, 270], [-5, 300]]));
    legBoth(sp([[4, 240], [2, 270], [5, 300]]));
  }
  return <g pointerEvents="none" fill="none" strokeLinecap="round" strokeLinejoin="round">{out}</g>;
}

/** Skin-coloured silhouette with a single clean outline (outline drawn first, fill on top). */
export function Silhouette({ posterior, fill = C.skin }) {
  const list = parts(posterior);
  return (
    <g>
      {list.map((p, i) => <path key={"o" + i} d={pathD(p)} fill={C.line} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />)}
      {list.map((p, i) => <path key={"f" + i} d={pathD(p)} fill={fill} />)}
    </g>
  );
}

export function BodyArt({ posterior }) {
  return (
    <g>
      <Silhouette posterior={posterior} />
      <Details posterior={posterior} />
    </g>
  );
}

/** Thin outline + features drawn over the coloured dermatome map. */
export function BodyOverlay({ posterior }) {
  return (
    <g pointerEvents="none" opacity="0.75">
      <Details posterior={posterior} bare />
    </g>
  );
}
