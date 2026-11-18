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

  // sign up for real
  await page.getByRole("button", { name: /حساب ندارم/ }).click();
  const email = `zabanyar.ui.${Date.now()}@mailinator.com`;
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("test-password-123");
  await page.getByRole("button", { name: /^ساخت حساب$/ }).click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/142-account-logged-in.png` });

  const afterSignup = await page.locator("main").innerText();
  const sessionRaw = await page.evaluate(() => localStorage.getItem("zabanyar.session.v1"));
  const session = sessionRaw ? JSON.parse(sessionRaw) : null;

  // reload: session must survive
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const afterReload = await page.locator("main").innerText();

  // log out
  await page.getByRole("button", { name: /خروج/ }).click();
  await page.waitForTimeout(1200);
  const afterLogout = await page.locator("main").innerText();

  console.log(
    JSON.stringify(
      {
        signedIn: afterSignup.includes("حساب تو") || afterSignup.includes("خوش آمدی"),
        hasSession: Boolean(session?.access_token),
        emailStored: session?.email ?? null,
        survivedReload: afterReload.includes("حساب تو"),
        loggedOut: afterLogout.includes("ورود"),
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
