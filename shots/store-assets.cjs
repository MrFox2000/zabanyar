const { chromium } = require("playwright");
const fs = require("fs");

/**
 * Store assets: the icon, the feature graphic and captioned phone screenshots
 * that Café Bazaar and Myket ask for.
 */
const BASE = "http://localhost:3000";
const OUT = "D:/Projects/zabanyar/store";

fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  { path: "/", name: "01-landing", caption: "هر درس روی درس‌های قبلی ساخته می‌شود" },
  { path: "/app", name: "02-map", caption: "۸ سطح، ۴۲ واحد و ۱۶۸ درس" },
  { path: "/app/lesson/a1-u1-short-sounds", name: "03-teach", caption: "اول آموزش، بعد تمرین — با صدا و تصویر" },
  { path: "/app/notebook", name: "04-notebook", caption: "دفتر من: کلمه‌ها، جمله‌ها و نکته‌ها یک‌جا" },
  { path: "/app/shop", name: "05-shop", caption: "جم و اسکین — فقط با یادگیری" },
  { path: "/app/plus", name: "06-plus", caption: "پلاس: جان بی‌نهایت و همهٔ درس‌ها باز" },
];

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });

  // ── screenshots at store size (1080×1920 CSS 360×640 @3x) ────────────
  const phone = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, locale: "fa-IR" });
  const page = await phone.newPage();
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.setItem(
      "zabanyar.progress.v1",
      JSON.stringify({
        v: 1,
        xp: 1750,
        hearts: 2,
        heartsAt: Date.now(),
        streak: 6,
        lastDay: new Date().toLocaleDateString("en-CA"),
        lessons: {
          "a1-u1-short-sounds": { stars: 3, accuracy: 1, xp: 190, at: Date.now() },
          "a1-u1-spell-name": { stars: 2, accuracy: 0.85, xp: 170, at: Date.now() },
          "a1-u2-to-be": { stars: 3, accuracy: 0.96, xp: 200, at: Date.now() },
        },
        bosses: {},
        badges: [],
        daily: {
          day: new Date().toLocaleDateString("en-CA"),
          answered: 24,
          correct: 20,
          review: 4,
          xp: 260,
          lessons: 3,
          bossWins: 0,
          chestOpened: false,
        },
        mistakes: {},
        gems: 220,
        ownedSkins: ["classic"],
        activeSkin: "classic",
        freezes: 0,
        subscription: { plan: null, until: null },
      }),
    );
  });

  for (const shot of SHOTS) {
    await page.goto(BASE + shot.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${shot.name}.png` });
    console.log("shot", shot.name);
  }
  await phone.close();

  // ── icon 512 and feature graphic 1024×500 ────────────────────────────
  const gfx = await browser.newContext({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 });
  const g = await gfx.newPage();

  await g.setContent(`
    <html><body style="margin:0;background:#f97316;display:flex;align-items:center;justify-content:center;height:500px;font-family:sans-serif">
      <div style="text-align:center;color:#fff">
        <div style="font-size:64px;font-weight:800">🦊 زبان‌یار</div>
        <div style="font-size:26px;margin-top:12px;opacity:.95">انگلیسی، بازی‌وار و پیوسته — A1 تا B2</div>
      </div>
    </body></html>
  `);
  await g.screenshot({ path: `${OUT}/feature-graphic-1024x500.png` });

  await g.setViewportSize({ width: 512, height: 512 });
  const svg = fs.readFileSync("D:/Projects/zabanyar/public/icon-512.png");
  await g.setContent(`
    <html><body style="margin:0">
      <img src="data:image/png;base64,${svg.toString("base64")}" width="512" height="512" style="display:block" />
    </body></html>
  `);
  await g.screenshot({ path: `${OUT}/icon-512.png` });
  await gfx.close();

  await browser.close();
  console.log(JSON.stringify({ files: fs.readdirSync(OUT) }, null, 2));
})();
