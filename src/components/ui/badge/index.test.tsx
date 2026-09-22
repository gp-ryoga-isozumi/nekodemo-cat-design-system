import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from ".";

// 操作: Badge は件数を表示するだけで操作できないため省略する（操作は親のボタン側で検証する）。
// disabled: 無効状態を持たないため省略する。

describe("Badge", () => {
  it("表示: count を描画し、data-slot / data-variant を持つ", () => {
    const { container } = render(<Badge count={3} variant="negative" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveTextContent("3");
    expect(badge).toHaveAttribute("data-variant", "negative");
    expect(badge).toHaveClass("bg-surface-negative");
  });

  it("表示: max を超えると「99+」になり、0 と max ちょうどはそのまま出す", () => {
    const { rerender } = render(<Badge count={120} />);
    expect(screen.getByText("99+")).toBeInTheDocument();

    rerender(<Badge count={120} max={9} />);
    expect(screen.getByText("9+")).toBeInTheDocument();

    rerender(<Badge count={99} />);
    expect(screen.getByText("99")).toBeInTheDocument();

    rerender(<Badge count={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("表示: 負の count は 0 として出す（未読の数が負になるバグを見せない）", () => {
    render(<Badge count={-3} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("表示: count が無ければ children を出し、既定は primary", () => {
    const { container } = render(<Badge variant="neutral">120件</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveTextContent("120件");

    const { container: defaultContainer } = render(<Badge count={1} />);
    expect(defaultContainer.querySelector('[data-slot="badge"]')).toHaveAttribute(
      "data-variant",
      "primary",
    );
  });

  it("アクセシブルネーム: 数字だけでは伝わらないため、role と aria-label か親の名前で補う", () => {
    render(
      <div>
        <Badge count={3} role="status" aria-label="未読 3 件" variant="negative" />
        <button type="button">
          未対応の案件
          <Badge count={12} />
        </button>
      </div>,
    );
    expect(screen.getByRole("status", { name: "未読 3 件" })).toBeInTheDocument();
    // 親のボタンの中に置くと、件数がボタンのアクセシブルネームに含まれる
    expect(screen.getByRole("button", { name: /未対応の案件.*12/ })).toBeInTheDocument();
  });
});
