"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, Search, TriangleAlert, Volume2 } from "lucide-react";
import { Hud } from "@/components/Hud";
import { WordImage } from "@/components/WordImage";
import { BiText } from "@/components/BiText";
import { useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa, speak } from "@/lib/utils";

export type NotebookEntry = {
  id: string;
  titleFa: string;
  titleEn: string;
  level: string;
  unitIndex: number;
  unitTitle: string;
  order: number;
  vocab: { en: string; fa: string; emoji?: string }[];
  tip: { title: string; body: string } | null;
  sentences: { en: string; fa: string }[];
};

type Tab = "words" | "tips" | "sentences" | "weak";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "words", label: "کلمه‌ها", icon: "🔤" },
  { id: "sentences", label: "جمله‌ها", icon: "💬" },
  { id: "tips", label: "نکته‌ها", icon: "📌" },
  { id: "weak", label: "ضعف‌های من", icon: "🎯" },
];

type LevelGroup = {
  level: string;
  lessons: number;
  units: { index: number; title: string; lessons: NotebookEntry[] }[];
};

/**
 * «دفتر من» — three levels of navigation, in this order:
 *   سطح (A1/A2) → فصل/واحد → درس → آیتم‌ها
 * so the learner can reach anything they have learned in two taps, and the
 * weak-spot tab links every recorded mistake back to its lesson.
 */
