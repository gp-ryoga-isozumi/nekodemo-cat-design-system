// icons/wanted.txt ＋ icons/src/*.svg（T1）＋ @material-symbols/svg-500（T2 の元）→
//   src/components/ui/icon/icons.generated.ts（Icon 部品が引くマップ）と icons/status.json（tier ごとの一覧）を生成する（設計書 §8）。
// 途中結果として icons/generated/<name>.svg（レビュー用、git 管理外）も書く。`pnpm build:icons`。
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { addEars, materialToGrid, svgToGrid } from "./add-ears.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function parseWanted(text) {
  const out = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = /^([a-z0-9_]+)\s*(.*)$/.exec(line);
    if (!m) throw new Error(`icons/wanted.txt: 解釈できない行 "${line}"`);
    out.push({ name: m[1], description: m[2] ?? "" });
  }
  return out;
}

export function loadManifest(root = ROOT) {
  return JSON.parse(readFileSync(join(root, "icons", "manifest.json"), "utf8"));
}

export function isEarless(name, manifest) {
  if (manifest.earless.includes(name)) return true;
  return (manifest.earlessPatterns ?? []).some((p) => new RegExp(p).test(name));
}

/** T1 の SVG: class="ears" の path を耳、それ以外を本体として読む */
function parseBespoke(svgText) {
  const paths = [...svgText.matchAll(/<path\b([^>]*)>/g)].map((m) => m[1]);
  const body = [];
  const ears = [];
  for (const attrs of paths) {
    const d = /\sd="([^"]+)"/.exec(attrs)?.[1];
    if (!d) continue;
    if (/class="[^"]*\bears\b[^"]*"/.test(attrs)) ears.push(d);
    else body.push(d);
  }
  if (body.length === 0) throw new Error("本体の path がありません");
  return {
    d: svgToGrid(`<path d="${body.join(" ")}"/>`),
    ears: ears.length ? ears.join(" ") : null,
  };
}

function previewSvg(def) {
  const ears = def.ears
    ? `<path d="${def.ears}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor" data-tier="${def.tier}"><path d="${def.d}"/>${ears}</svg>\n`;
}

