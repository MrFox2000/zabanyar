import type { Unit } from "@/lib/content/schema";

/** compact shape the map screen needs — content JSON stays on the server */
export type MapLesson = {
  id: string;
  titleFa: string;
  goal: string;
  buildsOn: string[];
  exercises: number;
  xp: number;
};

export type MapUnit = {
  id: string;
  level: Unit["level"];
  index: number;
  titleFa: string;
  titleEn: string;
  theme: Unit["theme"];
  lessons: MapLesson[];
  boss: { id: string; titleFa: string; exercises: number };
};

export function buildMap(units: Unit[]): MapUnit[] {
  return units.map((unit) => ({
    id: unit.id,
    level: unit.level,
    index: unit.index,
    titleFa: unit.titleFa,
    titleEn: unit.titleEn,
    theme: unit.theme,
    lessons: unit.lessons.map((lesson) => ({
      id: lesson.id,
      titleFa: lesson.titleFa,
      goal: lesson.goal,
      buildsOn: lesson.buildsOn,
      exercises: lesson.exercises.length,
      xp: lesson.xp,
    })),
    boss: { id: unit.boss.id, titleFa: unit.boss.titleFa, exercises: unit.boss.exercises.length },
  }));
}
