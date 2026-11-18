# Illustrations

The word pictures in `/public/words` come from **[OpenMoji](https://openmoji.org/)** —
the open-source emoji set by the HfG Schwäbisch Gmünd.

- Source: https://github.com/hfg-gmuend/openmoji (`color/svg`)
- Licence: **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/
- Downloaded and renamed by `scripts/fetch-word-images.mjs`, committed to the repo so
  the app never needs network access for them.

Because the licence is share-alike, these SVG files stay under CC BY-SA 4.0 and the
attribution must stay visible in the product (it is shown in **تنظیمات صدا** and in
this file). The app code around them is unaffected.

If a word has no OpenMoji equivalent, the app falls back to the emoji stored in the
lesson content, and new pictures should be drawn in the same flat, thick-outline style
so the set stays consistent.
