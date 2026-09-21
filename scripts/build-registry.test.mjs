// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { collectItems, generateRegistry } from "./build-registry.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// 使い方の都合で宣言している依存（部品自身は import しない）
const INTENTIONAL_EXTRA_DEPS = { form: ["zod", "@hookform/resolvers"] };

/** ソースファイルから、他の registry 項目と npm パッケージへの依存を読む */
function importsOf(file) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const items = new Set();
  const pkgs = new Set();
  for (const [, spec] of src.matchAll(/from "([^"]+)"/g)) {
    if (spec.startsWith("../../../lib") || spec.startsWith("../../lib")) items.add("lib");
    else if (spec.startsWith("../../themes") || spec.startsWith("../../../themes"))
      items.add("themes");
    else if (spec.startsWith("../../theme")) items.add("theme");
    else if (spec.startsWith("../../mascot")) items.add("mascot");
    else if (spec.startsWith("../")) items.add(spec.replace(/^\.\.\//, "").split("/")[0]);
    else if (!spec.startsWith(".")) {
      const parts = spec.split("/");
      pkgs.add(parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
    }
  }
  pkgs.delete("react");
  pkgs.delete("react-dom");
  return { items, pkgs };
}

describe("registry", () => {
  const registry = generateRegistry(ROOT);
  const names = registry.items.map((i) => i.name);

  it("項目名が重複せず、参照先のファイルが存在する", () => {
    expect(new Set(names).size).toBe(names.length);
    for (const item of registry.items) {
      for (const f of item.files) {
        expect(existsSync(join(ROOT, f.path)), `${item.name}: ${f.path}`).toBe(true);
        expect(f.target, `${item.name}: ${f.path} に target が無い`).toBeTruthy();
      }
    }
  });

  it("registryDependencies が同じ registry 内の項目を @nekodemo/ で指す", () => {
    for (const item of registry.items) {
      for (const dep of item.registryDependencies ?? []) {
        expect(dep.startsWith("@nekodemo/"), `${item.name} → ${dep}`).toBe(true);
        expect(names, `${item.name} → ${dep}`).toContain(dep.replace("@nekodemo/", ""));
      }
    }
  });

  it("依存に循環が無い", () => {
    const graph = new Map(
      registry.items.map((i) => [
        i.name,
        (i.registryDependencies ?? []).map((d) => d.replace("@nekodemo/", "")),
      ]),
    );
    const state = new Map();
    const visit = (n, path) => {
      if (state.get(n) === "done") return;
      if (state.get(n) === "active") throw new Error(`循環: ${[...path, n].join(" → ")}`);
      state.set(n, "active");
      for (const d of graph.get(n) ?? []) visit(d, [...path, n]);
      state.set(n, "done");
    };
    for (const n of graph.keys()) visit(n, []);
  });

  it("部品の item.json が index.tsx の import と一致する", () => {
    for (const item of collectItems(ROOT)) {
      const { items, pkgs } = importsOf(`src/components/ui/${item.name}/index.tsx`);
      const declared = new Set(
        (item.registryDependencies ?? []).map((d) => d.replace("@nekodemo/", "")),
      );
      for (const need of items)
        expect(declared, `${item.name}: registryDependencies に ${need} が無い`).toContain(need);
      for (const d of declared) {
        if (d === "lib") continue; // 全部品に付ける
        expect(
          items,
          `${item.name}: registryDependencies の ${d} は import されていない`,
        ).toContain(d);
      }
      const declaredPkgs = new Set(item.dependencies ?? []);
      for (const need of pkgs)
        expect(declaredPkgs, `${item.name}: dependencies に ${need} が無い`).toContain(need);
      for (const d of declaredPkgs) {
        if ((INTENTIONAL_EXTRA_DEPS[item.name] ?? []).includes(d)) continue;
        expect(pkgs, `${item.name}: dependencies の ${d} は import されていない`).toContain(d);
      }
    }
  });

  it("theme / mascot の import が項目の依存と一致する", () => {
    for (const name of ["mascot", "theme"]) {
      const item = registry.items.find((i) => i.name === name);
      const declared = new Set(item.registryDependencies.map((d) => d.replace("@nekodemo/", "")));
      for (const f of item.files) {
        const { items } = importsOf(f.path);
        for (const need of items) {
          if (need !== name)
            expect(declared, `${name}: ${f.path} が import する ${need}`).toContain(need);
        }
      }
    }
  });
});
