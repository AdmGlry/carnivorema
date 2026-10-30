// Barre P/G/L : part de chaque macronutriment dans les calories de la recette.
export const MACRO_COLORS = { protein: "#e0402f", carbs: "#f2c14e", fat: "#3f8f3a" } as const;

export default function MacroBar({ protein, carbs, fat, className = "" }: { protein: number; carbs: number; fat: number; className?: string }) {
  const total = protein * 4 + carbs * 4 + fat * 9 || 1;
  const parts = [
    { key: "P", label: "Protéines", g: protein, pct: (protein * 4) / total, color: MACRO_COLORS.protein },
    { key: "G", label: "Glucides", g: carbs, pct: (carbs * 4) / total, color: MACRO_COLORS.carbs },
    { key: "L", label: "Lipides", g: fat, pct: (fat * 9) / total, color: MACRO_COLORS.fat },
  ];
  return (
    <div className={className}>
      <div
        className="flex h-2 overflow-hidden rounded-full bg-accent-soft"
        role="img"
        aria-label={parts.map((p) => `${p.label} ${Math.round(p.g)} g (${Math.round(p.pct * 100)} %)`).join(", ")}
      >
        {parts.map((p) => (
          <span key={p.key} className="macro-seg h-full" style={{ width: `${p.pct * 100}%`, backgroundColor: p.color }} />
        ))}
      </div>
      <p aria-hidden="true" className="mt-1.5 flex gap-3 text-[11px] text-muted">
        {parts.map((p) => (
          <span key={p.key} className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.key} {Math.round(p.g)} g
          </span>
        ))}
      </p>
    </div>
  );
}
