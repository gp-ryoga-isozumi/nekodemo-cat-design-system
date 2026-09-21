#!/usr/bin/env node
// nekodemo check（設計書 §11.4）。使い方: node scripts/check/index.mjs <dir|file>... [--strict] [--format text|json] [--rules NK001,NK002]
// 役割トークン以外の色、既定パレット、任意値、lucide-react、猫版が無いアイコン、400/700 以外のウェイト等を検出する。
// --strict: error が 1 件でもあれば exit 1。AI の応答終了時（Claude Code の Stop hook）に自動実行する想定。
//
// 除外コメント:
//   // nekodemo-check-ignore-file NK001,NK005   … ファイル全体でそのルールを無視（先頭 20 行以内）
//   // nekodemo-check-ignore-next-line NK009    … 次の行だけ無視
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { manualChecks, rules } from "./rules.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".mdx", ".html"]);
const EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  ".next",
  "out",
  ".git",
  "coverage",
  "storybook-static",
]);
const EXCLUDE_FILE = [
  /\.generated\.[a-z]+$/,
  /(^|\/)tokens\.css$/,
  /(^|\/)themes\.css$/,
  /(^|\/)NekoHead\.tsx$/,
  /(^|\/)registry\.ts$/,
  /\.test\.[jt]sx?$/,
  /\.d\.ts$/,
  /(^|\/)docs\/preview\//,
];

/** 猫版があるアイコン名の一覧（icons/status.json）。リポジトリ内でも npm 配布物内でも探す */
export function loadIconNames(cwd = process.cwd()) {
  const candidates = [
    join(cwd, "icons", "status.json"),
    join(HERE, "..", "..", "icons", "status.json"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      const s = JSON.parse(readFileSync(p, "utf8"));
      return new Set([
        ...(s.bespoke ?? []),
        ...(s.autoEar ?? []),
        ...(s.earless ?? []),
        ...(s.noEar ?? []).map((n) => n.name),
        ...Object.keys(s.aliases ?? {}),
      ]);
    } catch {
      return null;
    }
  }
  return null;
}

export function collectFiles(targets, cwd = process.cwd()) {
  const files = [];
  const walk = (p) => {
    const st = statSync(p);
    if (st.isDirectory()) {
      for (const name of readdirSync(p)) {
        if (EXCLUDE_DIRS.has(name)) continue;
        walk(join(p, name));
      }
      return;
    }
    if (!EXTENSIONS.has(extname(p))) return;
    const rel = relative(cwd, p).split("\\").join("/");
    if (EXCLUDE_FILE.some((re) => re.test(rel))) return;
    files.push(p);
  };
  for (const t of targets) {
    const p = resolve(cwd, t);
    if (existsSync(p)) walk(p);
  }
  return files;
}

function parseIgnores(lines) {
  const fileIgnored = new Set();
  const lineIgnored = new Map(); // lineIndex → Set(rule) | "*"
  lines.forEach((line, i) => {
    const f = /nekodemo-check-ignore-file(?:\s+([A-Z0-9,\s]+))?/.exec(line);
    if (f && i < 20) {
      if (f[1]) for (const r of f[1].split(/[,\s]+/).filter(Boolean)) fileIgnored.add(r);
      else fileIgnored.add("*");
    }
    const n = /nekodemo-check-ignore-next-line(?:\s+([A-Z0-9,\s]+))?/.exec(line);
    if (n) {
      const set = new Set(n[1] ? n[1].split(/[,\s]+/).filter(Boolean) : ["*"]);
      lineIgnored.set(i + 1, set);
    }
  });
  return { fileIgnored, lineIgnored };
}

/** 1 ファイル分を検査する（テスト用に公開） */
export function checkSource(source, path, { iconNames = null, enabledRules = null } = {}) {
  const lines = source.split("\n");
  const { fileIgnored, lineIgnored } = parseIgnores(lines);
  const findings = [];
  for (const rule of rules) {
    if (enabledRules && !enabledRules.has(rule.id)) continue;
    if (fileIgnored.has("*") || fileIgnored.has(rule.id)) continue;
    const ignoredLines = new Set();
    for (const [idx, set] of lineIgnored)
      if (set.has("*") || set.has(rule.id)) ignoredLines.add(idx);
    const ctx = { path, source, lines, ignoredLines, iconNames };
    for (const f of rule.test(ctx)) {
      if (ignoredLines.has(f.line - 1)) continue;
      findings.push({
        rule: rule.id,
        severity: rule.severity,
        file: path,
        line: f.line,
        col: f.col ?? 1,
        message: f.message,
        ...(f.fix ? { fix: f.fix } : {}),
        ...(f.icon ? { icon: f.icon } : {}),
      });
    }
  }
  return findings;
}

export function runCheck(targets, { cwd = process.cwd(), enabledRules = null } = {}) {
  const iconNames = loadIconNames(cwd);
  const files = collectFiles(targets, cwd);
  const findings = [];
  for (const file of files) {
    const rel = relative(cwd, file).split("\\").join("/");
    findings.push(...checkSource(readFileSync(file, "utf8"), rel, { iconNames, enabledRules }));
  }
  const order = { error: 0, warn: 1, info: 2 };
  findings.sort(
    (a, b) =>
      order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line,
  );
  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of findings) counts[f.severity]++;
  const missingIcons = [
    ...new Set(findings.filter((f) => f.rule === "NK006").map((f) => f.icon)),
  ].sort();
  return {
    files: files.length,
    findings,
    counts,
    missingIcons,
    iconNamesLoaded: iconNames !== null,
  };
}

export function formatText(result) {
  const lines = [];
  for (const f of result.findings)
    lines.push(`${f.file}:${f.line}:${f.col}  ${f.rule} ${f.severity}  ${f.message}`);
  if (result.missingIcons.length)
    lines.push(`\n猫版が無いアイコン（T3）: ${result.missingIcons.join(", ")}`);
  lines.push(
    `\n[nekodemo check] ${result.files} ファイル: error ${result.counts.error} / warn ${result.counts.warn} / info ${result.counts.info}${result.iconNamesLoaded ? "" : "（icons/status.json が見つからないため NK006 は省略）"}`,
  );
  return lines.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const fmtIdx = args.indexOf("--format");
  const format = fmtIdx >= 0 ? args[fmtIdx + 1] : "text";
  const rulesIdx = args.indexOf("--rules");
  const enabledRules = rulesIdx >= 0 ? new Set(args[rulesIdx + 1].split(",")) : null;
  const targets = args.filter(
    (a, i) => !a.startsWith("--") && args[i - 1] !== "--format" && args[i - 1] !== "--rules",
  );
  if (targets.length === 0) targets.push("src");
  const result = runCheck(targets, { enabledRules });
  if (format === "json") {
    console.log(
      JSON.stringify(
        {
          findings: result.findings,
          counts: result.counts,
          missingIcons: result.missingIcons,
          manualChecks,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(formatText(result));
    if (result.findings.length === 0)
      console.log(
        "問題は見つかりませんでした。最後に次の項目を自己確認してください:\n" +
          manualChecks.map((m) => `  - [ ] ${m}`).join("\n"),
      );
  }
  if (strict && result.counts.error > 0) process.exit(1);
}
