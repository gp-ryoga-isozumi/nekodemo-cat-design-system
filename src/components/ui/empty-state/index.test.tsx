import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { NekoThemeProvider } from "../../theme/NekoThemeProvider";
import { EmptyState } from ".";

// EmptyState は useNekoTheme でマスコットのテーマを決めるため、Provider で包んで描画する
function renderWithTheme(ui: ReactNode) {
  return render(<NekoThemeProvider defaultTheme="calico">{ui}</NekoThemeProvider>);
}

// disabled: EmptyState は入力部品ではなく無効状態を持たないため省略する（action に渡すボタン側の責務）。

describe("EmptyState", () => {
  it("表示: 見出し・説明・マスコットを描画する", () => {
    const { container } = renderWithTheme(
      <EmptyState
        title="まだ案件がありません"
        description="最初の案件を追加すると、ここに一覧が表示されます。"
      />,
    );
    expect(container.querySelector('[data-slot="empty-state"]')).toBeInTheDocument();
    expect(screen.getByText("まだ案件がありません")).toBeInTheDocument();
    expect(
      screen.getByText("最初の案件を追加すると、ここに一覧が表示されます。"),
    ).toBeInTheDocument();
    const mascot = container.querySelector('[data-slot="mascot"]');
    expect(mascot).toHaveAttribute("data-neko-theme", "calico");
  });

  it("表示: hideMascot ならマスコットを描画しない", () => {
    const { container } = renderWithTheme(<EmptyState hideMascot title="通知はありません" />);
    expect(container.querySelector('[data-slot="mascot"]')).toBeNull();
  });

  it("操作: action のボタンを押すと onClick が呼ばれる", async () => {
    const onAdd = vi.fn();
    renderWithTheme(
      <EmptyState
        title="まだ案件がありません"
        action={
          <button type="button" onClick={onAdd}>
            案件を追加する
          </button>
        }
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "案件を追加する" }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("アクセシブルネーム: title は見出し（レベル 3）になり、マスコットは読み上げられない", () => {
    const { container } = renderWithTheme(
      <EmptyState title="条件に合う案件がありません" description="山田商事の案件は 0 件です。" />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "条件に合う案件がありません" }),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-slot="mascot"]')).toHaveAttribute("aria-hidden", "true");
  });
});
