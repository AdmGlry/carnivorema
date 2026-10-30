"use client";

import { useMemo, useState } from "react";
import { foodById, pricePerKg } from "@/lib/foods";
import { CITIES, MIN_REPORTS, PLACES, ReportStat, UNITS, reportProducts } from "@/lib/reports";
import { retailRange, wholesale } from "@/lib/souk";
import { tiltHandlers } from "./fun";

const fmt = (n: number) => n.toLocaleString("fr-MA", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const unitLabel = (u: string) => UNITS.find((x) => x.id === u)?.label ?? u;

function ReportForm({ initialProduct, onSent }: { initialProduct: string; onSent: () => void }) {
  const [product, setProduct] = useState(initialProduct);
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [place, setPlace] = useState("souk");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<{ status: "idle" | "sending" | "ok" | "error"; message?: string }>({ status: "idle" });
  const unit = reportProducts.find((p) => p.slug === product)?.unit ?? "kg";
  const field = "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5";

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ status: "sending" });
        try {
          const res = await fetch("/api/prix-signales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product, price, city, place, website: hp }),
          });
          const data = (await res.json()) as { ok: boolean; message: string };
          setState({ status: data.ok ? "ok" : "error", message: data.message });
          if (data.ok) {
            setPrice("");
            onSent();
          }
        } catch {
          setState({ status: "error", message: "Pas de connexion. Réessaie dans un instant." });
        }
      }}
    >
      <label className="block text-sm" htmlFor="rp-product">
        <span className="text-muted">Produit</span>
        <select id="rp-product" value={product} onChange={(e) => setProduct(e.target.value)} className={field}>
          {reportProducts.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm" htmlFor="rp-price">
        <span className="text-muted">Prix payé, {unitLabel(unit)}</span>
        <span className="relative mt-1 block">
          <input
            id="rp-price"
            inputMode="decimal"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="7,50"
            className={`${field} mt-0 pr-12 font-display text-2xl font-bold tabular-nums`}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">DH</span>
        </span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm" htmlFor="rp-city">
          <span className="text-muted">Ville</span>
          <select id="rp-city" value={city} onChange={(e) => setCity(e.target.value)} className={field}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm" htmlFor="rp-place">
          <span className="text-muted">Où ?</span>
          <select id="rp-place" value={place} onChange={(e) => setPlace(e.target.value)} className={field}>
            {PLACES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden="true" />
      <button type="submit" disabled={state.status === "sending"} className="w-full rounded-full bg-accent px-5 py-3 font-semibold text-on-accent disabled:opacity-60">
        {state.status === "sending" ? "Envoi…" : "Partager ce prix"}
      </button>
      <p role="status" className={`min-h-5 text-sm ${state.status === "error" ? "text-accent" : "text-muted"}`}>
        {state.message ?? "Anonyme : on ne garde que le produit, le prix, la ville et le type de commerce."}
      </p>
    </form>
  );
}

export default function SoukBoard({ stats }: { stats: ReportStat[] }) {
  const [city, setCity] = useState("Maroc");
  const [formProduct, setFormProduct] = useState("tomate");
  const [formKey, setFormKey] = useState(0);
  const [sent, setSent] = useState(0);

  const statFor = useMemo(() => {
    const m = new Map(stats.map((s) => [`${s.product_slug}|${s.unit}|${s.city}`, s]));
    return (slug: string, unit: string) => {
      const s = m.get(`${slug}|${unit}|${city}`);
      return s && s.reports >= MIN_REPORTS ? s : undefined;
    };
  }, [stats, city]);

  const extras = reportProducts.filter((p) => !wholesale.some((w) => w.slug === p.slug) && statFor(p.slug, p.unit));
  const cities = ["Maroc", ...CITIES.filter((c) => stats.some((s) => s.city === c))];

  const Row = ({ slug, name, unit }: { slug: string; name: string; unit: string }) => {
    const w = wholesale.find((x) => x.slug === slug);
    const est = w ? retailRange(w) : undefined;
    const s = statFor(slug, unit);
    const food = w?.foodId ? foodById[w.foodId] : undefined;
    const superKg = food ? pricePerKg(food) : undefined;
    const refLow = s ? s.median_mad : est?.low;
    const cheaper = superKg !== undefined && refLow !== undefined && s === undefined && est ? est.high < superKg : false;
    return (
      <li
        {...tiltHandlers()}
        className="tilt-card flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-border bg-card px-4 py-3"
      >
        <div className="min-w-0">
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-muted tabular-nums">
            {w && <>Gros : {fmt(w.min)} à {fmt(w.max)} DH</>}
            {superKg !== undefined && <> · Supermarché : {fmt(Math.round(superKg * 100) / 100)} DH</>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-display text-xl font-bold tabular-nums">
              {s ? `${fmt(s.median_mad)} DH` : est ? `${fmt(est.low)} – ${fmt(est.high)} DH` : "—"}
            </p>
            <p className={`text-xs ${s ? "font-medium text-accent" : "text-muted"}`}>
              {s ? `${s.reports} relevés · ${unitLabel(unit)}` : `estimation · ${unitLabel(unit)}`}
            </p>
          </div>
          {cheaper && <span className="hidden rounded-full bg-accent-soft px-2 py-1 text-xs font-semibold text-accent sm:inline">Moins cher qu&apos;au supermarché</span>}
          <button
            type="button"
            onClick={() => {
              setFormProduct(slug);
              setFormKey((k) => k + 1);
              document.getElementById("signaler")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-accent"
            aria-label={`Signaler le prix : ${name}`}
          >
            J&apos;ai payé…
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-8">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ville">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={city === c}
              onClick={() => setCity(c)}
              className={`rounded-full border px-3 py-1.5 text-sm ${city === c ? "border-accent bg-accent-soft font-semibold text-accent" : "border-border bg-card"}`}
            >
              {c === "Maroc" ? "Tout le Maroc" : c}
            </button>
          ))}
        </div>
        {(["legume", "fruit"] as const).map((kind) => (
          <section key={kind}>
            <h2 className="text-2xl font-bold">{kind === "legume" ? "Légumes" : "Fruits"}</h2>
            <ul className="mt-4 grid gap-2">
              {wholesale
                .filter((w) => w.kind === kind)
                .map((w) => (
                  <Row key={w.slug} slug={w.slug} name={w.name} unit="kg" />
                ))}
            </ul>
          </section>
        ))}
        {extras.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold">Signalés par la communauté</h2>
            <ul className="mt-4 grid gap-2">
              {extras.map((p) => (
                <Row key={p.slug} slug={p.slug} name={p.name} unit={p.unit} />
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside id="signaler" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">J&apos;ai payé combien ?</p>
          <h2 className="mt-1 text-2xl font-bold">Partage un prix</h2>
          <p className="mt-2 text-sm text-muted">
            Souk, hanout, marché ou primeur : chaque prix rend l&apos;estimation plus juste pour tout le monde. À partir de {MIN_REPORTS} relevés, on affiche le
            prix de la communauté.
          </p>
          <div className="mt-5">
            <ReportForm key={formKey} initialProduct={formProduct} onSent={() => setSent((n) => n + 1)} />
          </div>
          {sent > 0 && (
            <p className="mt-2 text-xs text-muted">
              {sent} prix partagé{sent > 1 ? "s" : ""} pendant cette visite. La page se met à jour toutes les 5 minutes.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
