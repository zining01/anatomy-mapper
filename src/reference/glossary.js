// Plain-language definitions for terms used in the reference notes. Terms are
// recognised automatically wherever they appear in the notes (see Gloss in
// InfoPanel.jsx) and can be found from the search box.
//
//   term   the heading shown
//   also   other spellings / forms to recognise in the text (case-insensitive)
//   def    one to three sentences aimed at a junior resident
//   find   search phrase for the "look it up" link (defaults to the term)

export const lookupUrl = (entry) => "https://www.ncbi.nlm.nih.gov/books/?term=" + encodeURIComponent(entry.find || entry.term);

export const GLOSSARY = [
  // --- Tissue planes and fascia -------------------------------------------------------
  { term: "SMAS", also: ["superficial musculoaponeurotic system"], def: "Superficial musculoaponeurotic system: a fibromuscular sheet under the facial fat that links the facial muscles to the skin. It is continuous with platysma below, the superficial temporal fascia above and the galea on the scalp. Facial nerve branches run beneath it, so undermining in the fat above it is safe.", find: "superficial musculoaponeurotic system" },
  { term: "Superficial temporal fascia", also: ["temporoparietal fascia", "superficial temporal (temporoparietal) fascia"], def: "The temple's continuation of the SMAS: a thin sheet just under the subcutaneous fat. The superficial temporal vessels run in it and the temporal branch of the facial nerve runs on its deep surface, which is why temple undermining stays in the fat above it.", find: "temporoparietal fascia" },
  { term: "Deep temporal fascia", def: "The dense, shiny white fascia that covers the temporalis muscle. It lies deeper than the temporal branch of the facial nerve, so reaching it means the nerve's layer has already been crossed." },
  { term: "Galea", also: ["galea aponeurotica", "galeal"], def: "The tough fibrous sheet of the scalp that joins the frontalis and occipitalis muscles. It is the scalp's equivalent of the SMAS and is the layer that holds tension in a scalp closure.", find: "galea aponeurotica scalp anatomy" },
  { term: "Subgaleal plane", also: ["subgaleal"], def: "The loose areolar layer between the galea and the pericranium. It is nearly bloodless and separates easily, so it is the standard plane for undermining the scalp.", find: "scalp layers" },
  { term: "Galeotomy", also: ["galeotomies"], def: "A relaxing incision through the galea only, made on the underside of a scalp flap parallel to the wound edge. Each one lets the stiff scalp stretch a few millimetres." },
  { term: "Pericranium", def: "The periosteum of the skull. A skin graft will take on pericranium but not on bare bone." },
  { term: "Periosteum", def: "The thin vascular membrane covering bone. It nourishes the outer bone and will support a skin graft or granulation tissue; bare bone without it will not." },
  { term: "Perichondrium", def: "The thin vascular membrane covering cartilage. Cartilage has no blood supply of its own, so a graft or granulation tissue needs intact perichondrium to survive on it." },
  { term: "Paratenon", def: "The thin, vascular gliding layer around a tendon. If it is preserved a skin graft will take over the tendon; a bare tendon dries out and the graft fails." },
  { term: "Platysma", def: "The thin, sheet-like muscle of the neck, lying just under the subcutaneous fat. The marginal mandibular and cervical branches of the facial nerve, the external jugular vein and the cutaneous nerves of the neck all run beneath it." },
  { term: "Investing fascia", also: ["investing layer of deep cervical fascia", "investing layer"], def: "The outermost layer of the deep fascia of the neck, wrapping sternocleidomastoid and trapezius and roofing the posterior triangle. In the posterior triangle it is the only layer, besides skin and fat, covering the spinal accessory nerve.", find: "deep cervical fascia" },
  { term: "Fascia lata", def: "The deep fascia of the thigh. The femoral vessels and nerve lie beneath it; the great saphenous vein and the cutaneous nerves lie on top of it." },
  { term: "Retaining ligaments", also: ["retaining ligament", "zygomatic retaining ligaments", "masseteric ligaments", "mandibular retaining ligament"], def: "Fibrous bands that anchor the facial skin to the underlying bone or fascia at fixed points (zygomatic, masseteric, mandibular). They limit how far a cheek flap will move until they are released.", find: "retaining ligaments of the face" },
  { term: "Modiolus", def: "The fibromuscular knot just lateral to the corner of the mouth where the muscles that move the lips converge. It works as the hub of the smile." },
  { term: "Undermining", also: ["undermine", "undermined", "undermines"], def: "Freeing the skin around a wound from the tissue beneath it, in a chosen plane, so the edges can be advanced and closed with less tension. Each site has a preferred plane that avoids its nerves and vessels.", find: "undermining skin surgery technique" },

  // --- Wound closure principles ---------------------------------------------------------
  { term: "Relaxed skin tension lines", also: ["relaxed skin tension line", "RSTL", "skin tension lines"], def: "The lines along which resting skin is under least tension — roughly the direction of wrinkles, perpendicular to the pull of the underlying muscles. Scars placed along them are narrower and less visible.", find: "relaxed skin tension lines" },
  { term: "Free margin", also: ["free margins"], def: "A skin edge with nothing on the other side to resist pull: eyelid, nostril rim, lip, helical rim. Tension towards a free margin distorts it (ectropion, alar notching, lip eversion), so closures are planned with tension running parallel to it." },
  { term: "Cosmetic subunit", also: ["subunit principle", "cosmetic subunits", "aesthetic units", "aesthetic unit"], def: "The face divides into units and subunits bounded by natural contour lines and shadows. Scars hidden at their borders are least noticeable; if a defect takes up most of a convex subunit, replacing the whole subunit often looks better than patching part of it.", find: "facial aesthetic subunits reconstruction" },
  { term: "Embryonic fusion plane", also: ["embryonic fusion planes", "fusion plane"], def: "A line where facial processes fused in the embryo (alar crease, melolabial fold, medial canthus, pre- and post-auricular sulci, philtrum). Tumours meeting little resistance can track deeply along these planes, so recurrence rates are higher and Mohs layers are often deeper than expected.", find: "embryonic fusion planes basal cell carcinoma" },
  { term: "Mohs AUC", also: ["Mohs appropriate use criteria", "appropriate use criteria", "area H", "area M", "area L"], def: "The 2012 appropriate use criteria for Mohs surgery score a tumour by its type, size, patient factors and body area. Area H is the 'mask' of the face, genitalia, hands, feet, nails, ankles and nipples; area M is cheeks, forehead, scalp, neck, jawline and shin; area L is the rest of the trunk and limbs.", find: "Mohs micrographic surgery appropriate use criteria" },
  { term: "Secondary intention", also: ["second intention", "second-intention", "granulate", "granulation"], def: "Leaving a wound open to fill with granulation tissue, contract and re-epithelialise on its own. It works best on concave surfaces (temple, medial canthus, conchal bowl, alar groove) and needs a vascular wound bed.", find: "secondary intention healing" },
  { term: "Primary closure", also: ["fusiform closure", "fusiform"], def: "Closing a wound directly, edge to edge, usually after converting it to a fusiform (elliptical) shape about three times as long as it is wide so the ends lie flat." },
  { term: "Buried sutures", also: ["buried dermal sutures", "buried suture"], def: "Absorbable sutures placed in the dermis with the knot down, taking the tension off the skin edge and everting it. They do the real work of holding a wound together." },
  { term: "Pulley suture", also: ["pulley or horizontal mattress sutures", "horizontal mattress"], def: "Suture patterns that pass through each wound edge more than once to spread the load. They pull tight wounds together with less tearing of fragile, atrophic skin." },
  { term: "Guiding sutures", also: ["guiding suture", "partial closure"], def: "Sutures that close part of a wound, or draw its edges in, to shrink the area left to heal by secondary intention and to steer the direction of contraction." },
  { term: "Purse-string", also: ["purse-string closure"], def: "A running suture placed around the rim of a round wound and tightened like a drawstring to make it smaller. It may close the wound fully or leave a small centre to granulate." },
  { term: "Burow's triangle", also: ["Burow's", "Burow's triangles"], def: "A triangle of redundant skin removed to let a flap advance or to flatten a standing cone ('dog ear'). It can be placed wherever along the flap edge it hides best." },
  { term: "Burow's graft", def: "A full-thickness skin graft made from the Burow's triangle or standing cone that would otherwise be discarded from the same wound, so the graft matches the neighbouring skin." },
  { term: "M-plasty", def: "Folding the tip of a fusiform excision in on itself as an 'M' so the scar ends short of a structure it would otherwise cross, such as the vermilion border or the lid margin." },
  { term: "Z-plasty", def: "Transposing two triangular flaps to lengthen a scar and change its direction. It is used to break up a straight scar that crosses a joint crease or concavity and would otherwise contract into a band." },
  { term: "Trapdoor (pin-cushion) deformity", also: ["pin-cushion", "pin-cushioning", "trapdoor"], def: "Bulging of a flap or scar above the surrounding skin, typical of curved scars and of thick sebaceous skin on the nose and chin. Wide undermining and careful eversion reduce it." },
  { term: "Hypertrophic scar", also: ["hypertrophic", "keloid", "keloidal"], def: "A raised scar. A hypertrophic scar stays within the wound and often settles; a keloid grows beyond it. Chest, shoulders, upper back and earlobes are the high-risk sites.", find: "keloid hypertrophic scar" },
  { term: "Bolster", def: "A tie-over dressing sutured on top of a skin graft to press it against the wound bed and stop blood or fluid lifting it off." },
  { term: "Dermabrasion", def: "Mechanical sanding of a scar or graft, usually 6–8 weeks after surgery, to blend its edges and texture with the surrounding skin." },
  { term: "Bipolar cautery", def: "Electrocautery in which current passes only between the two tips of the forceps. It is preferred near nerves, on the eyelids and in patients with implanted cardiac devices because the current does not spread through the tissue." },

  // --- Grafts ---------------------------------------------------------------------------
  { term: "Full-thickness skin graft", also: ["full-thickness graft", "FTSG", "full-thickness skin grafts", "full-thickness grafts"], def: "Epidermis and the whole dermis, moved without its blood supply; the donor site is closed directly. It contracts little and matches colour and texture well if the donor site is chosen carefully (preauricular, postauricular, conchal bowl, supraclavicular, upper eyelid).", find: "full thickness skin graft" },
  { term: "Split-thickness skin graft", also: ["split-thickness graft", "STSG", "split-thickness", "Split- or full-thickness"], def: "Epidermis and part of the dermis, shaved from a donor site that heals on its own. It takes more readily than a full-thickness graft and covers large areas, but it contracts more and is thin, pale and shiny.", find: "split thickness skin graft" },
  { term: "Composite graft", also: ["composite grafts"], def: "A graft of more than one tissue — usually skin with cartilage from the helical root or rim — used for small full-thickness defects of the alar rim. Survival is unreliable beyond about 1 cm from a blood supply." },
  { term: "Cartilage batten", also: ["batten", "battens", "cartilage batten graft", "free cartilage graft"], def: "A strip of cartilage (usually from the conchal bowl) placed under a flap or graft on the ala or sidewall. It is not replacing missing cartilage; it braces the soft tissue against scar contraction and airway collapse." },
  { term: "Dermal substitute", also: ["Integra"], def: "A manufactured collagen matrix laid on a wound to grow a new vascular dermis-like layer, which can then be skin-grafted. Useful over bare bone or tendon." },

  // --- Flap types ------------------------------------------------------------------------
  { term: "Advancement flap", also: ["advancement flaps", "advancement"], def: "A flap that slides straight forward into the defect without turning. Examples are the single-sided U-plasty, the two-sided H-plasty, and A–T / O–T closures.", find: "advancement flap" },
  { term: "Rotation flap", also: ["rotation flaps", "rotation"], def: "A curved flap that pivots around a point into an adjacent defect. The arc needs to be long — several times the width of the defect — to move without tension.", find: "rotation flap" },
  { term: "Transposition flap", also: ["transposition flaps", "transposition"], def: "A flap lifted over a bridge of intact skin and set down in a nearby defect, bringing lax skin from another direction. Rhombic, bilobed and melolabial flaps are examples.", find: "transposition flap" },
  { term: "Rhombic flap", also: ["rhombic", "rhomboid flap", "rhombic transposition"], def: "A transposition flap designed as a parallelogram next to the defect (Limberg, Dufourmentel and Webster variants). It moves tension to the donor site, at right angles to the original defect.", find: "rhomboid flap" },
  { term: "Bilobed flap", also: ["bilobed", "bilobed transposition flap"], def: "A double transposition flap: the first lobe fills the defect, a smaller second lobe fills the first lobe's donor site, and the last donor site is closed directly. Zitelli's design (about 45° between lobes, 90–100° in total) is the standard repair for small defects of the distal nose.", find: "bilobed flap nasal reconstruction" },
  { term: "Trilobed flap", also: ["trilobed"], def: "A bilobed flap with a third lobe, which lets tissue be recruited from further up the nose for defects of the far tip and ala with less distortion of the nostril rim." },
  { term: "Island pedicle flap", also: ["island pedicle", "V–Y island pedicle flap", "V–Y island pedicle", "V–Y island", "V–Y advancement", "V–Y"], def: "A triangle of skin cut free all the way round and advanced into the defect on a pedicle of subcutaneous fat or muscle that carries its blood supply. The donor site closes as a line, turning the V into a Y.", find: "V-Y island pedicle advancement flap" },
  { term: "Interpolation flap", also: ["interpolation", "interpolation flaps"], def: "A flap from a donor site that is not next to the defect. Its pedicle bridges intact skin for about three weeks while the flap picks up a new blood supply, and is then divided at a second operation. Examples: paramedian forehead, melolabial and postauricular flaps.", find: "interpolation flap" },
  { term: "Paramedian forehead flap", also: ["forehead flap"], def: "A two- or three-stage interpolation flap from the forehead, based on the supratrochlear artery at the medial brow. It is the workhorse for large or deep defects of the nasal tip, dorsum and ala.", find: "paramedian forehead flap" },
  { term: "Melolabial interpolation flap", also: ["melolabial (nasolabial) transposition flap", "melolabial transposition", "nasolabial transposition", "melolabial interpolation"], def: "Cheek skin from beside the melolabial fold moved to the ala. As a single-stage transposition it tends to blunt the alar groove; as a two-stage interpolation flap it keeps the groove and is preferred for whole-ala defects.", find: "melolabial flap nasal ala reconstruction" },
  { term: "Dorsal nasal (Rieger) flap", also: ["dorsal nasal flap", "Rieger", "dorsal nasal (Rieger) rotation flap"], def: "A rotation flap of the whole skin of the nasal dorsum and glabella, pivoting on a pedicle near the medial canthus, to cover defects of the lower dorsum and tip.", find: "dorsal nasal flap Rieger" },
  { term: "East–west flap", also: ["East–west (horizontal advancement) flap", "east-west"], def: "A horizontal advancement flap for small defects of the nasal tip: a standing cone is removed above the defect, a second one beside the columella or ala, and the skin slides sideways." },
  { term: "A–T and O–T closure", also: ["O–T", "A–T", "O–T / A–T"], def: "A bilateral advancement flap. The defect (round 'O' or triangular 'A') is closed by sliding skin in from both sides along a straight line at its base, leaving a T-shaped scar whose bar can be hidden at a hairline, brow or crease." },
  { term: "O–Z closure", also: ["O–Z"], def: "Two rotation flaps taken from opposite sides of a round defect and rotated in the same direction, leaving a Z- or S-shaped scar. Useful on the scalp and temple." },
  { term: "H-plasty", def: "Advancement flaps raised on both sides of a defect and slid towards each other, leaving an H-shaped scar. Typical on the forehead and brow." },
  { term: "Pinwheel flap", also: ["pinwheel"], def: "Three or four small curved rotation flaps arranged around a round defect, all turning the same way, to close stiff scalp skin." },
  { term: "Cheek advancement flap", also: ["cheek advancement", "Cheek advancement (Burow's) flap"], def: "Lax cheek skin slid medially to cover a defect of the medial cheek or nasal sidewall, with the redundant triangles removed in the nasofacial sulcus, the melolabial fold or along the lower eyelid." },
  { term: "Mustardé flap", also: ["Mustardé", "Mustardé cheek rotation", "cheek rotation"], def: "A large cheek rotation flap whose incision runs from the defect along the lower lid, up over the lateral canthus and down in front of the ear. Used for big lower-eyelid and infraorbital defects." },
  { term: "Cervicofacial flap", def: "A large rotation-advancement flap that recruits lax skin of the lower cheek and neck to cover big cheek defects." },
  { term: "Keystone flap", also: ["keystone"], def: "A curved, trapezoid island flap raised beside a defect and advanced on its underlying perforators. Popular for wounds on the lower leg and trunk." },
  { term: "Tenzel flap", also: ["Tenzel", "Tenzel semicircular flap"], def: "A semicircular skin-and-muscle flap raised from the lateral canthus and rotated medially to close eyelid margin defects of roughly a third to half of the lid.", find: "Tenzel semicircular flap eyelid" },
  { term: "Hughes flap", also: ["Hughes", "tarsoconjunctival (Hughes) flap", "tarsoconjunctival"], def: "A lid-sharing flap of tarsus and conjunctiva brought down from the upper lid to rebuild the inner layer of a large lower-lid defect. The eye stays closed until the pedicle is divided a few weeks later.", find: "Hughes tarsoconjunctival flap" },
  { term: "Cutler–Beard flap", also: ["Cutler–Beard"], def: "A lid-sharing flap of full-thickness lower lid advanced under the lower lid margin to rebuild a large upper-lid defect, divided at a second stage.", find: "Cutler-Beard flap" },
  { term: "Tripier flap", also: ["Tripier"], def: "A skin-and-muscle transposition flap from the upper eyelid, turned down to resurface the lower eyelid." },
  { term: "Abbe flap", also: ["Abbe", "lip-switch", "Abbe (lip-switch) flap", "lip-switch flap"], def: "A full-thickness wedge of one lip rotated across the mouth into a defect of the other lip on a narrow pedicle containing the labial artery, which is divided 2–3 weeks later.", find: "Abbe flap lip reconstruction" },
  { term: "Estlander flap", also: ["Estlander"], def: "A lip-switch flap like the Abbe flap, but used at the corner of the mouth, so it is done in one stage and rounds off the commissure.", find: "Estlander flap" },
  { term: "Karapandzic flap", also: ["Karapandzic"], def: "Circumoral advancement-rotation flaps that keep the nerves and vessels of orbicularis oris intact, closing large lip defects with a mouth that still moves and feels, at the cost of a smaller opening.", find: "Karapandzic flap" },
  { term: "Bernard–Burow flap", also: ["Bernard–Burow", "Bernard–Burow advancement", "Gillies fan"], def: "Advancement of full-thickness cheek tissue towards the midline to rebuild a very large lower-lip defect, with Burow's triangles removed beside the nose and chin." },
  { term: "Antia–Buch flap", also: ["Antia–Buch", "helical rim advancement", "Helical rim (chondrocutaneous) advancement flap", "chondrocutaneous"], def: "A helical rim advancement flap: the rim is cut free from the rest of the ear through the front skin and cartilage, left attached to the skin on the back of the ear, and slid along to close a rim defect.", find: "Antia-Buch helical advancement flap" },
  { term: "Pull-through flap", also: ["pull-through", "revolving-door", "revolving door", "Postauricular pull-through (revolving-door) island flap"], def: "An island of skin from behind the ear, left attached to the tissue beneath it, passed through a window in the conchal cartilage to resurface the front of the conchal bowl." },
  { term: "Wedge excision", also: ["wedge", "wedge excisions"], def: "Removing a full-thickness V-shaped piece of a lip, ear or eyelid and closing it directly in layers. How much can go depends on tissue laxity: roughly a third of a lip, a quarter of an eyelid." },
  { term: "Vermilionectomy", also: ["lip shave"], def: "Removing the whole vermilion of the lower lip down to muscle, for widespread actinic cheilitis or superficial carcinoma. The defect is covered by advancing the labial mucosa (a mucosal advancement flap)." },
  { term: "Mucosal advancement flap", also: ["mucosal advancement"], def: "Undermining the wet mucosa inside the lip and pulling it forward to make a new vermilion." },

  // --- Eyelid ------------------------------------------------------------------------------
  { term: "Ectropion", def: "The eyelid margin turning outward, away from the globe. After surgery it comes from downward pull on the lower lid, especially when the lid is lax. It causes tearing, irritation and corneal exposure." },
  { term: "Lagophthalmos", def: "Inability to close the eyelids completely, from a tight upper lid or weakness of orbicularis oculi. The exposed cornea dries and can ulcerate." },
  { term: "Epiphora", def: "Watering of the eye because tears cannot drain, for example after injury to a canaliculus or when the punctum is pulled away from the globe." },
  { term: "Telecanthus", def: "Widening of the distance between the inner corners of the eyes, which happens when the medial canthal tendon is cut and not re-attached." },
  { term: "Tarsus", also: ["tarsal plate", "tarsal"], def: "The plate of dense connective tissue that stiffens each eyelid — about 10 mm tall in the upper lid and 4 mm in the lower. With the conjunctiva it forms the lid's posterior lamella." },
  { term: "Lamella", also: ["lamellae", "anterior lamella", "posterior lamella"], def: "The eyelid is repaired in two layers: the anterior lamella (skin and orbicularis muscle) and the posterior lamella (tarsus and conjunctiva). A full-thickness defect needs both rebuilt, and at least one of them must bring its own blood supply." },
  { term: "Canthotomy and cantholysis", also: ["canthotomy", "cantholysis"], def: "Cutting through the lateral canthus (canthotomy) and then dividing the lower or upper limb of the lateral canthal tendon (cantholysis). This frees the lid to slide medially by several millimetres so a margin defect can be closed directly.", find: "lateral canthotomy cantholysis" },
  { term: "Canthopexy and tarsal strip", also: ["canthopexy", "tarsal strip", "lateral canthopexy"], def: "Procedures that tighten a lax lower lid by re-anchoring the lateral canthal tendon (canthopexy) or a strip of the tarsus itself (tarsal strip) to the periosteum inside the lateral orbital rim. They are added to a repair to prevent ectropion." },
  { term: "Snap-back and distraction tests", also: ["snap-back", "distraction tests", "snap-back test"], def: "Bedside tests of lower-lid laxity. Pull the lid down and let go: it should snap back at once without a blink. Pull it forward: more than about 6–8 mm off the globe is lax. A lax lid is likely to develop ectropion after surgery." },
  { term: "Frost suture", def: "A temporary suture from the lower lid margin taped or stitched to the brow, holding the lid up on stretch for a few days to counter swelling and scar contraction." },
  { term: "Levator aponeurosis", def: "The tendon of the muscle that raises the upper eyelid. It fans out into the upper tarsus and the skin of the lid crease; if it is cut the lid droops (ptosis)." },
  { term: "Orbital septum", def: "The thin fibrous sheet running from the orbital rim into the eyelid, holding the orbital fat back. Fat appearing in an eyelid wound means the septum has been breached." },
  { term: "Punctum and canaliculus", also: ["canaliculi", "canaliculus", "puncta", "punctum"], def: "Tears enter a small opening (punctum) near the inner end of each lid margin and run through a fine tube (canaliculus) in the margin to the lacrimal sac. A cut canaliculus is repaired over a stent to prevent a permanently watery eye.", find: "lacrimal canaliculus laceration" },
  { term: "Medial canthal tendon", def: "The fibrous band anchoring the inner ends of both eyelids to the bone beside the nose. The lacrimal sac sits just behind it." },
  { term: "Whitnall's tubercle", def: "A small bony bump just inside the lateral orbital rim where the lateral canthal tendon attaches. Repairs re-anchor the lid to the periosteum here." },

  // --- Nose ----------------------------------------------------------------------------------
  { term: "Internal nasal valve", also: ["internal valve"], def: "The narrowest part of the nasal airway, between the septum and the lower edge of the upper lateral cartilage, under the lower sidewall. Pulling or pushing the sidewall inward here blocks breathing on that side." },
  { term: "External nasal valve", also: ["external valve"], def: "The nostril opening itself, framed by the ala, columella and sill. A weak or scarred ala collapses inward on breathing in." },
  { term: "Alar groove", also: ["alar crease", "alar-facial sulcus", "nasofacial sulcus"], def: "The creases that outline the nose: the alar groove (crease) curves over the top of the ala, the alar-facial sulcus separates ala from cheek, and the nasofacial sulcus separates sidewall from cheek. They hide scars well but are flattened by any flap that crosses them." },
  { term: "Rhinion", def: "The point on the nasal dorsum where the nasal bones meet the cartilage. The skin is thinnest here." },
  { term: "Vestibular stenosis", def: "Narrowing of the nostril by scar after a wound that runs around its circumference." },
  { term: "Vibrissae", def: "The coarse hairs just inside the nostril." },

  // --- Lip ------------------------------------------------------------------------------------
  { term: "Vermilion", also: ["vermilion border", "vermilion–cutaneous junction"], def: "The red part of the lip. Its sharp junction with the skin (the vermilion border) must be re-aligned exactly — a 1 mm step is visible — so it is marked with ink before local anaesthetic blurs it." },
  { term: "Wet–dry line", def: "The line on the lip where the dry outer vermilion meets the moist inner mucosa, roughly where the lips touch." },
  { term: "Cupid's bow", def: "The double curve of the upper vermilion border beneath the philtrum." },
  { term: "Philtrum", also: ["philtral columns", "philtral column", "philtral"], def: "The central groove of the upper lip, bounded by two vertical ridges (philtral columns). It is a cosmetic subunit in its own right." },
  { term: "Oral commissure", also: ["commissure"], def: "The corner of the mouth, where the upper and lower lips meet." },
  { term: "Microstomia", def: "An abnormally small mouth opening, which can follow lip reconstruction that borrows tissue from the remaining lip." },

  // --- Ear ------------------------------------------------------------------------------------
  { term: "Chondritis", def: "Inflammation or infection of cartilage. On the ear it is painful, slow to settle and can destroy the cartilage framework; keeping exposed cartilage covered and moist helps prevent it." },
  { term: "Tragal pointer", def: "The medial tip of the tragal cartilage, which points towards the main trunk of the facial nerve about 1 cm deeper and slightly below it." },
  { term: "Arnold's nerve", also: ["Arnold's n.", "auricular branch of the vagus"], def: "The auricular branch of the vagus nerve, supplying the conchal bowl and part of the ear canal. Stimulating it can trigger coughing or fainting." },
  { term: "Ring block", also: ["ring-block"], def: "Local anaesthetic infiltrated in a ring around the base of a structure (ear, nose, digit, scalp lesion) to numb everything beyond it." },
  { term: "Fissures of Santorini", def: "Natural gaps in the cartilage of the outer ear canal through which tumour or infection can spread forward into the parotid." },

  // --- Named landmarks ---------------------------------------------------------------------------
  { term: "Pitanguy's line", def: "A line from 0.5 cm below the tragus to 1.5 cm above the outer end of the eyebrow. It marks the course of the temporal branch of the facial nerve across the temple." },
  { term: "Erb's point", def: "The spot at about the middle of the back edge of sternocleidomastoid where the cutaneous nerves of the neck emerge. The spinal accessory nerve comes out within 1–2 cm above it and crosses the posterior triangle just under the skin.", find: "Erb's point spinal accessory nerve" },
  { term: "McKinney's point", def: "The point on the middle of sternocleidomastoid, 6.5 cm below the ear canal, where the great auricular nerve crosses the muscle." },
  { term: "Seckel's danger zones", also: ["Seckel zone", "Seckel"], def: "Seven areas of the face, described by Brooke Seckel, where a nerve lies superficially enough to be cut during facial surgery: great auricular, temporal, marginal mandibular, zygomatic and buccal, supraorbital and supratrochlear, infraorbital, and mental.", find: "facial danger zones" },
  { term: "Posterior triangle", also: ["posterior triangle of the neck"], def: "The area of the side of the neck between the back edge of sternocleidomastoid, the front edge of trapezius and the clavicle. The spinal accessory nerve crosses it with very little cover.", find: "posterior triangle of the neck" },
  { term: "Stensen's duct", also: ["parotid duct", "Stensen"], def: "The duct carrying saliva from the parotid gland across the cheek to open inside the mouth opposite the upper second molar." },
  { term: "Antegonial notch", also: ["anterior edge of masseter", "anterior border of masseter"], def: "The shallow dip on the lower border of the mandible just in front of the masseter muscle, where the facial artery pulse can be felt and the marginal mandibular nerve crosses." },
  { term: "Mastoid", also: ["mastoid tip", "mastoid process"], def: "The bony prominence behind the earlobe. Sternocleidomastoid attaches to it, and the facial nerve leaves the skull just in front of it." },
  { term: "Anatomical snuffbox", also: ["snuffbox"], def: "The hollow on the thumb side of the back of the wrist, seen when the thumb is extended. The radial artery crosses its floor and the superficial radial nerve and cephalic vein cross its roof." },
  { term: "Kaplan's cardinal line", also: ["Kaplan's line"], def: "A line drawn across the palm from the first web space towards the hook of the hamate, used to locate the recurrent motor branch of the median nerve and the palmar arches." },
  { term: "Guyon's canal", def: "The tunnel on the little-finger side of the wrist, beside the pisiform bone, through which the ulnar nerve and artery enter the hand." },
  { term: "Carpal tunnel", def: "The tunnel at the wrist, under the flexor retinaculum, carrying the median nerve and the finger flexor tendons into the hand." },
  { term: "Cubital tunnel", def: "The groove behind the medial epicondyle of the elbow ('funny bone') where the ulnar nerve lies directly under the skin." },
  { term: "Tarsal tunnel", def: "The tunnel behind the medial malleolus, under the flexor retinaculum, carrying the tibial nerve and posterior tibial vessels into the foot." },
  { term: "Femoral triangle", def: "The area at the top of the front of the thigh, below the inguinal ligament, containing the femoral nerve, artery and vein (lateral to medial) and the inguinal lymph nodes." },
  { term: "Popliteal fossa", def: "The diamond-shaped hollow behind the knee containing the popliteal vessels and the tibial and common peroneal nerves." },
  { term: "Sappey's line", def: "A line around the trunk from just above the umbilicus to the L2 vertebra. Skin above it tends to drain to the axillary nodes and skin below it to the inguinal nodes; near the line, and near the midline, drainage is unpredictable." },

  // --- Lymph nodes ----------------------------------------------------------------------------------
  { term: "First-echelon nodes", also: ["first-echelon", "first echelon"], def: "The first group of lymph nodes that a patch of skin drains to — the nodes to examine when following a patient with squamous cell carcinoma or melanoma at that site." },
  { term: "Neck node levels", also: ["level II", "level V", "level Ia", "level Ib", "levels I–IV", "levels II–IV", "level I"], def: "Neck lymph nodes are grouped by level: I submental (Ia) and submandibular (Ib); II, III and IV upper, middle and lower jugular chain; V posterior triangle; VI central compartment.", find: "cervical lymph node levels" },
  { term: "Epitrochlear node", also: ["epitrochlear"], def: "A lymph node on the inner side of the arm just above the elbow, draining the ulnar side of the hand and forearm." },
  { term: "Lymphocele", def: "A collection of lymph in a wound after lymphatic channels are cut, most often in the groin or axilla." },
  { term: "Sialocele", also: ["salivary fistula", "salivary–cutaneous fistula"], def: "A collection of saliva under the skin after injury to the parotid gland or duct. If it drains through the wound it becomes a salivary fistula." },

  // --- Complications and nerve injury -----------------------------------------------------------------
  { term: "Neuroma", also: ["neuromas"], def: "A tender knot of disorganised nerve fibres that forms at the cut end of a nerve. It causes sharp, electric pain when touched or knocked." },
  { term: "Dysaesthesia", also: ["dysesthesia", "paraesthesia"], def: "Unpleasant abnormal sensation — burning, tingling or crawling — in the territory of an injured sensory nerve." },
  { term: "Pseudoaneurysm", def: "A pulsating blood-filled swelling that forms when a hole in an artery is contained only by the surrounding tissue. It can follow a partly cut superficial temporal artery." },
  { term: "Brow ptosis", also: ["ptosis"], def: "Drooping. Brow ptosis follows injury to the temporal branch of the facial nerve; eyelid ptosis follows injury to the levator muscle or its aponeurosis." },
  { term: "Winged scapula", def: "The shoulder blade lifting off the chest wall. After spinal accessory nerve injury the paralysed trapezius lets the shoulder droop and the scapula rotate outward." },
  { term: "Mallet finger", also: ["mallet", "mallet deformity"], def: "A fingertip that droops and cannot be straightened, caused by division of the extensor tendon where it attaches to the last finger bone." },
  { term: "Foot drop", def: "Inability to lift the front of the foot, so the toes drag when walking. It follows injury to the common peroneal nerve." },
  { term: "Meralgia paraesthetica", def: "Burning, tingling or numbness of the outer thigh from compression or injury of the lateral femoral cutaneous nerve." },
  { term: "Vasovagal episode", also: ["vasovagal"], def: "A faint: a reflex drop in heart rate and blood pressure causing pallor, sweating, nausea and brief loss of consciousness." },
  { term: "Dehiscence", def: "A sutured wound coming apart, from tension, movement, infection or bleeding beneath it." },
  { term: "Contracture", also: ["scar contracture", "contract into bands"], def: "Shortening of a scar that restricts movement or distorts nearby structures, typical of straight scars crossing joint creases." },
  { term: "Allen's test", def: "A bedside check that the hand can survive on one of its two arteries: compress both radial and ulnar arteries, have the patient clench to blanch the hand, then release one artery and watch colour return within a few seconds." },

  // --- Nail ---------------------------------------------------------------------------------------------
  { term: "Nail matrix", also: ["matrix"], def: "The tissue under the proximal nail fold that produces the nail plate. Damage to it causes permanent nail deformity." },
  { term: "Lunula", def: "The pale half-moon at the base of the nail: the visible, most distal part of the matrix." },
  { term: "Eponychium", def: "The undersurface of the proximal nail fold, lying on the new nail. The term is often used loosely for the cuticle." },
  { term: "Hyponychium", def: "The skin under the free edge of the nail that seals the nail bed to the fingertip." },
  { term: "Onycholysis", def: "Separation of the nail plate from the nail bed, starting at the free edge; the detached part looks white or yellow." },
  { term: "Longitudinal melanonychia", also: ["melanonychia", "pigmented band"], def: "A brown or black stripe running the length of the nail, produced by pigment-making cells in the matrix. Most are benign, but a wide, dark, irregular or changing band in one nail needs a matrix biopsy to exclude melanoma.", find: "longitudinal melanonychia" },
  { term: "Erythronychia", def: "A red stripe running the length of the nail. In a single nail it may mark a benign tumour (onychopapilloma, glomus tumour) or squamous cell carcinoma." },
  { term: "Hutchinson's sign", def: "Pigment spreading from a pigmented nail band on to the skin of the nail folds — a warning sign of subungual melanoma." },
  { term: "Matricectomy", def: "Destroying or removing part or all of the nail matrix, surgically or with phenol, so that part of the nail does not regrow. Used for ingrown toenails." },
  { term: "Digital block", also: ["transthecal"], def: "Anaesthesia of a whole finger or toe by injecting at its base: either into the web space on each side to reach the digital nerves, or as a single palmar injection into the flexor tendon sheath (transthecal).", find: "digital nerve block" },
  { term: "Myxoid cyst", also: ["Digital myxoid (mucous) cysts", "digital myxoid cyst", "digital myxoid cysts", "mucous cyst"], def: "A small jelly-filled cyst on the back of the fingertip near the nail, connected to the end joint of the finger and usually associated with osteoarthritis. It can press a groove into the nail." },
  { term: "En bloc excision", also: ["en bloc", "en bloc nail-unit excision"], def: "Removing a structure in one piece. En bloc nail-unit excision takes the nail folds, matrix and bed off the bone together, as a tissue-sparing alternative to amputation for nail tumours that have not reached bone." },
  { term: "Bruner incision", also: ["Bruner", "mid-lateral", "Bruner zig-zag"], def: "Incisions designed to avoid a straight scar across the finger creases: a Bruner incision zig-zags across the palm side from crease to crease; a mid-lateral incision runs along the side of the finger behind the nerve and artery." },
  { term: "Glabrous skin", also: ["glabrous"], def: "The thick, hairless, ridged skin of the palms and soles." },

  // --- Miscellaneous ---------------------------------------------------------------------------------------
  { term: "Rhytids", also: ["rhytid"], def: "Wrinkles." },
  { term: "Sebaceous skin", also: ["sebaceous"], def: "Thick, oily skin with large pores, typical of the lower nose and chin. It is stiff, holds sutures poorly, and scars tend to be depressed or to pin-cushion." },
  { term: "Actinic cheilitis", def: "Sun damage of the lip, usually the lower: scaly, pale, blurred vermilion. It is the lip's equivalent of actinic keratosis and can progress to squamous cell carcinoma." },
  { term: "Compression therapy", also: ["Unna boot", "multilayer bandaging", "compression"], def: "Graduated pressure on the lower leg from an Unna boot (a zinc-paste bandage) or layered bandages. It controls swelling and markedly improves healing of leg wounds — after checking the arterial supply is adequate." },
  { term: "Off-loading", also: ["off-load"], def: "Keeping weight and pressure off a healing wound on the foot or buttock, with crutches, special footwear or padding." },
  { term: "Arcade", also: ["arcade", "arcades"], def: "An arch formed where two vessels join end to end, such as the arterial arcades running along each eyelid margin and around each lip." },
  { term: "Perforators", also: ["perforator"], def: "Small arteries that pass up through muscle or fascia to supply the overlying skin. A flap centred on a perforator can be moved on a narrow pedicle." },
];

