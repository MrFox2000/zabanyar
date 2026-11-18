/**
 * Verifies the whole account chain on the live site:
 * signup → session → play a lesson to completion → progress reaches Supabase.
 */
const { chromium } = require("playwright");

const BASE = "https://zabanyar-kappa.vercel.app";
const SUPABASE = "https://dunvmmxssguoxgzuukle.supabase.co";
const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bnZtbXhzc2d1b3hnenV1a2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMzg4OTEsImV4cCI6MjExMDYxNDg5MX0.SiLTtzDAe3_JBVefwFvAiwvIXKwQrsSdhoBoTVoPuSA";

async function apiSignup(email, password) {
  const response = await fetch(`${SUPABASE}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

async function remoteRow(userId, token) {
  const response = await fetch(`${SUPABASE}/rest/v1/progress?user_id=eq.${userId}&select=data,updated_at`, {
    headers: { apikey: KEY, Authorization: `Bearer ${token}` },
  });
  const rows = await response.json();
  return rows[0] ?? null;
}

(async () => {
  const email = `zabanyar.sync.${Date.now()}@mailinator.com`;
  const signup = await apiSignup(email, "test-password-123");
  const session = {
    access_token: signup.access_token,
    refresh_token: signup.refresh_token,
    expires_at: signup.expires_at,
    user_id: signup.user.id,
    email,
  };

  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, locale: "fa-IR" })).newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 140)));

  await page.addInitScript((value) => {
    window.localStorage.setItem("zabanyar.session.v1", JSON.stringify(value));
  }, session);

  // play the first A1 lesson through the real player
  await page.goto(`${BASE}/app/lesson/a1-u1-short-sounds`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const start = page.getByRole("button", { name: /شروع|بعدی|ادامه|بریم/ }).first();
  if (await start.count()) await start.click({ force: true });
  await page.waitForTimeout(800);

  for (let step = 0; step < 80; step += 1) {
    const advance = page.getByRole("button", { name: /بعدی|ادامه|بریم|شروع تمرین|تمام/ }).first();
    if (await advance.count()) {
      await advance.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(320);
    }
    const choices = page.locator("main button");
    const count = await choices.count();
    if (count === 0) break;
    await choices.nth(Math.floor(count / 2)).click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(260);

    const body = await page.locator("main").innerText().catch(() => "");
    if (body.includes("درس") && (body.includes("تمام شد") || body.includes("ستاره") || body.includes("خارج"))) break;
  }

  await page.waitForTimeout(3000);
  const row = await remoteRow(session.user_id, session.access_token);
  const local = JSON.parse((await page.evaluate(() => localStorage.getItem("zabanyar.progress.v1"))) || "{}");

  console.log(
    JSON.stringify(
      {
        remoteHasRow: Boolean(row),
        remoteLessons: row ? Object.keys(row.data.lessons ?? {}).length : 0,
        remoteXp: row ? row.data.xp ?? 0 : 0,
        localLessons: Object.keys(local.lessons ?? {}).length,
        localXp: local.xp ?? 0,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
