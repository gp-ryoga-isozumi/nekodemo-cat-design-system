import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputTime } from ".";

describe("InputTime", () => {
  it("表示: type=time で値は HH:MM、min / max と step（秒）が付く", () => {
    const { container } = render(
      <InputTime aria-label="開始時刻" defaultValue="09:00" min="08:00" max="18:00" />,
    );
    const input = screen.getByLabelText("開始時刻");
    expect(input).toHaveAttribute("type", "time");
    expect(input).toHaveValue("09:00");
    expect(input).toHaveAttribute("min", "08:00");
    expect(input).toHaveAttribute("max", "18:00");
    // 既定の stepMinutes=15 は step=900 秒
    expect(input).toHaveAttribute("step", "900");
    expect(input).toHaveClass("h-10");

    const root = container.querySelector('[data-slot="input-time"]');
    expect(root).toHaveAttribute("data-size", "md");
  });

  it("表示: stepMinutes を変えると step が変わり、size で高さが変わる", () => {
    const { container, rerender } = render(
      <InputTime aria-label="開始時刻" stepMinutes={30} size="sm" />,
    );
    expect(screen.getByLabelText("開始時刻")).toHaveAttribute("step", "1800");
    expect(screen.getByLabelText("開始時刻")).toHaveClass("h-8");
    expect(container.querySelector('[data-slot="input-time"]')).toHaveAttribute("data-size", "sm");

    rerender(<InputTime aria-label="開始時刻" stepMinutes={1} size="lg" />);
    expect(screen.getByLabelText("開始時刻")).toHaveAttribute("step", "60");
    expect(screen.getByLabelText("開始時刻")).toHaveClass("h-12");
  });

  it("操作: 時刻を入力すると値が変わり onValueChange が呼ばれる", async () => {
    const onValueChange = vi.fn();
    render(<InputTime aria-label="開始時刻" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("開始時刻");
    await userEvent.type(input, "09:30");
    expect(input).toHaveValue("09:30");
    expect(onValueChange).toHaveBeenLastCalledWith("09:30");
  });

  it("操作: 時刻の一覧ボタンを押すと showPicker、無い環境では入力欄にフォーカスする", async () => {
    render(<InputTime aria-label="開始時刻" defaultValue="09:00" />);
    const input = screen.getByLabelText("開始時刻");
    const showPicker = vi.fn();
    // jsdom には showPicker が無いので、呼ばれることだけ確かめる
    Object.defineProperty(input, "showPicker", { value: showPicker, configurable: true });

    await userEvent.click(screen.getByRole("button", { name: "時刻の一覧を開く" }));
    expect(showPicker).toHaveBeenCalled();

    // showPicker が例外を投げる環境では入力欄にフォーカスして代替する
    showPicker.mockImplementation(() => {
      throw new Error("NotAllowedError");
    });
    await userEvent.click(screen.getByRole("button", { name: "時刻の一覧を開く" }));
    expect(input).toHaveFocus();
  });

  it("disabled: 入力も一覧ボタンも無効。readOnly はボタンだけ無効になる", async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <InputTime
        aria-label="開始時刻"
        disabled
        defaultValue="09:00"
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByLabelText("開始時刻");
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "時刻の一覧を開く" })).toBeDisabled();
    await userEvent.type(input, "10:00");
    expect(input).toHaveValue("09:00");
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    render(<InputTime aria-label="受付時刻" readOnly defaultValue="09:07" />);
    expect(screen.getByLabelText("受付時刻")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "時刻の一覧を開く" })).toBeDisabled();
  });

  it("アクセシブルネーム: label htmlFor が結び付き、一覧ボタンは名前付きでタブ順に入らない", () => {
    render(
      <div>
        <label htmlFor="start">開始時刻</label>
        <InputTime id="start" aria-invalid aria-describedby="start-error" />
        <p id="start-error">開始時刻を入力してください</p>
      </div>,
    );
    const input = screen.getByLabelText("開始時刻");
    expect(input).toHaveAttribute("id", "start");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("開始時刻を入力してください");

    const picker = screen.getByRole("button", { name: "時刻の一覧を開く" });
    expect(picker).toHaveAttribute("aria-controls", "start");
    expect(picker).toHaveAttribute("tabindex", "-1");
  });

  it("アクセシブルネーム: pickerLabel で一覧ボタンの読み上げ名を変えられる", () => {
    render(<InputTime aria-label="開始時刻" pickerLabel="開始時刻の候補を開く" />);
    expect(screen.getByRole("button", { name: "開始時刻の候補を開く" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "時刻の一覧を開く" })).not.toBeInTheDocument();
  });
});
