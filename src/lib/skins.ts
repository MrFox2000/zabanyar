/**
 * Skins are pure cosmetics: a background gradient for the app shell, bought with
 * gems. Nothing here gates learning — that is a hard rule in docs/GROWTH.md.
 */
export type Skin = {
  id: string;
  nameFa: string;
  price: number;
  /** gradient classes for the page backdrop */
  gradient: string;
  /** swatch classes for the shop */
  swatch: string;
};

export const SKINS: Skin[] = [
  { id: "classic", nameFa: "کلاسیک", price: 0, gradient: "", swatch: "bg-[#fff8f0]" },
  { id: "sunset", nameFa: "غروب", price: 60, gradient: "bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100", swatch: "bg-gradient-to-br from-orange-300 to-rose-300" },
  { id: "forest", nameFa: "جنگل", price: 80, gradient: "bg-gradient-to-br from-emerald-100 via-lime-50 to-teal-100", swatch: "bg-gradient-to-br from-emerald-300 to-lime-300" },
  { id: "ocean", nameFa: "اقیانوس", price: 100, gradient: "bg-gradient-to-br from-sky-100 via-cyan-50 to-indigo-100", swatch: "bg-gradient-to-br from-sky-300 to-indigo-300" },
  { id: "candy", nameFa: "آب‌نبات", price: 120, gradient: "bg-gradient-to-br from-pink-100 via-fuchsia-50 to-purple-100", swatch: "bg-gradient-to-br from-pink-300 to-purple-300" },
  { id: "gold", nameFa: "طلایی", price: 180, gradient: "bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100", swatch: "bg-gradient-to-br from-yellow-300 to-amber-400" },
];

export function skinById(id: string): Skin {
  return SKINS.find((skin) => skin.id === id) ?? SKINS[0];
}

/** rank tiers, purely a function of lifetime XP — no invented ladder */
export const RANKS = [
  { id: "bronze", nameFa: "برنز", min: 0, emoji: "🥉" },
  { id: "silver", nameFa: "نقره", min: 600, emoji: "🥈" },
  { id: "gold", nameFa: "طلا", min: 1500, emoji: "🥇" },
  { id: "platinum", nameFa: "پلاتینیوم", min: 3000, emoji: "💠" },
  { id: "diamond", nameFa: "الماس", min: 5000, emoji: "💎" },
];

export function rankOf(xp: number) {
  let current = RANKS[0];
  for (const rank of RANKS) if (xp >= rank.min) current = rank;
  const next = RANKS[RANKS.indexOf(current) + 1] ?? null;
  return { current, next, toNext: next ? next.min - xp : 0 };
}
