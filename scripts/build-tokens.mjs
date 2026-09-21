// tokens/*.json → src/styles/tokens.css を生成する（設計書 §6.2）。
// 出力は生成物なので手で編集しない。`pnpm build:tokens` で再生成する。
//
// 構成:
//   1. @theme        … Tailwind 既定のパレット・サイズ・フォント・角丸・影を無効化（D7）。ウェイトは 400 / 700 だけ再定義
//      （--font-*: initial は --font-weight-* を消さないため、--font-weight-*: initial も明示する。Phase 1 のスパイクで確認）
//   2. @theme inline … セマンティック層・役割層・形状・タイポを Tailwind ユーティリティとして公開（値は CSS 変数参照）
//   3. :root, [data-neko-theme] … セマンティック層・役割層（light）の実体。テーマを付けた要素でも解決されるよう両方に定義する
//   4. :root, [data-neko-theme] … shadcn 変数ブリッジ（§6.3）
//   5. @layer base   … body と border-color の既定
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const THEME_PALETTES = ["primary", "neutral"];
const STATUS = ["info", "success", "warning", "negative"];
const ACCENTS = ["1", "2", "3"];
const RADIUS_ROLES = ["action", "container", "modal", "notice"];
const SHADOW_ROLES = ["raise", "float", "popout"];
const SHADCN_SHADOW_ALIASES = {
  xs: "raise",
  sm: "raise",
  md: "float",
  lg: "popout",
  xl: "popout",
  "2xl": "popout",
};

export function loadTokens(root = ROOT) {
  const read = (name) => JSON.parse(readFileSync(join(root, "tokens", name), "utf8"));
  return {
    primitives: read("primitives.json"),
    semanticMap: read("semantic.map.json"),
    bridge: read("shadcn-bridge.json"),
  };
}

