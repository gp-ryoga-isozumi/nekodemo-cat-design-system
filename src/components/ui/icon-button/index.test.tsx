import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from ".";

describe("IconButton", () => {
  it("表示: asChild で子の <a> にボタンの見た目・名前・アイコンが付く", () => {
    render(
      <IconButton icon="edit" label="案件を編集" asChild>
        <a href="/projects/1/edit">編集</a>
      </IconButton>,
    );
    const link = screen.getByRole("link", { name: "案件を編集" });
    expect(link).toHaveAttribute("href", "/projects/1/edit");
    expect(link).toHaveAttribute("data-slot", "icon-button");
    expect(link.querySelector('[data-icon="edit"]')).not.toBeNull();
  });

  it("表示: アイコンを描画し、data 属性と既定の type=button を持つ", () => {
    const { container } = render(
      <IconButton icon="delete" label="削除する" variant="negative" size="sm" />,
    );
    const button = screen.getByRole("button", { name: "削除する" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-slot", "icon-button");
    expect(button).toHaveAttribute("data-variant", "negative");
    expect(button).toHaveAttribute("data-size", "sm");
    expect(button).toHaveClass("size-8");
    // アイコン自体は装飾扱い（aria-hidden）で、名前はボタンの label が担う
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("data-icon", "delete");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("操作: クリックで onClick が呼ばれる", async () => {
    const onClick = vi.fn();
    render(<IconButton icon="edit" label="編集する" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "編集する" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled: 押しても onClick が呼ばれない", async () => {
    const onClick = vi.fn();
    render(<IconButton icon="edit" label="編集する" disabled onClick={onClick} />);
    const button = screen.getByRole("button", { name: "編集する" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: label が aria-label と title になる", () => {
    render(<IconButton icon="more_vert" label="山田商事の操作を開く" />);
    const button = screen.getByRole("button", { name: "山田商事の操作を開く" });
    expect(button).toHaveAttribute("aria-label", "山田商事の操作を開く");
    expect(button).toHaveAttribute("title", "山田商事の操作を開く");
  });
});