export function Notebook({ entries }: { entries: NotebookEntry[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("words");
  const [query, setQuery] = useState("");
  const [onlyLearned, setOnlyLearned] = useState(true);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const learned = useMemo(() => new Set(Object.keys(progress.lessons)), [progress.lessons]);
  const mistakeMap = useMemo(() => progress.mistakes ?? {}, [progress.mistakes]);

  const needle = query.trim().toLowerCase();
  const matches = (text: string) => !needle || text.toLowerCase().includes(needle);
  const matchesFa = (text: string) => !needle || text.includes(query.trim());

  const visible = useMemo(
    () => entries.filter((entry) => !onlyLearned || !hydrated || learned.has(entry.id)),
    [entries, hydrated, learned, onlyLearned],
  );

  const tree = useMemo<LevelGroup[]>(() => {
    const byLevel = new Map<string, Map<number, LevelGroup["units"][number]>>();
    for (const entry of visible) {
      const units = byLevel.get(entry.level) ?? new Map();
      const unit = units.get(entry.unitIndex) ?? { index: entry.unitIndex, title: entry.unitTitle, lessons: [] };
      unit.lessons.push(entry);
      units.set(entry.unitIndex, unit);
      byLevel.set(entry.level, units);
    }
    return [...byLevel.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([level, units]) => {
        const list = [...units.values()]
          .sort((a, b) => a.index - b.index)
          .map((unit) => ({ ...unit, lessons: unit.lessons.sort((a, b) => a.order - b.order) }));
        return { level, units: list, lessons: list.reduce((sum, unit) => sum + unit.lessons.length, 0) };
      });
  }, [visible]);

  const weakSpots = useMemo(
    () =>
      Object.entries(mistakeMap)
        .map(([id, record]) => ({ entry: entries.find((item) => item.id === id), record }))
        .filter((item) => item.entry)
        .sort((a, b) => b.record.count - a.record.count),
    [entries, mistakeMap],
  );

  const counts = useMemo(
    () => ({
      words: visible.reduce((sum, entry) => sum + entry.vocab.length, 0),
      sentences: visible.reduce((sum, entry) => sum + entry.sentences.length, 0),
      tips: visible.filter((entry) => entry.tip).length,
      weak: weakSpots.length,
    }),
    [visible, weakSpots],
  );

  const itemsOf = (entry: NotebookEntry) => {
    if (tab === "words") {
      return entry.vocab.filter((item) => matches(item.en) || matchesFa(item.fa)).map((item) => ({ kind: "word" as const, item }));
    }
    if (tab === "sentences") {
      return entry.sentences
        .filter((item) => matches(item.en) || matchesFa(item.fa))
        .map((item) => ({ kind: "sentence" as const, item }));
    }
    if (tab === "tips" && entry.tip) {
      return matches(entry.tip.title) || matches(entry.tip.body) ? [{ kind: "tip" as const, item: entry.tip }] : [];
    }
    return [];
  };

  const toggle = (key: string) => setClosed((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        <section className="card p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-fox/15 text-fox-deep">
              <BookOpen size={18} />
            </span>
            <div>
              <h1 className="text-lg font-extrabold text-plum">دفتر من</h1>
              <p className="text-xs leading-5 text-plum-soft">
                هر چه یاد گرفته‌ای: <b>سطح → فصل (واحد) → درس</b>. هر جواب غلط هم به همان درس وصل است.
              </p>
            </div>
          </div>

          <label className="mt-3 flex items-center gap-2 rounded-xl bg-sand px-3 py-2">
            <Search size={15} className="text-plum-soft" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجو در کلمه‌ها، جمله‌ها و نکته‌ها…"
              className="w-full bg-transparent text-sm font-bold text-plum outline-none placeholder:font-normal placeholder:text-plum/40"
            />
          </label>

          <div className="mt-3 flex gap-1.5">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex-1 rounded-xl px-1 py-2 text-[11px] font-extrabold transition-colors",
                  tab === item.id ? "bg-plum text-cream" : "bg-sand text-plum-soft",
                )}
              >
                <span className="block text-sm">{item.icon}</span>
                {item.label}
                <span className="num block text-[9px] opacity-70">{fa(counts[item.id])}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyLearned((current) => !current)}
            className={cn(
              "mt-3 w-full rounded-xl px-3 py-2 text-[11px] font-bold",
              onlyLearned ? "bg-mint/15 text-[#065f46]" : "bg-sand text-plum-soft",
            )}
          >
            {onlyLearned ? "فقط چیزهایی که یاد گرفته‌ام" : "همهٔ درس‌ها (شامل یادنگرفته‌ها)"}
          </button>
        </section>

        {tab === "weak" ? (
          <section className="space-y-2">
            {weakSpots.length === 0 ? (
              <div className="card p-6 text-center text-sm text-plum-soft">
                هنوز اشتباهی ثبت نشده. هر جواب غلطی که بدهی، این‌جا با لینک همان درس ظاهر می‌شود.
              </div>
            ) : (
              weakSpots.map(({ entry, record }) => (
                <div key={entry!.id} className="card flex items-center gap-3 p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lose/10 text-lose">
                    <TriangleAlert size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-plum">{entry!.titleFa}</p>
                    <p className="text-[11px] text-plum-soft">
                      {fa(record.count)} اشتباه · {entry!.level} · فصل {fa(entry!.unitIndex)} · {entry!.unitTitle}
                    </p>
                  </div>
                  <Link
                    href={`/app/lesson/${entry!.id}`}
                    className="shrink-0 rounded-xl bg-fox px-3 py-1.5 text-[11px] font-extrabold text-white"
                  >
                    مرور درس
                  </Link>
                </div>
              ))
            )}
          </section>
        ) : (
          <div className="space-y-4">
            {tree.map((level) => {
              const levelOpen = !closed[`level-${level.level}`];
              const levelWords = level.units.reduce(
                (sum, unit) => sum + unit.lessons.reduce((n, lesson) => n + lesson.vocab.length, 0),
                0,
              );

              return (
                <section key={level.level}>
                  {/* سطح */}
                  <button
                    type="button"
                    onClick={() => toggle(`level-${level.level}`)}
                    className="sticky top-14 z-10 flex w-full items-center justify-between gap-2 rounded-2xl bg-plum px-4 py-2.5 text-cream shadow-pop"
                  >
                    <span className="flex items-center gap-2 text-sm font-extrabold">
                      سطح {level.level}
                      <span className="num rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
                        {fa(level.lessons)} درس · {fa(levelWords)} کلمه
                      </span>
                    </span>
                    <ChevronDown size={16} className={cn("transition-transform", !levelOpen && "-rotate-90")} />
                  </button>

                  {levelOpen && (
                    <div className="mt-2 space-y-2">
                      {level.units.map((unit) => {
                        const unitKey = `${level.level}-${unit.index}`;
                        const unitOpen = !closed[unitKey];
                        const lessonRows = unit.lessons
                          .map((entry) => ({ entry, items: itemsOf(entry) }))
                          .filter((row) => row.items.length > 0);

                        return (
                          <div key={unitKey} className="card overflow-hidden">
                            {/* فصل / واحد */}
                            <button
                              type="button"
                              onClick={() => toggle(unitKey)}
                              className="flex w-full items-center justify-between gap-2 bg-sand/60 px-4 py-2.5 text-right"
                            >
                              <span className="min-w-0 truncate text-xs font-extrabold text-plum">
                                فصل {fa(unit.index)} · {unit.title}
                              </span>
                              <span className="flex shrink-0 items-center gap-1 text-[10px] text-plum-soft">
                                {fa(lessonRows.length)} درس
                                <ChevronDown size={14} className={cn("transition-transform", !unitOpen && "-rotate-90")} />
                              </span>
                            </button>

                            {unitOpen && (
                              <div className="space-y-2.5 p-2.5">
                                {lessonRows.map(({ entry, items }) => (
                                  <div key={entry.id} className="rounded-2xl bg-white/70 p-2.5">
                                    <div className="mb-1.5 flex items-center justify-between gap-2">
                                      <p className="truncate text-xs font-extrabold text-plum">
                                        <span className="num text-plum-soft">{fa(entry.order + 1)}. </span>
                                        {entry.titleFa}
                                      </p>
                                      <Link href={`/app/lesson/${entry.id}`} className="shrink-0 text-[10px] font-bold text-fox-deep underline">
                                        {learned.has(entry.id) ? "مرور" : "برو به درس"}
                                      </Link>
                                    </div>

                                    <ul className="space-y-1.5">
                                      {items.map((row, position) => {
                                        if (row.kind === "word") {
                                          return (
                                            <li key={`${entry.id}-w-${position}`} className="flex items-center gap-2 rounded-xl bg-sand/50 px-2 py-1.5">
                                              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white">
                                                <WordImage word={row.item.en} emoji={row.item.emoji} size={24} />
                                              </span>
                                              <span className="en text-xs font-extrabold text-plum">{row.item.en}</span>
                                              <span className="truncate text-[11px] text-plum-soft">{row.item.fa}</span>
                                              <button
                                                type="button"
                                                onClick={() => speak(row.item.en)}
                                                aria-label={`تلفظ ${row.item.en}`}
                                                className="mr-auto grid size-7 shrink-0 place-items-center rounded-lg bg-sky/15 text-[#0369a1]"
                                              >
                                                <Volume2 size={12} />
                                              </button>
                                            </li>
                                          );
                                        }
                                        if (row.kind === "sentence") {
                                          return (
                                            <li key={`${entry.id}-s-${position}`} className="flex items-start gap-2 rounded-xl bg-sand/50 px-2 py-1.5">
                                              <div className="min-w-0 flex-1">
                                                <p className="en text-xs font-bold text-plum">{row.item.en}</p>
                                                <p className="text-[10px] text-plum-soft">{row.item.fa}</p>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => speak(row.item.en)}
                                                aria-label={`تلفظ ${row.item.en}`}
                                                className="grid size-7 shrink-0 place-items-center rounded-lg bg-sky/15 text-[#0369a1]"
                                              >
                                                <Volume2 size={12} />
                                              </button>
                                            </li>
                                          );
                                        }
                                        return (
                                          <li key={`${entry.id}-t-${position}`} className="rounded-xl bg-gold/15 px-2 py-1.5">
                                            <p className="text-[11px] font-extrabold text-[#a16207]">{row.item.title}</p>
                                            <p className="mt-0.5 text-[11px] leading-5 text-plum" dir="rtl">
                                              <BiText text={row.item.body} />
                                            </p>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}

            {tree.length === 0 && (
              <div className="card p-6 text-center text-sm text-plum-soft">
                چیزی برای نمایش نیست. یک درس را کامل کن تا کلمه‌ها و جمله‌هایش این‌جا بیاید.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
