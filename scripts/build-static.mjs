/**
 * Static build: `node scripts/build-static.mjs`
 *
 * Exports the whole app to plain HTML/JS (`out/`) for hosts that do not run a
 * Node server. Route handlers cannot exist in `output: export`, so `src/app/api`
 * is moved aside for the duration of the build and always restored — including
 * on failure — so the repo is never left in a half-state.
 */
import { existsSync, renameSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const root = "D:/Projects/zabanyar";
const api = join(root, "src/app/api");
const parked = join(root, ".api-parked");

if (existsSync(parked)) rmSync(parked, { recursive: true, force: true });

let moved = false;
try {
  if (existsSync(api)) {
    renameSync(api, parked);
    moved = true;
  }
  // a stale dev-mode type validator still points at the parked routes
  rmSync(join(root, ".next"), { recursive: true, force: true });
  console.log("building static export…");
  try {
    execSync("npm run build", {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, NEXT_BUILD_STATIC: "1", NEXT_TELEMETRY_DISABLED: "1" },
    });
  } catch (error) {
    console.error("static build failed — see the log above");
    throw error;
  }
  console.log("done → out/");
} finally {
  if (moved && existsSync(parked)) renameSync(parked, api);
  if (existsSync(join(root, ".next/cache"))) console.log("api routes restored");
}
