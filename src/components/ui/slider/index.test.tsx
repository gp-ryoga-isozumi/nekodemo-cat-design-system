import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Slider } from ".";

// jsdom に無い API を補う（Radix Slider がつまみの大きさと位置を測るのに使う）
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.setPointerCapture = () => {};
window.HTMLElement.prototype.releasePointerCapture = () => {};

describe("Slider", () => {
  it("表示: つまみが 1 つの slider として描画され、最小・最大・現在値を持つ", () => {
    render(<Slider label="通知する日数" min={1} max={30} defaultValue={[7]} />);
    const thumb = screen.getByRole("slider", { name: "通知する日数" });
    expect(thumb).toHaveAttribute("aria-valuemin", "1");
    expect(thumb).toHaveAttribute("aria-valuemax", "30");
    expect(thumb).toHaveAttribute("aria-valuenow", "7");
  });

  it("表示: label を配列で渡すと、つまみごとに名前が付く", () => {
    render(
      <Slider
        label={["予算の下限", "予算の上限"]}
        min={0}
        max={1000}
        step={50}
        defaultValue={[200, 800]}
      />,
    );
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByRole("slider", { name: "予算の下限" })).toHaveAttribute(
      "aria-valuenow",
      "200",
    );
    expect(screen.getByRole("slider", { name: "予算の上限" })).toHaveAttribute(
      "aria-valuenow",
      "800",
    );
  });

  it("操作: 矢印キーで値が変わり、onValueChange が呼ばれる", async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        label="通知する日数"
        min={1}
        max={30}
        defaultValue={[7]}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole("slider", { name: "通知する日数" });
    await userEvent.tab();
    expect(thumb).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([8]);
    expect(thumb).toHaveAttribute("aria-valuenow", "8");

    await userEvent.keyboard("{Home}");
    expect(thumb).toHaveAttribute("aria-valuenow", "1");
  });

  it("disabled: フォーカスできず、値も変わらない", async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        label="通知する日数"
        min={1}
        max={30}
        defaultValue={[7]}
        onValueChange={onValueChange}
        disabled
      />,
    );
    const thumb = screen.getByRole("slider", { name: "通知する日数" });
    await userEvent.tab();
    expect(thumb).not.toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(thumb).toHaveAttribute("aria-valuenow", "7");
  });

  it("アクセシブルネーム: label がつまみの aria-label になる", () => {
    render(<Slider label="進捗率" min={0} max={100} defaultValue={[60]} />);
    const thumb = screen.getByRole("slider", { name: "進捗率" });
    expect(thumb).toHaveAttribute("aria-label", "進捗率");
  });
});
