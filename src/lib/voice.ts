"use client";

/**
 * Voice selection with a real fallback chain.
 *
 * Browser speech engines are unreliable: a "natural" voice can disappear after a
 * browser update, fail to load without a network, or simply produce no sound on
 * some Android builds. So:
 *
 *   1. the learner can pick a voice (and test it) in /app/settings,
 *   2. every utterance tries the preferred voice, then other natural voices,
 *      then any English voice,
 *   3. if nothing speaks, the UI can point them at the settings page.
 */

export type VoiceInfo = {
  uri: string;
  name: string;
  lang: string;
  natural: boolean;
  local: boolean;
};

const NATURAL = /natural|neural|enhanced|premium|google|siri|samantha|ava|aria|jenny|guy|zira|emma|brian/i;
const PREF_KEY = "zabanyar.voice";
const RATE_KEY = "zabanyar.voiceRate";

export function voiceSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function listVoices(): VoiceInfo[] {
  if (!voiceSupported()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .map((voice) => ({
      uri: voice.voiceURI,
      name: voice.name,
      lang: voice.lang,
      natural: NATURAL.test(voice.name),
      local: voice.localService,
    }))
    .sort((a, b) => Number(b.natural) - Number(a.natural) || a.name.localeCompare(b.name));
}

export function preferredVoiceUri(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PREF_KEY);
}

export function setPreferredVoiceUri(uri: string | null) {
  if (typeof window === "undefined") return;
  if (uri) window.localStorage.setItem(PREF_KEY, uri);
  else window.localStorage.removeItem(PREF_KEY);
}

export function voiceRate(): number {
  if (typeof window === "undefined") return 0.92;
  const stored = Number(window.localStorage.getItem(RATE_KEY));
  return Number.isFinite(stored) && stored >= 0.5 && stored <= 1.2 ? stored : 0.92;
}

export function setVoiceRate(rate: number) {
  if (typeof window !== "undefined") window.localStorage.setItem(RATE_KEY, String(rate));
}

/** preferred first, then natural voices, then any English voice, then anything */
function candidateVoices(): SpeechSynthesisVoice[] {
  if (!voiceSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const preferred = preferredVoiceUri();
  const ordered: SpeechSynthesisVoice[] = [];
  const push = (voice?: SpeechSynthesisVoice) => {
    if (voice && !ordered.includes(voice)) ordered.push(voice);
  };

  push(english.find((voice) => voice.voiceURI === preferred));
  english.filter((voice) => NATURAL.test(voice.name)).forEach(push);
  english.filter((voice) => voice.lang === "en-US").forEach(push);
  english.forEach(push);

  return ordered;
}

let lastFailure = 0;

/** true when the last attempt produced no sound */
export function speechFailedRecently(): boolean {
  return Date.now() - lastFailure < 5000;
}

/**
 * Speak with fallback. Resolves to the voice that was used, or null when the
 * browser could not speak at all.
 */
export async function speakWithFallback(text: string, rate = voiceRate()): Promise<VoiceInfo | null> {
  if (!voiceSupported()) {
    lastFailure = Date.now();
    return null;
  }
  const voices = candidateVoices();
  if (voices.length === 0) {
    // some browsers only expose voices after the first user gesture
    window.speechSynthesis.getVoices();
    lastFailure = Date.now();
    return null;
  }

  for (const voice of voices.slice(0, 3)) {
    const ok = await new Promise<boolean>((resolve) => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-US";
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 1;
        let settled = false;
        const finish = (result: boolean) => {
          if (settled) return;
          settled = true;
          resolve(result);
        };
        utterance.onstart = () => {
          lastFailure = 0;
          finish(true);
        };
        utterance.onerror = () => finish(false);
        window.speechSynthesis.speak(utterance);
        // no onstart within 1.2s means this voice is silently broken
        setTimeout(() => finish(false), 1200);
      } catch {
        resolve(false);
      }
    });

    if (ok) {
      return { uri: voice.voiceURI, name: voice.name, lang: voice.lang, natural: NATURAL.test(voice.name), local: voice.localService };
    }
  }

  lastFailure = Date.now();
  return null;
}

export function stopSpeaking() {
  if (voiceSupported()) window.speechSynthesis.cancel();
}
