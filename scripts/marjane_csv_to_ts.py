"""Recopie data/marjane/selection.csv dans web/src/lib/marjane.ts (bloc `marjane`)."""
import csv, json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
rows = list(csv.DictReader(open(root / "data/marjane/selection.csv", encoding="utf-8")))
body = "".join(
    f'  {json.dumps(r["food_id"])}: {{ name: {json.dumps(r["nom_marjane"], ensure_ascii=False)}, priceMad: {r["prix_mad"]}, grams: {r["grammes"]}, url: {json.dumps(r["chemin"])} }},\n'
    for r in rows
)
p = root / "web/src/lib/marjane.ts"
s = p.read_text(encoding="utf-8")
s = re.sub(r"(export const marjane: Record<string, StoreOffer> = \{\n).*?(\n?\};)", lambda m: m.group(1) + body + "};", s, count=1, flags=re.S)
p.write_text(s, encoding="utf-8")
print(f"{len(rows)} produits Marjane")
