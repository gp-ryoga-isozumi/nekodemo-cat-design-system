// @vitest-environment node
// src/components/ui の全部品が公開 API（src/index.ts）から export されていること（部品追加時の漏れを防ぐ）
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

it("src/components/ui/* が src/index.ts からすべて export されている", () => {
  const uiDir = join(ROOT, "src", "components", "ui");
  const slugs = readdirSync(uiDir).filter((d) => existsSync(join(uiDir, d, "index.tsx")));
  const index = readFileSync(join(ROOT, "src", "index.ts"), "utf8");
  const missing = slugs.filter((s) => !index.includes(`"./components/ui/${s}"`));
  expect(missing, `src/index.ts に export が無い部品: ${missing.join(", ")}`).toEqual([]);
  expect(slugs.length).toBeGreaterThanOrEqual(37);
});
