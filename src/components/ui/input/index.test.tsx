import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from ".";

describe("Input", () => {
  it("表示: 既定は type=text / size=md で、data-slot と data-size を持つ", () => {
    const { rerender } = render(<Input aria-label="取引先名" />);
    const input = screen.getByRole("textbox", { name: "取引先名" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-size", "md");
    expect(input).toHaveClass("h-10");

    rerender(<Input aria-label="取引先名" size="sm" />);
    const small = screen.getByRole("textbox", { name: "取引先名" });
    expect(small).toHaveAttribute("data-size", "sm");
    expect(small).toHaveClass("h-8");
  });

  it("表示: placeholder と className を渡せる", () => {
    render(<Input aria-label="取引先名" placeholder="例: 山田商事" className="w-72" />);
    const input = screen.getByPlaceholderText("例: 山田商事");
    expect(input).toHaveClass("w-72");
    expect(input).toHaveClass("bg-surface-input");
  });

  it("操作: 入力すると値が変わり onChange が呼ばれる", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="取引先名" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "取引先名" });
    await userEvent.type(input, "山田商事");
    expect(input).toHaveValue("山田商事");
    expect(onChange).toHaveBeenCalled();
  });

  it("disabled: 入力できず、値も変わらない", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="取引先名" disabled defaultValue="山田商事" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "取引先名" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "鈴木工業");
    expect(input).toHaveValue("山田商事");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: label htmlFor と aria-describedby / aria-invalid が結び付く", () => {
    render(
      <div>
        <label htmlFor="company">取引先名</label>
        <Input id="company" aria-invalid aria-describedby="company-error" />
        <p id="company-error">取引先名を入力してください</p>
      </div>,
    );
    const input = screen.getByRole("textbox", { name: "取引先名" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("取引先名を入力してください");
  });
});
