import { speakWithFallback, stopSpeaking } from "@/lib/voice";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function fa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** speak an English word or sentence with a working voice, with fallbacks */
export function speak(text: string, rate = 0.92) {
  stopSpeaking();
  void speakWithFallback(text, rate);
}

/** browsers load the voice list asynchronously; call once on mount */
export function primeVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
}

/** slower replay for a word the learner missed */
export function speakSlow(text: string) {
  speak(text, 0.62);
}

export function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Split Persian copy into runs so embedded English ("با I از am استفاده کن") is
 * isolated with its own direction instead of being re-ordered by the bidi
 * algorithm — the bug that made grammar tips look scrambled.
 */
export function mixedRuns(text: string): { text: string; latin: boolean }[] {
  const parts: { text: string; latin: boolean }[] = [];
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    const latin = /^[A-Za-z]/.test(token);
    const last = parts[parts.length - 1];
    if (last && last.latin === latin) last.text += token;
    else parts.push({ text: token, latin });
  }
  return parts;
}
