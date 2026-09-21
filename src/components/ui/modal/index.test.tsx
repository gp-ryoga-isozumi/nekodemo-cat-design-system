import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
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

function renderModal(props?: {
  onSave?: () => void;
  saveDisabled?: boolean;
  triggerDisabled?: boolean;
  showCloseButton?: boolean;
}) {
  return render(
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline" disabled={props?.triggerDisabled}>
          担当者を変更する
        </Button>
      </ModalTrigger>
      <ModalContent showCloseButton={props?.showCloseButton}>
        <ModalHeader>
          <ModalTitle>担当者を変更する</ModalTitle>
          <ModalDescription>変更すると新しい担当者に通知が届きます。</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p>現在の担当者は五十棲さんです。</p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </ModalClose>
          <Button disabled={props?.saveDisabled} onClick={props?.onSave}>
            変更する
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>,
  );
}

const openModal = async () => {
  await userEvent.click(screen.getByRole("button", { name: "担当者を変更する" }));
  return screen.findByRole("dialog");
};

describe("Modal", () => {
  it("表示: 既定では閉じていて、トリガーを押すと dialog に見出し・本文・閉じるボタンが出る", async () => {
    renderModal();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const modal = await openModal();
    expect(modal).toHaveAttribute("data-slot", "modal-content");
    expect(modal).toHaveTextContent("現在の担当者は五十棲さんです。");
    expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });

  it("表示: showCloseButton={false} では右上の閉じるボタンを出さない", async () => {
    renderModal({ showCloseButton: false });
    await openModal();
    expect(screen.queryByRole("button", { name: "閉じる" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });

  it("操作: ModalClose と Esc で閉じ、フッターのボタンは onClick が呼ばれる", async () => {
    const onSave = vi.fn();
    const { unmount } = renderModal({ onSave });
    await openModal();
    await userEvent.click(screen.getByRole("button", { name: "変更する" }));
    expect(onSave).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    renderModal();
    await openModal();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("disabled: 無効なトリガーは開かず、無効なフッターボタンは押しても呼ばれない", async () => {
    const onSave = vi.fn();
    const { unmount } = renderModal({ onSave, triggerDisabled: true });
    const trigger = screen.getByRole("button", { name: "担当者を変更する" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    renderModal({ onSave, saveDisabled: true });
    await openModal();
    const save = screen.getByRole("button", { name: "変更する" });
    expect(save).toBeDisabled();
    await userEvent.click(save);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: dialog の名前は ModalTitle、説明は aria-describedby で結ばれる", async () => {
    renderModal();
    await openModal();
    const modal = await screen.findByRole("dialog", { name: "担当者を変更する" });
    const describedBy = modal.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      "変更すると新しい担当者に通知が届きます。",
    );
    expect(screen.getByRole("button", { name: "閉じる" })).toHaveAttribute("title", "閉じる");
  });
});
