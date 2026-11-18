"use client";

import { Foxy } from "@/components/Foxy";

export type CharacterId = "foxy" | "cat" | "panda" | "owl" | "sara" | "maryam";
export type Mood = "idle" | "happy" | "cheer" | "sad";

export const CHARACTERS: { id: CharacterId; name: string }[] = [
  { id: "foxy", name: "فاکسی" },
  { id: "sara", name: "سارا" },
  { id: "maryam", name: "مریم" },
  { id: "cat", name: "پیشی" },
  { id: "panda", name: "پاندا" },
  { id: "owl", name: "جغد" },
];

const CHEEK = "#FB7185";

function Eyes({ mood, cx1, cx2, cy, r = 6 }: { mood: Mood; cx1: number; cx2: number; cy: number; r?: number }) {
  if (mood === "cheer" || mood === "happy") {
    return (
      <>
        <path d={`M${cx1 - 8} ${cy} q8 -9 16 0`} stroke="#3F1D0B" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={`M${cx2 - 8} ${cy} q8 -9 16 0`} stroke="#3F1D0B" strokeWidth={4} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "sad") {
    return (
      <>
        <ellipse cx={cx1} cy={cy + 2} rx={r - 1.5} ry={r - 2} fill="#3F1D0B" />
        <ellipse cx={cx2} cy={cy + 2} rx={r - 1.5} ry={r - 2} fill="#3F1D0B" />
        <path d={`M${cx1 - 9} ${cy - 8} q9 4 18 0`} stroke="#3F1D0B" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={`M${cx2 - 9} ${cy - 8} q9 4 18 0`} stroke="#3F1D0B" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <circle cx={cx1} cy={cy} r={r} fill="#3F1D0B" />
      <circle cx={cx2} cy={cy} r={r} fill="#3F1D0B" />
      <circle cx={cx1 + 2} cy={cy - 2} r={2} fill="#FFF8F0" />
      <circle cx={cx2 + 2} cy={cy - 2} r={2} fill="#FFF8F0" />
    </>
  );
}

function Mouth({ mood, y = 88 }: { mood: Mood; y?: number }) {
  if (mood === "sad") {
    return <path d={`M52 ${y} q8 -6 16 0`} stroke="#3F1D0B" strokeWidth={3} fill="none" strokeLinecap="round" />;
  }
  if (mood === "cheer") {
    return <path d={`M50 ${y - 2} q10 12 20 0`} stroke="#3F1D0B" strokeWidth={3.4} fill="#3F1D0B" strokeLinecap="round" />;
  }
  return <path d={`M52 ${y} q8 7 16 0`} stroke="#3F1D0B" strokeWidth={3} fill="none" strokeLinecap="round" />;
}

/**
 * The cast. Every character reacts to right and wrong answers differently, so a
 * learner gets a face, not a green tick. All inline SVG — nothing to license.
 */
export function Character({ id, mood = "happy", size = 96, className }: { id: CharacterId; mood?: Mood; size?: number; className?: string }) {
  if (id === "foxy") {
    return <Foxy size={size} mood={mood === "idle" ? "happy" : mood === "sad" ? "oops" : mood === "cheer" ? "cheer" : "happy"} className={className} />;
  }

  const common = { viewBox: "0 0 120 120", width: size, height: size, className, role: "img" as const };

  if (id === "cat") {
    return (
      <svg {...common} aria-label="پیشی">
        <path d="M26 44 L21 14 L50 30 Z" fill="#9CA3AF" />
        <path d="M94 44 L99 14 L70 30 Z" fill="#9CA3AF" />
        <path d="M28 38 L25 22 L42 30 Z" fill="#FBCFE8" />
        <path d="M92 38 L95 22 L78 30 Z" fill="#FBCFE8" />
        <path d="M60 26 C86 26 100 44 100 66 C100 92 82 108 60 108 C38 108 20 92 20 66 C20 44 34 26 60 26 Z" fill="#9CA3AF" />
        <ellipse cx="60" cy="84" rx="25" ry="19" fill="#F9FAFB" />
        <Eyes mood={mood} cx1={45} cx2={75} cy={64} />
        <path d="M56 76 h8 l-4 5 Z" fill={CHEEK} />
        <Mouth mood={mood} y={88} />
        <path d="M18 76 l16 -3 M18 84 l16 1 M102 76 l-16 -3 M102 84 l-16 1" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" />
        <ellipse cx="32" cy="80" rx="6" ry="4" fill={CHEEK} opacity="0.5" />
        <ellipse cx="88" cy="80" rx="6" ry="4" fill={CHEEK} opacity="0.5" />
      </svg>
    );
  }

  if (id === "panda") {
    return (
      <svg {...common} aria-label="پاندا">
        <circle cx="30" cy="30" r="15" fill="#27272A" />
        <circle cx="90" cy="30" r="15" fill="#27272A" />
        <circle cx="60" cy="64" r="44" fill="#F9FAFB" />
        <ellipse cx="43" cy="60" rx="13" ry="15" fill="#27272A" transform="rotate(-18 43 60)" />
        <ellipse cx="77" cy="60" rx="13" ry="15" fill="#27272A" transform="rotate(18 77 60)" />
        <Eyes mood={mood} cx1={43} cx2={77} cy={62} r={5} />
        <ellipse cx="60" cy="80" rx="6" ry="4.5" fill="#27272A" />
        <Mouth mood={mood} y={90} />
        <ellipse cx="28" cy="80" rx="6" ry="4" fill={CHEEK} opacity="0.5" />
        <ellipse cx="92" cy="80" rx="6" ry="4" fill={CHEEK} opacity="0.5" />
      </svg>
    );
  }

  if (id === "owl") {
    return (
      <svg {...common} aria-label="جغد">
        <path d="M24 40 L32 16 L46 32 Z" fill="#A16207" />
        <path d="M96 40 L88 16 L74 32 Z" fill="#A16207" />
        <ellipse cx="60" cy="66" rx="42" ry="44" fill="#CA8A04" />
        <ellipse cx="60" cy="84" rx="26" ry="20" fill="#FEF3C7" />
        <circle cx="44" cy="60" r="16" fill="#FFFBEB" />
        <circle cx="76" cy="60" r="16" fill="#FFFBEB" />
        <Eyes mood={mood} cx1={44} cx2={76} cy={60} r={7} />
        <path d="M60 70 l-7 10 h14 Z" fill="#EA580C" />
        <ellipse cx="26" cy="78" rx="6" ry="4" fill={CHEEK} opacity="0.5" />
        <ellipse cx="94" cy="78" rx="6" ry="4" fill={CHEEK} opacity="0.5" />
      </svg>
    );
  }

  const hijab = id === "sara" ? "#FB7185" : "#34D399";
  const hijabDark = id === "sara" ? "#E11D48" : "#059669";

  return (
    <svg {...common} aria-label={id === "sara" ? "سارا" : "مریم"}>
      {/* shoulders / garment so it reads as clothing, not a hood */}
      <path d="M18 120 C18 100 34 92 60 92 C86 92 102 100 102 120 Z" fill={hijabDark} opacity="0.85" />
      {/* hijab wrapping the head */}
      <path d="M60 10 C88 10 106 32 106 62 C106 88 96 104 86 112 L34 112 C24 104 14 88 14 62 C14 32 32 10 60 10 Z" fill={hijab} />
      {/* face opening */}
      <path d="M60 24 C79 24 90 40 90 60 C90 78 80 90 60 90 C40 90 30 78 30 60 C30 40 41 24 60 24 Z" fill="#FDE7D8" />
      {/* soft shadow where the hijab meets the forehead */}
      <path d="M34 40 C40 28 50 24 60 24 C70 24 80 28 86 40 C80 34 70 31 60 31 C50 31 40 34 34 40 Z" fill="#E7C4AE" opacity="0.55" />
      {/* brows */}
      <path d="M42 50 q6 -4 12 -1" stroke="#7C4A2D" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M78 50 q-6 -4 -12 -1" stroke="#7C4A2D" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Eyes mood={mood} cx1={48} cx2={72} cy={60} r={5.2} />
      <Mouth mood={mood} y={78} />
      <ellipse cx="38" cy="70" rx="5.5" ry="3.6" fill={CHEEK} opacity="0.55" />
      <ellipse cx="82" cy="70" rx="5.5" ry="3.6" fill={CHEEK} opacity="0.55" />
      {/* pin on the hijab */}
      <circle cx="84" cy="30" r="5" fill="#FBBF24" />
      <circle cx="91" cy="26" r="3.2" fill="#FB7185" />
    </svg>
  );
}

/** pick a character that stays with a lesson (stable, so it feels like a guide) */
export function characterFor(seed: string): CharacterId {
  let value = 7;
  for (const character of seed) value = (value * 31 + (character.codePointAt(0) ?? 0)) % 100003;
  const cast: CharacterId[] = ["foxy", "sara", "maryam", "cat", "panda", "owl"];
  return cast[value % cast.length];
}
