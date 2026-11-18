# Release checklist — زبان‌یار

Status: **ready to publish** (v1.0.0). Everything below was verified on the live
deployment, not just locally.

## What ships

| Piece | State |
|---|---|
| Content | A1 · A2 · B1 · B2 — 42 units, 168 lessons, **2601 exercises**, 42 boss battles |
| Teaching | every lesson opens with a teach deck (sound → word → sentence → rule) before any question |
| Games | 8 types, interleaved review from prerequisites, hearts, combos, confetti |
| Notebook | grouped level → chapter → lesson, search, sentences, tips, weak spots |
| Gamification | XP, streak, hearts, daily missions + chest, gems, skins shop, streak freeze, rank tiers |
| Onboarding | 3-screen intro + 8-question placement test that unlocks the level you already know |
| AI-ready | `/api/ai/status` returns all `false`; the app is complete without a model |
| PWA | manifest, 192/512 + maskable icons, installable |
| Docs | README, docs/TEACHING_MODEL.md, docs/GROWTH.md, this file |

## Verification (run before every release)

```bash
npm run content:check   # schema, prerequisites, duplicate choices, review share, ≤9-word sentences
npm run lint            # clean
npm run build           # 49+ routes
```

Browser sweep (Playwright, against the running app):

- every lesson page → HTTP 200 and its own title (**168/168**)
- every boss page → 200 (**42/42**)
- all main screens (`/`, `/app`, profile, league, notebook, shop, settings, start, share) → 200
- full playthroughs across levels (A1, A2, B1, B2 + a boss) → 3 stars, XP and gems saved
- zero console errors during the sweep

## Deploy

- Vercel, framework preset Next.js, build `npm run build` (`next build --webpack`), no env vars required.
- Optional: `NEXT_PUBLIC_SITE_URL` to force the canonical URL (otherwise Vercel's own
  production URL is used).
- AI (optional, off by default): `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`,
  `NEXT_PUBLIC_AI_ENABLED=1`, then flip a flag in `src/lib/ai/flags.ts`.
- Static export (no Node server): `npm run build:static` → `out/`.

## Known limits (honest list)

1. Audio is the browser's speech engine — quality varies by device; the settings page
   lets the learner pick a voice and explains what to do when nothing plays.
2. Progress lives in `localStorage`: it does not sync between devices yet.
3. No accounts, no payments: gems and skins are local, and nothing is gated behind money.
4. Leagues are a personal weekly view, not 30 real rivals — fake users are not shipped.
5. Five number words keep the emoji fallback (OpenMoji has no keycap glyphs).

## Licences

- Code: ours.
- Illustrations: OpenMoji, CC BY-SA 4.0 — attribution in `public/words/ATTRIBUTION.md`
  and on the settings screen.
- Font: Vazirmatn (SIL OFL) via Google Fonts.
- No other third-party assets.
