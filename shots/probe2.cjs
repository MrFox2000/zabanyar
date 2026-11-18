const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 940 }, locale: "fa-IR" });
  await p.goto("http://localhost:3000/app/lesson/a1-u1-hello-name", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  await p.getByRole("button", { name: /شروع/ }).first().click();
  await p.waitForTimeout(500);
  const names = await p.evaluate(() => [...document.querySelectorAll("main button")].map((b) => ({ t: b.textContent.trim().slice(0, 20), aria: b.getAttribute("aria-label"), dis: b.disabled })));
  console.log(JSON.stringify(names));
  await p.getByRole("button", { name: "سلام", exact: true }).first().click();
  await p.waitForTimeout(600);
  const foot = await p.evaluate(() => document.querySelector("footer")?.innerText ?? null);
  const store = await p.evaluate(() => localStorage.getItem("zabanyar.progress.v1"));
  console.log(JSON.stringify({ foot, store }));
  await p.screenshot({ path: "D:/Projects/zabanyar/shots/probe-answer.png" });
  await b.close();
})();
