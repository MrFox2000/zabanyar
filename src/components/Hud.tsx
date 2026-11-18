"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Heart, Volume2, VolumeX, Zap } from "lucide-react";
import { HEART_MAX, levelOf, useHydrated, useProgress } from "@/lib/store/progress";
import { isMuted, setMuted } from "@/lib/sound";
import { fa } from "@/lib/utils";

/** sticky HUD: hearts, XP, streak, level — the same numbers on every screen */
export function Hud() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const level = levelOf(progress.xp);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    // read after the first paint so server HTML and client HTML agree
    const id = setTimeout(() => setMutedState(isMuted()), 0);
    return () => clearTimeout(id);
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <div className="sticky top-0 z-30 border-b border-fox/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/app" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-fox text-lg text-white shadow-pop">🦊</span>
          <span className="text-sm font-extrabold text-plum">زبان‌یار</span>
        </Link>

        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-plum shadow-sm">
            <Zap size={16} className="shrink-0 fill-gold text-gold" strokeWidth={2.5} />
            <span className="num">{hydrated ? fa(progress.xp) : "۰"}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-plum shadow-sm">
            <Flame size={16} className="shrink-0 fill-coral text-coral" strokeWidth={2.5} />
            <span className="num">{hydrated ? fa(progress.streak) : "۰"}</span>
          </span>
          <span className="flex items-center gap-0.5 rounded-full bg-white px-2.5 py-1 shadow-sm" aria-label="جان‌ها">
            {Array.from({ length: HEART_MAX }).map((_, index) => (
              <Heart
                key={index}
                size={15}
                strokeWidth={2.5}
                className={index < progress.hearts ? "fill-coral text-coral" : "fill-transparent text-plum/20"}
              />
            ))}
          </span>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "روشن کردن صدا" : "بی‌صدا کردن"}
            className="grid size-8 place-items-center rounded-full bg-white text-plum-soft shadow-sm"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <Link
            href="/app/notebook"
            className="hidden rounded-full bg-sand px-3 py-1 text-xs font-bold text-plum sm:block"
          >
            دفتر من
          </Link>
          <Link
            href="/app/profile"
            className="hidden items-center gap-1.5 rounded-full bg-plum px-3 py-1 text-xs text-cream sm:flex"
            title={level.title}
          >
            سطح <span className="num">{hydrated ? fa(level.level) : "۱"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
