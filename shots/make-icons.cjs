const { chromium } = require("playwright");
const fs = require("fs");

/** rasterise the SVG icons so the PWA is actually installable (192/512/180 PNG) */
(async () => {
  const svg = fs.readFileSync("D:/Projects/zabanyar/public/icon.svg", "utf8");
  const maskable = fs.readFileSync("D:/Projects/zabanyar/public/icon-maskable.svg", "utf8");
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 1 });

  const render = async (markup, size, file) => {
    await page.setContent(
      `<html><body style="margin:0;background:transparent"><div style="width:${size}px;height:${size}px">${markup}</div></body></html>`,
    );
    const element = page.locator("div").first();
    await element.screenshot({ path: file, omitBackground: true });
    console.log("wrote", file);
  };

  for (const size of [192, 512]) {
    await render(svg.replace(/width="512" height="512"/, `width="${size}" height="${size}"`), size, `D:/Projects/zabanyar/public/icon-${size}.png`);
  }
  await render(maskable.replace(/width="512" height="512"/, 'width="512" height="512"'), 512, "D:/Projects/zabanyar/public/icon-maskable-512.png");
  await render(svg.replace(/width="512" height="512"/, 'width="180" height="180"'), 180, "D:/Projects/zabanyar/public/apple-touch-icon.png");

  await browser.close();
})();
