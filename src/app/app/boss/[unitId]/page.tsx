import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BossBattle } from "@/components/app/BossBattle";
import { units } from "@/lib/content";

type Params = { params: Promise<{ unitId: string }> };

export function generateStaticParams() {
  return units.map((unit) => ({ unitId: unit.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unitId } = await params;
  const unit = units.find((item) => item.id === unitId);
  return { title: unit ? unit.boss.titleFa : "نبرد پایانی" };
}

export default async function BossPage({ params }: Params) {
  const { unitId } = await params;
  const index = units.findIndex((item) => item.id === unitId);
  const unit = units[index];
  if (!unit) notFound();
  const nextUnit = units[index + 1];

  return (
    <BossBattle
      boss={unit.boss}
      unitTitle={`واحد ${unit.index} · ${unit.titleFa}`}
      nextHref={nextUnit ? `/app/lesson/${nextUnit.lessons[0].id}` : "/app/league"}
    />
  );
}
