"use client";

import type { DailyCounters } from "@/lib/store/progress";

/**
 * Three daily missions, derived from the real counters we already store.
 * Nothing here is random at render time: the same day always yields the same
 * three missions, so the card never changes under the learner's eyes.
 */
export type MissionKind = "answered" | "correct" | "review" | "xp" | "lessons" | "bossWins";

export type Mission = {
  id: string;
  kind: MissionKind;
  title: string;
  icon: string;
  target: number;
  progress: number;
  done: boolean;
};

type Definition = { kind: MissionKind; target: number; title: string; icon: string };

const POOL: Definition[] = [
  { kind: "correct", target: 20, title: "۲۰ جواب درست", icon: "✅" },
  { kind: "answered", target: 25, title: "۲۵ تمرین پاسخ بده", icon: "🎯" },
  { kind: "xp", target: 150, title: "۱۵۰ XP جمع کن", icon: "⚡" },
  { kind: "lessons", target: 2, title: "۲ درس را کامل کن", icon: "📘" },
  { kind: "review", target: 6, title: "۶ سؤال مرور درست بزن", icon: "🔁" },
  { kind: "bossWins", target: 1, title: "یک نبرد پایانی را ببر", icon: "⚔️" },
];

const MISSION_COUNT = 3;

function hashDay(day: string): number {
  let value = 7;
  for (const character of day) value = (value * 31 + (character.codePointAt(0) ?? 0)) % 100003;
  return value;
}

export function todayMissions(daily: DailyCounters): Mission[] {
  const start = hashDay(daily.day) % POOL.length;
  const picked: Definition[] = [];
  for (let offset = 0; offset < POOL.length && picked.length < MISSION_COUNT; offset += 1) {
    const candidate = POOL[(start + offset * 2) % POOL.length];
    if (!picked.some((item) => item.kind === candidate.kind)) picked.push(candidate);
  }

  return picked.map((item) => {
    const progress = Math.min(item.target, daily[item.kind] ?? 0);
    return {
      id: `${daily.day}-${item.kind}`,
      kind: item.kind,
      title: item.title,
      icon: item.icon,
      target: item.target,
      progress,
      done: progress >= item.target,
    };
  });
}

export function allMissionsDone(missions: Mission[]): boolean {
  return missions.length > 0 && missions.every((mission) => mission.done);
}

export const CHEST_REWARD = 60;
