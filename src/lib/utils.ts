import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function fa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** prefer a natural-sounding voice; cached names are the best the device has */
const NICE_VOICE = /google|natural|neural|siri|samantha|ava|aria|jenny|guy|zira|enhanced|premium/i;

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (voices.length === 0) return null;
  const ranked = [...voices].sort((a, b) => {
    const score = (voice: SpeechSynthesisVoice) =>
      (NICE_VOICE.test(voice.name) ? 2 : 0) + (voice.lang === "en-US" ? 1 : 0) + (voice.localService ? 0 : 0.5);
    return score(b) - score(a);
  });
  cachedVoice = ranked[0] ?? null;
  return cachedVoice;
}

/** call once on mount: browsers load the voice list asynchronously */
export function primeVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoice = null;
    pickVoice();
  });
}

/** speak an English word with the Web Speech API — no audio assets to license */
export function speak(text: string, rate = 0.92) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* silence is an acceptable fallback */
  }
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
