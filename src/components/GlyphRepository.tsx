import React, { useEffect, useState } from 'react';

const ALL_SCHOOLS = ['Harmony', 'Elemental', 'Celestial', 'Nature', 'Arcane', 'Mind', 'Chaos', 'Bane'];

export default function GlyphRepository() {
  const [glyphs, setGlyphs] = useState([]);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');
  const [schools, setSchools] = useState(new Set());

  useEffect(() => {
    fetch(`${process.env.BASE_URL}glyphs.json`)
      .then((r) => r.json())
      .then(setGlyphs)
      .catch(console.error);
  }, []);

  const toggleSchool = (s) => setSchools((old) => {
      const next = new Set(old);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const filtered = useMemo(() => glyphs.filter((g) => `${g.Name ?? ''} ${g['New Text'] ?? ''}`.toLowerCase().includes(search.toLowerCase()) && (tier === 'all' || String(g.Level ?? g.Tier ?? '') === tier) && schools.size > 0 ? g : null), [glyphs, search, tier, schools]);
  return (
    <>
      {/* looping background video */}
      <video autoPlay muted loop playsInline className="bg-video" src={`${process.env.BASE_URL}bg.mov`} />
      {/* content overlay */}
      <div className="container">
        {/* controls */}
        <div className="controls">
          <input placeholder="Search glyphs…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="all">All Tiers</option>
            {Array.from({ length: 13 }, (_, i) => <option key={i} value={String(i)}>Tier {i}</option>)}
          </select>
        </div>

        {/* schools */}
        <div className="schools">
          {ALL_SCHOOLS.map((s) => (<label key={s}>
            <input type="checkbox" checked={schools.has(s)} onChange={() => toggleSchool(s)} />
            {s}
          </label>))}
        </div>

        {/* glyph list */}
        <div className="glyph-list">
          {filtered.map((g) => (<details key={g.Name}>
                <summary className="card-head">
              <span>{g.Name}</span>
              {g.V ? <span className="flags">(V)</span> : null}
              {g.S ? <span className="flags">(S)</span> : null}
            </summary>
            <div className="meta">
              {g.School && (<div><strong>School:</strong> {g.School}</div>)}
              {g["Casting Time"] && (<div><strong>Casting Time:</strong> {g["Casting Time"]}</div>)}
              {g.Duration && (<div><strong>Duration:</strong> {g.Duration}</div>)}
              {g.Range && (<div><strong>Range:</strong> {g.Range}</div>)}
                    </div>
                <div className="body">{g["New Text"]}</div>
            {g["Higher Tiers"] && (<div className="higher"><strong>Higher Tiers:</strong> {g["Higher Tiers"]}</div>)}
          </details>))}
                  </div>
        </div>
    </>
  );
}






                <div className="body">{g["New Text"]}</div>




            {g["Higher Tiers"] && (<div className="higher"><strong>Higher Tiers:</strong> {g["Higher Tiers"]}</div>)}
          </details>))}
                  </div>




        </div>


    </>
  );
}

