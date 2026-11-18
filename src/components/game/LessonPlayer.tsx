"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowLeft, BookOpen, Flame, Heart, Link2, Sparkles, X } from "lucide-react";
import type { Exercise, Lesson } from "@/lib/content/schema";
import { starsFor } from "@/lib/content/schema";
import { THEME_CLASS } from "@/lib/content";
import { CorrectBurst, Game } from "@/components/game/Games";
import { TeachStage } from "@/components/game/TeachStage";
import { Character, characterFor } from "@/components/Character";
import { BiText } from "@/components/BiText";
import { SkinBackdrop } from "@/components/SkinBackdrop";
import { syncNow } from "@/lib/sync";
import { Stars } from "@/components/Stars";
import { Button, ButtonLink } from "@/components/ui/Button";
import { emit } from "@/lib/ai/events";
import { playCombo, playCorrect, playWin, playWrong } from "@/lib/sound";
import {
  bumpDaily,
  completeLesson,
  grantAdHeart,
  HEART_MAX,
  isPlus,
  loseHeart,
  recordMistake,
  refillHeartsWithGems,
  useProgress,
} from "@/lib/store/progress";
import { cn, fa, primeVoices, speak } from "@/lib/utils";
import { Volume2 } from "lucide-react";


/** the answer the learner should have given, for the feedback bar */
function expectedAnswer(exercise: Exercise): string {
  switch (exercise.kind) {
    case "mcq":
    case "imageWord":
    case "listen":
    case "fillBlank":
    case "speed":
      return exercise.choices[exercise.answer];
    case "spotError":
      return exercise.fix;
    case "wordOrder":
      return exercise.answer;
    case "match":
      return "";
  }
}

type Stage = "intro" | "teach" | "play" | "done" | "dead";

