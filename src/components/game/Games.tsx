"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import type { Exercise } from "@/lib/content/schema";
import { cn, shuffle, speak, speakSlow } from "@/lib/utils";

export type Commit = (correct: boolean, given: string) => void;

type Common = {
  locked: boolean;
  picked: string | null;
  onCommit: Commit;
};

type Props<K extends Exercise["kind"]> = Common & {
  exercise: Extract<Exercise, { kind: K }>;
};

/* ── shared pieces ───────────────────────────────────────────────────── */

function ChoiceGrid({
  choices,
  picked,
  correct,
  locked,
  onPick,
  columns = 2,
}: {
  choices: string[];
  picked: string | null;
  correct: string;
  locked: boolean;
  onPick: (choice: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-2.5", columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {choices.map((choice) => {
        const isPicked = picked === choice;
        const isCorrect = locked && choice === correct;
        const isWrong = locked && isPicked && choice !== correct;
        return (
          <button
            key={choice}
            type="button"
            disabled={locked}
            onClick={() => onPick(choice)}
            className={cn(
              "btn-pop card min-h-16 px-3 py-3 text-center text-base font-bold transition-all",
              isCorrect && "pop-in border-mint bg-mint/20 text-[#065f46] ring-2 ring-mint",
              isWrong && "shake border-lose bg-lose/10 text-lose",
              !locked && "hover:border-fox/50 hover:bg-sand active:scale-[0.98]",
            )}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}

/** the little celebration that fires on a correct answer */
export function CorrectBurst() {
  return (
    <span className="pointer-events-none absolute inset-x-0 top-8 flex justify-center" aria-hidden>
      {["✨", "⭐", "✨"].map((emoji, index) => (
        <span key={index} className="burst-piece text-2xl" style={{ animationDelay: `${index * 70}ms` }}>
          {emoji}
        </span>
      ))}
    </span>
  );
}

function SpeakerButton({ text, big = false }: { text: string; big?: boolean }) {
  const [n, setN] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        speak(text);
        setN((value) => value + 1);
      }}
      className={cn(
        "btn-pop mx-auto flex items-center justify-center gap-3 rounded-3xl bg-sky/15 font-extrabold text-[#0369a1] hover:bg-sky/25",
        big ? "size-28 flex-col text-sm" : "px-4 py-2 text-sm",
      )}
      aria-label="پخش صدا"
    >
      <Volume2 size={big ? 40 : 18} className={cn(n > 0 && "animate-pulse")} />
      {big ? "بشنو" : "دوباره"}
    </button>
  );
}

/* ── 1. meaning / vocabulary ─────────────────────────────────────────── */

export function McqGame({ exercise, locked, picked, onCommit }: Props<"mcq">) {
  const correct = exercise.choices[exercise.answer];
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="mb-2 text-sm text-plum-soft">{exercise.prompt}</p>
        <p className="text-3xl font-extrabold text-plum">
          <span className="en">{exercise.speak ?? correct}</span>
        </p>
        {exercise.speak && <div className="mt-3"><SpeakerButton text={exercise.speak} /></div>}
      </div>
      <ChoiceGrid choices={exercise.choices} picked={picked} correct={correct} locked={locked} onPick={(c) => onCommit(c === correct, c)} />
    </div>
  );
}

/* ── 2. picture → word ───────────────────────────────────────────────── */

export function ImageWordGame({ exercise, locked, picked, onCommit }: Props<"imageWord">) {
  const correct = exercise.choices[exercise.answer];
  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-plum-soft">{exercise.prompt}</p>
      <div className="pop-in mx-auto grid size-32 place-items-center rounded-[2rem] bg-sand text-6xl shadow-pop">
        {exercise.emoji}
      </div>
      <ChoiceGrid choices={exercise.choices} picked={picked} correct={correct} locked={locked} onPick={(c) => onCommit(c === correct, c)} />
    </div>
  );
}

/* ── 3. listening ────────────────────────────────────────────────────── */

