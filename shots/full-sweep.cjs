const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3000";
const ROOT = "D:/Projects/zabanyar/src/content";

const levels = fs.readdirSync(ROOT);
const units = levels.flatMap((level) =>
  fs
    .readdirSync(`${ROOT}/${level}`)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ level, unit: JSON.parse(fs.readFileSync(`${ROOT}/${level}/${file}`, "utf8")) })),
);

const lessons = units.flatMap(({ level, unit }) => unit.lessons.map((lesson) => ({ level, unit, lesson })));

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 140)));

  const broken = [];
  for (const { level, unit, lesson } of lessons) {
    const response = await page.goto(`${BASE}/app/lesson/${lesson.id}`, { waitUntil: "domcontentloaded" });
    const text = await page.locator("main").innerText().catch(() => "");
    if (response.status() !== 200 || !text.includes(lesson.titleFa)) {
      broken.push(`${lesson.id}: status ${response.status()} title=${text.includes(lesson.titleFa)}`);
    }
  }

  // bosses and the main screens must load too
  const screens = ["/app", "/app/profile", "/app/league", "/app/notebook", "/app/shop", "/app/settings", "/app/start", "/"];
  const screenStatus = {};
  for (const path of screens) {
    const response = await page.goto(BASE + path, { waitUntil: "networkidle" });
    screenStatus[path] = response.status();
  }

  let bosses = 0;
  for (const { unit } of units) {
    const response = await page.goto(`${BASE}/app/boss/${unit.id}`, { waitUntil: "domcontentloaded" });
    if (response.status() === 200) bosses += 1;
  }

  console.log(
    JSON.stringify(
      {
        levels,
        units: units.length,
        lessons: lessons.length,
        brokenPages: broken.slice(0, 10),
        brokenCount: broken.length,
        screenStatus,
        bossesOk: bosses,
        errors: errors.slice(0, 5),
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
