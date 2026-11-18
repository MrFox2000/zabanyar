import type { Metadata } from "next";
import { MapBoard } from "@/components/app/MapBoard";
import { units } from "@/lib/content";
import { buildMap } from "@/lib/content/map";

export const metadata: Metadata = { title: "نقشهٔ درس‌ها" };

export default function AppPage() {
  return <MapBoard units={buildMap(units)} />;
}
