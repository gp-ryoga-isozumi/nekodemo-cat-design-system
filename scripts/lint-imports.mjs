// ライブラリ配下（npm に出す範囲）で "@/" エイリアス import を禁止する。
// dist/ は相対パスのままでないと利用側で解決できないため（実装計画 A7）。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["src/components", "src/lib", "src/themes", "src/index.ts"];
const pattern = /(from\s+|import\s*\(\s*)["']@\//;
const findings = [];

function walk(p) {
  let st;
  try {
    st = statSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) {
    for (const name of readdirSync(p)) walk(join(p, name));
    return;
  }
  if (!/\.(ts|tsx|mts|js|mjs)$/.test(p)) return;
  const lines = readFileSync(p, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (pattern.test(line)) findings.push(`${p}:${i + 1}: ${line.trim()}`);
  });
}

for (const r of roots) walk(r);

if (findings.length > 0) {
  console.error(
    '[lint-imports] ライブラリ配下で "@/" import は使えません（相対パスにしてください）:',
  );
  for (const f of findings) console.error(`  ${f}`);
  process.exit(1);
}
console.log("[lint-imports] OK");
