import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

function renderDialog(props?: {
  onAction?: () => void;
  actionDisabled?: boolean;
  triggerDisabled?: boolean;
}) {
  return render(
    <div>
      <button type="button">別の操作</button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="negative" disabled={props?.triggerDisabled}>
            案件を削除する
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>この案件を削除しますか？</DialogTitle>
            <DialogDescription>関連する 8 件のタスクも削除されます。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogCancel>キャンセル</DialogCancel>
            <DialogAction
              variant="negative"
              disabled={props?.actionDisabled}
              onClick={props?.onAction}
            >
              削除する
            </DialogAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>,
  );
}

const openDialog = async () => {
  await userEvent.click(screen.getByRole("button", { name: "案件を削除する" }));
  return screen.findByRole("alertdialog");
};

describe("Dialog", () => {
  it("表示: 既定では閉じていて、トリガーを押すと alertdialog に見出し・説明・2 つのボタンが出る", async () => {
    renderDialog();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    const dialog = await openDialog();
    expect(dialog).toHaveAttribute("data-slot", "dialog-content");
    expect(dialog).toHaveTextContent("この案件を削除しますか？");
    expect(dialog).toHaveTextContent("関連する 8 件のタスクも削除されます。");
    expect(screen.getByRole("button", { name: "削除する" })).toHaveAttribute(
      "data-variant",
      "negative",
    );
    expect(screen.getByRole("button", { name: "キャンセル" })).toHaveAttribute(
      "data-slot",
      "dialog-cancel",
    );
  });

  it("操作: 確定ボタンで onClick が呼ばれて閉じ、キャンセルでは呼ばれずに閉じる", async () => {
    const onAction = vi.fn();
    const { unmount } = renderDialog({ onAction });
    await openDialog();
    await userEvent.click(screen.getByRole("button", { name: "削除する" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    unmount();

    const onCancelled = vi.fn();
    renderDialog({ onAction: onCancelled });
    await openDialog();
    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(onCancelled).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("操作: 外側（オーバーレイ）をクリックしても閉じない（必ずボタンで答える）", async () => {
    // 開いている間は body が pointer-events: none になるため、判定を切って明示的にクリックする
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderDialog();
    await user.click(screen.getByRole("button", { name: "案件を削除する" }));
    await screen.findByRole("alertdialog");
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).not.toBeNull();
    await user.click(overlay as HTMLElement);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("disabled: 無効なトリガーは開かず、無効な確定ボタンは押しても閉じない", async () => {
    const onAction = vi.fn();
    const { unmount } = renderDialog({ onAction, triggerDisabled: true });
    const trigger = screen.getByRole("button", { name: "案件を削除する" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    unmount();

    renderDialog({ onAction, actionDisabled: true });
    await openDialog();
    const action = screen.getByRole("button", { name: "削除する" });
    expect(action).toBeDisabled();
    await userEvent.click(action);
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("アクセシブルネーム: alertdialog の名前は DialogTitle、説明は aria-describedby で結ばれる", async () => {
    renderDialog();
    await openDialog();
    const dialog = await screen.findByRole("alertdialog", { name: "この案件を削除しますか？" });
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      "関連する 8 件のタスクも削除されます。",
    );
  });
});
