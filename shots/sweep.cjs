const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3100";
const OUT = "D:/Projects/zabanyar/shots";
const contentDir = "D:/Projects/zabanyar/src/content/a1";

const units = fs
  .readdirSync(contentDir)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => JSON.parse(fs.readFileSync(`${contentDir}/${file}`, "utf8")));

const lessons = units.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })));

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`${page.url()} :: ${error.message.slice(0, 120)}`));

  // 1. every lesson page must render with its own title
  const bad = [];
  for (const { lesson } of lessons) {
    const response = await page.goto(`${BASE}/app/lesson/${lesson.id}`, { waitUntil: "domcontentloaded" });
    const text = await page.locator("main").innerText().catch(() => "");
    if (response.status() !== 200 || !text.includes(lesson.titleFa)) {
      bad.push(`${lesson.id}: status ${response.status()} titleFound=${text.includes(lesson.titleFa)}`);
    }
  }

  // 2. play three lessons from three different units, end to end
  const sample = ["a1-u1-hello-name", "a1-u4-cafe", "a1-u8-was-were"];
  const played = [];

  const click = async (text) => {
    await page.getByRole("button", { name: text, exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(110);
  };

  for (const id of sample) {
    const entry = lessons.find((item) => item.lesson.id === id);
    const lesson = entry.lesson;
    await page.goto(`${BASE}/app/lesson/${id}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /شروع/ }).first().click();
    await page.waitForTimeout(350);

    let answered = 0;
    for (let index = 0; index < lesson.exercises.length; index += 1) {
      const exercise = lesson.exercises[index];
      try {
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
        await page.locator("footer").waitFor({ state: "visible", timeout: 8000 });
        await page.locator("footer button").last().click();
        await page.waitForTimeout(150);
        answered += 1;
      } catch (error) {
        errors.push(`${id} exercise ${index + 1} (${exercise.kind}): ${error.message.split("\n")[0]}`);
        break;
      }
    }

    await page.waitForTimeout(900);
    const done = (await page.locator("main").innerText()).includes("درس تمام شد");
    played.push({ id, exercises: lesson.exercises.length, answered, done });
  }

  const storage = JSON.parse((await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"))) || "{}");
  await page.screenshot({ path: `${OUT}/25-sweep-last.png` });

  const aiStatus = await fetch(`${BASE}/api/ai/status`).then((response) => response.json());

  console.log(
    JSON.stringify(
      {
        lessonPages: lessons.length,
        pagesBroken: bad,
        played,
        savedLessons: Object.keys(storage.lessons || {}).length,
        xp: storage.xp,
        aiStatus,
        errors: errors.slice(0, 8),
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
