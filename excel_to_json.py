import pandas as pd, pathlib

SRC  = "glyph_codex.xlsx"           # your workbook
DEST = pathlib.Path("public/glyphs.json")

# ---- column headers in Excel (type them EXACTLY) -----------------
keep = ["Name", "Level", "New Text", "Higher Tiers"]
# ------------------------------------------------------------------

df = pd.read_excel(SRC, engine="openpyxl")[keep]
DEST.parent.mkdir(exist_ok=True)
df.to_json(DEST, orient="records", indent=2, force_ascii=False)

print("✅  wrote", DEST.resolve())
