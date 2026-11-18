"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Learner progress, persisted in localStorage.
 *
 * Kept behind this module so moving to Supabase later is a swap of `load`/
 * `persist`, not a rewrite of the screens. Server render always sees EMPTY, and
 * screens that need real numbers mount-guard on `useHydrated()`.
 */

export const HEART_MAX = 5;
export const HEART_REGEN_MS = 15 * 60 * 1000;

export type LessonRecord = { stars: 1 | 2 | 3; accuracy: number; xp: number; at: number };

export type Progress = {
  v: 1;
  xp: number;
  hearts: number;
  heartsAt: number;
  streak: number;
  lastDay: string;
  lessons: Record<string, LessonRecord>;
  bosses: Record<string, { stars: 1 | 2 | 3; at: number }>;
  badges: string[];
};

const KEY = "zabanyar.progress.v1";

export const EMPTY: Progress = {
  v: 1,
  xp: 0,
  hearts: HEART_MAX,
  heartsAt: 0,
  streak: 0,
  lastDay: "",
  lessons: {},
  bosses: {},
  badges: [],
};

function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function applyHeartRegen(p: Progress, now = Date.now()): Progress {
  if (p.hearts >= HEART_MAX || !p.heartsAt) return p;
  const gained = Math.floor((now - p.heartsAt) / HEART_REGEN_MS);
  if (gained <= 0) return p;
  const hearts = Math.min(HEART_MAX, p.hearts + gained);
  return { ...p, hearts, heartsAt: hearts >= HEART_MAX ? 0 : p.heartsAt + gained * HEART_REGEN_MS };
}

function load(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, heartsAt: Date.now() };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return applyHeartRegen({ ...EMPTY, ...parsed, v: 1 });
  } catch {
    return { ...EMPTY, heartsAt: Date.now() };
  }
}

let state: Progress = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function ensure(): Progress {
  if (!loaded && typeof window !== "undefined") {
    state = load();
    loaded = true;
  }
  return state;
}

function persist(next: Progress) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode / quota — the app keeps working in memory */
    }
  }
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgress(): Progress {
  return ensure();
}

export function getServerProgress(): Progress {
  return EMPTY;
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, getServerProgress);
}

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // deferred by a tick: the first client paint must match the server HTML
    const id = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(id);
  }, []);
  return hydrated;
}

export function update(mutate: (p: Progress) => Progress): Progress {
  const next = mutate(ensure());
  persist(next);
  return next;
}

/** register a finished lesson: best stars win, XP is only added on improvement */
export function completeLesson(lessonId: string, accuracy: number, stars: 1 | 2 | 3, xp: number) {
  return update((p) => {
    const previous = p.lessons[lessonId];
    const best = previous && previous.stars >= stars ? previous : { stars, accuracy, xp, at: Date.now() };
    const gainedXp = previous ? Math.max(0, xp - Math.round(previous.xp * 0.5)) : xp;
    return bumpStreak({
      ...p,
      xp: p.xp + gainedXp,
      lessons: { ...p.lessons, [lessonId]: best },
    });
  });
}

export function completeBoss(bossId: string, stars: 1 | 2 | 3, xp: number) {
  return update((p) => bumpStreak({ ...p, xp: p.xp + xp, bosses: { ...p.bosses, [bossId]: { stars, at: Date.now() } } }));
}

export function loseHeart(): number {
  let hearts = HEART_MAX;
  update((p) => {
    const now = Date.now();
    const base = applyHeartRegen(p, now);
    hearts = Math.max(0, base.hearts - 1);
    return { ...base, hearts, heartsAt: base.hearts >= HEART_MAX ? now : base.heartsAt };
  });
  return hearts;
}

export function refillHearts() {
  return update((p) => ({ ...p, hearts: HEART_MAX, heartsAt: 0 }));
}

export function awardBadge(badge: string) {
  return update((p) => (p.badges.includes(badge) ? p : { ...p, badges: [...p.badges, badge] }));
}

export function resetProgress() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  persist({ ...EMPTY, heartsAt: Date.now() });
}

function bumpStreak(p: Progress): Progress {
  const day = today();
  if (p.lastDay === day) return p;
  const yesterday = new Date(Date.now() - 86_400_000).toLocaleDateString("en-CA");
  return { ...p, streak: p.lastDay === yesterday ? p.streak + 1 : 1, lastDay: day };
}

/** stars earned on a lesson, 0 when never played */
export function starsOf(p: Progress, lessonId: string): number {
  return p.lessons[lessonId]?.stars ?? 0;
}

/** unlocks exactly follow the content graph: prerequisites need ≥ 2 stars */
export function isUnlocked(p: Progress, lessonId: string, buildsOn: string[]): boolean {
  if (buildsOn.length === 0) return true;
  return buildsOn.every((id) => starsOf(p, id) >= 2);
}

export function levelOf(xp: number): { level: number; title: string; into: number; span: number } {
  const steps = [0, 120, 300, 550, 900, 1350, 1900, 2600, 3500, 4600];
  const titles = [
    "تازه‌کار",
    "کاوشگر",
    "کلمه‌ساز",
    "جمله‌باف",
    "گفت‌وگوگر",
    "روان‌خوان",
    "داستان‌گو",
    "سفرگر",
    "استاد کوچک",
    "فاکسی‌شناس",
  ];
  let level = 1;
  for (let i = 0; i < steps.length; i += 1) if (xp >= steps[i]) level = i + 1;
  const base = steps[level - 1] ?? 0;
  const next = steps[level] ?? base + 1200;
  return { level, title: titles[level - 1] ?? "فاکسی‌شناس", into: xp - base, span: Math.max(1, next - base) };
}

