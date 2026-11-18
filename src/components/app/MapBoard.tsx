"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, Flame, Gem, Lock, Play, Star, Swords, Trophy, BookOpen } from "lucide-react";
import type { MapUnit } from "@/lib/content/map";
import { THEME_CLASS } from "@/lib/content";
import { Foxy } from "@/components/Foxy";
import { Stars } from "@/components/Stars";
import { Hud } from "@/components/Hud";
import { DailyMissions } from "@/components/app/DailyMissions";
import { DEMO, DEMO_LABEL } from "@/lib/demo";
import { SkinBackdrop } from "@/components/SkinBackdrop";
import { isUnlocked, levelOf, starsOf, useHydrated, useProgress } from "@/lib/store/progress";
import { unlockLessonWithGems } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

export function MapBoard({ units }: { units: MapUnit[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const [chosenLevel, setChosenLevel] = useState<MapUnit["level"] | null>(null);

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
  const studiedToday = progress.daily.lessons > 0 || progress.daily.answered > 0;
  const showReminder = hydrated && !studiedToday && Object.keys(progress.lessons).length > 0;
  const levels = useMemo(() => [...new Set(units.map((unit) => unit.level))], [units]);
  const activeLevel =
    chosenLevel ?? units.find((unit) => unit.lessons.some((lesson) => lesson.id === nextLesson?.id))?.level ?? units[0]?.level;
  const levelUnits = useMemo(() => units.filter((unit) => unit.level === activeLevel), [units, activeLevel]);
  const activeUnit =
    openUnit ?? levelUnits.find((unit) => unit.lessons.some((lesson) => lesson.id === nextLesson?.id))?.id ?? levelUnits[0]?.id;

  return (
    <div className="relative min-h-dvh">
      <SkinBackdrop />
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

        {showReminder && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-fox px-4 py-3 text-white">
            <p className="text-xs font-extrabold">
              امروز هنوز درس نخوانده‌ای — {fa(nextLesson?.exercises ?? 10)} تمرین، کمتر از ۵ دقیقه.
            </p>
            <Link href={nextLesson ? `/app/lesson/${nextLesson.id}` : "/app"} className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-[11px] font-extrabold text-fox-deep">
              شروع
            </Link>
          </div>
        )}

        <Link
          href="/app/start"
          className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-fox/20 bg-white px-4 py-3"
        >
          <span className="flex items-center gap-2 text-xs font-extrabold text-plum">
            <span className="grid size-8 place-items-center rounded-xl bg-fox/15 text-fox-deep">🎯</span>
            تعیین سطح — اگر انگلیسی‌ات خوب است، از جای درست شروع کن
          </span>
          <ChevronLeft size={16} className="shrink-0 text-plum/30" />
        </Link>

        <DailyMissions />

        {levels.length > 1 && (
          <div className="mb-3 flex items-center gap-2">
            {levels.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setChosenLevel(item);
                  setOpenUnit(null);
                }}
                className={cn(
                  "rounded-xl px-4 py-1.5 text-xs font-extrabold transition-colors",
                  item === activeLevel ? "bg-plum text-cream" : "bg-white text-plum-soft",
                )}
              >
                {item}
              </button>
            ))}
            <span className="text-[11px] text-plum-soft">
              {fa(levelUnits.reduce((sum, unit) => sum + unit.lessons.length, 0))} درس در این سطح
            </span>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {levelUnits.map((unit) => (
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
          {levelUnits
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

                            <button
                              type="button"
                              onClick={() => {
                                if (unlocked) return;
                                unlockLessonWithGems(lesson.id);
                              }}
                              className={cn(
                                "flex-1 rounded-2xl border border-transparent bg-white/70 p-3 text-right transition-colors",
                                unlocked ? "hover:border-fox/30 hover:bg-white" : "opacity-70",
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-extrabold text-plum">{lesson.titleFa}</p>
                                {unlocked ? (
                                  isNext ? (
                                    <Link
                                      href={`/app/lesson/${lesson.id}`}
                                      className="flex items-center gap-1 rounded-full bg-fox px-2 py-0.5 text-[10px] font-bold text-white"
                                    >
                                      <Play size={10} /> شروع
                                    </Link>
                                  ) : (
                                    <Link href={`/app/lesson/${lesson.id}`} aria-label={lesson.titleFa}>
                                      <Stars earned={stars} />
                                    </Link>
                                  )
                                ) : (
                                  <span className="num flex items-center gap-1 rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-bold text-[#a16207]">
                                    <Gem size={10} /> ۲۵ جم
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[11px] text-plum-soft">{lesson.goal}</p>
                              <p className="mt-1 text-[10px] text-plum-soft/70">
                                {fa(lesson.exercises)} تمرین · {fa(lesson.xp)} XP
                                {lesson.buildsOn.length > 0 && " · پیوسته به درس‌های قبل"}
                              </p>
                            </button>
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

        {DEMO && (
          <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-[11px] leading-5 text-[#a16407]">
            <b>{DEMO_LABEL}</b> — این نسخه برای نمونه‌کار است و فقط درس‌های ابتدایی باز است. کل دوره (A1 تا B2،
            ۱۶۸ درس) ساخته و تست شده است.
          </div>
        )}

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
          <Link href="/app/shop" className="card flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-fox/15 text-fox-deep">
              <Gem size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-plum">فروشگاه</p>
              <p className="num text-[11px] text-plum-soft">{fa(progress.gems)} جم · اسکین</p>
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
