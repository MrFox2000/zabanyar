const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 940 }, locale: "fa-IR" });
  const failed = [];
  p.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await p.goto("http://localhost:3200/app/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.locator('a:has-text("سلام کردن")').first().click();
  await p.waitForTimeout(1200);
  console.log(JSON.stringify(failed.slice(0, 12), null, 2));
  await b.close();
})();
