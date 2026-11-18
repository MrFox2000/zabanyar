# Growth: engagement, retention, monetisation

Research notes and the plan, kept short on purpose. Sources at the bottom.

## What the research says

- **Gamification works, but only when it is not the point.** Points, badges and
  leaderboards improve vocabulary outcomes, but the effect runs through autonomy,
  competence and relatedness — the learner must feel *in control*, *getting better*
  and *not alone* ([gamification + micro-interactions review](https://garuda.kemdiktisaintek.go.id/documents/detail/5965027),
  [reward interpretation study](https://dl.acm.org/doi/full/10.1145/3772318.3791046)).
- **Early retention decides everything.** If the first week does not hook, the
  subscription renewal never happens ([Singular](https://www.singular.net/es/blog/author/john/page/7/)).
- **Hybrid monetisation is the norm**: 35% of subscription apps mix ads + one-off
  purchases, 62% for games. Gate *convenience*, never the core learning —
  offline mode, extra practice, exam packs ([monetisation best practices](https://www.start.io/wp-content/uploads/2025/07/STR_Mobile-app-monetization-best-practices_V.1.0.pdf)).
- **Ads alone do not fund content** for small products; rewarded video / offer
  walls (watch to unlock a lesson pack) work far better than banners
  ([education offerwall](https://perkox.com/blog/education-apps-offerwall-monetization)).
- Duolingo's loop: hearts + streak + league + gems + quests + notifications +
  seasonal skins. Duo's clothes are pure cosmetics — they cost nothing to serve
  and never gate learning.

## What زبان‌یار will do (in build order)

| Phase | Feature | Why |
|---|---|---|
| 1 | Richer answer feedback: combo ladder, perfect-lesson badge, level-up animation, sound layers | moment-to-moment fun; cheapest retention win |
| 2 | Weekly league with real device history + rank tiers | competition without inventing users |
| 3 | Gems economy: daily chest, perfect-lesson bonus, streak milestones | a currency to spend on cosmetics, not on learning |
| 4 | Skins (lesson background, card frame, mascot outfit) bought with gems | self-expression, and the natural first paid item |
| 5 | Streak freeze + gentle reminder notification (web push later) | protects the streak, the strongest habit loop |
| 6 | Onboarding: 3 screens, goal picker, 3-minute placement test | first-session completion drives week-1 retention |
| 7 | Share card (image of stars/streak) + referral code | free acquisition channel |
| 8 | Monetisation, in this order: cosmetic packs → offline/exam pack → rewarded ad for a chest → subscription ("زبان‌یار پلاس") | value first, paywall on convenience |

## Non-negotiables

1. **Never gate learning behind money.** Free users get every lesson exercise.
2. **No fake users, no fake numbers.** Leagues rank real device history.
3. **No dark patterns**: no countdown timers on purchases, no auto-renew traps.
4. Skin packs must be licence-clean and drawn by us (or OpenMoji, CC BY-SA).

## Sources

- [Gamification elements & micro-interactions in language apps](https://garuda.kemdiktisaintek.go.id/documents/detail/5965027)
- [Virtual rewards and intrinsic motivation](https://dl.acm.org/doi/full/10.1145/3772318.3791046)
- [Mobile app monetization best practices (2025)](https://www.start.io/wp-content/uploads/2025/07/STR_Mobile-app-monetization-best-practices_V.1.0.pdf)
- [Early retention is everything](https://www.singular.net/es/blog/author/john/page/7/)
- [Rewarded offers for education apps](https://perkox.com/blog/education-apps-offerwall-monetization)
- [Duolingo's implicit-learning method](https://blog.duolingo.com/what-is-implicit-learning/)