export function LessonPlayer({
  lesson,
  theme,
  prerequisiteTitles,
  nextId,
  unitTitle,
}: {
  lesson: Lesson;
  theme: keyof typeof THEME_CLASS;
  prerequisiteTitles: { id: string; titleFa: string }[];
  nextId?: string;
  unitTitle: string;
}) {
  const progress = useProgress();
  const guide = useMemo(() => characterFor(lesson.id), [lesson.id]);
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [fx, setFx] = useState<{ kind: "correct" | "wrong"; xp?: number } | null>(null);
  const [comboToast, setComboToast] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  useEffect(() => {
    primeVoices();
  }, []);

  const startedAt = useRef(0);
  const saved = useRef(false);

  const total = lesson.exercises.length;
  const exercise = lesson.exercises[index];
  const accuracy = total === 0 ? 0 : correctCount / total;
  const stars = starsFor(accuracy);
  const tone = THEME_CLASS[theme];

  const commit = useCallback(
    (isCorrect: boolean, given: string) => {
      if (locked) return;
      setLocked(true);
      setPicked(given);
      setResult(isCorrect ? "correct" : "wrong");

      emit({
        type: "exercise_answered",
        lessonId: lesson.id,
        exerciseId: exercise.id,
        kind: exercise.kind,
        correct: isCorrect,
        ms: Date.now() - startedAt.current,
      });

      if (isCorrect) {
        const nextCombo = combo + 1;
        const earned = 10 + Math.min(10, nextCombo * 2);
        setCombo(nextCombo);
        setCorrectCount((n) => n + 1);
        setXp((current) => current + earned);
        playCorrect(nextCombo);
        setFx({ kind: "correct", xp: earned });
        setTimeout(() => setFx(null), 950);
        if (nextCombo >= 3) playCombo(nextCombo);
        if (nextCombo === 3 || nextCombo === 5 || nextCombo === 8) {
          setComboToast(
            nextCombo === 3 ? "سه‌تایی پشت هم! 🔥" : nextCombo === 5 ? "پنج‌تایی! فوق‌العاده ⚡" : "هشت‌تایی! بی‌نظیر 🏆",
          );
          setTimeout(() => setComboToast(null), 1600);
        }
        bumpDaily({
          answered: 1,
          correct: 1,
          xp: earned,
          ...(exercise.reviewOf ? { review: 1 } : {}),
        });
      } else {
        setCombo(0);
        setWrongCount((n) => n + 1);
        bumpDaily({ answered: 1 });
        recordMistake(lesson.id);
        playWrong();
        setFx({ kind: "wrong" });
        setTimeout(() => setFx(null), 950);
        const hearts = isPlus() ? HEART_MAX : loseHeart();
        emit({
          type: "mistake_made",
          lessonId: lesson.id,
          exerciseId: exercise.id,
          prompt: exercise.prompt,
          expected: "—",
          given,
        });
        if (hearts === 0) setTimeout(() => setStage("dead"), 800);
      }
    },
    [combo, exercise, lesson.id, locked],
  );

  const restart = useCallback(() => {
    saved.current = false;
    startedAt.current = Date.now();
    setIndex(0);
    setPicked(null);
    setLocked(false);
    setResult(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setXp(0);
    setStage("play");
  }, []);

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setStage("done");
      return;
    }
    setIndex((i) => i + 1);
    setLocked(false);
    setPicked(null);
    setResult(null);
    startedAt.current = Date.now();
  }, [index, total]);

  useEffect(() => {
    if (stage !== "done" || saved.current) return;
    saved.current = true;
    completeLesson(lesson.id, accuracy, stars, xp);
    // logged-in learners keep the account copy in step with this device
    void syncNow();
    emit({ type: "lesson_finished", lessonId: lesson.id, accuracy, stars, xp });
    playWin();
    confetti({
      particleCount: accuracy >= 0.95 ? 120 : 60,
      spread: accuracy >= 0.95 ? 78 : 60,
      origin: { y: 0.7 },
      colors: ["#F97316", "#FB7185", "#FBBF24", "#34D399"],
    });
  }, [accuracy, lesson.id, stage, stars, xp]);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <SkinBackdrop />
      <header className="sticky top-0 z-20 border-b border-fox/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            href="/app"
            className="grid size-9 place-items-center rounded-xl bg-white text-plum-soft shadow-sm"
            aria-label="بازگشت به نقشه"
          >
            <X size={18} />
          </Link>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-sand">
            <div
              className={cn("h-full rounded-full transition-all duration-300", tone.bg)}
              style={{ width: `${stage === "intro" ? 0 : (index / total) * 100}%` }}
            />
          </div>
          <span className="flex items-center gap-0.5" aria-label="جان‌ها">
            {Array.from({ length: HEART_MAX }).map((_, i) => (
              <Heart
                key={i}
                size={13}
                className={i < progress.hearts ? "fill-coral text-coral" : "fill-transparent text-plum/20"}
              />
            ))}
          </span>
          {combo >= 2 && (
            <span className="pop-in flex items-center gap-1 rounded-full bg-fox/15 px-2 py-1 text-xs font-extrabold text-fox-deep">
              <Flame size={13} /> ×{fa(combo)}
            </span>
          )}
        </div>
      </header>

      {comboToast && (
        <span className="pop-in pointer-events-none fixed left-1/2 top-28 z-40 -translate-x-1/2 rounded-full bg-plum px-4 py-1.5 text-sm font-extrabold text-cream shadow-pop">
          {comboToast}
        </span>
      )}

      {fx && (
        <span
          key={`${fx.kind}-${fx.xp ?? 0}`}
          className={cn(
            "float-up pointer-events-none fixed left-1/2 top-16 z-40 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-sm font-extrabold text-white shadow-pop",
            fx.kind === "correct" ? "bg-mint text-[#043d2b]" : "bg-lose",
          )}
        >
          {fx.kind === "correct" ? (
            <span dir="ltr">+{fa(fx.xp ?? 0)} XP</span>
          ) : (
            "یک جان کم شد"
          )}
        </span>
      )}

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {stage === "intro" && (
          <div className="pop-in space-y-5">
            <div className="flex items-start gap-4">
              <Character id={guide} size={76} mood="happy" className="bob shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-fox-deep">{unitTitle}</p>
                <h1 className="text-2xl font-extrabold text-plum">{lesson.titleFa}</h1>
                <p className="mt-1 text-sm text-plum-soft">
                  <BiText text={lesson.goal} />
                </p>
              </div>
            </div>

            {prerequisiteTitles.length > 0 && (
              <div className="card p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-plum-soft">
                  <Link2 size={14} /> این درس روی این‌ها ساخته شده
                </p>
                <div className="flex flex-wrap gap-2">
                  {prerequisiteTitles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/app/lesson/${item.id}`}
                      className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-plum"
                    >
                      {item.titleFa}
                    </Link>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-plum-soft/80">
                  حدود ۳۰٪ تمرین‌های این درس از همین درس‌ها می‌آید تا فراموش نشوند.
                </p>
              </div>
            )}

            {lesson.tip && (
              <div className="card border-gold/40 bg-gold/10 p-4">
                <p className="mb-1 flex items-center gap-1.5 text-sm font-extrabold text-[#a16207]">
                  <BookOpen size={15} /> {lesson.tip.title}
                </p>
                <p className="text-sm leading-7 text-plum" dir="rtl">
                  <BiText text={lesson.tip.body} />
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                startedAt.current = Date.now();
                setStage(lesson.teach?.length ? "teach" : "play");
              }}
            >
              شروع — {fa(total)} تمرین
            </Button>
          </div>
        )}

        {stage === "teach" && (
          <TeachStage steps={lesson.teach} guide={guide} onDone={() => setStage("play")} />
        )}

        {stage === "play" && exercise && (
          <div key={exercise.id} className="relative space-y-5">
            <span className="pointer-events-none absolute -top-4 left-0 z-10">
              <Character id={guide} size={48} mood={result === "correct" ? "cheer" : result === "wrong" ? "sad" : "happy"} />
            </span>
            {result === "correct" && <CorrectBurst />}
            <div className="flex items-center justify-between text-xs font-bold text-plum-soft">
              <span>
                تمرین {fa(index + 1)} از {fa(total)}
              </span>
              {exercise.reviewOf && (
                <span className="flex items-center gap-1 rounded-full bg-sky/15 px-2.5 py-1 text-[#0369a1]">
                  <Sparkles size={12} /> مرور درس قبلی
                </span>
              )}
            </div>

            <Game exercise={exercise} locked={locked} picked={picked} onCommit={commit} />
          </div>
        )}

        {stage === "dead" && (
          <div className="pop-in card space-y-4 p-6 text-center">
            <Character id={guide} size={96} mood="sad" className="mx-auto" />
            <h2 className="text-xl font-extrabold">جان‌ها تمام شد</h2>
            <p className="text-sm leading-6 text-plum-soft">
              هر ۲۰ دقیقه یک جان برمی‌گردد. یا همین حالا با جم / یک تبلیغ کوتاه ادامه بده:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="soft"
                onClick={() => {
                  if (refillHeartsWithGems(30)) {
                    setStage("play");
                    setLocked(false);
                    setPicked(null);
                    setResult(null);
                  }
                }}
              >
                پر کردن جان‌ها — ۳۰ جم
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  grantAdHeart();
                  setStage("play");
                  setLocked(false);
                  setPicked(null);
                  setResult(null);
                }}
              >
                تبلیغ ببین + ۱ جان
              </Button>
            </div>

            <ButtonLink href="/app/plus" className="w-full">
              زبان‌یار پلاس: جان بی‌نهایت
            </ButtonLink>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={restart}>
                از اول
              </Button>
              <ButtonLink href="/app" variant="ghost" className="flex-1">
                نقشه
              </ButtonLink>
            </div>
            <p className="num text-[11px] text-plum-soft">جم فعلی: {fa(progress.gems)}</p>
          </div>
        )}

        {stage === "done" && (
          <div className="pop-in space-y-5 text-center">
            <Character id={guide} size={112} mood={stars >= 2 ? "cheer" : "happy"} className="bob mx-auto" />
            <div>
              <h2 className="text-2xl font-extrabold text-plum">درس تمام شد!</h2>
              {wrongCount === 0 && (
                <span className="pop-in mt-2 inline-block rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-[#4a2c00]">
                  بی‌عیب و نقص! هیچ اشتباهی نداشتی
                </span>
              )}
              <Stars earned={stars} size={30} className="mt-2 justify-center" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Stat label="درست" value={fa(correctCount)} tone="text-[#065f46]" />
              <Stat label="غلط" value={fa(wrongCount)} tone="text-lose" />
              <Stat label="XP" value={fa(xp)} tone="text-fox-deep" />
            </div>

            <div className="card p-4 text-right">
              <p className="mb-2 text-xs font-bold text-plum-soft">حالا می‌توانی بگویی</p>
              <ul className="space-y-2">
                {lesson.youCanSay.map((line) => (
                  <li key={line.en} className="rounded-xl bg-sand/70 px-3 py-2">
                    <p className="en text-sm font-bold text-plum">{line.en}</p>
                    <p className="mt-0.5 text-xs text-plum-soft">{line.fa}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              {nextId && stars >= 2 ? (
                <ButtonLink href={`/app/lesson/${nextId}`} size="lg">
                  درس بعدی <ArrowLeft size={18} />
                </ButtonLink>
              ) : (
                <Button onClick={restart} size="lg">
                  تمرین دوباره
                </Button>
              )}
              <ButtonLink href="/app" variant="soft">
                برگشت به نقشه
              </ButtonLink>
            </div>
          </div>
        )}
      </main>

      {stage === "play" && locked && (
        <footer
          className={cn(
            "sticky bottom-0 border-t-2 bg-white/95 backdrop-blur",
            result === "correct" ? "border-mint" : "border-lose",
          )}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <span className="shrink-0">
              <Character id={guide} size={44} mood={result === "correct" ? "cheer" : "sad"} />
            </span>
            <div className="flex-1">
              <p className={cn("text-sm font-extrabold", result === "correct" ? "text-[#065f46]" : "text-lose")}>
                {result === "correct" ? "درست بود!" : "اشتباه بود"}
              </p>
              {result === "correct" ? (
                <p className="text-xs text-plum-soft">
                  {combo >= 2 ? `کمبو ×${fa(combo)} — ادامه بده!` : "ادامه بده."}
                </p>
              ) : (
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-plum-soft">
                    درستش: <span className="en font-bold text-plum">{expectedAnswer(exercise)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => speak(expectedAnswer(exercise))}
                    aria-label="تلفظ جواب درست"
                    className="grid size-6 place-items-center rounded-md bg-sky/15 text-[#0369a1]"
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              )}
            </div>
            <Button variant={result === "correct" ? "success" : "primary"} onClick={next}>
              ادامه
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="card px-2 py-3">
      <p className={cn("num text-xl font-extrabold", tone)}>{value}</p>
      <p className="text-[11px] text-plum-soft">{label}</p>
    </div>
  );
}
