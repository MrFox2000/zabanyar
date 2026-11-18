"use client";

import { fetchProgress, getSession, pushProgress, type RemoteProgress, type Session } from "@/lib/account";

const PROGRESS_KEY = "zabanyar.progress.v1";

type LessonRecord = { stars: number; accuracy: number; xp: number; at: number };
type ProgressShape = {
  xp: number;
  gems: number;
  streak: number;
  lessons: Record<string, LessonRecord>;
  bosses?: Record<string, LessonRecord>;
  ownedSkins?: string[];
  activeSkin?: string;
  subscription?: { plan: string | null; until: number | null };
  [key: string]: unknown;
};

function readLocal(): ProgressShape | null {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as ProgressShape) : null;
  } catch {
    return null;
  }
}

/**
 * Keeps the better of the two copies: nothing is ever lost, and a fresh install
 * gets the whole history back from the account.
 */
export function mergeProgress(local: ProgressShape, remote: ProgressShape): ProgressShape {
  const lessons = { ...(remote.lessons ?? {}) };
  for (const [id, record] of Object.entries(local.lessons ?? {})) {
    const other = lessons[id];
    if (!other || record.stars > other.stars || (record.stars === other.stars && record.xp > other.xp)) {
      lessons[id] = record;
    }
  }

  const bosses = { ...(remote.bosses ?? {}), ...(local.bosses ?? {}) };
  const localSub = local.subscription?.until ?? 0;
  const remoteSub = remote.subscription?.until ?? 0;

  return {
    ...remote,
    ...local,
    lessons,
    bosses,
    xp: Math.max(local.xp ?? 0, remote.xp ?? 0),
    gems: Math.max(local.gems ?? 0, remote.gems ?? 0),
    streak: Math.max(local.streak ?? 0, remote.streak ?? 0),
    ownedSkins: Array.from(new Set([...(remote.ownedSkins ?? []), ...(local.ownedSkins ?? [])])),
    subscription: localSub >= remoteSub ? local.subscription : remote.subscription,
  };
}

/**
 * Called right after login: pull the account copy, merge it with this device and
 * write the result back to both sides.
 */
export async function reconcile(session: Session): Promise<"pulled" | "pushed" | "none"> {
  const local = readLocal();
  const remote: RemoteProgress | null = await fetchProgress(session);

  if (!remote) {
    if (local) await pushProgress(session, local as unknown as Record<string, unknown>);
    return local ? "pushed" : "none";
  }

  const remoteData = remote.data as unknown as ProgressShape;
  if (!local) {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(remoteData));
    return "pulled";
  }

  const merged = mergeProgress(local, remoteData);
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
  await pushProgress(session, merged as unknown as Record<string, unknown>);
  return "pulled";
}

/** every save pushes to the account when logged in (debounced by the caller) */
export async function syncNow(): Promise<void> {
  const session = getSession();
  const local = readLocal();
  if (!session || !local) return;
  await pushProgress(session, local as unknown as Record<string, unknown>);
}
