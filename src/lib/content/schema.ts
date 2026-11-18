import { z } from "zod";

/**
 * زبان‌یار content schema.
 *
 * Two rules matter more than everything else here:
 *   1. every lesson declares `buildsOn` — the prerequisite lessons it re-uses.
 *   2. every exercise may carry `aiHints` — fields ignored today, filled by AI
 *      later. Adding AI must never require a schema change.
 */

export const aiHintsSchema = z
  .object({
    example: z.string().optional(),
    simplify: z.string().optional(),
    distractors: z.array(z.string()).optional(),
    explanation: z.string().optional(),
  })
  .optional();

export type AiHints = z.infer<typeof aiHintsSchema>;

const id = z
  .string()
  .regex(/^[a-z0-9][a-z0-9.-]*$/, "ids are lowercase, digits, dots and dashes");

const base = {
  id,
  prompt: z.string().min(1),
  promptFa: z.string().optional(),
  /** set when the exercise re-uses an earlier lesson (interleaved review) */
  reviewOf: id.optional(),
  aiHints: aiHintsSchema,
};

export const exerciseSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("mcq"),
    ...base,
    choices: z.array(z.string()).min(2).max(5),
    answer: z.number().int().min(0),
    speak: z.string().optional(),
  }),
  z.object({
    kind: z.literal("imageWord"),
    ...base,
    emoji: z.string().min(1),
    choices: z.array(z.string()).min(2).max(4),
    answer: z.number().int().min(0),
    speak: z.string().optional(),
  }),
  z.object({
    kind: z.literal("listen"),
    ...base,
    speak: z.string().min(1),
    choices: z.array(z.string()).min(2).max(4),
    answer: z.number().int().min(0),
  }),
  z.object({
    kind: z.literal("fillBlank"),
    ...base,
    sentence: z.string().includes("___"),
    choices: z.array(z.string()).min(2).max(4),
    answer: z.number().int().min(0),
  }),
  z.object({
    kind: z.literal("wordOrder"),
    ...base,
    tokens: z.array(z.string()).min(2).max(9),
    answer: z.string().min(1),
  }),
  z.object({
    kind: z.literal("match"),
    ...base,
    pairs: z.array(z.object({ en: z.string(), fa: z.string() })).min(3).max(6),
  }),
  z.object({
    kind: z.literal("spotError"),
    ...base,
    words: z.array(z.string()).min(4).max(10),
    answer: z.number().int().min(0),
    fix: z.string().min(1),
  }),
  z.object({
    kind: z.literal("speed"),
    ...base,
    choices: z.array(z.string()).length(2),
    answer: z.number().int().min(0),
    ms: z.number().int().min(3000).max(15000).default(6000),
    speak: z.string().optional(),
  }),
]);

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseKind = Exercise["kind"];

/** one word/phrase the lesson teaches — this is what the notebook collects */
export const vocabSchema = z.object({
  en: z.string().min(1),
  fa: z.string().min(1),
  emoji: z.string().optional(),
  note: z.string().optional(),
});

export type Vocab = z.infer<typeof vocabSchema>;

export const lessonSchema = z.object({
  id,
  title: z.string().min(1),
  titleFa: z.string().min(1),
  goal: z.string().min(1),
  /** prerequisite lesson ids; drives unlocking and the review mix */
  buildsOn: z.array(id).default([]),
  exercises: z.array(exerciseSchema).min(6),
  /** the words and phrases this lesson teaches (notebook source) */
  vocab: z.array(vocabSchema).default([]),
  /** the "what you can now say" card at the end */
  youCanSay: z.array(z.object({ en: z.string(), fa: z.string() })).min(1),
  /** one grammar rule shown before practice — application over theory */
  tip: z.object({ title: z.string(), body: z.string() }).optional(),
  xp: z.number().int().min(10).default(40),
});

export type Lesson = z.infer<typeof lessonSchema>;

export const bossSchema = z.object({
  id,
  titleFa: z.string().min(1),
  hp: z.number().int().min(5).default(10),
  seconds: z.number().int().min(30).default(120),
  exercises: z.array(exerciseSchema).min(8),
  rewardXp: z.number().int().min(50).default(120),
});

export type Boss = z.infer<typeof bossSchema>;

export const unitSchema = z.object({
  id,
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  index: z.number().int().min(1),
  titleFa: z.string().min(1),
  titleEn: z.string().min(1),
  theme: z.enum(["orange", "coral", "mint", "sky", "gold"]).default("orange"),
  lessons: z.array(lessonSchema).min(1),
  boss: bossSchema,
});

export type Unit = z.infer<typeof unitSchema>;
export type Level = Unit["level"];

export const STARS_FOR: { three: number; two: number } = { three: 0.95, two: 0.8 };

export function starsFor(accuracy: number): 1 | 2 | 3 {
  if (accuracy >= STARS_FOR.three) return 3;
  if (accuracy >= STARS_FOR.two) return 2;
  return 1;
}
