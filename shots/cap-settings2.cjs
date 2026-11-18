const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app/settings`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/63-settings-voice2.png`, fullPage: true });

  // the mixed-script rule card that looked scrambled before
  await page.goto(`${BASE}/app/lesson/a1-u1-short-sounds`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(700);
  for (let step = 0; step < 12; step += 1) {
    if ((await page.getByRole("button", { name: /شروع تمرین/ }).count()) > 0) break;
    const next = page.getByRole("button", { name: /بعدی/ });
    if ((await next.count()) === 0) break;
    await next.first().click();
    await page.waitForTimeout(320);
  }
  await page.screenshot({ path: `${OUT}/62-rule-bidi2.png` });

  console.log(JSON.stringify({ errors }, null, 2));
  await browser.close();
})();
