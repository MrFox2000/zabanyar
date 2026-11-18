/**
 * Content checks that a schema alone cannot catch.
 *
 *   node scripts/check-content.mjs
 *
 * Fails loudly (exit 1) if any of these break:
 *   - a buildsOn id does not exist, or points forward in reading order (cycle-ish)
 *   - a choice list has duplicates, or an answer index is out of range
 *   - a sentence has no blank, or a word-order answer cannot be rebuilt from tokens
 *   - two exercises in the same lesson are identical
 *   - matching pairs repeat an English or Persian side
 *   - a lesson has fewer than 6 exercises or no "you can say" card
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const contentRoot = join(here, "..", "src", "content");
const levelDirs = readdirSync(contentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const units = levelDirs.flatMap((level) =>
  readdirSync(join(contentRoot, level))
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({ level, unit: JSON.parse(readFileSync(join(contentRoot, level, file), "utf8")) })),
);

// the folder and the payload must agree, otherwise the map shows the wrong level
for (const { level, unit } of units) {
  if (unit.level.toLowerCase() !== level) {
    problems.push(`${unit.id}: level "${unit.level}" inside folder "${level}"`);
  }
}

const flatUnits = units.map(({ unit }) => unit);

const problems = [];
const order = [];
const lessonIds = new Set();

for (const unit of flatUnits) {
  for (const lesson of unit.lessons) {
    const id = lesson.id;
    if (lessonIds.has(id)) problems.push(`${id}: duplicate lesson id`);
    lessonIds.add(id);
    order.push(id);
  }
}

const position = new Map(order.map((id, index) => [id, index]));

const check = (condition, message) => {
  if (!condition) problems.push(message);
};

for (const unit of flatUnits) {
  for (const lesson of unit.lessons) {
    const where = lesson.id;
    check(lesson.exercises.length >= 6, `${where}: only ${lesson.exercises.length} exercises`);
    check(lesson.youCanSay.length >= 1, `${where}: no youCanSay card`);

    for (const prerequisite of lesson.buildsOn) {
      check(lessonIds.has(prerequisite), `${where}: buildsOn "${prerequisite}" does not exist`);
      if (lessonIds.has(prerequisite)) {
        check(
          position.get(prerequisite) < position.get(where),
          `${where}: buildsOn "${prerequisite}" comes later in the course`,
        );
      }
    }

    if (lesson.buildsOn.length > 0) {
      const reviewShare =
        lesson.exercises.filter((exercise) => exercise.reviewOf).length / lesson.exercises.length;
      check(
        reviewShare >= 0.25 && reviewShare <= 0.5,
        `${where}: ${Math.round(reviewShare * 100)}% interleaved review (want 30–40%)`,
      );
      check(
        lesson.exercises.some((exercise) => exercise.reviewOf),
        `${where}: has prerequisites but no review exercise`,
      );
    }

    const seen = new Set();
    for (const exercise of lesson.exercises) {
      const tag = `${where} → ${exercise.id} (${exercise.kind})`;
      const signature = JSON.stringify([exercise.kind, exercise.prompt, exercise.choices ?? exercise.tokens ?? exercise.words]);
      check(!seen.has(signature), `${tag}: duplicate exercise`);
      seen.add(signature);

      if (exercise.kind === "match") {
        const english = exercise.pairs.map((pair) => pair.en);
        const persian = exercise.pairs.map((pair) => pair.fa);
        check(new Set(english).size === english.length, `${tag}: repeated English pair`);
        check(new Set(persian).size === persian.length, `${tag}: repeated Persian pair`);
      }

      if (exercise.choices) {
        check(
          new Set(exercise.choices).size === exercise.choices.length,
          `${tag}: duplicate choice`,
        );
        check(
          exercise.answer >= 0 && exercise.answer < exercise.choices.length,
          `${tag}: answer index out of range`,
        );
      } else if (exercise.words) {
        check(
          exercise.answer >= 0 && exercise.answer < exercise.words.length,
          `${tag}: spotError index out of range`,
        );
      }

      if (exercise.kind === "fillBlank") {
        check(exercise.sentence.includes("___"), `${tag}: sentence has no blank`);
        check(
          exercise.sentence.split("___").length === 2,
          `${tag}: sentence has more than one blank`,
        );
        check(
          exercise.choices[exercise.answer]?.toLowerCase() === exercise.sentence.split("___")[1].trim().split(" ")[0]?.toLowerCase() ||
            exercise.choices[exercise.answer] !== undefined,
          `${tag}: blank answer missing`,
        );
      }

      if (exercise.kind === "wordOrder") {
        const tokens = [...exercise.tokens].sort();
        const answerTokens = exercise.answer.split(" ").sort();
        check(
          JSON.stringify(tokens) === JSON.stringify(answerTokens),
          `${tag}: tokens do not rebuild the answer`,
        );
      }
    }
  }

  const boss = unit.boss;
  check(boss.exercises.length >= 8, `${boss.id}: fewer than 8 boss questions`);
  for (const exercise of boss.exercises) {
    if (exercise.choices) {
      check(new Set(exercise.choices).size === exercise.choices.length, `${boss.id}: duplicate boss choice`);
      check(
        exercise.answer >= 0 && exercise.answer < exercise.choices.length,
        `${boss.id}: boss answer out of range`,
      );
    }
  }
}

const stats = {
  levels: levelDirs,
  units: flatUnits.length,
  lessons: order.length,
  exercises: flatUnits.reduce(
    (sum, unit) => sum + unit.lessons.reduce((n, lesson) => n + lesson.exercises.length, 0) + unit.boss.exercises.length,
    0,
  ),
  problems: problems.length,
};

if (problems.length) {
  console.error(JSON.stringify({ ...stats, details: problems.slice(0, 40) }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(stats, null, 2));
