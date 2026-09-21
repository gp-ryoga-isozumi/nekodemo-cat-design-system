"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Button, type ButtonProps } from "../button";

/**
 * Dialog
 *
 * 概要: 確認ダイアログ専用（設計書 §9.1 #31、§10.3）。削除や取り消し不可の操作の前に挟む。
 * Radix AlertDialog ベースで、外側クリックでは閉じず（Esc では閉じる）、原則ボタンで答える。
 * 破壊的操作の確定ボタンは `DialogAction variant="negative"`、文言は「削除する」のように動作を書く（「OK」「はい」は禁止）。
 * フォームや長い内容は Modal を使う。
 *
 * アンチパターン:
 * - 確定ボタンを「OK」「はい」にする
 * - 確定ボタンを primary にする（破壊的操作は negative）
 * - 入力フォームを入れる（Modal）
 *
 * 使用例:
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild><Button variant="negative">削除する</Button></DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>この案件を削除しますか？</DialogTitle>
 *       <DialogDescription>関連する 8 件のタスクも削除されます。この操作は取り消せません。</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <DialogCancel>キャンセル</DialogCancel>
 *       <DialogAction variant="negative" onClick={remove}>削除する</DialogAction>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export function Dialog(props: ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger(props: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogContent({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-surface-overlay data-[state=open]:animate-in data-[state=closed]:animate-out"
      />
      <AlertDialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-modal bg-surface-card p-6 text-text-high shadow-popout outline-none sm:max-w-md",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-5 font-bold leading-7", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-2 text-text-middle leading-6", className)}
      {...props}
    />
  );
}

/** 確定ボタン。破壊的操作は variant="negative" */
export function DialogAction({ variant = "primary", ...props }: ButtonProps) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button data-slot="dialog-action" variant={variant} {...props} />
    </AlertDialogPrimitive.Action>
  );
}

export function DialogCancel({ variant = "ghost", ...props }: ButtonProps) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button data-slot="dialog-cancel" variant={variant} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}
