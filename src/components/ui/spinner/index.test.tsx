import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from ".";

// 操作: Spinner は読み込み中を表すだけで操作できる要素が無いため省略する。
// disabled: 同じく無効状態を持たないため省略する。

describe("Spinner", () => {
  it("表示: data-slot と size ごとの寸法（sm 16 / md 20 / lg 40px）を持つ", () => {
    const { container, rerender } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("data-slot", "spinner");
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");

    rerender(<Spinner size="sm" />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");

    rerender(<Spinner size="lg" />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "40");
  });

  it("表示: className を足せて、回転アニメーションは motion-reduce で止まる", () => {
    const { container } = render(<Spinner className="text-object-primary" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-object-primary");
    expect(svg).toHaveClass("animate-spin");
    expect(svg).toHaveClass("motion-reduce:animate-none");
  });

  it("アクセシブルネーム: role=status と既定ラベル「読み込み中」を持ち、label で上書きできる", () => {
    const { rerender } = render(<Spinner />);
    expect(screen.getByRole("status", { name: "読み込み中" })).toBeInTheDocument();

    rerender(<Spinner label="案件を読み込み中" />);
    expect(screen.getByRole("status", { name: "案件を読み込み中" })).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: "読み込み中" })).not.toBeInTheDocument();
  });
});
