// アイコンの本体（fitBody 後）と耳を 24 グリッド付きの PNG に描き、上辺のプロファイルを表示する（耳の手動配置の作業用）。
//   node scripts/icons/inspect.mjs <name>... [--out <dir>] [--ears "M.. L.. L.. M.. L.. L.."]
// 既定の出力先は icons/generated/inspect/<name>.png（git 管理外）。
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { addEars, bbox, fitBody, materialToGrid, rasterize, topYAt } from "./add-ears.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MS_DIR = join(ROOT, "node_modules", "@material-symbols", "svg-500", "rounded");
const PX = 20; // 1 グリッド = 20px

export function loadManualEars(root = ROOT) {
  const p = join(root, "icons", "manual-ears.json");
  if (!existsSync(p)) return {};
  const j = JSON.parse(readFileSync(p, "utf8"));
  return Object.fromEntries(Object.entries(j).filter(([k]) => !k.startsWith("$")));
}

/** manual-ears.json の 1 項目（{ left: [[x,y],[x,y],[x,y]], right: [...] }）を stroke 用 path d に変換する */
export function manualEarsToPath(entry) {
  const seg = (pts) =>
    `M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]}`;
  return `${seg(entry.left)} ${seg(entry.right)}`;
}

export async function inspectIcon(name, { ears, outDir } = {}) {
  const msPath = join(MS_DIR, `${name}.svg`);
  if (!existsSync(msPath)) throw new Error(`${name}: Material Symbols に無い`);
  const original = materialToGrid(readFileSync(msPath, "utf8"));
  const body = fitBody(original);
  const auto = await addEars(original);
  const manual = loadManualEars()[name];
  const earPath = ears ?? (manual ? manualEarsToPath(manual) : auto.ears);
  const b = bbox(body);
  const r = await rasterize(body);
  const profile = [];
  for (let x = 0; x <= 24; x += 1) {
    const y = topYAt(r, x);
    profile.push(`${x}:${y === null ? "-" : y.toFixed(1)}`);
  }
  const grid = [];
  for (let i = 0; i <= 24; i++) {
    const p = i * PX;
    const major = i % 4 === 0;
    grid.push(
      `<line x1="${p}" y1="0" x2="${p}" y2="${24 * PX}" stroke="${major ? "#9ab" : "#dde"}" stroke-width="1"/>`,
      `<line x1="0" y1="${p}" x2="${24 * PX}" y2="${p}" stroke="${major ? "#9ab" : "#dde"}" stroke-width="1"/>`,
    );
    if (major && i < 24)
      grid.push(
        `<text x="${p + 2}" y="12" font-size="11" fill="#68a" font-family="sans-serif">${i}</text>`,
      );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${24 * PX} ${24 * PX}" width="${24 * PX}" height="${24 * PX}">
<rect width="100%" height="100%" fill="#fff"/>${grid.join("")}
<g transform="scale(${PX})"><path d="${body}" fill="#111"/>${earPath ? `<path d="${earPath}" fill="none" stroke="#d33" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</g>
</svg>`;
  const dir = outDir ?? join(ROOT, "icons", "generated", "inspect");
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `${name}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  // 小さいサイズでの見え方も横に並べる（24 / 16 px）
  const small = (size) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${body}" fill="#111"/>${earPath ? `<path d="${earPath}" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg>`;
  await sharp(Buffer.from(small(24)))
    .png()
    .toFile(join(dir, `${name}-24.png`));
  await sharp(Buffer.from(small(16)))
    .png()
    .toFile(join(dir, `${name}-16.png`));
  return { out, bbox: b, profile, auto: auto.ears ? "auto" : auto.note, ears: earPath };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const names = [];
  let outDir;
  let ears;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out") outDir = args[++i];
    else if (args[i] === "--ears") ears = args[++i];
    else names.push(args[i]);
  }
  if (names.length === 0) {
    console.error(
      "使い方: node scripts/icons/inspect.mjs <name>... [--out <dir>] [--ears <path d>]",
    );
    process.exit(1);
  }
  for (const name of names) {
    const info = await inspectIcon(name, { ears, outDir });
    console.log(
      `${name}: bbox x ${info.bbox.minX.toFixed(1)}-${info.bbox.maxX.toFixed(1)} y ${info.bbox.minY.toFixed(1)}-${info.bbox.maxY.toFixed(1)} / ${info.auto}\n  top: ${info.profile.join(" ")}\n  ears: ${info.ears ?? "-"}\n  -> ${info.out}`,
    );
  }
}
