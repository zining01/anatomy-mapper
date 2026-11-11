// Surgical reference notes for each clickable region, keyed by the region's
// base id (the id without its "-r" / "-l" side suffix).
//
//   auc        Mohs appropriate-use-criteria area: "H", "M" or "L" (Connolly et al. 2012)
//   aucNote    qualifier shown beside the area
//   alerts     top-line warnings
//   structures ids from structures.js that lie under or near the region (most important first)
//   sensory    cutaneous innervation (and the block that covers it)
//   artery     arterial supply
//   lymph      first-echelon nodal drainage
//   plane      usual undermining plane
//   notes      surgical pearls
//   repair     common reconstructive options, simplest first
//   like       inherit everything from another entry, then override
//
// These are memory aids for trained clinicians, not treatment recommendations.

const FREE_MARGIN = "Free margin";

const INFO = {
  // -------------------------------------------------------------------------
  // Scalp
  // -------------------------------------------------------------------------
  "fa-frontal-scalp": {
    auc: "M",
    structures: ["v1-supraorbital", "v1-supratrochlear", "a-sta"],
    sensory: "Supraorbital and supratrochlear nn. (V1).",
    artery: "Supraorbital, supratrochlear and frontal branch of superficial temporal aa.",
    lymph: "Parotid (preauricular) nodes; near the midline drainage may be bilateral.",
    plane: "Subgaleal (loose areolar tissue between galea and pericranium) — bloodless and easy.",
    notes: [
      "Layers: Skin, Connective tissue (vessels and nerves), Aponeurosis (galea), Loose areolar tissue, Pericranium.",
      "Scalp skin is inelastic; wide subgaleal undermining and galeotomies (parallel to the wound edge, sparing the vessels above the galea) gain only a few millimetres each.",
      "Vessels sit in the dense subcutaneous layer and do not retract — suture-ligate or use a running locked suture for haemostasis.",
      "Bevel incisions parallel to the hair shafts to limit scar alopecia.",
    ],
    repair: [
      "Secondary intention heals well where pericranium is intact (slow; hairless scar).",
      "Primary closure with galeal plication sutures.",
      "Rotation flaps (single, O–Z, pinwheel) — make them long, 4–6× the defect width.",
      "Split- or full-thickness skin graft on pericranium.",
      "Bare bone: burr or fenestrate the outer table to bleeding diploë, or use a pericranial flap or dermal substitute, then graft.",
    ],
  },
  "h-temporal-scalp": {
    like: "fa-frontal-scalp",
    structures: ["a-sta", "v3-auriculotemporal", "vii-temporal"],
    sensory: "Auriculotemporal n. (V3); lesser occipital n. behind the ear.",
    artery: "Superficial temporal a. (parietal branch).",
    lymph: "Parotid (preauricular) nodes; postauricular nodes posteriorly.",
    plane: "Subgaleal over the vertex side; below the superior temporal line stay in the subcutaneous fat above the superficial temporal fascia, which carries the superficial temporal vessels.",
  },
  "h-parietal-scalp": {
    like: "fa-frontal-scalp",
    structures: ["a-sta", "a-occipital"],
    sensory: "Auriculotemporal (V3), lesser occipital (C2) and greater occipital (C2) nn.; deep branch of the supraorbital n. anteriorly.",
    artery: "Parietal branch of superficial temporal a.; occipital a. posteriorly.",
    lymph: "Parotid, postauricular (mastoid) and occipital nodes.",
  },
  "h-vertex-scalp": {
    like: "fa-frontal-scalp",
    structures: ["a-sta", "a-occipital", "c-greater-occipital"],
    sensory: "Watershed of supraorbital (V1), auriculotemporal (V3) and greater occipital (C2) nn. — a ring block is usually easier than named blocks.",
    artery: "Anastomosis of both superficial temporal and occipital systems.",
    lymph: "Unpredictable and often bilateral: parotid, postauricular and occipital nodes.",
  },
  "h-occipital-scalp": {
    like: "fa-frontal-scalp",
    structures: ["c-greater-occipital", "a-occipital", "c-lesser-occipital"],
    sensory: "Greater occipital n. (C2); lesser occipital n. laterally; third occipital n. (C3) near the midline at the nape.",
    artery: "Occipital a.",
    lymph: "Occipital and postauricular nodes, then posterior triangle (level V).",
    plane: "Subgaleal above the superior nuchal line. Below it the galea gives way to the nuchal muscles — stay in subcutaneous fat.",
  },

  // -------------------------------------------------------------------------
  // Forehead & temple
  // -------------------------------------------------------------------------
  "fa-central-forehead": {
    auc: "M",
    structures: ["v1-supratrochlear", "v1-supraorbital", "a-supraorbital"],
    sensory: "Supratrochlear n. medially, supraorbital n. laterally (V1). Supraorbital + supratrochlear blocks numb the forehead to the vertex.",
    artery: "Supratrochlear and supraorbital aa.",
    lymph: "Parotid (preauricular) nodes; the midline can drain to either side or to submandibular nodes.",
    plane: "Subcutaneous fat just above frontalis for small repairs; subgaleal (deep to frontalis) for large advancement flaps.",
    notes: [
      "Relaxed skin tension lines are horizontal, but the sensory nerves run vertically: a vertical closure near the midline spares them and heals well; long horizontal incisions down to muscle leave the scalp numb behind them.",
      "Keep the brows level and the hairline undistorted — brow elevation of a few millimetres usually settles; asymmetric pull does not.",
      "The deep branch of the supraorbital nerve runs under the galea 0.5–1.5 cm medial to the temporal crest.",
    ],
    repair: [
      "Primary closure: vertical in the midline or paramedian forehead, horizontal within a rhytid laterally.",
      "Unilateral or bilateral advancement (H-plasty, O–T / A–T with the bar hidden at the brow or hairline).",
      "Secondary intention for superficial wounds, especially at the hairline and temple junction.",
      "Full-thickness graft, or partial closure with guiding sutures and granulation, when tissue is short.",
    ],
  },
  "fa-lateral-forehead": {
    like: "fa-central-forehead",
    structures: ["v1-supraorbital", "vii-temporal", "a-supraorbital", "a-sta"],
    sensory: "Supraorbital n. (V1), superficial and deep divisions; zygomaticotemporal n. (V2) at the temporal edge.",
    artery: "Supraorbital a.; frontal branch of superficial temporal a.",
    lymph: "Parotid (preauricular) nodes.",
    alerts: ["Lateral to the mid-brow the temporal branch of the facial nerve enters frontalis from beneath — stay in the superficial fat."],
  },
  "fa-glabella": {
    auc: "H",
    aucNote: "central face (the forehead proper is area M)",
    structures: ["v1-supratrochlear", "a-dorsal-nasal", "v1-infratrochlear"],
    sensory: "Supratrochlear and infratrochlear nn. (V1).",
    artery: "Supratrochlear and dorsal nasal aa. (ophthalmic) — the origin of the paramedian forehead flap pedicle.",
    lymph: "Submandibular or parotid nodes.",
    plane: "Subcutaneous fat above procerus and corrugator.",
    notes: [
      "Thick, sebaceous skin with vertical and oblique frown lines to hide scars in.",
      "Avoid drawing the medial brows together or webbing the nasal root.",
      "Intravascular injection here can embolise to the ophthalmic circulation — aspirate and inject slowly.",
    ],
    repair: ["Primary closure, vertical.", "Secondary intention in the concavity towards the nasal root.", "Glabellar transposition or V–Y advancement for the nasal root.", "Full-thickness graft."],
  },
  "fa-temple": {
    auc: "H",
    alerts: ["Temporal branch of the facial nerve is superficial here — undermine above the superficial temporal fascia."],
    structures: ["vii-temporal", "a-sta", "v3-auriculotemporal", "v2-zygomaticotemporal"],
    sensory: "Zygomaticotemporal n. (V2) anteriorly, auriculotemporal n. (V3) posteriorly.",
    artery: "Superficial temporal a. (frontal branch); zygomatico-orbital branch.",
    lymph: "Parotid (preauricular) nodes.",
    plane: "Superficial subcutaneous fat, above the superficial temporal (temporoparietal) fascia. The nerve and the superficial temporal vessels lie in or just under that fascia.",
    notes: [
      "Layers: skin, thin fat, superficial temporal fascia (continuous with SMAS and galea), loose areolar tissue, deep temporal fascia, temporalis.",
      "The shiny white deep temporal fascia is a safe floor for deep tumour excision, but reaching it means the nerve's layer has been crossed.",
      "Tension on the temple pulls the lateral brow and lateral canthus; anchor flaps and keep vectors off them.",
    ],
    repair: [
      "Secondary intention — the concave temple heals with good contour, even for large wounds.",
      "Primary closure along the crow's-foot / forehead lines.",
      "Rotation or advancement from the cheek and preauricular skin; rhombic transposition; O–Z.",
      "Full-thickness graft for large defects.",
    ],
  },

  // -------------------------------------------------------------------------
  // Brow & eyelids
  // -------------------------------------------------------------------------
  "fa-eyebrow": {
    auc: "H",
    structures: ["v1-supraorbital", "v1-supratrochlear", "vii-temporal"],
    sensory: "Supraorbital and supratrochlear nn. (V1).",
    artery: "Supraorbital and supratrochlear aa.; superficial temporal a. laterally.",
    lymph: "Parotid nodes (lateral); submandibular nodes (medial).",
    plane: "Deep subcutaneous fat below the hair bulbs (they sit deep), above orbicularis and frontalis.",
    notes: [
      "Brow hairs grow obliquely: bevel the incision parallel to the shafts to avoid a hairless scar.",
      "Do not shave the brow — it is the alignment landmark and regrowth is unreliable.",
      "The supraorbital neurovascular bundle leaves the rim under the medial third of the brow.",
    ],
    repair: [
      "Primary closure within or along the brow; bilateral advancement flaps (O–T, H-plasty) to keep the hair-bearing line continuous.",
      "Island pedicle (V–Y) flap of remaining brow.",
      "Accept a narrower brow rather than a displaced one.",
    ],
  },
  "fa-upper-eyelid": {
    auc: "H",
    alerts: [FREE_MARGIN + ": lid margin — vertical tension causes lagophthalmos or ectropion."],
    structures: ["v1-supraorbital", "v1-supratrochlear", "lacrimal"],
    sensory: "Supraorbital, supratrochlear and infratrochlear nn. medially, lacrimal n. laterally (all V1).",
    artery: "Medial and lateral palpebral aa. forming the marginal and peripheral arcades.",
    lymph: "Lateral two-thirds to parotid (preauricular) nodes; medial third to submandibular nodes.",
    plane: "Directly beneath the skin, above orbicularis — there is no subcutaneous fat. Skin–muscle flaps are raised beneath orbicularis.",
    notes: [
      "Lamellae: anterior (skin and orbicularis) and posterior (tarsus and conjunctiva). The upper tarsus is 10 mm high, the lower 4 mm.",
      "The levator aponeurosis inserts on the upper tarsus and into the lid crease; dividing it causes ptosis.",
      "Orient closures so tension runs parallel to the lid margin. Protect the cornea (shield, ointment) and use bipolar cautery.",
      "Lax lid skin bruises and swells readily; lidocaine with adrenaline in small volumes.",
    ],
    repair: [
      "Primary closure, horizontal, in the lid crease.",
      "Full-thickness graft from the opposite upper lid (best match) or postauricular skin.",
      "Full-thickness margin defects: direct layered closure up to about a quarter of the lid (a third in lax elderly lids), with lateral canthotomy and cantholysis if tight; larger defects need a Tenzel semicircular flap or a lid-sharing procedure (Cutler–Beard) — oculoplastic surgery.",
    ],
  },
  "fa-lower-eyelid": {
    auc: "H",
    alerts: [FREE_MARGIN + ": lid margin — any vertical tension causes ectropion."],
    structures: ["v2-infraorbital", "lacrimal", "a-angular"],
    sensory: "Infraorbital n. (V2); infratrochlear n. medially; zygomaticofacial n. laterally.",
    artery: "Medial and lateral palpebral aa. (marginal arcade about 2 mm from the lid margin); angular and infraorbital aa.",
    lymph: "Lateral two-thirds to parotid (preauricular) nodes; medial third to submandibular nodes.",
    plane: "Directly beneath the skin, above orbicularis; or beneath orbicularis for a skin–muscle flap.",
    notes: [
      "Test lid laxity before surgery (snap-back and distraction tests); a lax lid needs tightening (lateral canthopexy or tarsal strip) with the repair.",
      "Plan every closure so the tension vector is horizontal; sit the patient up, looking up with the mouth open, to check for pull before tying.",
      "Suspend cheek flaps to the periosteum of the lateral orbital rim so that their weight is not carried by the lid. A Frost suture supports the lid for the first days.",
      "The lower tarsus is only 4 mm high; the orbital septum and fat lie just beneath orbicularis.",
    ],
    repair: [
      "Primary closure with the long axis parallel to the margin, or perpendicular to it as a wedge when laxity is the aim.",
      "Full-thickness graft (upper lid, postauricular) — oversize it slightly.",
      "Laterally based advancement or rotation flaps (Tenzel, Mustardé cheek rotation); upper-lid transposition (Tripier) flap.",
      "Full-thickness margin defects: direct closure up to a quarter to a third of the lid; larger defects need a tarsoconjunctival (Hughes) flap or similar — oculoplastic surgery.",
    ],
  },
  "fa-medial-canthus": {
    auc: "H",
    alerts: ["Lacrimal canaliculi and medial canthal tendon lie just under the skin.", "Embryonic fusion plane — tumours here can extend deeply towards the orbit."],
    structures: ["lacrimal", "a-angular", "a-dorsal-nasal", "v1-infratrochlear"],
    sensory: "Infratrochlear n. (V1); infraorbital n. (V2) inferiorly.",
    artery: "Angular a. meeting the dorsal nasal a.; medial palpebral aa.",
    lymph: "Submandibular nodes.",
    plane: "Subcutaneous, directly on orbicularis and the medial canthal tendon. The angular vessels cross the tendon.",
    notes: [
      "The lacrimal sac lies behind the medial canthal tendon; canaliculi run in the lid margins medial to the puncta.",
      "Linear scars across the concavity bow-string into a web — break them up or let the wound granulate.",
      "Recurrent or deep tumours can track along periosteum and the lacrimal system; consider imaging.",
    ],
    repair: [
      "Secondary intention — excellent in this concavity, provided the wound is balanced above and below the tendon.",
      "Full-thickness graft (upper lid, postauricular).",
      "Glabellar transposition or rotation flap; rhombic flap; upper-lid skin–muscle transposition.",
    ],
  },
  "fa-lateral-canthus": {
    auc: "H",
    structures: ["vii-zygomatic", "vii-temporal", "v2-zygomaticofacial", "v2-zygomaticotemporal"],
    sensory: "Lacrimal n. (V1); zygomaticofacial and zygomaticotemporal nn. (V2).",
    artery: "Lateral palpebral aa.; zygomatico-orbital branch of superficial temporal a.",
    lymph: "Parotid (preauricular) nodes.",
    plane: "Superficial subcutaneous, above orbicularis oculi.",
    notes: [
      "The lateral canthal tendon inserts on Whitnall's tubercle inside the orbital rim; re-suspend it if divided.",
      "Zygomatic and temporal rami enter orbicularis from its deep surface just lateral to the rim.",
      "Crow's-foot lines radiate from the canthus and hide scars well.",
    ],
    repair: ["Primary closure along a crow's-foot line.", "Rhombic transposition or advancement from the temple and cheek.", "Full-thickness graft; secondary intention for small superficial wounds."],
  },

  // -------------------------------------------------------------------------
  // Nose
  // -------------------------------------------------------------------------
  "fa-nasal-root": {
    auc: "H",
    structures: ["a-dorsal-nasal", "v1-infratrochlear", "a-angular"],
    sensory: "Infratrochlear and supratrochlear nn. (V1).",
    artery: "Dorsal nasal a.; angular a.",
    lymph: "Submandibular nodes.",
    plane: "Beneath the nasal SMAS (procerus), just above periosteum — the avascular plane of the nose.",
    notes: ["Thin, mobile skin over the nasal bones; the concavity between glabella and dorsum heals well by granulation.", "Avoid webbing between the medial canthi and narrowing the inter-brow distance."],
    repair: ["Primary closure (vertical or horizontal in the transverse root crease).", "Secondary intention.", "Glabellar V–Y or transposition flap.", "Full-thickness graft."],
  },
  "fa-nasal-dorsum": {
    auc: "H",
    structures: ["v1-external-nasal", "a-dorsal-nasal"],
    sensory: "Infratrochlear n. above; external nasal n. (anterior ethmoidal, V1) below the rhinion.",
    artery: "Dorsal nasal a.; lateral nasal a. (from angular); external nasal a.",
    lymph: "Submandibular nodes.",
    plane: "Beneath the nasal SMAS (nasalis), just above perichondrium and periosteum. Vessels and nerves run above this plane, in or over the muscle.",
    notes: [
      "Skin is thin and mobile over the bony upper two-thirds, thicker and sebaceous towards the tip.",
      "Burget & Menick subunit principle: if a defect takes up more than half of a convex subunit, consider resurfacing the whole subunit.",
    ],
    repair: [
      "Primary closure, vertical in the midline (small defects).",
      "Dorsal nasal (Rieger) rotation flap for defects of the lower dorsum and tip up to about 2 cm.",
      "Bilobed or rhombic transposition flap; full-thickness graft over intact perichondrium.",
    ],
  },
  "fa-nasal-sidewall": {
    auc: "H",
    structures: ["a-angular", "v2-infraorbital", "v1-infratrochlear"],
    sensory: "Infratrochlear n. (upper), infraorbital n. (lower).",
    artery: "Angular a. and its lateral nasal branch; dorsal nasal a.",
    lymph: "Submandibular nodes.",
    plane: "Beneath the nasal SMAS on the nose; when recruiting cheek skin, subcutaneous fat on the cheek side.",
    notes: [
      "Do not tent across the nasofacial sulcus: tack the flap down to periosteum to re-create it.",
      "The lower sidewall overlies the internal nasal valve — downward or inward pull, or loss of support, can collapse it. Check breathing before closing.",
      "Upward or medial pull near the medial canthus and lower lid causes ectropion.",
    ],
    repair: [
      "Primary closure parallel to the nasofacial sulcus.",
      "Secondary intention in the concave upper sidewall near the canthus.",
      "Cheek advancement (Burow's) flap; V–Y island pedicle flap.",
      "Rhombic or bilobed transposition; full-thickness graft.",
    ],
  },
  "fa-nasal-supratip": {
    like: "fa-nasal-tip",
    notes: [
      "The supratip is the dorsum just above the domes, where the dorsal septum and upper lateral cartilages meet the lower lateral cartilages.",
      "Thick sebaceous skin with little spare laxity; closure tension here lifts the tip or flares the alae.",
      "Dead space or bulky flaps here produce a 'polly-beak' fullness.",
    ],
  },
  "fa-nasal-tip": {
    auc: "H",
    structures: ["v1-external-nasal", "a-angular"],
    sensory: "External nasal n. (V1); infraorbital n. (V2) laterally. Tip anaesthesia needs an external nasal block or local infiltration.",
    artery: "Lateral nasal aa. (from angular) and columellar aa. (from superior labial) forming the tip arcade; external nasal a.",
    lymph: "Submandibular nodes.",
    plane: "Beneath the nasal SMAS, on the perichondrium of the lower lateral cartilages.",
    notes: [
      "Thick, sebaceous, immobile skin bound to the alar cartilages — almost no local laxity.",
      "Grafts tend to heal depressed and shiny on sebaceous tips; dermabrasion at 6–8 weeks improves the match.",
      "Replace lost cartilage support (conchal or septal graft) before resurfacing.",
    ],
    repair: [
      "Bilobed transposition flap (Zitelli design) for defects up to about 1.5 cm on the distal third; trilobed flap for more distal or larger defects.",
      "East–west (horizontal advancement) flap for small midline or paramedian defects.",
      "Dorsal nasal (Rieger) rotation flap up to about 2 cm.",
      "Full-thickness graft (preauricular, conchal bowl, or a Burow's graft).",
      "Paramedian forehead flap for large or deep defects, or when cartilage must be replaced.",
    ],
  },
  "fa-nasal-infratip": {
    like: "fa-nasal-tip",
    alerts: [FREE_MARGIN + ": nostril rim — notching and asymmetry are obvious from below."],
    notes: [
      "The infratip lobule runs from the tip-defining points down to the columella, between the soft triangles.",
      "Skin is thin and adherent to the medial and middle crura.",
    ],
    repair: ["Full-thickness graft or composite graft.", "Secondary intention for small superficial wounds.", "Bilateral advancement of the remaining tip skin; paramedian forehead flap for large defects."],
  },
  "fa-nasal-ala": {
    auc: "H",
    alerts: [FREE_MARGIN + ": alar rim — contraction causes notching or elevation.", "Embryonic fusion plane at the alar crease — tumours can extend deeply."],
    structures: ["a-angular", "v2-infraorbital"],
    sensory: "Infraorbital n. (V2); external nasal n. medially.",
    artery: "Lateral nasal a. (runs in or just above the alar groove) and the superior alar branch, from the angular a.",
    lymph: "Submandibular nodes.",
    plane: "Beneath the nasal SMAS medially. The alar lobule itself has no cartilage — it is fibrofatty tissue bonded to the skin, so there is no real plane.",
    notes: [
      "The ala keeps its shape by its fibrofatty bulk; deep defects need a non-anatomic cartilage batten (conchal) to prevent rim retraction and external valve collapse.",
      "Preserve or re-create the alar groove and the alar-facial sulcus; flaps crossing them blunt the nose.",
      "Do not push the ala medially (obstructs the airway) or pull it up.",
    ],
    repair: [
      "Secondary intention for small, superficial wounds well away from the rim, especially in the alar groove.",
      "Full-thickness graft (preauricular or conchal bowl skin).",
      "Bilobed or trilobed flap for the medial ala; V–Y island pedicle from the sidewall or cheek for the lateral ala.",
      "Melolabial (nasolabial) transposition flap, single stage — tends to blunt the groove.",
      "Melolabial interpolation flap in two stages for whole-subunit or deep defects, with a cartilage batten.",
      "Composite graft from the helical root for small full-thickness rim defects (up to about 1 cm).",
    ],
  },
  "fa-soft-triangle": {
    auc: "H",
    alerts: [FREE_MARGIN + ": the soft triangle has no cartilage and notches easily."],
    structures: ["v1-external-nasal"],
    sensory: "External nasal n. (V1); infraorbital n. (V2).",
    artery: "Tip arcade (lateral nasal and columellar aa.).",
    lymph: "Submandibular nodes.",
    plane: "None — external skin lies directly on vestibular skin, with no cartilage between.",
    notes: ["Any contraction shows as a notch in the nostril rim.", "Keep sutures and cautery away from the rim where possible."],
    repair: ["Secondary intention for small superficial wounds.", "Full-thickness or composite graft.", "Larger defects are repaired as part of a tip or ala reconstruction."],
  },
  "fa-columella": {
    auc: "H",
    structures: ["a-labial"],
    sensory: "External nasal n. (V1) above; infraorbital n. (V2) and nasopalatine branches at the base.",
    artery: "Columellar aa. from the superior labial a.",
    lymph: "Submandibular nodes.",
    plane: "Directly on the medial crura — skin is thin and adherent.",
    notes: ["The columellar arteries run vertically either side of the midline.", "Loss of columellar height drops the tip; scarring at the base distorts the nasolabial angle."],
    repair: ["Full-thickness graft; composite graft from the ear.", "Secondary intention for small wounds.", "Bilateral melolabial or upper-lip flaps, or a forehead flap, for total loss."],
  },
  "fa-nasal-vestibule": {
    auc: "H",
    alerts: [FREE_MARGIN + ": nostril sill and rim."],
    structures: ["a-labial", "v2-infraorbital"],
    sensory: "Infraorbital n. (V2); nasopalatine and anterior ethmoidal branches inside.",
    artery: "Superior labial a. (septal and alar branches); lateral nasal a.",
    lymph: "Submandibular nodes.",
    plane: "Vestibular skin is bound to the alar cartilage and sill.",
    notes: [
      "The nostril sill is the ridge between the alar base and the columella, at the junction of nose and lip.",
      "Circumferential scarring narrows the nostril (vestibular stenosis) — consider a stent after repair.",
      "Hair-bearing vestibular skin (vibrissae) changes to mucosa at the limen nasi.",
    ],
    repair: ["Secondary intention for small sill wounds.", "Full-thickness graft.", "Upper-lip advancement or island flap to rebuild the sill; composite graft for lining plus cover."],
  },

  // -------------------------------------------------------------------------
  // Cheek
  // -------------------------------------------------------------------------
  "fa-medial-cheek": {
    auc: "M",
    alerts: ["Tension towards the lower eyelid causes ectropion — keep vectors horizontal and suspend flaps to periosteum."],
    structures: ["v2-infraorbital", "a-angular", "a-facial", "vii-zygomatic", "vii-buccal"],
    sensory: "Infraorbital n. (V2).",
    artery: "Angular and infraorbital aa.; transverse facial a.",
    lymph: "Submandibular nodes (some via facial / buccinator nodes); upper lateral part to parotid nodes.",
    plane: "Mid-subcutaneous fat, above the SMAS and the mimetic muscles.",
    notes: [
      "The infraorbital foramen lies under this subunit, deep to levator labii superioris.",
      "Hide scars in the nasofacial sulcus, the melolabial fold and the lid–cheek junction.",
      "Medial to the lateral canthus the facial nerve branches are small and interconnected; the main risks here are the eyelid, the angular vessels and the infraorbital nerve.",
    ],
    repair: [
      "Primary closure along relaxed skin tension lines, with the scar in or parallel to the melolabial fold.",
      "Cheek advancement flap with a Burow's triangle in the nasofacial sulcus or along the lid.",
      "V–Y island pedicle flap for defects beside the ala and upper lip.",
      "Cheek rotation (Mustardé) flap for large infraorbital defects; full-thickness graft if needed.",
    ],
  },
  "fa-zygomatic-cheek": {
    auc: "M",
    alerts: ["Zygomatic branches of the facial nerve cross the malar eminence under thin fat.", "Upward-lateral repairs can still pull on the lower lid."],
    structures: ["vii-zygomatic", "zone-midcheek", "vii-temporal", "v2-zygomaticofacial"],
    sensory: "Zygomaticofacial n. (V2); infraorbital n. (V2).",
    artery: "Transverse facial a.; zygomatico-orbital a.",
    lymph: "Parotid (preauricular) nodes.",
    plane: "Subcutaneous fat above the SMAS. The fat is thin over the bone and the zygomatic retaining ligaments tether the skin here.",
    notes: ["The zygomatic arch's upper border marks where the temporal branch starts its superficial course.", "Release of the zygomatic retaining ligaments adds flap mobility but brings dissection close to the zygomatic branches."],
    repair: ["Primary closure along crow's-foot and cheek lines.", "Rhombic transposition; rotation or advancement from the lateral cheek.", "Full-thickness graft."],
  },
  "fa-lateral-cheek": {
    auc: "H",
    aucNote: "periauricular skin",
    alerts: ["Embryonic fusion plane at the preauricular sulcus — tumours can track deeply towards the parotid and ear canal."],
    structures: ["parotid", "a-sta", "v3-auriculotemporal", "vii-trunk", "c-great-auricular"],
    sensory: "Auriculotemporal n. (V3) above; great auricular n. (C2–C3) below.",
    artery: "Superficial temporal a. and its transverse facial branch.",
    lymph: "Parotid (preauricular) nodes.",
    plane: "Subcutaneous fat above the parotid fascia (SMAS). The facial nerve branches are inside the gland and safe while its fascia is intact.",
    notes: [
      "The best reservoir of lax skin on the face — and a good full-thickness graft donor site.",
      "The superficial temporal pulse and auriculotemporal nerve are just in front of the tragus and helical root.",
      "Avoid moving bearded sideburn skin on to the ear, or removing the sideburn.",
    ],
    repair: ["Primary closure in the preauricular crease (vertical).", "Advancement or rotation from the cheek and neck.", "Secondary intention or graft only when necessary."],
  },
  "fa-buccal-cheek": {
    auc: "M",
    structures: ["zone-midcheek", "vii-buccal", "parotid-duct", "a-facial", "vii-marginal"],
    sensory: "Buccal n. (V3) and infraorbital n. (V2); mental n. inferiorly; great auricular n. posteriorly.",
    artery: "Facial a. and transverse facial a.",
    lymph: "Submandibular nodes; posterior part to parotid nodes.",
    plane: "Mid-subcutaneous fat, above the SMAS.",
    notes: [
      "Anterior to the parotid and masseter the buccal branches and the parotid duct lie on the buccal fat pad under a thin SMAS.",
      "Thick, mobile skin with a good blood supply: large flaps survive well.",
      "The mandibular retaining ligament and the masseteric ligaments limit advancement.",
    ],
    repair: ["Primary closure along the curved relaxed skin tension lines.", "Rhombic or other transposition flaps.", "Rotation or advancement flaps based inferiorly and laterally; cervicofacial flap for large defects."],
  },
  "fa-melolabial-fold": {
    auc: "M",
    aucNote: "cheek; the adjacent ala and lip are area H",
    alerts: ["Embryonic fusion plane at the alar-facial junction — tumours can extend deeply."],
    structures: ["a-facial", "a-angular", "a-labial", "v2-infraorbital"],
    sensory: "Infraorbital n. (V2).",
    artery: "Facial a. running just deep and lateral to the fold, becoming the angular a. at the alar base.",
    lymph: "Submandibular nodes.",
    plane: "Subcutaneous fat. The lip elevators insert into the dermis along the fold, so fat is thin medially and thick laterally.",
    notes: ["Keep the two folds symmetric: a scar in the fold is invisible, one that crosses or flattens it is not.", "Donor site for melolabial transposition and interpolation flaps, supplied by perforators of the facial and angular arteries."],
    repair: ["Primary closure in the fold.", "V–Y island pedicle flap.", "Cheek advancement with the scar placed in the fold."],
  },

  // -------------------------------------------------------------------------
  // Lips
  // -------------------------------------------------------------------------
  "fa-philtrum": {
    auc: "H",
    alerts: [FREE_MARGIN + ": vermilion border and Cupid's bow — mark them before infiltrating.", "Embryonic fusion plane."],
    structures: ["a-labial", "v2-infraorbital"],
    sensory: "Infraorbital nn. (V2), both sides.",
    artery: "Superior labial a.; its columellar and septal branches.",
    lymph: "Submandibular nodes; midline lesions may drain to both sides.",
    plane: "Just above orbicularis oris, in the thin subcutaneous fat. Muscle fibres insert into the dermis.",
    notes: ["Philtral columns and dimple are hard to re-create; keep vertical scars on a column.", "A 1 mm step in the vermilion border is visible at conversational distance."],
    repair: ["Primary closure, vertical, on a philtral column.", "Full-thickness graft of the whole philtral subunit; secondary intention for small central wounds.", "Bilateral advancement; Abbe flap for full-thickness loss."],
  },
  "fa-lateral-upper-lip": {
    auc: "H",
    alerts: [FREE_MARGIN + ": vermilion border — mark it before infiltrating; avoid pulling the lip up."],
    structures: ["a-labial", "v2-infraorbital", "a-facial", "vii-buccal"],
    sensory: "Infraorbital n. (V2). An infraorbital block numbs the hemi-lip.",
    artery: "Superior labial a.",
    lymph: "Submandibular nodes.",
    plane: "Just above orbicularis oris.",
    notes: [
      "Relaxed skin tension lines are vertical (radial to the mouth).",
      "Keep scars within the subunit: do not cross the melolabial fold or the philtral column if it can be avoided.",
      "Men: move hair-bearing skin only on to hair-bearing sites.",
    ],
    repair: [
      "Primary closure, vertical; a crescentic perialar excision lets the lip advance beneath the ala.",
      "V–Y island pedicle flap from the lateral lip and cheek.",
      "Rotation flap along the melolabial fold; full-thickness graft for superficial apical-triangle defects.",
      "Full-thickness defects: wedge up to a third of the lip; Abbe (lip-switch) flap for a third to two-thirds; Karapandzic or other circumoral flaps beyond that.",
    ],
  },
  "fa-upper-vermilion": {
    auc: "H",
    alerts: [FREE_MARGIN + ": mark the vermilion border before infiltrating."],
    structures: ["a-labial", "v2-infraorbital"],
    sensory: "Infraorbital nn. (V2).",
    artery: "Superior labial a. — between orbicularis and mucosa at about the level of the vermilion border.",
    lymph: "Submandibular nodes.",
    plane: "Submucosal, above orbicularis oris, for mucosal advancement.",
    notes: ["Vermilion is modified mucosa with no hair or sweat glands; the wet–dry line separates it from labial mucosa.", "Squamous cell carcinoma of the lip carries a higher metastatic risk than at most skin sites — examine the neck."],
    repair: ["Secondary intention for small superficial defects.", "Primary closure perpendicular to the border.", "Mucosal advancement flap (after vermilionectomy); V–Y mucosal advancement.", "Wedge excision or lip-switch flap for full-thickness loss."],
  },
  "fa-lower-vermilion": {
    like: "fa-upper-vermilion",
    structures: ["a-labial", "v3-mental"],
    sensory: "Mental nn. (V3). Bilateral mental blocks numb the whole lower lip.",
    artery: "Inferior labial a.",
    lymph: "Central third to submental nodes (either side); lateral thirds to submandibular nodes.",
    notes: [
      "The usual site of actinic cheilitis and lip squamous cell carcinoma; examine the submental and submandibular nodes.",
      "Mental nerve branches run just under the mucosa of the lower lip.",
    ],
    repair: [
      "Secondary intention for small superficial defects.",
      "Vermilionectomy with mucosal advancement flap for field disease.",
      "Wedge excision (up to a third, sometimes half, of the lower lip), closed in layers: mucosa, muscle, skin, with the vermilion border aligned first.",
      "Larger: Abbe / Estlander lip-switch, Karapandzic, or Bernard–Burow advancement.",
    ],
  },
  "fa-oral-commissure": {
    auc: "H",
    alerts: [FREE_MARGIN + ": commissure — blunting or displacement affects speech, eating and symmetry."],
    structures: ["a-facial", "a-labial", "vii-buccal", "vii-marginal"],
    sensory: "Infraorbital n. (V2), mental n. (V3) and buccal n. (V3).",
    artery: "Facial a. about 1.5 cm lateral to the commissure, where the labial arteries arise.",
    lymph: "Submandibular nodes.",
    plane: "Subcutaneous, above the modiolus (where orbicularis, the zygomatic muscles, risorius, buccinator and the depressors converge).",
    notes: ["Avoid circumferential scars that cause microstomia.", "The modiolus is the motor hub of the smile; deep excisions change its dynamics."],
    repair: ["Primary closure along a radial line.", "Secondary intention for small partial-thickness wounds.", "Rhombic or V–Y flaps from the cheek; Estlander flap for full-thickness defects involving the commissure."],
  },
  "fa-lower-lip": {
    auc: "H",
    alerts: [FREE_MARGIN + ": vermilion border — avoid downward pull (eversion, incompetence)."],
    structures: ["v3-mental", "a-labial", "vii-marginal"],
    sensory: "Mental n. (V3).",
    artery: "Inferior labial a.; mental a.",
    lymph: "Submental nodes centrally; submandibular nodes laterally.",
    plane: "Just above orbicularis oris and the lip depressors.",
    notes: ["Relaxed skin tension lines are vertical on the lip and curve around the chin; the labiomental crease is a natural boundary for scars and flaps.", "Lower-lip function (oral competence) depends on the depressors supplied by the marginal mandibular nerve."],
    repair: ["Primary closure, vertical, not crossing the labiomental crease if possible (use an M-plasty).", "V–Y island pedicle or bilateral advancement along the crease.", "Wedge excision for full-thickness defects, as for the vermilion."],
  },

  // -------------------------------------------------------------------------
  // Chin & jaw
  // -------------------------------------------------------------------------
  "fa-chin": {
    auc: "H",
    structures: ["v3-mental", "vii-marginal"],
    sensory: "Mental nn. (V3); a twig of the mylohyoid n. under the chin.",
    artery: "Mental a., inferior labial a., submental a.",
    lymph: "Submental nodes; submandibular nodes laterally.",
    plane: "Subcutaneous fat above mentalis — thick, fibrous skin with muscle fibres inserting into the dermis.",
    notes: ["Thick sebaceous skin under constant movement: scars tend to spread or pin-cushion. Evert carefully and support with buried sutures.", "The mental foramen lies under the lateral edge of the chin subunit."],
    repair: ["Primary closure along the labiomental crease or vertically in the midline.", "O–T / A–T advancement with the bar in the labiomental crease or submental crease.", "Rotation flap along the chin border; secondary intention for small wounds."],
  },
  "fa-jawline": {
    auc: "M",
    alerts: ["Marginal mandibular nerve crosses the facial vessels at the anterior border of masseter — stay above platysma."],
    structures: ["vii-marginal", "a-facial", "v3-mental", "vii-cervical"],
    sensory: "Mental n. and buccal n. (V3) anteriorly; great auricular n. (C2–C3) at the angle.",
    artery: "Facial a. and its submental branch.",
    lymph: "Submandibular nodes; parotid tail / upper jugular (level II) nodes near the angle.",
    plane: "Subcutaneous fat above platysma and the SMAS.",
    notes: ["Feel for the facial artery pulse at the antegonial notch before you start; the nerve crosses there.", "In thin, elderly patients platysma may be only a few fibres thick.", "The mandibular border hides scars well."],
    repair: ["Primary closure along the jawline.", "Advancement or rotation from the lax neck and lower cheek."],
  },
  "h-submental": {
    auc: "M",
    aucNote: "neck",
    structures: ["vii-marginal", "vii-cervical"],
    sensory: "Transverse cervical n. (C2–C3); mylohyoid n. twig.",
    artery: "Submental a. (from the facial a.).",
    lymph: "Submental nodes (level Ia).",
    plane: "Subcutaneous fat above platysma. In the midline the platysma may be deficient and the anterior jugular veins are superficial.",
    repair: ["Primary closure in the submental crease or along horizontal neck lines."],
  },

  // -------------------------------------------------------------------------
  // Ear
  // -------------------------------------------------------------------------
  "fa-ear": {
    auc: "H",
    structures: ["c-great-auricular", "v3-auriculotemporal", "a-sta", "a-posterior-auricular"],
    sensory:
      "Great auricular n. (C2–C3): lower two-thirds, front and back, and the lobule. Auriculotemporal n. (V3): anterosuperior ear, tragus, helical root. Lesser occipital n. (C2): upper cranial surface. Concha and canal: auricular branch of the vagus (Arnold's n.) with contributions from VII and IX.",
    artery: "Superficial temporal a. (anterior auricular branches) and posterior auricular a., joined by perforators through the cartilage.",
    lymph: "Anterior surface and tragus to parotid (preauricular) nodes; posterior surface and helix to postauricular (mastoid) nodes; lobule to infra-auricular / upper jugular (level II) nodes.",
    plane: "Just above perichondrium. On the lateral surface the skin is thin and tightly bound to cartilage; on the cranial surface there is a mobile subcutaneous layer.",
    notes: [
      "Ring block: infiltrate around the base of the ear (above, in front of and behind). The concha and canal need separate local infiltration.",
      "Cartilage is avascular and depends on perichondrium — a graft needs intact perichondrium, or cartilage windows through to the posterior soft tissue.",
      "Keep the wound moist; chondritis is painful and slow to settle. Squamous cell carcinoma of the ear has a higher metastatic risk than at most skin sites.",
      "Double-click the ear for its subunits.",
    ],
    repair: ["Secondary intention where perichondrium is intact.", "Full-thickness graft.", "Wedge excision or helical rim advancement for rim defects.", "Staged postauricular flaps for larger helical and antihelical defects."],
  },
  "h-posterior-auricle": {
    like: "fa-ear",
    structures: ["a-posterior-auricular", "c-great-auricular", "c-lesser-occipital"],
    sensory: "Great auricular n. (lower two-thirds); lesser occipital n. (upper third).",
    artery: "Posterior auricular a.",
    lymph: "Postauricular (mastoid) nodes.",
    plane: "Subcutaneous, above perichondrium — the skin here is looser than on the lateral surface.",
    notes: ["Good donor site for full-thickness grafts (with the postauricular sulcus) and for cartilage.", "Wounds here heal well by secondary intention and are hidden."],
    repair: ["Primary closure, vertical.", "Secondary intention.", "Full-thickness graft; advancement from the mastoid skin (can pin the ear back)."],
  },
  "h-postauricular": {
    auc: "H",
    aucNote: "periauricular skin and sulcus",
    alerts: ["Embryonic fusion plane at the postauricular sulcus — tumours can extend deeply."],
    structures: ["c-great-auricular", "c-lesser-occipital", "a-posterior-auricular", "vii-trunk"],
    sensory: "Lesser occipital n. (C2) and great auricular n. (C2–C3).",
    artery: "Posterior auricular a.; occipital a.",
    lymph: "Postauricular (mastoid) nodes, then level II and level V.",
    plane: "Subcutaneous fat above the mastoid fascia and the sternocleidomastoid insertion.",
    notes: [
      "Donor site for full-thickness grafts and staged (interpolation) flaps to the helix and antihelix.",
      "The facial nerve trunk leaves the skull just anterior to the mastoid tip, deep to the lobule — superficial in young children.",
    ],
    repair: ["Primary closure in or parallel to the sulcus.", "Secondary intention.", "Full-thickness graft; scalp or neck rotation flap."],
  },
  "ear-helix": {
    like: "fa-ear",
    alerts: [FREE_MARGIN + ": helical rim — notching and loss of height are noticeable."],
    structures: ["a-posterior-auricular", "a-sta"],
    notes: [
      "Skin is thin and adherent anteriorly, looser on the back of the rim.",
      "Ear height can drop by about 1.5 cm before asymmetry is obvious to others.",
      "Cartilage struts that stick up beyond the skin edge should be trimmed back to prevent chondritis.",
    ],
    repair: [
      "Secondary intention where perichondrium is intact; full-thickness graft.",
      "Wedge excision for defects up to about 1.5 cm, with star-shaped (Burow's) extensions into the antihelix to prevent cupping.",
      "Helical rim (chondrocutaneous) advancement flap, Antia–Buch, for defects up to about 2–2.5 cm.",
      "Staged postauricular interpolation (pedicle or tubed) flap, with cartilage graft if needed, for larger defects.",
    ],
  },
  "ear-helical-root": {
    like: "ear-helix",
    structures: ["a-sta", "v3-auriculotemporal"],
    alerts: [],
    notes: ["The crus of the helix divides the concha into cymba and cavum.", "Donor site for composite grafts to the alar rim.", "The superficial temporal vessels and auriculotemporal nerve run just in front."],
    repair: ["Secondary intention.", "Full-thickness graft.", "Preauricular transposition or advancement flap."],
  },
  "ear-scapha": {
    like: "fa-ear",
    structures: [],
    notes: ["A concavity: heals well by secondary intention if perichondrium is intact.", "If cartilage is bare, remove it or punch windows through it so that granulation can come from the posterior skin."],
    repair: ["Secondary intention.", "Full-thickness graft.", "Postauricular pull-through or interpolation flap for large defects."],
  },
  "ear-antihelix": {
    like: "ear-scapha",
    notes: ["A convex ridge: grafts take well on perichondrium; without it, remove the cartilage beneath a small defect or use a flap.", "The antihelix provides most of the ear's structural support."],
    repair: ["Full-thickness graft.", "Secondary intention.", "Postauricular pull-through (revolving-door) island flap; staged postauricular flap."],
  },
  "ear-superior-crus": { like: "ear-antihelix" },
  "ear-inferior-crus": { like: "ear-antihelix" },
  "ear-triangular-fossa": { like: "ear-scapha" },
  "ear-cymba": {
    like: "fa-ear",
    structures: [],
    sensory: "Auricular branch of the vagus (Arnold's n.) with facial and glossopharyngeal twigs; great auricular and auriculotemporal nn. at the edges. Not covered by a ring block — infiltrate locally.",
    notes: [
      "Conchal bowl skin is a good full-thickness graft donor for the nasal tip and ala; conchal cartilage is the usual donor for alar battens.",
      "Stimulating the vagal branch can provoke coughing or, rarely, a vasovagal episode.",
      "Bare cartilage: excise it (the ear keeps its shape as long as the antihelix and helical root are preserved) so the wound granulates or accepts a graft from the posterior skin.",
    ],
    repair: ["Secondary intention.", "Full-thickness or split-thickness graft, often with a bolster.", "Postauricular pull-through (revolving-door) island flap for large or full-thickness defects."],
  },
  "ear-cavum": { like: "ear-cymba" },
  "ear-meatus": {
    like: "ear-cymba",
    alerts: ["Circumferential wounds of the canal contract — canal stenosis."],
    notes: [
      "The outer third of the canal is cartilaginous with hair and ceruminous glands; the inner two-thirds is bony with very thin skin.",
      "Tumour at the meatus can track along the canal and through the fissures of Santorini to the parotid; consider imaging and ENT review.",
      "Stent or pack the canal after grafting.",
    ],
    repair: ["Secondary intention for partial-circumference wounds.", "Split- or full-thickness graft over a stent.", "ENT referral for deep canal involvement."],
  },
  "ear-tragus": {
    like: "fa-ear",
    structures: ["a-sta", "v3-auriculotemporal", "vii-trunk", "parotid"],
    sensory: "Auriculotemporal n. (V3).",
    lymph: "Parotid (preauricular) nodes.",
    notes: [
      "The tragal pointer (medial tip of the tragal cartilage) points towards the facial nerve trunk, about 1 cm deep and anteroinferior to it.",
      "Tumours here can track down the pretragal fusion plane to the parotid and canal.",
      "Tragal cartilage is a small graft donor.",
    ],
    repair: ["Primary closure in the pretragal crease.", "Preauricular advancement or transposition flap.", "Full-thickness graft; secondary intention."],
  },
  "ear-antitragus": {
    like: "fa-ear",
    structures: ["c-great-auricular"],
    sensory: "Great auricular n. (C2–C3).",
    repair: ["Secondary intention.", "Full-thickness graft.", "Primary closure or small wedge."],
  },
  "ear-lobule": {
    like: "fa-ear",
    structures: ["c-great-auricular", "vii-trunk"],
    sensory: "Great auricular n. (C2–C3).",
    lymph: "Infra-auricular parotid and upper jugular (level II) nodes.",
    plane: "No cartilage — fibrofatty tissue only.",
    notes: ["Lax and forgiving; up to half can be removed and closed directly.", "Avoid a notch at the free edge: evert the closure or use a small Z-plasty at the rim.", "The facial nerve trunk and parotid tail lie deep to the lobule's attachment."],
    repair: ["Wedge excision with primary closure.", "Secondary intention for small wounds.", "Bilobed or folded flap from postauricular or infra-auricular skin for lobule reconstruction."],
  },

  // -------------------------------------------------------------------------
  // Neck
  // -------------------------------------------------------------------------
  "fa-anterior-neck": {
    auc: "M",
    structures: ["c-transverse-cervical", "vii-cervical"],
    sensory: "Transverse cervical n. (C2–C3).",
    artery: "Superior thyroid, submental and transverse cervical branches via platysmal perforators.",
    lymph: "Anterior cervical and jugular chain nodes (levels I–IV, VI).",
    plane: "Superficial fat above platysma. The anterior jugular veins run beneath platysma close to the midline.",
    notes: ["Relaxed skin tension lines are horizontal; vertical scars over the neck contract into bands or webs.", "Thin, lax skin: plenty of movement, but hypertrophic scars are common low on the neck and over the sternal notch."],
    repair: ["Primary closure in a horizontal neck crease.", "Advancement or rotation flaps; Z-plasty to break up vertical scars."],
  },
  "h-submandibular": {
    auc: "M",
    alerts: ["Marginal mandibular nerve can lie up to 1–2 cm below the mandibular border here, just under platysma."],
    structures: ["vii-marginal", "a-facial", "vii-cervical", "c-transverse-cervical"],
    sensory: "Transverse cervical n. (C2–C3).",
    artery: "Facial a. and its submental branch.",
    lymph: "Submandibular nodes (level Ib).",
    plane: "Superficial fat above platysma. The submandibular gland, facial vessels and the nerve are all beneath it.",
    notes: ["Turning the head away and extending the neck pulls the nerve lower.", "The facial vein crosses the gland superficially; the artery grooves its deep surface before hooking over the mandible."],
    repair: ["Primary closure in a horizontal neck crease, at least 2 cm below the mandible where possible."],
  },
  "h-scm": {
    auc: "M",
    alerts: ["Great auricular nerve and external jugular vein cross the muscle just under the skin."],
    structures: ["c-great-auricular", "v-external-jugular", "xi-accessory", "c-transverse-cervical", "c-lesser-occipital"],
    sensory: "Great auricular n. (upper), transverse cervical n. (middle), supraclavicular nn. (lower).",
    artery: "Occipital, superior thyroid and transverse cervical branches.",
    lymph: "External jugular and deep jugular chain nodes (levels II–IV).",
    plane: "Superficial fat above platysma and the investing fascia of sternocleidomastoid.",
    notes: [
      "McKinney's point: the great auricular nerve crosses the mid-belly of the muscle 6.5 cm below the ear canal.",
      "The midpoint of the muscle's posterior border is Erb's point, where the cervical plexus branches and the spinal accessory nerve emerge.",
    ],
    repair: ["Primary closure along horizontal neck lines.", "Advancement or rotation flaps."],
  },
  "h-posterior-triangle": {
    auc: "M",
    alerts: ["Spinal accessory nerve crosses the posterior triangle just under the skin and investing fascia — superficial dissection only."],
    structures: ["xi-accessory", "c-supraclavicular", "c-lesser-occipital", "c-great-auricular", "v-external-jugular", "b-supraclavicular"],
    sensory: "Lesser occipital n. (upper), supraclavicular nn. (lower).",
    artery: "Transverse cervical and suprascapular aa.; occipital a. at the apex.",
    lymph: "Posterior triangle (level V) and supraclavicular nodes.",
    plane: "Superficial fat only. There is no platysma over most of the triangle, and the nerve lies on levator scapulae directly under the investing fascia.",
    notes: [
      "Borders: posterior edge of sternocleidomastoid, anterior edge of trapezius, middle third of the clavicle.",
      "Injury is most often reported after 'minor' procedures here: node biopsy, cyst and lipoma excision.",
      "Test trapezius (shrug, abduct beyond 90°) before and after surgery and document it.",
    ],
    repair: ["Primary closure along relaxed skin tension lines.", "Secondary intention or graft in preference to deep undermining."],
  },
  "h-posterolateral-neck": {
    auc: "M",
    structures: ["xi-accessory", "c-supraclavicular", "c-lesser-occipital"],
    sensory: "Dorsal rami of C3–C5; supraclavicular nn. laterally; lesser occipital n. above.",
    artery: "Transverse cervical a.; occipital a.",
    lymph: "Posterior triangle (level V), occipital and supraclavicular nodes.",
    plane: "Subcutaneous fat above the trapezius fascia.",
    notes: ["Thick dermis and constant movement: scars over trapezius spread and may become hypertrophic.", "The spinal accessory nerve enters the deep surface of trapezius along its anterior border, about 5 cm above the clavicle."],
    repair: ["Primary closure along relaxed skin tension lines with strong buried sutures."],
  },
  "h-nuchal": {
    auc: "M",
    structures: ["c-greater-occipital", "a-occipital"],
    sensory: "Greater occipital n. (C2), third occipital n. (C3) and dorsal rami of C4–C5.",
    artery: "Occipital a.; deep cervical and transverse cervical branches.",
    lymph: "Occipital nodes and posterior triangle (level V).",
    plane: "Subcutaneous fat above the trapezius fascia — the fat is fibrous and tethered to the dermis.",
    notes: ["Very thick dermis with dense fibrous septa: wounds are stiff, gape, and scars spread.", "Common site of acne keloidalis and epidermoid cysts."],
    repair: ["Primary closure, horizontal, with strong buried sutures.", "Secondary intention is acceptable."],
  },

  // -------------------------------------------------------------------------
  // Trunk
  // -------------------------------------------------------------------------
  "ba-ant-neck": { like: "fa-anterior-neck" },
  "bp-nuchal": { like: "h-nuchal" },
  trunk: {
    auc: "L",
    sensory: "Segmental intercostal nn. — anterior and lateral cutaneous branches (see the dermatome views).",
    plane: "Deep subcutaneous fat, just above the muscular fascia.",
    notes: ["Orient excisions along relaxed skin tension lines; if unsure, excise as a circle and see which way the wound gapes."],
    repair: ["Primary fusiform closure with buried dermal sutures.", "Secondary intention or graft only if closure is not possible."],
  },
  "ba-presternal": {
    like: "trunk",
    alerts: ["High risk of hypertrophic and keloid scarring."],
    lymph: "Axillary nodes (either side); internal mammary nodes possible.",
    notes: ["The presternal skin is tight, moves with breathing, and scars badly — warn the patient.", "Horizontal closure generally gives the least tension."],
  },
  "ba-supraclav": { like: "trunk", auc: "M", aucNote: "neck", structures: ["b-supraclavicular", "c-supraclavicular", "xi-accessory", "v-external-jugular"], lymph: "Supraclavicular and level V nodes.", plane: "Superficial fat above platysma." },
  "ba-clavicle": { like: "trunk", structures: ["c-supraclavicular"], lymph: "Axillary and supraclavicular nodes.", notes: ["Thin skin directly over bone; the supraclavicular nerves cross the clavicle just under platysma.", "Scars here often become hypertrophic."] },
  "ba-pectoral": { like: "trunk", lymph: "Axillary nodes.", notes: ["Upper chest and shoulder scars spread and commonly become hypertrophic or keloidal.", "Orient along the relaxed skin tension lines, which run roughly horizontal on the upper chest."] },
  "ba-breast": {
    like: "trunk",
    auc: "H",
    aucNote: "nipple–areola only; the rest of the breast is area L",
    lymph: "Axillary nodes; medial breast also to internal mammary nodes.",
    notes: ["Curvilinear closures along Langer's lines of the breast (circumareolar near the areola, radial further out) distort least.", "Keep the nipple position symmetric; avoid tension that displaces the areola."],
  },
  "ba-axilla": {
    like: "trunk",
    structures: ["b-axilla"],
    lymph: "Axillary nodes.",
    plane: "Subcutaneous fat above the axillary fascia.",
    notes: ["Moist, hair-bearing, apocrine skin with a higher infection rate.", "Orient scars transversely in the axillary folds; vertical scars contract into bands that limit abduction."],
  },
  "ba-lat-chest": { like: "trunk", lymph: "Axillary nodes.", notes: ["The long thoracic and thoracodorsal nerves run deep on the chest wall and are not at risk in skin surgery.", "Relaxed skin tension lines follow the ribs."] },
  "ba-epigastric": { like: "trunk", lymph: "Axillary nodes (above the umbilicus)." },
  "ba-upper-abdomen": { like: "trunk", lymph: "Axillary nodes (above the umbilicus)." },
  "ba-umbilical": { like: "trunk", lymph: "Watershed at the umbilicus: axillary nodes above, inguinal nodes below, either side.", notes: ["Sappey's line (through the umbilicus to L2) divides axillary from inguinal drainage; lesions near it or the midline drain unpredictably.", "Keep the umbilicus central when closing."] },
  "ba-flank": { like: "trunk", lymph: "Axillary nodes above the umbilical level, inguinal nodes below." },
  "ba-lower-abdomen": { like: "trunk", lymph: "Superficial inguinal nodes.", notes: ["The superficial epigastric and circumflex iliac vessels run in the fat of the lower abdomen."] },
  "ba-suprapubic": { like: "trunk", lymph: "Superficial inguinal nodes, either side." },
  "ba-hip": { like: "trunk", lymph: "Superficial inguinal nodes.", notes: ["The lateral femoral cutaneous nerve passes under the inguinal ligament just medial to the anterior superior iliac spine and becomes subcutaneous about 10 cm below it."] },
  "ba-inguinal": {
    like: "trunk",
    structures: ["b-femoral"],
    lymph: "Superficial inguinal nodes.",
    notes: ["Intertriginous skin: higher infection and dehiscence risk; close along the crease.", "Divided lymphatics here can cause a lymphocele."],
  },
  "ba-pubic": {
    like: "trunk",
    auc: "H",
    aucNote: "genitalia, including perineal and perianal skin",
    lymph: "Superficial inguinal nodes, either side.",
    plane: "Subcutaneous (above dartos / Colles' fascia on the genitalia).",
    notes: ["Tissue-sparing surgery matters for function; HPV-related squamous cell carcinoma in situ is often multifocal.", "Very lax, vascular skin: bruising and oedema are common, healing is quick."],
    repair: ["Primary closure.", "Secondary intention heals well on genital skin.", "Split- or full-thickness graft for larger defects."],
  },
  "bp-interscap": { like: "trunk", alerts: ["Scars on the upper back spread widely and may become hypertrophic."], lymph: "Axillary nodes, either side near the midline.", notes: ["Thickest dermis in the body; high wound tension with shoulder movement.", "Use strong, long-lasting buried sutures, consider leaving skin sutures 2–3 weeks, and limit lifting and reaching."] },
  "bp-suprascap": { like: "bp-interscap", structures: ["xi-accessory"], lymph: "Axillary nodes; level V / supraclavicular nodes near the neck." },
  "bp-scapular": { like: "bp-interscap", lymph: "Axillary nodes." },
  "bp-post-axilla": { like: "trunk", lymph: "Axillary nodes." },
  "bp-thoracic": { like: "bp-interscap", lymph: "Axillary nodes, either side." },
  "bp-midback": { like: "bp-interscap", lymph: "Axillary nodes." },
  "bp-post-flank": { like: "trunk", lymph: "Axillary nodes above the L2 level, inguinal nodes below." },
  "bp-lumbar": { like: "trunk", lymph: "Watershed (Sappey's line at about L2): axillary or inguinal nodes, either side." },
  "bp-lowback": { like: "trunk", lymph: "Superficial inguinal nodes; axillary nodes above L2." },
  "bp-sacral": { like: "trunk", lymph: "Superficial inguinal nodes, either side.", notes: ["Pressure- and shear-bearing skin over bone: off-load after surgery."] },
  "bp-natal-cleft": { like: "trunk", auc: "H", aucNote: "if perianal / perineal", lymph: "Superficial inguinal nodes, either side.", notes: ["Moist, sheared, contaminated site: dehiscence and infection are common. Off-midline closure heals better than a midline scar in the cleft."] },
  "bp-perianal": {
    like: "ba-pubic",
    notes: ["The external anal sphincter lies just under the perianal skin; circumferential excision risks stenosis.", "Lesions crossing the anal verge need anoscopy and usually colorectal input.", "Secondary intention heals well here."],
  },
  "bp-buttock": { like: "trunk", lymph: "Superficial inguinal nodes.", notes: ["Weight-bearing: sitting stresses the wound. Close along the gluteal fold lines and use strong buried sutures.", "The sciatic nerve is deep to gluteus maximus and not at risk in skin surgery."] },

  // -------------------------------------------------------------------------
  // Upper limb
  // -------------------------------------------------------------------------
  limb: {
    auc: "L",
    plane: "Deep subcutaneous fat above the muscular fascia; cutaneous nerves and superficial veins run in the deep fat.",
    notes: ["Relaxed skin tension lines on the limbs are often oblique or circumferential; longitudinal closures are sometimes preferred because they follow the lymphatics and are easier to close — pinch the skin to decide.", "Avoid closing across joints in the line of flexion."],
    repair: ["Primary fusiform closure.", "Secondary intention.", "Split- or full-thickness skin graft."],
  },
  "ba-deltoid": { like: "limb", alerts: ["Shoulder scars spread and commonly become hypertrophic or keloidal."], lymph: "Axillary nodes.", sensory: "Supraclavicular nn. (C3–C4) over the top; upper lateral cutaneous n. of arm (axillary n., C5).", notes: ["High-tension, mobile site: use strong buried sutures and restrict reaching and lifting for 2–3 weeks.", "The axillary nerve is deep to deltoid, about 5 cm below the acromion — not at risk in skin surgery."] },
  "bp-post-shoulder": { like: "ba-deltoid" },
  "ba-uparm": { like: "limb", lymph: "Axillary nodes.", sensory: "Upper and lower lateral cutaneous nn. of arm (lateral); medial cutaneous n. of arm and intercostobrachial n. (medial)." },
  "ba-med-uparm": {
    like: "limb",
    lymph: "Axillary nodes; epitrochlear node just above the medial epicondyle.",
    sensory: "Medial cutaneous n. of arm; intercostobrachial n. (T2).",
    notes: ["Thin, lax skin. The basilic vein and medial antebrachial cutaneous nerve pierce the fascia in the middle of the medial arm; the brachial artery, median and ulnar nerves lie just beneath the fascia in the bicipital groove."],
  },
  "bp-post-uparm": { like: "limb", lymph: "Axillary nodes.", sensory: "Posterior cutaneous n. of arm (radial n.)." },
  "ba-antecub": { like: "limb", structures: ["b-antecubital"], lymph: "Axillary nodes; epitrochlear node.", sensory: "Medial and lateral antebrachial cutaneous nn." },
  "bp-elbow": {
    like: "limb",
    structures: ["b-ulnar-elbow"],
    lymph: "Axillary nodes; epitrochlear node.",
    sensory: "Posterior cutaneous n. of forearm; medial antebrachial cutaneous n.",
    notes: ["Skin over the olecranon is lax in extension and tight in flexion — close with the elbow partly flexed.", "The olecranon bursa lies just under the skin; entering it risks a chronic sinus.", "High dehiscence risk: consider splinting in the first week."],
  },
  "ba-volar-forearm": { like: "limb", lymph: "Axillary nodes; epitrochlear node (ulnar side).", sensory: "Medial and lateral antebrachial cutaneous nn.", notes: ["Thin skin with visible veins; actinic damage is usually less than on the dorsal side."] },
  "bp-dorsal-forearm": {
    like: "limb",
    lymph: "Axillary nodes; epitrochlear node (ulnar side).",
    sensory: "Posterior cutaneous n. of forearm (radial n.); lateral and medial antebrachial cutaneous nn. at the edges.",
    structures: ["b-radial-sensory"],
    notes: ["Atrophic, sun-damaged skin tears easily in the elderly: use wide, shallow bites, pulley or horizontal mattress sutures, and adhesive strips to reinforce.", "Closure in the long axis of the forearm is often easiest; second-intention healing and grafts also do well."],
  },
  "ba-volar-wrist": { like: "limb", structures: ["b-volar-wrist", "b-radial-sensory"], lymph: "Axillary nodes; epitrochlear node.", sensory: "Palmar cutaneous branches of the median and ulnar nn.; lateral antebrachial cutaneous n.", plane: "Just beneath the dermis.", notes: ["Close transversely in the wrist creases; longitudinal scars across the crease contract."] },
  "bp-dorsal-wrist": { like: "limb", structures: ["b-radial-sensory", "b-dorsal-hand"], lymph: "Axillary nodes; epitrochlear node.", sensory: "Superficial radial n. (radial side), dorsal branch of ulnar n. (ulnar side).", plane: "Just beneath the dermis, above the veins and the extensor retinaculum." },
  hand: {
    auc: "H",
    lymph: "Epitrochlear node (ulnar side) and axillary nodes.",
    plane: "Just beneath the dermis.",
    notes: ["Function comes first: plan closures that do not limit joint movement, and splint or bulky-dress for comfort.", "Elevate after surgery; oedema is the main cause of pain and stiffness."],
    repair: ["Primary closure along skin creases.", "Secondary intention.", "Full-thickness graft."],
  },
  "bp-dorsal-hand": {
    like: "hand",
    structures: ["b-dorsal-hand", "b-radial-sensory"],
    sensory: "Superficial radial n. (radial), dorsal branch of ulnar n. (ulnar).",
    notes: ["Thin, mobile skin over veins and extensor tendons; test closure with the fist clenched.", "Transverse or oblique closures follow the skin lines; preserve paratenon if a graft may be needed.", "Squamous cell carcinoma here is common and often multiple in the immunosuppressed."],
  },
  "ba-palm": {
    like: "hand",
    structures: ["b-volar-wrist", "b-digital"],
    sensory: "Median n. (radial three and a half digits and palm), ulnar n. (ulnar one and a half); palmar cutaneous branches proximally.",
    plane: "Above the palmar aponeurosis. Glabrous skin is tethered by fibrous septa and barely undermines.",
    notes: ["The recurrent motor branch of the median nerve is superficial at the base of the thenar eminence.", "The superficial palmar arch lies level with the distal border of the outstretched thumb.", "Incisions should follow or zig-zag across the flexion creases, never cross them at right angles."],
    repair: ["Secondary intention — glabrous skin heals well.", "Primary closure along creases.", "Full-thickness graft (hypothenar or instep skin for glabrous match)."],
  },
  "ba-thumb": { like: "hand", auc: "H", structures: ["b-digital", "b-radial-sensory"], sensory: "Median n. (palmar) and superficial radial n. (dorsal); digital nerves on each side.", notes: ["Preserve length and pulp sensation above all.", "For nail-unit tumours, bone lies 1–2 mm below the nail bed; en bloc nail-unit excision with full-thickness graft is the usual tissue-sparing option."] },
  "ba-fingers": {
    like: "hand",
    structures: ["b-digital"],
    sensory: "Proper palmar digital nn. (median: thumb to radial half of ring finger; ulnar: ulnar half of ring and little finger).",
    notes: ["Use mid-lateral or Bruner zig-zag incisions on the palmar side; never a straight line across a flexion crease.", "Digital block: adrenaline-containing lidocaine is considered safe in digits with normal circulation; keep volumes small (2–3 mL) and tourniquet time short."],
  },
  "bp-dorsal-fingers": {
    like: "hand",
    aucNote: "includes the nail unit",
    structures: ["b-digital", "b-dorsal-hand"],
    sensory: "Dorsal digital nn. (radial and ulnar) proximally; palmar digital nn. supply the dorsum distal to the PIP joint and the nail unit.",
    notes: [
      "Nail unit: the matrix lies under the proximal nail fold and extends to within a few millimetres of the DIP joint; its proximal (dorsal) part makes the surface of the plate, so matrix scars cause split or ridged nails.",
      "The extensor tendon inserts about 1.2 cm proximal to the cuticle. Bone is 1–2 mm under the nail bed.",
      "Longitudinal melanonychia or erythronychia with nail dystrophy in one digit: think of nail-unit squamous cell carcinoma or melanoma.",
    ],
    repair: ["Secondary intention (including the nail bed and lateral folds).", "Full-thickness graft after en bloc nail-unit excision.", "Primary closure; cross-finger and local flaps for exposed tendon or bone (hand surgery)."],
  },

  "nail-unit": {
    like: "hand",
    aucNote: "nail unit",
    alerts: ["Bone lies 1–2 mm beneath the nail bed and matrix; the extensor tendon inserts just proximal to the matrix."],
    structures: ["b-digital"],
    lymph: "Fingers: epitrochlear node (ulnar digits) and axillary nodes. Toes: superficial inguinal nodes.",
    sensory: "Proper palmar (plantar) digital nn., via their dorsal branches. A digital block at the base of the digit anaesthetises the whole nail unit.",
    artery: "Paired digital arteries forming the proximal and distal arcades in the nail bed.",
    plane: "None — nail bed and matrix dermis attach directly to the periosteum of the distal phalanx.",
    notes: [
      "Parts: proximal nail fold and cuticle, matrix (the lunula is its visible distal part), nail bed, hyponychium, lateral nail folds.",
      "The matrix extends about 5 mm proximal to the cuticle, to within a few millimetres of the extensor tendon insertion and the DIP joint.",
      "The proximal matrix forms the surface of the plate and the distal matrix its underside: biopsy the distal matrix where possible, orient matrix excisions transversely, and keep longitudinal matrix defects under 3 mm to avoid a split nail.",
      "Nail bed biopsies are oriented longitudinally.",
      "A single-digit longitudinal pigmented band that is wide, dark, irregular or spreading on to the nail fold (Hutchinson's sign), or a persistent wart-like or oozing lesion, needs a matrix or bed biopsy.",
    ],
    repair: [
      "Secondary intention for the nail bed and lateral folds.",
      "En bloc nail-unit excision down to periosteum, repaired with a full-thickness skin graft or left to granulate.",
      "Amputation is reserved for bone involvement.",
    ],
  },

  "nu-proximal-fold": {
    like: "nail-unit",
    alerts: ["The extensor tendon inserts about 12 mm proximal to the cuticle — incisions and injections proximal to the fold are close to it."],
    notes: [
      "A wedge of skin whose undersurface (eponychium) lies on the newly formed plate and covers the proximal matrix.",
      "To expose the matrix, make oblique relaxing incisions at the junctions of the proximal and lateral folds and reflect the fold proximally.",
      "A crescentic full-thickness excision of the free edge of the fold (for chronic paronychia or small tumours) heals well by secondary intention.",
      "Common site of digital myxoid cysts, which connect to the DIP joint and press a groove into the plate.",
    ],
    repair: ["Secondary intention.", "Replace the reflected fold and suture the relaxing incisions.", "Full-thickness graft for larger defects."],
  },
  "nu-cuticle": {
    like: "nail-unit",
    alerts: [],
    notes: ["A layer of keratin from the proximal nail fold that seals the fold to the plate.", "Loss of the seal (trauma, manicuring, wet work) lets irritants and organisms in: chronic paronychia.", "Pigment extending on to the cuticle or fold from a pigmented band is Hutchinson's sign."],
    repair: ["Re-forms as the fold heals; protect from wet work meanwhile."],
  },
  "nu-lateral-fold": {
    like: "nail-unit",
    alerts: [],
    notes: [
      "The lateral horns of the matrix extend proximally and laterally beneath the junction of the proximal and lateral folds — they must be included in a matricectomy or a spicule regrows.",
      "Lateral longitudinal excision (fold, plate edge, bed and matrix horn down to bone, 3–4 mm wide) is the standard biopsy for lesions in the lateral third of the nail.",
      "The digital nerve and artery run just palmar to the fold.",
    ],
    repair: ["Secondary intention.", "Suture the fold back to the plate edge after lateral longitudinal excision."],
  },
  "nu-matrix": {
    like: "nail-unit",
    alerts: ["Matrix scars cause permanent nail dystrophy: a split from the proximal matrix, a thin or ridged plate from the distal matrix."],
    notes: [
      "The matrix makes the plate. It starts just distal to the extensor tendon insertion, lies under the proximal nail fold, and ends at the distal edge of the lunula.",
      "The proximal matrix forms the top of the plate and the distal matrix (lunula) its underside — so distal-matrix biopsies leave least deformity.",
      "Punch biopsies up to 3 mm heal without a split; orient excisions transversely (parallel to the lunula border).",
      "For longitudinal melanonychia, find the origin of the band in the matrix: a tangential (shave) matrix biopsy samples a wide band with little dystrophy.",
      "Matrix melanocytes are mostly dormant; activation gives a longitudinal pigmented band.",
    ],
    repair: ["Leave punch defects up to 3 mm to heal.", "Close transverse matrix defects with fine absorbable sutures after undermining.", "Replace the plate as a biological dressing."],
  },
  "nu-bed": {
    like: "nail-unit",
    alerts: ["Bone is 1–2 mm beneath the bed, with no subcutaneous fat between."],
    notes: [
      "The bed holds the plate down by interlocking longitudinal ridges; it adds little to plate thickness.",
      "Orient bed biopsies longitudinally. Punches up to 4 mm and narrow longitudinal ellipses heal by secondary intention.",
      "Scarring of the bed causes onycholysis rather than a split.",
      "A persistent warty, oozing or onycholytic lesion of one nail should be biopsied for squamous cell carcinoma; image the phalanx if the bed is involved.",
    ],
    repair: ["Secondary intention.", "Fine absorbable sutures for longitudinal defects.", "Full-thickness graft after en bloc nail-unit excision."],
  },
  "nu-plate": {
    like: "nail-unit",
    alerts: [],
    structures: [],
    notes: [
      "Fingernails grow about 3 mm a month (full regrowth in about 6 months); toenails about 1 mm a month (12–18 months for the great toenail).",
      "Partial avulsion (lateral, proximal or a trap-door) gives access with less morbidity than total avulsion.",
      "Separate the plate from the bed and from the proximal fold with a blunt elevator before lifting it.",
      "A punch through the softened plate (two-punch technique) reaches the bed or matrix without avulsion.",
    ],
    repair: ["Replace the trimmed plate as a splint and dressing where possible."],
  },
  "nu-hyponychium": {
    like: "nail-unit",
    alerts: [],
    notes: ["The seal between the distal nail bed and the fingertip, under the free edge; the onychodermal band marks its proximal limit.", "Disrupting it causes onycholysis and lets organisms under the plate.", "Subungual warts and squamous cell carcinoma often start here or in the lateral groove."],
    repair: ["Secondary intention."],
  },
  "nu-pulp": {
    like: "nail-unit",
    aucNote: "hand / foot",
    alerts: [],
    plane: "Fat is divided into compartments by fibrous septa running from the dermis to the periosteum; undermining is limited.",
    notes: ["Each digital nerve ends by dividing into three branches just distal to the DIP crease, supplying the pulp, the nail bed and the dorsal tip.", "The digital arteries join in an arcade over the tuft of the phalanx.", "Preserve pulp sensation and padding: glabrous skin heals well by secondary intention."],
    repair: ["Secondary intention (defects up to about 1 cm without exposed bone).", "Full-thickness graft from the hypothenar eminence.", "V–Y advancement or other local flaps for exposed bone (hand surgery)."],
  },
  "nu-phalanx": {
    like: "nail-unit",
    structures: [],
    notes: ["The matrix and bed lie directly on the periosteum of the distal phalanx.", "X-ray before surgery for subungual tumours: look for exostosis, erosion or invasion.", "Bone involvement by squamous cell carcinoma or melanoma usually means amputation at or proximal to the DIP joint."],
    repair: [],
  },
  "nu-extensor": {
    like: "nail-unit",
    alerts: ["Dividing the terminal extensor tendon causes a mallet (dropped) fingertip."],
    structures: [],
    notes: ["Inserts on the dorsal base of the distal phalanx about 12 mm proximal to the cuticle; the proximal edge of the matrix is about 1 mm distal to the insertion.", "Only skin and paratenon cover it over the DIP joint."],
    repair: ["A divided tendon needs splinting in extension or repair — hand surgery."],
  },
  "nu-dip": {
    like: "nail-unit",
    aucNote: "hand / foot",
    alerts: ["The joint capsule and extensor tendon lie directly under thin dorsal skin."],
    notes: ["Digital myxoid (mucous) cysts arise from the DIP joint, usually over an osteophyte; surgery must deal with the stalk to the joint.", "Entering the joint risks septic arthritis.", "Close dorsal wounds with the joint extended, or accept secondary intention."],
    repair: ["Secondary intention.", "Full-thickness graft over intact paratenon.", "Local rotation or transposition flap for exposed tendon or joint."],
  },

  // -------------------------------------------------------------------------
  // Lower limb
  // -------------------------------------------------------------------------
  leg: {
    like: "limb",
    lymph: "Superficial inguinal nodes.",
    notes: ["Healing is slower below the knee: more dehiscence, infection and prolonged oedema. Elevate and compress after surgery.", "Check pulses, venous disease and oedema before choosing between closure, graft and secondary intention."],
  },
  "ba-ant-thigh": { like: "leg", sensory: "Anterior cutaneous branches of the femoral n.; lateral femoral cutaneous n. laterally.", notes: ["Thick fat and a good blood supply: primary closure is usually straightforward."] },
  "ba-med-thigh": { like: "leg", structures: ["b-femoral", "b-saphenous"], sensory: "Obturator n. and medial cutaneous branches of the femoral n.", notes: ["The great saphenous vein runs up the medial thigh in the subcutaneous fat to the saphenofemoral junction.", "Thin, lax skin; friction and moisture increase wound problems."] },
  "ba-lat-thigh": { like: "leg", sensory: "Lateral femoral cutaneous n. (L2–L3).", notes: ["The iliotibial tract lies under the fat; skin here is tight and scars spread."] },
  "bp-post-thigh": { like: "leg", sensory: "Posterior femoral cutaneous n. (S1–S3).", notes: ["Wounds are stressed by sitting; use strong buried sutures."] },
  "ba-knee": {
    like: "leg",
    structures: ["b-peroneal", "b-saphenous"],
    sensory: "Anterior femoral cutaneous nn.; infrapatellar branch of the saphenous n. (crosses below the patella from medial to lateral).",
    notes: ["Skin over the patella is tight in flexion: close with the knee slightly bent and consider a splint for the first week.", "The prepatellar bursa lies just beneath the skin.", "Dividing the infrapatellar branch of the saphenous nerve leaves a numb patch lateral to the scar, sometimes a neuroma."],
  },
  "bp-popliteal": { like: "leg", structures: ["b-popliteal", "b-peroneal", "b-sural"], sensory: "Posterior femoral cutaneous n.", lymph: "Popliteal nodes, then inguinal nodes." },
  "ba-shin": {
    like: "leg",
    auc: "M",
    aucNote: "pretibial surface",
    alerts: ["Pretibial skin heals slowly and closes under high tension — plan for it."],
    structures: ["b-saphenous", "b-peroneal"],
    sensory: "Saphenous n. (medial); lateral sural cutaneous and superficial peroneal nn. (lateral).",
    plane: "Above the deep fascia. Over the tibia there is almost no fat between skin and periosteum.",
    notes: [
      "Tight, thin, poorly perfused skin over bone; oedema, venous disease and anticoagulation make it worse.",
      "Compression (Unna boot or multilayer bandaging) and elevation after surgery improve healing by any method.",
      "Grafts fail on bare cortical bone: preserve periosteum.",
    ],
    repair: [
      "Primary closure in the long axis of the leg, often needing wide undermining above the fascia.",
      "Secondary intention with compression — slow but reliable for small and medium wounds.",
      "Purse-string or partial closure to shrink the wound.",
      "Split- or full-thickness (including pinch) grafts; keystone or bilateral advancement flaps for selected defects.",
    ],
  },
  "ba-lat-leg": { like: "ba-shin", auc: "L", aucNote: "", alerts: [], structures: ["b-peroneal", "b-dorsal-foot"], sensory: "Lateral sural cutaneous n.; superficial peroneal n. (becomes subcutaneous in the distal third of the lateral leg).", plane: "Above the deep fascia." },
  "bp-calf": { like: "leg", structures: ["b-sural", "b-popliteal"], sensory: "Medial and lateral sural cutaneous nn.; saphenous n. medially.", lymph: "Superficial inguinal nodes; popliteal nodes (posterolateral calf and heel).", notes: ["The small saphenous vein and sural nerve run up the midline of the calf, piercing the fascia in its middle third.", "More fat and laxity than the shin; primary closure is usually possible. Compress and elevate."] },
  ankle: {
    like: "leg",
    auc: "H",
    aucNote: "ankle",
    plane: "Just beneath the dermis — there is little subcutaneous fat.",
    notes: ["Thin skin over tendon and bone with poor laxity and slow healing; immobilise and compress.", "Secondary intention and grafts are used more often here than elsewhere."],
    repair: ["Secondary intention.", "Full- or split-thickness graft over intact paratenon or periosteum.", "Primary closure for small defects."],
  },
  "ba-ant-ankle": { like: "ankle", structures: ["b-dorsal-foot", "b-saphenous"], sensory: "Superficial peroneal n.; saphenous n. medially." },
  "ba-med-malleolus": { like: "ankle", structures: ["b-saphenous"], sensory: "Saphenous n. (L3–L4).", notes: ["The great saphenous vein and saphenous nerve cross just in front of the malleolus; the posterior tibial artery and tibial nerve run behind it in the tarsal tunnel.", "The commonest site of venous ulceration — look for venous disease and compress."] },
  "ba-lat-malleolus": { like: "ankle", structures: ["b-sural"], sensory: "Sural n. (S1).", notes: ["The sural nerve and small saphenous vein pass behind the malleolus.", "Pressure from footwear slows healing; pad the area."] },
  "bp-achilles": { like: "ankle", structures: ["b-sural"], sensory: "Sural n. (lateral); medial calcaneal branches of the tibial n.", notes: ["Skin lies directly on the Achilles paratenon — preserve it. Plantar-flexion splinting protects a closure here."] },
  foot: {
    like: "leg",
    auc: "H",
    plane: "Just beneath the dermis.",
    notes: ["Check dorsalis pedis and posterior tibial pulses, capillary refill and sensation; arrange vascular assessment before surgery if pulses are absent.", "Off-load and elevate; allow longer before removing sutures (2–3 weeks)."],
    repair: ["Secondary intention.", "Full-thickness graft.", "Primary closure where there is laxity."],
  },
  "ba-dorsal-foot": { like: "foot", structures: ["b-dorsal-foot", "b-saphenous", "b-sural"], sensory: "Superficial peroneal n.; deep peroneal n. (first web space); saphenous n. (medial border); sural n. (lateral border).", lymph: "Superficial inguinal nodes; lateral border may drain to popliteal nodes." },
  "ba-toes": { like: "foot", structures: ["b-digital"], sensory: "Dorsal and plantar digital nn.", notes: ["Nail unit anatomy as for the fingers: matrix under the proximal nail fold, bone 1–2 mm under the nail bed.", "Acral lentiginous melanoma and nail-unit squamous cell carcinoma present here — biopsy persistent pigmented bands and non-healing 'ingrown' nails.", "Digital block as for fingers."] },
  "bp-heel": {
    like: "foot",
    sensory: "Medial calcaneal branches of the tibial n.; sural n. laterally. The sole: medial and lateral plantar nn.",
    lymph: "Superficial inguinal nodes; popliteal nodes from the lateral heel.",
    plane: "Above the plantar fascia. Thick glabrous skin is anchored by fibrous septa and barely undermines.",
    notes: ["Weight-bearing skin: strict off-loading (crutches, heel-relief shoe) until healed.", "Plantar wounds heal well by secondary intention; grafts of non-glabrous skin break down under load.", "Posterior tibial nerve block at the medial malleolus anaesthetises most of the sole and is far less painful than plantar infiltration."],
    repair: ["Secondary intention.", "Primary closure along the skin creases.", "Glabrous full-thickness graft from the instep; local flaps for weight-bearing defects (specialist)."],
  },
};

