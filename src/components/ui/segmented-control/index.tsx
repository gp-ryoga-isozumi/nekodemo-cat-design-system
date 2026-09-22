"use client";

import { cva } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { type ComponentProps, type KeyboardEvent, useRef, useState } from "react";
import { cn } from "../../../lib/utils";

const rootVariants = cva(
  "inline-flex max-w-full items-stretch gap-0.5 overflow-x-auto rounded-action border border-border-middle bg-surface-well p-0.5",
  {
    variants: {
      size: { sm: "h-8", md: "h-10", lg: "h-12" },
    },
    defaultVariants: { size: "md" },
  },
);

const itemVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-action text-text-middle transition-colors",
    "hover:text-text-high",
    "data-[state=on]:bg-surface-card data-[state=on]:font-bold data-[state=on]:text-text-high data-[state=on]:shadow-raise",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus",
    "disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:text-text-disabled",
  ],
  {
    variants: {
      size: {
        sm: "px-2.5 text-2",
        md: "px-3 text-2",
        lg: "px-4 text-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type SegmentedControlProps = Omit<
  ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  size?: "sm" | "md" | "lg";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 読み上げ名（必須。見出しが別にあるときは `aria-labelledby` でもよい） */
  "aria-label"?: string;
};

export type SegmentedControlItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item>;

/**
 * SegmentedControl
 *
 * 概要: 常に見えている 2〜5 択の切替（v1.2）。表示の切替（一覧 / カード、日 / 週 / 月）や絞り込みの
 * 大分類に使う。必ずどれか 1 つが選ばれた状態を保つ（選択中の項目を押しても外れない）。
 * 高さは sm 32 / md 40 / lg 48px。項目にはアイコンだけでなく文言を入れる。
 * `role="radiogroup"` / `role="radio"` で、←→ で選択が移る（radio group の作法）。
 *
 * アンチパターン:
 * - 画面遷移に使う（Tabs か SideNavigation）
 * - 6 択以上、または項目名が長い（Select）
 * - 「未選択」を許す（Radio か Checkbox）
 *
 * 推奨例:
 * - 「一覧 / カード」「日 / 週 / 月」のように、同じデータの見せ方を切り替える場面に使う
 * - 項目は 2〜5 個、短い名詞にし、必要ならアイコンを添える（アイコンだけにしない）
 * - `aria-label` に何の切替かを書く（「表示」「期間」）
 *
 * 使用例:
 * ```tsx
 * <SegmentedControl aria-label="表示" defaultValue="list" onValueChange={setView}>
 *   <SegmentedControlItem value="list"><Icon icon="view_list" />一覧</SegmentedControlItem>
 *   <SegmentedControlItem value="grid"><Icon icon="grid_view" />カード</SegmentedControlItem>
 * </SegmentedControl>
 * ```
 */
export function SegmentedControl({
  className,
  size = "md",
  value,
  defaultValue,
  onValueChange,
  onKeyDown,
  children,
  ...props
}: SegmentedControlProps) {
  // Radix の single は選択中の項目を押すと空にするので、こちらで値を持って常に制御にする（非制御でも外れない）
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const rootRef = useRef<HTMLDivElement>(null);
  const select = (v: string) => {
    if (!v || v === current) return;
    setInner(v);
    onValueChange?.(v);
  };
  // radio group の作法に合わせ、←→（↑↓）で選択も移す（Radix はフォーカスだけ動かす）
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir || !rootRef.current) return;
    const items = [
      ...rootRef.current.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
    ];
    const idx = items.findIndex((el) => el.dataset.state === "on");
    const next = items[(idx + dir + items.length) % items.length];
    if (next?.value) select(next.value);
  };
  return (
    <ToggleGroupPrimitive.Root
      ref={rootRef}
      type="single"
      data-slot="segmented-control"
      data-size={size}
      value={current}
      onValueChange={select}
      onKeyDown={handleKeyDown}
      className={cn(rootVariants({ size }), className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
}

export function SegmentedControlItem({ className, ...props }: SegmentedControlItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-control-item"
      className={cn(
        itemVariants(),
        "[[data-size=lg]_&]:px-4 [[data-size=lg]_&]:text-3 [[data-size=sm]_&]:px-2.5",
        className,
      )}
      {...props}
    />
  );
}
