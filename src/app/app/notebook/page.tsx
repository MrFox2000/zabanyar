import type { Metadata } from "next";
import { Notebook, type NotebookEntry } from "@/components/app/Notebook";
import { units } from "@/lib/content";

export const metadata: Metadata = { title: "دفتر من" };

export default function NotebookPage() {
  const entries: NotebookEntry[] = units.flatMap((unit) =>
    unit.lessons.map((lesson, position) => ({
      id: lesson.id,
      titleFa: lesson.titleFa,
      titleEn: lesson.title,
      level: unit.level,
      unitIndex: unit.index,
      unitTitle: unit.titleFa,
      order: position,
      vocab: lesson.vocab ?? [],
      tip: lesson.tip ?? null,
      sentences: lesson.youCanSay ?? [],
    })),
  );

  return <Notebook entries={entries} />;
}