// Structures at risk on the trunk and limbs (ids from structures.js), listed per site.
const LIMB_STRUCTURES = {
  "ba-supraclav": ["b-supraclavicular", "c-supraclavicular", "xi-accessory", "v-external-jugular"],
  "ba-clavicle": ["c-supraclavicular", "v-cephalic"],
  "ba-deltoid": ["v-cephalic", "n-axillary", "c-supraclavicular"],
  "bp-post-shoulder": ["n-axillary"],
  "ba-axilla": ["b-axilla", "n-intercostobrachial", "a-brachial"],
  "ba-uparm": ["v-cephalic", "n-radial"],
  "ba-med-uparm": ["a-brachial", "n-median", "n-ulnar", "v-basilic", "n-mabc", "n-intercostobrachial"],
  "bp-post-uparm": ["n-radial", "n-axillary"],
  "ba-antecub": ["b-antecubital", "a-brachial", "n-median", "v-basilic", "v-cephalic", "n-mabc", "n-labc"],
  "bp-elbow": ["b-ulnar-elbow", "n-ulnar", "n-mabc"],
  "ba-volar-forearm": ["a-radial", "v-cephalic", "v-basilic", "n-labc", "n-mabc", "n-median"],
  "bp-dorsal-forearm": ["b-radial-sensory", "v-cephalic", "n-dorsal-ulnar"],
  "ba-volar-wrist": ["b-volar-wrist", "a-radial", "n-median", "n-ulnar", "a-ulnar", "b-radial-sensory"],
  "bp-dorsal-wrist": ["b-radial-sensory", "n-dorsal-ulnar", "v-cephalic", "b-dorsal-hand"],
  "bp-dorsal-hand": ["b-dorsal-hand", "b-radial-sensory", "n-dorsal-ulnar", "v-cephalic"],
  "ba-palm": ["b-recurrent-median", "a-palmar-arch", "n-median", "n-ulnar", "b-digital"],
  "ba-thumb": ["b-digital", "b-recurrent-median", "b-radial-sensory"],
  "ba-inguinal": ["b-femoral", "a-femoral", "n-femoral", "v-great-saphenous", "n-lfcn"],
  "ba-hip": ["n-lfcn"],
  "ba-ant-thigh": ["n-lfcn", "a-femoral", "n-femoral"],
  "ba-med-thigh": ["v-great-saphenous", "a-femoral", "b-femoral"],
  "ba-lat-thigh": ["n-lfcn"],
  "bp-buttock": ["n-sciatic", "n-pfcn"],
  "bp-post-thigh": ["n-pfcn", "n-sciatic"],
  "ba-knee": ["b-peroneal", "b-saphenous", "v-great-saphenous"],
  "bp-popliteal": ["b-popliteal", "b-peroneal", "n-tibial", "a-popliteal", "v-small-saphenous", "b-sural"],
  "ba-shin": ["v-great-saphenous", "b-saphenous", "n-superficial-peroneal"],
  "ba-lat-leg": ["b-peroneal", "n-superficial-peroneal"],
  "bp-calf": ["b-sural", "v-small-saphenous", "v-great-saphenous", "n-tibial"],
  "ba-ant-ankle": ["n-superficial-peroneal", "a-anterior-tibial", "n-deep-peroneal", "b-saphenous"],
  "ba-med-malleolus": ["b-saphenous", "v-great-saphenous", "a-posterior-tibial", "n-tibial"],
  "ba-lat-malleolus": ["b-sural", "v-small-saphenous", "n-superficial-peroneal"],
  "bp-achilles": ["b-sural", "v-small-saphenous", "a-posterior-tibial", "n-tibial"],
  "ba-dorsal-foot": ["b-dorsal-foot", "n-superficial-peroneal", "a-anterior-tibial", "n-deep-peroneal", "b-saphenous", "b-sural"],
  "bp-heel": ["n-tibial", "a-posterior-tibial", "n-plantar", "b-sural"],
};
for (const [key, structures] of Object.entries(LIMB_STRUCTURES)) INFO[key] = { ...INFO[key], structures };

const resolve = (key, seen = new Set()) => {
  const e = INFO[key];
  if (!e) return null;
  if (!e.like || seen.has(key)) return e;
  seen.add(key);
  const { like, ...own } = e;
  return { ...resolve(like, seen), ...own };
};

export const REGION_INFO = Object.fromEntries(Object.keys(INFO).map((k) => [k, resolve(k)]));

export const AUC = {
  H: { label: "Area H", color: "#b3261e", text: "High-risk anatomic area in the Mohs appropriate use criteria: central face, eyelids, eyebrows, nose, lips, chin, ear, periauricular skin, temple; genitalia; hands, feet, nail units, ankles; nipples and areolae." },
  M: { label: "Area M", color: "#a86400", text: "Intermediate-risk area in the Mohs appropriate use criteria: cheeks, forehead, scalp, neck, jawline, pretibial surface." },
  L: { label: "Area L", color: "#4a7046", text: "Lower-risk area in the Mohs appropriate use criteria: trunk and extremities (excluding pretibial surface, hands, feet, nail units and ankles)." },
};

/** Reference notes for a region object (or null if there are none). */
export const infoFor = (region) => (region && (REGION_INFO[region.baseId] || REGION_INFO[region.infoKey])) || null;
