const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 430, height: 940 },
    deviceScaleFactor: 2,
    locale: "fa-IR",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 160)));

  const shot = (name, full = false) => page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  const go = async (path) => {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
  };

  await go("/");
  await shot("01-landing");
  await shot("01b-landing-full", true);

  await go("/app");
  await shot("02-map");

  await page.locator('a:has-text("سلام کردن")').first().click();
  await page.waitForTimeout(700);
  await shot("03-intro");

  await page.getByRole("button", { name: /شروع/ }).first().click();
  await page.waitForTimeout(700);
  await shot("04-question");

  // pick the first answer of the first exercise
  const clicked = await page.evaluate(() => {
    const main = document.querySelector("main");
    if (!main) return false;
    const buttons = [...main.querySelectorAll("button")].filter(
      (b) => !b.disabled && !b.getAttribute("aria-label") && !/ادامه|بررسی|شروع/.test(b.textContent || ""),
    );
    buttons[0]?.click();
    return Boolean(buttons[0]);
  });
  await page.waitForTimeout(600);
  await shot("05-feedback");

  // seed a believable amount of progress, then look at the reward surfaces
  await page.evaluate(() => {
    const lessons = {};
    const ids = [
      "a1-u1-hello-name",
      "a1-u1-from-jobs",
      "a1-u1-numbers-age",
      "a1-u1-polite",
      "a1-u2-family",
      "a1-u2-have-got",
      "a1-u2-describe",
    ];
    ids.forEach((id, i) => {
      lessons[id] = { stars: i % 3 === 0 ? 2 : 3, accuracy: 0.9, xp: 80, at: Date.now() - i * 3600_000 };
    });
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 640,
        hearts: 4,
        heartsAt: Date.now() - 9 * 60_000,
        streak: 4,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons,
        bosses: {},
        badges: [],
      }),
    );
  });

  await go("/app");
  await shot("06-map-progress");
  await page.getByRole("button", { name: /واحد ۲/ }).click();
  await page.waitForTimeout(400);
  await shot("07-map-unit2");

  await go("/app/profile");
  await shot("08-profile");
  await go("/app/league");
  await shot("09-league");

  await go("/app/boss/a1-u1");
  await shot("10-boss-intro");
  await page.getByRole("button", { name: /شروع نبرد/ }).click();
  await page.waitForTimeout(700);
  await shot("11-boss-fight");

  console.log(JSON.stringify({ clicked, errors }, null, 2));
  await browser.close();
})();

