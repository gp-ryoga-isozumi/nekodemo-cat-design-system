"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { IconButton } from "../icon-button";

/**
 * Modal
 *
 * 概要: その場で完結する短い入力やコンテンツ用のモーダル（設計書 §9.1 #32、§10.3）。
 * shadcn の **Dialog** に相当する（shadcn の AlertDialog は nekodemo では Dialog）。閉じるボタンと外側クリックで閉じられる（`ModalContent showCloseButton={false}` で右上の × を消せる）。
 * 3 項目を超えるフォームはページにする。確認だけなら Dialog。Radix Dialog ベース（Esc・外側クリックで閉じる）。
 *
 * アンチパターン:
 * - 長いフォームや一覧を入れる（ページか Drawer）
 * - ModalTitle を省略する（読み上げに必要。視覚的に隠すなら className="sr-only"）
 * - モーダルの中からモーダルを開く
 *
 * 推奨例:
 * - 一覧や詳細から離れずに終わる 3 項目までの入力（担当者の変更、期限の延長）に使う
 * - `ModalTitle` にその場でする操作を書き、`ModalFooter` はキャンセル（`ModalClose`）と主ボタンの 2 つだけにする
 * - 保存できたら閉じて、呼び出し元の画面で Toast（success）を出す
 * - 入力が 3 項目を超えたら Modal をやめて作成・編集フォームのページにする
 *
 * 使用例:
 * ```tsx
 * <Modal>
 *   <ModalTrigger asChild><Button variant="outline">担当者を変更する</Button></ModalTrigger>
 *   <ModalContent>
 *     <ModalHeader><ModalTitle>担当者を変更する</ModalTitle></ModalHeader>
 *     <ModalBody>…</ModalBody>
 *     <ModalFooter>
 *       <ModalClose asChild><Button variant="ghost">キャンセル</Button></ModalClose>
 *       <Button onClick={save}>変更する</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 * ```
 */
export function Modal(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="modal" {...props} />;
}

export function ModalTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="modal-trigger" {...props} />;
}

export function ModalClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="modal-close" {...props} />;
}

export function ModalContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="modal-overlay"
        className="data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-surface-overlay data-[state=open]:animate-in data-[state=closed]:animate-out"
      />
      <DialogPrimitive.Content
        data-slot="modal-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal bg-surface-card text-text-high shadow-popout outline-none sm:max-w-lg",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      >
        {/* 見た目は右上（先頭）なので、読み上げ順・タブ順でも本文より先に置く */}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild>
            <IconButton icon="close" label="閉じる" size="sm" className="absolute top-3 right-3" />
          </DialogPrimitive.Close>
        ) : null}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function ModalHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("flex flex-col gap-1 border-border-low border-b px-5 py-4 pr-12", className)}
      {...props}
    />
  );
}

export function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn("flex flex-col gap-4 overflow-y-auto p-5", className)}
      {...props}
    />
  );
}

export function ModalFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex flex-col-reverse gap-2 border-border-low border-t bg-surface-well px-5 py-3 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function ModalTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="modal-title"
      className={cn("text-4 font-bold leading-7", className)}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      className={cn("text-2 text-text-low", className)}
      {...props}
    />
  );
}
