import type { NextRequest } from "next/server";
import { z } from "zod";
import { chat, allowRequest, modelStatus, type ChatMessage } from "@/lib/ai/client";
import { aiFlags, type AiFeature } from "@/lib/ai/flags";

/**
 * Shared POST handler for every /api/ai/* route.
 *
 * Guarantees: no key reaches the client, rate limited, feature-gated, and it
 * fails soft with a JSON body the UI can ignore.
 */
export function aiRoute(feature: AiFeature, build: (input: Record<string, unknown>) => ChatMessage[]) {
  return async function POST(request: NextRequest) {
    if (process.env.NEXT_PUBLIC_AI_ENABLED !== "1" || !aiFlags[feature]) {
      return json({ ok: false, disabled: true }, 200);
    }

    const status = modelStatus();
    if (!status.configured) return json({ ok: false, error: "not_configured" }, 200);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anon";
    if (!allowRequest(ip)) return json({ ok: false, error: "rate_limited" }, 429);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "bad_json" }, 400);
    }

    const parsed = z.record(z.string(), z.unknown()).safeParse(body);
    if (!parsed.success) return json({ ok: false, error: "bad_body" }, 400);

    const text = await chat(build(parsed.data), { maxTokens: 260 });
    if (!text) return json({ ok: false, error: "unavailable" }, 200);

    return json({ ok: true, data: { text } }, 200);
  };
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

const SYSTEM_FA =
  "تو دستیار یک اپ آموزش انگلیسی برای فارسی‌زبان‌ها هستی. کوتاه، ساده و دقیق جواب بده. " +
  "اصطلاحات انگلیسی را همیشه داخل متن انگلیسی بنویس. حداکثر سه جمله.";

export function persianSystem(extra = ""): ChatMessage {
  return { role: "system", content: `${SYSTEM_FA}${extra ? "\n" + extra : ""}` };
}

export function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.slice(0, 400) : fallback;
}
