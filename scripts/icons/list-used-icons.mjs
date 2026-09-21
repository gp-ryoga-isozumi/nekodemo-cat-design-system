// src/components 内で使っているアイコン名（icon="..." / icon: "..."）を抽出し、icons/wanted.txt と突き合わせる（設計書 §14 icons:list）。
// 猫版が無い名前（T3 になるもの）を一覧にする。Phase 4 完成条件「部品内部で使うアイコンの T3 が 0 件」の検査に使う。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, parseWanted } from "./build-icons.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (
      /\.(tsx?|mdx?)$/.test(name) &&
      !/\.(test|stories)\.tsx?$/.test(name) &&
      !name.endsWith(".generated.ts")
    )
      out.push(p);
  }
  return out;
}

export function extractIconNames(source) {
  const names = new Set();
  for (const m of source.matchAll(/\bicon\s*[=:]\s*["']([a-z0-9_]+)["']/g)) names.add(m[1]);
  return names;
}

export function listUsedIcons(root = ROOT) {
  const used = new Map(); // name → files
  for (const file of walk(join(root, "src", "components"))) {
    for (const name of extractIconNames(readFileSync(file, "utf8"))) {
      if (!used.has(name)) used.set(name, []);
      used.get(name).push(relative(root, file));
    }
  }
  const manifest = loadManifest(root);
  const aliases = manifest.aliases ?? {};
  const wanted = new Set(
    parseWanted(readFileSync(join(root, "icons", "wanted.txt"), "utf8")).map(
      (w) => aliases[w.name] ?? w.name,
    ),
  );
  const status = JSON.parse(readFileSync(join(root, "icons", "status.json"), "utf8"));
  const available = new Set([
    ...status.bespoke,
    ...status.autoEar,
    ...status.earless,
    ...status.noEar.map((n) => n.name),
    ...Object.keys(status.aliases ?? {}),
  ]);
  const missing = [...used.keys()].filter((n) => !available.has(n)).sort();
  const notWanted = [...used.keys()]
    .filter((n) => !wanted.has(aliases[n] ?? n) && !status.bespoke.includes(n))
    .sort();
  return { used, missing, notWanted };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { used, missing, notWanted } = listUsedIcons();
  console.log(`[icons:list] 部品内で使用: ${used.size} 名`);
  for (const [name, files] of [...used.entries()].sort())
    console.log(`  ${name}  (${files.join(", ")})`);
  if (notWanted.length) console.log(`[icons:list] wanted.txt に無い: ${notWanted.join(", ")}`);
  if (missing.length) {
    console.error(`[icons:list] 猫版が無い（T3 になる）: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log("[icons:list] 部品内の T3 は 0 件");
}
