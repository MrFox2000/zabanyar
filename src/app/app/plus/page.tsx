"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Crown, Infinity as InfinityIcon, Lock } from "lucide-react";
import { Hud } from "@/components/Hud";
import { activatePlus, cancelPlus, isPlus, useHydrated, useProgress, type Subscription } from "@/lib/store/progress";
import { cn, fa } from "@/lib/utils";
import { PAYMENTS_READY } from "@/lib/demo";
import { buyPlan, billingPossible } from "@/lib/billing";

type Plan = { id: NonNullable<Subscription["plan"]>; label: string; price: number; months: number; badge?: string };

/**
 * Prices in toman (the gateway will multiply by 10 for Rial).
 * Kept in one array so changing the ladder is a one-line edit.
 */
const PLANS: Plan[] = [
  { id: "monthly", label: "یک ماهه", price: 299000, months: 1 },
  { id: "quarterly", label: "سه ماهه", price: 430000, months: 3, badge: "پرفروش" },
  { id: "biannual", label: "شش ماهه", price: 760000, months: 6 },
  { id: "yearly", label: "یک ساله", price: 900000, months: 12, badge: "بیشترین صرفه" },
];

const PERKS = [
  { icon: "❤️", title: "جان بی‌نهایت", body: "هر جواب غلط دیگر جان کم نمی‌کند؛ بدون وقفه تمرین کن." },
  { icon: "🔓", title: "همهٔ درس‌ها باز", body: "بدون ستاره و بدون جم، هر درس از A1 تا B2 در دسترس است." },
  { icon: "🚫", title: "بدون تبلیغ", body: "هیچ ویدیوی پاداش‌داری نمی‌بینی." },
  { icon: "🎨", title: "اسکین‌های ویژه", body: "اسکین‌های پلاس بدون هزینهٔ جم فعال می‌شوند." },
];

export default function PlusPage() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [chosen, setChosen] = useState<Plan["id"]>("quarterly");
  const [message, setMessage] = useState<string | null>(null);
  const plus = isPlus(progress);
  const until = progress.subscription?.until;
  const [now, setNow] = useState(0);

  useEffect(() => {
    // the clock is read after mount so render stays pure
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  const daysLeft = until && now ? Math.max(0, Math.ceil((until - now) / 86_400_000)) : 0;

  /** true inside the Android app when Poolakey is configured */
  const canPurchase = PAYMENTS_READY || billingPossible();

  const activate = async () => {
    if (billingPossible()) {
      try {
        await buyPlan(chosen);
      } catch (error) {
        const reason = error instanceof Error ? error.message : "failed";
        setMessage(reason === "canceled" ? "خرید لغو شد" : "خرید انجام نشد — دوباره تلاش کن");
        return;
      }
    }
    activatePlus(chosen);
    setMessage("پلاس فعال شد");
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.7 }, colors: ["#FBBF24", "#F97316", "#34D399"] });
  };

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        <section className="card overflow-hidden">
          <div className="bg-gradient-to-l from-gold/30 via-fox/20 to-coral/20 p-5 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-plum text-cream">
              <Crown size={22} />
            </span>
            <h1 className="mt-2 text-xl font-extrabold text-plum">زبان‌یار پلاس</h1>
            <p className="mt-1 text-xs leading-5 text-plum-soft">
              همهٔ درس‌ها باز، جان بی‌نهایت، بدون تبلیغ — برای کسی که جدی می‌خواهد یاد بگیرد.
            </p>
            {hydrated && plus && (
              <p className="mx-auto mt-3 inline-block rounded-full bg-mint/20 px-3 py-1 text-[11px] font-extrabold text-[#065f46]">
                پلاس فعال است · {fa(daysLeft)} روز مانده
              </p>
            )}
          </div>

          <div className="grid gap-2 p-4 sm:grid-cols-2">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex gap-2 rounded-2xl bg-sand/60 p-3">
                <span className="text-lg">{perk.icon}</span>
                <div>
                  <p className="text-xs font-extrabold text-plum">{perk.title}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-plum-soft">{perk.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          {PLANS.map((plan) => {
            const monthly = Math.round(plan.price / plan.months);
            const active = chosen === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setChosen(plan.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-right transition-colors",
                  active ? "border-fox" : "border-transparent",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full border-2",
                      active ? "border-fox bg-fox text-white" : "border-plum/20",
                    )}
                  >
                    {active && <Check size={12} />}
                  </span>
                  <span>
                    <span className="text-sm font-extrabold text-plum">{plan.label}</span>
                    {plan.badge && (
                      <span className="mr-2 rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-bold text-[#a16207]">{plan.badge}</span>
                    )}
                    <span className="num mt-0.5 block text-[10px] text-plum-soft">
                      ماهی {fa(Math.round(monthly / 1000))} هزار تومان
                    </span>
                  </span>
                </span>
                <span className="num shrink-0 text-sm font-extrabold text-fox-deep">
                  {fa(Math.round(plan.price / 1000))}
                  <span className="mr-1 text-[10px] font-bold text-plum-soft">هزار تومان</span>
                </span>
              </button>
            );
          })}
        </section>

        {message && (
          <p className="rounded-xl bg-mint/15 px-3 py-2 text-center text-xs font-bold text-[#065f46]">{message}</p>
        )}

        {canPurchase ? (
          <button
            type="button"
            onClick={activate}
            className="btn-pop w-full rounded-2xl bg-plum py-3.5 text-sm font-extrabold text-cream"
          >
            فعال‌سازی پلاس
          </button>
        ) : (
          <div className="rounded-2xl border border-plum/10 bg-sand px-4 py-3 text-center">
            <p className="text-sm font-extrabold text-plum">پرداخت درون‌برنامه‌ای به‌زودی</p>
            <p className="mt-1 text-[11px] leading-5 text-plum-soft">
              این نسخه رایگان است و همهٔ درس‌ها با ستاره و جم باز می‌شوند. پلاس پس از اتصال پرداخت بازار
              فعال می‌شود.
            </p>
          </div>
        )}

        {canPurchase && plus && (
          <button type="button" onClick={cancelPlus} className="w-full rounded-2xl bg-sand py-2.5 text-[11px] font-bold text-plum-soft">
            لغو پلاس
          </button>
        )}

        <section className="card p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-plum">
            <InfinityIcon size={15} className="text-fox" /> چرا جان سه‌تاست؟
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-plum-soft">
            سه جان باعث می‌شود جواب‌ها با دقت داده شوند و یادگیری واقعی‌تر شود؛ ولی هر ۲۰ دقیقه یک جان برمی‌گردد و
            با جم یا یک تبلیغ کوتاه هم می‌شود فوری پر کرد. هیچ درسی پشت پول نیست.
          </p>
          <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-sand px-3 py-2 text-[11px] font-bold text-plum">
            <Lock size={13} /> بدون پلاس هم می‌توانی همه‌چیز را با ستاره و جم باز کنی.
          </p>
        </section>
      </main>
    </div>
  );
}
