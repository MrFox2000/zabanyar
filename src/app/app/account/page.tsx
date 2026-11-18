"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LogOut, Mail, ShieldCheck } from "lucide-react";
import { Hud } from "@/components/Hud";
import {
  authConfigured,
  authMessage,
  getSession,
  sendReset,
  signIn,
  signOut,
  signUp,
  type Session,
} from "@/lib/account";
import { reconcile } from "@/lib/sync";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "reset";

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // read the stored session after mount so render stays pure
    const id = setTimeout(() => {
      setSession(getSession());
      setReady(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);

    if (mode === "reset") {
      const ok = await sendReset(email.trim());
      setBusy(false);
      setMessage(ok ? "لینک بازیابی به ایمیلت فرستاده شد" : "ارسال نشد — ایمیل را چک کن");
      return;
    }

    if (mode === "signup") {
      const result = await signUp(email.trim(), password);
      setBusy(false);
      if ("error" in result) {
        setError(authMessage(result.error));
        return;
      }
      if (result.needsConfirm) {
        setMessage("حساب ساخته شد — لینک تأیید را از ایمیلت باز کن، بعد وارد شو");
        setMode("signin");
        return;
      }
      if (result.session) {
        setSession(result.session);
        await reconcile(result.session);
        setMessage("خوش آمدی! پیشرفت این دستگاه به حسابت منتقل شد");
      }
      return;
    }

    const result = await signIn(email.trim(), password);
    setBusy(false);
    if ("error" in result) {
      setError(authMessage(result.error));
      return;
    }
    setSession(result.session);
    await reconcile(result.session);
    setMessage("وارد شدی — پیشرفت هر دو طرف یکی شد");
  };

  const logout = async () => {
    await signOut();
    setSession(null);
    setMessage("خارج شدی؛ پیشرفت روی این دستگاه می‌ماند");
  };

  if (!authConfigured()) {
    return (
      <div className="min-h-dvh">
        <Hud />
        <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
          <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
            <ArrowRight size={14} /> نقشه
          </Link>
          <section className="card p-5">
            <h1 className="text-lg font-extrabold text-plum">حساب کاربری هنوز وصل نیست</h1>
            <p className="mt-2 text-xs leading-6 text-plum-soft">
              کدِ ورود و ثبت‌نام کامل است، ولی به دو کلید از Supabase نیاز دارد. بعد از اضافه‌شدن
              <span className="en"> NEXT_PUBLIC_SUPABASE_URL </span>
              و
              <span className="en"> NEXT_PUBLIC_SUPABASE_ANON_KEY </span>
              همین صفحه فعال می‌شود. تا آن موقع اپ رایگان و بدون حساب کار می‌کند.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <Hud />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-5">
        <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-plum-soft">
          <ArrowRight size={14} /> نقشه
        </Link>

        {ready && session ? (
          <section className="card space-y-3 p-5">
            <h1 className="flex items-center gap-2 text-lg font-extrabold text-plum">
              <ShieldCheck size={18} className="text-[#065f46]" /> حساب تو
            </h1>
            <p className="num text-xs text-plum-soft">{session.email}</p>
            <p className="rounded-xl bg-sand px-3 py-2 text-[11px] leading-5 text-plum">
              پیشرفت این دستگاه با حسابت همگام است: هر درسی که تمام کنی، در حساب ذخیره می‌شود و روی گوشی
              دیگر هم برمی‌گردد.
            </p>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sand px-3 py-2 text-xs font-bold text-plum"
            >
              <LogOut size={14} /> خروج
            </button>
          </section>
        ) : (
          <section className="card space-y-3 p-5">
            <h1 className="text-lg font-extrabold text-plum">
              {mode === "signup" ? "ساخت حساب" : mode === "reset" ? "بازیابی رمز" : "ورود"}
            </h1>
            <p className="text-[11px] leading-5 text-plum-soft">
              با ایمیل ثبت‌نام کن تا پیشرفتت بین گوشی‌ها هم بماند. اگر حساب نداشته باشی هم اپ کار می‌کند.
            </p>

            <label className="block text-[11px] font-bold text-plum">
              ایمیل
              <span className="mt-1 flex items-center gap-2 rounded-xl border border-plum/10 bg-white px-3 py-2">
                <Mail size={14} className="text-plum-soft" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none"
                  dir="ltr"
                />
              </span>
            </label>

            {mode !== "reset" && (
              <label className="block text-[11px] font-bold text-plum">
                رمز عبور
                <span className="mt-1 flex items-center rounded-xl border border-plum/10 bg-white px-3 py-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full bg-transparent text-sm outline-none"
                    dir="ltr"
                  />
                </span>
              </label>
            )}

            {error && <p className="rounded-xl bg-lose/10 px-3 py-2 text-xs font-bold text-lose">{error}</p>}
            {message && <p className="rounded-xl bg-mint/15 px-3 py-2 text-xs font-bold text-[#065f46]">{message}</p>}

            <button
              type="button"
              disabled={busy || !email || (mode !== "reset" && password.length < 6)}
              onClick={submit}
              className={cn(
                "w-full rounded-2xl py-3 text-sm font-extrabold text-white",
                busy ? "bg-plum/40" : "bg-fox",
              )}
            >
              {busy ? "کمی صبر…" : mode === "signup" ? "ساخت حساب" : mode === "reset" ? "فرستادن لینک" : "ورود"}
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
              <button type="button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); }} className="text-fox-deep">
                {mode === "signup" ? "حساب دارم، وارد می‌شوم" : "حساب ندارم، می‌سازم"}
              </button>
              <button type="button" onClick={() => { setMode("reset"); setError(null); }} className="text-plum-soft">
                رمز را فراموش کردم
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
