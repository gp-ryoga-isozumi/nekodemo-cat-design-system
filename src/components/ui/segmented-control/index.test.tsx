import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl, SegmentedControlItem } from ".";

function ViewSwitch({
  onValueChange,
  disabled,
  size,
}: {
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
} = {}) {
  return (
    <SegmentedControl
      aria-label="案件の表示"
      defaultValue="list"
      size={size}
      disabled={disabled}
      onValueChange={onValueChange}
    >
      <SegmentedControlItem value="list">一覧</SegmentedControlItem>
      <SegmentedControlItem value="grid">カード</SegmentedControlItem>
      <SegmentedControlItem value="calendar" disabled>
        カレンダー
      </SegmentedControlItem>
    </SegmentedControl>
  );
}

/** 値を親で持つ使い方（選択中の項目を押しても外れないことを確かめる） */
function ControlledViewSwitch({ onValueChange }: { onValueChange?: (value: string) => void }) {
  const [view, setView] = useState("list");
  return (
    <SegmentedControl
      aria-label="案件の表示"
      value={view}
      onValueChange={(value) => {
        setView(value);
        onValueChange?.(value);
      }}
    >
      <SegmentedControlItem value="list">一覧</SegmentedControlItem>
      <SegmentedControlItem value="grid">カード</SegmentedControlItem>
    </SegmentedControl>
  );
}

describe("SegmentedControl", () => {
  it("アクセシブルネーム: aria-label も aria-labelledby も無いと開発時に警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SegmentedControl defaultValue="a">
        <SegmentedControlItem value="a">A</SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("読み上げ名がありません"));
    warn.mockRestore();
  });

  it("表示: radiogroup と radio で描画され、選択中だけ aria-checked=true になる", () => {
    const { rerender } = render(<ViewSwitch />);
    const group = screen.getByRole("radiogroup", { name: "案件の表示" });
    expect(group).toHaveAttribute("data-slot", "segmented-control");
    expect(group).toHaveAttribute("data-size", "md");
    expect(group).toHaveClass("h-10");
    expect(within(group).getAllByRole("radio")).toHaveLength(3);

    expect(screen.getByRole("radio", { name: "一覧" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "カード" })).toHaveAttribute("aria-checked", "false");

    rerender(<ViewSwitch size="sm" />);
    expect(screen.getByRole("radiogroup", { name: "案件の表示" })).toHaveAttribute(
      "data-size",
      "sm",
    );
  });

  it("操作: 別の項目を押すと選択が移り、矢印キーで項目間を移動できる", async () => {
    const onValueChange = vi.fn();
    render(<ViewSwitch onValueChange={onValueChange} />);

    const grid = screen.getByRole("radio", { name: "カード" });
    await userEvent.click(grid);
    expect(onValueChange).toHaveBeenCalledWith("grid");
    expect(grid).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "一覧" })).toHaveAttribute("aria-checked", "false");

    // ← → はフォーカスだけでなく選択も移す（radio group の作法。無効な項目は飛ばす）
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "一覧" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "一覧" })).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenLastCalledWith("list");
  });

  it("操作: 選択中の項目を押しても onValueChange が空文字で呼ばれない", async () => {
    const onValueChange = vi.fn();
    render(<ViewSwitch onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "一覧" }));
    expect(onValueChange).not.toHaveBeenCalled();

    // 別の項目に移してから、もう一度同じ項目を押しても空文字では呼ばれない
    await userEvent.click(screen.getByRole("radio", { name: "カード" }));
    expect(onValueChange).toHaveBeenLastCalledWith("grid");
    onValueChange.mockClear();
    await userEvent.click(screen.getByRole("radio", { name: "カード" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("操作: 値を渡して使うと、選択中の項目を押しても選択が外れない", async () => {
    const onValueChange = vi.fn();
    render(<ControlledViewSwitch onValueChange={onValueChange} />);

    const list = screen.getByRole("radio", { name: "一覧" });
    await userEvent.click(list);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(list).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByRole("radio", { name: "カード" }));
    const grid = screen.getByRole("radio", { name: "カード" });
    expect(grid).toHaveAttribute("aria-checked", "true");
    await userEvent.click(grid);
    expect(grid).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "一覧" })).toHaveAttribute("aria-checked", "false");
  });

  it("disabled: 無効な項目は選べず、グループ全体を無効にもできる", async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(<ViewSwitch onValueChange={onValueChange} />);
    const calendar = screen.getByRole("radio", { name: "カレンダー" });
    expect(calendar).toBeDisabled();
    await userEvent.click(calendar);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "一覧" })).toHaveAttribute("aria-checked", "true");
    unmount();

    render(<ViewSwitch disabled onValueChange={onValueChange} />);
    for (const item of screen.getAllByRole("radio")) expect(item).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "カード" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: グループに aria-label、項目は文言が名前になる", () => {
    render(<ViewSwitch />);
    expect(screen.getByRole("radiogroup", { name: "案件の表示" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "一覧" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "カード" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "カレンダー" })).toBeInTheDocument();
  });
});
