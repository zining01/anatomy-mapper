import { bodyAnterior, bodyPosterior } from "./bodyViews.jsx";
import faceAnterior from "./faceAnterior.jsx";
import { headRight, headLeft } from "./headLateral.jsx";
import { earRight, earLeft } from "./ear.jsx";
import headPosterior from "./headPosterior.jsx";
import { dermAnterior, dermPosterior, FAMILIES } from "./dermatomes.jsx";
import noseBase from "./noseBase.jsx";
import nailUnit from "./nailUnit.jsx";
import { handDorsal, handPalmar, footDorsal, footPlantar } from "./handsFeet.jsx";

export { FAMILIES };
export const VIEWS = Object.fromEntries([bodyAnterior, bodyPosterior, faceAnterior, headRight, headLeft, headPosterior, earRight, earLeft, noseBase, handDorsal, handPalmar, footDorsal, footPlantar, nailUnit, dermAnterior, dermPosterior].map((v) => [v.key, v]));
export const VIEW_GROUPS = [
  { title: "Whole body", keys: ["bodyAnterior", "bodyPosterior"] },
  { title: "Head & neck", keys: ["faceAnterior", "headRight", "headLeft", "headPosterior"] },
  { title: "Ear & nose detail", keys: ["earRight", "earLeft", "noseBase"] },
  { title: "Hands & feet", keys: ["handDorsal", "handPalmar", "footDorsal", "footPlantar", "nailUnit"] },
  { title: "Dermatomes", keys: ["dermAnterior", "dermPosterior"] },
];
export const HEAD_GRID = ["faceAnterior", "headRight", "headLeft", "headPosterior"];
