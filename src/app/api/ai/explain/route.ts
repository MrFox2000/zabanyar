import { aiRoute, persianSystem, str } from "@/lib/ai/handler";

export const dynamic = "force-dynamic";

/** explains a wrong answer in Persian, in plain words */
export const POST = aiRoute("explainMistake", (body) => [
  persianSystem("توضیح بده چرا جواب کاربر غلط است و درستش چیست. خیلی کوتاه."),
  {
    role: "user",
    content: `سؤال: ${str(body.prompt, "—")}\nجواب کاربر: ${str(body.given, "—")}\nجواب درست: ${str(body.expected, "—")}`,
  },
]);
