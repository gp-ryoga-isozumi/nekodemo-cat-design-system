import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InlineMessage } from ".";

// disabled: InlineMessage は入力部品ではなく無効状態を持たないため省略する（action に渡すボタン側の責務）。

describe("InlineMessage", () => {
  it("表示: children と data-slot / data-variant を描画し、アイコンが 1 つ付く", () => {
    const { container } = render(
      <InlineMessage variant="success">
        案件「社内備品貸出アプリ 改修」を保存しました。
      </InlineMessage>,
    );
    const root = container.querySelector('[data-slot="inline-message"]');
    expect(root).toHaveAttribute("data-variant", "success");
    expect(root).toHaveTextContent("案件「社内備品貸出アプリ 改修」を保存しました。");
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("表示: title と action を渡すと両方描画される", () => {
    render(
      <InlineMessage
        variant="negative"
        title="一覧を読み込めませんでした"
        action={<button type="button">再試行する</button>}
      >
        通信状態を確認してください。
      </InlineMessage>,
    );
    expect(screen.getByText("一覧を読み込めませんでした")).toBeInTheDocument();
    expect(screen.getByText("通信状態を確認してください。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再試行する" })).toBeInTheDocument();
  });

  it("操作: action のボタンを押すと onClick が呼ばれる", async () => {
    const onRetry = vi.fn();
    render(
      <InlineMessage
        variant="negative"
        action={
          <button type="button" onClick={onRetry}>
            再試行する
          </button>
        }
      >
        一覧を読み込めませんでした。
      </InlineMessage>,
    );
    await userEvent.click(screen.getByRole("button", { name: "再試行する" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("アクセシブルネーム: negative は role=alert、それ以外は role=status になる", () => {
    const { rerender } = render(
      <InlineMessage variant="negative">一覧を読み込めませんでした。</InlineMessage>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("一覧を読み込めませんでした。");

    for (const variant of ["info", "success", "warning"] as const) {
      rerender(<InlineMessage variant={variant}>この案件は自動で完了になります。</InlineMessage>);
      expect(screen.getByRole("status")).toHaveAttribute("data-variant", variant);
    }
  });
});
