// npm 配布物の検証（設計書 §12、実装計画 Phase 5）。`pnpm pack:test`
//   1. pnpm build:package → npm pack で tarball を作る
//   2. 一時ディレクトリに tarball + react + tailwindcss を入れる（利用側プロジェクトの最小形）
//   3. 検証: exports の解決 / 依存漏れ / styles.css の Tailwind コンパイル / SSR 描画 / bin nekodemo check / ai ドキュメント同梱
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const log = (m) => console.log(`[pack:test] ${m}`);
const run = (cmd, args, cwd, extra = {}) => {
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: extra.capture ? "pipe" : "inherit",
    encoding: "utf8",
    env: { ...process.env, ...extra.env },
  });
  if (r.status !== 0 && !extra.allowFail) {
    if (extra.capture) console.error(r.stdout, r.stderr);
    throw new Error(`${cmd} ${args.join(" ")} が失敗しました（exit ${r.status}）`);
  }
  return r;
};
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

// 1. build + pack
run("pnpm", ["build:package"], ROOT);
const packDir = mkdtempSync(join(tmpdir(), "nekodemo-pack-"));
const packOut = run("npm", ["pack", "--json", "--pack-destination", packDir], ROOT, {
  capture: true,
});
const packInfo = JSON.parse(packOut.stdout)[0];
const tarball = join(packDir, packInfo.filename);
log(
  `tarball: ${packInfo.filename}（${(packInfo.size / 1024).toFixed(0)} KB、展開後 ${(packInfo.unpackedSize / 1024).toFixed(0)} KB、${packInfo.entryCount} ファイル）`,
);
const shipped = new Set(packInfo.files.map((f) => f.path));
for (const must of [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/styles.css",
  "dist/ai/USING_NEKODEMO.md",
  "dist/ai/SETUP.md",
  "dist/ai/GUARD_BLOCK.md",
  "dist/ai/guidelines/README.md",
  "bin/nekodemo.mjs",
  "scripts/check/index.mjs",
  "scripts/check/rules.mjs",
  "icons/status.json",
  "skills/use-nekodemo/SKILL.md",
  "llms.txt",
  "LICENSE",
  "README.md",
  "THIRD_PARTY_NOTICES.md",
]) {
  if (!shipped.has(must)) throw new Error(`tarball に ${must} がありません`);
}
for (const mustNot of [...shipped].filter((p) =>
  /\.(test|stories)\.[jt]sx?$|^src\/|^\.storybook\/|^docs\/|^prompt\//.test(p),
)) {
  throw new Error(`tarball に含めてはいけないファイル: ${mustNot}`);
}
log("同梱ファイルを確認しました");

// 2. 利用側プロジェクトの最小形
const app = mkdtempSync(join(tmpdir(), "nekodemo-consumer-"));
writeFileSync(
  join(app, "package.json"),
  JSON.stringify({ name: "consumer", private: true, type: "module" }, null, 2),
);
run(
  "npm",
  [
    "install",
    "--no-audit",
    "--no-fund",
    "--silent",
    tarball,
    `react@${pkg.peerDependencies.react}`,
    `react-dom@${pkg.peerDependencies["react-dom"]}`,
    "tailwindcss@^4",
    "@tailwindcss/node@^4",
  ],
  app,
);
log(`利用側プロジェクトに install しました: ${app}`);

// 3a. exports の解決と依存漏れ（すべての部品を import して描画）
writeFileSync(
  join(app, "ssr.mjs"),
  `import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import * as nk from "nekodemo";
import * as reg from "nekodemo/themes/registry";
const names = Object.keys(nk);
if (names.length < 100) throw new Error("export が少なすぎます: " + names.length);
const themeList = Object.values(reg).find((v) => Array.isArray(v));
if (!themeList || themeList.length !== 3) throw new Error("themes/registry に 3 テーマの配列がありません: " + Object.keys(reg).join(","));
const html = renderToStaticMarkup(
  React.createElement(nk.NekoThemeProvider, { defaultTheme: "russian-blue" },
    React.createElement(nk.TooltipProvider, null,
      React.createElement("div", null,
        React.createElement(nk.Button, { variant: "primary" }, "保存する"),
        React.createElement(nk.Icon, { icon: "search", label: "検索" }),
        React.createElement(nk.EmptyState, { title: "まだ案件がありません" }),
        React.createElement(nk.Badge, { count: 3 }),
      ))));
for (const must of ["data-slot=\\"button\\"", "bg-surface-primary", "data-icon=\\"search\\"", "<svg", "data-slot=\\"badge\\"", "まだ案件がありません"]) {
  if (!html.includes(must)) throw new Error("SSR 出力に " + must + " が含まれません: " + html.slice(0, 400));
}
console.log("[pack:test] SSR OK: exports " + names.length + " 個、HTML " + html.length + " 文字");
`,
);
run("node", ["ssr.mjs"], app);

