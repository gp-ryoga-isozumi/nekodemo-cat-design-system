"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

/**
 * Radio
 *
 * 概要: 排他選択（設計書 §9.1 #21）。RadioGroup の中に RadioItem を並べる。選択肢は 2〜5 個、常に見せたいときに使う。
 * ラベルは `<label htmlFor>` で結ぶ。
 *
 * アンチパターン:
 * - 選択肢が 6 個以上（Select）
 * - 単一の ON/OFF（Switch）
 * - RadioGroup に `aria-label` も `aria-labelledby` も付けない
 *
 * 使用例:
 * ```tsx
 * <RadioGroup defaultValue="internal" aria-label="公開範囲" className="flex gap-4">
 *   <div className="flex items-center gap-2">
 *     <RadioItem value="internal" id="scope-internal" />
 *     <label htmlFor="scope-internal" className="text-2">社内のみ</label>
 *   </div>
 * </RadioGroup>
 * ```
 */
export function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

export function RadioItem({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-item"
      className={cn(
        "flex aspect-square size-5 shrink-0 items-center justify-center rounded-round border-[1.5px] border-border-high bg-surface-input transition-colors",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
        "data-[state=checked]:border-surface-primary",
        "aria-invalid:border-border-negative",
        "disabled:cursor-not-allowed disabled:border-border-middle disabled:bg-surface-disabled",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-indicator"
        className="flex items-center justify-center"
      >
        <span aria-hidden="true" className="block size-2.5 rounded-round bg-surface-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
