import type { Metadata } from "next";
import { Notebook, type NotebookEntry } from "@/components/app/Notebook";
import { units } from "@/lib/content";

export const metadata: Metadata = { title: "دفتر من" };

export default function NotebookPage() {
  const entries: NotebookEntry[] = units.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      id: lesson.id,
      titleFa: lesson.titleFa,
      unitTitle: unit.titleFa,
      unitIndex: unit.index,
      vocab: lesson.vocab ?? [],
      tip: lesson.tip ?? null,
    })),
  );

  return <Notebook entries={entries} />;
}
