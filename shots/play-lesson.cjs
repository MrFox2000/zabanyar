const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";
const lessonId = process.argv[2] || "a1-u1-hello-name";
const contentRoot = "D:/Projects/zabanyar/src/content";

const lesson = fs
  .readdirSync(contentRoot)
  .flatMap((level) =>
    fs
      .readdirSync(`${contentRoot}/${level}`)
      .filter((file) => file.endsWith(".json"))
      .map((file) => JSON.parse(fs.readFileSync(`${contentRoot}/${level}/${file}`, "utf8"))),
  )
  .flatMap((unit) => unit.lessons)
  .find((item) => item.id === lessonId);

if (!lesson) {
  console.error(`lesson not found: ${lessonId}`);
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const log = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 200)));

  const click = async (text) => {
    await page.getByRole("button", { name: text, exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(140);
  };

  /** click the bank token with this exact text (bank tokens are not yet placed) */
  const clickBank = async (token) => {
    const index = await page.evaluate((value) => {
      const buttons = [...document.querySelectorAll('[data-bank="1"]')];
      return buttons.findIndex((button) => (button.textContent || "").trim() === value);
    }, token);
    if (index < 0) throw new Error(`no bank token for "${token}"`);
    await page.locator('[data-bank="1"]').nth(index).click({ timeout: 8000 });
    await page.waitForTimeout(140);
  };

  await page.goto(`${BASE}/app/lesson/${lesson.id}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(500);

  // walk the teaching deck — the exercises only exist after it
  for (let step = 0; step < 14; step += 1) {
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

  for (let index = 0; index < lesson.exercises.length; index += 1) {
    const exercise = lesson.exercises[index];
    log.push(`${index + 1}:${exercise.kind}`);
    try {
      if (["mcq", "imageWord", "listen", "fillBlank", "speed"].includes(exercise.kind)) {
        await page.getByRole("button", { name: exercise.choices[exercise.answer], exact: true }).first().click({ force: true });
        await page.waitForTimeout(120);
      } else if (exercise.kind === "spotError") {
        await click(exercise.words[exercise.answer]);
      } else if (exercise.kind === "wordOrder") {
        for (const token of exercise.answer.split(" ")) await clickBank(token);
        await page.getByRole("button", { name: "بررسی", exact: true }).click({ force: true });
      } else if (exercise.kind === "match") {
        for (const pair of exercise.pairs) {
          await click(pair.fa);
          await click(pair.en);
        }
      }

      await page.locator("footer").waitFor({ state: "visible", timeout: 8000 });
      const feedback = (await page.locator("footer").innerText()).split("\n")[0];
      log.push(`  -> ${feedback}`);
      await page.locator("footer button").last().click({ force: true });
      await page.waitForTimeout(220);
    } catch (error) {
      log.push(`  !! ${error.message.split("\n")[0]}`);
      await page.screenshot({ path: `${OUT}/error-${exercise.kind}.png` });
      break;
    }
  }

  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/13-lesson-done.png` });
  const main = await page.locator("main").innerText();
  const storage = JSON.parse((await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"))) || "{}");

  console.log(
    JSON.stringify(
      {
        lesson: lesson.id,
        sawDone: main.includes("درس تمام شد"),
        stars: storage.lessons?.[lesson.id]?.stars,
        xp: storage.xp,
        log,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
