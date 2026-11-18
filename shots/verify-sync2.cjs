/**
 * Checks the sync path that matters most: a learner played on this device and
 * then logs in — the local history must land in the account.
 */
const { chromium } = require("playwright");

const BASE = "https://zabanyar-kappa.vercel.app";
const SUPABASE = "https://dunvmmxssguoxgzuukle.supabase.co";
const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bnZtbXhzc2d1b3hnenV1a2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMzg4OTEsImV4cCI6MjExMDYxNDg5MX0.SiLTtzDAe3_JBVefwFvAiwvIXKwQrsSdhoBoTVoPuSA";

const PROGRESS = {
  v: 1,
  xp: 310,
  hearts: 3,
  heartsAt: 0,
  streak: 2,
  lastDay: new Date().toLocaleDateString("en-CA"),
  lessons: {
    "a1-u1-short-sounds": { stars: 3, accuracy: 1, xp: 180, at: Date.now() },
    "a1-u1-spell-name": { stars: 2, accuracy: 0.9, xp: 130, at: Date.now() },
  },
  bosses: {},
  badges: [],
  daily: { day: new Date().toLocaleDateString("en-CA"), answered: 20, correct: 18, review: 4, xp: 310, lessons: 2, bossWins: 0, chestOpened: false },
  mistakes: {},
  gems: 40,
  ownedSkins: ["classic"],
  activeSkin: "classic",
  freezes: 0,
  subscription: { plan: null, until: null },
};

(async () => {
  const email = `zabanyar.sync2.${Date.now()}@mailinator.com`;
  const signup = await fetch(`${SUPABASE}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "test-password-123" }),
  }).then((response) => response.json());

  const session = {
    access_token: signup.access_token,
    refresh_token: signup.refresh_token,
    expires_at: signup.expires_at,
    user_id: signup.user.id,
    email,
  };

  const browser = await chromium.launch({ channel: "chrome" });
  const page = await (await browser.newContext({ viewport: { width: 430, height: 940 }, locale: "fa-IR" })).newPage();

  await page.addInitScript(
    (payload) => {
      window.localStorage.setItem("zabanyar.session.v1", JSON.stringify(payload.session));
      window.localStorage.setItem("zabanyar.progress.v1", JSON.stringify(payload.progress));
    },
    { session, progress: PROGRESS },
  );

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);

  const row = await fetch(`${SUPABASE}/rest/v1/progress?user_id=eq.${session.user_id}&select=data`, {
    headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` },
  }).then((response) => response.json());

  const data = row?.[0]?.data ?? {};
  console.log(
    JSON.stringify(
      {
        pushed: Boolean(row?.[0]),
        remoteLessons: Object.keys(data.lessons ?? {}).length,
        remoteXp: data.xp ?? 0,
        remoteGems: data.gems ?? 0,
      },
      null,
      2,
    ),
  );
  await browser.close();
})();
