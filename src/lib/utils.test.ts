import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("クラスを結合し、競合するユーティリティは後勝ちにする", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false, undefined, "font-bold")).toBe("text-sm font-bold");
  });

  it("nekodemo の文字サイズ段階（text-1〜12）を色クラスと競合させない", () => {
    expect(cn("text-text-on-primary text-2")).toBe("text-text-on-primary text-2");
    expect(cn("text-2 text-text-on-primary")).toBe("text-2 text-text-on-primary");
    expect(cn("text-1 text-2")).toBe("text-2");
    expect(cn("text-xs text-3")).toBe("text-3");
  });

  it("役割トークンの色は同じグループとして後勝ちになる", () => {
    expect(cn("text-text-high text-text-low")).toBe("text-text-low");
    expect(cn("bg-surface-card bg-surface-primary")).toBe("bg-surface-primary");
    expect(cn("rounded-action rounded-round")).toBe("rounded-round");
    expect(cn("shadow-raise shadow-float")).toBe("shadow-float");
  });
});
