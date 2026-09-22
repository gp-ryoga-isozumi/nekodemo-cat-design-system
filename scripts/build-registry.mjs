// shadcn registry を組み立てる（設計書 §12）。
//   1. src/components/ui/*/item.json を集めて registry.json を生成する（＋ styles / theme / mascot / lib の項目）
//   2. `shadcn build` で public/r/<name>.json を出力し、llms.txt を public/ にコピーする（GitHub Pages で配信）
// `pnpm build:registry`

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOMEPAGE = "https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system";

/** tw-animate-css のクラス（これを使う部品は dependencies に tw-animate-css を持つ） */
export const ANIMATE_CLASS =
  /\b(?:animate-(?:in|out)|fade-(?:in|out)|zoom-(?:in|out)|slide-(?:in|out)-|animate-accordion)/;

/** skills/add-nekodemo-component/SKILL.md の「部品名」一覧を registry から生成して書き戻す（手書きだと更新漏れするため） */
export function updateSkillList(items, root = ROOT) {
  const p = join(root, "skills", "add-nekodemo-component", "SKILL.md");
  if (!existsSync(p)) return false;
  const src = readFileSync(p, "utf8");
  const names = items
    .filter((i) => i.type === "registry:ui" && i.files?.[0]?.path?.startsWith("src/components/ui/"))
    .map((i) => i.name)
    .sort();
  const heading = "## 部品名（registry の name）";
  const idx = src.indexOf(heading);
  if (idx === -1) return false;
  const after = src.indexOf("\n\n", idx + heading.length);
  const end = src.indexOf("\n\n", after + 2);
  const next = `${src.slice(0, after + 2)}${names.join(", ")}${src.slice(end)}`;
  if (next !== src) writeFileSync(p, next);
  return true;
}

export function collectItems(root = ROOT) {
  const uiDir = join(root, "src", "components", "ui");
  const items = [];
  for (const name of readdirSync(uiDir).sort()) {
    const p = join(uiDir, name, "item.json");
    if (!existsSync(p)) continue;
    const item = JSON.parse(readFileSync(p, "utf8"));
    // 部品は lib（cn）と styles（役割トークンの CSS）に依存する。icon は icons.generated.ts を同梱
    item.registryDependencies = [
      ...new Set([...(item.registryDependencies ?? []), "lib", "styles"]),
    ];
    // animate-in / fade-in / slide-in 等のクラスを使う部品は tw-animate-css が要る（import には現れない依存）
    const src = readFileSync(join(uiDir, name, "index.tsx"), "utf8");
    if (ANIMATE_CLASS.test(src)) {
      item.dependencies = [...new Set([...(item.dependencies ?? []), "tw-animate-css"])];
    }
    items.push(item);
  }
  return items;
}

export function extraItems() {
  return [
    {
      name: "lib",
      type: "registry:lib",
      title: "lib（cn）",
      description: "クラス名の結合。tailwind-merge に nekodemo の文字サイズ・角丸・影を登録済み",
      dependencies: ["clsx", "tailwind-merge"],
      files: [{ path: "src/lib/utils.ts", type: "registry:lib", target: "lib/utils.ts" }],
    },
    {
      name: "styles",
      type: "registry:file",
      title: "styles（トークンとテーマの CSS）",
      description:
        'tokens.css（Tailwind 既定パレットの無効化と役割トークン）と themes.css（3 テーマ）。エントリ CSS で @import "tailwindcss" の後に 2 つを @import する',
      dependencies: ["tw-animate-css"],
      files: [
        {
          path: "src/styles/tokens.css",
          type: "registry:file",
          target: "styles/nekodemo-tokens.css",
        },
        {
          path: "src/styles/themes.css",
          type: "registry:file",
          target: "styles/nekodemo-themes.css",
        },
      ],
    },
    {
      name: "themes",
      type: "registry:lib",
      title: "themes（テーマ一覧）",
      description: "3 テーマの id・名前・雰囲気語・scheme の一覧と型",
      files: [
        { path: "src/themes/registry.ts", type: "registry:lib", target: "themes/registry.ts" },
      ],
    },
    {
      name: "mascot",
      type: "registry:ui",
      title: "Mascot",
      description: "テーマごとの猫の顔（空状態・初回ローディング・404・ログイン用）",
      registryDependencies: ["lib", "themes"],
      files: [
        {
          path: "src/components/mascot/index.tsx",
          type: "registry:ui",
          target: "components/mascot/index.tsx",
        },
      ],
    },
    {
      name: "theme",
      type: "registry:ui",
      title: "theme（NekoThemeProvider / NekoThemePicker / NekoHead）",
      description:
        "テーマのランタイム切替。NekoHead はフォントとアイコンフォントの <link> と、persist 用の inline script",
      registryDependencies: ["lib", "themes", "mascot", "styles"],
      files: [
        {
          path: "src/components/theme/NekoThemeProvider.tsx",
          type: "registry:ui",
          target: "components/theme/NekoThemeProvider.tsx",
        },
        {
          path: "src/components/theme/NekoThemePicker.tsx",
          type: "registry:ui",
          target: "components/theme/NekoThemePicker.tsx",
        },
        {
          path: "src/components/theme/NekoHead.tsx",
          type: "registry:ui",
          target: "components/theme/NekoHead.tsx",
        },
      ],
    },
  ];
}

export function generateRegistry(root = ROOT) {
  const items = [...collectItems(root), ...extraItems()];
  // registryDependencies は shadcn の書式（同じ registry 内の名前）に揃える
  for (const item of items) {
    item.registryDependencies = (item.registryDependencies ?? []).map((d) =>
      d.startsWith("@") || d.startsWith("http") ? d : `@nekodemo/${d}`,
    );
  }
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "nekodemo",
    homepage: HOMEPAGE,
    items,
  };
}

export function buildRegistry({ root = ROOT, log = console.log, runShadcn = true } = {}) {
  const registry = generateRegistry(root);
  writeFileSync(join(root, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
  log(`[build:registry] registry.json を生成しました（${registry.items.length} 項目）`);
  if (updateSkillList(registry.items, root))
    log("[build:registry] skills/add-nekodemo-component の部品名一覧を更新しました");
  if (!runShadcn) return registry;
  mkdirSync(join(root, "public", "r"), { recursive: true });
  copyFileSync(join(root, "llms.txt"), join(root, "public", "llms.txt"));
  const result = spawnSync("pnpm", ["exec", "shadcn", "build", "--output", "public/r"], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error("shadcn build に失敗しました");
  log("[build:registry] public/r/*.json と public/llms.txt を出力しました");
  return registry;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    buildRegistry({ runShadcn: !process.argv.includes("--no-shadcn") });
  } catch (e) {
    console.error(`[build:registry] ${e.message}`);
    process.exit(1);
  }
}
