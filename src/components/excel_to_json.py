import pandas as pd, pathlib

SRC  = "glyph_codex.xlsx"          # your workbook
DEST = pathlib.Path("public/glyphs.json")

# ---- columns to keep (adjust to your headers!) --------------------
keep = ["Name", "Tier", "New Text", "Higher Levels"]
# -------------------------------------------------------------------

df = pd.read_excel(SRC, engine="openpyxl")[keep]
DEST.parent.mkdir(exist_ok=True)
df.to_json(DEST, orient="records", indent=2, force_ascii=False)

print("✅  wrote", DEST.resolve())
