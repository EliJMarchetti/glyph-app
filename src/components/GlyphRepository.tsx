// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import "../global.css"; // new global styles (video bg, font, colors)

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

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}glyphs.json`)
      .then((r) => r.json())
      .then(setGlyphs)
      .catch(console.error);
  }, []);

  const toggleSchool = (s) =>
    setSchools((old) => {
      const next = new Set(old);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const filtered = useMemo(() => {
    return glyphs.filter((g) => {
      const hay = `${g.Name ?? ""} ${g["New Text"] ?? ""}`.toLowerCase();
      const byText = hay.includes(search.toLowerCase());
      const byTier = tier === "all" || String(g.Level ?? g.Tier ?? "") === tier;
      const bySchool = schools.size === 0 || schools.has(g.School);
      return byText && byTier && bySchool;
    });
  }, [glyphs, search, tier, schools]);

  return (
    <>
      {/* looping background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="bg-video"
        src={`${import.meta.env.BASE_URL}assets/bg.mov`}
      />

      {/* content overlay */}
      <div className="container">
        {/* controls */}
        <div className="controls">
          <input
            className="control"
            placeholder="Search glyphs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="control"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            <option value="all">All Tiers</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={String(i)}>
                Tier {i}
              </option>
            ))}
          </select>
        </div>

        {/* schools */}
        <div className="schools">
          {ALL_SCHOOLS.map((s) => (
            <label key={s} className="school">
              <input
                type="checkbox"
                checked={schools.has(s)}
                onChange={() => toggleSchool(s)}
              />
              {s}
            </label>
          ))}
        </div>

        {/* glyph list */}
        <div className="glyph-list">
          {filtered.map((g) => {
            const flags = [g.V ? "V" : null, g.S ? "S" : null]
              .filter(Boolean)
              .join("/");
            return (
              <details key={g.Name} className="card">
                <summary className="card-head">
                  <span>
                    {g.Name}{" "}
                    {flags && <span className="flags">({flags})</span>}
                  </span>
                  <span className="tier-mana">
                    Tier {g.Level}
                    <br />
                    <span className="mana">{g.Points ?? 0} Mana</span>
                  </span>
                </summary>

                <div className="meta">
                  {g.School && (
                    <div>
                      <strong>School:</strong> {g.School}
                    </div>
                  )}
                  {g["Casting Time"] && (
                    <div>
                      <strong>Casting Time:</strong> {g["Casting Time"]}
                    </div>
                  )}
                  {g.Duration && (
                    <div>
                      <strong>Duration:</strong> {g.Duration}
                    </div>
                  )}
                  {g.Range && (
                    <div>
                      <strong>Range:</strong> {g.Range}
                    </div>
                  )}
                </div>

                <div className="body">{g["New Text"]}</div>

                {g["Higher Tiers"] && (
                  <div className="higher">
                    <strong>Higher Tiers:</strong> {g["Higher Tiers"]}
                  </div>
                )}
              </details>
            );
          })}
        </div>
      </div>
    </>
  );
}
