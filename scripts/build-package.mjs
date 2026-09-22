// build:package の後処理（設計書 §12）。tsc（dist/）の後に:
//   0. dist/**/*.js, *.d.ts の相対 import に拡張子を付ける（tsc は書き換えないため。Node ESM はディレクトリ import 不可）
//   1. dist/styles.css … tokens.css + themes.css を結合（3 テーマ同梱）
//   2. dist/ai/       … docs/ai/*.md と docs/guidelines/*.md のコピー（利用側 AI が node_modules から読める）
//   （icons/status.json は package.json の files でそのまま同梱し、nekodemo check が参照する）
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rewriteSpecifiers } from "./lib/specifiers.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

if (!existsSync(join(DIST, "index.js"))) {
  console.error(
    "[build:package] dist/index.js がありません。tsc -p tsconfig.build.json の出力を確認してください。",
  );
  process.exit(1);
}

/** `./x` → `./x.js` / `./x/index.js` に書き換える（存在するものだけ。本体は scripts/lib/specifiers.mjs） */
function fixSpecifiers(file) {
  const dir = dirname(file);
  const src = readFileSync(file, "utf8");
  const out = rewriteSpecifiers(src, {
    isDts: file.endsWith(".d.ts"),
    resolve: (spec) => resolve(dir, spec),
    fileExists: (p) => existsSync(p),
    isDirectory: (p) => existsSync(p) && statSync(p).isDirectory(),
  });
  if (out !== src) writeFileSync(file, out);
  return out !== src;
}
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(js|d\.ts)$/.test(name)) files.push(p);
  }
  return files;
}
const rewritten = walk(DIST).filter(fixSpecifiers).length;
console.log(`[build:package] 相対 import の拡張子を補いました（${rewritten} ファイル）`);

const tokens = readFileSync(join(ROOT, "src", "styles", "tokens.css"), "utf8");
const themes = readFileSync(join(ROOT, "src", "styles", "themes.css"), "utf8");
writeFileSync(
  join(DIST, "styles.css"),
  `/* nekodemo styles.css（生成物）: tokens.css + themes.css。利用側の globals.css で @import "tailwindcss" の後に読み込む。 */\n@import "tw-animate-css";\n\n${tokens}\n${themes}`,
);

mkdirSync(join(DIST, "ai"), { recursive: true });
cpSync(join(ROOT, "docs", "ai"), join(DIST, "ai"), { recursive: true });
cpSync(join(ROOT, "docs", "guidelines"), join(DIST, "ai", "guidelines"), { recursive: true });
console.log("[build:package] dist/styles.css と dist/ai/ を生成しました");
