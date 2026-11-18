const { chromium } = require("playwright");

/** quick visual check: 6 screenshots of زبان‌یار into D:\Projects\zabanyar\shots */
(async () => {
  const out = "D:/Projects/zabanyar/shots";
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

  const shot = async (url, name, full = false) => {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: full });
    console.log("shot", name);
  };

  await shot("http://127.0.0.1:3000/", "01-landing");
  await shot("http://127.0.0.1:3000/app", "02-map");
  await page.goto("http://127.0.0.1:3000/app", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /سلام کردن/ }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/03-intro.png` });
  await page.getByRole("button", { name: /شروع/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/04-question.png` });

  // answer the first exercise correctly-ish and look at the feedback bar
  await page.locator("main button").filter({ hasNotText: "بازگشت" }).nth(0).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/05-feedback.png` });
  console.log(JSON.stringify({ errors: errors.slice(0, 12) }, null, 2));
  await browser.close();
})();
