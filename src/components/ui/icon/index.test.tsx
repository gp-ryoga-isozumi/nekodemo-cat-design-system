import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ICON_SIZES, Icon } from ".";
import { iconAliases, icons } from "./icons.generated";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Icon", () => {
  it("表示: data-slot=icon を持ち、id や data-* などの props をそのまま渡せる", () => {
    const { container } = render(<Icon icon="search" id="q-icon" data-testid="icon" />);
    const el = container.querySelector("#q-icon");
    expect(el).toHaveAttribute("data-slot", "icon");
    expect(el).toHaveAttribute("data-testid", "icon");
  });

  it("表示: 猫版がある名前は inline SVG（本体 path ＋ 耳 path）を描く", () => {
    const { container } = render(<Icon icon="folder" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("data-icon-tier", icons.folder.tier);
    expect(container.querySelectorAll("path").length).toBe(icons.folder.ears ? 2 : 1);
  });

  it("表示: 耳なし規約の名前は本体だけ", () => {
    const { container } = render(<Icon icon="chevron_right" />);
    expect(container.querySelectorAll("path").length).toBe(1);
    expect(container.querySelector("svg")).toHaveAttribute("data-icon-tier", "earless");
  });

  it("表示: 別名（expand_more 等）でも引ける", () => {
    expect(Object.keys(iconAliases).length).toBeGreaterThan(0);
    const { container } = render(<Icon icon="expand_more" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("表示: 猫版が無い名前は Material Symbols フォントにフォールバックし、開発時に警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(<Icon icon="nonexistent_icon_name" />);
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
    expect(span).toHaveClass("material-symbols-rounded");
    expect(span).toHaveTextContent("nonexistent_icon_name");
    expect(span).toHaveAttribute("data-icon-tier", "fallback");
    expect(warn).toHaveBeenCalledTimes(1);
    render(<Icon icon="nonexistent_icon_name" />);
    expect(warn).toHaveBeenCalledTimes(1); // 同じ名前は 1 回だけ
  });

  it("サイズ: size 1〜12 が 12〜54px に対応する（既定 3 = 16px）", () => {
    const { container, rerender } = render(<Icon icon="search" />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    rerender(<Icon icon="search" size={12} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "54");
    expect(ICON_SIZES).toHaveLength(12);
  });

  it("fill: 塗りつぶし版があれば切り替わる", () => {
    const { container, rerender } = render(<Icon icon="favorite" />);
    const outline = container.querySelector("path")?.getAttribute("d");
    rerender(<Icon icon="favorite" fill />);
    const filled = container.querySelector("path")?.getAttribute("d");
    expect(filled).toBe(icons.favorite.fill ?? icons.favorite.d);
    if (icons.favorite.fill) expect(filled).not.toBe(outline);
  });

  it("アクセシブルネーム: label があれば role=img と aria-label、無ければ aria-hidden", () => {
    const { container, rerender } = render(<Icon icon="delete" label="削除" />);
    expect(screen.getByRole("img", { name: "削除" })).toBeInTheDocument();
    rerender(<Icon icon="delete" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
