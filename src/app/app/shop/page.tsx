"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Crown, Gem, Snowflake, Sparkles } from "lucide-react";
import { Hud } from "@/components/Hud";
import { SKINS, rankOf } from "@/lib/skins";
import { activateSkin, buyFreeze, buySkin, grantAdHeart, refillHeartsWithGems, useHydrated, useProgress } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";

export default function ShopPage() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(progress.activeSkin);
  const previewSkin = SKINS.find((skin) => skin.id === preview) ?? SKINS[0];
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

        <section className="card overflow-hidden p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-plum">پیش‌نمایش</h2>
            <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold text-plum-soft">{previewSkin.nameFa}</span>
          </div>
          <div className={cn("rounded-2xl p-3", previewSkin.gradient || "bg-cream")}>
            <div className="rounded-2xl bg-white p-3 shadow-pop">
              <div className="flex items-center justify-between">
                <span className="grid size-7 place-items-center rounded-xl bg-fox text-sm text-white">🦊</span>
                <span className="flex items-center gap-1 rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold text-plum">
                  ♥♥♥ · <span className="num">۱۲۰</span> جم
                </span>
              </div>
              <p className="mt-2 text-[11px] font-extrabold text-plum">درس صداهای کوتاه</p>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
                <div className="h-full w-2/3 rounded-full bg-fox" />
              </div>
              <div className="mt-2 flex gap-1.5">
                <span className="flex-1 rounded-lg bg-fox/90 py-1.5 text-center text-[10px] font-bold text-white">شروع</span>
                <span className="flex-1 rounded-lg bg-sand py-1.5 text-center text-[10px] font-bold text-plum-soft">نقشه</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-plum-soft">
            این پیش‌نمایش با همان پس‌زمینه و رنگ‌بندی واقعیِ اسکین روی صفحه‌های اپ ساخته شده است.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {SKINS.map((skin) => {
            const owned = progress.ownedSkins.includes(skin.id);
            const active = progress.activeSkin === skin.id;
            return (
              <div key={skin.id} className={cn("card overflow-hidden", active && "ring-2 ring-fox")}>
                <button type="button" onClick={() => setPreview(skin.id)} aria-label={`پیش‌نمایش ${skin.nameFa}`} className={cn("block h-16 w-full", skin.swatch)} />
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

        <section className="card p-4">
          <h2 className="text-sm font-extrabold text-plum">جان‌ها</h2>
          <p className="mt-1 text-xs leading-5 text-plum-soft">
            سه جان داری و هر اشتباه یکی کم می‌کند. هر ۲۰ دقیقه یک جان برمی‌گردد؛ اگر عجله داری:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => flash(refillHeartsWithGems(30) ? "جان‌ها پر شد" : "جم کافی نیست یا جان‌ها پر است")}
              className="rounded-xl bg-fox px-3 py-2 text-[11px] font-extrabold text-white"
            >
              پر کردن جان‌ها — ۳۰ جم
            </button>
            <button
              type="button"
              onClick={() => flash(grantAdHeart() ? "یک جان گرفتی" : "جان‌ها پر است")}
              className="rounded-xl bg-sand px-3 py-2 text-[11px] font-extrabold text-plum"
            >
              تبلیغ ببین + ۱ جان
            </button>
          </div>
          <p className="num mt-2 text-[11px] text-plum-soft">جان فعلی: {fa(progress.hearts)} از ۳ · جم: {fa(progress.gems)}</p>
        </section>

        <Link
          href="/app/plus"
          className="card flex items-center justify-between gap-3 border-gold/50 bg-gradient-to-l from-gold/25 to-fox/15 p-4"
        >
          <span>
            <span className="text-sm font-extrabold text-plum">زبان‌یار پلاس</span>
            <span className="mt-0.5 block text-[11px] text-plum-soft">جان بی‌نهایت + همهٔ درس‌ها باز + بدون تبلیغ</span>
          </span>
          <Crown size={20} className="shrink-0 text-[#a16207]" />
        </Link>

        <section className="card border-gold/40 bg-gold/10 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-[#a16207]">
            <Sparkles size={15} /> بعدی
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-plum">
            بستهٔ آفلاین و زبان‌یار پلاس در نقشهٔ درآمد آمده‌اند؛ اول باید لایهٔ رایگان کامل بماند.
          </p>
          <button
            type="button"
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-xl bg-white/60 py-2 text-[11px] font-bold text-plum/50"
          >
            تماشای ویدیوی پاداش‌دار → ۲۰ جم (به‌زودی)
          </button>
        </section>
      </main>
    </div>
  );
}
