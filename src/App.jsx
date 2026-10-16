import { useEffect, useMemo, useState } from "react";
import { VIEWS, VIEW_GROUPS, HEAD_GRID, FAMILIES } from "./views/index.js";
import { C, GROUPS } from "./views/common.js";

const ACCENT = "#e4572e";
const BROWN = "#8a5a3c";

const initialView = () => {
  const m = /view=([A-Za-z]+)/.exec(window.location.hash);
  return m && VIEWS[m[1]] ? m[1] : "bodyAnterior";
};

const withAlpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export default function App() {
  const [view, setView] = useState(initialView);
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAllHead, setShowAllHead] = useState(false);
  const [tint, setTint] = useState(true);
  const [labels, setLabels] = useState(true);

  useEffect(() => {
    window.history.replaceState(null, "", "#view=" + view);
  }, [view]);

  const current = VIEWS[view];

  // Every region in every view, for search. Dermatomes appear in two views
  // under the same id; keep the first occurrence only.
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allRegions
      .filter((r) => r.name.toLowerCase().includes(q) || r.aliases.some((a) => a.includes(q)))
      .slice(0, 12);
  }, [query, allRegions]);

  const isSelected = (id) => selected.some((s) => s.id === id);
  const toggle = (r) =>
    setSelected((prev) => (prev.some((s) => s.id === r.id) ? prev.filter((s) => s.id !== r.id) : [...prev, { id: r.id, name: r.name }]));

  const openView = (key) => {
    setView(key);
    setShowAllHead(false);
    setHovered(null);
  };

  const snippet = selected.map((s) => s.name).join("; ");
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

  const hoverRegion = hovered ? byId[hovered] : null;

  // -------------------------------------------------------------------------
  // Figure
  // -------------------------------------------------------------------------
  const interactive = (r, focusable = true) => ({
    className: "am-region",
    ...(focusable && { role: "button", tabIndex: 0, "aria-label": r.name, "aria-pressed": isSelected(r.id) }),
    onClick: () => (r.navigate ? openView(r.link) : toggle(r)),
    onDoubleClick: () => r.link && !r.navigate && openView(r.link),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(r);
      }
    },
    onMouseEnter: () => setHovered(r.id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(r.id),
    onBlur: () => setHovered(null),
  });

  const regionFill = (r) => {
    if (isSelected(r.id)) return withAlpha(ACCENT, 0.55);
    const color = GROUPS[r.group]?.color || GROUPS.body.color;
    if (hovered === r.id) return withAlpha(color, 0.42);
    return tint ? withAlpha(color, 0.13) : "transparent";
  };

  const dermFill = (r) => (isSelected(r.id) ? ACCENT : hovered === r.id ? r.colorHover : r.color);

  const dotColor = (r) => (isSelected(r.id) ? ACCENT : r.group === "dermatome" ? "#2a2320" : GROUPS[r.group]?.color || GROUPS.body.color);

  const renderFigure = (key, small) => {
    const v = VIEWS[key];
    const { Under, Over } = v;
    const dotR = v.kind === "dots" ? 4 : v.kind === "dermatomes" ? 1.7 : 2.3;
    return (
      <div style={{ position: "relative", background: "#fff", border: "1px solid #e6ddd3", borderRadius: 12, padding: 10 }}>
        <div style={{ position: "absolute", top: 10, left: 12, right: 12, fontSize: 12.5, color: BROWN, fontWeight: 600, minHeight: 18 }}>
          {small || !hoverRegion ? v.label : hoverRegion.name}
          {!small && hoverRegion?.link && !hoverRegion.navigate && (
            <span style={{ fontWeight: 400, color: "#a3917f" }}> · double-click for detailed view</span>
          )}
        </div>
        <svg viewBox={v.viewBox} style={{ width: "100%", height: "auto", maxHeight: small ? "46vh" : "76vh", display: "block", marginTop: 18 }}>
          {Under && <Under />}

          {v.kind === "regions" &&
            v.regions.map(
              (r) =>
                r.d && (
                  <g key={r.id} {...interactive(r)}>
                    <path d={r.d} fill={regionFill(r)} stroke={C.lineSoft} strokeWidth="0.6" strokeLinejoin="round" />
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

          {Over && <Over />}

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

          {v.regions.map((r) => {
            if (!r.dot) return null;
            const sel = isSelected(r.id);
            const hov = hovered === r.id;
            const [x, y] = r.dot;
            return (
              <g key={"dot-" + r.id} {...(v.kind === "dermatomes" ? { pointerEvents: "none" } : interactive(r, v.kind === "dots"))}>
                <circle cx={x} cy={y} r={v.kind === "dots" ? 10 : 4} fill="transparent" />
                <circle cx={x} cy={y} r={sel ? dotR * 1.5 : hov ? dotR * 1.3 : dotR} fill={dotColor(r)} stroke="#fff" strokeWidth={v.kind === "dots" ? 1.4 : 0.8} />
                {r.link && <circle cx={x} cy={y} r={dotR * 2.2} fill="none" stroke={GROUPS.body.color} strokeWidth="1" strokeDasharray="2 2" />}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Legend
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
    return [{ label: "Body site", color: GROUPS.body.color }, { label: "Opens head views", color: GROUPS.body.color, dashed: true }];
  })();

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

  const toggleChip = (on, set, text) => (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#6a5c50", cursor: "pointer" }}>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} />
      {text}
    </label>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f6f4f1", minHeight: "100vh", color: "#2a2320", padding: "24px 16px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 25, margin: 0, fontWeight: 700 }}>Anatomy Region Mapper</h1>
          <p style={{ margin: "4px 0 0", color: "#7a6a5c", fontSize: 14 }}>
            Click a region or dot to select it. Facial cosmetic subunits follow the Gonzalez-Ulloa aesthetic units with Burget &amp; Menick nasal
            subunits.
          </p>
        </header>

        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
          {VIEW_GROUPS.map((g) => (
            <div key={g.title}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#a3917f", marginBottom: 6 }}>{g.title}</div>
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

          <div style={{ flex: "1 1 300px", minWidth: 280 }}>
            <label htmlFor="am-search" style={{ fontSize: 13, fontWeight: 600, color: "#7a6a5c" }}>
              Search all regions
            </label>
            <input
              id="am-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. soft triangle, helix, T10, popliteal"
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", marginTop: 6, marginBottom: 6, borderRadius: 8, border: "1px solid #d8ccc0", fontSize: 14 }}
            />
            {matches.length > 0 && (
              <div style={{ border: "1px solid #e6ddd3", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                {matches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      openView(m.view);
                      if (!isSelected(m.id)) toggle(m);
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
              <label htmlFor="am-snippet" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#7a6a5c", margin: "14px 0 6px" }}>
                Note snippet
              </label>
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
            <p style={{ fontSize: 11, color: "#a3917f", marginTop: 12, lineHeight: 1.5 }}>
              Note: dermatomes may vary between individuals and published maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
