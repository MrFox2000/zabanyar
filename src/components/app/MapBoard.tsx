"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, Flame, Lock, Play, Star, Swords, Trophy, BookOpen } from "lucide-react";
import type { MapUnit } from "@/lib/content/map";
import { THEME_CLASS } from "@/lib/content";
import { Foxy } from "@/components/Foxy";
import { Stars } from "@/components/Stars";
import { Hud } from "@/components/Hud";
import { DailyMissions } from "@/components/app/DailyMissions";
import { isUnlocked, levelOf, starsOf, useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

export function MapBoard({ units }: { units: MapUnit[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [openUnit, setOpenUnit] = useState<string | null>(null);

  const nextLesson = useMemo(() => {
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (!hydrated) return lesson;
        if (isUnlocked(progress, lesson.id, lesson.buildsOn) && starsOf(progress, lesson.id) < 2) return lesson;
      }
    }
    return units[0]?.lessons[0];
  }, [hydrated, progress, units]);

  const level = levelOf(progress.xp);
  const activeUnit = openUnit ?? units.find((u) => u.lessons.some((l) => l.id === nextLesson?.id))?.id ?? units[0]?.id;

  return (
    <div className="min-h-dvh">
      <Hud />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-5">
        <section className="card mb-5 flex items-center gap-4 p-4">
          <Foxy size={78} mood="happy" className="bob shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-fox-deep">سطح {fa(level.level)} · {level.title}</p>
            <h1 className="truncate text-lg font-extrabold text-plum">
              {nextLesson ? `بریم سراغ «${nextLesson.titleFa}»` : "همهٔ درس‌ها تمام شد!"}
            </h1>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-gradient-to-l from-fox to-coral" style={{ width: `${(level.into / level.span) * 100}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-plum-soft num">
              {fa(level.into)} / {fa(level.span)} تا سطح بعدی
            </p>
          </div>
        </section>

        <DailyMissions />

        <div className="mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {units.map((unit) => (
            <button
              key={unit.id}
              type="button"
              onClick={() => setOpenUnit(unit.id)}
              className={cn(
                "shrink-0 rounded-2xl px-3.5 py-2 text-xs font-extrabold transition-colors",
                unit.id === activeUnit ? `${THEME_CLASS[unit.theme].bg} text-white shadow-pop` : "bg-white text-plum-soft",
              )}
            >
              واحد {fa(unit.index)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {units
            .filter((unit) => unit.id === activeUnit)
            .map((unit) => {
              const tone = THEME_CLASS[unit.theme];
              const done = unit.lessons.filter((lesson) => starsOf(progress, lesson.id) >= 2).length;
              const bossUnlocked = hydrated && done === unit.lessons.length;

              return (
                <section key={unit.id} className="card overflow-hidden">
                  <header className={cn("flex items-center justify-between px-5 py-4", tone.bg)}>
                    <div>
                      <p className="text-[11px] font-bold text-white/80">{unit.titleEn}</p>
                      <h2 className="text-lg font-extrabold text-white">
                        {fa(unit.index)}. {unit.titleFa}
                      </h2>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-bold text-white">
                      <Trophy size={13} /> {fa(done)}/{fa(unit.lessons.length)}
                    </span>
                  </header>

                  <div className="relative px-5 py-5">
                    <div className="absolute inset-y-6 right-[3.1rem] w-0.5 border-r-2 border-dashed border-fox/20" aria-hidden />
                    <ol className="relative space-y-3">
                      {unit.lessons.map((lesson, position) => {
                        const stars = starsOf(progress, lesson.id);
                        const unlocked = !hydrated || isUnlocked(progress, lesson.id, lesson.buildsOn);
                        const isNext = lesson.id === nextLesson?.id;
                        const offset = position % 2 === 0 ? "mr-0" : "mr-10";

                        return (
                          <li key={lesson.id} className={cn("relative flex items-center gap-3", offset)}>
                            <span
                              className={cn(
                                "z-10 grid size-16 shrink-0 place-items-center rounded-full border-4 text-xl font-extrabold shadow-pop transition-colors",
                                stars >= 2
                                  ? `${tone.bg} border-white text-white`
                                  : unlocked
                                    ? "border-white bg-white text-plum"
                                    : "border-white bg-sand text-plum/35",
                                isNext && "ring-4 ring-fox/30",
                              )}
                            >
                              {!unlocked ? <Lock size={20} /> : stars >= 2 ? <Star size={22} className="fill-white" /> : fa(position + 1)}
                            </span>

                            <Link
                              href={unlocked ? `/app/lesson/${lesson.id}` : "/app"}
                              aria-disabled={!unlocked}
                              className={cn(
                                "flex-1 rounded-2xl border border-transparent bg-white/70 p-3 transition-colors",
                                unlocked ? "hover:border-fox/30 hover:bg-white" : "pointer-events-none opacity-60",
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-extrabold text-plum">{lesson.titleFa}</p>
                                {isNext ? (
                                  <span className="flex items-center gap-1 rounded-full bg-fox px-2 py-0.5 text-[10px] font-bold text-white">
                                    <Play size={10} /> شروع
                                  </span>
                                ) : (
                                  <Stars earned={stars} />
                                )}
                              </div>
                              <p className="mt-0.5 text-[11px] text-plum-soft">{lesson.goal}</p>
                              <p className="mt-1 text-[10px] text-plum-soft/70">
                                {fa(lesson.exercises)} تمرین · {fa(lesson.xp)} XP
                                {lesson.buildsOn.length > 0 && " · پیوسته به درس‌های قبل"}
                              </p>
                            </Link>
                          </li>
                        );
                      })}

                      <li className="relative mt-5 flex items-center gap-3">
                        <span
                          className={cn(
                            "z-10 grid size-16 shrink-0 place-items-center rounded-full border-4 border-white shadow-pop",
                            bossUnlocked ? "bg-plum text-white" : "bg-sand text-plum/35",
                          )}
                        >
                          {bossUnlocked ? <Swords size={22} /> : <Lock size={20} />}
                        </span>
                        <Link
                          href={bossUnlocked ? `/app/boss/${unit.id}` : "/app"}
                          className={cn(
                            "flex-1 rounded-2xl border border-dashed border-plum/20 bg-plum/5 p-3",
                            !bossUnlocked && "pointer-events-none opacity-60",
                          )}
                        >
                          <p className="flex items-center gap-1.5 text-sm font-extrabold text-plum">
                            <Swords size={14} /> {unit.boss.titleFa}
                          </p>
                          <p className="mt-0.5 text-[11px] text-plum-soft">
                            {bossUnlocked ? `${fa(unit.boss.exercises)} سؤال ترکیبی — آماده‌ای؟` : "با ۲ ستاره در همهٔ درس‌های واحد باز می‌شود"}
                          </p>
                        </Link>
                      </li>
                    </ol>
                  </div>
                </section>
              );
            })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/app/notebook" className="card flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-mint/20 text-[#065f46]">
              <BookOpen size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-plum">دفتر من</p>
              <p className="text-[11px] text-plum-soft">کلمه‌ها و نکته‌ها</p>
            </div>
          </Link>
          <Link href="/app/league" className="card flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-gold/20 text-[#a16207]">
              <Flame size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-plum">لیگ و نشان‌ها</p>
              <p className="text-[11px] text-plum-soft">جایگاه هفتگی</p>
            </div>
          </Link>
          <Link href="/app/profile" className="card flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-sky/20 text-[#0369a1]">
              <Trophy size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-plum">پروفایل</p>
              <p className="text-[11px] text-plum-soft">پیشرفت کلی</p>
            </div>
            <ChevronLeft size={16} className="mr-auto text-plum/30" />
          </Link>
        </div>
      </main>
    </div>
  );
}
