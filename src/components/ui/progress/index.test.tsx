import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from ".";

describe("Progress", () => {
  it("表示: role=progressbar に 0〜100 の値が入り、data-state は loading になる", () => {
    const { container } = render(<Progress label="アップロード" value={42} />);
    const bar = screen.getByRole("progressbar", { name: "アップロード" });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuetext", "42%");

    const root = container.querySelector('[data-slot="progress"]');
    expect(root).toHaveAttribute("data-state", "loading");
    expect(root).toHaveAttribute("data-size", "md");
    expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveStyle({
      width: "42%",
    });
  });

  it("表示: value を省略すると不確定になり、aria-valuenow が付かない", () => {
    const { container } = render(<Progress label="取り込み" />);
    const bar = screen.getByRole("progressbar", { name: "取り込み" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-valuetext", "処理中");
    expect(container.querySelector('[data-slot="progress"]')).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
    expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveClass(
      "animate-pulse",
    );
  });

  it("表示: 100% は complete（success 色）になり、completeVariant={false} では loading のまま", () => {
    const { container, rerender } = render(<Progress label="取り込み" value={100} />);
    expect(container.querySelector('[data-slot="progress"]')).toHaveAttribute(
      "data-state",
      "complete",
    );
    expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveClass(
      "bg-success-600",
    );

    rerender(<Progress label="取り込み" value={100} completeVariant={false} />);
    expect(container.querySelector('[data-slot="progress"]')).toHaveAttribute(
      "data-state",
      "loading",
    );
    expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveClass(
      "bg-surface-primary",
    );
  });

  it("表示: sm は細くなる", () => {
    const { container, rerender } = render(<Progress label="取り込み" value={10} size="sm" />);
    expect(container.querySelector('[data-slot="progress"]')).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("progressbar")).toHaveClass("h-1.5");

    rerender(<Progress label="取り込み" value={10} size="md" />);
    expect(screen.getByRole("progressbar")).toHaveClass("h-2.5");
  });

  it("操作: showValue で割合を数字でも出す。不確定のときは出さない", () => {
    const { rerender } = render(<Progress label="アップロード" value={42.4} showValue />);
    expect(screen.getByText("42%")).toBeInTheDocument();

    rerender(<Progress label="アップロード" value={42.4} />);
    expect(screen.queryByText("42%")).not.toBeInTheDocument();

    rerender(<Progress label="アップロード" showValue />);
    expect(screen.queryByText("42%")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "処理中");
  });

  it("操作できない: 表示だけの部品で、範囲外の値は 0〜100 に丸められる", () => {
    const { container, rerender } = render(<Progress label="取り込み" value={-20} showValue />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveStyle({
      width: "0%",
    });

    rerender(<Progress label="取り込み" value={180} showValue />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("100%")).toBeInTheDocument();
    // 押せる要素は持たない
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("アクセシブルネーム: label が読み上げ名になり、複数並べても取り違えない", () => {
    render(
      <div>
        <Progress label="案件データの取り込み" value={42} />
        <Progress label="添付ファイルの取り込み" value={100} />
      </div>,
    );
    expect(screen.getByRole("progressbar", { name: "案件データの取り込み" })).toHaveAttribute(
      "aria-valuenow",
      "42",
    );
    expect(screen.getByRole("progressbar", { name: "添付ファイルの取り込み" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
