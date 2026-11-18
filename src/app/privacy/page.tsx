import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "حریم خصوصی" };

/**
 * Privacy policy — required by both Café Bazaar and Myket before review.
 * It describes exactly what the app does today, no aspirational clauses.
 */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-plum">حریم خصوصی زبان‌یار</h1>
      <p className="mt-2 text-xs text-plum-soft">آخرین به‌روزرسانی: ۱۹ نوامبر ۲۰۲۶</p>

      <div className="mt-5 space-y-4 text-sm leading-7 text-plum">
        <section>
          <h2 className="text-base font-extrabold">چه داده‌ای جمع می‌کنیم؟</h2>
          <p className="mt-1 text-plum-soft">
            هیچ. زبان‌یار حساب کاربری ندارد و هیچ اطلاعاتی به سرور ما فرستاده نمی‌شود. پیشرفت تو
            (XP، ستاره، جان، جم، اسکین، اشتباه‌ها) فقط در حافظهٔ همین دستگاه
            (<span className="en">localStorage</span>) ذخیره می‌شود.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold">دسترسی‌های برنامه</h2>
          <p className="mt-1 text-plum-soft">
            برنامه فقط به اینترنت نیاز دارد (برای بارگذاری درس‌ها و در آینده دریافت به‌روزرسانی).
            به مخاطبین، دوربین، موقعیت مکانی، پیامک یا حافظهٔ بیرونی دسترسی نمی‌خواهد.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold">صدا و تلفظ</h2>
          <p className="mt-1 text-plum-soft">
            تلفظ‌ها با موتور گفتار خود دستگاه پخش می‌شوند. هیچ صدایی از تو ضبط یا ارسال نمی‌شود.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold">پرداخت</h2>
          <p className="mt-1 text-plum-soft">
            پرداخت‌ها (اگر فعال شود) از طریق سرویس پرداخت کافه‌بازار / مایکت انجام می‌شود و ما
            اطلاعات کارت بانکی را نمی‌بینیم و ذخیره نمی‌کنیم.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold">کودکان</h2>
          <p className="mt-1 text-plum-soft">
            زبان‌یار برای همهٔ سنین مناسب است، هیچ تبلیغ رفتاری یا جمع‌آوری دادهٔ شخصی ندارد و
            هیچ محتوای کاربرساخته‌ای نمایش نمی‌دهد.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold">تماس</h2>
          <p className="mt-1 text-plum-soft">
            برای هر پرسشی دربارهٔ داده‌ها:{" "}
            <a href="mailto:aliahmadpour.dev@gmail.com" className="font-bold text-fox-deep underline">
              aliahmadpour.dev@gmail.com
            </a>
          </p>
        </section>
      </div>

      <Link href="/" className="mt-8 inline-block rounded-2xl bg-fox px-5 py-3 text-sm font-extrabold text-white">
        بازگشت به زبان‌یار
      </Link>
    </main>
  );
}
