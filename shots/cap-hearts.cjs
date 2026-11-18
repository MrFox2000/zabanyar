const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  const seed = { gems: 220, hearts: 3 };
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.evaluate((data) => {
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 1750,
        hearts: data.hearts,
        heartsAt: 0,
        streak: 6,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons: { "a1-u1-short-sounds": { stars: 3, accuracy: 1, xp: 190, at: Date.now() } },
        bosses: {},
        badges: [],
        daily: {
          day: new Date().toLocaleDateString("en-CA"),
          answered: 12,
          correct: 10,
          review: 2,
          xp: 120,
          lessons: 1,
          bossWins: 0,
          chestOpened: false,
        },
        mistakes: {},
        gems: data.gems,
        ownedSkins: ["classic"],
        activeSkin: "classic",
        freezes: 0,
        subscription: { plan: null, until: null },
      }),
    );
  }, seed);

  await page.goto(`${BASE}/app/shop`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/130-shop-hearts.png`, fullPage: true });

  await page.goto(`${BASE}/app/plus`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/131-plus.png`, fullPage: true });

  // empty hearts → the recovery screen
  await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("zabanyar.progress.v1"));
    raw.hearts = 0;
    raw.heartsAt = Date.now();
    localStorage.setItem("zabanyar.progress.v1", JSON.stringify(raw));
  });
  await page.goto(`${BASE}/app/lesson/a1-u1-spell-name`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(500);
  for (let step = 0; step < 12; step += 1) {
    if ((await page.getByRole("button", { name: /شروع تمرین/ }).count()) > 0) break;
    const next = page.getByRole("button", { name: /بعدی/ });
    if ((await next.count()) === 0) break;
    await next.first().click();
    await page.waitForTimeout(200);
  }
  if ((await page.getByRole("button", { name: /شروع تمرین/ }).count()) > 0) {
    await page.getByRole("button", { name: /شروع تمرین/ }).click();
    await page.waitForTimeout(400);
  }
  const buttons = page.locator("main .grid button, main button");
  await buttons.last().click();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/132-no-hearts.png` });

  console.log(JSON.stringify({ errors }, null, 2));
  await browser.close();
})();
