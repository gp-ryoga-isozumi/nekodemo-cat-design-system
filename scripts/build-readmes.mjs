// 各部品の index.tsx 先頭の JSDoc（概要／アンチパターン／使用例）から README.md を生成する（設計書 §9.2、実装計画 A7）。
// `pnpm build:readmes`。JSDoc が正で、README は生成物。
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UI_DIR = join(ROOT, "src", "components", "ui");

/** 先頭の `/** … *\/` ブロックを取り出し、行頭の ` * ` を外す */
export function extractDoc(source) {
  const m = /\/\*\*\s*\n([\s\S]*?)\n\s*\*\//.exec(source);
  if (!m) return null;
  return m[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\* ?/, ""))
    .join("\n")
    .trim();
}

/** JSDoc → README の Markdown。1 行目を見出し、「概要:」「アンチパターン:」「使用例:」を節にする */
export function docToMarkdown(doc, name) {
  const lines = doc.split("\n");
  const title = lines[0].trim() || name;
  const body = lines.slice(1).join("\n").trim();
  const md = body
    .replace(/^概要:\s*/m, "## 概要\n\n")
    .replace(/^構成:\s*/m, "## 構成\n\n")
    .replace(/^アンチパターン:\s*$/m, "## アンチパターン\n")
    .replace(/^使用例:\s*$/m, "## 使用例\n");
  return `# ${title}\n\n> このファイルは \`pnpm build:readmes\` が \`index.tsx\` の JSDoc から生成する。手で編集せず JSDoc を直す。\n\n${md}\n`;
}

export function buildReadmes({ root = ROOT, log = console.log } = {}) {
  const dir = join(root, "src", "components", "ui");
  const names = readdirSync(dir).filter((n) => existsSync(join(dir, n, "index.tsx")));
  const written = [];
  const skipped = [];
  for (const name of names) {
    const source = readFileSync(join(dir, name, "index.tsx"), "utf8");
    const doc = extractDoc(source);
    if (!doc) {
      skipped.push(name);
      continue;
    }
    writeFileSync(join(dir, name, "README.md"), docToMarkdown(doc, name));
    written.push(name);
  }
  log(
    `[build:readmes] ${written.length} 件を生成${skipped.length ? `、JSDoc 無し: ${skipped.join(", ")}` : ""}`,
  );
  return { written, skipped };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (!existsSync(UI_DIR)) {
    console.error("[build:readmes] src/components/ui がありません");
    process.exit(1);
  }
  buildReadmes();
}
