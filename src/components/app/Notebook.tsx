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

/**
 * «دفتر من» — everything the learner has unlocked, grouped level → unit → lesson
 * instead of one endless list. The weak-spot tab reads the mistakes the lesson
 * runner records, and every row links straight back to its lesson.
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

  const visible = useMemo(
    () => entries.filter((entry) => !onlyLearned || !hydrated || learned.has(entry.id)),
    [entries, hydrated, learned, onlyLearned],
  );

  const groups = useMemo(() => {
    const map = new Map<string, { level: string; unitIndex: number; unitTitle: string; lessons: NotebookEntry[] }>();
    for (const entry of visible) {
      const key = `${entry.level}-${entry.unitIndex}`;
      const group = map.get(key) ?? { level: entry.level, unitIndex: entry.unitIndex, unitTitle: entry.unitTitle, lessons: [] };
      group.lessons.push(entry);
      map.set(key, group);
    }
    return [...map.values()]
      .map((group) => ({ ...group, lessons: group.lessons.sort((a, b) => a.order - b.order) }))
      .sort((a, b) => a.level.localeCompare(b.level) || a.unitIndex - b.unitIndex);
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

  const lessonItems = (entry: NotebookEntry) => {
    if (tab === "words") {
      return entry.vocab
        .filter((item) => matches(item.en) || item.fa.includes(query.trim()))
        .map((item) => ({ kind: "word" as const, item }));
    }
    if (tab === "sentences") {
      return entry.sentences.filter((item) => matches(item.en) || item.fa.includes(query.trim())).map((item) => ({ kind: "sentence" as const, item }));
    }
    if (tab === "tips") {
      if (!entry.tip) return [];
      return matches(entry.tip.title) || matches(entry.tip.body) ? [{ kind: "tip" as const, item: entry.tip }] : [];
    }
    return [];
  };

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
                همه‌چیز به‌ترتیب سطح و واحد، با جست‌وجو — و هر چیزی که غلط زدی، این‌جا به همان درس وصل است.
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
                {item.id !== "weak" && <span className="num block text-[9px] opacity-70">{fa(counts[item.id])}</span>}
                {item.id === "weak" && counts.weak > 0 && <span className="num block text-[9px] opacity-70">{fa(counts.weak)}</span>}
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
                      {fa(record.count)} اشتباه · {entry!.level} · واحد {fa(entry!.unitIndex)} · {entry!.unitTitle}
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
          <div className="space-y-3">
            {groups.map((group) => {
              const key = `${group.level}-${group.unitIndex}`;
              const isClosed = closed[key];
              const lessonRows = group.lessons
                .map((entry) => ({ entry, items: lessonItems(entry) }))
                .filter((row) => row.items.length > 0);

              return (
                <section key={key} className="card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setClosed((current) => ({ ...current, [key]: !current[key] }))}
                    className="flex w-full items-center justify-between gap-2 bg-sand/60 px-4 py-3 text-right"
                  >
                    <span className="min-w-0">
                      <span className="text-sm font-extrabold text-plum">
                        {group.unitTitle}
                      </span>
                      <span className="mr-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-plum-soft">
                        {group.level} · واحد {fa(group.unitIndex)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-plum-soft">
                      {fa(lessonRows.length)} درس
                      <ChevronDown size={15} className={cn("transition-transform", isClosed && "-rotate-90")} />
                    </span>
                  </button>

                  {!isClosed && (
                    <div className="space-y-3 p-3">
                      {lessonRows.map(({ entry, items }) => (
                        <div key={entry.id} className="rounded-2xl bg-white/70 p-2.5">
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-extrabold text-plum">{entry.titleFa}</p>
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
                </section>
              );
            })}

            {groups.length === 0 && (
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