// ---------------------------------------------------------------------------
// Finding terms in running text
// ---------------------------------------------------------------------------
const isLetter = (ch) => !!ch && /[A-Za-zÀ-ÿ0-9]/.test(ch);
const FORMS = GLOSSARY.flatMap((entry) => [entry.term, ...(entry.also || [])].map((form) => ({ form: form.toLowerCase(), entry })))
  .sort((a, b) => b.form.length - a.form.length);

/**
 * Split `text` into plain strings and { text, entry } pieces for glossary terms.
 * Longer forms win over shorter ones, and each entry is linked once per text.
 */
export function annotate(text) {
  const lower = text.toLowerCase();
  const taken = new Array(text.length).fill(false);
  const used = new Set();
  const hits = [];
  for (const { form, entry } of FORMS) {
    if (used.has(entry)) continue;
    let from = 0;
    while (from <= lower.length - form.length) {
      const i = lower.indexOf(form, from);
      if (i < 0) break;
      const j = i + form.length;
      const free = !isLetter(lower[i - 1]) && !isLetter(lower[j]) && !taken.slice(i, j).some(Boolean);
      if (free) {
        for (let k = i; k < j; k++) taken[k] = true;
        hits.push({ i, j, entry });
        used.add(entry);
        break;
      }
      from = i + 1;
    }
  }
  hits.sort((a, b) => a.i - b.i);
  const out = [];
  let at = 0;
  for (const h of hits) {
    if (h.i > at) out.push(text.slice(at, h.i));
    out.push({ text: text.slice(h.i, h.j), entry: h.entry });
    at = h.j;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}
