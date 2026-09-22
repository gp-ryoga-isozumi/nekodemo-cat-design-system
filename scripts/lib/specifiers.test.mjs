// @vitest-environment node
import { describe, expect, it } from "vitest";
import { rewriteSpecifiers } from "./specifiers.mjs";

// 仮想の dist: ./utils.js と ./button/index.js があり、./missing は無い
const env = (isDts = false) => ({
  isDts,
  resolve: (spec) => `/dist/${spec.replace(/^\.\//, "").replace(/^\.\.\//, "up/")}`,
  fileExists: (p) => ["/dist/utils.js", "/dist/utils.d.ts", "/dist/up/lib/cn.js"].includes(p),
  isDirectory: (p) => p === "/dist/button",
});

describe("rewriteSpecifiers", () => {
  it("ファイルには .js、ディレクトリには /index.js を補う", () => {
    const src = `import { cn } from "./utils";\nimport { Button } from "./button";\nexport { x } from "../lib/cn";`;
    expect(rewriteSpecifiers(src, env())).toBe(
      `import { cn } from "./utils.js";\nimport { Button } from "./button/index.js";\nexport { x } from "../lib/cn.js";`,
    );
  });

  it("動的 import と型だけの import も書き換える", () => {
    expect(rewriteSpecifiers(`const m = await import("./utils");`, env())).toBe(
      `const m = await import("./utils.js");`,
    );
    expect(rewriteSpecifiers(`import type { A } from "./utils";`, env(true))).toBe(
      `import type { A } from "./utils.js";`,
    );
  });

  it("拡張子つき（.js / .css / .json）と外部パッケージ、存在しないものは触らない", () => {
    const src = `import "./styles.css";\nimport d from "./data.json";\nimport { cn } from "./utils.js";\nimport React from "react";\nimport x from "./missing";`;
    expect(rewriteSpecifiers(src, env())).toBe(src);
  });

  it(".d.ts では .d.ts の存在で判定する（出力の拡張子は .js のまま）", () => {
    expect(rewriteSpecifiers(`export * from "./utils";`, env(true))).toBe(
      `export * from "./utils.js";`,
    );
  });
});
