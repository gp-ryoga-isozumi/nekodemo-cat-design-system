// @vitest-environment node
// Phase 3b のツール（手動耳・T1 パイプライン・プロンプト生成）のテスト。VTracer が無い環境ではベクター化の通し試験を省略する
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { icons } from "../../src/components/ui/icon/icons.generated.ts";
import { auditSvg, coverage, rasterizeSvg, topComponents } from "./audit.mjs";
import { isEarless, loadManifest, loadManualEars, manualEarsToPath } from "./build-icons.mjs";
import { parseSections, promptFor } from "./gen-prompts.mjs";
import { extractPaths, findVtracer, normalize, vectorize } from "./vectorize.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CAT_FACE = readFileSync(join(ROOT, "icons", "src", "cat_face.svg"), "utf8");

describe("手動耳（icons/manual-ears.json）", () => {
  it("左右 3 点を stroke 用の path d にする", () => {
    const d = manualEarsToPath({
      left: [
        [5.4, 9.4],
        [5.1, 4.8],
        [9, 9.4],
      ],
      right: [
        [18.6, 9.4],
        [18.9, 4.8],
        [15, 9.4],
      ],
    });
    expect(d).toBe("M5.4 9.4 L5.1 4.8 L9 9.4 M18.6 9.4 L18.9 4.8 L15 9.4");
  });

  it("登録済みの名前は耳なし規約と重複せず、座標が 24 グリッド内にある", () => {
    const manifest = loadManifest(ROOT);
    const manual = loadManualEars(ROOT);
    expect(Object.keys(manual).length).toBeGreaterThan(0);
    for (const [name, entry] of Object.entries(manual)) {
      expect(isEarless(name, manifest), `${name} は耳なし規約と重複`).toBe(false);
      for (const pts of [entry.left, entry.right]) {
        expect(pts).toHaveLength(3);
        for (const [x, y] of pts) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(24);
          expect(y).toBeGreaterThanOrEqual(1);
          expect(y).toBeLessThanOrEqual(24);
        }
        // 頂点は付け根より上
        expect(pts[1][1]).toBeLessThan(Math.min(pts[0][1], pts[2][1]));
      }
    }
  });

  it("耳なし規約に補足（earlessNotes）がある名前は earless に含まれる", () => {
    const manifest = loadManifest(ROOT);
    for (const name of Object.keys(manifest.earlessNotes ?? {}).filter((k) => !k.startsWith("$"))) {
      expect(isEarless(name, manifest), name).toBe(true);
    }
  });
});

describe("icons:audit", () => {
  it("ラスタライズと塗り面積・上部の連結成分を数える", async () => {
    const r = await rasterizeSvg(CAT_FACE.replace("<path", '<path fill="#000"'), 24);
    expect(r.width).toBe(24);
    expect(coverage(r)).toBeGreaterThan(0.2);
    expect(topComponents(r, 6)).toBe(2); // 耳が 2 つ
  });

  it("耳の無い形は (d)(e) で不合格、cat_face は塗り比較を外せば合格", async () => {
    const circle =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16z"/></svg>';
    const bad = await auditSvg("circle", circle, { median: 0.22 });
    expect(bad.ok).toBe(false);
    expect(bad.checks.find((c) => c.id === "d")?.ok).toBe(false);
    const good = await auditSvg("cat_face", CAT_FACE, { median: 0.22, skipCoverage: true });
    expect(good.ok, JSON.stringify(good.checks)).toBe(true);
    const tooThick = await auditSvg("cat_face", CAT_FACE, { median: 0.22 });
    expect(tooThick.checks.find((c) => c.id === "c")?.ok).toBe(false);
  });

  it("viewBox が違う・path が多いと (a)(b) で不合格", async () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M1 1h2v2z"/><path d="M4 1h2v2z"/><path d="M7 1h2v2z"/><path d="M10 1h2v2z"/></svg>';
    const r = await auditSvg("x", svg, { median: null });
    expect(r.checks.find((c) => c.id === "a")?.ok).toBe(false);
    expect(r.checks.find((c) => c.id === "b")?.ok).toBe(false);
  });
});

describe("icons:vectorize", () => {
  it("VTracer の出力から白地を捨てて黒い path を集める", () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M0 0h100v100H0z" fill="#FFFFFF"/><path d="M10 10h20v20H10z" fill="#000000"/></svg>';
    expect(extractPaths(svg)).toMatch(/^M10 10/);
  });

  it("外接矩形を (2,2)〜(22,22) に収める", () => {
    expect(normalize("M0 0h100v50H0z")).toBe("M2 7h20v10H2z");
  });

  it("画像 → SVG の通し（VTracer がある環境だけ）", async () => {
    const vt = await findVtracer(ROOT);
    if (!vt) {
      console.warn("[icons.test] VTracer が無いので通し試験を省略");
      return;
    }
    const tmp = mkdtempSync(join(tmpdir(), "nekodemo-icons-test-"));
    try {
      // T2 の search（本体 + 耳）を 1024px の PNG にして、画像生成 AI の出力の代わりにする
      const def = icons.search;
      const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1024" height="1024"><path d="${def.d}" fill="#000"/><path d="${def.ears}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      const png = join(tmp, "search.png");
      await sharp(Buffer.from(source)).flatten({ background: "#fff" }).png().toFile(png);
      const r = await vectorize("search", { rawDir: tmp, outDir: join(tmp, "out"), vt });
      const out = readFileSync(r.out, "utf8");
      expect(out).toMatch(/viewBox="0 0 24 24"/);
      // 虫めがねの輪の内側（穴）が残っていること: 中心付近は塗られていない
      const r24 = await rasterizeSvg(out.replace("<path", '<path fill="#000"'), 24);
      expect(r24.filled[11 * 24 + 10]).toBe(0);
      const audit = await auditSvg("search", out, { median: 0.22 });
      expect(audit.ok, JSON.stringify(audit.checks)).toBe(true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }, 60_000);
});

describe("icons:prompts", () => {
  it("wanted.txt を節ごとに分ける", () => {
    const sections = parseSections(
      "# head\n# --- 基本操作 ---\nsearch 検索\nhome ホーム\n# --- 矢印 ---\narrow_back 戻る\n",
    );
    expect(sections.map((s) => s.title)).toEqual(["基本操作", "矢印"]);
    expect(sections[0].names).toEqual(["search", "home"]);
  });

  it("プロンプトに名前・説明・耳の規約・後続手順が入る", () => {
    const text = promptFor("search", "検索");
    expect(text).toContain("`search`");
    expect(text).toContain("題材: 「検索」");
    expect(text).toContain("中抜きの三角形の猫耳");
    expect(text).toContain("pnpm icons:vectorize search");
    writeFileSync(join(tmpdir(), "nekodemo-prompt-sample.md"), text);
  });
});
