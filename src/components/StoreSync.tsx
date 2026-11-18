"use client";

import { useEffect } from "react";
import { billingPossible, restoreActivePlan } from "@/lib/billing";
import { activatePlus, isPlus } from "@/lib/store/progress";
import { getSession } from "@/lib/account";
import { reconcile } from "@/lib/sync";

/**
 * On launch inside the Bazaar app, ask the store which subscriptions are active
 * and turn plus back on. Runs once, only when a native billing plugin exists.
 */
export function StoreSync() {
  useEffect(() => {
    // a logged-in learner may have played offline: merge at launch
    const session = getSession();
    if (session) {
      reconcile(session).catch(() => undefined);
    }

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
