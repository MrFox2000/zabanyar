const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  await p.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/40-new-syllabus-map.png" });
  await p.getByRole("button", { name: /واحد ۶/ }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/41-new-unit6.png" });
  await p.goto("http://localhost:3000/app/lesson/a1-u1-short-sounds", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/42-new-lesson-intro.png" });
  await b.close();
})();
