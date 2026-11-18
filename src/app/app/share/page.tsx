"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Share2 } from "lucide-react";
import { Character, characterFor } from "@/components/Character";
import { Hud } from "@/components/Hud";
import { rankOf } from "@/lib/skins";
import { levelOf, useHydrated, useProgress } from "@/lib/store/progress";
import { fa } from "@/lib/utils";

const SITE = "https://zabanyar-kappa.vercel.app";

/** a shareable summary of real progress — the free acquisition channel */
export default function SharePage() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const guide = characterFor("share");
  const level = levelOf(progress.xp);
  const rank = rankOf(progress.xp);
  const lessons = Object.keys(progress.lessons).length;
  const stars = Object.values(progress.lessons).reduce((sum, record) => sum + record.stars, 0);
  const [copied, setCopied] = useState(false);

  const text = `من در زبان‌یار ${fa(lessons)} درس را تمام کرده‌ام، ${fa(stars)} ستاره گرفته‌ام و ${fa(progress.streak)} روز پیوسته درس خوانده‌ام. 🦊 ${SITE}`;

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "زبان‌یار", text, url: SITE });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    await copy();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        <section className="card overflow-hidden">
          <div className="bg-gradient-to-l from-fox/20 via-coral/15 to-gold/20 p-5 text-center">
            <Character id={guide} size={92} mood="cheer" className="bob mx-auto" />
            <h1 className="mt-2 text-lg font-extrabold text-plum">کارت پیشرفت من</h1>
            <p className="num text-xs text-plum-soft">
              سطح {fa(level.level)} · {rank.current.emoji} {rank.current.nameFa}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
            {[
              { label: "XP", value: fa(progress.xp) },
              { label: "درس", value: fa(lessons) },
              { label: "ستاره", value: fa(stars) },
              { label: "روز پیوسته", value: fa(progress.streak) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-sand/70 px-2 py-3 text-center">
                <p className="num text-lg font-extrabold text-plum">{hydrated ? item.value : "۰"}</p>
                <p className="text-[10px] text-plum-soft">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={share}
            className="btn-pop inline-flex items-center justify-center gap-2 rounded-2xl bg-fox py-3.5 text-sm font-extrabold text-white"
          >
            <Share2 size={16} /> اشتراک‌گذاری کارت
          </button>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-bold text-plum"
          >
            {copied ? <Check size={16} className="text-[#065f46]" /> : <Copy size={16} />}
            {copied ? "کپی شد" : "کپی متن"}
          </button>
        </div>

        <section className="card p-4">
          <h2 className="text-sm font-extrabold text-plum">دعوت دوستان</h2>
          <p className="mt-1 text-[11px] leading-5 text-plum-soft">
            زبان‌یار فعلاً بدون حساب کاربری کار می‌کند، پس کد معرف واقعی وجود ندارد. وقتی حساب کاربری اضافه شد،
            این کارت یک لینک دعوت واقعی هم می‌گیرد — تا آن موقع، همین متن را برای دوستت بفرست.
          </p>
        </section>
      </main>
    </div>
  );
}
