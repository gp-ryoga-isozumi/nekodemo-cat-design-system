import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputNumber } from ".";

describe("InputNumber", () => {
  it("表示: spinbutton として描画され、3 桁区切りと単位・範囲を持つ", () => {
    const { container } = render(
      <InputNumber aria-label="受注金額" unit="円" min={0} max={9999999} defaultValue={1200000} />,
    );
    const input = screen.getByRole("spinbutton", { name: "受注金額" });
    expect(input).toHaveValue("1,200,000");
    expect(input).toHaveAttribute("aria-valuenow", "1200000");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "9999999");
    expect(screen.getByText("円")).toBeInTheDocument();

    const root = container.querySelector('[data-slot="input-number"]');
    expect(root).toHaveAttribute("data-size", "md");
    expect(root).toHaveClass("h-10");
  });

  it("表示: 編集中は区切りなし、blur で 3 桁区切りに戻る（format=false なら常に区切りなし）", async () => {
    const { unmount } = render(<InputNumber aria-label="受注金額" defaultValue={1200000} />);
    const input = screen.getByRole("spinbutton", { name: "受注金額" });
    await userEvent.click(input);
    expect(input).toHaveValue("1200000");
    await userEvent.tab();
    expect(input).toHaveValue("1,200,000");
    unmount();

    render(<InputNumber aria-label="案件の年度" format={false} defaultValue={2026} />);
    expect(screen.getByRole("spinbutton", { name: "案件の年度" })).toHaveValue("2026");
  });

  it("操作: 増減ボタンと ↑↓ キーで step ずつ増減し、onValueChange が数値で呼ばれる", async () => {
    const onValueChange = vi.fn();
    render(
      <InputNumber
        aria-label="受注金額"
        unit="円"
        min={0}
        step={1000}
        defaultValue={1200000}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("spinbutton", { name: "受注金額" });

    await userEvent.click(screen.getByRole("button", { name: "増やす" }));
    expect(onValueChange).toHaveBeenLastCalledWith(1201000);
    expect(input).toHaveValue("1,201,000");

    await userEvent.click(screen.getByRole("button", { name: "減らす" }));
    expect(onValueChange).toHaveBeenLastCalledWith(1200000);
    expect(input).toHaveValue("1,200,000");

    // 編集中は区切りなしで表示される
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(1202000);
    expect(input).toHaveValue("1202000");
    await userEvent.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(1201000);
  });

  it("操作: blur で min / max に丸め、全角数字とカンマも受け付ける", async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <InputNumber aria-label="納品数" unit="件" min={1} max={99} onValueChange={onValueChange} />,
    );
    const quantity = screen.getByRole("spinbutton", { name: "納品数" });
    await userEvent.type(quantity, "150");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(99);
    expect(quantity).toHaveValue("99");
    unmount();

    onValueChange.mockClear();
    render(<InputNumber aria-label="受注金額" onValueChange={onValueChange} />);
    const amount = screen.getByRole("spinbutton", { name: "受注金額" });
    await userEvent.type(amount, "１，２００");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(1200);
    expect(amount).toHaveValue("1,200");
  });

  it("操作: min / max に達すると対応する増減ボタンが無効になる", () => {
    const { rerender } = render(
      <InputNumber aria-label="納品数" min={1} max={99} value={99} onValueChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "増やす" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "減らす" })).toBeEnabled();

    rerender(
      <InputNumber aria-label="納品数" min={1} max={99} value={1} onValueChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "減らす" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "増やす" })).toBeEnabled();
  });

  it("disabled: 入力も増減もできず、値が変わらない", async () => {
    const onValueChange = vi.fn();
    render(
      <InputNumber
        aria-label="受注金額"
        unit="円"
        disabled
        defaultValue={1200000}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("spinbutton", { name: "受注金額" });
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "増やす" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "減らす" })).toBeDisabled();

    await userEvent.type(input, "5000");
    await userEvent.click(screen.getByRole("button", { name: "増やす" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("1,200,000");
  });

  it("アクセシブルネーム: label htmlFor が spinbutton に結び付き、増減ボタンに名前が付く", () => {
    render(
      <div>
        <label htmlFor="amount">受注金額</label>
        <InputNumber id="amount" unit="円" aria-invalid aria-describedby="amount-error" />
        <p id="amount-error">受注金額を入力してください</p>
      </div>,
    );
    const input = screen.getByRole("spinbutton", { name: "受注金額" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("受注金額を入力してください");

    const decrement = screen.getByRole("button", { name: "減らす" });
    expect(decrement).toHaveAttribute("aria-controls", "amount");
    expect(decrement).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "増やす" })).toHaveAttribute(
      "aria-controls",
      "amount",
    );
  });
});
