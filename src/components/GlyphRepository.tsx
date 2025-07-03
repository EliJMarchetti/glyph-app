// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";

/**
 * Lightweight Glyph repository component that avoids external UI libs so the
 * TS build on GitHub Pages succeeds without extra dependencies.
 */
export default function GlyphRepository() {
  const [glyphs, setGlyphs] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}glyphs.json`)
      .then((r) => r.json())
      .then(setGlyphs)
      .catch((err) => console.error("glyph fetch", err));
  }, []);

  const filtered = useMemo(() => {
    return glyphs.filter((g) => {
      const s = search.toLowerCase();
      const name = (g.Name || "").toLowerCase();
      const matchesText = name.includes(s);
      const matchesLevel = level === "all" || String(g.Level) === level;
      return matchesText && matchesLevel;
    });
  }, [glyphs, search, level]);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Search glyphs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="all">All Levels</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              Level {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Glyph cards */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filtered.map((g) => (
          <details key={g.Name} style={{ border: "1px solid #ddd", borderRadius: 6 }}>
            <summary style={{ padding: "0.75rem", fontWeight: 600 }}>
              {g.Name} <span style={{ float: "right" }}>Lvl {g.Level}</span>
            </summary>
            <div style={{ padding: "0.75rem", whiteSpace: "pre-wrap" }}>
              {g["New Text"]}
              {g["Higher Tiers"] && (
                <>
                  <hr style={{ margin: "1rem 0" }} />
                  <strong>Higher Tiers:</strong> {g["Higher Tiers"]}
                </>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
