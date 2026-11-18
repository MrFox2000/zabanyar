const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 940 }, locale: "fa-IR" });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
  const paths = ["/", "/app", "/app/shop", "/app/start", "/app/share", "/app/notebook"];
  const status = {};
  for (const path of paths) {
    const r = await p.goto("https://zabanyar-kappa.vercel.app" + path, { waitUntil: "domcontentloaded" });
    status[path] = r.status();
  }
  await p.goto("https://zabanyar-kappa.vercel.app/app/shop", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/120-live-shop.png" });
  console.log(JSON.stringify({ status, errors }, null, 2));
  await b.close();
})();
