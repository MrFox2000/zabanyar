const { chromium } = require("playwright");

const BASE = "https://zabanyar-kappa.vercel.app";
const OUT = "D:/Projects/zabanyar/shots";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

  await page.goto(`${BASE}/app/account`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/140-account.png` });
  const text = await page.locator("main").innerText();

  // try a fresh signup against the real project
  await page.getByRole("button", { name: /حساب ندارم/ }).click();
  await page.waitForTimeout(300);
  const email = `zabanyar.ui.${Date.now()}@mailinator.com`;
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("test-password-123");
  await page.getByRole("button", { name: /^ساخت حساب$/ }).click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/141-account-signup.png` });
  const after = await page.locator("main").innerText();

  console.log(
    JSON.stringify(
      {
        formVisible: text.includes("ورود"),
        signupMessage: after.includes("تأیید") ? "needs-confirmation" : after.includes("خوش آمدی") ? "logged-in" : after.slice(0, 120),
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
