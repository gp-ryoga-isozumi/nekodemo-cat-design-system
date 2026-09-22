"use client";

import { type ComponentProps, useId, useRef } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";
import { inputVariants } from "../input";

export type InputTimeProps = Omit<
  ComponentProps<"input">,
  "size" | "type" | "value" | "defaultValue" | "onChange" | "step"
> & {
  size?: "sm" | "md" | "lg";
  /** `HH:MM`（24 時間）。未入力は "" */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `HH:MM` */
  min?: string;
  max?: string;
  /** 選べる刻み（分）。既定 15。1 にすると 1 分単位 */
  stepMinutes?: number;
  /** 時刻一覧を開くボタンの読み上げ名 */
  pickerLabel?: string;
};

const ICON_BUTTON = {
  sm: "size-7 right-0.5",
  md: "size-8 right-1",
  lg: "size-10 right-1",
} as const;

/**
 * InputTime
 *
 * 概要: 時刻の入力（v1.2）。ブラウザ標準の `<input type="time">` を Input と同じ見た目にし、右端に猫耳の
 * `schedule` ボタンを置く（押すとブラウザの時刻一覧が開く）。値は `HH:MM` の 24 時間表記で、
 * `stepMinutes`（既定 15）で刻みを決める。日付と組にするときは InputDate と横に並べる。
 * 時刻一覧のボタンはタブ順に入れず、キーボードでは入力欄で時・分を直接打つ。
 *
 * アンチパターン:
 * - 自由書式のテキスト入力にする（「9:00」「9時」「09:00」の揺れを検証するコストが高い）
 * - 分単位が要らないのに `stepMinutes={1}` にする（候補が 1,440 個になる）
 * - `<label>` を付けない（Form の Field で付ける）
 * - 値を変えさせたくないのに `readOnly` にする（`type="time"` はブラウザによって readOnly でも時刻一覧が開く。`disabled` にする）
 *
 * 推奨例:
 * - 開始・終了の時刻は InputTime を 2 つ並べ、`min` / `max` で互いを制限する
 * - 会議や作業の予定は `stepMinutes={15}`、シフトのように粗い刻みは `stepMinutes={30}`
 * - 日時が要るときは InputDate + InputTime を横に並べ、Field のラベルを 1 つにする
 *
 * 使用例:
 * ```tsx
 * <InputTime id="start" defaultValue="09:00" stepMinutes={15} />
 * <InputTime id="end" value={end} onValueChange={setEnd} min={start} size="sm" />
 * ```
 */
export function InputTime({
  className,
  size = "md",
  value,
  defaultValue,
  onValueChange,
  stepMinutes = 15,
  pickerLabel = "時刻の一覧を開く",
  disabled,
  readOnly,
  id,
  ref: outerRef,
  ...props
}: InputTimeProps) {
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
    <div data-slot="input-time" data-size={size} className={cn("relative w-full", className)}>
      <input
        {...props}
        ref={setRefs}
        id={inputId}
        type="time"
        step={stepMinutes * 60}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          inputVariants({ size }),
          "pr-10 font-mono tabular-nums",
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
        <Icon icon="schedule" size={3} />
      </button>
    </div>
  );
}
