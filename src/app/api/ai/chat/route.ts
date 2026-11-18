import { aiRoute, persianSystem, str } from "@/lib/ai/handler";

export const dynamic = "force-dynamic";

/** phase-2 conversation partner; the route exists now so the door is already there */
export const POST = aiRoute("conversation", (body) => [
  persianSystem("در نقش هم‌صحبت انگلیسی، کوتاه و در سطح A1–A2 جواب بده. در پایان یک سؤال بپرس."),
  { role: "user", content: str(body.message, "Hello!") },
]);
