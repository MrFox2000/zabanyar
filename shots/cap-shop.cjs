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
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 1750,
        hearts: 5,
        heartsAt: 0,
        streak: 6,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons: { "a1-u1-short-sounds": { stars: 3, accuracy: 1, xp: 190, at: Date.now() } },
        bosses: {},
        badges: [],
        daily: {
          day: new Date().toLocaleDateString("en-CA"),
          answered: 40,
          correct: 36,
          review: 8,
          xp: 320,
          lessons: 3,
          bossWins: 0,
          chestOpened: false,
        },
        mistakes: {},
        gems: 220,
        ownedSkins: ["classic"],
        activeSkin: "classic",
        freezes: 0,
      }),
    );
  });

  await page.goto(`${BASE}/app/shop`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/100-shop.png` });

  // buy the ocean skin and check it paints the map
  await page.getByRole("button", { name: /خرید با ۱۰۰ جم/ }).first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/101-shop-bought.png` });

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/102-map-skinned.png` });

  await page.goto(`${BASE}/app/league`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/103-league-rank.png` });

  const gems = await page.evaluate(() => JSON.parse(localStorage.getItem("zabanyar.progress.v1")).gems);
  const skin = await page.evaluate(() => JSON.parse(localStorage.getItem("zabanyar.progress.v1")).activeSkin);
  console.log(JSON.stringify({ gems, skin, errors }, null, 2));
  await browser.close();
})();
