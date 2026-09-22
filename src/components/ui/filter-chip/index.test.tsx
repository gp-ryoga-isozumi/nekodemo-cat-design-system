import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterChip, FilterChipGroup } from ".";

describe("FilterChip", () => {
  it("表示: type=button の押しボタンで、既定は未選択（aria-pressed=false）", () => {
    render(<FilterChip>進行中</FilterChip>);
    const chip = screen.getByRole("button", { name: "進行中" });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).toHaveAttribute("data-slot", "filter-chip");
    expect(chip).toHaveAttribute("data-size", "md");
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).toHaveClass("h-8");
  });

  it("表示: selected でチェックが出て aria-pressed=true になる", () => {
    const { container, rerender } = render(<FilterChip icon="person">自分の担当</FilterChip>);
    expect(container.querySelector('[data-icon="person"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="check"]')).not.toBeInTheDocument();

    rerender(
      <FilterChip icon="person" selected>
        自分の担当
      </FilterChip>,
    );
    expect(screen.getByRole("button", { name: "自分の担当" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // 選択中はアイコンの代わりにチェックを出す
    expect(container.querySelector('[data-icon="check"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="person"]')).not.toBeInTheDocument();
  });

  it("表示: count は 3 桁区切りで出る。size で高さが変わる", () => {
    const { rerender } = render(<FilterChip count={1234}>完了</FilterChip>);
    const chip = screen.getByRole("button", { name: /完了/ });
    expect(within(chip).getByText("1,234")).toBeInTheDocument();

    rerender(
      <FilterChip count={0} size="lg">
        下書き
      </FilterChip>,
    );
    const large = screen.getByRole("button", { name: /下書き/ });
    expect(within(large).getByText("0")).toBeInTheDocument();
    expect(large).toHaveAttribute("data-size", "lg");
    expect(large).toHaveClass("h-10");
  });

  it("操作: 押すと onSelectedChange に反転した値が渡り、onClick も呼ばれる", async () => {
    const onSelectedChange = vi.fn();
    const onClick = vi.fn();
    const { rerender } = render(
      <FilterChip onSelectedChange={onSelectedChange} onClick={onClick}>
        進行中
      </FilterChip>,
    );
    await userEvent.click(screen.getByRole("button", { name: "進行中" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(true);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <FilterChip selected onSelectedChange={onSelectedChange} onClick={onClick}>
        進行中
      </FilterChip>,
    );
    await userEvent.click(screen.getByRole("button", { name: "進行中" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(false);
    expect(onSelectedChange).toHaveBeenCalledTimes(2);
  });

  it("操作: onClick で preventDefault すると選択は切り替わらない", async () => {
    const onSelectedChange = vi.fn();
    render(
      <FilterChip onSelectedChange={onSelectedChange} onClick={(e) => e.preventDefault()}>
        進行中
      </FilterChip>,
    );
    await userEvent.click(screen.getByRole("button", { name: "進行中" }));
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it("disabled: 押しても何も起きない", async () => {
    const onSelectedChange = vi.fn();
    render(
      <FilterChip disabled onSelectedChange={onSelectedChange}>
        完了
      </FilterChip>,
    );
    const chip = screen.getByRole("button", { name: "完了" });
    expect(chip).toBeDisabled();
    await userEvent.click(chip);
    expect(onSelectedChange).not.toHaveBeenCalled();
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("アクセシブルネーム: Group は aria-label がグループ名になり、チップは文言で引ける", () => {
    render(
      <FilterChipGroup aria-label="状態で絞り込む">
        <FilterChip>進行中</FilterChip>
        <FilterChip selected>完了</FilterChip>
      </FilterChipGroup>,
    );
    const group = screen.getByRole("group", { name: "状態で絞り込む" });
    expect(group).toHaveAttribute("data-slot", "filter-chip-group");
    expect(group.tagName).toBe("FIELDSET");
    // legend は視覚的に隠すだけで、読み上げには残す
    expect(within(group).getByText("状態で絞り込む")).toHaveClass("sr-only");

    expect(within(group).getAllByRole("button")).toHaveLength(2);
    expect(within(group).getByRole("button", { name: "完了" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
