const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app/start`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/110-onboarding.png` });

  await page.getByRole("button", { name: /شروع تعیین سطح/ }).click();
  await page.waitForTimeout(500);

  const total = 8;
  for (let index = 0; index < total; index += 1) {
    const buttons = page.locator("main .grid button");
    await buttons.first().click();
    await page.waitForTimeout(200);
    if (index === 2) await page.screenshot({ path: `${OUT}/111-placement-q.png` });
    await page.getByRole("button", { name: /بعدی/ }).click();
    await page.waitForTimeout(250);
  }

  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/112-placement-result.png` });
  const resultText = await page.locator("main").innerText();

  await page.getByRole("button", { name: /بریم سراغ درس/ }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/113-map-after-placement.png` });
  const storage = JSON.parse((await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"))) || "{}");
  const unlocked = Object.keys(storage.lessons || {}).length;

  console.log(
    JSON.stringify(
      {
        sawResult: resultText.includes("شروع کن"),
        level: resultText.match(/از سطح (A1|A2|B1|B2)/)?.[1] ?? null,
        unlockedLessons: unlocked,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
