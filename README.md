# anatomy-mapper

A click-to-select anatomy map for clinical documentation and a surgical-anatomy
reference for dermatologic and Mohs surgery. Pick regions on the figure and copy
a note snippet such as
`Right nasal ala; Left melolabial (nasolabial) fold; Right T10 dermatome`
(optionally with the Mohs AUC area appended). Clicking a region also shows its
danger structures, undermining plane, nerve and blood supply, lymphatic
drainage and common repair options.

Open `index.html` in a browser — it is fully self-contained (no server or
internet connection needed), so it also works as a GitHub Pages site.

## Views

| Group | Views | Content |
| --- | --- | --- |
| Whole body | Anterior, Posterior | ~110 body sites (dots) and danger points (ulnar nerve at the elbow, common peroneal nerve, Erb's point …) |
| Head & neck | Face, Right/Left lateral, Posterior | Facial aesthetic units & subunits (Gonzalez-Ulloa units, Burget & Menick nasal subunits incl. root, supratip, infratip, nostril sill), scalp, ear, neck triangles |
| | Nasal base | Worm's-eye view: infratip lobule, soft triangles, columella, alar rims, nostril sills |
| | Right ear, Left ear | Auricular subunits: helix, helical root, scapha, antihelix & crura, triangular fossa, cymba & cavum conchae, canal, tragus, antitragus, lobule, pre/postauricular skin |
| Hands & feet | Hands dorsal/palmar, Feet dorsal/plantar | Every digit by phalanx, nail units, palm and sole areas, wrist and ankle |
| | Nail unit | Labelled dorsal view and sagittal section (folds, cuticle, matrix, bed, plate, hyponychium, phalanx, extensor insertion, DIP joint) with surgical notes for each part |
| Dermatomes | Anterior, Posterior | V1–V3, C2–S5 per the ISNCSCI (ASIA) chart, with key sensory points |

A subunit that appears in several views (e.g. the right nasal ala on the face
and right lateral views) is the same region, so selecting it in one view shows
it selected in the others. Double-click an ear on a head view to open the
detailed ear.

## Surgical anatomy

* **Anatomy layers** (chips above the figure; the choice is remembered):
  danger zones, motor and mixed nerves (facial nerve branches, spinal
  accessory nerve, and the major nerves of the limbs), sensory / cutaneous
  nerves with their foramina and block points, arteries and superficial
  veins, parotid and ducts, and relaxed skin tension lines. The layers are
  available on the head, whole-body, hand and foot views. Facial danger zones follow Seckel's
  seven zones plus Erb's point.
* **Click a nerve, vessel or `!` marker** for its surface landmarks, depth,
  what happens if it is injured and how to avoid it. Structures can also be
  found from the search box (e.g. "Erb", "Pitanguy", "Stensen").
* **Click a region** for its reference card. The "structures at risk" chips
  switch on the right layer and highlight the structure on the figure.
* **Zoom** presets (eyes, nose, lips, temple, neck on the head views; trunk,
  arms, thighs, legs on the body views) make small subunits and crowded
  limbs easy to read.
* **Glossary:** terms a junior trainee may not know (flap names, fascial
  planes, eponyms, eyelid and nail vocabulary) are underlined in the notes;
  clicking one opens a short built-in definition with a link to search the
  open-access NCBI Bookshelf (StatPearls). The whole glossary can be browsed
  from the reference card and searched from the search box. Definitions live
  in `src/reference/glossary.js`.
* Deep links: `index.html#view=headRight&layers=danger,motor&zoom=1&focus=fa-temple-r`.

The reference text is a memory aid for trained clinicians: nerve and vessel
courses are schematic adult averages, and the notes are not treatment
recommendations. **Review the content in `src/reference/` against your own
sources before relying on it.**

## Editing

The editable source is in `src/`; `index.html` is generated from it.

```sh
npm install      # once
npm run dev      # rebuilds index.html whenever a file in src/ changes
npm run build    # one-off build  (or: node build.mjs)
```

Then refresh `index.html` in the browser. You can deep-link to a view with
`index.html#view=earRight` (view keys are listed in `src/views/index.js`).

```
src/
  main.jsx              entry point
  App.jsx               UI: view buttons, figure rendering, overlays, search, selection, snippet
  InfoPanel.jsx         the "Surgical reference" card
  reference/
    structures.js       text for every nerve, vessel, duct and danger zone
    glossary.js         definitions of terms, linked automatically wherever they appear in the notes
    regions.js          per-region notes: AUC area, structures at risk, plane, supply, lymphatics, repair
  geometry.js           spline / region-building helpers shared by all drawings
  views/
    index.js            which views exist and how the buttons are grouped
    common.js           colours, subunit groups (legend), overlay layers, left/right naming
    overlay.js          helpers for drawing nerves, vessels and danger zones
    shading.jsx         soft shadows, highlights and hair strands used by the drawings
    catalog.js          names + search aliases for every head & neck region
    faceAnterior.jsx    face, anterior
    headLateral.jsx     head, right lateral (left lateral is its mirror)
    headPosterior.jsx   head, posterior
    ear.jsx             ear subunits (left ear is the mirror of the right)
    bodyFigure.jsx      shared whole-body drawing and limb coordinate frames
    bodyViews.jsx       body-site dots and danger points (anterior & posterior)
    handsFeet.jsx       hands and feet, built digit by digit
    noseBase.jsx        nasal base (worm's-eye view)
    nailUnit.jsx        nail unit: dorsal view and sagittal section
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
* **Edit the surgical notes:** region notes are in `reference/regions.js`
  (keyed by region id without the `-r` / `-l` suffix; `like:` inherits from
  another entry), structure notes in `reference/structures.js`.
* **Move or add a nerve / vessel / danger zone:** edit the `ANATOMY` list in
  the view (`line`, `zone`, `area`, `point` from `overlay.js`). Lines are
  smooth curves through the listed points, authored on one side and mirrored.
  A new structure id needs a matching entry in `reference/structures.js`.
