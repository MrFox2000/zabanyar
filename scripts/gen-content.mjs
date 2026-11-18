/**
 * Content pipeline for زبان‌یار (build-time, offline).
 *
 * Curated source data lives here; this script expands it into the exercise JSON
 * the app ships with. It is deliberately separate from the app: AI may later
 * generate *drafts* into the same shape, reviewed by a human before publishing.
 * The shipped app never depends on a live model for its core content.
 *
 *   node scripts/gen-content.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import LEVELS from "./curriculum/index.mjs";

const ALL_UNITS = Object.values(LEVELS).flat();
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const contentRoot = join(here, "..", "src", "content");

/* ── curated A1 material ─────────────────────────────────────────────── */
// w: [english, persian, emoji] · b: [sentence with ___, answer, persian]
// o: [correct sentence, persian] · e: [words, wrongIndex, fixed sentence]

/* ── expansion ───────────────────────────────────────────────────────── */

function makeRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const hash = (text) => [...text].reduce((acc, ch) => (acc * 31 + ch.codePointAt(0)) % 100000, 7);

const shuffle = (rng, list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function pickChoices(rng, correct, pool, count) {
  const options = [correct];
  for (const candidate of shuffle(rng, pool)) {
    if (options.length >= count) break;
    if (!options.includes(candidate)) options.push(candidate);
  }
  const ordered = shuffle(rng, options);
  return { choices: ordered, answer: ordered.indexOf(correct) };
}

const lessonIndex = new Map();
for (const unit of ALL_UNITS) {
  for (const lesson of unit.lessons) {
    lessonIndex.set(`${unit.id}-${lesson.slug}`, { unit, lesson });
  }
}

function allWords(unit) {
  return unit.lessons.flatMap((l) => l.w);
}

/**
 * Curated data may refer to a prerequisite by bare slug ("family") or by full id
 * ("a1-u1-hello-name"). Everything ships with full ids, so resolve here — a
 * dangling buildsOn would silently lock a lesson forever.
 */
function resolveId(unitId, reference) {
  if (lessonIndex.has(reference)) return reference;
  const sameUnit = `${unitId}-${reference}`;
  if (lessonIndex.has(sameUnit)) return sameUnit;
  return reference;
}


/** explicit teaching cards: sounds → words → a real sentence → the rule */
function buildTeach(lesson) {
  const teach = [];

  for (const [letter, sound, word, wordFa, emoji] of lesson.letters ?? []) {
    teach.push({ kind: "letter", letter, sound, word, wordFa, emoji });
  }

  for (const [en, fa, emoji] of lesson.w.slice(0, lesson.letters?.length ? 2 : 4)) {
    teach.push({ kind: "word", en, fa, emoji });
  }

  // a full sentence, built from this lesson's own words so it is never alien
  for (const [sentence, fa] of lesson.o.slice(0, 1)) {
    teach.push({ kind: "sentence", en: sentence, fa });
  }
  if (lesson.b?.[0]) {
    const [template, answer, fa] = lesson.b[0];
    const filled = template.replace("___", answer);
    teach.push({ kind: "sentence", en: filled, fa, highlight: answer });
  }

  if (lesson.tip) {
    teach.push({
      kind: "rule",
      title: lesson.tip.title,
      body: lesson.tip.body,
      examples: lesson.o.slice(0, 2).map(([en, fa]) => ({ en, fa })),
    });
  }

  return teach;
}

function buildExercises(unit, lesson) {
  const id = `${unit.id}-${lesson.slug}`;
  const rng = makeRng(hash(lesson.slug + unit.id));
  const localEn = lesson.w.map((w) => w[0]);
  const unitFa = [...new Set(allWords(unit).map((w) => w[1]))];
  const unitEn = [...new Set(allWords(unit).map((w) => w[0]))];
  const exercises = [];
  const reviewSource = [];
  for (const prerequisite of lesson.buildsOn) {
    const prereq = resolveId(unit.id, prerequisite);
    const found = lessonIndex.get(prereq);
    if (found) reviewSource.push({ id: prereq, words: found.lesson.w });
  }

  const push = (exercise) => exercises.push({ id: `${id}.${exercises.length + 1}`, ...exercise });

  // 1. meaning of a word
  {
    const word = lesson.w[0];
    const { choices, answer } = pickChoices(rng, word[1], unitFa, 3);
    push({
      kind: "mcq",
      prompt: `معنی «${word[0]}» چیست؟`,
      promptFa: word[1],
      choices,
      answer,
      speak: word[0],
      aiHints: {
        example: `I know the word "${word[0]}".`,
        explanation: `«${word[0]}» یعنی ${word[1]}.`,
      },
    });
  }

  // 2. picture → word
  {
    const word = lesson.w[1];
    const { choices, answer } = pickChoices(rng, word[0], localEn.length > 2 ? localEn : unitEn, 3);
    push({
      kind: "imageWord",
      prompt: "این تصویر کدام کلمه است؟",
      emoji: word[2],
      choices,
      answer,
      speak: word[0],
    });
  }

  // 3. listening
  {
    const word = lesson.w[2];
    const { choices, answer } = pickChoices(rng, word[0], unitEn, 3);
    push({
      kind: "listen",
      prompt: "چه شنیدی؟",
      speak: word[0],
      choices,
      answer,
    });
  }

  // 4. match pairs
  {
    const pairs = lesson.w.slice(0, 4).map(([en, fa]) => ({ en, fa }));
    push({ kind: "match", prompt: "هر کلمه را به معنی‌اش وصل کن", pairs: shuffle(rng, pairs) });
  }

  // 5. fill the blank
  {
    const [sentence, answerWord, fa] = lesson.b[0];
    const { choices, answer } = pickChoices(rng, answerWord, [...unitEn, ...localEn], 3);
    push({
      kind: "fillBlank",
      prompt: "جای خالی را پر کن",
      promptFa: fa,
      sentence,
      choices,
      answer,
    });
  }

  // 6. sentence building
  {
    const [sentence, fa] = lesson.o[0];
    const tokens = shuffle(rng, sentence.replace(/[.!?]$/, "").split(" "));
    push({
      kind: "wordOrder",
      prompt: "جمله را بساز",
      promptFa: fa,
      tokens,
      answer: sentence.replace(/[.!?]$/, ""),
    });
  }

  // 7. spot the mistake
  {
    const [words, wrongIndex, fix] = lesson.e[0];
    push({
      kind: "spotError",
      prompt: "کدام کلمه غلط است؟",
      words,
      answer: wrongIndex,
      fix,
      aiHints: { explanation: `درستش این است: ${fix}` },
    });
  }

  // 8. speed round
  {
    const word = lesson.w[4];
    const other = unitFa.find((fa) => fa !== word[1]) ?? "—";
    const ordered = shuffle(rng, [word[1], other]);
    push({
      kind: "speed",
      prompt: `سریع! «${word[0]}» یعنی چه؟`,
      speak: word[0],
      choices: ordered,
      answer: ordered.indexOf(word[1]),
      ms: 6000,
    });
  }

  // 9–12. interleaved review: 30–40% of the lesson re-uses the prerequisites
  const reviewCount = lesson.buildsOn.length > 0 ? 4 : 1;
  for (let i = 0; i < reviewCount; i += 1) {
    if (reviewSource.length > 0) {
      const source = reviewSource[i % reviewSource.length];
      const word = source.words[(i + 1) % source.words.length];
      const kind = ["mcq", "listen", "imageWord", "speed"][i % 4];
      if (kind === "mcq") {
        const { choices, answer } = pickChoices(rng, word[1], unitFa, 3);
        push({
          kind: "mcq",
          prompt: `یادت هست؟ معنی «${word[0]}»`,
          choices,
          answer,
          speak: word[0],
          reviewOf: source.id,
        });
      } else if (kind === "listen") {
        const { choices, answer } = pickChoices(rng, word[0], unitEn, 3);
        push({ kind: "listen", prompt: "مرور — چه شنیدی؟", speak: word[0], choices, answer, reviewOf: source.id });
      } else if (kind === "imageWord") {
        const { choices, answer } = pickChoices(rng, word[0], unitEn, 3);
        push({
          kind: "imageWord",
          prompt: "مرور — این تصویر کدام کلمه است؟",
          emoji: word[2],
          choices,
          answer,
          speak: word[0],
          reviewOf: source.id,
        });
      } else {
        const other = unitFa.find((fa) => fa !== word[1]) ?? "—";
        const ordered = shuffle(rng, [word[1], other]);
        push({
          kind: "speed",
          prompt: `مرور سریع! «${word[0]}»`,
          speak: word[0],
          choices: ordered,
          answer: ordered.indexOf(word[1]),
          ms: 6000,
          reviewOf: source.id,
        });
      }
    } else {
      const word = lesson.w[3];
      const { choices, answer } = pickChoices(rng, word[1], unitFa, 3);
      push({ kind: "mcq", prompt: `معنی «${word[0]}» چیست؟`, choices, answer, speak: word[0] });
    }
  }

  // 11. second blank, if the lesson has one
  if (lesson.b[1]) {
    const [sentence, answerWord, fa] = lesson.b[1];
    const { choices, answer } = pickChoices(rng, answerWord, [...unitEn, ...localEn], 3);
    push({ kind: "fillBlank", prompt: "یک جای خالی دیگر", promptFa: fa, sentence, choices, answer });
  }

  return exercises;
}

function buildBoss(unit) {
  const rng = makeRng(hash(unit.id + "-boss"));
  const pool = unit.lessons.flatMap((l) => l.w);
  const exercises = [];
  const kinds = ["mcq", "listen", "imageWord", "speed", "mcq", "listen", "imageWord", "speed", "mcq", "listen"];

  for (let i = 0; i < 10; i += 1) {
    const word = pool[(i * 3 + 1) % pool.length];
    const kind = kinds[i];
    const en = [...new Set(pool.map((w) => w[0]))];
    const fa = [...new Set(pool.map((w) => w[1]))];
    const id = `${unit.id}-boss.${i + 1}`;

    if (kind === "mcq" || kind === "speed") {
      const { choices, answer } = pickChoices(rng, word[1], fa, kind === "speed" ? 2 : 3);
      exercises.push({
        id,
        kind,
        prompt: kind === "speed" ? `سریع! «${word[0]}»` : `معنی «${word[0]}»`,
        speak: word[0],
        choices,
        answer,
        ...(kind === "speed" ? { ms: 5000 } : {}),
      });
    } else if (kind === "listen") {
      const { choices, answer } = pickChoices(rng, word[0], en, 3);
      exercises.push({ id, kind, prompt: "چه شنیدی؟", speak: word[0], choices, answer });
    } else {
      const { choices, answer } = pickChoices(rng, word[0], en, 3);
      exercises.push({ id, kind, prompt: "این تصویر کدام کلمه است؟", emoji: word[2], choices, answer, speak: word[0] });
    }
  }

  return {
    id: `${unit.id}-boss`,
    titleFa: `نبرد پایانی — ${unit.titleFa}`,
    hp: 10,
    seconds: 120,
    rewardXp: 120,
    exercises,
  };
}

let totalExercises = 0;
const manifest = [];

for (const [levelKey, units] of Object.entries(LEVELS)) {
  const outDir = join(contentRoot, levelKey);
  mkdirSync(outDir, { recursive: true });

  units.forEach((unit, position) => {
    const lessons = unit.lessons.map((lesson) => {
      const exercises = buildExercises(unit, lesson);
      totalExercises += exercises.length;
      return {
        id: `${unit.id}-${lesson.slug}`,
        title: lesson.title,
        titleFa: lesson.titleFa,
        goal: lesson.goal,
        buildsOn: lesson.buildsOn.map((reference) => resolveId(unit.id, reference)),
        vocab: lesson.w.map(([en, fa, emoji]) => ({ en, fa, emoji })),
        teach: buildTeach(lesson),
        exercises,
        youCanSay: lesson.say.map(([en, fa]) => ({ en, fa })),
        xp: 40 + exercises.length * 4,
        ...(lesson.tip ? { tip: lesson.tip } : {}),
      };
    });

    const payload = {
      id: unit.id,
      level: unit.level,
      index: unit.index,
      titleFa: unit.titleFa,
      titleEn: unit.titleEn,
      theme: unit.theme,
      lessons,
      boss: buildBoss(unit),
    };

    const file = `unit-${String(position + 1).padStart(2, "0")}.json`;
    writeFileSync(join(outDir, file), JSON.stringify(payload, null, 2) + "\n", "utf8");
    manifest.push({ level: levelKey, file, id: unit.id, lessons: lessons.length, exercises: lessons.reduce((n, l) => n + l.exercises.length, 0) });
  });

  console.log(`  ${levelKey}: ${units.length} units`);
}

console.log(JSON.stringify({ totalExercises, manifest }, null, 2));
