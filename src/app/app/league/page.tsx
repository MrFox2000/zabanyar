"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CalendarClock, Info, Star, Zap } from "lucide-react";
import { Hud } from "@/components/Hud";
import { Foxy } from "@/components/Foxy";
import { allLessons, lessonsById, units } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store/progress";
import { fa } from "@/lib/utils";

/** seven real days, computed from the timestamps we actually store */
export default function LeaguePage() {
  const progress = useProgress();
  const hydrated = useHydrated();

  const week = useMemo(() => {
    // This view is explicitly about *now* — the clock is the input, not hidden
    // state, so reading it here is intended.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const days = Array.from({ length: 7 }).map((_, offset) => {
      const day = new Date(now - (6 - offset) * 86_400_000);
      const key = day.toLocaleDateString("en-CA");
      const records = Object.entries(progress.lessons).filter(
        ([, record]) => new Date(record.at).toLocaleDateString("en-CA") === key,
      );
      return {
        key,
        label: day.toLocaleDateString("fa-IR", { weekday: "short" }),
        lessons: records.length,
        xp: records.reduce((sum, [, record]) => sum + record.xp, 0),
      };
    });
    return {
      days,
      lessons: days.reduce((sum, day) => sum + day.lessons, 0),
      xp: days.reduce((sum, day) => sum + day.xp, 0),
      max: Math.max(1, ...days.map((day) => day.xp)),
    };
  }, [progress.lessons]);

  const recent = Object.entries(progress.lessons)
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, 5)
    .map(([id, record]) => ({ id, record, lesson: lessonsById.get(id) }));

  const unitStars = units.map((unit) => ({
    unit,
    stars: unit.lessons.reduce((sum, lesson) => sum + (progress.lessons[lesson.id]?.stars ?? 0), 0),
    max: unit.lessons.length * 3,
  }));

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        <section className="card flex items-center gap-3 p-5">
          <Foxy size={64} mood="think" className="shrink-0" />
          <div>
            <h1 className="text-lg font-extrabold text-plum">هفتهٔ تو</h1>
            <p className="text-xs leading-5 text-plum-soft">
              این نمودار از درس‌هایی ساخته شده که واقعاً تمام کرده‌ای — هفت روز اخیر.
            </p>
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-plum">
              <CalendarClock size={15} /> هفت روز اخیر
            </h2>
            <span className="num rounded-full bg-fox/15 px-2.5 py-1 text-[11px] font-bold text-fox-deep">
              {hydrated ? `${fa(week.lessons)} درس · ${fa(week.xp)} XP` : "—"}
            </span>
          </div>

          <div className="flex h-32 items-end justify-between gap-2">
            {week.days.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-24 w-full items-end justify-center">
                  <div
                    className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-fox to-coral transition-all"
                    style={{ height: `${Math.max(6, (day.xp / week.max) * 100)}%`, opacity: day.xp ? 1 : 0.25 }}
                    title={`${day.lessons} درس`}
                  />
                </div>
                <span className="text-[10px] text-plum-soft">{day.label}</span>
                <span className="num text-[10px] font-bold text-plum">{fa(day.xp)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-extrabold text-plum">
            <Star size={15} /> ستاره‌های هر واحد
          </h2>
          <ul className="space-y-2">
            {unitStars.map(({ unit, stars, max }) => (
              <li key={unit.id} className="flex items-center gap-2">
                <span className="w-24 shrink-0 truncate text-[11px] font-bold text-plum">
                  {fa(unit.index)}. {unit.titleFa}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${hydrated ? (stars / max) * 100 : 0}%` }} />
                </div>
                <span className="num w-10 text-left text-[10px] text-plum-soft">
                  {fa(stars)}/{fa(max)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {recent.length > 0 && (
          <section className="card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-plum">
              <Zap size={15} /> آخرین درس‌ها
            </h2>
            <ul className="divide-y divide-plum/5">
              {recent.map(({ id, record, lesson }) => (
                <li key={id} className="flex items-center justify-between py-2 text-xs">
                  <span className="font-bold text-plum">{lesson?.titleFa ?? id}</span>
                  <span className="flex gap-1 text-gold" aria-label={`${record.stars} ستاره`}>
                    {Array.from({ length: record.stars }).map((_, i) => (
                      <Star key={i} size={11} className="fill-gold" />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex items-start gap-2 rounded-2xl border border-sky/30 bg-sky/10 p-3 text-[11px] leading-5 text-[#0369a1]">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>
            لیگ ۳۰ نفره و رقابت هفتگی با حساب کاربری می‌آید (فاز ۲). الان رقیب واقعی نداری، پس عدد الکی نشان
            نمی‌دهیم — فقط پیشرفت خودت. از {fa(allLessons.length)} درس A1 اینجا دیده می‌شود.
          </p>
        </section>
      </main>
    </div>
  );
}
