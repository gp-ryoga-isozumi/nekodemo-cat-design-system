import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputDate } from ".";

describe("InputDate", () => {
  it("表示: type=date で値は YYYY-MM-DD、min / max と size が反映される", () => {
    const { container } = render(
      <InputDate
        aria-label="納品予定日"
        defaultValue="2026-10-31"
        min="2026-04-01"
        max="2027-03-31"
      />,
    );
    const input = screen.getByLabelText("納品予定日");
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveValue("2026-10-31");
    expect(input).toHaveAttribute("min", "2026-04-01");
    expect(input).toHaveAttribute("max", "2027-03-31");
    expect(input).toHaveClass("h-10");

    const root = container.querySelector('[data-slot="input-date"]');
    expect(root).toHaveAttribute("data-size", "md");
  });

  it("表示: size を変えると高さが変わる", () => {
    const { container, rerender } = render(<InputDate aria-label="納品予定日" size="sm" />);
    expect(screen.getByLabelText("納品予定日")).toHaveClass("h-8");
    expect(container.querySelector('[data-slot="input-date"]')).toHaveAttribute("data-size", "sm");

    rerender(<InputDate aria-label="納品予定日" size="lg" />);
    expect(screen.getByLabelText("納品予定日")).toHaveClass("h-12");
  });

  it("操作: 日付を入力すると値が変わり onValueChange が呼ばれる", async () => {
    const onValueChange = vi.fn();
    render(<InputDate aria-label="納品予定日" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("納品予定日");
    await userEvent.type(input, "2026-10-31");
    expect(input).toHaveValue("2026-10-31");
    expect(onValueChange).toHaveBeenLastCalledWith("2026-10-31");
  });

  it("操作: カレンダーボタンを押すと入力欄に移る（showPicker が無い環境ではフォーカス）", async () => {
    render(<InputDate aria-label="納品予定日" defaultValue="2026-10-31" />);
    const input = screen.getByLabelText("納品予定日");
    const showPicker = vi.fn();
    // jsdom には showPicker が無いので、呼ばれることだけ確かめる
    Object.defineProperty(input, "showPicker", { value: showPicker, configurable: true });

    await userEvent.click(screen.getByRole("button", { name: "カレンダーを開く" }));
    expect(showPicker).toHaveBeenCalled();

    // showPicker が例外を投げる環境では入力欄にフォーカスして代替する
    showPicker.mockImplementation(() => {
      throw new Error("NotAllowedError");
    });
    await userEvent.click(screen.getByRole("button", { name: "カレンダーを開く" }));
    expect(input).toHaveFocus();
  });

  it("disabled: 入力もカレンダーボタンも無効。readOnly はボタンだけ無効になる", async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <InputDate
        aria-label="納品予定日"
        disabled
        defaultValue="2026-10-31"
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByLabelText("納品予定日");
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "カレンダーを開く" })).toBeDisabled();
    await userEvent.type(input, "2026-12-01");
    expect(input).toHaveValue("2026-10-31");
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    render(<InputDate aria-label="受注日" readOnly defaultValue="2026-09-22" />);
    expect(screen.getByLabelText("受注日")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "カレンダーを開く" })).toBeDisabled();
  });

  it("アクセシブルネーム: label htmlFor が入力欄に結び付き、ボタンは名前付きで tabIndex=-1", () => {
    render(
      <div>
        <label htmlFor="due">納品予定日</label>
        <InputDate
          id="due"
          aria-invalid
          aria-describedby="due-error"
          pickerLabel="カレンダーを開く"
        />
        <p id="due-error">納品予定日を入力してください</p>
      </div>,
    );
    const input = screen.getByLabelText("納品予定日");
    expect(input).toHaveAttribute("id", "due");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("納品予定日を入力してください");

    const picker = screen.getByRole("button", { name: "カレンダーを開く" });
    expect(picker).toHaveAttribute("aria-controls", "due");
    expect(picker).toHaveAttribute("tabindex", "-1");
  });
});
