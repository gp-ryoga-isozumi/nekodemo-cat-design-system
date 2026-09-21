import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputPassword, type InputPasswordProps } from ".";

function renderField(props: InputPasswordProps = {}) {
  return render(
    <>
      <label htmlFor="password">パスワード</label>
      <InputPassword id="password" {...props} />
    </>,
  );
}

describe("InputPassword", () => {
  it("表示: 既定は type=password で、表示切替ボタンは aria-pressed=false", () => {
    const { container } = renderField();
    const input = screen.getByLabelText("パスワード");
    expect(input).toHaveAttribute("type", "password");
    expect(container.querySelector('[data-slot="input-password"]')).not.toBeNull();
    expect(screen.getByRole("button", { name: "パスワードを表示" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("操作: 表示切替ボタンで type と aria-pressed が切り替わり、入力は onChange を呼ぶ", async () => {
    const onChange = vi.fn();
    renderField({ onChange });
    const input = screen.getByLabelText("パスワード");

    await userEvent.type(input, "neko");
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("neko");

    await userEvent.click(screen.getByRole("button", { name: "パスワードを表示" }));
    expect(screen.getByLabelText("パスワード")).toHaveAttribute("type", "text");
    const hide = screen.getByRole("button", { name: "パスワードを隠す" });
    expect(hide).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(hide);
    expect(screen.getByLabelText("パスワード")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "パスワードを表示" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("disabled: 入力できず、値も変わらない", async () => {
    const onChange = vi.fn();
    renderField({ disabled: true, onChange });
    const input = screen.getByLabelText("パスワード");
    expect(input).toBeDisabled();
    await userEvent.type(input, "neko");
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("アクセシブルネーム: 入力は label と結ばれ、切替ボタンは状態に応じた名前を持つ", async () => {
    renderField();
    expect(screen.getByLabelText("パスワード")).toHaveAttribute("id", "password");

    const show = screen.getByRole("button", { name: "パスワードを表示" });
    expect(show).toHaveAttribute("title", "パスワードを表示");
    expect(show).toHaveAttribute("type", "button");

    await userEvent.click(show);
    expect(screen.getByRole("button", { name: "パスワードを隠す" })).toHaveAttribute(
      "title",
      "パスワードを隠す",
    );
  });
});
