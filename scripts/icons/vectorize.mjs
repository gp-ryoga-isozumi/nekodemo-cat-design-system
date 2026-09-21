// T1 パイプライン（設計書 §8.4）: icons/raw/<name>.png（画像生成 AI の出力。黒 1 色・白地）→ icons/src/<name>.svg
//   node scripts/icons/vectorize.mjs <name>... [--raw <dir>] [--out <dir>] [--threshold 128]
// 手順: sharp で 2 値化 → VTracer（CLI `vtracer` があればそれ、無ければ Python パッケージ `vtracer`）→ svgo →
//       外接矩形を 24 グリッドの (2,2)〜(22,22) に収める → fill を外して currentColor で描けるようにする。
// VTracer の導入（どちらか）:
//   - `cargo install vtracer-cli`（CLI）
//   - `python3.12 -m venv .venv && .venv/bin/pip install vtracer`（Python 3.9〜3.13。3.14 の vtracer 0.6 はオプション付きで segfault する。
//     環境変数 VTRACER_PYTHON で python のパスを指定してもよい）
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { svgPathBbox } from "svg-path-bbox";
import { optimize } from "svgo";
import svgpath from "svgpath";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const GRID = 24;
const MARGIN = 2;
/** VTracer の設定（設計書 §8.4 の初期案。線画向け） */
export const VTRACER_OPTIONS = {
  colormode: "binary",
  mode: "spline",
  filter_speckle: 8,
  color_precision: 6,
  corner_threshold: 60,
  length_threshold: 4.0,
  splice_threshold: 45,
  path_precision: 3,
};

