# How زبان‌یار teaches (research → design)

Written after the first user test said the app *tests* but does not *teach*. Short version:
they were right, and the fix is a real teaching layer, not more exercises.

## What Duolingo actually does

From Duolingo's own material ([implicit learning](https://blog.duolingo.com/what-is-implicit-learning/),
[the teaching method](https://blog.duolingo.com/duolingo-teaching-method/)):

1. **Implicit first.** Learners interact with new material in the very first exercise of the
   first lesson. Exercises are designed so the new information is *visible* while you answer —
   recognition before production.
2. **Explicit instruction exists, but lives outside the drill**: unit guidebooks, section
   overviews, "tips & notes". Rules are there for the learner who wants them, not as a gate.
3. **Mistakes are the mechanism.** Immediate feedback plus the correct answer; the learner
   updates their hypothesis. A wrong answer is followed by seeing/hearing the right one.
4. **One new thing at a time.** A lesson introduces a handful of words or exactly one
   structure; the rest is re-combination of known material.
5. **Scaffolding fades.** Early exercises in a lesson are heavily supported (image + audio +
   translation all present); later ones ask for production with nothing to lean on.

Research consensus beyond Duolingo: worked examples + guided practice beat discovery for
absolute beginners; explicit rules help *before* practice for adults; pronunciation needs
audio for full sentences, not isolated words.

## What زبان‌یار does now

Each lesson is a **four-beat loop**, not a quiz:

| Beat | Screen | What the learner gets |
|---|---|---|
| 1. Teach | 6–10 cards: sound → words → one real sentence → the rule | image + English + Persian + audio, auto-played, with slow replay |
| 2. Guided practice | the first exercises, answers visible in the material just shown | recognition, not recall |
| 3. Practice | 8 game types, interleaved review from prerequisites | production, with hearts/combos |
| 4. Recap | "what you can now say" + saved to the notebook | consolidation |

### The teaching cards (`lesson.teach`)

```ts
TeachStep =
  | { kind: "letter", letter, sound, word, wordFa, emoji }   // unit 1: a /æ/ → cat
  | { kind: "word", en, fa, emoji }                            // word + picture + audio
  | { kind: "sentence", en, fa, highlight? }                    // a full sentence, spoken
  | { kind: "rule", title, body, examples[] }                    // one rule, two examples
```

- Letters come first for absolute beginners: the alphabet unit teaches **sounds**, not sentences.
- Every card auto-speaks; every English string has a replay and a slow replay.
- The rule card is generated from the lesson's own `tip`, with the lesson's real sentences as
  examples — no generic textbook copy.

### Feedback is a teaching moment

On a wrong answer the bar now shows **درستش: …** with a speaker button, so the learner hears
the correct form immediately. On a correct answer the guide character celebrates, a burst of
stars plays and the XP floats up.

### Characters

Nine characters, all original SVG, each with idle/happy/cheer/sad moods:
فاکسی · سارا · مریم (hijab) · آرش (boy) · آقای کریمی (moustache) · ننه‌جان (grandmother) ·
پیشی · پاندا · جغد. Every lesson has a fixed guide, and the guide stands in the corner of the
exercise screen reacting to each answer.

## Still to do

- Real recorded or cloud-TTS audio (browser voices vary by device)
- Speech practice: record the learner and compare, like Duolingo's speaking exercises
- Adaptive difficulty from the event bus (already emitted, not yet consumed)
- Level test to place a learner in the right unit