export function ListenGame({ exercise, locked, picked, onCommit }: Props<"listen">) {
  const correct = exercise.choices[exercise.answer];
  const spoken = useRef(false);

  useEffect(() => {
    if (spoken.current) return;
    spoken.current = true;
    const timer = setTimeout(() => speak(exercise.speak), 320);
    return () => clearTimeout(timer);
  }, [exercise.speak]);

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-plum-soft">{exercise.prompt}</p>
      <SpeakerButton text={exercise.speak} big />
      <button
        type="button"
        onClick={() => speakSlow(exercise.speak)}
        className="mx-auto block rounded-full bg-sand px-3 py-1.5 text-xs font-bold text-plum-soft"
      >
        آهسته‌تر بگو
      </button>
      <ChoiceGrid choices={exercise.choices} picked={picked} correct={correct} locked={locked} onPick={(c) => onCommit(c === correct, c)} />
    </div>
  );
}

/* ── 4. fill the blank ───────────────────────────────────────────────── */

export function FillBlankGame({ exercise, locked, picked, onCommit }: Props<"fillBlank">) {
  const correct = exercise.choices[exercise.answer];
  const [before, after] = exercise.sentence.split("___");
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="mb-1 text-sm text-plum-soft">{exercise.prompt}</p>
        {exercise.promptFa && <p className="mb-4 text-xs text-plum-soft/70">{exercise.promptFa}</p>}
      </div>
      <p className="card flex flex-wrap items-center justify-center gap-2 px-4 py-5 text-center text-lg font-bold text-plum" dir="ltr">
        <span>{before}</span>
        <span
          className={cn(
            "inline-block min-w-20 rounded-xl border-b-4 border-dashed px-3 py-1",
            picked ? "border-fox bg-sand text-fox-deep" : "border-plum/25 text-plum/30",
            locked && picked === correct && "border-mint bg-mint/15 text-[#065f46]",
            locked && picked !== correct && "border-lose bg-lose/10 text-lose",
          )}
        >
          {picked ?? "…"}
        </span>
        <span>{after}</span>
      </p>
      <ChoiceGrid choices={exercise.choices} picked={picked} correct={correct} locked={locked} onPick={(c) => onCommit(c === correct, c)} />
    </div>
  );
}

/* ── 5. spot the mistake ─────────────────────────────────────────────── */

export function SpotErrorGame({ exercise, locked, picked, onCommit }: Props<"spotError">) {
  const correct = exercise.words[exercise.answer];
  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-plum-soft">{exercise.prompt}</p>
      <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm" dir="ltr">
        {exercise.words.map((word) => {
          const isPicked = picked === word;
          const isCorrect = locked && word === correct;
          const isWrong = locked && isPicked && word !== correct;
          return (
            <button
              key={word}
              type="button"
              disabled={locked}
              onClick={() => onCommit(word === correct, word)}
              className={cn(
                "rounded-xl px-3 py-2 text-base font-bold transition-colors",
                isCorrect && "bg-mint/25 text-[#065f46] ring-2 ring-mint",
                isWrong && "bg-lose/15 text-lose ring-2 ring-lose shake",
                !locked && !isPicked && "hover:bg-sand",
              )}
            >
              {word}
            </button>
          );
        })}
      </div>
      {locked && (
        <p className="text-center text-sm text-plum-soft">
          درستش: <span className="en font-bold text-plum">{exercise.fix}</span>
        </p>
      )}
    </div>
  );
}

/* ── 6. speed round ──────────────────────────────────────────────────── */

