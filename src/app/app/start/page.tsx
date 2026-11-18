import type { Metadata } from "next";
import { Placement, type PlacementQuestion } from "@/components/app/Placement";
import { units } from "@/lib/content";

export const metadata: Metadata = { title: "تعیین سطح" };

/**
 * Builds a short placement test from the real course: two multiple-choice
 * questions per level, taken from that level's first unit, plus the ids of the
 * lessons each level covers so a good score can unlock it.
 */
export default function StartPage() {
  const levels = [...new Set(units.map((unit) => unit.level))];

  const questions: PlacementQuestion[] = [];
  const lessonsByLevel: Record<string, string[]> = {};

  for (const level of levels) {
    const levelUnits = units.filter((unit) => unit.level === level);
    lessonsByLevel[level] = levelUnits.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));

    const pick = levelUnits
      .flatMap((unit) => unit.lessons)
      .flatMap((lesson) => lesson.exercises.filter((exercise) => exercise.kind === "mcq"))
      .slice(0, 2);

    for (const exercise of pick) {
      if (exercise.kind !== "mcq") continue;
      questions.push({
        level,
        prompt: exercise.prompt,
        choices: exercise.choices,
        answer: exercise.answer,
      });
    }
  }

  return <Placement levels={levels} questions={questions} lessonsByLevel={lessonsByLevel} />;
}
