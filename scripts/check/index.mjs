#!/usr/bin/env node
// nekodemo check（設計書 §11.4）。
// 使い方: node scripts/check/index.mjs <dir|file>... [--strict] [--max-warnings N] [--format text|json] [--rules NK001,NK002] [--ignore <glob>,<glob>]
// 役割トークン以外の色、既定パレット、任意値、lucide-react、猫版が無いアイコン、400/700 以外のウェイト等を検出する。
// --strict: error が 1 件でもあれば exit 1（--max-warnings N を付けると warn が N 件を超えても exit 1）。
//   AI の応答終了時（Claude Code の Stop hook）に自動実行する想定。存在しない対象を渡したときは exit 2。
// --ignore: 検査から外す glob（`src/legacy/**` など）。nekodemo.config.json の `check.ignore` でも指定できる。
//
// 除外コメント:
//   // nekodemo-check-ignore-file NK001,NK005   … ファイル全体でそのルールを無視（先頭 20 行以内）
//   // nekodemo-check-ignore-next-line NK009    … 次の行だけ無視
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
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
  "build",
  ".turbo",
  ".vercel",
  ".output",
  ".svelte-kit",
]);
const EXCLUDE_FILE = [
  /\.generated\.[a-z]+$/,
  // リポジトリ内の tokens.css / themes.css と、shadcn registry で copy-in したときの名前（styles/nekodemo-tokens.css）
  /(^|\/)(nekodemo-)?(tokens|themes)\.css$/,
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
        ...(s.manualEar ?? []),
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

/** glob（`**` / `*` / `?`）を正規表現にする。cwd からの相対パスに当てる */
export function globToRegExp(glob) {
  const g = glob.replace(/\\/g, "/").replace(/^\.\//, "");
  let re = "";
  for (let i = 0; i < g.length; i++) {
    const ch = g[i];
    if (ch === "*" && g[i + 1] === "*") {
      if (g[i + 2] === "/") {
        re += "(?:.*/)?"; // `**/` … 0 階層以上
        i += 2;
      } else if (i > 0 && g[i - 1] === "/" && i + 2 >= g.length) {
        re = `${re.slice(0, -1)}(?:/.*)?`; // 末尾の `/**` … そのディレクトリ自身も含む
        i += 1;
      } else {
        re += ".*";
        i += 1;
      }
    } else if (ch === "*") re += "[^/]*";
    else if (ch === "?") re += "[^/]";
    else re += ch.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}(/|$)`);
}

/** nekodemo.config.json の check 設定（無ければ空） */
export function loadConfig(cwd = process.cwd()) {
  const p = join(cwd, "nekodemo.config.json");
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, "utf8")).check ?? {};
  } catch {
    return {};
  }
}

/** 渡された対象のうち存在しないもの */
export function missingTargets(targets, cwd = process.cwd()) {
  return targets.filter((t) => !existsSync(resolve(cwd, t)));
}

export function collectFiles(targets, cwd = process.cwd(), { ignore = [] } = {}) {
  const files = [];
  const ignoreRes = ignore.map(globToRegExp);
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
    if (ignoreRes.some((re) => re.test(rel))) return;
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

export function runCheck(targets, { cwd = process.cwd(), enabledRules = null, ignore = [] } = {}) {
  const iconNames = loadIconNames(cwd);
  const config = loadConfig(cwd);
  const allIgnore = [...(config.ignore ?? []), ...ignore];
  const missing = missingTargets(targets, cwd);
  const files = collectFiles(targets, cwd, { ignore: allIgnore });
  const findings = [];
  const toastUsers = [];
  const toasterHosts = [];
  for (const file of files) {
    const rel = relative(cwd, file).split("\\").join("/");
    const source = readFileSync(file, "utf8");
    findings.push(...checkSource(source, rel, { iconNames, enabledRules }));
    if (/\btoast[.(]/.test(source) && !/components\/ui\/toast\//.test(rel)) toastUsers.push(rel);
    if (/<Toaster\b/.test(source) && !/components\/ui\/toast\/|\.stories\.tsx$/.test(rel))
      toasterHosts.push(rel);
  }
  // NK016: toast() を使っているのに <Toaster> が無い / 2 つ以上ある（プロジェクト全体の判定）
  if (!enabledRules || enabledRules.has("NK016")) {
    if (toastUsers.length > 0 && toasterHosts.length === 0) {
      findings.push({
        rule: "NK016",
        severity: "warn",
        file: toastUsers[0],
        line: 1,
        col: 1,
        message: `toast() を使っていますが <Toaster /> がどこにもありません。ルートレイアウトに 1 つ置いてください（${toastUsers.length} ファイルで使用）`,
      });
    } else if (toasterHosts.length > 1) {
      findings.push({
        rule: "NK016",
        severity: "warn",
        file: toasterHosts[1],
        line: 1,
        col: 1,
        message: `<Toaster /> が ${toasterHosts.length} か所にあります（${toasterHosts.join(", ")}）。ルートレイアウトの 1 つだけにしてください`,
      });
    }
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
    missing,
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

/** 直接実行かどうか（pnpm のシンボリックリンク越しでも判定できるように realpath で比べる） */
function isMainModule() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
}

if (isMainModule()) {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const fmtIdx = args.indexOf("--format");
  const format = fmtIdx >= 0 ? args[fmtIdx + 1] : "text";
  const rulesIdx = args.indexOf("--rules");
  const enabledRules = rulesIdx >= 0 ? new Set(args[rulesIdx + 1].split(",")) : null;
  const ignore = args.flatMap((a, i) => (a === "--ignore" ? args[i + 1].split(",") : []));
  const mwIdx = args.indexOf("--max-warnings");
  const maxWarnings = mwIdx >= 0 ? Number(args[mwIdx + 1]) : Number.POSITIVE_INFINITY;
  const VALUE_FLAGS = new Set(["--format", "--rules", "--ignore", "--max-warnings"]);
  const targets = args.filter((a, i) => !a.startsWith("--") && !VALUE_FLAGS.has(args[i - 1]));
  if (targets.length === 0) targets.push("src");
  const result = runCheck(targets, { enabledRules, ignore });
  if (result.missing.length) {
    console.error(
      `[nekodemo check] 対象が見つかりません: ${result.missing.join(", ")}（ディレクトリ名を確認してください）`,
    );
    process.exit(2);
  }
  if (format === "json") {
    console.log(
      JSON.stringify(
        {
          files: result.files,
          iconNamesLoaded: result.iconNamesLoaded,
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
  if (strict && (result.counts.error > 0 || result.counts.warn > maxWarnings)) process.exit(1);
}
