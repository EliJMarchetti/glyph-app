import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

/**
 * GlyphRepository.jsx
 * ------------------------------------------------------
 * Expects glyph data at `${import.meta.env.BASE_URL}glyphs.json` so it works
 * both in local dev (`/`) and on GitHub Pages (`/glyph-app/`).
 */

export default function GlyphRepository() {
  const [glyphs, setGlyphs] = useState([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  // Load JSON once
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}glyphs.json`)
      .then((res) => res.json())
      .then(setGlyphs)
      .catch((err) => console.error("Failed to load glyphs:", err));
  }, []);

  // Search + level filter
  const filtered = useMemo(() => {
    return glyphs.filter((g) => {
      const matchesSearch = g["Name"].toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === "all" || String(g["Level"]) === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [glyphs, search, levelFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search glyphs..."
          className="flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {[...Array(12).keys()].map((n) => (
              <SelectItem key={n + 1} value={String(n + 1)}>
                Level {n + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Glyph cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <Card key={g["Name"]} className="relative overflow-hidden">
            <details className="group">
              <summary className="cursor-pointer list-none p-4 flex items-center justify-between font-semibold text-lg">
                {g["Name"]}
                <ChevronDown className="transition-transform duration-200 group-open:-rotate-180" />
              </summary>
              <CardContent className="prose max-w-none p-4 pt-0 text-sm whitespace-pre-wrap">
                {g["New Text"]}
                {g["Higher Tiers"] && (
                  <>
                    <hr className="my-3" />
                    <strong>Higher Tiers:</strong> {g["Higher Tiers"]}
                  </>
                )}
              </CardContent>
            </details>
            <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
              Level {g["Level"]}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
