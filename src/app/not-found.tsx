import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Foxy } from "@/components/Foxy";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="card max-w-md p-8 text-center">
        <Foxy size={104} mood="think" className="bob mx-auto" />
        <h1 className="mt-4 text-2xl font-extrabold text-plum">این صفحه پیدا نشد</h1>
        <p className="mt-2 text-sm leading-6 text-plum-soft">
          آدرسی که زدی وجود ندارد — یا درس هنوز ساخته نشده. فاکسی گشتی زد و چیزی پیدا نکرد.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/app"
            className="btn-pop inline-flex items-center justify-center gap-2 rounded-2xl bg-fox px-5 py-3 text-sm font-extrabold text-white"
          >
            نقشهٔ درس‌ها <ArrowLeft size={16} />
          </Link>
          <Link href="/" className="rounded-2xl bg-sand px-5 py-3 text-sm font-bold text-plum">
            صفحهٔ اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}
