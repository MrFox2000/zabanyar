/**
 * Typed event bus every screen may emit to.
 *
 * Today nothing listens — the app is fully static. Later, an AI coach,
 * adaptive difficulty or a review scheduler subscribes to these events without
 * the lesson code knowing anything about them.
 */
export type AiEvent =
  | { type: "exercise_answered"; lessonId: string; exerciseId: string; kind: string; correct: boolean; ms: number }
  | { type: "mistake_made"; lessonId: string; exerciseId: string; prompt: string; expected: string; given: string }
  | { type: "lesson_started"; lessonId: string }
  | { type: "lesson_finished"; lessonId: string; accuracy: number; stars: number; xp: number }
  | { type: "streak_lost"; lessonId: string }
  | { type: "unit_finished"; unitId: string };

type Listener = (event: AiEvent) => void;

const listeners = new Set<Listener>();
const seen: AiEvent[] = [];
const MAX_BUFFER = 200;

export function emit(event: AiEvent): void {
  seen.push(event);
  if (seen.length > MAX_BUFFER) seen.shift();
  for (const listener of listeners) {
    try {
      listener(event);
    } catch {
      /* a broken subscriber must never break a lesson */
    }
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** recent events, for whatever wants to reason about the session later */
export function recentEvents(limit = 50): AiEvent[] {
  return seen.slice(-limit);
}
