import Link from "next/link";
import { ArrowLeft, Brain, Check, Flame, Gamepad2, Heart, Link2, Smartphone, Sparkles, Star, Zap } from "lucide-react";
import { Foxy } from "@/components/Foxy";
import { allLessons, totalExercises, units } from "@/lib/content";
import { fa } from "@/lib/utils";

const GAMES = [
  { emoji: "🔗", title: "وصل کردن جفت‌ها", text: "کلمه را به معنی‌اش وصل کن" },
  { emoji: "🧩", title: "چیدن جمله", text: "کلمه‌ها را در ترتیب درست بچین" },
  { emoji: "🎧", title: "شنیداری", text: "بشنو و همان را انتخاب کن" },
  { emoji: "✏️", title: "جای خالی", text: "کلمهٔ گم‌شده را پیدا کن" },
  { emoji: "🖼️", title: "تصویر و کلمه", text: "از تصویر به کلمه برس" },
  { emoji: "⚡", title: "دور سرعت", text: "در چند ثانیه تصمیم بگیر" },
  { emoji: "🕵️", title: "کلمهٔ غلط", text: "تنها اشتباه جمله را پیدا کن" },
  { emoji: "⚔️", title: "نبرد پایانی", text: "مرور کل واحد در یک نبرد" },
];

const FEATURES = [
  { icon: <Link2 size={18} />, title: "هر درس به درس‌های قبل وصل است", text: "روی صفحه نوشته می‌شود که این درس روی چه چیزهایی ساخته شده؛ ۳۰٪ تمرین‌ها از همان درس‌های قبلی می‌آید." },
  { icon: <Heart size={18} />, title: "پنج جان، نه فشار", text: "هر ۱۵ دقیقه یک جان برمی‌گردد. بازی سخت است، ولی تنبیه نمی‌کند." },
  { icon: <Flame size={18} />, title: "کمبو و استریک", text: "جواب درست پشت سر هم، ضریب XP را بالا می‌برد؛ زنجیرهٔ روزهای پیاپی هم ثبت می‌شود." },
  { icon: <Star size={18} />, title: "ستاره و باز شدن مرحله", text: "هر درس با ۲ ستاره باز می‌شود — یعنی نمی‌توانی بدون یادگیری جلوتر بروی." },
  { icon: <Brain size={18} />, title: "جمله‌های کاربردی", text: "هر درس با کارت «حالا می‌توانی بگویی» تمام می‌شود: کلمه‌های قدیمی در جمله‌های نو." },
  { icon: <Smartphone size={18} />, title: "روی گوشی نصب می‌شود", text: "فارسی، راست‌به‌چپ، سبک و آفلاین‌پسند. لازم نیست اپ‌استور بروی." },
];

const FAQ = [
  {
    q: "چرا این اپ با بقیه فرق دارد؟",
    a: "بیشتر اپ‌ها درس‌ها را جدا از هم می‌دهند. اینجا هر درس رسماً روی درس‌های قبلی ساخته شده و تمرین‌های قبلی داخل درس جدید تکرار می‌شوند — همان چیزی که باعث می‌شود زبان در ذهن «شبکه» شود.",
  },
  {
    q: "برای چه سطحی است؟",
    a: `الان سطح A1 کامل است: ${fa(units.length)} واحد، ${fa(allLessons.length)} درس و ${fa(totalExercises)} تمرین. سطح‌های A2 تا C1 در فاز بعد اضافه می‌شوند.`,
  },
  {
    q: "پول می‌خواهد؟",
    a: "نسخهٔ فعلی رایگان و بدون ثبت‌نام است. حساب کاربری و لیگ هفتگی در فاز بعد می‌آید.",
  },
  {
    q: "هوش مصنوعی دارد؟",
    a: "معماری‌اش از روز اول برای افزودن AI ساخته شده — یک کلاینت سمت سرور، فلگ برای هر بخش، و fallback کامل. امروز خاموش است و اپ بدون آن کامل کار می‌کند؛ وقتی روشن شود، راهنمایی هوشمند و توضیح خطا به همان درس‌ها اضافه می‌شود.",
  },
  {
    q: "صدا از کجا می‌آید؟",
    a: "از موتور گفتار خود مرورگر. یعنی هیچ فایل صوتی سنگینی دانلود نمی‌شود و تلفظ با همان صدای دستگاه پخش می‌شود.",
  },
];

