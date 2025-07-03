// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";

/**
 * GlyphRepository v2.1 – single‑column, stable width
 * --------------------------------------------------
 * Make sure glyphs.json includes **all** of these columns (case‑sensitive!):
 *   Name · Level · Points · School · V · S · Casting Time · Concentration ·
 *   Duration · Range · Rite · New Text · Higher Tiers
 */

const ALL_SCHOOLS = [
  "Harmony",
  "Elemental",
  "Celestial",
  "Nature",
  "Arcane",
  "Mind",
  "Chaos",
  "Bane",
];

export default function GlyphRepository() {
  const [glyphs, setGlyphs] = useState([]);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [schools, setSchools] = useState(new Set());

  /* ---------------- fetch data ---------------- */
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}glyphs.json`)
      .then((res) => res.json())
      .then(setGlyphs)
      .catch((err) => console.error("glyph fetch", err));
  }, []);

  /* -------------- toggle helpers -------------- */
  const toggleSchool = (s) => setSchools((set) => {
    const next = new Set(set);
    next.has(s) ? next.delete(s) : next.add(s);
    return next;
  });

  /* ---------------- filtering ----------------- */
  const filtered = useMemo(() => {
    return glyphs.filter((g) => {
      const hay = `${g.Name ?? ""} ${g["New Text"] ?? ""}`.toLowerCase();
      const byText = hay.includes(search.toLowerCase());
      const byTier = tier === "all" || String(g.Level ?? g.Tier ?? "") === tier;
      const bySchool = schools.size === 0 || schools.has(g.School);
      return byText && byTier && bySchool;
    });
  }, [glyphs, search, tier, schools]);

  /* ------------------ ui ---------------------- */
  return (
    <div style={{ width: "clamp(320px, 90%, 1000px)", margin: "2rem auto" }}>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <input
          placeholder="Search glyphs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: 8 }}
        />
        <select value={tier} onChange={(e) => setTier(e.target.value)} style={{ padding: 8 }}>
          <option value="all">All Tiers</option>
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={String(i)}>
              Tier {i}
            </option>
          ))}
        </select>
      </div>

      {/* School checkboxes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        {ALL_SCHOOLS.map((s) => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
            <input type="checkbox" checked={schools.has(s)} onChange={() => toggleSchool(s)} />
            {s}
          </label>
        ))}
      </div>

      {/* Single‑column glyph list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((g) => {
          const flags = [g.V ? "V" : null, g.S ? "S" : null].filter(Boolean).join("/");
          return (
            <details key={g.Name} style={{ border: "1px solid #ddd", borderRadius: 6, width: "100%" }}>
              <summary
                style={{
                  padding: "12px 16px 10px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span>
                  {g.Name} {flags && <span style={{ fontSize: 12, fontWeight: 400 }}>({flags})</span>}
                </span>
                <span style={{ textAlign: "right", fontSize: 14, whiteSpace: "nowrap" }}>
                  Tier {g.Level}
                  <br />
                  <span style={{ fontSize: 12, color: "#555" }}>{g.Points ?? 0} Mana</span>
                </span>
              </summary>

              <div style={{ padding: 16, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
                {/* metadata block – only show lines that have values */}
                <div style={{ fontSize: 14, marginBottom: 10 }}>
                  {g.School && <div>School: {g.School}</div>}
                  {g["Casting Time"] && <div>Casting Time: {g["Casting Time"]}</div>}
                  {g.Concentration && <div>Concentration: {g.Concentration}</div>}
                  {g.Duration && <div>Duration: {g.Duration}</div>}
                  {g.Range && <div>Range: {g.Range}</div>}
                  {g.Rite && <div>Rite: {g.Rite}</div>}
                </div>

                {g["New Text"]}

                {g["Higher Tiers"] && (
                  <>
                    <hr style={{ margin: "16px 0" }} />
                    <strong>Higher Tiers:</strong> {g["Higher Tiers"]}
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
