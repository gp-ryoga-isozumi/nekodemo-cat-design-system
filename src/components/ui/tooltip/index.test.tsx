import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "../icon-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from ".";

// jsdom には ResizeObserver / IntersectionObserver が無く、Radix Popper（floating-ui）が参照するため最小のモックを置く
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

function renderTooltip() {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton icon="delete" label="削除" />
        </TooltipTrigger>
        <TooltipContent>この案件を削除します</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe("Tooltip", () => {
  it("表示: 既定では閉じていて、ホバーすると role=tooltip の説明が出る", async () => {
    renderTooltip();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await userEvent.hover(screen.getByRole("button", { name: "削除" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("この案件を削除します");
  });

  it("操作: キーボードのフォーカスでも開き、Escape で閉じる", async () => {
    renderTooltip();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "削除" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // disabled: 省略。Tooltip 自体に無効状態は無く、トリガーの disabled はトリガー部品の責務。
  // 実ブラウザでは disabled な要素がポインタイベントを発火しないため開かないが、
  // jsdom ＋ userEvent はイベントを直接送るため開いてしまい、テストにならない。

  it("アクセシブルネーム: トリガーの名前は変わらず、開くと aria-describedby が内容を指す", async () => {
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "削除" });
    expect(trigger).not.toHaveAttribute("aria-describedby");
    await userEvent.hover(trigger);
    const tooltip = await screen.findByRole("tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.getAttribute("id"));
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });
});
