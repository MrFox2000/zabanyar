"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Check, Gift, Sparkles } from "lucide-react";
import { allMissionsDone, CHEST_REWARD, todayMissions } from "@/lib/store/missions";
import { openDailyChest, useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

/**
 * "Today's missions" card. Every number comes from counters written as the
 * learner actually answers questions — it can never claim progress that did not
 * happen, and it resets at local midnight.
 */
export function DailyMissions() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [opening, setOpening] = useState(false);

  if (!hydrated) {
    return (
      <div className="card mb-5 h-36 animate-pulse bg-white/60 p-4">
        <div className="h-3 w-24 rounded bg-sand" />
      </div>
    );
  }

  const missions = todayMissions(progress.daily);
  const complete = allMissionsDone(missions);
  const chestOpened = progress.daily.chestOpened;

  const openChest = () => {
    if (!complete || chestOpened || opening) return;
    setOpening(true);
    const opened = openDailyChest(CHEST_REWARD);
    if (opened) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FBBF24", "#F97316", "#FB7185", "#34D399"],
      });
    }
    setTimeout(() => setOpening(false), 1400);
  };

  return (
    <section className="card mb-5 overflow-hidden">
      <header className="flex items-center justify-between px-4 pt-4">
        <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-plum">
          <Sparkles size={15} className="text-fox" /> مأموریت‌های امروز
        </h2>
        <span className="num text-[11px] font-bold text-plum-soft">
          {fa(missions.filter((mission) => mission.done).length)} از {fa(missions.length)}
        </span>
      </header>

      <ul className="space-y-2 px-4 py-3">
        {missions.map((mission) => (
          <li key={mission.id} className="flex items-center gap-2.5">
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl text-sm", mission.done ? "bg-mint/20" : "bg-sand")}>
              {mission.done ? <Check size={15} className="text-[#065f46]" /> : mission.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-xs font-bold", mission.done ? "text-[#065f46]" : "text-plum")}>
                {mission.title}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", mission.done ? "bg-mint" : "bg-fox")}
                  style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                />
              </div>
            </div>
            <span className="num shrink-0 text-[10px] font-bold text-plum-soft">
              {fa(mission.progress)}/{fa(mission.target)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-fox/10 px-4 py-3">
        {chestOpened ? (
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#a16207]">
            <Gift size={14} /> صندوق امروز باز شد — فردا یکی دیگر هست.
          </p>
        ) : (
          <button
            type="button"
            disabled={!complete}
            onClick={openChest}
            className={cn(
              "btn-pop flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-extrabold transition-colors",
              complete ? "bg-gold text-[#4a2c00]" : "bg-sand text-plum/35",
            )}
          >
            <Gift size={15} />
            {complete
              ? opening
                ? `+${fa(CHEST_REWARD)} XP گرفتی!`
                : `صندوق را باز کن — ${fa(CHEST_REWARD)} XP`
              : "هر سه مأموریت را کامل کن تا صندوق باز شود"}
          </button>
        )}
      </div>
    </section>
  );
}
