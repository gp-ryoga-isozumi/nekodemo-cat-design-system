// Material Symbols（@material-symbols/svg-500/rounded、Apache-2.0）の SVG に猫耳を合成する（設計書 §8.3 / §8.5、D14）。
//
// 耳の規約（D14）: 本体と同じ線幅 2 の「中抜き三角」。付け根 2 点を本体の輪郭上に置き、頂点を外側にわずかに傾ける。
// 付け根の位置は形状に依存しないよう、本体を 24 グリッドにラスタライズして求める:
//   1. 本体を 0.8 倍に縮小し、上辺が y=5.4 になるまで下げて耳の余白を作る
//   2. 列ごとの最上端の塗りを走査し、「最上端から 3 以内」の列が連続する最も広い区間を「上辺」とみなす
//   3. 上辺の左端・右端寄りに付け根 2 点ずつ（幅 3.6、上辺が狭ければ縮める）を置き、頂点を付け根から 4.6 上・外側に 0.3 倒す
//   4. 耳の線が本体の突起を横切る場合や、上辺の幅が 7 未満・付け根の高低差が大きい場合は耳なし
//
// 出力: { body: 本体の path d（24 グリッド）, ears: 耳の path d（stroke 用、null なら耳なし）, note }
import sharp from "sharp";
import { svgPathBbox } from "svg-path-bbox";
import svgpath from "svgpath";

export const GRID = 24;
const RES = 10; // 1 グリッド = 10px でラスタライズ
const EAR_WIDTH = 3.6; // 付け根の幅（上限）
const EAR_MIN_WIDTH = 2.2; // 付け根の幅（下限。小さな頭にも付ける）
const EAR_HEIGHT = 4.6; // 付け根から頂点までの高さ（上限）
const EAR_MIN_HEIGHT = 3; // これ未満なら耳を付けない
const APEX_TILT = 0.3; // 頂点を外側に倒す量
const TOP_MARGIN = 1.2; // 頂点の y の下限（線幅込みで 0 以上に収める）
const BODY_TOP = 5.4; // 縮小後の本体上辺の目標 y
const SHRINK = 0.8;
const TOP_BAND = 3; // 「上辺」とみなす最上端からの深さ
const MIN_TOP_SPAN = 5.4; // 上辺の最小幅

/** Material Symbols の SVG 文字列から path d を取り出し、24 グリッドに変換する（viewBox 0 -960 960 960 → 0 0 24 24） */
export function materialToGrid(svgText) {
  const ds = [...svgText.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (ds.length === 0) throw new Error("path が見つかりません");
  const viewBox = /viewBox="([^"]+)"/.exec(svgText)?.[1] ?? "0 -960 960 960";
  const [vx, vy, vw] = viewBox.split(/\s+/).map(Number);
  const k = GRID / vw;
  return svgpath(ds.join(" ")).translate(-vx, -vy).scale(k).round(2).toString();
}

