import { describe, expect, it } from "vitest";
import { addWeighIn, adherence, checkIn, newState, planDay, streak, trend } from "../coach";

const day = (n: number) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10);

function withWeights(kgPerDay: (i: number) => number, n = 14) {
  let s = newState(day(0));
  for (let i = 0; i < n; i++) s = addWeighIn(s, kgPerDay(i), day(i));
  return s;
}

describe("coach", () => {
  it("lisse le poids", () => {
    const t = trend([{ date: day(0), kg: 80 }, { date: day(1), kg: 82 }]);
    expect(t[1].kg).toBeCloseTo(80.2);
  });

  it("remplace la pesée du jour", () => {
    let s = addWeighIn(newState(day(0)), 80, day(0));
    s = addWeighIn(s, 79.5, day(0));
    expect(s.weighIns).toEqual([{ date: day(0), kg: 79.5 }]);
  });

  it("calcule le jour du menu", () => {
    const s = newState(day(0));
    expect(planDay(s, day(0))).toBe(0);
    expect(planDay(s, day(8))).toBe(1);
  });

  it("n'ajuste pas sans assez de pesées", () => {
    const c = checkIn(withWeights(() => 80, 4), day(4), 2200, -0.5, 1);
    expect(c.ready).toBe(false);
    expect(c.adjust).toBe(0);
  });

  it("n'ajuste pas si le plan n'est pas suivi", () => {
    const c = checkIn(withWeights(() => 80), day(13), 2200, -0.5, 0.4);
    expect(c.ready).toBe(false);
  });

  it("baisse les calories si le poids ne descend pas", () => {
    const c = checkIn(withWeights(() => 80), day(13), 2200, -0.5, 0.9);
    expect(c.ready).toBe(true);
    expect(c.adjust).toBe(-150);
  });

  it("monte les calories si on perd trop vite", () => {
    const c = checkIn(withWeights((i) => 80 - i * 0.2), day(13), 1800, -0.5, 1);
    expect(c.adjust).toBeGreaterThan(0);
    expect(c.adjust).toBeLessThanOrEqual(150);
  });

  it("ne change rien quand on est dans l'objectif", () => {
    const c = checkIn(withWeights(() => 80), day(13), 2500, 0, 1);
    expect(c.adjust).toBe(0);
  });

  it("compte l'adhérence et la série", () => {
    const s = { ...newState(day(0)), meals: { [day(0)]: [true, true, false], [day(1)]: [true, true, true] } };
    expect(adherence(s, day(0), day(1), () => 3)).toBeCloseTo(5 / 6);
    expect(streak(s, day(1))).toBe(2);
    expect(streak(s, day(2))).toBe(2);
  });
});
