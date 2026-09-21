// テーマごとの役割トークンを解決し、WCAG 2 のコントラスト比を検査する（設計書 §7.6）。
// build:themes から呼ばれるほか、`pnpm check:contrast` で単体でも実行できる。基準未満があれば exit 1。
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, wcagContrast } from "culori";
import { loadTokens } from "./build-tokens.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 検査ペア: [前景, 背景, 最低比]。文字は 4.5、枠線・アイコンは 3（§7.6 に、プレビューで追加した役割を加えた） */
export const PAIRS = [
  ["text-high", "surface-page", 4.5],
  ["text-high", "surface-card", 4.5],
  ["text-high", "surface-well", 4.5],
  ["text-middle", "surface-page", 4.5],
  ["text-middle", "surface-card", 4.5],
  ["text-low", "surface-page", 4.5],
  ["text-low", "surface-card", 4.5],
  ["text-placeholder", "surface-input", 4.5],
  ["text-on-primary", "surface-primary", 4.5],
  ["text-on-primary", "surface-primary-hover", 4.5],
  ["text-on-primary", "surface-primary-active", 4.5],
  ["text-on-negative", "surface-negative", 4.5],
  ["text-link", "surface-page", 4.5],
  ["text-primary", "surface-page", 4.5],
  ["text-primary", "surface-primary-subtle", 4.5],
  ["text-negative", "surface-page", 4.5],
  ["text-negative", "surface-negative-subtle", 4.5],
  ["text-info", "surface-info-subtle", 4.5],
  ["text-success", "surface-success-subtle", 4.5],
  ["text-warning", "surface-warning-subtle", 4.5],
  ["text-inverse", "surface-inverse", 4.5],
  ["border-high", "surface-page", 3],
  ["border-focus", "surface-page", 3],
  ["object-primary", "surface-page", 3],
  ["object-negative", "surface-page", 3],
];

/** themes/*.json を読む（スキーマ以外）。nekodemo.config.json の themes の順に並べる */
export function loadThemes(root = ROOT) {
  const dir = join(root, "themes");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json") && !f.endsWith(".schema.json"));
  const themes = files.map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
  const config = JSON.parse(readFileSync(join(root, "nekodemo.config.json"), "utf8"));
  const order = Array.isArray(config.themes) ? config.themes : [];
  themes.sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.id.localeCompare(b.id);
  });
  return { themes, config };
}

/** 'neutral.900' 等の参照を、そのテーマの実値（oklch 文字列）に解決する */
export function resolveRef(ref, theme, tokens) {
  if (ref === "white") return "oklch(1 0 0)";
  if (ref === "black") return "oklch(0 0 0)";
  if (/^(oklch|oklab|rgb|hsl|color)\(/.test(ref)) return ref;
  const m = /^([a-z]+)\.(\d+)$/.exec(ref);
  if (!m) throw new Error(`テーマ ${theme.id}: 不正な参照 "${ref}"`);
  const [, group, step] = m;
  if (group === "primary" || group === "neutral") {
    const v = theme.palette[group]?.[step];
    if (!v) throw new Error(`テーマ ${theme.id}: palette.${group}.${step} がありません`);
    return v;
  }
  if (group === "accent") {
    const v = theme.palette.accent?.[step];
    if (!v) throw new Error(`テーマ ${theme.id}: palette.accent.${step} がありません`);
    return v;
  }
  const v = tokens.primitives.status[group]?.[step];
  if (!v) throw new Error(`テーマ ${theme.id}: 参照 "${ref}" を解決できません`);
  return v;
}

/** 役割トークン → 実値（scheme の対応表に overrides を適用） */
export function resolveRoles(theme, tokens) {
  const base = tokens.semanticMap[theme.scheme];
  if (!base)
    throw new Error(
      `テーマ ${theme.id}: scheme "${theme.scheme}" の対応表が semantic.map.json にありません`,
    );
  const map = { ...base, ...(theme.overrides?.color ?? {}) };
  const roles = {};
  for (const [role, ref] of Object.entries(map)) {
    if (role.startsWith("$")) continue;
    roles[role] = resolveRef(ref, theme, tokens);
  }
  return roles;
}

export function contrastRatio(fg, bg) {
  const a = parse(fg);
  const b = parse(bg);
  if (!a || !b) throw new Error(`色を解釈できません: "${fg}" / "${bg}"`);
  return wcagContrast(a, b);
}

/** 1 テーマを検査する。results は全ペア、failures は基準未満のペア */
export function checkTheme(theme, tokens = loadTokens()) {
  const roles = resolveRoles(theme, tokens);
  const results = PAIRS.map(([fg, bg, min]) => {
    const ratio = contrastRatio(roles[fg], roles[bg]);
    return { fg, bg, min, ratio: Math.round(ratio * 100) / 100, ok: ratio >= min };
  });
  return { theme: theme.id, results, failures: results.filter((r) => !r.ok) };
}

export function checkAllThemes(root = ROOT) {
  const tokens = loadTokens(root);
  const { themes } = loadThemes(root);
  return themes.map((t) => checkTheme(t, tokens));
}

export function formatReport(reports) {
  const lines = [];
  for (const r of reports) {
    const n = r.results.length - r.failures.length;
    lines.push(
      `${r.failures.length === 0 ? "✓" : "×"} ${r.theme}: ${n}/${r.results.length} ペア合格`,
    );
    for (const f of r.failures) {
      lines.push(`    × ${f.fg} on ${f.bg}: ${f.ratio}:1（最低 ${f.min}:1）`);
    }
  }
  return lines.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const reports = checkAllThemes();
  console.log(formatReport(reports));
  if (reports.some((r) => r.failures.length > 0)) {
    console.error(
      "\n[check:contrast] 基準未満のペアがあります。themes/*.json のパレットを調整してください。",
    );
    process.exit(1);
  }
}