export async function buildIcons({ root = ROOT, log = console.log } = {}) {
  const msDir = join(root, "node_modules", "@material-symbols", "svg-500", "rounded");
  const srcDir = join(root, "icons", "src");
  const genDir = join(root, "icons", "generated");
  mkdirSync(genDir, { recursive: true });

  const wanted = parseWanted(readFileSync(join(root, "icons", "wanted.txt"), "utf8"));
  const manifest = loadManifest(root);
  const bespokeNames = existsSync(srcDir)
    ? readdirSync(srcDir)
        .filter((f) => f.endsWith(".svg") && !f.endsWith("-fill.svg"))
        .map((f) => f.replace(/\.svg$/, ""))
    : [];
  const aliases = Object.fromEntries(
    Object.entries(manifest.aliases ?? {}).filter(([k]) => !k.startsWith("$")),
  );
  const resolveName = (n) => aliases[n] ?? n;
  const names = [
    ...new Set([
      ...wanted.map((w) => resolveName(w.name)),
      ...bespokeNames,
      ...Object.values(aliases),
    ]),
  ].sort();
  const descriptions = Object.fromEntries(wanted.map((w) => [w.name, w.description]));

  const icons = {};
  const status = { bespoke: [], autoEar: [], earless: [], noEar: [], missing: [] };

  for (const name of names) {
    const bespokePath = join(srcDir, `${name}.svg`);
    const msPath = join(msDir, `${name}.svg`);
    const msFillPath = join(msDir, `${name}-fill.svg`);

    if (existsSync(bespokePath)) {
      const { d, ears } = parseBespoke(readFileSync(bespokePath, "utf8"));
      const def = { d, tier: "bespoke" };
      if (ears) def.ears = ears;
      const fillPath = join(srcDir, `${name}-fill.svg`);
      if (existsSync(fillPath)) {
        const f = parseBespoke(readFileSync(fillPath, "utf8"));
        def.fill = f.d;
        if (f.ears) def.fillEars = f.ears;
      }
      icons[name] = def;
      status.bespoke.push(name);
    } else if (existsSync(msPath)) {
      const earless = isEarless(name, manifest);
      const original = materialToGrid(readFileSync(msPath, "utf8"));
      const res = await addEars(original, { earless });
      const def = {
        d: res.ears ? res.body : original,
        tier: earless ? "earless" : res.ears ? "auto-ear" : "no-ear",
      };
      if (res.ears) def.ears = res.ears;
      if (existsSync(msFillPath)) {
        const originalFill = materialToGrid(readFileSync(msFillPath, "utf8"));
        if (originalFill !== original) {
          const rf = await addEars(originalFill, { earless: earless || !res.ears });
          def.fill = rf.ears ? rf.body : originalFill;
          if (rf.ears) def.fillEars = rf.ears;
        }
      }
      icons[name] = def;
      if (def.tier === "auto-ear") status.autoEar.push(name);
      else if (def.tier === "earless") status.earless.push(name);
      else status.noEar.push({ name, note: res.note });
    } else {
      status.missing.push(name);
      continue;
    }
    writeFileSync(join(genDir, `${name}.svg`), previewSvg(icons[name]));
  }

  // 別名: 同じ定義を登録する（ts では参照で共有）
  status.aliases = {};
  for (const [alias, target] of Object.entries(aliases)) {
    if (icons[target]) status.aliases[alias] = target;
  }

  const ts = [
    "// 生成物: scripts/icons/build-icons.mjs が icons/wanted.txt・icons/src・@material-symbols/svg-500 から生成する。手で編集しない（pnpm build:icons）。",
    "// tier: bespoke = T1（専用に描いた耳）, auto-ear = T2（自動耳）, earless = 規約で耳なし, no-ear = 耳を置けず本体のみ。無い名前は Icon 部品が T3（フォント）にフォールバックする。",
    "",
    'export type IconTier = "bespoke" | "auto-ear" | "earless" | "no-ear";',
    "",
    "export type IconDef = {",
    "  /** 本体の path（24 グリッド、fill=currentColor） */",
    "  d: string;",
    "  /** 耳の path（stroke 用、線幅 2） */",
    "  ears?: string;",
    "  /** 塗りつぶし版の本体（無ければ d と同じ） */",
    "  fill?: string;",
    "  fillEars?: string;",
    "  tier: IconTier;",
    "};",
    "",
    `const defs: Record<string, IconDef> = ${JSON.stringify(icons, null, 2)};`,
    "",
    "/** AI が使いがちな別名 → 実体（icons/manifest.json の aliases） */",
    `export const iconAliases: Record<string, string> = ${JSON.stringify(status.aliases, null, 2)};`,
    "",
    "export const icons: Record<string, IconDef> = {",
    "  ...defs,",
    "  ...Object.fromEntries(Object.entries(iconAliases).map(([alias, target]) => [alias, defs[target]])),",
    "};",
    "",
    "/** 実体の名前（別名を含まない） */",
    "export const iconNames = Object.keys(defs);",
    "",
  ].join("\n");
  const tsPath = join(root, "src", "components", "ui", "icon", "icons.generated.ts");
  mkdirSync(dirname(tsPath), { recursive: true });
  writeFileSync(tsPath, ts);

  const statusJson = {
    $comment:
      "生成物（pnpm build:icons）。tier ごとのアイコン名。missing は Material Symbols に無い名前（wanted.txt を見直す）。",
    counts: {
      total: names.length,
      bespoke: status.bespoke.length,
      autoEar: status.autoEar.length,
      earless: status.earless.length,
      noEar: status.noEar.length,
      missing: status.missing.length,
    },
    descriptions,
    ...status,
  };
  writeFileSync(join(root, "icons", "status.json"), `${JSON.stringify(statusJson, null, 2)}\n`);

  log(
    `[build:icons] ${names.length} 件: T1 ${status.bespoke.length} / 自動耳 ${status.autoEar.length} / 耳なし規約 ${status.earless.length} / 耳を置けず ${status.noEar.length} / 見つからず ${status.missing.length}`,
  );
  if (status.noEar.length)
    log(`  耳を置けず: ${status.noEar.map((n) => `${n.name}（${n.note}）`).join(", ")}`);
  if (status.missing.length) log(`  見つからず: ${status.missing.join(", ")}`);
  log(`[build:icons] ${tsPath} と icons/status.json を生成しました`);
  return { icons, status: statusJson };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  buildIcons().catch((e) => {
    console.error(`[build:icons] ${e.message}`);
    process.exit(1);
  });
}
