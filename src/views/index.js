import { bodyAnterior, bodyPosterior } from "./bodyViews.jsx";
import faceAnterior from "./faceAnterior.jsx";
import { headRight, headLeft } from "./headLateral.jsx";
import { earRight, earLeft } from "./ear.jsx";
import headPosterior from "./headPosterior.jsx";
import { dermAnterior, dermPosterior, FAMILIES } from "./dermatomes.jsx";

export { FAMILIES };
export const VIEWS = Object.fromEntries([bodyAnterior, bodyPosterior, faceAnterior, headRight, headLeft, headPosterior, earRight, earLeft, dermAnterior, dermPosterior].map((v) => [v.key, v]));
export const VIEW_GROUPS = [
  { title: "Whole body", keys: ["bodyAnterior", "bodyPosterior"] },
  { title: "Head & neck", keys: ["faceAnterior", "headRight", "headLeft", "headPosterior", "earRight", "earLeft"] },
  { title: "Dermatomes", keys: ["dermAnterior", "dermPosterior"] },
];
export const HEAD_GRID = ["faceAnterior", "headRight", "headLeft", "headPosterior"];
