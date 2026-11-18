import { aiRoute, persianSystem, str } from "@/lib/ai/handler";

export const dynamic = "force-dynamic";

/** one fresh example sentence for a word the learner just met */
export const POST = aiRoute("generateExample", (body) => [
  persianSystem("یک جملهٔ تازه و ساده بساز که همین کلمه در آن باشد. بعد ترجمهٔ فارسی‌اش را بنویس."),
  {
    role: "user",
    content: `کلمه: ${str(body.word, "—")}\nسطح: ${str(body.level, "A1")}`,
  },
]);
