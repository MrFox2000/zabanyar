"use client";

/**
 * Sound effects, synthesised in the browser.
 *
 * No audio files: nothing to license, nothing to download, works offline. Every
 * sound is a few oscillator notes, so the "right answer" and "wrong answer"
 * moments are unmistakably different even at low volume.
 */

let context: AudioContext | null = null;
let muted = false;
let loaded = false;

const KEY = "zabanyar.sound";

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  muted = window.localStorage.getItem(KEY) === "off";
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  ensureLoaded();
  if (muted) return null;
  try {
    if (!context) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      context = new Ctor();
    }
    if (context.state === "suspended") void context.resume();
    return context;
  } catch {
    return null;
  }
}

function note(freq: number, start: number, duration: number, gain = 0.14, type: OscillatorType = "sine") {
  const ctx = audio();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime + start);
  envelope.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  envelope.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  oscillator.connect(envelope).connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + duration + 0.02);
}

/** rising two-note chime — "you got it" */
export function playCorrect(combo = 0) {
  const lift = Math.min(combo, 4) * 40;
  note(660 + lift, 0, 0.12, 0.13, "sine");
  note(990 + lift, 0.09, 0.16, 0.11, "sine");
}

/** soft descending buzz — never harsh, the learner is a beginner */
export function playWrong() {
  note(240, 0, 0.16, 0.12, "triangle");
  note(180, 0.1, 0.2, 0.1, "triangle");
}

/** sparkle for combos of 3+ */
export function playCombo(combo: number) {
  const base = 880 + Math.min(combo, 6) * 60;
  note(base, 0, 0.08, 0.09, "sine");
  note(base * 1.25, 0.06, 0.1, 0.08, "sine");
  note(base * 1.5, 0.12, 0.12, 0.07, "sine");
}

/** little fanfare for finishing a lesson or opening the chest */
export function playWin() {
  const melody = [523, 659, 784, 1047];
  melody.forEach((freq, index) => note(freq, index * 0.11, 0.24, 0.12, "triangle"));
}

export function playChest() {
  const melody = [784, 988, 1175, 1568];
  melody.forEach((freq, index) => note(freq, index * 0.08, 0.3, 0.1, "sine"));
}

export function isMuted(): boolean {
  ensureLoaded();
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  loaded = true;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, next ? "off" : "on");
}
