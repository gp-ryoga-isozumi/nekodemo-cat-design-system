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
 * 推奨例:
 * - 公開範囲・支払い方法のように、2〜5 個の選択肢を全部見せて 1 つ選ばせる場面に使う
 * - `RadioGroup` に `aria-label`（見出しがあるなら `aria-labelledby`）を付けて、何を選ぶ設問かを示す
 * - よく使う値がある項目は `defaultValue` を渡し、未選択のまま送信させない
 * - 各 `RadioItem` に `id` を振り、`<label htmlFor>` でラベル文字からも選べるようにする
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
