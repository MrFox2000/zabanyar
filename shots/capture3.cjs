const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const lessons = {
      "a1-u1-hello-name": { stars: 3, accuracy: 1, xp: 180, at: Date.now() },
      "a1-u2-family": { stars: 2, accuracy: 0.85, xp: 150, at: Date.now() },
    };
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 330,
        hearts: 4,
        heartsAt: Date.now(),
        streak: 3,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons,
        bosses: {},
        badges: [],
        daily: {
          day: new Date().toLocaleDateString("en-CA"),
          answered: 12,
          correct: 9,
          review: 2,
          xp: 90,
          lessons: 2,
          bossWins: 0,
          chestOpened: false,
        },
      }),
    );
  });

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/30-map-missions.png` });

  await page.goto(`${BASE}/app/notebook`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/31-notebook-words.png` });
  await page.getByRole("button", { name: /نکته/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/32-notebook-tips.png` });

  await page.goto(`${BASE}/app/lesson/a1-u2-have-got`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/33-lesson-intro-character.png` });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(700);

  // answer the first (mcq) exercise correctly to see the reaction
  const lesson = JSON.parse(
    require("fs").readFileSync("D:/Projects/zabanyar/src/content/a1/unit-02.json", "utf8"),
  ).lessons.find((item) => item.id === "a1-u2-have-got");
  const first = lesson.exercises[0];
  await page.getByRole("button", { name: first.choices[first.answer], exact: true }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/34-correct-reaction.png` });
  await page.locator("footer button").last().click();
  await page.waitForTimeout(400);

  // and a wrong answer on the next exercise
  const second = lesson.exercises[1];
  const wrongChoice = second.choices[(second.answer + 1) % second.choices.length];
  await page.getByRole("button", { name: wrongChoice, exact: true }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/35-wrong-reaction.png` });

  console.log(JSON.stringify({ errors }, null, 2));
  await browser.close();
})();