/** VTracer の Python バインディングがオプション付きで動くか、8×8 の PNG で試す（Python 3.14 + vtracer 0.6 は segfault する） */
async function probePython(py) {
  const tmp = mkdtempSync(join(tmpdir(), "nekodemo-vtracer-probe-"));
  try {
    const png = join(tmp, "probe.png");
    await sharp({ create: { width: 8, height: 8, channels: 3, background: "#fff" } })
      .png()
      .toFile(png);
    const code =
      "import vtracer, sys\nvtracer.convert_image_to_svg_py(sys.argv[1], sys.argv[2], colormode='binary', mode='spline')";
    return (
      spawnSync(py, ["-c", code, png, join(tmp, "probe.svg")], { stdio: "ignore" }).status === 0
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** 使える VTracer を探す。{ kind: "cli" | "python", command } か null */
export async function findVtracer(root = ROOT) {
  if (spawnSync("vtracer", ["--version"], { stdio: "ignore" }).status === 0)
    return { kind: "cli", command: "vtracer" };
  const candidates = [
    process.env.VTRACER_PYTHON,
    join(root, ".venv", "bin", "python"),
    "python3.13",
    "python3.12",
    "python3.11",
    "python3.10",
    "python3.9",
    "python3",
  ].filter(Boolean);
  for (const py of candidates) {
    if (spawnSync(py, ["-c", "import vtracer"], { stdio: "ignore" }).status !== 0) continue;
    if (await probePython(py)) return { kind: "python", command: py };
    console.warn(
      `[icons:vectorize] ${py} の vtracer はオプション付きで落ちるため使いません（Python 3.9〜3.13 を推奨）`,
    );
  }
  return null;
}

/** 黒 1 色・白地の PNG に正規化する（グレースケール → しきい値） */
export async function binarize(input, output, threshold = 128) {
  await sharp(input)
    .flatten({ background: "#fff" })
    .grayscale()
    .threshold(threshold)
    .png()
    .toFile(output);
}

export function runVtracer(vt, input, output) {
  const o = VTRACER_OPTIONS;
  if (vt.kind === "cli") {
    const args = [
      "--input",
      input,
      "--output",
      output,
      "--colormode",
      o.colormode,
      "--mode",
      o.mode,
      "--filter_speckle",
      String(o.filter_speckle),
      "--color_precision",
      String(o.color_precision),
      "--corner_threshold",
      String(o.corner_threshold),
      "--segment_length",
      String(o.length_threshold),
      "--splice_threshold",
      String(o.splice_threshold),
      "--path_precision",
      String(o.path_precision),
    ];
    const r = spawnSync(vt.command, args, { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`vtracer が失敗しました: ${r.stderr}`);
    return;
  }
  const code = `import vtracer, json, sys
o = json.loads(sys.argv[3])
vtracer.convert_image_to_svg_py(sys.argv[1], sys.argv[2], colormode=o["colormode"], mode=o["mode"], filter_speckle=o["filter_speckle"], color_precision=o["color_precision"], corner_threshold=o["corner_threshold"], length_threshold=o["length_threshold"], splice_threshold=o["splice_threshold"], path_precision=o["path_precision"])`;
  const r = spawnSync(vt.command, ["-c", code, input, output, JSON.stringify(o)], {
    encoding: "utf8",
  });
  if (r.status !== 0) {
    // 既定値（colormode=color, stacked）で逃げると穴（虫めがねの輪の内側など）が白い図形として重なり、
    // 黒だけ拾うと穴が埋まって audit をすり抜けるので、フォールバックはしない
    throw new Error(`vtracer（python）が失敗しました（exit ${r.status}）: ${r.stderr}`);
  }
}

/** VTracer の出力から黒い図形の path d を集め、svgo で整え、1 本の d にする */
export function extractPaths(svgText) {
  const optimized = optimize(svgText, {
    plugins: [
      "removeDimensions",
      { name: "convertPathData", params: { floatPrecision: 3 } },
      "mergePaths",
      "removeUselessStrokeAndFill",
    ],
  }).data;
  const paths = [...optimized.matchAll(/<path\b([^>]*)>/g)].map((m) => m[1]);
  const ds = [];
  for (const attrs of paths) {
    const fill = /\bfill="([^"]+)"/.exec(attrs)?.[1]?.toLowerCase();
    if (fill && /^(#fff|#ffffff|white|none)$/.test(fill)) continue; // 白地は捨てる
    const d = /\sd="([^"]+)"/.exec(attrs)?.[1];
    if (d) ds.push(d);
  }
  if (ds.length === 0)
    throw new Error("黒い図形が見つかりません（画像が白すぎる、または黒地になっていないか確認）");
  return ds.join(" ");
}

/** 外接矩形が (MARGIN,MARGIN)〜(GRID-MARGIN, GRID-MARGIN) に収まるように等倍スケールして中央に置く */
export function normalize(d) {
  const [minX, minY, maxX, maxY] = svgPathBbox(d);
  const w = maxX - minX;
  const h = maxY - minY;
  const inner = GRID - MARGIN * 2;
  const scale = inner / Math.max(w, h);
  const tx = MARGIN + (inner - w * scale) / 2 - minX * scale;
  const ty = MARGIN + (inner - h * scale) / 2 - minY * scale;
  return svgpath(d).scale(scale).translate(tx, ty).round(2).toString();
}

export async function vectorize(name, { rawDir, outDir, threshold = 128, vt } = {}) {
  const tool = vt ?? (await findVtracer());
  if (!tool)
    throw new Error(
      "VTracer が見つかりません（cargo install vtracer-cli か、Python 3.9〜3.13 の .venv に pip install vtracer）",
    );
  const input = join(rawDir ?? join(ROOT, "icons", "raw"), `${name}.png`);
  if (!existsSync(input)) throw new Error(`${input} がありません`);
  const tmp = mkdtempSync(join(tmpdir(), "nekodemo-vectorize-"));
  try {
    const bw = join(tmp, "bw.png");
    const traced = join(tmp, "traced.svg");
    await binarize(input, bw, threshold);
    runVtracer(tool, bw, traced);
    const d = normalize(extractPaths(readFileSync(traced, "utf8")));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}"><path d="${d}"/></svg>\n`;
    const dir = outDir ?? join(ROOT, "icons", "src");
    mkdirSync(dir, { recursive: true });
    const out = join(dir, `${name}.svg`);
    writeFileSync(out, svg);
    return { out, pathLength: d.length, vtracer: tool.kind };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const names = [];
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--raw") opts.rawDir = args[++i];
    else if (args[i] === "--out") opts.outDir = args[++i];
    else if (args[i] === "--threshold") opts.threshold = Number(args[++i]);
    else names.push(args[i]);
  }
  if (names.length === 0) {
    console.error(
      "使い方: node scripts/icons/vectorize.mjs <name>... [--raw <dir>] [--out <dir>] [--threshold 128]",
    );
    process.exit(1);
  }
  let failed = 0;
  for (const name of names) {
    try {
      const r = await vectorize(name, opts);
      console.log(`[icons:vectorize] ${name}: ${r.out}（path ${r.pathLength} 文字、${r.vtracer}）`);
    } catch (e) {
      failed++;
      console.error(`[icons:vectorize] ${name}: ${e.message}`);
    }
  }
  console.log("[icons:vectorize] 次は pnpm icons:audit で検査し、pnpm build:icons で取り込む");
  process.exit(failed ? 1 : 0);
}
