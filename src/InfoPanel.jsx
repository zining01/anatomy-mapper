// The "Surgical reference" card: notes for the region or structure in focus.
import { LAYERS, RIGHT, LEFT } from "./views/common.js";
import { STRUCTURES, RISK } from "./reference/structures.js";
import { useState } from "react";
import { AUC, infoFor } from "./reference/regions.js";
import { GLOSSARY, annotate, lookupUrl } from "./reference/glossary.js";

const MUTED = "#7a6a5c";
const sideWord = (key) => (key === RIGHT.key ? RIGHT.Side : key === LEFT.key ? LEFT.Side : "");

/** "Right temporal branch of facial n." — prefix the side and lower-case the first word unless it is a proper name. */
export function structureName(id, sideKey) {
  const s = STRUCTURES[id];
  if (!s) return id;
  const side = sideWord(sideKey);
  if (!side) return s.name;
  const keepCase = /^(Erb|Stensen|[A-Z]{2})/.test(s.name);
  return `${side} ${keepCase ? s.name : s.name[0].toLowerCase() + s.name.slice(1)}`;
}

const chip = (color, filled) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "2px 9px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.5,
  border: `1px solid ${color}`,
  background: filled ? color : "#fff",
  color: filled ? "#fff" : color,
  whiteSpace: "nowrap",
});

function Definition({ entry, onClose }) {
  return (
    <span style={{ display: "block", margin: "6px 0 4px", padding: "8px 10px", borderRadius: 8, background: "#f4f0fb", borderLeft: "3px solid #6a45c2", fontSize: 13, lineHeight: 1.45, color: "#2a2320" }}>
      <b>{entry.term}.</b> {entry.def}{" "}
      <a href={lookupUrl(entry)} target="_blank" rel="noopener noreferrer" style={{ color: "#6a45c2", whiteSpace: "nowrap" }}>
        Read more (NCBI Bookshelf) ↗
      </a>
      {onClose && (
        <button onClick={onClose} style={{ marginLeft: 8, border: "none", background: "none", color: MUTED, cursor: "pointer", fontSize: 12, padding: 0 }}>
          hide
        </button>
      )}
    </span>
  );
}

/** Running text with glossary terms turned into buttons; clicking one shows its definition underneath. */
function Gloss({ text }) {
  const [open, setOpen] = useState(null);
  if (!text) return null;
  const pieces = annotate(text);
  return (
    <>
      {pieces.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <button key={i} className="am-term" aria-expanded={open === p.entry} onClick={() => setOpen(open === p.entry ? null : p.entry)}>
            {p.text}
          </button>
        )
      )}
      {open && <Definition entry={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.6, color: "#a3917f", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 1 }}>{typeof children === "string" ? <Gloss text={children} /> : children}</div>
    </div>
  );
}

const List = ({ items }) =>
  items && items.length ? (
    <ul style={{ margin: "2px 0 0", paddingLeft: 18 }}>
      {items.map((t, i) => (
        <li key={i} style={{ marginBottom: 3 }}><Gloss text={t} /></li>
      ))}
    </ul>
  ) : null;

function StructureChip({ id, sideKey, onPick }) {
  const s = STRUCTURES[id];
  if (!s) return null;
  const color = RISK[s.risk]?.color || MUTED;
  return (
    <button
      onClick={() => onPick(id, sideKey)}
      title={s.summary}
      style={{ ...chip(color, s.risk === "high"), cursor: "pointer", whiteSpace: "normal", textAlign: "left", font: "inherit", fontSize: 12, fontWeight: 600 }}
    >
      {s.risk === "high" && <span aria-hidden="true">⚠</span>}
      {s.name}
    </button>
  );
}

function RegionInfo({ region, onPickStructure }) {
  const info = infoFor(region);
  if (!info)
    return (
      <p style={{ color: MUTED, fontSize: 13, margin: "6px 0 0" }}>
        {region.group === "dermatome" ? "Dermatome maps are approximate: adjacent levels overlap and individuals vary." : "No surgical notes for this region yet."}
      </p>
    );
  const auc = AUC[info.auc];
  return (
    <div>
      {auc && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
          <span style={chip(auc.color, true)} title={auc.text}>Mohs AUC area {info.auc}</span>
          {info.aucNote && <span style={{ fontSize: 12, color: MUTED }}>{info.aucNote}</span>}
        </div>
      )}
      {(info.alerts || []).map((a, i) => (
        <div key={i} style={{ marginTop: 8, padding: "7px 10px", borderRadius: 8, background: "#fdecea", borderLeft: "3px solid #c2182f", color: "#7d1320", fontSize: 13, lineHeight: 1.4 }}>
          <Gloss text={a} />
        </div>
      ))}
      {info.structures && info.structures.length > 0 && (
        <Row label="Structures at risk — tap to show">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 3 }}>
            {info.structures.map((id) => (
              <StructureChip key={id} id={id} sideKey={region.sideKey} onPick={onPickStructure} />
            ))}
          </div>
        </Row>
      )}
      <Row label="Undermining plane">{info.plane}</Row>
      <Row label="Sensory supply">{info.sensory}</Row>
      <Row label="Arterial supply">{info.artery}</Row>
      <Row label="Lymphatic drainage">{info.lymph}</Row>
      {info.notes && info.notes.length > 0 && <Row label="Surgical notes"><List items={info.notes} /></Row>}
      {info.repair && info.repair.length > 0 && <Row label="Repair options"><List items={info.repair} /></Row>}
    </div>
  );
}

