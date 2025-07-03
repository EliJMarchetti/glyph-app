// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";

/**
 * GlyphRepository – minimal dependencies
 * --------------------------------------------------
 * • Fetches glyphs.json from `${import.meta.env.BASE_URL}`  
 * • Search by name/body text  
 * • Tier filter (All  ▾  Tier 0‑12)  
 * • Multi‑select School checkboxes  
 * • Card shows: Tier, Mana (Points), verbal / somatic flags, metadata lines, text, higher‑tier text
 */

const ALL_SCHOOLS = [
  "Harmony", // coming soon
  "Elemental",
  "Celestial",
  "Nature",
  "Arcane",
  "Mind",
  "Chaos",
  "Bane",     // coming soon
];

export default function GlyphRepository() {
  const [glyphs, setGlyphs] = useState([]);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [schools, setSchools] = useState(new Set());

  /* ------------------------------------------------------------------ */
  /* data load                                                           */
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}glyphs.json`)
      .then((r) => r.json())
      .then(setGlyphs)
      .catch((e) => console.error("glyph fetch", e));
  }, []);

  /* ------------------------------------------------------------------ */
  /* handlers                                                            */
  function toggleSchool(s) {
    const next = new Set(schools);
    next.has(s) ? next.delete(s) : next.add(s);
    setSchools(next);
  }

  /* ------------------------------------------------------------------ */
  /* filtering                                                           */
  const filtered = useMemo(() => {
    return glyphs.filter((g) => {
      // Search text across Name + New Text
      const needle = search.toLowerCase();
      const hay = `${g.Name ?? ""} ${g["New Text"] ?? ""}`.toLowerCase();
      const matchText = hay.includes(needle);

      // Tier filter
      const matchTier = tier === "all" || String(g.Level ?? g.Tier ?? "") === tier;

      // School filter
      const matchSchool = schools.size === 0 || schools.has(g.School);

      return matchText && matchTier && matchSchool;
    });
  }, [glyphs, search, tier, schools]);

  /* ------------------------------------------------------------------ */
  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      {/* ——— Controls ——— */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
        {/* search */}
        <input
          placeholder="Search glyphs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: "0.5rem" }}
        />

        {/* tier select */}
        <select value={tier} onChange={(e) => setTier(e.target.value)} style={{ padding: "0.5rem" }}>
          <option value="all">All Tiers</option>
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={String(i)}>
              Tier {i}
            </option>
          ))}
        </select>
      </div>

      {/* school checkboxes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {ALL_SCHOOLS.map((s) => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="checkbox"
              checked={schools.has(s)}
              onChange={() => toggleSchool(s)}
            />
            {s}
          </label>
        ))}
      </div>

      {/* ——— Glyph cards ——— */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
        {filtered.map((g) => {
          const vFlag = g.V === true || g.V === "True" ? "V" : "";
          const sFlag = g.S === true || g.S === "True" ? "S" : "";
          const flags = [vFlag, sFlag].filter(Boolean).join("/");
          return (
            <details key={g.Name} style={{ border: "1px solid #ddd", borderRadius: 6 }}>
              <summary
                style={{
                  padding: "0.75rem 0.75rem 0.5rem 0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {g.Name} {flags && <span style={{ fontWeight: 400, fontSize: "0.8rem" }}>({flags})</span>}
                </span>
                <span style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                  <span style={{ fontSize: "0.85rem" }}>Tier {g.Level}</span>
                  <span style={{ fontSize: "0.75rem", color: "#555" }}>{g.Points ?? 0} Mana</span>
                </span>
              </summary>

              <div style={{ padding: "0.75rem", whiteSpace: "pre-wrap" }}>
                {/* metadata lines */}
                <div style={{ fontSize: "0.85rem", marginBottom: "0.5rem", lineHeight: 1.4 }}>
                  <div>School: {g.School ?? ""}</div>
                  <div>Casting Time: {g["Casting Time"] ?? ""}</div>
                  <div>Concentration: {g.Concentration ?? ""}</div>
                  <div>Duration: {g.Duration ?? ""}</div>
                  <div>Range: {g.Range ?? ""}</div>
                  <div>Rite: {g.Rite ?? ""}</div>
                </div>
                {g["New Text"]}
                {g["Higher Tiers"] && (
                  <>
                    <hr style={{ margin: "1rem 0" }} />
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
