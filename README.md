# زبان‌یار — English for Persian speakers

A gamified English app **and** its marketing site, in one Next.js repo. Persian, RTL,
mobile-first. Every lesson declares its prerequisites and 30–40% of its exercises come
from them, so the language forms a web instead of a stack of unrelated lessons.

## What is in here

| Area | Path | What it is |
|---|---|---|
| Marketing site | `src/app/page.tsx` | landing, features, pricing, FAQ |
| App | `src/app/app/*` | map, lesson runner, boss battle, profile, weekly view |
| Content | `src/content/a1/*.json` | 8 units · 32 lessons · 493 exercises |
| Content pipeline | `scripts/gen-content.mjs` | build-time generator for the JSON above |
| AI layer | `src/lib/ai/*`, `src/app/api/ai/*` | flags, client, events, `useAi`, routes |

## Numbers that are real

- 8 units, 32 lessons, **493 exercises**, 8 boss battles
- 8 game types: meaning, picture, listening, fill-the-blank, sentence building,
  match pairs, spot the mistake, speed round
- 0 image or audio assets to license: the fox is inline SVG, audio is the browser's
  speech engine

## Content model

```ts
Lesson {
  id, title, titleFa, goal,
  buildsOn: string[]        // prerequisite lessons → unlocking + interleaved review
  exercises: Exercise[]     // 8 kinds
  youCanSay: {en, fa}[]     // the "what you can now say" card
  tip?: { title, body }     // one rule, then practice
  xp
}
```

Every exercise may also carry `aiHints` (example / simplify / distractors / explanation).
Those fields are ignored today and filled at runtime later — adding AI never changes the
schema.

## AI-ready by construction, off by default

1. `lib/ai/client.ts` is the only model caller, server-side, OpenAI-compatible endpoint.
2. `lib/ai/flags.ts` gates each surface; all `false`.
3. `lib/ai/events.ts` is a typed bus every screen can emit to (answer, mistake, finish).
4. `useAi(feature)` returns `{ available, run, busy }`; when unavailable the static
   experience simply wins. A model failure cannot break a lesson.
5. Nothing is called on load: debounced, cached by prompt, rate-limited per IP.

Turning it on:

```bash
AI_API_KEY=...        # server only
AI_BASE_URL=...       # any OpenAI-compatible base, e.g. https://generativelanguage.googleapis.com/v1beta/openai
AI_MODEL=...
NEXT_PUBLIC_AI_ENABLED=1
```

…then flip the one flag for the surface you want in `src/lib/ai/flags.ts`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # next build --webpack
npm run content        # regenerate src/content/a1/*.json
npm run content:check  # 0 problems expected
```

Progress is stored in `localStorage` (`zabanyar.progress.v1`); hearts regenerate one per
15 minutes; stars are 95% / 80% accuracy thresholds; a lesson unlocks at ≥2 stars on its
prerequisites.

## Repo

https://github.com/MrFox2000/zabanyar

## Checks

- `npm run content:check` — 0 problems (schema, prerequisite graph, duplicate choices, token/answer match, 30–40% review share)
- `npm run lint` — clean
- `npm run build` — 47 routes prerendered
- end-to-end (Playwright): a full lesson with all 8 game types answered correctly →
  3 stars persisted; the unit boss played to victory; the weekly view recomputed from
  real timestamps.

## Deliberately honest

No fake leaderboard: the weekly view is computed from this device's real completion
timestamps, and the 30-person league is labelled as phase 2. No invented users, no
invented numbers.