function StructureInfo({ id }) {
  const s = STRUCTURES[id];
  if (!s) return null;
  const risk = RISK[s.risk];
  const layer = LAYERS[s.layer];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
        {risk && <span style={chip(risk.color, s.risk === "high")}>{risk.label}</span>}
        {layer && <span style={chip(MUTED, false)}>{layer.label}</span>}
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.45, margin: "8px 0 0" }}><Gloss text={s.summary} /></p>
      <Row label="Surface landmarks">{s.landmark}</Row>
      <Row label="Depth / plane">{s.depth}</Row>
      <Row label="If injured">{s.injury}</Row>
      <Row label="Staying safe">{s.avoid}</Row>
      <Row label="Nerve block">{s.block}</Row>
    </div>
  );
}

/**
 * focus: { kind: "region", region } | { kind: "structure", id, sideKey } | null
 * viewStructures: [{ id, sideKey }] present in the current view, for the index shown when nothing is in focus.
 */
function GlossaryList() {
  const [open, setOpen] = useState(null);
  const sorted = GLOSSARY.slice().sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div style={{ marginTop: 8, maxHeight: "60vh", overflowY: "auto" }}>
      {sorted.map((entry) => (
        <div key={entry.term} style={{ borderTop: "1px solid #f2ece5", padding: "5px 0" }}>
          <button className="am-term" style={{ fontWeight: 600 }} aria-expanded={open === entry} onClick={() => setOpen(open === entry ? null : entry)}>
            {entry.term}
          </button>
          {open === entry && <Definition entry={entry} />}
        </div>
      ))}
    </div>
  );
}

export default function InfoPanel({ focus, pinned, viewStructures, onPickStructure, onClear }) {
  const [glossary, setGlossary] = useState(false);
  const term = focus && focus.kind === "term" ? GLOSSARY.find((g) => g.term === focus.term) : null;
  const title = !focus ? "Surgical reference" : focus.kind === "region" ? focus.region.name : focus.kind === "term" ? "Glossary" : structureName(focus.id, focus.sideKey);
  return (
    <div style={{ background: "#fff", border: "1px solid #e6ddd3", borderRadius: 12, padding: 14, marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{title}</span>
        {focus && pinned && (
          <button onClick={onClear} style={{ fontSize: 12, background: "none", border: "none", color: "#e4572e", cursor: "pointer", whiteSpace: "nowrap" }}>
            Close
          </button>
        )}
      </div>
      {term && <Definition entry={term} />}
      {focus && focus.kind !== "term" && (
        <p style={{ color: MUTED, fontSize: 11.5, margin: "4px 0 0" }}>
          <span className="am-term" style={{ cursor: "default" }}>Underlined terms</span> open a definition.
        </p>
      )}
      {!focus && (
        <div>
          <p style={{ color: MUTED, fontSize: 13, margin: "6px 0 0", lineHeight: 1.45 }}>
            Click a region for its danger structures, undermining plane, nerve and blood supply, lymphatic drainage and repair options. Click a nerve,
            vessel or <b style={{ color: LAYERS.danger.color }}>!</b> marker for landmarks and depth. Underlined terms in the notes open a definition.
          </p>
          <button onClick={() => setGlossary((g) => !g)} style={{ ...chip("#6a45c2", glossary), cursor: "pointer", marginTop: 8, font: "inherit", fontSize: 12, fontWeight: 600 }}>
            {glossary ? "Hide glossary" : `Glossary (${GLOSSARY.length} terms)`}
          </button>
          {glossary && <GlossaryList />}
          {Object.entries(LAYERS).map(([key, layer]) => {
            const ids = [...new Set(viewStructures.filter((s) => s.layer === key && STRUCTURES[s.id]).map((s) => s.id))];
            if (!ids.length) return null;
            return (
              <Row key={key} label={layer.label}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 3 }}>
                  {ids.map((id) => (
                    <StructureChip key={id} id={id} sideKey={null} onPick={onPickStructure} />
                  ))}
                </div>
              </Row>
            );
          })}
        </div>
      )}
      {focus && focus.kind === "region" && <RegionInfo region={focus.region} onPickStructure={onPickStructure} />}
      {focus && focus.kind === "structure" && <StructureInfo id={focus.id} />}
    </div>
  );
}