/** 既に 0 0 24 24 の SVG から path を取り出す（T1 用） */
export function svgToGrid(svgText) {
  const ds = [...svgText.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (ds.length === 0) throw new Error("path が見つかりません");
  return svgpath(ds.join(" ")).round(2).toString();
}

export function bbox(d) {
  const [minX, minY, maxX, maxY] = svgPathBbox(d);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/** 本体を中心基準で k 倍し、上辺が top になるよう下げる（下端が 23 を超えない範囲で） */
export function fitBody(d, { shrink = SHRINK, top = BODY_TOP } = {}) {
  const b = bbox(d);
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  let out = svgpath(d).translate(-cx, -cy).scale(shrink).translate(cx, cy).round(2).toString();
  const b2 = bbox(out);
  const dy = Math.max(0, Math.min(top - b2.minY, GRID - 1 - b2.maxY));
  if (dy > 0) out = svgpath(out).translate(0, dy).round(2).toString();
  return out;
}

/** path を GRID*RES px にラスタライズし、アルファ配列（行優先）を返す */
export async function rasterize(d, res = RES) {
  const size = GRID * res;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" width="${size}" height="${size}"><path d="${d}" fill="black"/></svg>`;
  const { data } = await sharp(Buffer.from(svg))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = new Uint8Array(size * size);
  for (let i = 0; i < size * size; i++) alpha[i] = data[i * 4 + 3];
  return { alpha, size, res };
}

function filled(r, x, y) {
  const px = Math.round(x * r.res);
  const py = Math.round(y * r.res);
  if (px < 0 || py < 0 || px >= r.size || py >= r.size) return false;
  return r.alpha[py * r.size + px] > 96;
}

/** 列 x で最上端の塗りの y を返す。無ければ null */
export function topYAt(r, x) {
  const px = Math.round(x * r.res);
  if (px < 0 || px >= r.size) return null;
  for (let py = 0; py < r.size; py++) {
    if (r.alpha[py * r.size + px] > 96) return py / r.res;
  }
  return null;
}

/** 「上辺」（最上端から TOP_BAND 以内の列が連続する最も広い区間）を返す */
export function topSpan(r, b) {
  const step = 0.1;
  const cols = [];
  for (let x = b.minX; x <= b.maxX; x += step) cols.push({ x, y: topYAt(r, x) });
  const ys = cols.map((c) => c.y).filter((y) => y !== null);
  if (ys.length === 0) return null;
  const minTop = Math.min(...ys);
  const runs = [];
  let run = null;
  for (const c of cols) {
    const inBand = c.y !== null && c.y <= minTop + TOP_BAND;
    if (inBand) {
      if (run && c.x - run.xR <= 1.0)
        run.xR = c.x; // 歯車の歯のような小さな切れ目は同じ上辺とみなす
      else {
        run = { xL: c.x, xR: c.x };
        runs.push(run);
      }
    } else {
      run = null;
    }
  }
  runs.sort((a, c) => c.xR - c.xL - (a.xR - a.xL));
  return runs[0] ?? null;
}

/** 線分上を等間隔にサンプルし、塗りに重なる割合を返す（耳が本体の突起を横切っていないかの検査）。本体側の端付近は除外 */
function overlapRatio(r, a, b, skipFromEnd = 0.7) {
  const n = 14;
  let hit = 0;
  let total = 0;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    if (Math.hypot(x - b[0], y - b[1]) < skipFromEnd) continue;
    total++;
    if (filled(r, x, y)) hit++;
  }
  return total === 0 ? 0 : hit / total;
}

const f1 = (n) => Math.round(n * 10) / 10;

/**
 * 耳を合成する。戻り値の body は 24 グリッド用の path d（縮小・下げ済み）、ears は stroke 用の path d（"M x y L x y L x y" × 2）。
 * 耳を付けられない形は ears: null と note を返す（呼び出し側は元の本体を使う）。
 */
export async function addEars(d, { earless = false } = {}) {
  const body = fitBody(d);
  if (earless) return { body, ears: null, note: "manifest: ears none" };
  const b = bbox(body);
  const r = await rasterize(body);
  const span = topSpan(r, b);
  if (!span) return { body, ears: null, note: "上辺が見つからない" };
  const spanW = span.xR - span.xL;
  if (spanW < MIN_TOP_SPAN)
    return { body, ears: null, note: `上辺の幅が ${MIN_TOP_SPAN} 未満（${f1(spanW)}）` };
  const tryEar = (side) => {
    // side: -1 = 左耳, +1 = 右耳。上辺の端から内側へ少しずつ動かして探す
    const edge = side < 0 ? span.xL : span.xR;
    for (let inset = Math.max(0.3, spanW * 0.08); inset <= spanW * 0.35; inset += 0.2) {
      // 左右の耳が中央で重ならない幅（中央の隙間 0.6）
      const earW = Math.min(EAR_WIDTH, (spanW - 2 * inset - 0.6) / 2);
      if (earW < EAR_MIN_WIDTH) break;
      const outerX = edge - side * inset;
      const innerX = outerX - side * earW;
      const yo = topYAt(r, outerX);
      const yi = topYAt(r, innerX);
      if (yo === null || yi === null) continue;
      if (Math.abs(yo - yi) > 3) continue; // 付け根が傾きすぎ（屋根や尖った上辺）
      const baseY = Math.min(yo, yi);
      const apexY = Math.max(TOP_MARGIN, baseY - EAR_HEIGHT);
      if (baseY - apexY < EAR_MIN_HEIGHT) continue;
      const apex = [outerX + side * APEX_TILT, apexY];
      const outer = [outerX, yo];
      const inner = [innerX, yi];
      if (overlapRatio(r, apex, outer) > 0.15 || overlapRatio(r, apex, inner) > 0.15) continue; // 突起を横切る
      return { outer, apex, inner };
    }
    return null;
  };

  const left = tryEar(-1);
  const right = tryEar(1);
  if (!left || !right)
    return { body, ears: null, note: "付け根を輪郭上に置けない（突起・傾き・幅不足）" };
  const seg = (e) =>
    `M${f1(e.outer[0])} ${f1(e.outer[1])} L${f1(e.apex[0])} ${f1(e.apex[1])} L${f1(e.inner[0])} ${f1(e.inner[1])}`;
  return { body, ears: `${seg(left)} ${seg(right)}`, note: null };
}
