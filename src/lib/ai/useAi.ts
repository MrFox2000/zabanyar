"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { aiFlags, isAiEnabled, type AiFeature } from "@/lib/ai/flags";

type RunArgs = Record<string, unknown>;

type AiResult<T> = {
  ok: boolean;
  disabled?: boolean;
  error?: string;
  data?: T;
};

/**
 * One hook for every AI surface.
 *
 * `available` is false today (flags off, or no key configured). Components
 * render their static experience and never call `run`. When a flag flips, the
 * same component starts offering the enhanced path — no other change.
 */
export function useAi<T = { text: string }>(feature: AiFeature) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isAiEnabled(feature)) return;
    fetch("/api/ai/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: { features?: Record<string, boolean> }) => {
        if (!cancelled) setAvailable(Boolean(json.features?.[feature]));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [feature]);

  const run = useCallback(
    async (body: RunArgs): Promise<AiResult<T>> => {
      if (!isAiEnabled(feature)) return { ok: false, disabled: true };
      setBusy(true);
      setError(null);
      try {
        const response = await fetch(`/api/ai/${routeFor(feature)}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ feature, ...body }),
        });
        const json = (await response.json()) as AiResult<T>;
        if (!json.ok) setError(json.error ?? "unavailable");
        return json;
      } catch {
        setError("network");
        return { ok: false, error: "network" };
      } finally {
        setBusy(false);
      }
    },
    [feature],
  );

  return useMemo(() => ({ available, run, busy, error, flagged: aiFlags[feature] }), [available, run, busy, error, feature]);
}

function routeFor(feature: AiFeature): string {
  switch (feature) {
    case "explainMistake":
      return "explain";
    case "generateExample":
      return "example";
    case "conversation":
      return "chat";
    default:
      return "hint";
  }
}
