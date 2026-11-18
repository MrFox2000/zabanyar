"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Heart, Shield, Swords, Timer, X } from "lucide-react";
import type { Boss } from "@/lib/content/schema";
import { Game } from "@/components/game/Games";
import { Foxy } from "@/components/Foxy";
import { Stars } from "@/components/Stars";
import { Button, ButtonLink } from "@/components/ui/Button";
import { emit } from "@/lib/ai/events";
import { completeBoss, HEART_MAX, loseHeart, useProgress, bumpDaily } from "@/lib/store/progress";
import { starsFor } from "@/lib/content/schema";
import { cn, fa } from "@/lib/utils";

export function BossBattle({ boss, unitTitle, nextHref }: { boss: Boss; unitTitle: string; nextHref: string }) {
  const progress = useProgress();
  const [stage, setStage] = useState<"intro" | "fight" | "won" | "lost">("intro");
  const [index, setIndex] = useState(0);
  const [hp, setHp] = useState(boss.hp);
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(boss.seconds);
  const saved = useRef(false);

  const exercise = boss.exercises[index % boss.exercises.length];
  const accuracy = correctCount + wrongCount === 0 ? 0 : correctCount / (correctCount + wrongCount);
  const stars = starsFor(accuracy);

  useEffect(() => {
    if (stage !== "fight") return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setStage("lost");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const commit = useCallback(
    (isCorrect: boolean, given: string) => {
      if (locked) return;
      setLocked(true);
      setPicked(given);
      setResult(isCorrect ? "correct" : "wrong");
      emit({
        type: "exercise_answered",
        lessonId: boss.id,
        exerciseId: exercise.id,
        kind: exercise.kind,
        correct: isCorrect,
        ms: 0,
      });

      if (isCorrect) {
        setCorrectCount((n) => n + 1);
        bumpDaily({ answered: 1, correct: 1, xp: Math.round(boss.rewardXp / boss.hp) });
        setHp((current) => {
          const next = Math.max(0, current - 1);
          if (next === 0) setTimeout(() => setStage("won"), 500);
          return next;
        });
      } else {
        setWrongCount((n) => n + 1);
        bumpDaily({ answered: 1 });
        const hearts = loseHeart();
        if (hearts === 0) setTimeout(() => setStage("lost"), 600);
      }
    },
    [boss.hp, boss.id, boss.rewardXp, exercise.id, exercise.kind, locked],
  );

  const next = () => {
    setIndex((i) => i + 1);
    setLocked(false);
    setPicked(null);
    setResult(null);
  };

  useEffect(() => {
    if (stage !== "won" || saved.current) return;
    saved.current = true;
    completeBoss(boss.id, stars, boss.rewardXp);
    emit({ type: "unit_finished", unitId: boss.id });
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.65 }, colors: ["#F97316", "#FB7185", "#FBBF24", "#34D399"] });
  }, [boss.id, boss.rewardXp, stage, stars]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-plum/10 bg-plum text-cream">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href="/app" className="grid size-9 place-items-center rounded-xl bg-white/10" aria-label="خروج">
            <X size={18} />
          </Link>
          <div className="flex-1">
            <p className="text-[11px] text-cream/70">{unitTitle}</p>
            <p className="flex items-center gap-1.5 text-sm font-extrabold">
              <Swords size={15} /> {boss.titleFa}
            </p>
          </div>
          <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", secondsLeft > 30 ? "bg-white/10" : "bg-lose/80")}>
            <Timer size={13} /> <span className="num">{fa(Math.floor(secondsLeft / 60))}:{fa(String(secondsLeft % 60).padStart(2, "0"))}</span>
          </span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: HEART_MAX }).map((_, i) => (
              <Heart key={i} size={13} className={i < progress.hearts ? "fill-coral text-coral" : "fill-transparent text-white/25"} />
            ))}
          </span>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <div className="flex items-center gap-2 text-[11px] font-bold text-cream/70">
            <Shield size={13} /> سلامتی حریف
            <span className="num">{fa(hp)}/{fa(boss.hp)}</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-l from-lose to-coral transition-all duration-500" style={{ width: `${(hp / boss.hp) * 100}%` }} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {stage === "intro" && (
          <div className="pop-in card space-y-4 p-6 text-center">
            <Foxy size={120} mood="think" className="mx-auto bob" />
            <h1 className="text-xl font-extrabold text-plum">{boss.titleFa}</h1>
            <p className="text-sm leading-6 text-plum-soft">
              {fa(boss.exercises.length)} سؤال از کل واحد و درس‌های پیش‌نیاز. هر جواب درست یک ضربه و هر جواب غلط یک جان.
              {" "}
              {fa(Math.floor(boss.seconds / 60))} دقیقه وقت داری.
            </p>
            <Button size="lg" className="w-full" onClick={() => setStage("fight")}>
              شروع نبرد
            </Button>
          </div>
        )}

        {stage === "fight" && exercise && (
          <div key={exercise.id} className="space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-plum-soft">
              <span>ضربهٔ {fa(correctCount + 1)}</span>
              <span className="num">{fa(correctCount)} درست · {fa(wrongCount)} غلط</span>
            </div>
            <Game exercise={exercise} locked={locked} picked={picked} onCommit={commit} />
          </div>
        )}

        {stage === "won" && (
          <div className="pop-in card space-y-4 p-6 text-center">
            <Foxy size={120} mood="cheer" className="mx-auto bob" />
            <h2 className="text-2xl font-extrabold text-plum">بردی!</h2>
            <Stars earned={stars} size={32} className="justify-center" />
            <p className="num text-sm text-plum-soft">
              {fa(correctCount)} درست · {fa(wrongCount)} غلط · +{fa(boss.rewardXp)} XP
            </p>
            <div className="flex flex-col gap-2">
              <ButtonLink href={nextHref} size="lg">
                واحد بعدی
              </ButtonLink>
              <ButtonLink href="/app" variant="soft">
                نقشه
              </ButtonLink>
            </div>
          </div>
        )}

        {stage === "lost" && (
          <div className="pop-in card space-y-4 p-6 text-center">
            <Foxy size={110} mood="oops" className="mx-auto" />
            <h2 className="text-xl font-extrabold text-plum">این بار نشد</h2>
            <p className="text-sm text-plum-soft">
              {hp > 0 ? `حریف ${fa(hp)} جان داشت. یک بار دیگر امتحان کن — همین تمرین‌ها را بهتر می‌شناسی حالا.` : "جان‌هایت تمام شد."}
            </p>
            <div className="flex gap-2">
              <ButtonLink href={`/app/boss/${boss.id.replace("-boss", "")}`} className="flex-1">
                دوباره
              </ButtonLink>
              <ButtonLink href="/app" variant="soft" className="flex-1">
                نقشه
              </ButtonLink>
            </div>
          </div>
        )}
      </main>

      {stage === "fight" && locked && (
        <footer className={cn("sticky bottom-0 border-t-2 bg-white/95 backdrop-blur", result === "correct" ? "border-mint" : "border-lose")}>
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <div className="flex-1">
              <p className={cn("text-sm font-extrabold", result === "correct" ? "text-[#065f46]" : "text-lose")}>
                {result === "correct" ? "ضربه نشست! 💥" : "خوردی! یک جان کم شد"}
              </p>
              <p className="text-xs text-plum-soft">
                {result === "correct" ? `${fa(hp)} ضربه تا победа` : "تمرکز کن، وقت هست."}
              </p>
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
