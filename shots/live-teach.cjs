const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 940 }, locale: "fa-IR" });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
  await p.goto("https://zabanyar-kappa.vercel.app/app/lesson/a1-u1-short-sounds", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: /شروع/ }).first().click();
  await p.waitForTimeout(1200);
  const text = await p.locator("main").innerText();
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/54-live-teach.png" });
  console.log(JSON.stringify({ teachCard: text.includes("این حرف چه صدایی دارد"), hasLetter: /\ba\b/.test(text), errors }, null, 2));
  await b.close();
})();
