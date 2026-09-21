import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from ".";

// jsdom に無い API を補う（Radix Popper（floating-ui）が参照する）
class ObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("ResizeObserver", ObserverMock);
vi.stubGlobal("IntersectionObserver", ObserverMock);
vi.stubGlobal("DOMRect", class {});
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.setPointerCapture = () => {};
window.HTMLElement.prototype.releasePointerCapture = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

function renderPopover(props?: { triggerDisabled?: boolean; onApply?: () => void }) {
  return render(
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={props?.triggerDisabled}>
          列の表示
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="columns-title">
        <PopoverTitle id="columns-title">列の表示</PopoverTitle>
        <PopoverDescription>チェックを外した列は一覧から隠れます。</PopoverDescription>
        <PopoverClose asChild>
          <Button size="sm" onClick={props?.onApply}>
            反映する
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>,
  );
}

const openPopover = async () => {
  await userEvent.click(screen.getByRole("button", { name: "列の表示" }));
  return screen.findByRole("dialog");
};

describe("Popover", () => {
  it("表示: 既定では閉じていて、トリガーを押すと見出しと説明が出る", async () => {
    renderPopover();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const content = await openPopover();
    expect(content).toHaveAttribute("data-slot", "popover-content");
    expect(content).toHaveTextContent("チェックを外した列は一覧から隠れます。");
    expect(screen.getByRole("heading", { name: "列の表示" })).toHaveAttribute(
      "data-slot",
      "popover-title",
    );
  });

  it("表示: PopoverAnchor を置くとトリガーが別の場所にあっても開ける", async () => {
    render(
      <Popover>
        <PopoverAnchor asChild>
          <div>
            <span>社内備品貸出アプリ 改修</span>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                補足を見る
              </Button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent aria-labelledby="anchor-title">
          <PopoverTitle id="anchor-title">案件の補足</PopoverTitle>
          <PopoverDescription>担当は五十棲さんです。</PopoverDescription>
        </PopoverContent>
      </Popover>,
    );
    await userEvent.click(screen.getByRole("button", { name: "補足を見る" }));
    expect(await screen.findByRole("dialog")).toHaveTextContent("担当は五十棲さんです。");
  });

  it("操作: PopoverClose と Esc で閉じ、中のボタンの onClick も呼ばれる", async () => {
    const onApply = vi.fn();
    const { unmount } = renderPopover({ onApply });
    await openPopover();
    await userEvent.click(screen.getByRole("button", { name: "反映する" }));
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    renderPopover();
    await openPopover();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("disabled: 無効なトリガーは開かない", async () => {
    renderPopover({ triggerDisabled: true });
    const trigger = screen.getByRole("button", { name: "列の表示" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("アクセシブルネーム: aria-labelledby で PopoverTitle が dialog の名前になり、トリガーは aria-expanded を持つ", async () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "列の表示" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await openPopover();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "列の表示" })).toBeInTheDocument();
  });
});
