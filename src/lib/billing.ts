/**
 * Bridge to the native Billing plugin (Café Bazaar / Poolakey).
 *
 * On the web there is no plugin, so `billingPossible()` is false and the app
 * stays a free app. Inside the Android shell the plugin appears as
 * `window.Capacitor.Plugins.Billing`; if the build has no RSA key the plugin
 * answers `billing_unavailable` and nothing is shown.
 */
export type PlanSku = "plus_monthly" | "plus_quarterly" | "plus_biannual" | "plus_yearly";

export const SKUS: Record<string, PlanSku> = {
  monthly: "plus_monthly",
  quarterly: "plus_quarterly",
  biannual: "plus_biannual",
  yearly: "plus_yearly",
};

type BillingApi = {
  available(): Promise<{ available: boolean }>;
  buy(options: { sku: string; type?: "subs" | "inapp"; payload?: string }): Promise<{ productId: string; token: string }>;
  restore(): Promise<{ productIds: string[] }>;
};

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  Plugins?: Record<string, unknown>;
};

function api(): BillingApi | null {
  if (typeof window === "undefined") return null;
  const capacitor = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  if (!capacitor?.isNativePlatform?.()) return null;
  const plugin = capacitor.Plugins?.Billing as BillingApi | undefined;
  return plugin ?? null;
}

export function billingPossible(): boolean {
  return api() !== null;
}

export async function billingAvailable(): Promise<boolean> {
  const plugin = api();
  if (!plugin) return false;
  try {
    const result = await plugin.available();
    return Boolean(result?.available);
  } catch {
    return false;
  }
}

export async function buyPlan(plan: string): Promise<{ productId: string; token: string }> {
  const plugin = api();
  const sku = SKUS[plan];
  if (!plugin || !sku) throw new Error("billing_unavailable");
  return plugin.buy({ sku, type: "subs", payload: `plan:${plan}` });
}

export async function restorePlan(): Promise<string[]> {
  const plugin = api();
  if (!plugin) return [];
  try {
    const result = await plugin.restore();
    return result?.productIds ?? [];
  } catch {
    return [];
  }
}

const PLAN_BY_SKU: Record<PlanSku, string> = {
  plus_monthly: "monthly",
  plus_quarterly: "quarterly",
  plus_biannual: "biannual",
  plus_yearly: "yearly",
};

/**
 * Asks Bazaar for active subscriptions and returns the plan name, if any.
 * Used on launch so a paying user keeps plus after a reinstall or a new phone.
 */
export async function restoreActivePlan(): Promise<string | null> {
  const productIds = await restorePlan();
  for (const id of productIds) {
    const plan = PLAN_BY_SKU[id as PlanSku];
    if (plan) return plan;
  }
  return null;
}
