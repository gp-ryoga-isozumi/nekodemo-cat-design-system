// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  cvaVariants,
  densityMetrics,
  extractSpec,
  metricsFromSize,
  specFor,
  statesFromTokens,
  unionProps,
} from "./component-spec.mjs";

describe("component-spec", () => {
  it("cva の variants と既定値を読む（配列の base / 複数行の値も）", () => {
    const src = `
const buttonVariants = cva(
  ["inline-flex", "hover:bg-x"],
  {
    variants: {
      variant: { primary: "bg-surface-primary text-text-on-primary", ghost: ["bg-transparent", "hover:bg-surface-well"] },
      size: { sm: "h-8 px-3 text-2", md: "h-10 px-4 text-3", lg: "h-12 px-5 text-3" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);`;
    const v = cvaVariants(src);
    expect(Object.keys(v.buttonVariants.variants)).toEqual(["variant", "size"]);
    expect(v.buttonVariants.variants.variant.ghost).toBe("bg-transparent hover:bg-surface-well");
    expect(v.buttonVariants.defaults).toEqual({ variant: "primary", size: "md" });
    const m = metricsFromSize(v.buttonVariants.variants.size);
    expect(m.map((r) => [r.name, r.height, r.paddingX, r.text?.px])).toEqual([
      ["sm", 32, 12, 14],
      ["md", 40, 16, 16],
      ["lg", 48, 20, 16],
    ]);
  });

  it("クラスの接頭辞から状態を集める", () => {
    const states = statesFromTokens([
      "hover:bg-surface-well",
      "focus-visible:outline-2",
      "disabled:cursor-not-allowed",
      "aria-invalid:border-border-negative",
      "data-[state=checked]:bg-surface-primary",
    ]).map((s) => s.key);
    expect(states).toEqual(["hover", "focus", "disabled", "invalid", "checked"]);
    // 並びはソースの出現順ではなく固定（hover → focus → …）
    expect(
      statesFromTokens(["disabled:opacity-50", "hover:bg-x", "focus-visible:ring"]).map(
        (s) => s.key,
      ),
    ).toEqual(["hover", "focus", "disabled"]);
  });

  it("実際の Button と Input から選択肢・寸法・状態が取れる", () => {
    const button = specFor("button");
    expect(button.options.variant.options).toContain("primary");
    expect(button.options.size.options).toEqual(["sm", "md", "lg"]);
    expect(button.metrics.find((r) => r.name === "md")?.height).toBe(40);
    expect(button.states.map((s) => s.key)).toEqual(
      expect.arrayContaining(["hover", "focus", "disabled", "loading"]),
    );
    const input = specFor("input");
    expect(input.metrics.map((r) => r.height)).toEqual([32, 40, 48]);
    expect(input.states.map((s) => s.key)).toEqual(
      expect.arrayContaining(["invalid", "placeholder"]),
    );
  });

  it("cva を使わない部品の size 表（as const）も読む", () => {
    const select = specFor("select");
    expect(select.options.size?.options).toEqual(["sm", "md", "lg"]);
    expect(select.metrics.map((r) => r.height)).toEqual([32, 40, 48]);
  });

  it("ユニオン型の props と分割代入の既定値を読む（型エイリアス経由も）", () => {
    const src = `
export type TableDensity = "xs" | "sm" | "md";
type Side = "right" | "left" | "bottom";
export function Table({ density = "sm", side = "right", sort }: { density?: TableDensity; side?: Side; sort?: "asc" | "desc" | "none"; filter?: "select" }) {}
`;
    const p = unionProps(src);
    expect(p.density).toEqual({ options: ["xs", "sm", "md"], default: "sm", from: "TableDensity" });
    expect(p.side.options).toEqual(["right", "left", "bottom"]);
    expect(p.sort).toEqual({ options: ["asc", "desc", "none"], default: null, from: "sort" });
    expect(p.filter).toBeUndefined();
    const drawer = specFor("drawer");
    expect(drawer.options.side).toMatchObject({
      options: ["right", "left", "bottom"],
      default: "right",
      from: "SIDE",
    });
  });

  it("Table の density ごとの行高と、Spinner の数値の size 表を読む", () => {
    expect(
      densityMetrics('"[table[data-density=xs]_&]:h-10 [table[data-density=md]_&]:h-20"'),
    ).toEqual({
      xs: 40,
      md: 80,
    });
    const table = specFor("table");
    expect(table.options.density).toMatchObject({ options: ["xs", "sm", "md"], default: "sm" });
    expect(table.metrics.map((r) => [r.name, r.height])).toEqual([
      ["xs", 40],
      ["md", 80],
      ["sm", 56],
    ]);
    const spinner = specFor("spinner");
    expect(spinner.metrics.map((r) => [r.name, r.height])).toEqual([
      ["sm", 16],
      ["md", 20],
      ["lg", 40],
    ]);
    expect(spinner.options.size?.default).toBe("md");
  });

  it("Input の inputVariants を流用する部品は Input の寸法を引き継ぎ、内部ボタンのサイズ表を拾わない", () => {
    expect(specFor("icon").options.size?.options).toHaveLength(12);
    expect(specFor("input-search").options.size?.options).toEqual(["sm", "md", "lg"]);
    expect(specFor("input-password").metrics.map((r) => r.height)).toEqual([32, 40, 48]);
    for (const slug of ["input-number", "input-date", "input-time"]) {
      const spec = specFor(slug);
      expect(spec.options.size?.options, slug).toEqual(["sm", "md", "lg"]);
      expect(spec.options.size?.from, slug).toBe("inputVariants（Input）");
      expect(
        spec.metrics.map((r) => r.height),
        slug,
      ).toEqual([32, 40, 48]);
    }
  });

  it("cva を使わない部品でも空の仕様を返す", () => {
    const spec = extractSpec(
      `export function Divider() { return <hr className="border-border-low" />; }`,
    );
    expect(spec.options).toEqual({});
    expect(spec.metrics).toEqual([]);
  });
});
