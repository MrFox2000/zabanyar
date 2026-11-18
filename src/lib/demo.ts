/**
 * Demo mode.
 *
 * Off: the app ships the whole course (42 units, 168 lessons) — required for the
 * store release, because the Android shell loads this deployment.
 * Turning it back on limits the public site to the first units.
 */
export const DEMO = false;

/** how many A2+ units to show; A1 shows DEMO_A1_UNITS */
export const DEMO_A1_UNITS = 2;
export const DEMO_OTHER_UNITS = 0;

export const DEMO_LABEL = "نسخهٔ نمایشی";

/**
 * Payment integration status. Until Poolakey (Bazaar) / Myket IAP is wired and a
 * server callback verifies receipts, the app must not offer a purchase button —
 * a store reviewer would treat it as a fake payment.
 */
export const PAYMENTS_READY = false;
