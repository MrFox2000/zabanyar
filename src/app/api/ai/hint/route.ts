import { aiRoute, persianSystem, str } from "@/lib/ai/handler";

export const dynamic = "force-dynamic";

/** a nudge for the exercise in front of the learner — never the answer itself */
export const POST = aiRoute("lessonHint", (body) => [
  persianSystem("راهنمایی بده، جواب را نگو."),
  {
    role: "user",
    content: `تمرین: ${str(body.prompt, "—")}\nگزینه‌ها: ${str(body.choices, "—")}\nیک راهنمایی کوتاه بده.`,
  },
]);
