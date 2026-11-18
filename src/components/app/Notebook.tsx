"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Lock, Search, Volume2 } from "lucide-react";
import { Hud } from "@/components/Hud";
import { useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa, speak } from "@/lib/utils";

export type NotebookEntry = {
  id: string;
  titleFa: string;
  unitTitle: string;
  unitIndex: number;
  vocab: { en: string; fa: string; emoji?: string }[];
  tip: { title: string; body: string } | null;
};

type Tab = "words" | "tips";

/**
 * «دفتر من» — everything the learner has actually unlocked, in one place.
 * Words and grammar notes are collected from completed lessons, so the notebook
 * grows only with real progress.
 */
export function Notebook({ entries }: { entries: NotebookEntry[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("words");
  const [query, setQuery] = useState("");
  const [onlyLearned, setOnlyLearned] = useState(true);

  const learned = useMemo(() => new Set(Object.keys(progress.lessons)), [progress.lessons]);

  const visible = useMemo(
    () => entries.filter((entry) => !onlyLearned || !hydrated || learned.has(entry.id)),
    [entries, hydrated, learned, onlyLearned],
  );

  const needle = query.trim().toLowerCase();
  const words = useMemo(
    () =>
      visible.flatMap((entry) =>
        entry.vocab
          .filter((item) => !needle || item.en.toLowerCase().includes(needle) || item.fa.includes(needle))
          .map((item) => ({ ...item, lessonId: entry.id, lessonTitle: entry.titleFa, learned: learned.has(entry.id) })),
      ),
    [learned, needle, visible],
  );

  const tips = useMemo(
    () =>
      visible
        .filter((entry) => entry.tip)
        .filter(
          (entry) =>
            !needle ||
            entry.tip!.title.toLowerCase().includes(needle) ||
            entry.tip!.body.toLowerCase().includes(needle) ||
            entry.titleFa.includes(needle),
        )
        .map((entry) => ({ ...entry.tip!, lessonId: entry.id, lessonTitle: entry.titleFa, learned: learned.has(entry.id) })),
    [learned, needle, visible],
  );

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
                هر کلمه و نکته‌ای که در درس‌های تمام‌شده یاد گرفته‌ای، همین‌جاست. با تلفظ و جست‌وجو.
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <label className="flex flex-1 items-center gap-2 rounded-xl bg-sand px-3 py-2">
              <Search size={15} className="text-plum-soft" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جست‌وجوی کلمه…"
                className="w-full bg-transparent text-sm font-bold text-plum outline-none placeholder:font-normal placeholder:text-plum/40"
              />
            </label>
            <button
              type="button"
              onClick={() => setOnlyLearned((current) => !current)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-bold transition-colors",
                onlyLearned ? "bg-mint/20 text-[#065f46]" : "bg-sand text-plum-soft",
              )}
            >
              {onlyLearned ? "یادگرفته‌ها" : "همه"}
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            {[
              { id: "words" as Tab, label: `کلمه‌ها (${fa(words.length)})` },
              { id: "tips" as Tab, label: `نکته‌ها (${fa(tips.length)})` },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex-1 rounded-xl py-2 text-xs font-extrabold transition-colors",
                  tab === item.id ? "bg-plum text-cream" : "bg-sand text-plum-soft",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {tab === "words" && (
          <section className="space-y-2">
            {words.length === 0 && (
              <div className="card p-6 text-center text-sm text-plum-soft">
                هنوز چیزی اینجا نیست. یک درس را کامل کن تا کلمه‌هایش بیاید.
              </div>
            )}
            {words.map((word) => (
              <div
                key={`${word.lessonId}-${word.en}`}
                className={cn(
                  "card flex items-center gap-3 p-3",
                  !word.learned && "opacity-60",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-xl">
                  {word.learned ? word.emoji ?? "🔤" : <Lock size={15} className="text-plum/40" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="en text-sm font-extrabold text-plum">{word.en}</p>
                  <p className="truncate text-xs text-plum-soft">
                    {word.fa} · {word.lessonTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => speak(word.en)}
                  aria-label={`تلفظ ${word.en}`}
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky/15 text-[#0369a1]"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </section>
        )}

        {tab === "tips" && (
          <section className="space-y-2">
            {tips.length === 0 && (
              <div className="card p-6 text-center text-sm text-plum-soft">
                نکته‌ای برای نمایش نیست. اول یک درس را کامل کن.
              </div>
            )}
            {tips.map((tip) => (
              <article key={`${tip.lessonId}-tip`} className="card border-gold/40 bg-gold/10 p-4">
                <p className="text-sm font-extrabold text-[#a16207]">{tip.title}</p>
                <p className="mt-1 text-sm leading-7 text-plum">{tip.body}</p>
                <Link href={`/app/lesson/${tip.lessonId}`} className="mt-2 inline-block text-[11px] font-bold text-fox-deep">
                  مرور درس: {tip.lessonTitle}
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
