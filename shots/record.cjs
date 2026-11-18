const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots/video";
const lesson = JSON.parse(fs.readFileSync("D:/Projects/zabanyar/src/content/a1/unit-01.json", "utf8")).lessons[0];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 480, height: 900 },
    deviceScaleFactor: 2,
    locale: "fa-IR",
    recordVideo: { dir: OUT, size: { width: 960, height: 1800 } },
  });
  const page = await context.newPage();
  const wait = (ms) => page.waitForTimeout(ms);

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await wait(1500);
  await page.mouse.wheel(0, 500);
  await wait(1200);
  await page.mouse.wheel(0, 700);
  await wait(1500);

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await wait(1400);

  await page.goto(`${BASE}/app/lesson/${lesson.id}`, { waitUntil: "networkidle" });
  await wait(1200);
  await page.getByRole("button", { name: /شروع/ }).first().click();
  await wait(900);

  const click = async (text) => {
    await page.getByRole("button", { name: text, exact: true }).first().click({ timeout: 8000 });
    await wait(650);
  };

  for (let index = 0; index < 6; index += 1) {
    const exercise = lesson.exercises[index];
    if (["mcq", "imageWord", "listen", "fillBlank", "speed"].includes(exercise.kind)) {
      await click(exercise.choices[exercise.answer]);
    } else if (exercise.kind === "spotError") {
      await click(exercise.words[exercise.answer]);
    } else if (exercise.kind === "wordOrder") {
      for (const token of exercise.answer.split(" ")) await click(token);
      await click("بررسی");
    } else if (exercise.kind === "match") {
      for (const pair of exercise.pairs) {
        await click(pair.en);
        await click(pair.fa);
      }
    }
    await wait(700);
    await page.locator("footer").waitFor({ state: "visible", timeout: 8000 });
    await page.locator("footer button").last().click();
    await wait(700);
  }

  // jump to the reward screen by finishing the remaining exercises quickly
  for (let index = 6; index < lesson.exercises.length; index += 1) {
    const exercise = lesson.exercises[index];
    if (["mcq", "imageWord", "listen", "fillBlank", "speed"].includes(exercise.kind)) {
      await page.getByRole("button", { name: exercise.choices[exercise.answer], exact: true }).first().click();
    } else if (exercise.kind === "spotError") {
      await page.getByRole("button", { name: exercise.words[exercise.answer], exact: true }).first().click();
    }
    await wait(300);
    await page.locator("footer button").last().click();
    await wait(300);
  }

  await wait(2600);
  await page.mouse.wheel(0, 300);
  await wait(1600);

  await page.goto(`${BASE}/app/boss/a1-u1`, { waitUntil: "networkidle" });
  await wait(1400);
  await page.getByRole("button", { name: /شروع نبرد/ }).click();
  await wait(1500);

  await page.goto(`${BASE}/app/league`, { waitUntil: "networkidle" });
  await wait(2000);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".webm"));
  console.log(JSON.stringify(files));
})();
