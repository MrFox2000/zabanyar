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

/** real counters for the current day — the only source daily missions use */
export type DailyCounters = {
  day: string;
  answered: number;
  correct: number;
  review: number;
  xp: number;
  lessons: number;
  bossWins: number;
  chestOpened: boolean;
};

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
  daily: DailyCounters;
  /** lessonId → how many answers went wrong there */
  mistakes: Record<string, { count: number; at: number }>;
};

const KEY = "zabanyar.progress.v1";

export const emptyDaily = (day = ""): DailyCounters => ({
  day,
  answered: 0,
  correct: 0,
  review: 0,
  xp: 0,
  lessons: 0,
  bossWins: 0,
  chestOpened: false,
});

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
  daily: emptyDaily(),
  mistakes: {},
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

function rollDaily(p: Progress): Progress {
  const day = today();
  if (p.daily?.day === day) return p;
  return { ...p, daily: emptyDaily(day) };
}

function load(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return rollDaily({ ...EMPTY, heartsAt: Date.now() });
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return rollDaily(applyHeartRegen({ ...EMPTY, ...parsed, v: 1 }));
  } catch {
    return rollDaily({ ...EMPTY, heartsAt: Date.now() });
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

/** pure: add to today's counters, rolling the day over first if needed */
function withDaily(p: Progress, fields: Partial<Pick<DailyCounters, "answered" | "correct" | "review" | "xp" | "lessons" | "bossWins">>): Progress {
  const base = rollDaily(p);
  const daily = { ...base.daily };
  for (const [key, value] of Object.entries(fields) as [keyof DailyCounters, number][]) {
    if (typeof value === "number") (daily[key] as number) = ((daily[key] as number) ?? 0) + value;
  }
  return { ...base, daily };
}

/** register a finished lesson: best stars win, XP is only added on improvement */
export function completeLesson(lessonId: string, accuracy: number, stars: 1 | 2 | 3, xp: number) {
  return update((p) => {
    const previous = p.lessons[lessonId];
    const best = previous && previous.stars >= stars ? previous : { stars, accuracy, xp, at: Date.now() };
    const gainedXp = previous ? Math.max(0, xp - Math.round(previous.xp * 0.5)) : xp;
    const next = bumpStreak({
      ...p,
      xp: p.xp + gainedXp,
      lessons: { ...p.lessons, [lessonId]: best },
    });
    return withDaily(next, { lessons: 1 });
  });
}

export function completeBoss(bossId: string, stars: 1 | 2 | 3, xp: number) {
  return update((p) =>
    withDaily(
      bumpStreak({ ...p, xp: p.xp + xp, bosses: { ...p.bosses, [bossId]: { stars, at: Date.now() } } }),
      { bossWins: 1 },
    ),
  );
}

/**
 * Real counters for today's missions. Called from the lesson runner and the boss
 * battle as answers happen — no invented progress anywhere.
 */
export function bumpDaily(fields: Partial<Pick<DailyCounters, "answered" | "correct" | "review" | "xp" | "lessons" | "bossWins">>) {
  return update((p) => withDaily(p, fields));
}

/** the daily chest: once per day, only when all three missions are done */
export function openDailyChest(reward = 60) {
  let opened = false;
  update((p) => {
    const base = rollDaily(p);
    if (base.daily.chestOpened) return base;
    opened = true;
    return { ...base, xp: base.xp + reward, daily: { ...base.daily, chestOpened: true } };
  });
  return opened;
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

/** called from the lesson runner on every wrong answer */
export function recordMistake(lessonId: string) {
  return update((p) => {
    const previous = p.mistakes?.[lessonId];
    return {
      ...p,
      mistakes: {
        ...p.mistakes,
        [lessonId]: { count: (previous?.count ?? 0) + 1, at: Date.now() },
      },
    };
  });
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

