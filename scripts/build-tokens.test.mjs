// @vitest-environment node
// tokens.css の生成と、Tailwind v4 での「既定パレット無効化 ＋ @theme inline」の動作検証（設計書 §6.2 の【未確認】、§15 Phase 1 完成条件）。
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { beforeAll, describe, expect, it } from "vitest";
import { bridgeValueToCss, generateTokensCss, refToCss } from "./build-tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("build-tokens", () => {
  it("生成物がコミット済みの src/styles/tokens.css と一致する（pnpm build:tokens の実行忘れを検出）", () => {
    const committed = readFileSync(join(root, "src/styles/tokens.css"), "utf8");
    expect(committed).toBe(generateTokensCss());
  });

  it("参照の解決", () => {
    expect(refToCss("neutral.900")).toBe("var(--nk-color-neutral-900)");
    expect(refToCss("white")).toBe("var(--nk-color-white)");
    expect(refToCss("oklch(0.2 0.02 250 / 0.45)")).toBe("oklch(0.2 0.02 250 / 0.45)");
    expect(() => refToCss("nope")).toThrow();
    expect(bridgeValueToCss("surface-page")).toBe("var(--nk-color-surface-page)");
    expect(bridgeValueToCss("radius-action")).toBe("var(--nk-radius-action)");
    expect(bridgeValueToCss("accent-1")).toBe("var(--nk-color-accent-1)");
  });
});

describe("Tailwind ユーティリティ（globals.css をコンパイルして確認）", () => {
  const generated = [
    ["bg-primary-600", "var(--nk-color-primary-600)"],
    ["bg-white", "var(--nk-color-white)"],
    ["bg-info-50", "var(--nk-color-info-50)"],
    ["text-text-high", "var(--nk-color-text-high)"],
    ["bg-surface-card", "var(--nk-color-surface-card)"],
    ["border-border-focus", "var(--nk-color-border-focus)"],
    ["bg-primary", "var(--primary)"],
    ["text-muted-foreground", "var(--muted-foreground)"],
    ["rounded-action", "var(--nk-radius-action)"],
    ["rounded-md", "calc(var(--radius) - 2px)"],
    ["rounded-round", "9999px"],
    ["shadow-raise", "var(--nk-shadow-raise)"],
    ["shadow-xs", "var(--nk-shadow-raise)"],
    ["font-pro", "var(--nk-font-pro)"],
    ["font-mono", "var(--nk-font-mono)"],
    ["text-3", "var(--nk-text-3)"],
    ["text-3", "var(--nk-leading-3)"],
    ["text-sm", "var(--nk-text-2)"],
    ["font-bold", "font-weight"],
    ["font-normal", "font-weight"],
  ];
  const notGenerated = [
    "bg-blue-500",
    "bg-slate-100",
    "text-gray-600",
    "border-zinc-200",
    "font-semibold",
    "font-medium",
    "font-light",
    "font-serif",
    "text-5xl",
    "rounded-2xl",
  ];

  let css = "";
  beforeAll(async () => {
    const entry = readFileSync(join(root, "src/styles/globals.css"), "utf8");
    const compiler = await compile(entry, { base: join(root, "src/styles"), onDependency() {} });
    css = compiler.build([...generated.map(([c]) => c), ...notGenerated]);
  });

  it.each(generated)("生成される: %s → %s", (cls, expected) => {
    const escaped = cls.replace(/([./])/g, "\\$1");
    expect(css).toContain(`.${escaped}`);
    expect(css).toContain(expected);
  });

  it.each(notGenerated)("生成されない（既定パレット・既定ウェイト等）: %s", (cls) => {
    const escaped = cls.replace(/([./])/g, "\\$1");
    expect(css).not.toContain(`.${escaped} `);
    expect(css).not.toContain(`.${escaped}{`);
  });

  it("既定パレットの色値（例: Tailwind blue-500 の oklch）が CSS に一切含まれない", () => {
    expect(css).not.toMatch(/oklch\(62\.3% 0\.214 259\.815\)/);
  });
});
