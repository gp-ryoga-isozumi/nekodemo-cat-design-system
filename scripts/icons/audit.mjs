// T1（icons/src/<name>.svg）の検査（設計書 §8.4 の 5）。
//   node scripts/icons/audit.mjs [name...] [--json]
// (a) viewBox="0 0 24 24"、(b) path 3 個以内、(c) 24px の塗り面積比が T2 の中央値 ±30%、
// (d) 上部の帯（y ≤ 6）に耳の連結成分が 2 個、(e) 16px でも 2 個に分離している。
// 比較対象の T2 は icons/generated/*.svg（pnpm build:icons の出力、git 管理外）から中央値を取る。
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadManifest } from "./build-icons.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const EAR_BAND = 6; // 24 グリッドでの耳の帯（y ≤ 6）
export const TOLERANCE = 0.3;

/** SVG 文字列を size px にラスタライズし、塗り（alpha > 128）の 2 値配列を返す */
export async function rasterizeSvg(svgText, size) {
  const withSize = svgText
    .replace(
      /<svg\b([^>]*)>/,
      (_m, attrs) => `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, "")}>`,
    )
    .replace(/<svg\b/, `<svg width="${size}" height="${size}"`);
  const { data, info } = await sharp(Buffer.from(withSize))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const filled = new Uint8Array(info.width * info.height);
  for (let i = 0; i < filled.length; i++) {
    const a = data[i * 4 + 3];
    const lum = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
    filled[i] = a > 128 && lum < 128 ? 1 : 0;
  }
  return { filled, width: info.width, height: info.height };
}

export function coverage(r) {
  let n = 0;
  for (const v of r.filled) n += v;
  return n / r.filled.length;
}

/** 上部の帯（rows < bandRows）にある連結成分（8 近傍）の数 */
export function topComponents(r, bandRows) {
  const seen = new Uint8Array(r.filled.length);
  let count = 0;
  const rows = Math.min(bandRows, r.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < r.width; x++) {
      const i = y * r.width + x;
      if (!r.filled[i] || seen[i]) continue;
      count++;
      const stack = [i];
      seen[i] = 1;
      while (stack.length) {
        const c = stack.pop();
        const cx = c % r.width;
        const cy = (c - cx) / r.width;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= r.width || ny >= rows) continue;
            const ni = ny * r.width + nx;
            if (r.filled[ni] && !seen[ni]) {
              seen[ni] = 1;
              stack.push(ni);
            }
          }
        }
      }
    }
  }
  return count;
}

/** T2（自動耳・手動耳）の 24px 塗り面積比の中央値 */
export async function t2MedianCoverage(root = ROOT) {
  const dir = join(root, "icons", "generated");
  if (!existsSync(dir)) return null;
  const ratios = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".svg")) continue;
    const svg = readFileSync(join(dir, f), "utf8");
    if (!/data-tier="(auto-ear|manual-ear)"/.test(svg)) continue;
    ratios.push(coverage(await rasterizeSvg(svg, 24)));
  }
  if (ratios.length === 0) return null;
  ratios.sort((a, b) => a - b);
  return ratios[Math.floor(ratios.length / 2)];
}

/** 1 つの T1 SVG を検査する。{ name, ok, checks: [{ id, ok, detail }] } */
export async function auditSvg(name, svgText, { median, skipCoverage = false } = {}) {
  const checks = [];
  const viewBox = /viewBox="([^"]+)"/.exec(svgText)?.[1];
  checks.push({ id: "a", ok: viewBox === "0 0 24 24", detail: `viewBox="${viewBox ?? "なし"}"` });
  const pathCount = (svgText.match(/<path\b/g) ?? []).length;
  checks.push({ id: "b", ok: pathCount >= 1 && pathCount <= 3, detail: `path ${pathCount} 個` });
  // 描画用に fill を currentColor → 黒にする
  const drawable = svgText.replace(/fill="currentColor"/g, 'fill="#000"');
  const r24 = await rasterizeSvg(drawable, 24);
  const cov = coverage(r24);
  if (skipCoverage) {
    checks.push({
      id: "c",
      ok: true,
      detail: `塗り ${(cov * 100).toFixed(1)}%（nekodemo 独自のシルエットなので比較しない）`,
    });
  } else if (median === null || median === undefined) {
    checks.push({
      id: "c",
      ok: true,
      detail: `塗り ${(cov * 100).toFixed(1)}%（T2 の中央値が無いので比較なし。pnpm build:icons を先に実行）`,
    });
  } else {
    const lo = median * (1 - TOLERANCE);
    const hi = median * (1 + TOLERANCE);
    checks.push({
      id: "c",
      ok: cov >= lo && cov <= hi,
      detail: `塗り ${(cov * 100).toFixed(1)}%（T2 中央値 ${(median * 100).toFixed(1)}%、許容 ${(lo * 100).toFixed(1)}〜${(hi * 100).toFixed(1)}%）`,
    });
  }
  const c24 = topComponents(r24, EAR_BAND);
  checks.push({
    id: "d",
    ok: c24 === 2,
    detail: `24px の上部 y≤${EAR_BAND} の連結成分 ${c24} 個（耳 2 個が期待）`,
  });
  const r16 = await rasterizeSvg(drawable, 16);
  const c16 = topComponents(r16, Math.round((EAR_BAND / 24) * 16));
  checks.push({ id: "e", ok: c16 === 2, detail: `16px の上部の連結成分 ${c16} 個` });
  return { name, ok: checks.every((c) => c.ok), checks };
}

export async function audit(names, { root = ROOT } = {}) {
  const srcDir = join(root, "icons", "src");
  const targets = names.length
    ? names
    : readdirSync(srcDir)
        .filter((f) => f.endsWith(".svg") && !f.endsWith("-fill.svg"))
        .map((f) => f.replace(/\.svg$/, ""));
  const median = await t2MedianCoverage(root);
  // manifest.nekodemo（cat_face など nekodemo 独自の塗りつぶしシルエット）は線画ではないので塗り面積の比較を外す
  const silhouettes = new Set(
    Object.keys(loadManifest(root).nekodemo ?? {}).filter((k) => !k.startsWith("$")),
  );
  const results = [];
  for (const name of targets) {
    const p = join(srcDir, `${name}.svg`);
    if (!existsSync(p)) {
      results.push({
        name,
        ok: false,
        checks: [{ id: "-", ok: false, detail: `${p} がありません` }],
      });
      continue;
    }
    results.push(
      await auditSvg(name, readFileSync(p, "utf8"), {
        median,
        skipCoverage: silhouettes.has(name),
      }),
    );
  }
  return { median, results };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const names = args.filter((a) => !a.startsWith("--"));
  const { median, results } = await audit(names);
  if (json) {
    console.log(JSON.stringify({ median, results }, null, 2));
  } else {
    for (const r of results) {
      console.log(`${r.ok ? "✓" : "✗"} ${r.name}`);
      for (const c of r.checks) console.log(`    ${c.ok ? "ok " : "NG "} (${c.id}) ${c.detail}`);
    }
    const failed = results.filter((r) => !r.ok).length;
    console.log(
      `[icons:audit] ${results.length} 件中 合格 ${results.length - failed} / 不合格 ${failed}`,
    );
  }
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}
