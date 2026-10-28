"use client";

import { useId, useState } from "react";

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Autre"];

type Status = "idle" | "sending" | "success" | "error";

export default function WaitlistForm({ tone = "default", source = "landing" }: { tone?: "default" | "onAccent"; source?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onAccent = tone === "onAccent";
  const field = onAccent
    ? "w-full rounded-full border border-white/40 bg-white px-4 py-3 text-foreground placeholder:text-muted"
    : "w-full rounded-full border border-border bg-card px-4 py-3 placeholder:text-muted";
  const button = onAccent ? "bg-white text-accent" : "bg-accent text-white";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city: city || null, source, website }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        setMessage(data.message ?? "C'est noté !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data?.message ?? "L'inscription a échoué, réessaie dans un instant.");
      }
    } catch {
      setStatus("error");
      setMessage("Connexion impossible, vérifie ton réseau et réessaie.");
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-xl text-left" noValidate={false}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Adresse e-mail
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
        <label htmlFor={`${id}-city`} className="sr-only">
          Ville (facultatif)
        </label>
        <select id={`${id}-city`} value={city} onChange={(e) => setCity(e.target.value)} className={`${field} sm:max-w-44`}>
          <option value="">Ville (facultatif)</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {/* Honeypot anti-robots, invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Ne pas remplir</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-3 w-full rounded-full px-6 py-3 font-semibold hover:opacity-90 disabled:opacity-60 ${button}`}
      >
        {status === "sending" ? "Envoi…" : "Rejoindre la liste d'attente"}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-center text-sm ${onAccent ? "text-white" : status === "error" ? "text-accent" : "text-muted"}`}
      >
        {status === "success" && "✅ "}
        {status === "error" && "⚠️ "}
        {message}
      </p>
    </form>
  );
}