/** 'neutral.900' | 'primary.600' | 'info.50' | 'accent.1' | 'white' | 'black' | 'oklch(...)' → CSS の値 */
export function refToCss(ref) {
  if (ref === "white" || ref === "black") return `var(--nk-color-${ref})`;
  if (/^(oklch|oklab|rgb|hsl|color)\(/.test(ref) || ref === "transparent") return ref;
  const m = /^([a-z]+)\.(\d+)$/.exec(ref);
  if (!m) throw new Error(`semantic.map.json: 不正な参照 "${ref}"`);
  return `var(--nk-color-${m[1]}-${m[2]})`;
}

/** shadcn-bridge.json の値 → CSS の値 */
export function bridgeValueToCss(value) {
  if (value.startsWith("radius-")) return `var(--nk-${value})`;
  return `var(--nk-color-${value})`;
}

/** 役割トークンの一覧（light の対応表のキー順） */
export function roleNames(semanticMap) {
  return Object.keys(semanticMap.light).filter((k) => !k.startsWith("$"));
}

function block(selector, lines) {
  return `${selector} {\n${lines.map((l) => `  ${l}`).join("\n")}\n}\n`;
}

export function generateTokensCss(tokens = loadTokens()) {
  const { primitives, semanticMap, bridge } = tokens;
  const roles = roleNames(semanticMap);
  const scale = primitives.typography.scale;
  const aliases = Object.entries(primitives.typography.aliases).filter(([k]) => !k.startsWith("$"));
  const bridgeEntries = Object.entries(bridge).filter(([k]) => !k.startsWith("$"));
  const out = [];

  out.push(
    `/* 生成物: scripts/build-tokens.mjs が tokens/*.json から生成する。手で編集しない（pnpm build:tokens）。 */\n`,
  );

  // 1. 既定の無効化
  out.push(
    "/* 1. Tailwind 既定のパレット・サイズ・フォント・角丸・影を無効化（D7）。ウェイトは 400 / 700 だけを存在させる */",
  );
  out.push(
    block("@theme", [
      "--color-*: initial;",
      "--text-*: initial;",
      "--font-*: initial;",
      "--font-weight-*: initial;",
      "--radius-*: initial;",
      "--shadow-*: initial;",
      `--font-weight-normal: ${primitives.typography.weights.normal};`,
      `--font-weight-bold: ${primitives.typography.weights.bold};`,
    ]),
  );

  // 2. @theme inline
  const inline = [];
  inline.push("/* 色: セマンティック層（bg-primary-600 等） */");
  inline.push("--color-white: var(--nk-color-white);", "--color-black: var(--nk-color-black);");
  for (const p of [...THEME_PALETTES, ...STATUS])
    for (const s of STEPS) inline.push(`--color-${p}-${s}: var(--nk-color-${p}-${s});`);
  for (const a of ACCENTS) inline.push(`--color-accent-${a}: var(--nk-color-accent-${a});`);
  inline.push(
    "/* 色: 役割層（bg-surface-card / text-text-high / border-border-focus 等）。部品は原則これだけを使う */",
  );
  for (const r of roles) inline.push(`--color-${r}: var(--nk-color-${r});`);
  inline.push(
    "/* 色: shadcn 互換名（bg-primary / text-muted-foreground 等）。copy-in した部品のため */",
  );
  for (const [k, v] of bridgeEntries)
    if (!v.startsWith("radius-")) inline.push(`--color-${k}: var(--${k});`);
  inline.push("/* 角丸 */");
  for (const r of RADIUS_ROLES) inline.push(`--radius-${r}: var(--nk-radius-${r});`);
  inline.push("--radius-round: 9999px;");
  inline.push("/* shadcn 互換の rounded-sm/md/lg/xl は --radius（= rounded-action）から算出 */");
  inline.push(
    "--radius-sm: calc(var(--radius) - 4px);",
    "--radius-md: calc(var(--radius) - 2px);",
    "--radius-lg: var(--radius);",
    "--radius-xl: calc(var(--radius) + 4px);",
  );
  inline.push("/* 影 */");
  for (const s of SHADOW_ROLES) inline.push(`--shadow-${s}: var(--nk-shadow-${s});`);
  for (const [k, v] of Object.entries(SHADCN_SHADOW_ALIASES))
    inline.push(`--shadow-${k}: var(--nk-shadow-${v});`);
  inline.push("/* フォント（font-pro / font-mono。font-sans は font-pro の別名） */");
  inline.push(
    "--font-pro: var(--nk-font-pro);",
    "--font-mono: var(--nk-font-mono);",
    "--font-sans: var(--nk-font-pro);",
  );
  inline.push("/* 文字サイズ 12 段階（text-1 〜 text-12）と別名（text-sm 等） */");
  for (const t of scale)
    inline.push(
      `--text-${t.step}: var(--nk-text-${t.step});`,
      `--text-${t.step}--line-height: var(--nk-leading-${t.step});`,
    );
  for (const [alias, step] of aliases)
    inline.push(
      `--text-${alias}: var(--nk-text-${step});`,
      `--text-${alias}--line-height: var(--nk-leading-${step});`,
    );
  out.push(
    "/* 2. セマンティック層・役割層を Tailwind に公開（値は CSS 変数参照。テーマ切替はこの参照先を差し替えるだけ） */",
  );
  out.push(block("@theme inline", inline));

  // 3. 実体
  const base = [];
  base.push("color-scheme: light;");
  base.push("--nk-color-white: oklch(1 0 0);", "--nk-color-black: oklch(0 0 0);");
  base.push("/* セマンティック層: テーマのプリミティブ（--nk-p-*）を参照 */");
  for (const p of THEME_PALETTES)
    for (const s of STEPS) base.push(`--nk-color-${p}-${s}: var(--nk-p-${p}-${s});`);
  for (const a of ACCENTS) base.push(`--nk-color-accent-${a}: var(--nk-p-accent-${a});`);
  base.push("/* ステータス色: 全テーマ共通の実値 */");
  for (const st of STATUS)
    for (const s of STEPS) base.push(`--nk-color-${st}-${s}: ${primitives.status[st][s]};`);
  base.push("/* 役割層（light）。テーマ側は scheme に応じてこの一式を上書きする */");
  for (const r of roles) base.push(`--nk-color-${r}: ${refToCss(semanticMap.light[r])};`);
  base.push("/* 角丸・影・フォント・文字サイズ */");
  for (const r of RADIUS_ROLES) base.push(`--nk-radius-${r}: var(--nk-p-radius-${r});`);
  base.push("--nk-radius-round: 9999px;");
  for (const s of SHADOW_ROLES) base.push(`--nk-shadow-${s}: ${primitives.shadow[s]};`);
  base.push("--nk-font-pro: var(--nk-p-font-pro);", "--nk-font-mono: var(--nk-p-font-mono);");
  for (const t of scale)
    base.push(
      `--nk-text-${t.step}: ${t.size};`,
      `--nk-leading-${t.step}: ${t.lineHeight}; /* ${t.px}px */`,
    );
  out.push(
    "/* 3. セマンティック層・役割層の実体。CSS 変数は定義元の要素で解決されるため、:root と [data-neko-theme] の両方に定義する */",
  );
  out.push(block(":root,\n[data-neko-theme]", base));

  // 4. shadcn bridge
  const br = bridgeEntries.map(([k, v]) => `--${k}: ${bridgeValueToCss(v)};`);
  out.push("/* 4. shadcn 変数ブリッジ（tokens/shadcn-bridge.json） */");
  out.push(block(":root,\n[data-neko-theme]", br));

  // 5. base
  out.push("/* 5. ベース */");
  out.push(
    "@layer base {\n" +
      "  *,\n  ::before,\n  ::after {\n    border-color: var(--nk-color-border-middle);\n  }\n" +
      "  body {\n    font-family: var(--nk-font-pro);\n    font-size: var(--nk-text-3);\n    line-height: var(--nk-leading-3);\n    color: var(--nk-color-text-high);\n    background-color: var(--nk-color-surface-page);\n  }\n" +
      "}\n",
  );

  return out.join("\n");
}

export function writeTokensCss(root = ROOT) {
  const css = generateTokensCss(loadTokens(root));
  const outPath = join(root, "src", "styles", "tokens.css");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, css);
  return outPath;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const p = writeTokensCss();
  console.log(`[build:tokens] ${p} を生成しました`);
}
