import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Divider } from ".";

describe("Divider", () => {
  it("表示: 既定は横向きで data-slot / data-orientation を持つ", () => {
    const { container } = render(<Divider />);
    const divider = container.querySelector('[data-slot="divider"]');
    expect(divider).not.toBeNull();
    expect(divider).toHaveAttribute("data-orientation", "horizontal");
  });

  it("表示: orientation=vertical で縦向きになる", () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.querySelector('[data-slot="divider"]')).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("操作: 操作部品ではないため Tab でフォーカスされない", async () => {
    render(
      <div>
        <Divider />
        <a href="/projects">案件一覧へ</a>
      </div>,
    );
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "案件一覧へ" })).toHaveFocus();
  });

  // disabled: Divider は区切り線で無効状態を持たないため、この観点は該当しない

  it("アクセシブルネーム: 既定（decorative）は読み上げから外れる", () => {
    render(<Divider />);
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("アクセシブルネーム: decorative={false} は role=separator になり、縦は aria-orientation が付く", () => {
    const { rerender } = render(<Divider decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();

    rerender(<Divider decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
});