export default function Landing() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-fox/10 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-fox text-lg text-white shadow-pop">🦊</span>
            <span className="text-base font-extrabold text-plum">زبان‌یار</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-bold text-plum-soft md:flex">
            <a href="#why" className="hover:text-plum">چرا؟</a>
            <a href="#games" className="hover:text-plum">بازی‌ها</a>
            <a href="#pricing" className="hover:text-plum">قیمت</a>
            <a href="#faq" className="hover:text-plum">سؤال‌ها</a>
          </nav>
          <Link
            href="/app"
            className="btn-pop inline-flex items-center gap-1.5 rounded-2xl bg-fox px-4 py-2 text-sm font-extrabold text-white"
          >
            شروع رایگان <ArrowLeft size={16} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* hero */}
        <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-fox/12 px-3 py-1 text-xs font-bold text-fox-deep">
              <Sparkles size={13} /> برای فارسی‌زبان‌ها · A1 کامل
            </span>
            <h1 className="text-3xl font-extrabold leading-[1.35] text-plum md:text-5xl md:leading-[1.25]">
              انگلیسی را <span className="text-fox">وصل</span> یاد بگیر،
              <br />
              نه تکه‌تکه.
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-plum-soft">
              هر درس روی درس‌های قبلی ساخته می‌شود و خودش می‌گوید روی چه چیزی سوار است. بازی‌وار، با جان، کمبو و
              ستاره — و هر درس زیر ۴ دقیقه.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="btn-pop inline-flex items-center gap-2 rounded-2xl bg-fox px-6 py-3.5 text-base font-extrabold text-white"
              >
                شروع کن — بدون ثبت‌نام <ArrowLeft size={18} />
              </Link>
              <a
                href="#why"
                className="btn-pop inline-flex items-center gap-2 rounded-2xl border border-fox/20 bg-white px-6 py-3.5 text-base font-extrabold text-plum"
              >
                چطور کار می‌کند؟
              </a>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                { n: fa(allLessons.length), l: "درس" },
                { n: fa(totalExercises), l: "تمرین" },
                { n: fa(GAMES.length), l: "نوع بازی" },
              ].map((item) => (
                <div key={item.l} className="card px-2 py-3">
                  <dt className="num text-xl font-extrabold text-fox-deep">{item.n}</dt>
                  <dd className="text-[11px] text-plum-soft">{item.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="card relative mx-auto max-w-sm p-6">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold text-plum-soft">
                <span className="rounded-full bg-mint/15 px-2 py-1 text-[#067a55]">درس اهل کجایی؟</span>
                <span className="rounded-full bg-sky/15 px-2 py-1 text-[#0369a1]">مرور درس قبل</span>
              </div>
              <p className="text-sm font-bold text-plum">معنی «from» چیست؟</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["از", "با", "برای", "زیر"].map((choice, index) => (
                  <div
                    key={choice}
                    className={`rounded-2xl border px-3 py-3 text-center text-sm font-bold ${
                      index === 0 ? "border-mint bg-mint/15 text-[#065f46]" : "border-fox/15 bg-white text-plum"
                    }`}
                  >
                    {choice}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-sand px-3 py-2 text-xs font-bold text-plum">
                <Zap size={14} className="fill-gold text-gold" /> کمبو ×۳ — ادامه بده
              </div>
            </div>
            <Foxy size={88} mood="cheer" className="bob mx-auto mt-4" />
          </div>
        </section>

        {/* why */}
        <section id="why" className="border-y border-fox/10 bg-white/50">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="text-2xl font-extrabold text-plum md:text-3xl">ایدهٔ اصلی: پیوستگی</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-plum-soft">
              هر درس فیلد <code className="en rounded bg-sand px-1.5 py-0.5 text-xs">buildsOn</code> دارد. قبل از شروع
              می‌بینی روی چه درس‌هایی سوار است، ۳۰ تا ۴۰ درصد تمرین‌ها از همان‌ها می‌آید و درس تا وقتی درس‌های
              پیش‌نیاز ۲ ستاره نگیرند باز نمی‌شود.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {[
                { title: "۱. پیش‌نیازها", body: "«Hello, I'm…» → اولین درس، بدون پیش‌نیاز", tone: "bg-white" },
                { title: "۲. ساخت روی آن", body: "«Where are you from?» روی درس اول ساخته شده", tone: "bg-sand" },
                { title: "۳. ترکیب", body: "«I am from Iran» = دو درس قبلی در یک جمله", tone: "bg-fox/15" },
              ].map((card) => (
                <div key={card.title} className={`card ${card.tone} p-4`}>
                  <p className="text-sm font-extrabold text-plum">{card.title}</p>
                  <p className="mt-1 text-xs leading-6 text-plum-soft">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* features */}
        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-plum md:text-3xl">چه چیزی داخلش هست</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-4">
                <span className="mb-2 grid size-9 place-items-center rounded-xl bg-fox/12 text-fox-deep">{feature.icon}</span>
                <p className="text-sm font-extrabold text-plum">{feature.title}</p>
                <p className="mt-1 text-xs leading-6 text-plum-soft">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* games */}
        <section id="games" className="border-y border-fox/10 bg-white/50">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="flex items-center gap-2">
              <Gamepad2 size={22} className="text-fox" />
              <h2 className="text-2xl font-extrabold text-plum md:text-3xl">{fa(GAMES.length)} نوع بازی، به‌علاوهٔ نبرد پایانی</h2>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {GAMES.map((game) => (
                <div key={game.title} className="card p-3 text-center">
                  <span className="text-2xl">{game.emoji}</span>
                  <p className="mt-1 text-xs font-extrabold text-plum">{game.title}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-plum-soft">{game.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* levels roadmap */}
        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-plum md:text-3xl">مسیر سطح‌ها</h2>
          <div className="mt-6 space-y-2">
            {[
              { level: "A1", unitsCount: 8, status: "آماده", ready: true },
              { level: "A2", unitsCount: 10, status: "فاز بعد", ready: false },
              { level: "B1", unitsCount: 12, status: "فاز بعد", ready: false },
              { level: "B2", unitsCount: 12, status: "فاز بعد", ready: false },
              { level: "C1", unitsCount: 10, status: "فاز بعد", ready: false },
            ].map((row) => (
              <div key={row.level} className="card flex items-center justify-between px-4 py-3">
                <span className="flex items-center gap-3">
                  <span className={`grid size-9 place-items-center rounded-xl text-sm font-extrabold ${row.ready ? "bg-fox text-white" : "bg-sand text-plum-soft"}`}>
                    {row.level}
                  </span>
                  <span className="num text-xs text-plum-soft">{fa(row.unitsCount)} واحد</span>
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${row.ready ? "bg-mint/15 text-[#067a55]" : "bg-plum/5 text-plum-soft"}`}>
                  {row.ready ? <span className="inline-flex items-center gap-1"><Check size={12} /> {row.status}</span> : row.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="border-y border-fox/10 bg-white/50">
          <div className="mx-auto max-w-3xl px-4 py-14">
            <h2 className="text-center text-2xl font-extrabold text-plum md:text-3xl">قیمت</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <div className="card border-fox/40 p-5">
                <p className="text-sm font-extrabold text-plum">نسخهٔ فعلی</p>
                <p className="mt-2 text-3xl font-extrabold text-fox-deep">رایگان</p>
                <ul className="mt-4 space-y-2 text-xs text-plum-soft">
                  {["همهٔ ۳۲ درس A1", "بدون ثبت‌نام", "نصب روی گوشی", "پیشرفت روی دستگاه خودت"].map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Check size={14} className="text-mint" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className="btn-pop mt-5 block rounded-2xl bg-fox py-3 text-center text-sm font-extrabold text-white">
                  شروع کن
                </Link>
              </div>
              <div className="card p-5">
                <p className="text-sm font-extrabold text-plum">حساب کاربری + لیگ</p>
                <p className="mt-2 text-3xl font-extrabold text-plum/40">فاز ۲</p>
                <ul className="mt-4 space-y-2 text-xs text-plum-soft">
                  {["همگام‌سازی بین دستگاه‌ها", "لیگ هفتگی ۳۰ نفره", "دستیار مکالمهٔ AI", "سطح‌های A2 تا C1"].map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Star size={13} className="text-plum/25" /> {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-2xl bg-sand py-3 text-center text-xs font-bold text-plum-soft">در حال ساخت</p>
              </div>
            </div>
          </div>
        </section>

        {/* faq */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-plum md:text-3xl">سؤال‌های رایج</h2>
          <div className="mt-6 space-y-2">
            {FAQ.map((item) => (
              <details key={item.q} className="card group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-extrabold text-plum marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-fox transition-transform group-open:rotate-45">＋</span>
                  </span>
                </summary>
                <p className="mt-2 text-xs leading-6 text-plum-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* cta */}
        <section className="mx-auto max-w-3xl px-4 pb-16">
          <div className="card flex flex-col items-center gap-4 bg-gradient-to-l from-fox/15 to-coral/15 p-8 text-center">
            <Foxy size={92} mood="happy" className="bob" />
            <h2 className="text-xl font-extrabold text-plum">از کلمهٔ اول شروع کن</h2>
            <p className="max-w-md text-sm leading-6 text-plum-soft">
              اولین درس ۴ دقیقه است. اگر خوشت آمد، ۳۱ درس دیگر همان‌جا منتظرت است.
            </p>
            <Link href="/app" className="btn-pop inline-flex items-center gap-2 rounded-2xl bg-fox px-6 py-3.5 text-base font-extrabold text-white">
              بریم سراغ درس اول <ArrowLeft size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-fox/10 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center text-xs text-plum-soft">
          <p className="font-bold text-plum">زبان‌یار — ساخته‌شده برای فارسی‌زبان‌ها</p>
          <p>فارسی، راست‌به‌چپ، سبک. پیشرفت روی دستگاه خودت می‌ماند.</p>
        </div>
      </footer>
    </div>
  );
}
