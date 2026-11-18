# AI layer — off by default, one flag away

زبان‌یار was built so that adding AI to **any** surface later is a config change, not a
refactor. Today every flag is `false` and the app is complete without a model.

## The five pieces

| File | What it does |
|---|---|
| `src/lib/ai/client.ts` | the **only** model caller; server-side; OpenAI-compatible; never throws |
| `src/lib/ai/flags.ts` | one boolean per surface, all `false` |
| `src/lib/ai/events.ts` | typed event bus (`exercise_answered`, `mistake_made`, `lesson_finished`, …) |
| `src/lib/ai/useAi.ts` | `useAi(feature)` → `{ available, run, busy, error }` |
| `src/app/api/ai/*` | `hint`, `explain`, `example`, `chat`, `status` — rate limited per IP |

## Turning it on

```bash
# server only — never exposed to the browser
AI_API_KEY=...
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai   # Google AI Studio
AI_MODEL=gemini-2.0-flash
NEXT_PUBLIC_AI_ENABLED=1
```

Then flip the single flag you want in `src/lib/ai/flags.ts`:

```ts
export const aiFlags = {
  lessonHint: false,      // a nudge on the current exercise, never the answer
  explainMistake: false,  // "why was I wrong" in Persian
  generateExample: false, // one fresh example sentence per word
  conversation: false,    // phase 2 chat partner
  placementTest: false,   // adaptive entry test
  contentGenerator: false,// offline drafts into content/, human reviewed
};
```

`GET /api/ai/status` reports what is actually alive. With nothing configured it answers:

```json
{ "ok": true, "configured": false, "features": { "lessonHint": false, "…": false } }
```

## Non-negotiables

1. **A key never reaches the browser.** Every call goes through a route handler.
2. **Failure is invisible.** `client.ts` returns `null` on timeout, bad JSON, rate limit
   or missing key; `useAi` reports `available: false` and the static experience wins.
3. **No call on load.** Calls are user-triggered, debounced, cached by prompt, and
   rate limited (12/minute/IP).
4. **Content stays offline.** AI may draft exercises at build time via
   `scripts/gen-content.mjs`; a human reviews before publishing. The shipped lessons
   never depend on a live model.
5. **Schema already ready.** Every exercise carries optional `aiHints`
   (`example`, `simplify`, `distractors`, `explanation`) — filling them at runtime needs
   no schema change.

## How a surface gets added (example: hints)

```tsx
const ai = useAi("lessonHint");

{ai.available && (
  <button onClick={() => ai.run({ prompt: exercise.prompt, choices: exercise.choices })}>
    راهنمایی
  </button>
)}
```

Nothing else in the lesson knows AI exists, and if the call fails the button simply
shows nothing new.