// 3b. styles.css を Tailwind でコンパイル（@source で dist を走査）
writeFileSync(
  join(app, "compile.mjs"),
  `import { compile } from "@tailwindcss/node";
import { readFileSync } from "node:fs";
const css = '@import "tailwindcss"; @source "./node_modules/nekodemo/dist"; @import "nekodemo/styles.css";';
const compiler = await compile(css, { base: process.cwd(), onDependency() {} });
const out = compiler.build(["bg-surface-card", "text-text-high", "rounded-action", "text-3", "font-bold", "animate-in", "bg-blue-500", "font-semibold", "bg-primary-600"]);
for (const must of [".bg-surface-card", ".text-text-high", ".rounded-action", ".text-3", ".font-bold", "[data-neko-theme=\\"russian-blue\\"]", "--nk-color-surface-card", ".animate-in"]) {
  if (!out.includes(must)) throw new Error("コンパイル結果に " + must + " がありません");
}
for (const mustNot of [".bg-blue-500", ".font-semibold"]) {
  if (out.includes(mustNot)) throw new Error("既定パレットが生成されています: " + mustNot);
}
console.log("[pack:test] CSS OK: " + (out.length / 1024).toFixed(0) + " KB、既定パレットなし");
`,
);
run("node", ["compile.mjs"], app);

// 3c. bin: nekodemo check（違反ファイルで exit 1、正常ファイルで exit 0）
writeFileSync(
  join(app, "bad.tsx"),
  'export const A = () => <div className="bg-blue-500" style={{ color: "#fff" }}>x</div>;\n',
);
writeFileSync(
  join(app, "good.tsx"),
  'import { Button } from "nekodemo";\nexport const A = () => <Button className="bg-surface-card text-text-high">保存する</Button>;\n',
);
const bad = run("npx", ["nekodemo", "check", "bad.tsx", "--strict", "--format", "json"], app, {
  capture: true,
  allowFail: true,
});
if (bad.status !== 1)
  throw new Error(
    `bin の check が違反を検出しませんでした（exit ${bad.status}）\n${bad.stdout}${bad.stderr}`,
  );
const badJson = JSON.parse(bad.stdout);
if (
  !badJson.findings.some((f) => f.rule === "NK002") ||
  !badJson.findings.some((f) => f.rule === "NK004")
)
  throw new Error("NK002 / NK004 が出ていません");
const good = run("npx", ["nekodemo", "check", "good.tsx", "--strict"], app, {
  capture: true,
  allowFail: true,
});
if (good.status !== 0)
  throw new Error(`正常ファイルで check が失敗しました\n${good.stdout}${good.stderr}`);
const iconCheck = run("npx", ["nekodemo", "check", "--format", "json", "icon.tsx"], app, {
  capture: true,
  allowFail: true,
});
log("bin nekodemo check OK（違反で exit 1、正常で exit 0）");
void iconCheck;

// 3d. AI ドキュメントが node_modules から読める
const ai = readdirSync(join(app, "node_modules", "nekodemo", "dist", "ai"));
if (!ai.includes("USING_NEKODEMO.md")) throw new Error("dist/ai が同梱されていません");
if (!existsSync(join(app, "node_modules", "nekodemo", "skills", "use-nekodemo", "SKILL.md")))
  throw new Error("skills が同梱されていません");
log("ai ドキュメントと skills を確認しました");

rmSync(packDir, { recursive: true, force: true });
rmSync(app, { recursive: true, force: true });
log("すべて通過しました");
