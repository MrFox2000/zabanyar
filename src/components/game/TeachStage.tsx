"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2 } from "lucide-react";
import type { TeachStep } from "@/lib/content/schema";
import { Character, type CharacterId } from "@/components/Character";
import { Button } from "@/components/ui/Button";
import { cn, fa, speak, speakSlow } from "@/lib/utils";
import { BiText } from "@/components/BiText";
import { WordImage } from "@/components/WordImage";

/**
 * The teaching part of a lesson.
 *
 * Duolingo's own method is "use it from the first exercise", with explicit
 * explanations kept in a guidebook — beginners still need that guidebook first.
 * So every lesson opens with a short deck: sounds → words → one real sentence →
 * the rule behind them, each with audio. Four to seven cards, under a minute.
 */
export function TeachStage({ steps, guide, onDone }: { steps: TeachStep[]; guide: CharacterId; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const last = index === steps.length - 1;

  const spoken = useMemo(() => {
    if (!step) return "";
    if (step.kind === "letter") return step.word;
    if (step.kind === "word") return step.en;
    if (step.kind === "sentence") return step.en;
    return "";
  }, [step]);

  useEffect(() => {
    if (!spoken) return;
    const timer = setTimeout(() => speak(spoken), 420);
    return () => clearTimeout(timer);
  }, [spoken, index]);

  if (!step) return null;

  const left = steps.length - index - 1;

  return (
    <div className="pop-in space-y-4">
      <div className="flex items-center justify-between text-xs font-bold text-plum-soft">
        <span className="flex items-center gap-1.5">
          <Character id={guide} size={34} mood="happy" />
          {step.kind === "rule" ? "نکتهٔ گرامری" : "یاد بگیر"}
        </span>
        <span className="num">
          {fa(index + 1)} از {fa(steps.length)}
        </span>
      </div>

      <div className="card min-h-[19rem] overflow-hidden">
        {step.kind === "letter" && (
          <div className="flex h-full flex-col items-center gap-3 p-6 text-center">
            <p className="text-xs font-bold text-plum-soft">این حرف چه صدایی دارد؟</p>
            <p className="en text-7xl font-extrabold leading-none text-fox-deep">{step.letter}</p>
            <p className="rounded-full bg-sand px-3 py-1 text-sm font-bold text-plum-soft">{step.sound}</p>
            <div className="mt-1 flex items-center gap-3 rounded-3xl bg-sand/70 px-5 py-3">
              <WordImage word={step.word} emoji={step.emoji} size={52} />
              <div className="text-right">
                <p className="en text-xl font-extrabold text-plum">{step.word}</p>
                <p className="text-xs text-plum-soft">{step.wordFa}</p>
              </div>
            </div>
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => speak(step.word)} className="btn-pop rounded-xl bg-sky/15 px-3 py-2 text-xs font-bold text-[#0369a1]">
                <Volume2 size={14} className="inline" /> شنیدن
              </button>
              <button type="button" onClick={() => speakSlow(step.word)} className="rounded-xl bg-sand px-3 py-2 text-xs font-bold text-plum-soft">
                آهسته
              </button>
            </div>
          </div>
        )}

        {step.kind === "word" && (
          <div className="flex h-full flex-col items-center gap-3 p-6 text-center">
            <p className="text-xs font-bold text-plum-soft">کلمهٔ تازه</p>
            <span className="grid size-24 place-items-center rounded-[1.75rem] bg-sand shadow-pop">
              <WordImage word={step.en} emoji={step.emoji} size={68} />
            </span>
            <p className="en text-3xl font-extrabold text-plum">{step.en}</p>
            <p className="text-base font-bold text-fox-deep">{step.fa}</p>
            {step.note && <p className="text-xs text-plum-soft">{step.note}</p>}
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => speak(step.en)} className="btn-pop rounded-xl bg-sky/15 px-3 py-2 text-xs font-bold text-[#0369a1]">
                <Volume2 size={14} className="inline" /> تلفظ
              </button>
              <button type="button" onClick={() => speakSlow(step.en)} className="rounded-xl bg-sand px-3 py-2 text-xs font-bold text-plum-soft">
                آهسته
              </button>
            </div>
          </div>
        )}

        {step.kind === "sentence" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-xs font-bold text-plum-soft">یک جملهٔ کامل — با صدای بلند تکرار کن</p>
            <p className="en text-2xl font-extrabold leading-relaxed text-plum" dir="ltr">
              {step.en}
            </p>
            <p className="text-sm text-plum-soft">{step.fa}</p>
            {step.highlight && (
              <p className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-[#a16207]">
                کلمهٔ کلیدی: <span className="en">{step.highlight}</span>
              </p>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => speak(step.en)} className="btn-pop rounded-xl bg-sky/15 px-3 py-2 text-xs font-bold text-[#0369a1]">
                <Volume2 size={14} className="inline" /> جمله را بشنو
              </button>
              <button type="button" onClick={() => speakSlow(step.en)} className="rounded-xl bg-sand px-3 py-2 text-xs font-bold text-plum-soft">
                آهسته
              </button>
            </div>
          </div>
        )}

        {step.kind === "rule" && (
          <div className="space-y-3 p-6">
            <p className="rounded-full bg-gold/20 px-3 py-1 text-center text-sm font-extrabold text-[#a16207]">{step.title}</p>
            <p className="text-sm leading-8 text-plum" dir="rtl">
              <BiText text={step.body} />
            </p>
            {step.examples.length > 0 && (
              <ul className="space-y-2">
                {step.examples.map((example) => (
                  <li key={example.en} className="flex items-center justify-between gap-2 rounded-xl bg-sand/70 px-3 py-2">
                    <div>
                      <p className="en text-sm font-bold text-plum">{example.en}</p>
                      <p className="text-[11px] text-plum-soft">{example.fa}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speak(example.en)}
                      aria-label={`تلفظ ${example.en}`}
                      className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky/15 text-[#0369a1]"
                    >
                      <Volume2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-plum-soft">
        صدا نمی‌آید؟{" "}
        <Link href="/app/settings" className="font-bold text-fox-deep underline">
          تنظیمات صدا
        </Link>
      </p>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1">
          {steps.map((_, dot) => (
            <span
              key={dot}
              className={cn("h-1.5 flex-1 rounded-full transition-colors", dot <= index ? "bg-fox" : "bg-sand")}
            />
          ))}
        </div>
        <Button onClick={last ? onDone : () => setIndex((current) => current + 1)} className="shrink-0">
          {last ? (
            <>
              شروع تمرین <ArrowLeft size={16} />
            </>
          ) : (
            <>
              بعدی {left > 0 && <span className="num text-xs opacity-70">({fa(left)})</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
