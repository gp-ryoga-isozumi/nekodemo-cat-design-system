// 部品の index.tsx から「選択肢（variant / size）」「状態（hover / focus / disabled …）」「寸法（高さ・余白・文字）」を
// 機械的に取り出す（ガイドラインサイトの部品ページ用。設計書 §9.2、ガイドライン棚卸し 2026-09-22）。
// cva() の variants と、ソース中のクラス文字列の接頭辞（hover: / data-[state=…]: 等）を読む。人が書く仕様の代わりではなく、
// 「実装が何を持っているか」の一覧。`node scripts/component-spec.mjs button` で確認できる。
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 文字列リテラル（" ' `）をすべて集める。テンプレートは ${} を除く */
export function stringLiterals(source) {
  const out = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  for (const m of source.matchAll(re)) {
    const s = m[1] ?? m[2] ?? m[3] ?? "";
    out.push(s.replace(/\$\{[^}]*\}/g, " "));
  }
  return out;
}

/** クラスらしい文字列（空白区切りで Tailwind のトークンが 1 つ以上）からトークンを集める */
export function classTokens(source) {
  const tokens = new Set();
  for (const s of stringLiterals(source)) {
    if (!/[a-z]/.test(s) || /[。、（）]/.test(s)) continue;
    for (const t of s.split(/\s+/)) {
      if (/^[a-z[\]&>_:.\-/0-9%=()*!]+$/i.test(t) && /[a-z]-|^[a-z]+:/.test(t)) tokens.add(t);
    }
  }
  return [...tokens];
}

/** 波括弧の対応で `{ ... }` を切り出す（開始位置は `{`） */
function sliceBraces(source, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return null;
}

/** cva(...) の variants を { 変数名: { variant名: { option: クラス } } } で返す */
export function cvaVariants(source) {
  const out = {};
  const re = /(?:const|export const)\s+(\w+)\s*=\s*cva\(/g;
  for (const m of source.matchAll(re)) {
    const name = m[1];
    const vIdx = source.indexOf("variants:", m.index);
    if (vIdx === -1) continue;
    const braceStart = source.indexOf("{", vIdx);
    const block = sliceBraces(source, braceStart);
    if (!block) continue;
    const variants = {};
    // 1 段目: variant 名 → { option: "classes", ... }
    const inner = block.slice(1, -1);
    const vre = /(\w+):\s*\{/g;
    for (const vm of inner.matchAll(vre)) {
      const vname = vm[1];
      const vblock = sliceBraces(inner, vm.index + vm[0].length - 1);
      if (!vblock) continue;
      const options = {};
      const ore = /(\w+):\s*(\[[\s\S]*?\]|"[^"]*"|'[^']*'|`[^`]*`)/g;
      for (const om of vblock.slice(1, -1).matchAll(ore)) {
        const classes = stringLiterals(om[2]).join(" ").trim();
        options[om[1]] = classes;
      }
      if (Object.keys(options).length) variants[vname] = options;
    }
    const dm = /defaultVariants:\s*(\{[^}]*\})/.exec(source.slice(m.index));
    const defaults = {};
    if (dm) {
      for (const d of dm[1].matchAll(/(\w+):\s*"([^"]+)"/g)) defaults[d[1]] = d[2];
    }
    out[name] = { variants, defaults };
  }
  return out;
}

/** Tailwind の spacing 単位（4px）と、nekodemo の文字段階から px を出す */
const TEXT_PX = {
  1: 12,
  2: 14,
  3: 16,
  4: 18,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 42,
  11: 48,
  12: 54,
};
function px(token) {
  const m = /^(?:h|min-h|size|w|px|py|p|gap)-(\d+(?:\.\d+)?)$/.exec(token);
  if (m) return Number(m[1]) * 4;
  const b = /^(?:h|size)-\[(\d+)px\]$/.exec(token);
  if (b) return Number(b[1]);
  return null;
}

/** size の各選択肢から高さ・横余白・文字サイズを読む（値がクラス文字列でも px の数値でもよい） */
export function metricsFromSize(sizeOptions) {
  const rows = [];
  for (const [name, value] of Object.entries(sizeOptions)) {
    if (typeof value === "number") {
      rows.push({ name, height: value, paddingX: null, text: null, classes: "" });
      continue;
    }
    const classes = value;
    const tokens = classes.split(/\s+/);
    const h = tokens
      .map((t) => (/^(h|min-h|size)-/.test(t) ? px(t) : null))
      .find((v) => v !== null);
    const padX = tokens.map((t) => (/^px-/.test(t) ? px(t) : null)).find((v) => v !== null);
    const text = tokens.map((t) => /^text-(\d+)$/.exec(t)?.[1]).find(Boolean);
    rows.push({
      name,
      height: h ?? null,
      paddingX: padX ?? null,
      text: text ? { step: Number(text), px: TEXT_PX[Number(text)] ?? null } : null,
      classes,
    });
  }
  return rows;
}

const STATE_PREFIXES = [
  ["hover:", "hover", "マウスオーバー"],
  ["focus-visible:", "focus", "キーボードフォーカス"],
  ["focus-within:", "focus", "内側にフォーカス"],
  ["active:", "active", "押下中"],
  ["disabled:", "disabled", "無効"],
  ["data-[disabled", "disabled", "無効"],
  ["aria-disabled:", "disabled", "無効"],
  ["aria-invalid:", "invalid", "入力エラー"],
  ["aria-pressed:", "selected", "選択中（押下状態）"],
  ["aria-selected:", "selected", "選択中"],
  ["data-[state=on]", "selected", "選択中"],
  ["data-[state=checked]", "checked", "チェック済み"],
  ["data-[state=indeterminate]", "indeterminate", "一部チェック"],
  ["data-[state=open]", "open", "開いている"],
  ["data-[state=closed]", "closed", "閉じている"],
  ["data-[state=active]", "active-tab", "選択中のタブ"],
  ["data-[state=selected]", "selected", "選択中"],
  ["data-[dragging", "dragging", "ドラッグ中"],
  ["placeholder:", "placeholder", "プレースホルダー"],
  ["aria-busy", "loading", "処理中"],
];

/** クラスの接頭辞から、実装がスタイルを持つ状態の一覧を返す */
export function statesFromTokens(tokens, source = "") {
  const found = new Map();
  // STATE_PREFIXES の順（hover → focus → … ）で並べる。ソース中の出現順だと部品ごとにばらつくため
  for (const [prefix, key, label] of STATE_PREFIXES) {
    if (!found.has(key) && tokens.some((t) => t.includes(prefix))) found.set(key, label);
  }
  if (/\bloading\b/.test(source) && /aria-busy|Spinner/.test(source))
    found.set("loading", "処理中（loading）");
  return [...found.entries()].map(([key, label]) => ({ key, label }));
}

/** `const X = { sm: "…", md: "…", lg: "…" } as const` のような size の表を読む（cva を使わない部品向け。値は文字列か px の数値） */
export function sizeMaps(source) {
  const out = {};
  const re = /const\s+([A-Z_][A-Z0-9_]*)\s*=\s*\{([^}]*)\}\s*as const/g;
  for (const m of source.matchAll(re)) {
    // 内部のボタンやアイコンのサイズ表（BUTTON_SIZE / ICON_BUTTON 等）は部品自体の寸法ではない
    if (/BUTTON|ICON|CHEVRON|MARKER|DOT/.test(m[1])) continue;
    const entries = [...m[2].matchAll(/(xs|sm|md|lg|xl)\s*:\s*("[^"]*"|'[^']*'|\d+)/g)];
    if (entries.length < 2) continue;
    out[m[1]] = Object.fromEntries(
      entries.map((e) => [e[1], /^\d+$/.test(e[2]) ? Number(e[2]) : e[2].slice(1, -1)]),
    );
  }
  return out;
}

/** `[table[data-density=xs]_&]:h-10` のような data-density ごとの高さを読む（Table の行高） */
export function densityMetrics(source) {
  const rows = {};
  for (const m of source.matchAll(/data-density=(\w+)\]_&\]:h-(\d+)/g)) {
    rows[m[1]] = Number(m[2]) * 4;
  }
  return rows;
}

