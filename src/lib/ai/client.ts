import "server-only";

/**
 * The only place in زبان‌یار that talks to a model.
 *
 * Server-only by construction: keys live in process env and never reach the
 * browser. Any OpenAI-compatible endpoint works (Google AI Studio's
 * OpenAI-compat URL, Groq, OpenRouter, a local llama.cpp server…), which keeps
 * us from marrying one vendor.
 *
 * Contract: this function **never throws** and returns `null` on any failure.
 * Callers must have a non-AI fallback — a model being down must never break a
 * lesson.
 */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ModelStatus = {
  configured: boolean;
  model: string | null;
  baseUrl: string | null;
};

export function modelStatus(): ModelStatus {
  const key = process.env.AI_API_KEY;
  const base = process.env.AI_BASE_URL;
  return {
    configured: Boolean(key && base),
    model: process.env.AI_MODEL ?? null,
    baseUrl: base ?? null,
  };
}

const CACHE_LIMIT = 100;
const cache = new Map<string, string>();

function cacheKey(messages: ChatMessage[]): string {
  return messages.map((m) => `${m.role}:${m.content}`).join("\u0001");
}

export async function chat(
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number; timeoutMs?: number } = {},
): Promise<string | null> {
  const { configured } = modelStatus();
  const key = process.env.AI_API_KEY;
  const base = process.env.AI_BASE_URL?.replace(/\/$/, "");
  const model = process.env.AI_MODEL;
  if (!configured || !key || !base || !model) return null;

  const cacheable = cacheKey(messages);
  const hit = cache.get(cacheable);
  if (hit) return hit;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 12_000);

  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.4,
        max_tokens: opts.maxTokens ?? 300,
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return null;

    if (cache.size >= CACHE_LIMIT) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(cacheable, text);

    return text;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** very small per-IP rate limiter so a public demo cannot be farmed */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 12;

export function allowRequest(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count += 1;
  return true;
}
