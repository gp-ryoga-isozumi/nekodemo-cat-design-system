import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from ".";

describe("Button", () => {
  it("表示: children と variant / size の data 属性を描画し、既定は type=button", () => {
    render(
      <Button variant="negative" size="sm">
        削除する
      </Button>,
    );
    const button = screen.getByRole("button", { name: "削除する" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-variant", "negative");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("操作: クリックで onClick が呼ばれる", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>保存する</Button>);
    await userEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled / loading: 押せず、loading は aria-busy と Spinner を出す", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button disabled onClick={onClick}>
        保存する
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Button loading onClick={onClick}>
        保存中
      </Button>,
    );
    const button = screen.getByRole("button", { name: /保存中/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status", { name: "読み込み中" })).toBeInTheDocument();
  });

  it("アクセシブルネーム: asChild でリンクにしても名前と role が正しい", () => {
    render(
      <Button asChild>
        <a href="/projects">案件一覧へ</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "案件一覧へ" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).not.toHaveAttribute("type");
  });
});
