import { z } from "zod";
import { unitSchema, type Lesson, type Unit } from "@/lib/content/schema";
import unit01 from "@/content/a1/unit-01.json";
import unit02 from "@/content/a1/unit-02.json";
import unit03 from "@/content/a1/unit-03.json";
import unit04 from "@/content/a1/unit-04.json";
import unit05 from "@/content/a1/unit-05.json";
import unit06 from "@/content/a1/unit-06.json";
import unit07 from "@/content/a1/unit-07.json";
import unit08 from "@/content/a1/unit-08.json";
import a2unit01 from "@/content/a2/unit-01.json";
import a2unit02 from "@/content/a2/unit-02.json";
import a2unit03 from "@/content/a2/unit-03.json";
import a2unit04 from "@/content/a2/unit-04.json";
import a2unit05 from "@/content/a2/unit-05.json";
import a2unit06 from "@/content/a2/unit-06.json";
import a2unit07 from "@/content/a2/unit-07.json";
import a2unit08 from "@/content/a2/unit-08.json";
import a2unit09 from "@/content/a2/unit-09.json";
import a2unit10 from "@/content/a2/unit-10.json";
import b1unit01 from "@/content/b1/unit-01.json";
import b1unit02 from "@/content/b1/unit-02.json";
import b1unit03 from "@/content/b1/unit-03.json";
import b1unit04 from "@/content/b1/unit-04.json";
import b1unit05 from "@/content/b1/unit-05.json";
import b1unit06 from "@/content/b1/unit-06.json";
import b1unit07 from "@/content/b1/unit-07.json";
import b1unit08 from "@/content/b1/unit-08.json";
import b1unit09 from "@/content/b1/unit-09.json";
import b1unit10 from "@/content/b1/unit-10.json";
import b1unit11 from "@/content/b1/unit-11.json";
import b1unit12 from "@/content/b1/unit-12.json";
import b2unit01 from "@/content/b2/unit-01.json";
import b2unit02 from "@/content/b2/unit-02.json";
import b2unit03 from "@/content/b2/unit-03.json";

/**
 * The content is validated once, at load. A broken JSON file fails loudly in
 * development instead of silently shipping a lesson with no right answer.
 */
const raw = [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08, a2unit01, a2unit02, a2unit03, a2unit04, a2unit05, a2unit06, a2unit07, a2unit08, a2unit09, a2unit10, b1unit01, b1unit02, b1unit03, b1unit04, b1unit05, b1unit06, b1unit07, b1unit08, b1unit09, b1unit10, b1unit11, b1unit12, b2unit01, b2unit02, b2unit03];

export const units: Unit[] = z.array(unitSchema).parse(raw);

/** every level that actually has content, in CEFR order */
export const LEVELS: Unit["level"][] = [...new Set(units.map((unit) => unit.level))];

export function unitsOfLevel(level: Unit["level"]): Unit[] {
  return units.filter((unit) => unit.level === level);
}

export function levelOfUnit(unit: Unit): Unit["level"] {
  return unit.level;
}

export const allLessons: Lesson[] = units.flatMap((unit) => unit.lessons);

export const lessonsById = new Map<string, Lesson>(allLessons.map((lesson) => [lesson.id, lesson]));

export const unitOfLesson = new Map<string, Unit>(
  units.flatMap((unit) => unit.lessons.map((lesson) => [lesson.id, unit] as const)),
);

export const totalExercises = units.reduce(
  (sum, unit) => sum + unit.lessons.reduce((n, l) => n + l.exercises.length, 0) + unit.boss.exercises.length,
  0,
);

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id);
}

export function getUnitOf(id: string): Unit | undefined {
  return unitOfLesson.get(id);
}

export function prerequisitesOf(lesson: Lesson): Lesson[] {
  return lesson.buildsOn.map((id) => lessonsById.get(id)).filter((l): l is Lesson => Boolean(l));
}

/** the lesson after this one in reading order, across units */
export function nextLessonAfter(id: string): Lesson | undefined {
  const index = allLessons.findIndex((lesson) => lesson.id === id);
  if (index === -1) return undefined;
  return allLessons[index + 1];
}

export function lessonsAfter(lesson: Lesson): Lesson[] {
  const sameUnit = getUnitOf(lesson.id);
  if (!sameUnit) return [];
  const index = sameUnit.lessons.findIndex((l) => l.id === lesson.id);
  return sameUnit.lessons.slice(index + 1);
}

export function unitProgressShape(unit: Unit): { lessons: number; exercises: number } {
  return {
    lessons: unit.lessons.length,
    exercises: unit.lessons.reduce((n, l) => n + l.exercises.length, 0) + unit.boss.exercises.length,
  };
}

export const THEME_CLASS: Record<Unit["theme"], { bg: string; text: string; ring: string; chip: string }> = {
  orange: { bg: "bg-fox", text: "text-fox-deep", ring: "ring-fox/30", chip: "bg-fox/15 text-fox-deep" },
  coral: { bg: "bg-coral", text: "text-[#b32d47]", ring: "ring-coral/30", chip: "bg-coral/15 text-[#b32d47]" },
  mint: { bg: "bg-mint", text: "text-[#067a55]", ring: "ring-mint/30", chip: "bg-mint/15 text-[#067a55]" },
  sky: { bg: "bg-sky", text: "text-[#0369a1]", ring: "ring-sky/30", chip: "bg-sky/15 text-[#0369a1]" },
  gold: { bg: "bg-gold", text: "text-[#a16207]", ring: "ring-gold/30", chip: "bg-gold/15 text-[#a16207]" },
};
