"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Info, Volume2, VolumeX } from "lucide-react";
import { Hud } from "@/components/Hud";
import { isMuted, setMuted } from "@/lib/sound";
import {
  listVoices,
  preferredVoiceUri,
  setPreferredVoiceUri,
  setVoiceRate,
  speakWithFallback,
  stopSpeaking,
  voiceRate,
  voiceSupported,
  type VoiceInfo,
} from "@/lib/voice";
import { cn, fa } from "@/lib/utils";

const SAMPLE = "This is a cat. It is a good morning.";

export default function SettingsPage() {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rate, setRate] = useState(0.92);
  const [muted, setMutedState] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "failed">("idle");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // deferred a tick so the first client paint matches the server HTML
    const hydrate = setTimeout(() => {
      setSupported(voiceSupported());
      setSelected(preferredVoiceUri());
      setRate(voiceRate());
      setMutedState(isMuted());
      setVoices(listVoices());
    }, 0);
    const load = () => setVoices(listVoices());
    window.speechSynthesis?.addEventListener?.("voiceschanged", load);
    return () => {
      clearTimeout(hydrate);
      window.speechSynthesis?.removeEventListener?.("voiceschanged", load);
    };
  }, []);

  const test = async (uri?: string | null) => {
    stopSpeaking();
    setStatus("playing");
    const previous = preferredVoiceUri();
    if (uri !== undefined) setPreferredVoiceUri(uri);
    const used = await speakWithFallback(SAMPLE, rate);
    if (uri !== undefined) setPreferredVoiceUri(previous);
    setStatus(used ? "playing" : "failed");
  };

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        <section className="card p-4">
          <h1 className="text-lg font-extrabold text-plum">تنظیمات صدا</h1>
          <p className="mt-1 text-xs leading-6 text-plum-soft">
            تلفظ کلمه‌ها و جمله‌ها با موتور گفتار همین دستگاه پخش می‌شود. اگر صدای طبیعی نداری یا صدا نیامد،
            از این صفحه ویس دیگری انتخاب کن یا راهنمای پایین را ببین.
          </p>

          <div className="mt-3 flex items-center justify-between rounded-2xl bg-sand px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm font-bold text-plum">
              {muted ? <VolumeX size={16} className="text-lose" /> : <Volume2 size={16} className="text-[#065f46]" />}
              {muted ? "صدا خاموش است" : "صدا روشن است"}
            </span>
            <button
              type="button"
              onClick={() => {
                const next = !muted;
                setMuted(next);
                setMutedState(next);
              }}
              className={cn("rounded-xl px-3 py-1.5 text-xs font-extrabold", muted ? "bg-fox text-white" : "bg-white text-plum")}
            >
              {muted ? "روشن کن" : "خاموش کن"}
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-bold text-plum-soft">
              <span>سرعت خواندن</span>
              <span className="num">{rate.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.15}
              step={0.05}
              value={rate}
              onChange={(event) => {
                const next = Number(event.target.value);
                setRate(next);
                setVoiceRate(next);
              }}
              className="mt-1 w-full accent-[#f97316]"
              aria-label="سرعت خواندن"
            />
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-plum">ویس تلفظ</h2>
            <button
              type="button"
              onClick={() => test()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-fox px-3 py-1.5 text-xs font-extrabold text-white"
            >
              <Volume2 size={14} /> تست صدا
            </button>
          </div>

          {status === "failed" && (
            <p className="mt-2 rounded-xl bg-lose/10 px-3 py-2 text-xs font-bold text-lose">
              هیچ صدایی پخش نشد. راهنمای پایین صفحه را ببین؛ اگر مشکل ادامه داشت، صدای دستگاه یا مرورگر را بررسی کن.
            </p>
          )}

          {!supported && (
            <p className="mt-2 rounded-xl bg-gold/15 px-3 py-2 text-xs font-bold text-[#a16207]">
              این مرورگر از گفتار پشتیبانی نمی‌کند. اپ کار می‌کند، ولی برای شنیدن تلفظ از Chrome یا Edge استفاده کن.
            </p>
          )}

          <ul className="mt-3 space-y-2">
            <li>
              <button
                type="button"
                onClick={() => {
                  setPreferredVoiceUri(null);
                  setSelected(null);
                  void test(null);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold",
                  selected === null ? "border-fox bg-sand text-plum" : "border-plum/10 bg-white text-plum-soft",
                )}
              >
                <span>خودکار (بهترین ویس موجود)</span>
                {selected === null && <Check size={14} className="text-fox-deep" />}
              </button>
            </li>
            {voices.map((voice) => (
              <li key={voice.uri}>
                <button
                  type="button"
                  onClick={() => {
                    setPreferredVoiceUri(voice.uri);
                    setSelected(voice.uri);
                    void test(voice.uri);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold",
                    selected === voice.uri ? "border-fox bg-sand text-plum" : "border-plum/10 bg-white text-plum-soft",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate">{voice.name}</span>
                    {voice.natural && (
                      <span className="shrink-0 rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-bold text-[#065f46]">طبیعی</span>
                    )}
                  </span>
                  <span className="shrink-0 text-[10px] text-plum-soft">{voice.lang}</span>
                </button>
              </li>
            ))}
            {voices.length === 0 && supported && (
              <li className="rounded-xl bg-sand px-3 py-3 text-xs text-plum-soft">
                هنوز ویسی از دستگاه گزارش نشده. یک بار «تست صدا» را بزن یا صفحه را دوباره باز کن.
              </li>
            )}
          </ul>

          <p className="mt-3 text-[11px] leading-5 text-plum-soft">
            {voices.length > 0
              ? `${fa(voices.length)} ویس انگلیسی روی این دستگاه پیدا شد.`
              : "اگر لیست خالی است، مرورگر هنوز ویس‌ها را بارگذاری نکرده."}
          </p>
        </section>

        <section className="card p-4">
          <h2 className="text-sm font-extrabold text-plum">یادآور روزانه</h2>
          <p className="mt-1 text-[11px] leading-5 text-plum-soft">
            اگر امروز درس نخوانی، یک نوار یادآور بالای نقشه ظاهر می‌شود. (اعلان سیستمی وقتی نسخهٔ نصب‌شدنی
            و حساب کاربری اضافه شود فعال می‌شود.)
          </p>
          <p className="mt-2 rounded-xl bg-sand px-3 py-2 text-[11px] font-bold text-plum">
            الان روشن است — روی همین دستگاه، بدون نیاز به اجازهٔ اعلان.
          </p>
        </section>

        <section className="card p-4">
          <h2 className="text-sm font-extrabold text-plum">تصویرها</h2>
          <p className="mt-1 text-[11px] leading-5 text-plum-soft">
            تصاویر کلمه‌ها از مجموعهٔ اپن‌سورس{" "}
            <a href="https://openmoji.org/" target="_blank" rel="noreferrer" className="font-bold text-fox-deep underline">
              OpenMoji
            </a>{" "}
            است (مجوز CC BY-SA 4.0) و داخل اپ ذخیره شده‌اند؛ برای همین آفلاین هم نمایش داده می‌شوند.
          </p>
        </section>

        <section className="card border-sky/30 bg-sky/10 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-[#0369a1]">
            <Info size={15} /> صدا نمی‌آید؟
          </h2>
          <ol className="mt-2 list-decimal space-y-1.5 pr-4 text-xs leading-6 text-[#075985]">
            <li>کلید بی‌صدا (Mode) گوشی خاموش باشد و حجم رسانه صفر نباشد.</li>
            <li>در iOS: تنظیمات → Sounds → Ringer and Alerts را کمی بالا ببر؛ صدای Safari هم از همان‌جا می‌آید.</li>
            <li>در اندروید: تنظیمات → Sound → Media volume؛ و Chrome را در Settings → Accessibility مجاز کن.</li>
            <li>در Chrome دسکتاپ: Settings → Privacy → Site settings → Sound → Allow.</li>
            <li>اگر ویس‌ها خالی بودند، یک بار مرورگر را ببند و باز کن؛ موتور گفتار بعد از اولین لمس صفحه فعال می‌شود.</li>
            <li>اگر باز هم نبود، ویس «خودکار» را انتخاب کن تا از اولین ویس سالم استفاده شود.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
