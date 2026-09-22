import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from ".";

describe("Checkbox", () => {
  it("表示: 未選択ではチェックマークを出さず、選択済みでは猫の顔を出す", () => {
    const { container, rerender } = render(<Checkbox aria-label="案件を選択します" />);
    const checkbox = screen.getByRole("checkbox", { name: "案件を選択します" });
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
    expect(container.querySelector('[data-icon="cat_face"]')).toBeNull();

    rerender(<Checkbox aria-label="案件を選択します" checked />);
    expect(screen.getByRole("checkbox", { name: "案件を選択します" })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(container.querySelector('[data-icon="cat_face"]')).not.toBeNull();
  });

  it("表示: checked=indeterminate は aria-checked=mixed で横棒に切り替わる（猫の顔は data-state で隠す）", () => {
    const { container } = render(
      <Checkbox aria-label="すべて選択します" checked="indeterminate" />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "すべて選択します" });
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    expect(checkbox).toHaveAttribute("data-state", "indeterminate");
    // 横棒と猫の顔は両方描き、CSS（group-data-[state=indeterminate]）で見せ分ける
    expect(container.querySelector('[data-slot="checkbox-indicator"] span')).not.toBeNull();
    expect(container.querySelector('[data-icon="cat_face"]')?.getAttribute("class")).toContain(
      "group-data-[state=indeterminate]/checkbox:hidden",
    );
  });

  it('表示: 非制御の defaultChecked="indeterminate" でも data-state で横棒に切り替わる', () => {
    render(<Checkbox aria-label="全選択" defaultChecked="indeterminate" />);
    const box = screen.getByRole("checkbox", { name: "全選択" });
    expect(box).toHaveAttribute("aria-checked", "mixed");
    expect(box).toHaveAttribute("data-state", "indeterminate");
    // 横棒と猫の顔は両方描き、data-state で見せ分ける（props.checked を見ない）
    expect(box.querySelector("[data-slot=checkbox-indicator] span")).not.toBeNull();
  });

  it("操作: クリックで選択が切り替わり、onCheckedChange が呼ばれる", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="案件を選択します" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "案件を選択します" });

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(checkbox).not.toBeChecked();
  });

  it("操作: キーボード（Tab でフォーカスし Space）でも切り替わる", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="案件を選択します" onCheckedChange={onCheckedChange} />);
    await userEvent.tab();
    expect(screen.getByRole("checkbox", { name: "案件を選択します" })).toHaveFocus();
    await userEvent.keyboard("[Space]");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("disabled: クリックしても切り替わらず、disabled 属性が付く", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="案件を選択します" disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "案件を選択します" });
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  it("アクセシブルネーム: <label htmlFor> でも名前が付き、ラベルのクリックで切り替わる", async () => {
    const onCheckedChange = vi.fn();
    render(
      <div>
        <Checkbox id="notify" onCheckedChange={onCheckedChange} />
        <label htmlFor="notify">更新があったら通知を受け取ります</label>
      </div>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "更新があったら通知を受け取ります" });
    await userEvent.click(screen.getByText("更新があったら通知を受け取ります"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();
  });

  it("アクセシブルネーム: aria-invalid を渡すと入力エラーとして伝わる", () => {
    render(<Checkbox aria-label="利用規約に同意します" aria-invalid />);
    expect(screen.getByRole("checkbox", { name: "利用規約に同意します" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
