"use client";

import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

/**
 * Select
 *
 * 概要: 単一選択のドロップダウン（設計書 §9.1 #19）。Radix Select ベースでキーボード操作・タイプアヘッドは自動。
 * 複数選択や検索付きは v1.1 の SearchCombobox。
 *
 * アンチパターン:
 * - 選択肢が 3 つ以下で常に見せたい場合に使う（Radio）
 * - 選択肢が 20 を超える場合に使う（SearchCombobox）
 * - `<label>` を付けない（SelectTrigger に `id` を付け `<label htmlFor>` で結ぶ）
 *
 * 推奨例:
 * - 状態・担当部署のように、候補が 4〜20 個で変わらない単一選択に使う
 * - `SelectTrigger` に `id` を付けて `<label htmlFor>` で結び、未選択は `SelectValue` の `placeholder`（「選択してください」）で示す
 * - 候補が多いときは `SelectGroup` と `SelectLabel` で見出しを付けて分ける
 * - 一覧の絞り込みでは `onValueChange` で再検索し、選んだ値を Tag にも出す
 *
 * 使用例:
 * ```tsx
 * <Select defaultValue="isozumi">
 *   <SelectTrigger id="owner" aria-label="担当者"><SelectValue placeholder="選択してください" /></SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="isozumi">五十棲</SelectItem>
 *     <SelectItem value="yamada">山田</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
export function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

export function SelectGroup(props: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

export function SelectValue(props: ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

const TRIGGER_SIZE = {
  sm: "h-8 px-2.5 text-2",
  md: "h-10 px-3 text-3",
  lg: "h-12 px-4 text-3",
} as const;

export function SelectTrigger({
  className,
  size = "md",
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & { size?: keyof typeof TRIGGER_SIZE }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-2 whitespace-nowrap rounded-action border border-border-high bg-surface-input text-left text-text-high transition-[border-color,box-shadow]",
        "data-[placeholder]:text-text-placeholder *:data-[slot=select-value]:line-clamp-1",
        "outline-none focus-visible:border-border-focus focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-border-focus/30",
        "aria-invalid:border-border-negative aria-invalid:focus-visible:ring-border-negative/30",
        "disabled:cursor-not-allowed disabled:border-border-middle disabled:bg-surface-disabled disabled:text-text-disabled",
        TRIGGER_SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon icon="keyboard_arrow_down" size={5} className="text-object-middle" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 overflow-y-auto overflow-x-hidden rounded-container border border-border-low bg-surface-card text-text-high shadow-float",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=closed]:animate-out",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-object-low">
          <Icon icon="keyboard_arrow_up" size={4} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" && "w-full min-w-(--radix-select-trigger-width)",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-object-low">
          <Icon icon="keyboard_arrow_down" size={4} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-1 text-text-low", className)}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-action py-2 pr-8 pl-2 text-2 outline-hidden focus:outline-2 focus:-outline-offset-2 focus:outline-border-focus",
        "focus:bg-surface-well data-[state=checked]:bg-surface-selected data-[state=checked]:text-text-primary data-[disabled]:pointer-events-none data-[disabled]:text-text-disabled",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon icon="check" size={3} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 pointer-events-none my-1 h-px bg-border-middle", className)}
      {...props}
    />
  );
}
