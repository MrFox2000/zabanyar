"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Gem, Snowflake, Sparkles } from "lucide-react";
import { Hud } from "@/components/Hud";
import { SKINS, rankOf } from "@/lib/skins";
import { activateSkin, buyFreeze, buySkin, useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

export default function ShopPage() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [message, setMessage] = useState<string | null>(null);
  const rank = rankOf(progress.xp);

  const flash = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2200);
  };

  const buy = (id: string, price: number) => {
    const ok = buySkin(id, price);
    if (ok) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ["#FBBF24", "#F97316", "#34D399"] });
      flash("اسکین خریداری شد و فعال شد");
    } else {
      flash(progress.gems < price ? "جم کافی نداری — درس بخوان و جم جمع کن" : "این اسکین را قبلاً داری");
    }
  };

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        <section className="card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-extrabold text-plum">فروشگاه</h1>
              <p className="mt-1 text-xs leading-5 text-plum-soft">
                جم فقط با یادگیری به دست می‌آید: هر درس ۲ جم (بی‌نقص ۵)، هر نبرد ۱۰ و صندوق روزانه ۱۵.
                هیچ‌چیزِ درسی پشت جم نیست — فقط ظاهر.
              </p>
            </div>
            <span className="flex shrink-0 flex-col items-center rounded-2xl bg-fox/10 px-3 py-2 text-fox-deep">
              <Gem size={18} />
              <span className="num mt-0.5 text-lg font-extrabold">{hydrated ? fa(progress.gems) : "۰"}</span>
              <span className="text-[10px]">جم</span>
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-sand px-3 py-2 text-xs font-bold text-plum">
            <span>
              رتبهٔ تو: {rank.current.emoji} {rank.current.nameFa}
            </span>
            <span className="num text-plum-soft">
              {rank.next ? `${fa(rank.toNext)} XP تا ${rank.next.nameFa}` : "بالاترین رتبه"}
            </span>
          </div>

          {message && <p className="pop-in mt-2 rounded-xl bg-mint/15 px-3 py-2 text-xs font-bold text-[#065f46]">{message}</p>}
        </section>

        <section className="grid grid-cols-2 gap-3">
          {SKINS.map((skin) => {
            const owned = progress.ownedSkins.includes(skin.id);
            const active = progress.activeSkin === skin.id;
            return (
              <div key={skin.id} className={cn("card overflow-hidden", active && "ring-2 ring-fox")}>
                <div className={cn("h-16", skin.swatch)} />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-plum">{skin.nameFa}</p>
                    {active && <Check size={15} className="text-[#065f46]" />}
                  </div>
                  <p className="num mt-0.5 text-[11px] text-plum-soft">
                    {skin.price === 0 ? "پیش‌فرض" : `${fa(skin.price)} جم`}
                  </p>
                  {owned ? (
                    <button
                      type="button"
                      disabled={active}
                      onClick={() => {
                        activateSkin(skin.id);
                        flash(`${skin.nameFa} فعال شد`);
                      }}
                      className={cn(
                        "mt-2 w-full rounded-xl py-1.5 text-[11px] font-extrabold",
                        active ? "bg-mint/20 text-[#065f46]" : "bg-plum text-cream",
                      )}
                    >
                      {active ? "فعال" : "فعال کن"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => buy(skin.id, skin.price)}
                      className="mt-2 w-full rounded-xl bg-fox py-1.5 text-[11px] font-extrabold text-white"
                    >
                      خرید با {fa(skin.price)} جم
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <section className="card p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-plum">
            <Snowflake size={15} className="text-sky" /> استریک فریز
          </h2>
          <p className="mt-1 text-xs leading-5 text-plum-soft">
            یک روز که درس نخواندی، استریکت با فریز می‌ماند. حداکثر دو فریز می‌توانی داشته باشی.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="num text-xs font-bold text-plum">فریزهای فعلی: {fa(progress.freezes)} / ۲</span>
            <button
              type="button"
              onClick={() => flash(buyFreeze(30) ? "یک فریز خریدی" : "جم کافی نیست یا به سقف دو فریز رسیده‌ای")}
              className="rounded-xl bg-sky px-3 py-1.5 text-xs font-extrabold text-white"
            >
              خرید با ۳۰ جم
            </button>
          </div>
        </section>

        <section className="card border-gold/40 bg-gold/10 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-[#a16207]">
            <Sparkles size={15} /> بعدی
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-plum">
            بستهٔ آفلاین، آزمون تعیین سطح و زبان‌یار پلاس در نقشهٔ درآمد آمده‌اند؛ اول باید لایهٔ رایگان کامل بماند.
          </p>
        </section>
      </main>
    </div>
  );
}
