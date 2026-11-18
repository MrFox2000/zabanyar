const { chromium } = require("playwright");

const BASE = "https://zabanyar-kappa.vercel.app";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 140)));

  await page.goto(`${BASE}/app/start`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع تعیین سطح/ }).click();
  await page.waitForTimeout(400);
  for (let index = 0; index < 8; index += 1) {
    await page.locator("main .grid button").first().click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: /بعدی/ }).click();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(500);
  const level = (await page.locator("main").innerText()).match(/از سطح (A1|A2|B1|B2)/)?.[1] ?? null;
  await page.getByRole("button", { name: /بریم سراغ درس/ }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/121-live-after-placement.png` });

  // open the first unlocked lesson and answer one question on production
  await page.locator("main a[href*='/app/lesson/']").first().click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/122-live-teach.png` });

  const storage = JSON.parse((await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"))) || "{}");
  console.log(
    JSON.stringify(
      {
        placementLevel: level,
        unlocked: Object.keys(storage.lessons || {}).length,
        teachDeckVisible: (await page.locator("main").innerText()).length > 60,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
