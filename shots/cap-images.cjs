const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  // a lesson with concrete nouns, so the illustrations are the point
  await page.goto(`${BASE}/app/lesson/a1-u5-family`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/70-teach-images.png` });

  for (let step = 0; step < 6; step += 1) {
    if ((await page.getByRole("button", { name: /شروع تمرین/ }).count()) > 0) break;
    const next = page.getByRole("button", { name: /بعدی/ });
    if ((await next.count()) === 0) break;
    await next.first().click();
    await page.waitForTimeout(320);
  }
  await page.getByRole("button", { name: /شروع تمرین/ }).click();
  await page.waitForTimeout(700);

  // the picture exercise should show the illustration, not the emoji
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const text = await page.locator("main").innerText();
    if (text.includes("این تصویر")) break;
    const button = page.locator("main button").filter({ hasNotText: "دوباره" }).first();
    if ((await button.count()) === 0) break;
    await button.click();
    await page.waitForTimeout(300);
    if ((await page.locator("footer button").count()) > 0) {
      await page.locator("footer button").last().click();
      await page.waitForTimeout(300);
    }
  }
  await page.screenshot({ path: `${OUT}/71-picture-exercise.png` });

  console.log(JSON.stringify({ errors: errors.slice(0, 5) }, null, 2));
  await browser.close();
})();
