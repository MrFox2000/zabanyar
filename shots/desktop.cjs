const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 1366, height: 900 }, locale: "fa-IR" });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/20-landing-desktop.png" });
  await p.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/21-map-desktop.png" });
  await b.close();
})();
