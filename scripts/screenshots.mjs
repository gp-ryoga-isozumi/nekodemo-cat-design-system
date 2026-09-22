// デモサイト（next build の out/）を 3 テーマで撮影し docs/screenshots/ に保存する（設計書 §15 Phase 2 完成条件）。
// 使い方: pnpm build && pnpm screenshots
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { loadThemes } from "./check-contrast.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
// 環境変数で撮影対象と出力先を差し替えられる（例: NEKODEMO_SCREENSHOT_PAGES=/guidelines/,/guidelines/components/ NEKODEMO_SCREENSHOT_DIR=/tmp/shots）
const DEST = process.env.NEKODEMO_SCREENSHOT_DIR ?? join(ROOT, "docs", "screenshots");
const PAGES = process.env.NEKODEMO_SCREENSHOT_PAGES
  ? process.env.NEKODEMO_SCREENSHOT_PAGES.split(",")
      .map((p) => p.trim())
      .filter(Boolean)
  : [
      "/",
      "/tokens/",
      "/themes/",
      "/samples/list/",
      "/samples/grid/",
      "/samples/form/",
      "/samples/login/",
      "/samples/dashboard/",
    ];
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

function serveStatic(rootDir) {
  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let file = normalize(join(rootDir, decodeURIComponent(url.pathname)));
    if (!file.startsWith(rootDir)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
}

async function main() {
  if (!existsSync(join(OUT, "index.html"))) {
    throw new Error("out/index.html がありません。先に pnpm build を実行してください。");
  }
  mkdirSync(DEST, { recursive: true });
  const { themes } = loadThemes(ROOT);
  const server = serveStatic(OUT);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const browser = await chromium.launch();
  try {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        deviceScaleFactor: 1,
      });
      await context.addInitScript((id) => {
        try {
          localStorage.setItem("neko-theme", id);
        } catch {}
      }, theme.id);
      const page = await context.newPage();
      for (const path of PAGES) {
        await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(300);
        const name = `${path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replaceAll("/", "-")}-${theme.id}.png`;
        await page.screenshot({ path: join(DEST, name), fullPage: true });
        console.log(`[screenshots] ${DEST}/${name}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(`[screenshots] ${e.message}`);
  process.exit(1);
});
