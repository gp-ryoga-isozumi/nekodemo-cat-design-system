"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { type ComponentProps, useMemo } from "react";
import { cn } from "../../../lib/utils";

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  /** つまみの読み上げ名（必須。つまみが 1 つなら文字列、複数なら配列） */
  label: string | string[];
};

/**
 * Slider
 *
 * 概要: 範囲内の数値を選ぶ（設計書 §9.1 #23）。値の表示は呼び出し側で `<output>` 等に出す。
 * `label` は各つまみの `aria-label` になる。
 *
 * アンチパターン:
 * - 正確な数値入力に使う（InputNumber）
 * - 値を表示しない
 *
 * 推奨例:
 * - 通知する日数・表示件数のように、だいたいの値を素早く決める設定に使う
 * - `label` に何を決めるつまみかを書き、現在の値は `<output>` で数値としても見せる
 * - `min` / `max` を業務の上下限に合わせ、`step` を業務の刻みにする
 * - 範囲で絞り込むときは値を 2 つの配列で渡し、`label` もつまみごとの配列にする
 *
 * 使用例:
 * ```tsx
 * <Slider label="通知する日数" min={1} max={30} defaultValue={[7]} onValueChange={([v]) => setDays(v)} />
 * ```
 */
export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  ...props
}: SliderProps) {
  const values = useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );
  const labels = Array.isArray(label) ? label : [label];
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:cursor-not-allowed data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-round bg-border-middle data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-surface-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {values.map((_, i) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          // biome-ignore lint/suspicious/noArrayIndexKey: つまみの数は固定で並び替えが無い
          key={i}
          aria-label={labels[i] ?? labels[0]}
          className="block size-5 shrink-0 rounded-round border-2 border-surface-primary bg-surface-input shadow-raise transition-shadow hover:ring-4 hover:ring-border-focus/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus data-[disabled]:border-border-high"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
