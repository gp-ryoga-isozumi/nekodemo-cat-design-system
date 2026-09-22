import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from ".";

// jsdom に無い API を補う（Radix の FocusScope / スクロールロックが参照する）
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
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.setPointerCapture = () => {};
window.HTMLElement.prototype.releasePointerCapture = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

function renderDrawer(props?: {
  side?: "right" | "left" | "bottom";
  onEdit?: () => void;
  editDisabled?: boolean;
  triggerDisabled?: boolean;
  showCloseButton?: boolean;
}) {
  return render(
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" disabled={props?.triggerDisabled}>
          詳細を見る
        </Button>
      </DrawerTrigger>
      <DrawerContent side={props?.side} showCloseButton={props?.showCloseButton}>
        <DrawerHeader>
          <DrawerTitle>社内備品貸出アプリ 改修</DrawerTitle>
          <DrawerDescription>案件番号 PRJ-2026-041</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p>担当者は五十棲さんです。</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              キャンセル
            </Button>
          </DrawerClose>
          <Button size="sm" disabled={props?.editDisabled} onClick={props?.onEdit}>
            編集する
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  );
}

const openDrawer = async () => {
  await userEvent.click(screen.getByRole("button", { name: "詳細を見る" }));
  return screen.findByRole("dialog");
};

describe("Drawer", () => {
  it("表示: 既定では閉じていて、トリガーを押すと右から出るパネルが開く", async () => {
    renderDrawer();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const drawer = await openDrawer();
    expect(drawer).toHaveAttribute("data-slot", "drawer-content");
    expect(drawer).toHaveAttribute("data-side", "right");
    expect(drawer).toHaveTextContent("担当者は五十棲さんです。");
    expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });

  it("表示: side で left / bottom にでき、showCloseButton={false} で閉じるボタンを消せる", async () => {
    const { unmount } = renderDrawer({ side: "left" });
    expect(await openDrawer()).toHaveAttribute("data-side", "left");
    unmount();

    const bottom = renderDrawer({ side: "bottom", showCloseButton: false });
    expect(await openDrawer()).toHaveAttribute("data-side", "bottom");
    expect(screen.queryByRole("button", { name: "閉じる" })).not.toBeInTheDocument();
    bottom.unmount();
  });

  it("操作: DrawerClose と Esc で閉じ、フッターのボタンは onClick が呼ばれる", async () => {
    const onEdit = vi.fn();
    const { unmount } = renderDrawer({ onEdit });
    await openDrawer();
    await userEvent.click(screen.getByRole("button", { name: "編集する" }));
    expect(onEdit).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    renderDrawer();
    await openDrawer();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // 閉じたらフォーカスは開いたボタンに戻る
    expect(screen.getByRole("button", { name: "詳細を見る" })).toHaveFocus();
  });

  it("disabled: 無効なトリガーは開かず、無効なフッターボタンは押しても呼ばれない", async () => {
    const onEdit = vi.fn();
    const { unmount } = renderDrawer({ onEdit, triggerDisabled: true });
    const trigger = screen.getByRole("button", { name: "詳細を見る" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    renderDrawer({ onEdit, editDisabled: true });
    await openDrawer();
    const edit = screen.getByRole("button", { name: "編集する" });
    expect(edit).toBeDisabled();
    await userEvent.click(edit);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: dialog の名前は DrawerTitle、説明は aria-describedby で結ばれる", async () => {
    renderDrawer();
    await openDrawer();
    const drawer = await screen.findByRole("dialog", { name: "社内備品貸出アプリ 改修" });
    const describedBy = drawer.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      "案件番号 PRJ-2026-041",
    );
    expect(screen.getByRole("button", { name: "閉じる" })).toHaveAttribute("title", "閉じる");
  });
});
