"use client";

import { useEffect } from "react";
import { billingPossible, restoreActivePlan } from "@/lib/billing";
import { activatePlus, isPlus } from "@/lib/store/progress";

/**
 * On launch inside the Bazaar app, ask the store which subscriptions are active
 * and turn plus back on. Runs once, only when a native billing plugin exists.
 */
export function StoreSync() {
  useEffect(() => {
    if (!billingPossible() || isPlus()) return;
    let cancelled = false;

    restoreActivePlan()
      .then((plan) => {
        if (!cancelled && plan) activatePlus(plan as "monthly" | "quarterly" | "biannual" | "yearly");
      })
      .catch(() => {
        /* no subscription — nothing to restore */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
