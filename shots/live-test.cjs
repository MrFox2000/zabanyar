const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "https://zabanyar-kappa.vercel.app";
const OUT = "D:/Projects/zabanyar/shots";
const lesson = JSON.parse(fs.readFileSync("D:/Projects/zabanyar/src/content/a1/unit-01.json", "utf8")).lessons[0];

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 140)));
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().includes("__PAGE__")) errors.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/live-01-landing.png` });

  await page.getByRole("link", { name: /شروع رایگان/ }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/live-02-map.png` });

  await page.goto(`${BASE}/app/lesson/${lesson.id}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(600);

  for (let index = 0; index < 4; index += 1) {
    const exercise = lesson.exercises[index];
    if (["mcq", "imageWord", "listen", "fillBlank", "speed"].includes(exercise.kind)) {
      await page.getByRole("button", { name: exercise.choices[exercise.answer], exact: true }).first().click();
    } else if (exercise.kind === "spotError") {
      await page.getByRole("button", { name: exercise.words[exercise.answer], exact: true }).first().click();
    } else if (exercise.kind === "wordOrder") {
      for (const token of exercise.answer.split(" ")) {
        await page.getByRole("button", { name: token, exact: true }).first().click({ timeout: 5000 });
      }
      await page.getByRole("button", { name: "بررسی", exact: true }).click();
    } else if (exercise.kind === "match") {
      for (const pair of exercise.pairs) {
        await page.getByRole("button", { name: pair.fa, exact: true }).first().click();
        await page.getByRole("button", { name: pair.en, exact: true }).first().click();
      }
    }
    await page.waitForTimeout(300);
    await page.locator("footer button").last().click();
    await page.waitForTimeout(320);
  }

  await page.screenshot({ path: `${OUT}/live-03-lesson.png` });
  const storage = await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"));

  console.log(JSON.stringify({ saved: Boolean(storage), errors: errors.slice(0, 6) }, null, 2));
  await browser.close();
})();
