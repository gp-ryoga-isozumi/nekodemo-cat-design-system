// @vitest-environment node
// テーマ JSON の検証、コントラスト検査（§7.6）、生成物の同期（Phase 2 完成条件）
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  collectFontFamilies,
  generateNekoHeadTsx,
  generateRegistryTs,
  generateThemesCss,
  googleFontsUrl,
  validateThemes,
} from "./build-themes.mjs";
import { loadTokens } from "./build-tokens.mjs";
import { checkAllThemes, loadThemes, resolveRoles } from "./check-contrast.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = loadTokens(root);
const { themes, config } = loadThemes(root);

describe("themes/*.json", () => {
  it("3 テーマがあり、nekodemo.config.json の themes と一致する", () => {
    expect(themes.map((t) => t.id)).toEqual(config.themes);
    expect(themes.map((t) => t.id)).toContain(config.defaultTheme);
  });

  it("すべて JSON Schema に合う", () => {
    expect(validateThemes(themes, root)).toEqual([]);
  });

  it("不正なテーマ（scheme 不明・段階不足・ウェイトに 700 が無い）はスキーマで弾かれる", () => {
    const bad = structuredClone(themes[0]);
    bad.scheme = "night";
    delete bad.palette.neutral["500"];
    bad.fonts.pro.weights = [400];
    const errors = validateThemes([bad], root);
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });

  it("scheme が dark のテーマは dark の対応表で役割が解決される", () => {
    const dark = themes.find((t) => t.scheme === "dark");
    expect(dark).toBeDefined();
    const roles = resolveRoles(dark, tokens);
    expect(roles["surface-page"]).toBe(dark.palette.neutral["900"]);
    expect(roles["text-high"]).toBe(dark.palette.neutral["50"]);
  });

  it("overrides はそのテーマだけの役割を差し替える", () => {
    const calico = themes.find((t) => t.id === "calico");
    expect(resolveRoles(calico, tokens)["text-high"]).toBe(calico.palette.accent["1"]);
  });
});

describe("コントラスト検査（§7.6）", () => {
  const reports = checkAllThemes(root);
  it.each(reports.map((r) => [r.theme, r]))("%s: 全ペアが基準以上", (_id, report) => {
    expect(report.failures).toEqual([]);
    expect(report.results.length).toBeGreaterThan(20);
  });
});

describe("生成物の同期（pnpm build:themes の実行忘れを検出）", () => {
  it("src/styles/themes.css", () => {
    expect(readFileSync(join(root, "src/styles/themes.css"), "utf8")).toBe(
      generateThemesCss({ themes, config, tokens }),
    );
  });
  it("src/themes/registry.ts", () => {
    expect(readFileSync(join(root, "src/themes/registry.ts"), "utf8")).toBe(
      generateRegistryTs({ themes, config }),
    );
  });
  it("src/components/theme/NekoHead.tsx", () => {
    expect(readFileSync(join(root, "src/components/theme/NekoHead.tsx"), "utf8")).toBe(
      generateNekoHeadTsx({ themes }),
    );
  });
});

describe("themes.css の形（§7.3）", () => {
  const css = generateThemesCss({ themes, config, tokens });
  it("既定テーマは :root に併記され、他は属性セレクタだけ", () => {
    expect(css).toContain(`:root,\n[data-neko-theme="${config.defaultTheme}"] {`);
    for (const t of themes.filter((t) => t.id !== config.defaultTheme)) {
      expect(css).toContain(`\n[data-neko-theme="${t.id}"] {`);
      expect(css).not.toContain(`:root,\n[data-neko-theme="${t.id}"]`);
    }
  });
  it("テーマブロックの値は実値で、var() の連鎖を書かない", () => {
    expect(css).not.toMatch(/--nk-p-[a-z-]+: var\(/);
    expect(css).not.toMatch(/--nk-color-[a-z-]+: var\(/);
  });
  it("dark テーマは color-scheme: dark を出す", () => {
    expect(css).toMatch(/\[data-neko-theme="russian-blue"\] \{\n {2}color-scheme: dark;/);
  });
});

describe("フォント", () => {
  it("ファミリーとウェイトを重複なくまとめた Google Fonts URL になる", () => {
    expect(googleFontsUrl(collectFontFamilies(themes))).toBe(
      "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&family=Noto+Sans+Mono:wght@400;700&display=swap",
    );
  });
});
