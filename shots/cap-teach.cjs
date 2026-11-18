const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app/lesson/a1-u1-short-sounds`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/50-teach-letter.png` });

  // walk the deck until the practice button shows up
  for (let step = 0; step < 12; step += 1) {
    const done = await page.getByRole("button", { name: /شروع تمرین/ }).count();
    if (done > 0) break;
    const next = page.getByRole("button", { name: /بعدی/ });
    if ((await next.count()) === 0) break;
    if (step === 5) await page.screenshot({ path: `${OUT}/51-teach-word.png` });
    if (step === 8) await page.screenshot({ path: `${OUT}/52-teach-rule.png` });
    await next.first().click();
    await page.waitForTimeout(420);
  }
  await page.screenshot({ path: `${OUT}/52b-teach-rule.png` });
  await page.getByRole("button", { name: /شروع تمرین/ }).click();
  await page.waitForTimeout(700);

  // pick the wrong answer on the first exercise to see guide + correct answer
  const first = page.locator("main button").nth(2);
  await first.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/53-guide-reaction.png` });

  console.log(JSON.stringify({ errors }, null, 2));
  await browser.close();
})();