export function SpeedGame({ exercise, locked, picked, onCommit }: Props<"speed">) {
  const correct = exercise.choices[exercise.answer];
  const [left, setLeft] = useState(100);
  const committed = useRef(false);

  useEffect(() => {
    if (locked) return;
    const started = Date.now();
    const interval = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - started) / exercise.ms) * 100);
      setLeft(pct);
      if (pct <= 0 && !committed.current) {
        committed.current = true;
        clearInterval(interval);
        onCommit(false, "⏰");
      }
    }, 60);
    return () => clearInterval(interval);
  }, [exercise.ms, locked, onCommit]);

  return (
    <div className="space-y-5">
      <p className="text-center text-sm font-bold text-coral">{exercise.prompt}</p>
      <div className="h-3 overflow-hidden rounded-full bg-sand">
        <div
          className={cn("h-full rounded-full transition-[width] duration-75", left > 45 ? "bg-mint" : left > 20 ? "bg-gold" : "bg-lose")}
          style={{ width: `${left}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {exercise.choices.map((choice) => {
          const isPicked = picked === choice;
          const isCorrect = locked && choice === correct;
          const isWrong = locked && isPicked && choice !== correct;
          return (
            <button
              key={choice}
              type="button"
              disabled={locked}
              onClick={() => onCommit(choice === correct, choice)}
              className={cn(
                "btn-pop card py-6 text-lg font-extrabold",
                isCorrect && "border-mint bg-mint/20 text-[#065f46]",
                isWrong && "border-lose bg-lose/10 text-lose shake",
              )}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 7. sentence builder ─────────────────────────────────────────────── */

export function WordOrderGame({ exercise, locked, onCommit }: Omit<Props<"wordOrder">, "picked">) {
  const [bank, setBank] = useState<{ id: number; word: string }[]>(() =>
    shuffle(exercise.tokens.map((word, id) => ({ id, word }))),
  );
  const [line, setLine] = useState<{ id: number; word: string }[]>([]);

  const full = line.length === exercise.tokens.length;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm text-plum-soft">{exercise.prompt}</p>
        {exercise.promptFa && <p className="mt-1 text-xs text-plum-soft/70">{exercise.promptFa}</p>}
      </div>

      <div className="flex min-h-20 flex-wrap content-center justify-center gap-2 rounded-2xl border-2 border-dashed border-fox/30 bg-white/70 p-3" dir="ltr">
        {line.length === 0 && <span className="text-sm text-plum/30">کلمه‌ها را بچین…</span>}
        {line.map((token) => (
          <button
            key={token.id}
            type="button"
            disabled={locked}
            onClick={() => {
              setLine((current) => current.filter((t) => t.id !== token.id));
              setBank((current) => [...current, token]);
            }}
            className="rounded-xl bg-fox px-3 py-2 text-sm font-bold text-white shadow-pop"
          >
            {token.word}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2" dir="ltr">
        {bank.map((token) => (
          <button
            key={token.id}
            type="button"
            disabled={locked}
            onClick={() => {
              setBank((current) => current.filter((t) => t.id !== token.id));
              setLine((current) => [...current, token]);
            }}
            className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-plum shadow-pop"
          >
            {token.word}
          </button>
        ))}
      </div>

      {!locked && (
        <button
          type="button"
          disabled={!full}
          onClick={() => {
            const sentence = line.map((t) => t.word).join(" ");
            onCommit(sentence.toLowerCase() === exercise.answer.toLowerCase(), sentence);
          }}
          className="btn-pop w-full rounded-2xl bg-mint py-3.5 text-base font-extrabold text-[#043d2b] disabled:bg-plum/10 disabled:text-plum/30"
        >
          {full ? "بررسی" : "همهٔ کلمه‌ها را بچین"}
        </button>
      )}

      {locked && (
        <p className="text-center text-sm text-plum-soft">
          جملهٔ درست: <span className="en font-bold text-plum">{exercise.answer}</span>
        </p>
      )}
    </div>
  );
}

/* ── 8. match pairs ──────────────────────────────────────────────────── */

export function MatchGame({ exercise, locked, onCommit }: Omit<Props<"match">, "picked">) {
  // Persian sits on the right (first column in RTL), English on the left — the
  // order a Persian speaker reads a dictionary in.
  const persian = useMemo(() => shuffle(exercise.pairs.map((pair) => pair.fa)), [exercise.pairs]);
  const english = useMemo(() => shuffle(exercise.pairs.map((pair) => pair.en)), [exercise.pairs]);
  const [selected, setSelected] = useState<{ side: "fa" | "en"; value: string } | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (done.length === exercise.pairs.length && !locked) {
      onCommit(mistakes === 0, `${done.length}/${exercise.pairs.length}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done.length]);

  const englishForPersian = (fa: string) => exercise.pairs.find((pair) => pair.fa === fa)?.en;

  const choose = (side: "fa" | "en", value: string) => {
    if (side === "en") speak(value);

    if (!selected) {
      setSelected({ side, value });
      return;
    }
    if (selected.side === side) {
      setSelected({ side, value });
      return;
    }

    const en = side === "en" ? value : selected.value;
    const fa = side === "fa" ? value : selected.value;
    if (exercise.pairs.some((pair) => pair.en === en && pair.fa === fa)) {
      setDone((current) => [...current, en]);
      setSelected(null);
      setWrong(null);
    } else {
      setMistakes((count) => count + 1);
      setWrong(value);
      setTimeout(() => setWrong(null), 450);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-plum-soft">{exercise.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2.5">
          {persian.map((fa) => {
            const owner = englishForPersian(fa) ?? "";
            const isDone = done.includes(owner);
            return (
              <button
                key={fa}
                type="button"
                disabled={isDone}
                onClick={() => choose("fa", fa)}
                className={cn(
                  "w-full rounded-2xl border bg-white px-2 py-3 text-sm font-bold shadow-sm transition-all",
                  isDone && "border-mint/40 bg-mint/10 text-plum/30 line-through",
                  !isDone && selected?.side === "fa" && selected.value === fa && "border-fox bg-sand text-fox-deep",
                  wrong === fa && "shake border-lose bg-lose/10 text-lose",
                )}
              >
                {fa}
              </button>
            );
          })}
        </div>
        <div className="space-y-2.5" dir="ltr">
          {english.map((en) => {
            const isDone = done.includes(en);
            return (
              <button
                key={en}
                type="button"
                disabled={isDone}
                onClick={() => choose("en", en)}
                className={cn(
                  "w-full rounded-2xl border bg-white px-2 py-3 text-sm font-bold shadow-sm transition-all",
                  isDone && "border-mint/40 bg-mint/10 text-plum/30 line-through",
                  !isDone && selected?.side === "en" && selected.value === en && "border-fox bg-sand text-fox-deep",
                  wrong === en && "shake border-lose bg-lose/10 text-lose",
                )}
              >
                {en}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-plum-soft">
        {done.length === exercise.pairs.length ? (
          <span className="pop-in flex items-center gap-1 font-bold text-[#065f46]">
            <Check size={14} /> همه را وصل کردی
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <RotateCcw size={13} /> {done.length}/{exercise.pairs.length} وصل شده
          </span>
        )}
        {mistakes > 0 && (
          <span className="flex items-center gap-1 text-lose">
            <X size={13} /> {mistakes} اشتباه
          </span>
        )}
      </div>
    </div>
  );
}

/* ── dispatcher ──────────────────────────────────────────────────────── */

export function Game(props: Common & { exercise: Exercise }) {
  const { exercise, ...rest } = props;
  switch (exercise.kind) {
    case "mcq":
      return <McqGame exercise={exercise} {...rest} />;
    case "imageWord":
      return <ImageWordGame exercise={exercise} {...rest} />;
    case "listen":
      return <ListenGame exercise={exercise} {...rest} />;
    case "fillBlank":
      return <FillBlankGame exercise={exercise} {...rest} />;
    case "wordOrder":
      return <WordOrderGame exercise={exercise} locked={rest.locked} onCommit={rest.onCommit} />;
    case "match":
      return <MatchGame exercise={exercise} locked={rest.locked} onCommit={rest.onCommit} />;
    case "spotError":
      return <SpotErrorGame exercise={exercise} {...rest} />;
    case "speed":
      return <SpeedGame exercise={exercise} {...rest} />;
  }
}
