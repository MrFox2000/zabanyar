const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";
const lesson = JSON.parse(fs.readFileSync("D:/Projects/zabanyar/src/content/a1/unit-02.json", "utf8")).lessons[0];

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app/lesson/${lesson.id}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(600);

  const first = lesson.exercises[0];
  await page.getByRole("button", { name: first.choices[first.answer], exact: true }).first().click();
  await page.waitForTimeout(280);
  await page.screenshot({ path: `${OUT}/43-xp-float.png` });

  await page.locator("footer button").last().click();
  await page.waitForTimeout(500);

  const second = lesson.exercises[1];
  const wrong = second.choices[(second.answer + 1) % second.choices.length];
  await page.getByRole("button", { name: wrong, exact: true }).first().click();
  await page.waitForTimeout(280);
  await page.screenshot({ path: `${OUT}/44-heart-float.png` });

  console.log(JSON.stringify({ errors }, null, 2));
  await browser.close();
})();
