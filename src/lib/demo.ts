/**
 * Demo mode.
 *
 * The public site is a portfolio demo: only the first units are playable, so the
 * full course stays something to show to clients rather than give away. The whole
 * app is unchanged — flipping DEMO to false restores every level.
 */
export const DEMO = true;

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
