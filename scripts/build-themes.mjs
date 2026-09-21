// themes/*.json → src/styles/themes.css ＋ src/themes/registry.ts ＋ src/components/theme/NekoHead.tsx を生成する（設計書 §7.3）。
// 手順: 1. JSON Schema 検証（ajv） → 2. 役割トークンの解決（scheme の対応表 ＋ overrides） → 3. コントラスト検査（§7.6）
//       → 4. CSS 出力 → 5. registry.ts 出力 → 6. NekoHead.tsx 出力（フォント URL の検証つき）
// 出力は生成物なので手で編集しない。`pnpm build:themes` で再生成する。
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { loadTokens } from "./build-tokens.mjs";
import { checkTheme, formatReport, loadThemes, resolveRoles } from "./check-contrast.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const STORAGE_KEY = "neko-theme";
const MATERIAL_SYMBOLS_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,500,0..1,0&display=block";

/* ---------- 1. 検証 ---------- */
export function validateThemes(themes, root = ROOT) {
  const schema = JSON.parse(readFileSync(join(root, "themes", "neko-theme.schema.json"), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const errors = [];
  for (const theme of themes) {
    if (!validate(theme)) {
      for (const e of validate.errors ?? [])
        errors.push(`${theme.id ?? "(id なし)"}: ${e.instancePath || "/"} ${e.message}`);
    }
  }
  return errors;
}

/* ---------- 4. themes.css ---------- */
function fontStack(font) {
  return `"${font.family}", ${font.fallback}`;
}

function themeBlockLines(theme, tokens) {
  const lines = [];
  lines.push(`color-scheme: ${theme.scheme};`);
  lines.push("/* プリミティブ（このテーマだけの値） */");
  for (const p of ["primary", "neutral"])
    for (const s of STEPS) lines.push(`--nk-p-${p}-${s}: ${theme.palette[p][s]};`);
  for (const a of ["1", "2", "3"]) lines.push(`--nk-p-accent-${a}: ${theme.palette.accent[a]};`);
  for (const r of ["action", "container", "modal", "notice"]) {
    lines.push(
      `--nk-p-radius-${r}: ${tokens.primitives.radius[theme.radius[r]]}; /* ${theme.radius[r]} */`,
    );
  }
  lines.push(`--nk-p-font-pro: ${fontStack(theme.fonts.pro)};`);
  lines.push(`--nk-p-font-mono: ${fontStack(theme.fonts.mono)};`);
  lines.push(`--nk-p-shadow-tint: ${theme.shadowTint ?? "oklch(0 0 0)"};`);
  lines.push(
    `/* 役割層（scheme: ${theme.scheme}${Object.keys(theme.overrides?.color ?? {}).length ? "、overrides あり" : ""}）。実値で書く */`,
  );
  const roles = resolveRoles(theme, tokens);
  for (const [role, value] of Object.entries(roles)) lines.push(`--nk-color-${role}: ${value};`);
  return lines;
}

export function generateThemesCss({ themes, config, tokens }) {
  const out = [];
  out.push(
    "/* 生成物: scripts/build-themes.mjs が themes/*.json から生成する。手で編集しない（pnpm build:themes）。 */",
  );
  out.push(
    `/* 既定テーマ（:root に併記）: ${config.defaultTheme}。属性が無い HTML でも既定テーマで表示される。 */\n`,
  );
  for (const theme of themes) {
    const selector =
      theme.id === config.defaultTheme
        ? `:root,\n[data-neko-theme="${theme.id}"]`
        : `[data-neko-theme="${theme.id}"]`;
    out.push(`/* ${theme.label.ja}（${theme.label.en}） */`);
    out.push(
      `${selector} {\n${themeBlockLines(theme, tokens)
        .map((l) => `  ${l}`)
        .join("\n")}\n}\n`,
    );
  }
  return out.join("\n");
}

/* ---------- 5. registry.ts ---------- */
export function generateRegistryTs({ themes, config }) {
  const entries = themes.map((t) =>
    JSON.stringify(
      {
        id: t.id,
        scheme: t.scheme,
        label: t.label,
        mood: t.mood,
        fonts: { pro: t.fonts.pro.family, mono: t.fonts.mono.family },
        mascot: t.mascot,
      },
      null,
      2,
    ),
  );
  return [
    "// 生成物: scripts/build-themes.mjs が themes/*.json から生成する。手で編集しない（pnpm build:themes）。",
    "",
    "export const nekoThemes = [",
    entries.map((e) => e.replace(/^/gm, "  ")).join(",\n"),
    "] as const;",
    "",
    "export type NekoTheme = (typeof nekoThemes)[number];",
    'export type NekoThemeId = NekoTheme["id"];',
    "",
    `export const nekoThemeIds = nekoThemes.map((t) => t.id) as NekoThemeId[];`,
    `export const defaultNekoTheme: NekoThemeId = ${JSON.stringify(config.defaultTheme)};`,
    `export const NEKO_THEME_STORAGE_KEY = ${JSON.stringify(STORAGE_KEY)};`,
    "",
    "export function isNekoThemeId(value: unknown): value is NekoThemeId {",
    '  return typeof value === "string" && (nekoThemeIds as string[]).includes(value);',
    "}",
    "",
  ].join("\n");
}

/* ---------- 6. NekoHead.tsx ---------- */
export function collectFontFamilies(themes) {
  const families = new Map();
  for (const t of themes) {
    for (const f of [t.fonts.pro, t.fonts.mono]) {
      const set = families.get(f.family) ?? new Set();
      for (const w of f.weights) set.add(w);
      families.set(f.family, set);
    }
  }
  return [...families.entries()].map(([family, weights]) => ({
    family,
    weights: [...weights].sort((a, b) => a - b),
  }));
}

export function googleFontsUrl(families) {
  const parts = families.map(
    ({ family, weights }) => `family=${family.replace(/ /g, "+")}:wght@${weights.join(";")}`,
  );
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}

export function generateNekoHeadTsx({ themes }) {
  const ids = themes.map((t) => t.id);
  const url = googleFontsUrl(collectFontFamilies(themes));
  const script =
    `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});` +
    `if(t&&${JSON.stringify(ids)}.indexOf(t)>=0){document.documentElement.setAttribute("data-neko-theme",t)}}catch(e){}})();`;
  return [
    "// 生成物: scripts/build-themes.mjs が themes/*.json から生成する。手で編集しない（pnpm build:themes）。",
    "",
    "/**",
    " * NekoHead",
    " *",
    " * 概要: <head> に置く。全テーマのフォント（Google Fonts）と Material Symbols Rounded（猫版が無いアイコンのフォールバック）の",
    " * <link> を出し、persist 時は hydration 前に localStorage のテーマを <html data-neko-theme> に反映する inline script を出す（ちらつき防止）。",
    " *",
    " * アンチパターン:",
    " * - <body> 内に置く（フォントの preconnect が遅れる）",
    " * - persist=false なのに NekoThemeProvider に persist を渡す（保存はされるが初回表示が既定テーマになる）",
    " *",
    " * 使用例:",
    " * ```tsx",
    ' * <html lang="ja" data-neko-theme="calico">',
    " *   <head><NekoHead /></head>",
    " * ```",
    " */",
    "export function NekoHead({ persist = true }: { persist?: boolean }) {",
    "  return (",
    "    <>",
    '      <link rel="preconnect" href="https://fonts.googleapis.com" />',
    '      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />',
    `      <link rel="stylesheet" href=${JSON.stringify(url)} />`,
    `      <link rel="stylesheet" href=${JSON.stringify(MATERIAL_SYMBOLS_URL)} />`,
    "      {persist ? (",
    "        // biome-ignore lint/security/noDangerouslySetInnerHtml: 固定文字列（テーマ ID の一覧）で、利用者入力は含まない",
    `        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(script)} }} />`,
    "      ) : null}",
    "    </>",
    "  );",
    "}",
    "",
  ].join("\n");
}

/** Google Fonts の CSS を取得して、フォントが存在すること（400 系の HTTP でないこと）を確認する */
export async function verifyFontUrl(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`フォント URL の検証に失敗しました（HTTP ${res.status}）: ${url}`);
  const css = await res.text();
  if (!/@font-face/.test(css))
    throw new Error(`フォント URL の応答に @font-face が含まれません: ${url}`);
  return css;
}

/* ---------- main ---------- */
export async function buildThemes({ root = ROOT, skipFontCheck = false } = {}) {
  const tokens = loadTokens(root);
  const { themes, config } = loadThemes(root);

  const errors = validateThemes(themes, root);
  if (errors.length > 0)
    throw new Error(`テーマ JSON がスキーマに合いません:\n  ${errors.join("\n  ")}`);
  if (!themes.some((t) => t.id === config.defaultTheme)) {
    throw new Error(
      `nekodemo.config.json の defaultTheme "${config.defaultTheme}" に対応するテーマがありません`,
    );
  }

  const reports = themes.map((t) => checkTheme(t, tokens));
  console.log(formatReport(reports));
  if (reports.some((r) => r.failures.length > 0)) {
    throw new Error(
      "コントラスト検査（§7.6）が基準未満です。themes/*.json のパレットを調整してください。",
    );
  }

  if (!skipFontCheck) {
    const url = googleFontsUrl(collectFontFamilies(themes));
    await verifyFontUrl(url);
    console.log(`[build:themes] フォント URL を検証しました: ${url}`);
  }

  const outputs = {
    "src/styles/themes.css": generateThemesCss({ themes, config, tokens }),
    "src/themes/registry.ts": generateRegistryTs({ themes, config }),
    "src/components/theme/NekoHead.tsx": generateNekoHeadTsx({ themes }),
  };
  for (const [rel, content] of Object.entries(outputs)) {
    const p = join(root, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
    console.log(`[build:themes] ${rel} を生成しました`);
  }
  return outputs;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const skipFontCheck =
    process.argv.includes("--skip-font-check") || process.env.NEKODEMO_SKIP_FONT_CHECK === "1";
  buildThemes({ skipFontCheck }).catch((e) => {
    console.error(`[build:themes] ${e.message}`);
    process.exit(1);
  });
}
