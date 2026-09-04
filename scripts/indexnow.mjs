/**
 * Tells Bing (and the other IndexNow participants) that the site changed,
 * so it re-crawls on a push instead of waiting for its own schedule.
 *
 * Runs as `postbuild`, so a deploy is the only action needed. It is
 * deliberately best-effort: search-engine housekeeping must never be the
 * reason a deploy fails, so every failure path here logs and exits 0.
 *
 * Run it by hand with FORCE_INDEXNOW=1 node scripts/indexnow.mjs
 */

import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const PUBLIC_DIR = join(process.cwd(), "public");
const ROUTES_FILE = join(process.cwd(), "lib", "site-routes.json");

const done = (msg) => {
  console.log(`[indexnow] ${msg}`);
  process.exit(0);
};

// Preview and branch builds share this script but must not claim the
// production domain changed, so they are skipped rather than pinged.
const isProd = process.env.VERCEL_ENV === "production";
if (!isProd && process.env.FORCE_INDEXNOW !== "1") {
  done(
    `skipped (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}; set FORCE_INDEXNOW=1 to run anyway)`,
  );
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) done("skipped: NEXT_PUBLIC_SITE_URL is not set");

// The key is whichever 32-hex .txt sits in public/. Reading it from the file
// that Bing itself fetches means the key we submit and the key we host are
// the same by construction — they cannot fall out of sync.
if (!existsSync(PUBLIC_DIR)) done("skipped: no public/ directory");
const keyFile = readdirSync(PUBLIC_DIR).find((f) => /^[0-9a-f]{32}\.txt$/i.test(f));
if (!keyFile) done("skipped: no IndexNow key file in public/");
const key = keyFile.replace(/\.txt$/i, "");

let routes;
try {
  routes = JSON.parse(await import("node:fs").then((fs) => fs.promises.readFile(ROUTES_FILE, "utf8")));
} catch (err) {
  done(`skipped: could not read ${ROUTES_FILE} (${err.message})`);
}

const origin = siteUrl.replace(/\/$/, "");
const body = {
  host: new URL(origin).host,
  key,
  keyLocation: `${origin}/${keyFile}`,
  urlList: routes.map((r) => `${origin}${r}`),
};

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

  // 200 accepted, 202 accepted with the key still being validated. Both fine.
  if (res.ok || res.status === 202) {
    done(`submitted ${body.urlList.length} URLs (HTTP ${res.status})`);
  }
  done(`endpoint returned HTTP ${res.status} — not failing the build`);
} catch (err) {
  done(`request failed: ${err.message} — not failing the build`);
}
