"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { IconButton } from "../icon-button";

/**
 * Drawer
 *
 * 概要: 画面端から出るサイドパネル（設計書 §9.1 #33）。一覧を見ながら詳細を確認・編集する用途。
 * 右（既定）／左／下から出せる。Radix Dialog ベース。
 *
 * アンチパターン:
 * - 確認だけに使う（Dialog）
 * - DrawerTitle を省略する
 * - 幅を画面いっぱいにする（一覧が見えなくなる。最大 480px）
 *
 * 推奨例:
 * - 一覧を見たまま 1 件の詳細を確認・編集する場面で、行を選んで右から開く
 * - 見出しは `DrawerTitle` に項目名、本文は `DrawerBody`、操作は `DrawerFooter` にまとめる
 * - 画面の下から出す補助的な操作パネルには `side="bottom"` を使う
 *
 * 使用例:
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild><Button variant="outline">詳細を見る</Button></DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader><DrawerTitle>社内備品貸出アプリ 改修</DrawerTitle></DrawerHeader>
 *     <DrawerBody>…</DrawerBody>
 *     <DrawerFooter><Button variant="outline" size="sm">編集する</Button></DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function Drawer(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

export function DrawerTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

const SIDE = {
  right:
    "inset-y-0 right-0 h-full w-3/4 max-w-[480px] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-[480px] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  bottom:
    "inset-x-0 bottom-0 max-h-[80vh] rounded-t-modal border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
} as const;

export function DrawerContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  side?: keyof typeof SIDE;
  showCloseButton?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="drawer-overlay"
        className="data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-surface-overlay data-[state=open]:animate-in data-[state=closed]:animate-out"
      />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col border-border-low bg-surface-card text-text-high shadow-popout outline-none transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
          SIDE[side],
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

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1 border-border-low border-b px-5 py-4 pr-12", className)}
      {...props}
    />
  );
}

export function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("flex flex-1 flex-col gap-4 overflow-y-auto p-5", className)}
      {...props}
    />
  );
}

export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex justify-end gap-2 border-border-low border-t bg-surface-well px-5 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-4 font-bold leading-7", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-2 text-text-low", className)}
      {...props}
    />
  );
}
