import { useEffect, useMemo, useState } from "react";
import { VIEWS, VIEW_GROUPS, HEAD_GRID, FAMILIES } from "./views/index.js";
import { C, GROUPS, LAYERS } from "./views/common.js";
import { STRUCTURES } from "./reference/structures.js";
import { AUC, infoFor } from "./reference/regions.js";
import InfoPanel, { structureName } from "./InfoPanel.jsx";

const ACCENT = "#e4572e";
const BROWN = "#8a5a3c";
const LAYER_ORDER = ["glands", "danger", "rstl", "vessels", "sensory", "motor"];
const VEIN = "#2f66c4";

// Line styles for the overlay layers: [colour, width, casing colour, casing width].
const LINE_STYLE = {
  motor: ["#f2b705", 1.05, "#5c4500", 1.9],
  sensory: [LAYERS.sensory.color, 1, "#fff", 2],
  vessels: [LAYERS.vessels.color, 1.2, "#fff", 2.1],
  glands: [LAYERS.glands.color, 1.5, "#fff", 2.4],
  danger: [LAYERS.danger.color, 1.2, "#fff", 2.1],
};

const hashParams = () => Object.fromEntries(window.location.hash.replace(/^#/, "").split("&").map((kv) => kv.split("=").map(decodeURIComponent)));

const initialView = () => {
  const v = hashParams().view;
  return v && VIEWS[v] ? v : "bodyAnterior";
};

const initialLayers = () => {
  const fromHash = hashParams().layers;
  let saved = null;
  try {
    saved = JSON.parse(window.localStorage.getItem("am-layers"));
  } catch {
    /* storage unavailable */
  }
  return Object.fromEntries(
    Object.entries(LAYERS).map(([k, l]) => [k, fromHash != null ? fromHash.split(",").includes(k) : saved && k in saved ? !!saved[k] : !!l.on])
  );
};

// Deep link: #view=headRight&focus=fa-temple-r (a region id) or &focus=vii-temporal (a structure id).
const initialFocus = () => {
  const f = hashParams().focus;
  if (!f) return null;
  if (STRUCTURES[f]) return { kind: "structure", id: f, sideKey: null };
  return Object.values(VIEWS).some((v) => v.regions.some((r) => r.id === f)) ? { kind: "region", id: f } : null;
};

const withAlpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const structKey = (id, sideKey) => `s:${id}:${sideKey || ""}`;

export default function App() {
  const [view, setView] = useState(initialView);
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState(null); // region id, or structKey(...)
  const [active, setActive] = useState(initialFocus); // { kind: "region", id } | { kind: "structure", id, sideKey }
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAllHead, setShowAllHead] = useState(false);
  const [tint, setTint] = useState(true);
  const [labels, setLabels] = useState(true);
  const [withAuc, setWithAuc] = useState(false);
  const [layers, setLayers] = useState(initialLayers);
  const [zoom, setZoom] = useState(() => Number(hashParams().zoom) || 0); // 0 = whole figure, n = view.zooms[n - 1]

  useEffect(() => {
    window.history.replaceState(null, "", "#view=" + view);
  }, [view]);
  useEffect(() => {
    try {
      window.localStorage.setItem("am-layers", JSON.stringify(layers));
    } catch {
      /* storage unavailable */
    }
  }, [layers]);

  const current = VIEWS[view];

  // Every region in every view, for search. Regions shared between views
  // appear under the same id; keep the first occurrence only.
  const allRegions = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const v of Object.values(VIEWS))
      for (const r of v.regions) {
        if (seen.has(r.id) || r.navigate) continue;
        seen.add(r.id);
        out.push({ ...r, view: v.key, viewLabel: v.label });
      }
    return out;
  }, []);
  const byId = useMemo(() => Object.fromEntries(Object.values(VIEWS).flatMap((v) => v.regions.map((r) => [r.id, r]))), []);

  // Which views draw each structure (for search and for "tap to show").
  const structureViews = useMemo(() => {
    const out = {};
    for (const v of Object.values(VIEWS))
      for (const it of v.overlays || []) {
        if (!STRUCTURES[it.id]) continue;
        const list = (out[it.id] = out[it.id] || []);
        if (!list.some((e) => e.view === v.key && e.sideKey === it.sideKey)) list.push({ view: v.key, sideKey: it.sideKey });
      }
    return out;
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const regions = allRegions.filter((r) => r.name.toLowerCase().includes(q) || r.aliases.some((a) => a.includes(q)));
    const structures = Object.entries(STRUCTURES)
      .filter(([id, s]) => structureViews[id] && (s.name.toLowerCase().includes(q) || (q.length > 2 && (s.landmark || "").toLowerCase().includes(q))))
      .map(([id, s]) => ({ id, name: s.name, structure: true, viewLabel: LAYERS[s.layer].label }));
    return [...regions.slice(0, 10), ...structures.slice(0, 6)];
  }, [query, allRegions, structureViews]);

  const isSelected = (id) => selected.some((s) => s.id === id);
  const toggle = (r) =>
    setSelected((prev) => (prev.some((s) => s.id === r.id) ? prev.filter((s) => s.id !== r.id) : [...prev, { id: r.id, name: r.name }]));

  const openView = (key) => {
    setView(key);
    setShowAllHead(false);
    setHovered(null);
    setZoom(0);
  };

  const pickRegion = (r) => {
    toggle(r);
    setActive({ kind: "region", id: r.id });
  };

  // Put a structure in focus: switch its layer on and, if the current view does not draw it, open one that does.
  const pickStructure = (id, sideKey) => {
    const s = STRUCTURES[id];
    if (!s) return;
    setActive({ kind: "structure", id, sideKey: sideKey || null });
    setLayers((prev) => (prev[s.layer] ? prev : { ...prev, [s.layer]: true }));
    const where = structureViews[id] || [];
    const visibleHere = showAllHead ? where.some((w) => HEAD_GRID.includes(w.view)) : where.some((w) => w.view === view);
    if (!visibleHere && where.length) openView((where.find((w) => sideKey && w.sideKey === sideKey) || where[0]).view);
  };

  const label = (s) => {
    if (!withAuc) return s.name;
    const info = infoFor(byId[s.id]);
    return info && info.auc ? `${s.name} (Mohs AUC area ${info.auc})` : s.name;
  };
  const snippet = selected.map(label).join("; ");
  const copy = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable (e.g. file:// in some browsers) */
    }
  };

  // The reference card shows the last item clicked. Hovering only names the item above the
  // figure and highlights it: letting hover drive the card made the page reflow under the
  // pointer, which changed what was hovered and made the card flicker.
  const hoverFocus = (() => {
    if (!hovered) return null;
    if (hovered.startsWith("s:")) {
      const [, id, sideKey] = hovered.split(":");
      return { kind: "structure", id, sideKey: sideKey || null };
    }
    return byId[hovered] && !byId[hovered].navigate ? { kind: "region", region: byId[hovered] } : null;
  })();
  const pinnedFocus = !active ? null : active.kind === "region" ? byId[active.id] && { kind: "region", region: byId[active.id] } : active;
  const focus = pinnedFocus;
  const hoverName = !hovered ? null : hoverFocus ? (hoverFocus.kind === "region" ? hoverFocus.region.name : structureName(hoverFocus.id, hoverFocus.sideKey)) : byId[hovered]?.name;

  const sameStructure = (it, f) => f && f.kind === "structure" && f.id === it.id && (!f.sideKey || !it.sideKey || f.sideKey === it.sideKey);
  const isHot = (it) => sameStructure(it, hoverFocus) || sameStructure(it, pinnedFocus);

  // -------------------------------------------------------------------------
  // Figure
  // -------------------------------------------------------------------------
  const interactive = (r, focusable = true) => ({
    className: "am-region",
    ...(focusable && { role: "button", tabIndex: 0, "aria-label": r.name, "aria-pressed": isSelected(r.id) }),
    onClick: () => (r.navigate ? openView(r.link) : pickRegion(r)),
    onDoubleClick: () => r.link && !r.navigate && openView(r.link),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (r.navigate) openView(r.link);
        else pickRegion(r);
      }
    },
    onMouseEnter: () => setHovered(r.id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(r.id),
    onBlur: () => setHovered(null),
  });

  const structProps = (it) => ({
    className: "am-struct",
    role: "button",
    "aria-label": structureName(it.id, it.sideKey),
    onClick: () => pickStructure(it.id, it.sideKey),
    onMouseEnter: () => setHovered(structKey(it.id, it.sideKey)),
    onMouseLeave: () => setHovered(null),
  });

  const regionFill = (r) => {
    if (isSelected(r.id)) return withAlpha(ACCENT, 0.55);
    const color = GROUPS[r.group]?.color || GROUPS.body.color;
    if (hovered === r.id) return withAlpha(color, 0.42);
    return tint ? withAlpha(color, 0.13) : "transparent";
  };

  const dermFill = (r) => (isSelected(r.id) ? ACCENT : hovered === r.id ? r.colorHover : r.color);

  const dotColor = (r) => (isSelected(r.id) ? ACCENT : r.group === "dermatome" ? "#2a2320" : GROUPS[r.group]?.color || GROUPS.body.color);

  /** Nerves, vessels, ducts and danger zones. `w` scales stroke widths and markers. */
  const renderOverlays = (v, key, w) => {
    const items = (v.overlays || []).filter((it) => layers[it.layer] || (!it.passive && isHot(it)));
    if (!items.length) return {};
    const sorted = LAYER_ORDER.flatMap((l) => items.filter((it) => it.layer === l));
    const shapes = [];
    const markers = [];
    for (const it of sorted) {
      const hot = !it.passive && isHot(it);
      if (it.passive) {
        shapes.push(<path key={it.key} d={it.d} fill="none" stroke={LAYERS.rstl.color} strokeWidth={0.55 * w} strokeDasharray={`${2.4 * w} ${1.5 * w}`} pointerEvents="none" />);
      } else if (it.kind === "line") {
        const [color, width, casing, casingWidth] = LINE_STYLE[it.layer];
        const stroke = it.id.startsWith("v-") ? VEIN : color;
        shapes.push(
          <g key={it.key} {...structProps(it)} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={it.d} stroke="transparent" strokeWidth={5 * w} pointerEvents="stroke" />
            <path d={it.d} stroke={hot ? "#2a2320" : casing} strokeWidth={(hot ? casingWidth + 1.6 : casingWidth) * w} opacity={hot || it.layer === "motor" ? 1 : 0.8} />
            <path d={it.d} stroke={stroke} strokeWidth={(hot ? width + 0.5 : width) * w} />
          </g>
        );
      } else if (it.kind === "area") {
        const color = LAYERS[it.layer].color;
        shapes.push(
          <g key={it.key} {...structProps(it)}>
            <path d={it.d} fill={withAlpha(color, hot ? 0.45 : 0.25)} stroke={color} strokeWidth={(hot ? 1.4 : 0.8) * w} strokeDasharray={`${2 * w} ${1.4 * w}`} pointerEvents="none" />
            <path d={it.d} fill="none" stroke="transparent" strokeWidth={5 * w} pointerEvents="stroke" />
          </g>
        );
      } else if (it.kind === "zone") {
        const color = it.sensory ? LAYERS.sensory.color : LAYERS.danger.color;
        const fill = it.sensory ? withAlpha(color, hot ? 0.3 : 0.12) : it.soft ? withAlpha(color, hot ? 0.22 : 0.07) : `url(#${key}-hatch)`;
        shapes.push(
          <g key={it.key} pointerEvents="none">
            {hot && !it.sensory && !it.soft && <path d={it.d} fill={withAlpha(color, 0.25)} />}
            <path d={it.d} fill={fill} stroke={color} strokeWidth={(hot ? 1.5 : it.soft ? 0.6 : 0.8) * w} strokeDasharray={`${2.6 * w} ${1.6 * w}`} strokeLinejoin="round" />
          </g>
        );
      }
      if (it.passive || !it.anchor) continue;
      const [x, y] = it.anchor;
      if (it.kind === "zone" || it.layer === "danger") {
        const color = it.sensory ? LAYERS.sensory.color : LAYERS.danger.color;
        const r = (it.sensory || it.soft ? 3.1 : 4) * w * (hot ? 1.25 : 1);
        markers.push(
          <g key={"m" + it.key} {...structProps(it)}>
            <circle cx={x} cy={y} r={r * 1.7} fill="transparent" />
            <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth={0.8 * w} />
            <text x={x} y={y} fontSize={r * 1.5} textAnchor="middle" dominantBaseline="central" fill="#fff" fontWeight="800" fontFamily="system-ui, sans-serif" pointerEvents="none" style={{ userSelect: "none" }}>
              !
            </text>
          </g>
        );
      } else {
        const color = LINE_STYLE[it.layer][0];
        const r = 1.7 * w * (hot ? 1.5 : 1);
        markers.push(
          <g key={"m" + it.key} {...structProps(it)}>
            <circle cx={x} cy={y} r={4 * w} fill="transparent" />
            <circle cx={x} cy={y} r={r} fill="#fff" stroke={color} strokeWidth={0.9 * w} />
            <circle cx={x} cy={y} r={r * 0.4} fill={color} />
          </g>
        );
      }
    }
    return {
      shapes: (
      <>
        <defs>
          <pattern id={`${key}-hatch`} width={3.2 * w} height={3.2 * w} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2={3.2 * w} stroke={LAYERS.danger.color} strokeWidth={1.3 * w} opacity="0.5" />
          </pattern>
        </defs>
        {shapes}
      </>
      ),
      markers,
    };
  };

  const renderFigure = (key, small) => {
    const v = VIEWS[key];
    const { Under, Over } = v;
    const z = !small && zoom > 0 && v.zooms ? v.zooms[zoom - 1] : null;
    const viewBox = z ? z.viewBox : v.viewBox;
    // Zoomed views draw finer lines and smaller markers, but not fully in proportion.
    const k = z ? Math.max(0.3, Math.pow(Number(z.viewBox.split(" ")[2]) / Number(v.viewBox.split(" ")[2]), 0.8)) : 1;
    const dotR = (v.kind === "dots" ? 4 : v.kind === "dermatomes" ? 1.7 : 2.3) * k;
    // Lines sit under the region dots so the dots stay clickable; "!" markers and foramina sit on top.
    const overlay = renderOverlays(v, key, (v.kind === "dots" ? 1.35 : 1) * k);
    return (
      <div style={{ position: "relative", background: "#fff", border: "1px solid #e6ddd3", borderRadius: 12, padding: 10 }}>
        <div style={{ position: "absolute", top: 10, left: 12, right: 12, fontSize: 12.5, color: BROWN, fontWeight: 600, minHeight: 18 }}>
          {small || !hoverName ? v.label + (z ? ` · ${z.label.toLowerCase()}` : "") : hoverName}
          {!small && hovered && byId[hovered]?.link && !byId[hovered].navigate && (
            <span style={{ fontWeight: 400, color: "#a3917f" }}> · double-click for detailed view</span>
          )}
        </div>
        <svg viewBox={viewBox} style={{ width: "100%", height: "auto", maxHeight: small ? "46vh" : "76vh", display: "block", marginTop: 18 }}>
          {Under && <Under k={k} />}

          {v.kind === "regions" &&
            v.regions.map(
              (r, i) =>
                r.d && (
                  <g key={r.id + i} {...interactive(r)}>
                    <path d={r.d} fill={regionFill(r)} stroke={C.lineSoft} strokeWidth={0.6 * k} strokeLinejoin="round" />
                  </g>
                )
            )}

          {v.kind === "dermatomes" && (
            <>
              <defs>
                {Object.entries(v.clips).map(([id, paths]) => (
                  <clipPath key={id} id={`${key}-${id}`}>
                    {paths.map((d, i) => <path key={i} d={d} />)}
                  </clipPath>
                ))}
              </defs>
              <g clipPath={`url(#${key}-body)`}>
                {v.regions.map((r) => (
                  <g key={r.id} {...interactive(r)}>
                    {r.pieces.map((p, i) => (
                      <path key={i} d={p.d} clipPath={`url(#${key}-${p.clip})`} fill={dermFill(r)} stroke="#fff" strokeWidth="0.7" strokeLinejoin="round" />
                    ))}
                  </g>
                ))}
              </g>
            </>
          )}

          {Over && <Over k={k} />}

          {v.kind === "dermatomes" &&
            labels &&
            v.regions.flatMap((r) =>
              r.labels.map(([x, y], i) => (
                <text key={r.id + i} x={x} y={y} fontSize={r.labelSize || 7} textAnchor="middle" dominantBaseline="central"
                  fill={isSelected(r.id) ? "#fff" : "#2a2320"} fontWeight="600" fontFamily="system-ui, sans-serif" pointerEvents="none" style={{ userSelect: "none" }}>
                  {r.short}
                </text>
              ))
            )}

          {overlay.shapes}

          {v.regions.map((r, i) => {
            if (!r.dot) return null;
            const sel = isSelected(r.id);
            const hov = hovered === r.id;
            const [x, y] = r.dot;
            return (
              <g key={"dot-" + r.id + i} {...(v.kind === "dermatomes" ? { pointerEvents: "none" } : interactive(r, v.kind === "dots"))}>
                <circle cx={x} cy={y} r={(v.kind === "dots" ? 10 : 4) * k} fill="transparent" />
                <circle cx={x} cy={y} r={sel ? dotR * 1.5 : hov ? dotR * 1.3 : dotR} fill={dotColor(r)} stroke="#fff" strokeWidth={(v.kind === "dots" ? 1.4 : 0.8) * k} />
                {r.link && <circle cx={x} cy={y} r={dotR * 2.2} fill="none" stroke={GROUPS.body.color} strokeWidth={k} strokeDasharray={`${2 * k} ${2 * k}`} />}
              </g>
            );
          })}

          {overlay.markers}
        </svg>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Legend & toolbars
  // -------------------------------------------------------------------------
  const legend = (() => {
    if (current.kind === "dermatomes")
      return FAMILIES.map((f) => ({ label: f.label, color: f.swatch, square: true }));
    if (current.kind === "regions") {
      const used = new Set(current.regions.map((r) => r.group));
      return Object.entries(GROUPS)
        .filter(([k]) => used.has(k))
        .map(([, g]) => ({ label: g.label, color: g.color }));
    }
    return [{ label: "Body site", color: GROUPS.body.color }, { label: "Opens a detailed view", color: GROUPS.body.color, dashed: true }];
  })();

  const shownViews = showAllHead ? HEAD_GRID.map((k) => VIEWS[k]) : [current];
  const availableLayers = Object.keys(LAYERS).filter((l) => shownViews.some((v) => (v.overlays || []).some((it) => it.layer === l)));
  const viewStructures = shownViews.flatMap((v) => (v.overlays || []).filter((it) => !it.passive));
  const zooms = !showAllHead && current.zooms ? current.zooms : null;

  const btn = (active) => ({
    padding: "7px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid " + (active ? BROWN : "#d8ccc0"),
    background: active ? BROWN : "#fff",
    color: active ? "#fff" : "#4a3d33",
  });

  const pill = (on, color = BROWN) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid " + (on ? color : "#d8ccc0"),
    background: on ? withAlpha(color, 0.12) : "#fff",
    color: on ? "#2a2320" : "#8a7a6c",
  });

  const toggleChip = (on, set, text) => (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#6a5c50", cursor: "pointer" }}>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} />
      {text}
    </label>
  );

  const barLabel = { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#a3917f" };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f6f4f1", minHeight: "100vh", color: "#2a2320", padding: "24px 16px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 25, margin: 0, fontWeight: 700 }}>Anatomy Region Mapper</h1>
          <p style={{ margin: "4px 0 0", color: "#7a6a5c", fontSize: 14 }}>
            Click a region to add it to the note and see its surgical anatomy. Facial subunits follow the Gonzalez-Ulloa aesthetic units with Burget
            &amp; Menick nasal subunits; danger zones follow Seckel.
          </p>
        </header>

        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
          {VIEW_GROUPS.map((g) => (
            <div key={g.title}>
              <div style={{ ...barLabel, marginBottom: 6 }}>{g.title}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {g.keys.map((k) => (
                  <button key={k} onClick={() => openView(k)} style={btn(view === k && !showAllHead)}>
                    {VIEWS[k].short}
                  </button>
                ))}
                {g.title === "Head & neck" && (
                  <button onClick={() => setShowAllHead((v) => !v)} style={btn(showAllHead)}>
                    All
                  </button>
                )}
              </div>
            </div>
          ))}
        </nav>

        {(availableLayers.length > 0 || zooms) && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
            {availableLayers.length > 0 && <span style={barLabel}>Anatomy</span>}
            {availableLayers.map((l) => (
              <button key={l} onClick={() => setLayers((prev) => ({ ...prev, [l]: !prev[l] }))} aria-pressed={layers[l]} style={pill(layers[l], LAYERS[l].color)}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: layers[l] ? LAYERS[l].color : "#d8ccc0", display: "inline-block" }} />
                {LAYERS[l].label}
              </button>
            ))}
            {zooms && (
              <>
                <span style={{ ...barLabel, marginLeft: availableLayers.length ? 10 : 0 }}>Zoom</span>
                {[{ label: "Whole" }, ...zooms].map((z, i) => (
                  <button key={z.label} onClick={() => setZoom(i)} aria-pressed={zoom === i} style={pill(zoom === i)}>
                    {z.label}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 12, fontSize: 12, color: "#6a5c50" }}>
          {!showAllHead &&
            legend.map((l) => (
              <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: l.square ? 2 : "50%",
                    background: l.dashed ? "transparent" : l.color,
                    border: l.dashed ? `1px dashed ${l.color}` : "none",
                    display: "inline-block",
                  }}
                />
                {l.label}
              </span>
            ))}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT, display: "inline-block" }} /> Selected
          </span>
          <span style={{ flex: 1 }} />
          {(showAllHead || current.kind === "regions") && toggleChip(tint, setTint, "Tint subunits")}
          {!showAllHead && current.kind === "dermatomes" && toggleChip(labels, setLabels, "Show labels")}
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px", minWidth: 0 }}>
            {showAllHead ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                {HEAD_GRID.map((k) => (
                  <div key={k}>{renderFigure(k, true)}</div>
                ))}
              </div>
            ) : (
              renderFigure(view, false)
            )}
            <div style={{ fontSize: 11.5, color: "#a3917f", textAlign: "center", padding: "6px 0" }}>
              Left / right = patient's anatomical side. {current.note || ""}
            </div>
          </div>

          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <label htmlFor="am-search" style={{ fontSize: 13, fontWeight: 600, color: "#7a6a5c" }}>
              Search regions and structures
            </label>
            <input
              id="am-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. soft triangle, helix, Erb's point, T10"
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", marginTop: 6, marginBottom: 6, borderRadius: 8, border: "1px solid #d8ccc0", fontSize: 14 }}
            />
            {matches.length > 0 && (
              <div style={{ border: "1px solid #e6ddd3", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                {matches.map((m) => (
                  <div
                    key={(m.structure ? "s:" : "") + m.id}
                    onClick={() => {
                      if (m.structure) pickStructure(m.id, null);
                      else {
                        openView(m.view);
                        if (!isSelected(m.id)) toggle(m);
                        setActive({ kind: "region", id: m.id });
                      }
                      setQuery("");
                    }}
                    style={{ padding: "8px 12px", cursor: "pointer", fontSize: 14, borderBottom: "1px solid #f2ece5", background: "#fff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#faf6f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    {m.name} <span style={{ color: "#a3917f", fontSize: 12 }}>· {m.viewLabel}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: "#fff", border: "1px solid #e6ddd3", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Selected ({selected.length})</span>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} style={{ fontSize: 12, background: "none", border: "none", color: ACCENT, cursor: "pointer" }}>
                    Clear all
                  </button>
                )}
              </div>
              {selected.length === 0 ? (
                <p style={{ color: "#a3917f", fontSize: 13, margin: 0 }}>No regions selected yet. Click the figure.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selected.map((s) => (
                    <span
                      key={s.id}
                      onClick={() => setSelected((prev) => prev.filter((x) => x.id !== s.id))}
                      style={{ background: "#fce9e2", color: "#b23c17", padding: "4px 10px", borderRadius: 20, fontSize: 13, cursor: "pointer" }}
                      title="Remove"
                    >
                      {s.name} ✕
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 6px", gap: 8, flexWrap: "wrap" }}>
                <label htmlFor="am-snippet" style={{ fontSize: 13, fontWeight: 600, color: "#7a6a5c" }}>
                  Note snippet
                </label>
                {toggleChip(withAuc, setWithAuc, "Add Mohs AUC area")}
              </div>
              <textarea
                id="am-snippet"
                readOnly
                value={snippet}
                placeholder="Selected region names appear here…"
                style={{ width: "100%", boxSizing: "border-box", minHeight: 70, padding: 10, borderRadius: 8, border: "1px solid #d8ccc0", fontSize: 14, resize: "vertical", background: "#fbf9f6" }}
              />
              <button
                onClick={copy}
                disabled={!snippet}
                style={{ marginTop: 8, width: "100%", padding: 10, borderRadius: 8, border: "none", cursor: snippet ? "pointer" : "not-allowed", background: snippet ? "#2a2320" : "#d8ccc0", color: "#fff", fontSize: 14, fontWeight: 600 }}
              >
                {copied ? "Copied ✓" : "Copy snippet"}
              </button>
            </div>

            <InfoPanel focus={focus} pinned={!!pinnedFocus} viewStructures={viewStructures} onPickStructure={pickStructure} onClear={() => setActive(null)} />

            <p style={{ fontSize: 11, color: "#a3917f", marginTop: 12, lineHeight: 1.5 }}>
              A reference aid for trained clinicians, not a substitute for clinical judgement. Nerve and vessel courses are schematic adult averages
              and vary between individuals; tumour, scarring and previous surgery distort them further. Dermatomes also vary between individuals and
              published maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
