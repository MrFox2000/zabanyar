const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const lessons = {
      "a1-u1-short-sounds": { stars: 3, accuracy: 1, xp: 190, at: Date.now() },
      "a1-u2-to-be": { stars: 2, accuracy: 0.85, xp: 160, at: Date.now() },
      "a1-u5-family": { stars: 3, accuracy: 0.96, xp: 200, at: Date.now() },
      "a2-u1-story-past": { stars: 2, accuracy: 0.8, xp: 180, at: Date.now() },
    };
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 730,
        hearts: 4,
        heartsAt: Date.now(),
        streak: 5,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons,
        bosses: {},
        badges: [],
        daily: {
          day: new Date().toLocaleDateString("en-CA"),
          answered: 30,
          correct: 24,
          review: 4,
          xp: 200,
          lessons: 4,
          bossWins: 0,
          chestOpened: false,
        },
        mistakes: {
          "a2-u1-story-past": { count: 6, at: Date.now() },
          "a1-u2-to-be": { count: 3, at: Date.now() },
        },
      }),
    );
  });

  await page.goto(`${BASE}/app/notebook`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/80-notebook-grouped.png` });

  await page.getByRole("button", { name: /ضعف/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/81-notebook-weak.png` });

  await page.getByRole("button", { name: /نکته/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/82-notebook-tips.png` });

  // the A2 tab on the map
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "A2", exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/83-map-a2.png` });

  console.log(JSON.stringify({ errors }, null, 2));
  await browser.close();
})();
