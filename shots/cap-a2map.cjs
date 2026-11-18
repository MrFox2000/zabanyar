const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" });
  await p.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.getByRole("button", { name: "A2", exact: true }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/90-map-a2-full.png" });
  const chips = await p.locator("main button").allInnerTexts();
  console.log(JSON.stringify(chips.filter((t) => t.includes("واحد")).slice(0, 12)));
  await b.close();
})();
