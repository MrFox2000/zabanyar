import { modelStatus } from "@/lib/ai/client";
import { aiFlags, AI_FEATURES } from "@/lib/ai/flags";

export const dynamic = "force-dynamic";

/**
 * Tells the client which AI surfaces are actually alive right now.
 * Default answer, and the only correct one until a key is added: all false.
 */
export async function GET() {
  const master = process.env.NEXT_PUBLIC_AI_ENABLED === "1";
  const { configured } = modelStatus();
  const features: Record<string, boolean> = {};
  for (const feature of AI_FEATURES) {
    features[feature] = master && configured && aiFlags[feature];
  }

  return Response.json(
    { ok: true, configured, features },
    { headers: { "cache-control": "no-store" } },
  );
}