/** 分割代入の既定値（`size = "md"`）を読む */
export function defaultValues(source) {
  const defaults = {};
  for (const m of source.matchAll(/\b(\w+) = "([^"\n]*)"/g)) defaults[m[1]] = m[2];
  return defaults;
}

/** `const X = { a: …, b: … } as const` のキー一覧（`keyof typeof X` の型に使う） */
export function constMapKeys(source) {
  const out = {};
  for (const m of source.matchAll(/const\s+([A-Z_][A-Z0-9_]*)\s*=\s*\{([^}]*)\}\s*as const/g)) {
    const keys = [...m[2].matchAll(/(?:^|[,{\s])([\w-]+|"[\w-]+")\s*:/g)].map((k) =>
      k[1].replace(/"/g, ""),
    );
    if (keys.length >= 2) out[m[1]] = keys;
  }
  return out;
}

/** 文字列リテラルのユニオン型で宣言された props（`size?: "sm" | "md"`、`density?: TableDensity`、`side?: keyof typeof SIDE`）と、分割代入の既定値を読む */
export function unionProps(source) {
  const aliases = {};
  for (const m of source.matchAll(/type\s+(\w+)\s*=\s*((?:\|?\s*(?:"[\w-]+"|\d+)\s*)+);/g)) {
    aliases[m[1]] = [...m[2].matchAll(/"([\w-]+)"|(\d+)/g)].map((x) => x[1] ?? x[2]);
  }
  const maps = constMapKeys(source);
  const defaults = defaultValues(source);
  const props = {};
  for (const m of source.matchAll(
    /\b(\w+)\?:\s*((?:"[\w-]+"\s*\|\s*)+"[\w-]+"|keyof typeof [A-Z_][A-Z0-9_]*|[A-Z]\w+)(?=[;,\s}])/g,
  )) {
    const [, name, type] = m;
    const options = type.startsWith('"')
      ? [...type.matchAll(/"([\w-]+)"/g)].map((x) => x[1])
      : type.startsWith("keyof typeof ")
        ? maps[type.slice("keyof typeof ".length)]
        : aliases[type];
    if (!options || options.length < 2 || props[name]) continue;
    props[name] = {
      options,
      default: defaults[name] ?? null,
      from: type.startsWith('"') ? name : type.replace("keyof typeof ", ""),
    };
  }
  return props;
}

