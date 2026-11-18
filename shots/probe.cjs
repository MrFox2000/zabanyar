const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await b.newPage({ viewport: { width: 430, height: 900 } });
  await p.goto("http://127.0.0.1:3000/app", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const hearts = [...document.querySelectorAll("svg.lucide-heart")].slice(0, 5).map((s) => s.getAttribute("class"));
    return { hearts, ls: Object.keys(localStorage), text: document.body.innerText.slice(0, 120) };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})();
