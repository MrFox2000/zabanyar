"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Character, characterFor } from "@/components/Character";
import { BiText } from "@/components/BiText";
import { Button } from "@/components/ui/Button";
import { markPlaced } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

export type PlacementQuestion = {
  level: string;
  prompt: string;
  choices: string[];
  answer: number;
};

type Screen = "intro" | "quiz" | "result";
type Record_ = { level: string; correct: boolean };

/**
 * Onboarding + placement: three screens of context, then questions taken from the
 * real course. A level the learner already handles gets unlocked, so nobody has to
 * sit through greetings twice. Nothing is unlocked that they did not demonstrate.
 */
export function Placement({
  levels,
  questions,
  lessonsByLevel,
}: {
  levels: string[];
  questions: PlacementQuestion[];
  lessonsByLevel: Record<string, string[]>;
}) {
  const router = useRouter();
  const guide = useMemo(() => characterFor("placement"), []);
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record_[]>([]);
  const [startLevel, setStartLevel] = useState(levels[0] ?? "A1");

  const question = questions[step];
  const score = answers.filter((item) => item.correct).length;

  const answer = (index: number) => {
    if (picked !== null || !question) return;
    setPicked(index);
    setAnswers((current) => [...current, { level: question.level, correct: index === question.answer }]);
  };

  const finish = (finalAnswers: Record_[]) => {
    const correctByLevel: Record<string, number> = {};
    const totalByLevel: Record<string, number> = {};
    for (const item of questions) totalByLevel[item.level] = (totalByLevel[item.level] ?? 0) + 1;
    for (const item of finalAnswers) {
      if (item.correct) correctByLevel[item.level] = (correctByLevel[item.level] ?? 0) + 1;
    }

    // levels are passed consecutively: one weak level stops the climb
    let levelIndex = 0;
    for (let index = 0; index < levels.length; index += 1) {
      const level = levels[index];
      const ratio = (correctByLevel[level] ?? 0) / (totalByLevel[level] ?? 1);
      if (ratio >= 0.5) levelIndex = index + 1;
      else break;
    }

    setStartLevel(levels[Math.min(levelIndex, levels.length - 1)] ?? levels[0]);
    setScreen("result");
    confetti({ particleCount: 80, spread: 65, origin: { y: 0.7 }, colors: ["#F97316", "#FBBF24", "#34D399"] });
  };

  const next = () => {
    if (step + 1 >= questions.length) {
      finish(answers);
      return;
    }
    setStep((current) => current + 1);
    setPicked(null);
  };

  const startHere = () => {
    const targetIndex = levels.indexOf(startLevel);
    const toUnlock = levels.slice(0, Math.max(0, targetIndex)).flatMap((level) => lessonsByLevel[level] ?? []);
    if (toUnlock.length) markPlaced(toUnlock);
    router.push("/app");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {screen === "intro" && (
          <div className="pop-in space-y-5">
            <div className="flex items-start gap-4">
              <Character id={guide} size={84} mood="cheer" className="bob shrink-0" />
              <div>
                <h1 className="text-2xl font-extrabold text-plum">خوش آمدی به زبان‌یار</h1>
                <p className="mt-1 text-sm leading-6 text-plum-soft">
                  هر درس اول یاد می‌دهد، بعد تمرین می‌گیرد. سه چیز را قبل از شروع بدان.
                </p>
              </div>
            </div>

            <div className="card space-y-3 p-4">
              {[
                { icon: "📘", title: "اول آموزش، بعد آزمون", body: "هر درس با کارت‌های آموزش شروع می‌شود: صدا، کلمه، جمله و یک نکتهٔ کوتاه گرامر." },
                { icon: "🔁", title: "هیچ‌چیز فراموش نمی‌شود", body: "بخشی از هر درس از درس‌های قبلی می‌آید و «دفتر من» همهٔ کلمه‌ها و نکته‌ها را نگه می‌دارد." },
                { icon: "🎯", title: "ضعف‌ها پیدا می‌شوند", body: "هر جواب غلط ثبت می‌شود و بخش «ضعف‌های من» همان درس را به تو نشان می‌دهد." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-sand/60 p-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-extrabold text-plum">{item.title}</p>
                    <p className="mt-0.5 text-[11px] leading-5 text-plum-soft">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card border-fox/40 bg-fox/10 p-4">
              <p className="text-sm font-extrabold text-plum">تعیین سطح (۳ دقیقه)</p>
              <p className="mt-1 text-xs leading-5 text-plum-soft">
                {fa(questions.length)} سؤال کوتاه از سطح‌های مختلف. اگر بلد باشی از سطح بالاتر شروع می‌کنی —
                و اگر نه، از صفر.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg" onClick={() => setScreen("quiz")}>
                شروع تعیین سطح <ArrowLeft size={18} />
              </Button>
              <Link href="/app" className="rounded-2xl bg-sand px-5 py-3 text-center text-sm font-bold text-plum">
                رد کن، از صفر شروع می‌کنم
              </Link>
            </div>
          </div>
        )}

        {screen === "quiz" && question && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-plum-soft">
              <span className="rounded-full bg-white px-2.5 py-1">{question.level}</span>
              <span className="num">
                سؤال {fa(step + 1)} از {fa(questions.length)}
              </span>
            </div>

            <div className="card min-h-40 space-y-3 p-4">
              <p className="text-sm font-bold text-plum" dir="rtl">
                <BiText text={question.prompt} />
              </p>
              <div className="grid gap-2">
                {question.choices.map((choice, index) => {
                  const isPicked = picked === index;
                  const isCorrect = picked !== null && index === question.answer;
                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={picked !== null}
                      onClick={() => answer(index)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors",
                        isCorrect && "border-mint bg-mint/15 text-[#065f46]",
                        isPicked && !isCorrect && "shake border-lose bg-lose/10 text-lose",
                        picked === null && "border-plum/10 bg-white text-plum hover:bg-sand",
                        picked !== null && !isPicked && !isCorrect && "border-plum/10 bg-white text-plum/40",
                      )}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button className="w-full" disabled={picked === null} onClick={next}>
              بعدی <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {screen === "result" && (
          <div className="pop-in space-y-4 text-center">
            <Character id={guide} size={112} mood="cheer" className="bob mx-auto" />
            <div className="card space-y-3 p-5">
              <p className="num text-xs font-bold text-plum-soft">
                {fa(score)} از {fa(questions.length)} درست
              </p>
              <h2 className="text-xl font-extrabold text-plum">از سطح {startLevel} شروع کن</h2>
              <p className="text-xs leading-5 text-plum-soft">
                درس‌های سطح‌های پایین‌تر با ۲ ستاره ثبت می‌شوند تا مسیر باز شود — هر وقت خواستی می‌توانی برگردی
                و کامل تمرینشان کنی.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {levels.map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      level === startLevel ? "bg-fox text-white" : "bg-sand text-plum-soft",
                    )}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="lg" onClick={startHere}>
                بریم سراغ درس‌ها <Sparkles size={16} />
              </Button>
              <Link href="/app" className="rounded-2xl bg-sand px-5 py-3 text-sm font-bold text-plum">
                بعداً، از نقشه
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
