"use client";

import { type ComponentProps, useId, useRef } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";
import { inputVariants } from "../input";

export type InputDateProps = Omit<
  ComponentProps<"input">,
  "size" | "type" | "value" | "defaultValue" | "onChange"
> & {
  size?: "sm" | "md" | "lg";
  /** `YYYY-MM-DD`。未入力は "" */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `YYYY-MM-DD` */
  min?: string;
  max?: string;
  /** カレンダーを開くボタンの読み上げ名 */
  pickerLabel?: string;
};

const ICON_BUTTON = {
  sm: "size-7 right-0.5",
  md: "size-8 right-1",
  lg: "size-10 right-1",
} as const;

/**
 * InputDate
 *
 * 概要: 日付の入力（v1.2）。ブラウザ標準の `<input type="date">` を Input と同じ見た目にし、右端に猫耳の
 * `calendar_today` ボタンを置く（押すとブラウザのカレンダーが開く）。値は `YYYY-MM-DD` の文字列で、
 * 表示形式はブラウザの言語設定に従う（日本語環境では 2026/09/22）。カレンダーボタンはタブ順に入れず（`tabIndex=-1`）、
 * キーボードでは入力欄で年月日を直接打つ。
 * 期間の入力は InputDate を 2 つ並べ、`min` / `max` で互いを制限する。
 *
 * アンチパターン:
 * - 自由書式のテキスト入力にする（区切りや桁の揺れを検証するコストが高い）
 * - 生年月日のように遠い年を選ばせるのにカレンダーだけを提供する（キーボード入力を塞がない）
 * - `<label>` を付けない（Form の Field で付ける）
 *
 * 推奨例:
 * - 納期・開始日・終了日のように「日付を 1 つ選ぶ」入力に使う
 * - 期間は InputDate を 2 つ並べ、開始の `max` に終了、終了の `min` に開始を渡す
 * - 既定値には `YYYY-MM-DD` の文字列を渡し、表示形式はブラウザに任せる
 *
 * 使用例:
 * ```tsx
 * <InputDate id="due" defaultValue="2026-10-31" min="2026-01-01" />
 * <InputDate id="from" value={from} onValueChange={setFrom} max={to} size="sm" />
 * ```
 */
export function InputDate({
  className,
  size = "md",
  value,
  defaultValue,
  onValueChange,
  pickerLabel = "カレンダーを開く",
  disabled,
  readOnly,
  id,
  ref: outerRef,
  ...props
}: InputDateProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const ref = useRef<HTMLInputElement | null>(null);
  const setRefs = (el: HTMLInputElement | null) => {
    ref.current = el;
    if (typeof outerRef === "function") outerRef(el);
    else if (outerRef) outerRef.current = el;
  };
  const openPicker = () => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {
        // 非対応やユーザー操作以外の呼び出しでは例外になるので、フォーカスに落とす
      }
    }
    el.focus();
  };
  return (
    <div data-slot="input-date" data-size={size} className={cn("relative w-full", className)}>
      <input
        {...props}
        ref={setRefs}
        id={inputId}
        type="date"
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          inputVariants({ size }),
          "pr-10 font-mono tabular-nums",
          // ブラウザ標準のカレンダーアイコンは隠し、右端のボタンで開く
          "[&::-webkit-calendar-picker-indicator]:hidden",
        )}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        aria-label={pickerLabel}
        aria-controls={inputId}
        disabled={disabled || readOnly}
        onClick={openPicker}
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-action text-object-middle transition-colors",
          "hover:bg-surface-well hover:text-object-high disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent",
          ICON_BUTTON[size],
        )}
      >
        <Icon icon="calendar_today" size={3} />
      </button>
    </div>
  );
}
