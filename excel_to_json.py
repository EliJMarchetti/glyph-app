import pandas as pd, pathlib

def export_excel_to_json(xlsx_path, json_dest_dir):
    # your workbook path
    SRC = xlsx_path
    DEST = pathlib.Path(json_dest_dir, "glyphs.json")

    # column headers in Excel (type them EXACTLY) -----------------
    keep = [
    "Name", "Level", "Points", "School", "V", "S",
    "Casting Time", "Concentration", "Duration", "Range", "Rite",
    "New Text", "Higher Tiers",
]
# ------------------------------------------------------------------

df = pd.read_excel(SRC, engine="openpyxl")[keep]
DEST.parent.mkdir(exist_ok=True)
df.to_json(DEST, orient="records", indent=2, force_ascii=False)

print("✅  wrote", DEST.resolve())
