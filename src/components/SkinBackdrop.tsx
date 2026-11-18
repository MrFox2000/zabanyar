"use client";

import { skinById } from "@/lib/skins";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

/** paints the purchased skin behind every screen; classic leaves the default look */
export function SkinBackdrop() {
  const progress = useProgress();
  const skin = skinById(progress.activeSkin);

  if (!skin.gradient) return null;

  return <div className={cn("pointer-events-none fixed inset-0 -z-10", skin.gradient)} aria-hidden />;
}
