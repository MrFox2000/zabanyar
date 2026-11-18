/**
 * AI feature flags.
 *
 * Every AI surface in the app is listed here and **defaults to off**. Turning a
 * surface on later means flipping one boolean — no engine change, no refactor.
 * The app is complete without any of them.
 */
export const AI_FEATURES = [
  "lessonHint",
  "explainMistake",
  "generateExample",
  "conversation",
  "placementTest",
  "contentGenerator",
] as const;

export type AiFeature = (typeof AI_FEATURES)[number];

/** master switch, also mirrored in the API route so the browser cannot enable it */
export const aiFlags: Record<AiFeature, boolean> = {
  lessonHint: false,
  explainMistake: false,
  generateExample: false,
  conversation: false,
  placementTest: false,
  contentGenerator: false,
};

export function isAiEnabled(feature: AiFeature): boolean {
  return process.env.NEXT_PUBLIC_AI_ENABLED === "1" && aiFlags[feature] === true;
}
