const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));

  const lockedState = async () => {
    const result = await page.evaluate(() => {
      const rows = [...document.querySelectorAll("main ol li")];
      return rows.slice(0, 4).map((row) => ({
        title: row.innerText.split("\n")[0].slice(0, 24),
        locked: Boolean(row.querySelector("svg.lucide-lock")),
        href: row.querySelector("a")?.getAttribute("href") ?? null,
      }));
    });
    return result;
  };

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const fresh = await lockedState();

  await page.evaluate(() => {
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 210,
        hearts: 5,
        heartsAt: 0,
        streak: 2,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons: { "a1-u1-hello-name": { stars: 3, accuracy: 1, xp: 180, at: Date.now() } },
        bosses: {},
        badges: [],
      }),
    );
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const after = await lockedState();
  await page.screenshot({ path: `${OUT}/22-unlock.png` });

  await page.goto(`${BASE}/app/lesson/a1-u1-from-jobs`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const chips = await page.evaluate(() => document.querySelector("main")?.innerText.slice(0, 400) ?? "");
  await page.screenshot({ path: `${OUT}/23-prereq-chips.png` });

  console.log(JSON.stringify({ fresh, after, hasChip: chips.includes("این درس روی این‌ها ساخته شده"), chips: chips.split("\n").slice(0, 8), errors }, null, 2));
  await browser.close();
})();
