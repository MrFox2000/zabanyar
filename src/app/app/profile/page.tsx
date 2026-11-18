"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Award, Flame, RotateCcw, Star, Trophy, Zap } from "lucide-react";
import { Hud } from "@/components/Hud";
import { Foxy } from "@/components/Foxy";
import { Button } from "@/components/ui/Button";
import { allLessons, units } from "@/lib/content";
import { isUnlocked, levelOf, resetProgress, starsOf, useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

const BADGES: { id: string; title: string; emoji: string; test: (p: { lessons: number; stars: number; streak: number; xp: number; bosses: number }) => boolean }[] = [
  { id: "first-step", title: "اولین قدم", emoji: "👣", test: (p) => p.lessons >= 1 },
  { id: "three-stars", title: "بی‌نقص", emoji: "🌟", test: (p) => p.stars >= 3 },
  { id: "five-lessons", title: "پنج درس", emoji: "🖐️", test: (p) => p.lessons >= 5 },
  { id: "ten-lessons", title: "ده درس", emoji: "🔟", test: (p) => p.lessons >= 10 },
  { id: "streak-3", title: "سه روز پیاپی", emoji: "🔥", test: (p) => p.streak >= 3 },
  { id: "streak-7", title: "یک هفته پیاپی", emoji: "🗓️", test: (p) => p.streak >= 7 },
  { id: "xp-500", title: "۵۰۰ XP", emoji: "⚡", test: (p) => p.xp >= 500 },
  { id: "xp-2000", title: "۲۰۰۰ XP", emoji: "🚀", test: (p) => p.xp >= 2000 },
  { id: "boss-1", title: "اولین نبرد", emoji: "⚔️", test: (p) => p.bosses >= 1 },
  { id: "boss-all", title: "فاتح واحدها", emoji: "🏆", test: (p) => p.bosses >= units.length },
];

export default function ProfilePage() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const level = levelOf(progress.xp);

  const stats = useMemo(() => {
    const records = Object.values(progress.lessons);
    return {
      lessons: records.length,
      stars: records.reduce((sum, r) => sum + r.stars, 0),
      bosses: Object.keys(progress.bosses).length,
      xp: progress.xp,
      streak: progress.streak,
    };
  }, [progress]);

  const earned = BADGES.filter((badge) => hydrated && badge.test(stats));

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <div className="flex items-center gap-3">
          <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
            <ArrowRight size={14} /> نقشه
          </Link>
          <Link href="/app/share" className="text-xs font-bold text-fox-deep underline">
            کارت پیشرفت و اشتراک‌گذاری
          </Link>
        </div>

        <section className="card flex items-center gap-4 p-5">
          <Foxy size={84} mood={stats.lessons > 0 ? "cheer" : "happy"} className="bob shrink-0" />
          <div>
            <p className="text-xs font-bold text-fox-deep">سطح {fa(level.level)}</p>
            <h1 className="text-xl font-extrabold text-plum">{level.title}</h1>
            <p className="num mt-1 text-xs text-plum-soft">
              {fa(stats.xp)} XP · {fa(stats.lessons)} از {fa(allLessons.length)} درس
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric icon={<Zap size={16} />} label="XP" value={fa(stats.xp)} tone="text-fox-deep bg-fox/15" />
          <Metric icon={<Star size={16} />} label="ستاره" value={fa(stats.stars)} tone="text-[#a16207] bg-gold/20" />
          <Metric icon={<Flame size={16} />} label="روز پیاپی" value={fa(stats.streak)} tone="text-[#b32d47] bg-coral/15" />
          <Metric icon={<Trophy size={16} />} label="نبرد برده" value={fa(stats.bosses)} tone="text-[#067a55] bg-mint/15" />
        </div>

        <section className="card p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-extrabold text-plum">
            <Award size={16} /> نشان‌ها ({fa(earned.length)} از {fa(BADGES.length)})
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BADGES.map((badge) => {
              const has = earned.some((item) => item.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-bold",
                    has ? "border-gold/50 bg-gold/10 text-plum" : "border-plum/10 bg-white/50 text-plum/35",
                  )}
                >
                  <span className={cn("text-xl", !has && "opacity-40 grayscale")}>{badge.emoji}</span>
                  {badge.title}
                </div>
              );
            })}
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-extrabold text-plum">درس‌های باز‌شده</h2>
          <ul className="space-y-1.5">
            {units
              .filter((unit) => unit.lessons.some((lesson) => !hydrated || isUnlocked(progress, lesson.id, lesson.buildsOn)))
              .map((unit) => (
                <li key={unit.id} className="flex items-center justify-between rounded-xl bg-sand/60 px-3 py-2 text-xs">
                  <span className="font-bold text-plum">
                    {fa(unit.index)}. {unit.titleFa}
                  </span>
                  <span className="num text-plum-soft">
                    {fa(unit.lessons.reduce((n, lesson) => n + starsOf(progress, lesson.id), 0))} ستاره
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <div className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3">
          <p className="text-[11px] text-plum-soft">پیشرفت روی همین دستگاه ذخیره می‌شود.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm("همهٔ پیشرفت پاک شود؟")) resetProgress();
            }}
          >
            <RotateCcw size={14} /> از نو
          </Button>
        </div>
      </main>
    </div>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="card flex items-center gap-2.5 p-3">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tone)}>{icon}</span>
      <div className="min-w-0">
        <p className="num text-lg font-extrabold leading-tight text-plum">{value}</p>
        <p className="text-[11px] text-plum-soft">{label}</p>
      </div>
    </div>
  );
}
