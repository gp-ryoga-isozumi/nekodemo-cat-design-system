// T1 用の画像生成プロンプトを icons/prompts/<name>.md に書き出す（設計書 §8.4 の 1、実装計画 3b.3）。
//   node scripts/icons/gen-prompts.mjs [name...] [--section "基本操作"]... [--all] [--force]
// 既定は wanted.txt の「基本操作」「一覧・整理」「ファイル・データ」「コミュニケーション」の節（耳なし規約の名前は除く）＋ 手動耳の 3 つ。
// 生成したファイルの「モデル」「日付」欄は、画像を作った人が記入する（記入済みのファイルは --force が無い限り上書きしない）。
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isEarless, loadManifest, parseWanted } from "./build-icons.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DEFAULT_SECTIONS = ["基本操作", "一覧・整理", "ファイル・データ", "コミュニケーション"];

/** wanted.txt を節（# --- 見出し ---）ごとに分ける */
export function parseSections(text) {
  const sections = [];
  let current = { title: "(先頭)", names: [] };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const m = /^#\s*---\s*(.+?)\s*---/.exec(line);
    if (m) {
      current = { title: m[1], names: [] };
      sections.push(current);
      continue;
    }
    if (!line || line.startsWith("#")) continue;
    current.names.push(line.split(/\s+/)[0]);
  }
  return sections;
}

export function promptFor(name, description) {
  return `# ${name} — T1（専用に描く猫耳アイコン）のプロンプト

- 名前: \`${name}\`（Material Symbols）
- 説明: ${description || "（wanted.txt に説明なし）"}
- 生成に使ったモデル / サービス: （記入）
- 日付: （記入）
- 設定（サイズ・ステップ等）: （記入）
- 利用規約の確認（商用利用・再配布）: （記入。設計書 §3.3）

## プロンプト（そのまま貼る）

> 24-grid の UI ピクトグラム。黒 1 色、純白の背景、影・グラデーション・文字なし。線の太さは 2px 相当、端と角は丸い（Material Symbols Rounded の weight 500 と同じ太さ）。題材: 「${description || name}」。図形本体の上辺に、本体と同じ線幅の中抜きの三角形の猫耳を左右 1 つずつ付ける（付け根は本体の輪郭上、耳の高さはアイコン全体の 1/5、頂点はやや外側に倒す。顔・ひげ・目は描かない）。中央配置、上下左右に 2px の余白。1024×1024。

## 生成後の手順

1. PNG を \`icons/raw/${name}.png\` に置く（git 管理外）
2. \`pnpm icons:vectorize ${name}\` → \`icons/src/${name}.svg\`
3. \`pnpm icons:audit ${name}\` で (a)〜(e) が合格すること
4. \`pnpm build:icons\` → Storybook の Icon Catalog で T2 と並べて確認（12 / 16 / 24 / 48px）
5. 採用したら \`icons/manifest.json\` の \`bespoke\` に \`{ "${name}": { "reviewer": "", "date": "", "model": "" } }\` を記録する
`;
}

export function generatePrompts({
  names = [],
  sections = DEFAULT_SECTIONS,
  all = false,
  force = false,
  root = ROOT,
} = {}) {
  const text = readFileSync(join(root, "icons", "wanted.txt"), "utf8");
  const wanted = parseWanted(text);
  const descriptions = Object.fromEntries(wanted.map((w) => [w.name, w.description]));
  const manifest = loadManifest(root);
  const manualPath = join(root, "icons", "manual-ears.json");
  const manual = existsSync(manualPath)
    ? Object.keys(JSON.parse(readFileSync(manualPath, "utf8"))).filter((k) => !k.startsWith("$"))
    : [];
  let targets;
  if (names.length) targets = names;
  else if (all) targets = wanted.map((w) => w.name);
  else {
    const bySection = parseSections(text)
      .filter((s) => sections.includes(s.title))
      .flatMap((s) => s.names);
    targets = [...new Set([...bySection, ...manual])];
  }
  targets = targets.filter((n) => !isEarless(n, manifest));
  const dir = join(root, "icons", "prompts");
  mkdirSync(dir, { recursive: true });
  const written = [];
  const skipped = [];
  for (const name of targets) {
    const p = join(dir, `${name}.md`);
    if (existsSync(p) && !force) {
      const existing = readFileSync(p, "utf8");
      if (!/生成に使ったモデル \/ サービス: （記入）/.test(existing)) {
        skipped.push(name); // 記入済み
        continue;
      }
    }
    writeFileSync(p, promptFor(name, descriptions[name]));
    written.push(name);
  }
  return { written, skipped, dir };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const names = [];
  const sections = [];
  let all = false;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--section") sections.push(args[++i]);
    else if (args[i] === "--all") all = true;
    else if (args[i] === "--force") force = true;
    else names.push(args[i]);
  }
  const r = generatePrompts({
    names,
    sections: sections.length ? sections : DEFAULT_SECTIONS,
    all,
    force,
  });
  console.log(
    `[icons:prompts] ${r.written.length} 件を ${r.dir} に書き出しました${r.skipped.length ? `（記入済みのため ${r.skipped.length} 件は保持: ${r.skipped.join(", ")}）` : ""}`,
  );
}
