const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 1280, height: 760 }, deviceScaleFactor: 2, locale: "fa-IR" });
  await p.goto("https://zabanyar-kappa.vercel.app/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path: "D:/Projects/portfolio-site/assets/zabanyar.png" });
  await p.goto("https://zabanyar-kappa.vercel.app/app", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: "D:/Projects/portfolio-site/assets/zabanyar-map.png" });
  await b.close();
})();
