"use client";

import { useEffect, useRef, useState } from "react";

const reducedMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fait défiler un nombre de 0 jusqu'à sa valeur, puis suit ses changements. */
export function CountUp({ value, format = (v) => String(Math.round(v)) }: { value: number; format?: (v: number) => string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    if (reducedMotion()) {
      setShown(value);
      return;
    }
    const start = first.current ? 0 : from.current;
    first.current = false;
    const t0 = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - (1 - k) ** 3;
      const v = start + (value - start) * eased;
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{format(shown)}</>;
}

/** Pluie de confettis aux couleurs du site (tomate, safran, menthe, dirham), une seule fois. */
export function Confetti({ fire }: { fire: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!fire || !c || reducedMotion()) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio);
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#e0402f", "#f2c14e", "#3f8f3a", "#f08a24", "#d4a03c"];
    const parts = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 13 - 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      round: Math.random() < 0.3,
    }));
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - t / 2.6);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r)));
        }
        ctx.restore();
      }
      if (t < 2.6) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fire]);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}

/** Inclinaison 3D d'une carte qui suit le pointeur. */
export function tiltHandlers() {
  return {
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--ry", `${x * 10}deg`);
      el.style.setProperty("--rx", `${-y * 10}deg`);
    },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      e.currentTarget.style.setProperty("--ry", "0deg");
      e.currentTarget.style.setProperty("--rx", "0deg");
    },
  };
}
