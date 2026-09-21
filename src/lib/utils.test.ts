import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("クラスを結合し、競合するユーティリティは後勝ちにする", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false, undefined, "font-bold")).toBe("text-sm font-bold");
  });
});
