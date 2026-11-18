import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/game/LessonPlayer";
import { allLessons, getLesson, getUnitOf, nextLessonAfter, prerequisitesOf } from "@/lib/content";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return allLessons.map((lesson) => ({ id: lesson.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(id);
  return { title: lesson ? lesson.titleFa : "درس" };
}

export default async function LessonPage({ params }: Params) {
  const { id } = await params;
  const lesson = getLesson(id);
  const unit = getUnitOf(id);
  if (!lesson || !unit) notFound();

  return (
    <LessonPlayer
      lesson={lesson}
      theme={unit.theme}
      unitTitle={`واحد ${unit.index} · ${unit.titleFa}`}
      prerequisiteTitles={prerequisitesOf(lesson).map((item) => ({ id: item.id, titleFa: item.titleFa }))}
      nextId={nextLessonAfter(lesson.id)?.id}
    />
  );
}
