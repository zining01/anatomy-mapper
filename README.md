# anatomy-mapper

A click-to-select anatomy map for clinical documentation. Pick regions on the
figure and copy a note snippet such as
`Right nasal ala; Left melolabial (nasolabial) fold; Right T10 dermatome`.

Open `index.html` in a browser — it is fully self-contained (no server or
internet connection needed), so it also works as a GitHub Pages site.

## Views

| Group | Views | Content |
| --- | --- | --- |
| Whole body | Anterior, Posterior | ~100 body sites (dots) |
| Head & neck | Face, Right/Left lateral, Posterior | Facial aesthetic units & subunits (Gonzalez-Ulloa units, Burget & Menick nasal subunits), scalp, ear, neck |
| | Right ear, Left ear | Auricular subunits: helix, helical root, scapha, antihelix & crura, triangular fossa, cymba & cavum conchae, canal, tragus, antitragus, lobule, pre/postauricular skin |
| Dermatomes | Anterior, Posterior | V1–V3, C2–S5 per the ISNCSCI (ASIA) chart, with key sensory points |

A subunit that appears in several views (e.g. the right nasal ala on the face
and right lateral views) is the same region, so selecting it in one view shows
it selected in the others. Double-click an ear on a head view to open the
detailed ear.

## Editing

The editable source is in `src/`; `index.html` is generated from it.

```sh
npm install      # once
npm run dev      # rebuilds index.html whenever a file in src/ changes
npm run build    # one-off build
```

Then refresh `index.html` in the browser. You can deep-link to a view with
`index.html#view=earRight` (view keys are listed in `src/views/index.js`).

```
src/
  main.jsx              entry point
  App.jsx               UI: view buttons, figure rendering, search, selection, snippet
  geometry.js           spline / region-building helpers shared by all drawings
  views/
    index.js            which views exist and how the buttons are grouped
    common.js           colours, subunit groups (legend), left/right naming
    catalog.js          names + search aliases for every head & neck region
    faceAnterior.jsx    face, anterior
    headLateral.jsx     head, right lateral (left lateral is its mirror)
    headPosterior.jsx   head, posterior
    ear.jsx             ear subunits (left ear is the mirror of the right)
    bodyFigure.jsx      shared whole-body drawing and limb coordinate frames
    bodyViews.jsx       body-site dots (anterior & posterior)
    dermatomes.jsx      dermatome maps
```

### How the drawings are built

* Coordinates are SVG user units in each view's `viewBox`.
* Outlines are smooth curves through named control points
  (`spline([...])`). Each subunit is assembled from pieces of those curves
  with `seg(curve, from, to)` and `chain(...)`, so two neighbouring subunits
  always share exactly the same boundary. To move a boundary, move the named
  point(s) it passes through — both neighbours follow.
* Symmetric views are drawn on one half and mirrored. On the anterior views
  the half you edit (viewer's left) is the patient's **right**; on posterior
  views it is the patient's **left**.
* Body limbs use local frames (`armPt(x, y)`, `legPt(x, y)` in
  `bodyFigure.jsx`): `x < 0` is lateral, `x > 0` medial, `y` runs down the limb
  from the shoulder / hip joint.
* Dermatome pieces are deliberately oversized; each is clipped to its body
  frame (trunk, arm or leg) and to the silhouette, so only the boundaries
  between levels matter.

### Common changes

* **Rename a region or add search terms:** edit `catalog.js` (head & neck),
  the lists in `bodyViews.jsx` (body sites) or `LEVELS` in `dermatomes.jsx`.
* **Add a body site:** add a `[id, name, dot, aliases]` row to the relevant
  list in `bodyViews.jsx`. Paired sites are written once with `{Side}` in the
  name and placed on the viewer's left.
* **Add a head subunit:** add it to `catalog.js`, then add its shape to the
  view(s) where it is visible, keyed by the same id.
