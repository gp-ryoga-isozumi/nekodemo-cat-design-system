"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/**
 * Checkbox
 *
 * 概要: 複数選択のチェックボックス（設計書 §9.1 #20）。チェックマークは猫の顔のシルエット（`cat_face`、D13）、
 * 一部選択（`checked="indeterminate"`）は横棒。Radix ベースなのでキーボード操作と `aria-checked` は自動。
 * ラベルは `<label htmlFor>` か Form の Field で付ける。
 *
 * アンチパターン:
 * - ラベル無しで置く（`aria-label` か `<label>` を必ず付ける）
 * - 単一の ON/OFF 設定に使う（即時反映する設定は Switch）
 *
 * 推奨例:
 * - 「複数から選ぶ」設問や一覧の一括選択に使い、`<label htmlFor>` か Form の Field でラベルを付ける
 * - 全選択のチェックは、一部だけ選ばれている間 `checked="indeterminate"` にする
 * - 同意の確認は 1 個だけ置き、ラベルに同意する内容をそのまま書く
 *
 * 使用例:
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <Checkbox id="notify" defaultChecked />
 *   <label htmlFor="notify" className="text-2">通知を受け取る</label>
 * </div>
 * <Checkbox checked="indeterminate" aria-label="すべて選択" />
 * ```
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer flex size-[22px] shrink-0 items-center justify-center rounded-notice border-[1.5px] border-border-high bg-surface-input text-object-on-primary transition-colors",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
        "data-[state=checked]:border-surface-primary data-[state=checked]:bg-surface-primary",
        "data-[state=indeterminate]:border-surface-primary data-[state=indeterminate]:bg-surface-primary",
        "aria-invalid:border-border-negative",
        "disabled:cursor-not-allowed disabled:border-border-middle disabled:bg-surface-disabled disabled:text-text-disabled",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
      >
        {/* 非制御で indeterminate になった場合にも合うよう、props ではなく data-state で切り替える */}
        <span
          aria-hidden="true"
          className="hidden h-0.5 w-2.5 rounded-round bg-current group-data-[state=indeterminate]/checkbox:block"
        />
        <Icon
          icon="cat_face"
          size={4}
          className="group-data-[state=indeterminate]/checkbox:hidden"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
