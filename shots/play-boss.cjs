const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";
const unit = JSON.parse(fs.readFileSync("D:/Projects/zabanyar/src/content/a1/unit-01.json", "utf8"));
const boss = unit.boss;

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));

  const click = async (text) => {
    await page.getByRole("button", { name: text, exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(120);
  };

  await page.goto(`${BASE}/app/boss/${unit.id}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /شروع نبرد/ }).click();
  await page.waitForTimeout(500);

  let hits = 0;
  for (let i = 0; i < boss.hp; i += 1) {
    const exercise = boss.exercises[i % boss.exercises.length];
    if (exercise.kind === "speed" || exercise.kind === "mcq" || exercise.kind === "listen" || exercise.kind === "imageWord") {
      await click(exercise.choices[exercise.answer]);
    }
    await page.locator("footer").waitFor({ state: "visible", timeout: 6000 });
    hits += 1;
    await page.locator("footer button").last().click();
    await page.waitForTimeout(200);
  }

  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/15-boss-win.png` });
  const bossText = await page.locator("main").innerText();
  const storage = JSON.parse((await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"))) || "{}");

  for (const [path, name] of [
    ["/app/profile", "16-profile"],
    ["/app/league", "17-league"],
    ["/app", "18-map-final"],
    ["/", "19-landing"],
  ]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${name}.png` });
  }

  console.log(JSON.stringify({ hits, won: bossText.includes("بردی"), bosses: storage.bosses, xp: storage.xp, errors }, null, 2));
  await browser.close();
})();
