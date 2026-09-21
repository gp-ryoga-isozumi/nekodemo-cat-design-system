// @vitest-environment node
import { describe, expect, it } from "vitest";
import { checkSource, runCheck } from "./index.mjs";

const icons = new Set(["search", "delete", "expand_more"]);
const ids = (findings) => findings.map((f) => f.rule);

describe("nekodemo check のルール", () => {
  it("NK001: #hex / rgb / oklch の直書きを検出し、コメント行は無視する", () => {
    const src = `// #fff は説明\nconst a = "bg-[#ff0000]";\nconst b = { color: "rgb(1,2,3)" };\nconst c = "oklch(0.5 0.1 250)";\n`;
    const f = checkSource(src, "src/app/page.tsx").filter((x) => x.rule === "NK001");
    expect(f.map((x) => x.line)).toEqual([2, 3, 4]);
  });

  it("NK002: Tailwind 既定パレットを検出し、nekodemo の neutral / primary / status は通す", () => {
    const src = `<div className="bg-blue-500 text-gray-600 bg-neutral-100 text-primary-700 bg-info-50 border-zinc-200/50" />`;
    const f = checkSource(src, "a.tsx").filter((x) => x.rule === "NK002");
    expect(f.map((x) => x.message)).toHaveLength(3);
  });

  it("NK003: 任意値の色・文字サイズ・角丸を検出し、レイアウトの任意値は通す", () => {
    const src = `<div className="text-[13px] bg-[#fff] rounded-[6px] w-[240px] grid-cols-[repeat(3,1fr)]" />`;
    const f = checkSource(src, "a.tsx").filter((x) => x.rule === "NK003");
    expect(f).toHaveLength(3);
  });

  it("NK004: style の色指定を検出し、サイズ指定は通す", () => {
    const bad = `<div style={{ color: "red" }} />`;
    const ok = `<div style={{ width: 12, fontSize: 14 }} />`;
    expect(ids(checkSource(bad, "a.tsx"))).toContain("NK004");
    expect(ids(checkSource(ok, "a.tsx"))).not.toContain("NK004");
  });

  it("NK005: lucide-react の import と material-symbols クラスを検出する", () => {
    const src = `import { Search } from "lucide-react";\n<span className="material-symbols-rounded">search</span>`;
    expect(checkSource(src, "a.tsx").filter((x) => x.rule === "NK005")).toHaveLength(2);
  });

  it("NK006: 猫版が無いアイコン名を警告し、別名や既知の名前は通す", () => {
    const src = `<Icon icon="search" /><Icon icon="qr_code" />\nconst x = { icon: "expand_more" };`;
    const f = checkSource(src, "a.tsx", { iconNames: icons }).filter((x) => x.rule === "NK006");
    expect(f).toHaveLength(1);
    expect(f[0].icon).toBe("qr_code");
    expect(
      checkSource(src, "a.tsx", { iconNames: null }).filter((x) => x.rule === "NK006"),
    ).toHaveLength(0);
  });

  it("NK007: font-medium / semibold 等を検出し、font-bold / font-normal は通す", () => {
    const src = `<p className="font-semibold font-bold font-normal font-medium" />`;
    expect(checkSource(src, "a.tsx").filter((x) => x.rule === "NK007")).toHaveLength(2);
  });

  it("NK008: ルートレイアウトに data-neko-theme が無いと警告する", () => {
    expect(ids(checkSource(`<html lang="ja"><body/></html>`, "src/app/layout.tsx"))).toContain(
      "NK008",
    );
    expect(
      ids(checkSource(`<html lang="ja" data-neko-theme="calico" />`, "src/app/layout.tsx")),
    ).not.toContain("NK008");
    expect(ids(checkSource(`<html lang="ja" />`, "src/app/foo/layout.tsx"))).not.toContain("NK008");
  });

  it("NK009: 生の HTML フォーム要素を警告し、部品の実装（components/ui）は除外する", () => {
    const src = `<button type="button">x</button><input /><table />`;
    expect(checkSource(src, "src/app/page.tsx").filter((x) => x.rule === "NK009")).toHaveLength(3);
    expect(
      checkSource(src, "src/components/ui/button/index.tsx").filter((x) => x.rule === "NK009"),
    ).toHaveLength(0);
  });

  it("NK010: .map で一覧を描画しているのに Skeleton / EmptyState が無いと info", () => {
    const src = `<ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>`;
    expect(ids(checkSource(src, "src/app/list/page.tsx"))).toContain("NK010");
    expect(ids(checkSource(`${src}; <EmptyState />`, "src/app/list/page.tsx"))).not.toContain(
      "NK010",
    );
    // データの変換（generateStaticParams や JSX 外の .map）は一覧の描画とみなさない
    const staticParams = `export function generateStaticParams() {\n  return projects.map((p) => ({ id: p.id }));\n}\nexport default function Page() { return <Detail />; }`;
    expect(ids(checkSource(staticParams, "src/app/projects/[id]/page.tsx"))).not.toContain("NK010");
    expect(
      ids(checkSource(`const ids = items.map((i) => i.id);`, "src/app/list/page.tsx")),
    ).not.toContain("NK010");
  });

  it("除外コメント: ignore-file と ignore-next-line", () => {
    const src = `// nekodemo-check-ignore-file NK007\n<p className="font-semibold" />\n// nekodemo-check-ignore-next-line NK009\n<button />\n<input />`;
    const f = checkSource(src, "src/app/page.tsx");
    expect(ids(f)).not.toContain("NK007");
    expect(f.filter((x) => x.rule === "NK009").map((x) => x.line)).toEqual([5]);
  });
});

describe("リポジトリ自身", () => {
  it("src に error が無い（Phase 4 完成条件）", () => {
    const result = runCheck(["src"]);
    const errors = result.findings.filter((f) => f.severity === "error");
    expect(
      errors,
      errors.map((e) => `${e.file}:${e.line} ${e.rule} ${e.message}`).join("\n"),
    ).toEqual([]);
    expect(result.iconNamesLoaded).toBe(true);
  });
});