/** `export type XxxProps = … & { /** 説明 *\/ name?: type; … }` の型リテラルから props を読む（JSDoc・必須・型・分割代入の既定値） */
export function propsFrom(source) {
  const out = [];
  const defaults = defaultValues(source);
  const seen = new Set();
  for (const m of source.matchAll(/export type (\w+Props)\b[^=]*=/g)) {
    // 型の定義（`… = A & { … } & B;`）の終わり = 波括弧・山括弧の外にある最初の `;`
    const start = m.index + m[0].length;
    let depth = 0;
    let angle = 0;
    let quote = null;
    let end = source.length;
    for (let k = start; k < source.length; k++) {
      const ch = source[k];
      if (quote) {
        if (ch === "\\") k++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === "<") angle++;
      else if (ch === ">" && source[k - 1] !== "=") angle = Math.max(0, angle - 1);
      else if (ch === ";" && depth === 0 && angle === 0) {
        end = k;
        break;
      }
    }
    const block = source.slice(start, end);
    // 型リテラル直下のメンバー（2〜4 スペース字下げ）。入れ子の型のメンバー（6 スペース以上）は拾わない
    const re = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/\s*)?(?:^|\n) {2,4}("[\w-]+"|\w+)(\?)?:\s*([^;]+);/g;
    for (const p of block.matchAll(re)) {
      const name = p[2].replace(/"/g, "");
      if (seen.has(name)) continue;
      seen.add(name);
      const type = p[4].replace(/\s+/g, " ").trim();
      out.push({
        owner: m[1],
        name,
        required: !p[3],
        type,
        default: defaults[name] ?? null,
        description: (p[1] ?? "")
          .replace(/\n\s*\*\s?/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      });
    }
  }
  return out;
}

export function extractSpec(source) {
  const cva = cvaVariants(source);
  const tokens = classTokens(source);
  const options = {};
  let metrics = [];
  for (const [varName, { variants, defaults }] of Object.entries(cva)) {
    for (const [vname, opts] of Object.entries(variants)) {
      options[vname] = {
        options: Object.keys(opts),
        default: defaults[vname] ?? null,
        from: varName,
      };
      if (vname === "size" && metrics.length === 0) metrics = metricsFromSize(opts);
    }
  }
  const unions = unionProps(source);
  const defaults = defaultValues(source);
  if (!options.size) {
    for (const [name, map] of Object.entries(sizeMaps(source))) {
      const rows = metricsFromSize(map);
      if (rows.some((r) => r.height !== null)) {
        options.size = { options: Object.keys(map), default: defaults.size ?? null, from: name };
        metrics = rows;
        break;
      }
    }
  }
  const density = densityMetrics(source);
  if (metrics.length === 0 && Object.keys(density).length) {
    metrics = metricsFromSize(density);
  }
  // cva / 表に無い選択肢はユニオン型の props から補う（既定値は分割代入から）
  for (const [name, p] of Object.entries(unions)) {
    if (!options[name]) options[name] = p;
    else if (options[name].default === null && p.default) options[name].default = p.default;
  }
  return { options, metrics, states: statesFromTokens(tokens, source), props: propsFrom(source) };
}

export function specFor(slug, root = ROOT) {
  const p = join(root, "src", "components", "ui", slug, "index.tsx");
  if (!existsSync(p)) return null;
  const source = readFileSync(p, "utf8");
  const spec = extractSpec(source);
  // cva を持たず Input の inputVariants を流用する部品（InputNumber / InputDate / InputTime 等）は Input の size と寸法を引き継ぐ
  const noHeight = spec.metrics.every((m) => m.height === null);
  // Input を包む部品（InputSearch / InputPassword / InputNumber 等）は Input の size と寸法を引き継ぐ
  const wrapsInput = /inputVariants\(/.test(source) || /from "\.\.\/input"/.test(source);
  if (
    noHeight &&
    wrapsInput &&
    slug !== "input" &&
    (!spec.options.size || /\bsize = "/.test(source))
  ) {
    const input = specFor("input", root);
    if (input?.options.size) {
      spec.options.size = {
        ...(spec.options.size ?? input.options.size),
        from: "inputVariants（Input）",
      };
      spec.metrics = input.metrics;
    }
  }
  return spec;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const slug = process.argv[2];
  if (!slug) {
    console.error("使い方: node scripts/component-spec.mjs <slug>");
    process.exit(1);
  }
  console.log(JSON.stringify(specFor(slug), null, 2));
}
