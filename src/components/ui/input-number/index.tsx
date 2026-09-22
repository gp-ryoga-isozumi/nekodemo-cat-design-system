"use client";

import { type ComponentProps, type KeyboardEvent, useId, useState } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";
import { inputVariants } from "../input";

export type InputNumberProps = Omit<
  ComponentProps<"input">,
  "size" | "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> & {
  size?: "sm" | "md" | "lg";
  /** 制御値。未入力は null */
  value?: number | null;
  defaultValue?: number | null;
  /** 値が変わるたびに呼ばれる（未入力・不正な文字列は null） */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** ボタンと ↑↓ キーで増減する幅。既定 1 */
  step?: number;
  /** 単位（「円」「件」など）。入力欄の右に薄く出す */
  unit?: string;
  /** 3 桁区切りで表示する（編集中は区切りなし）。既定 true */
  format?: boolean;
  /** 増減ボタンを出さない */
  hideSteppers?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
};

const BUTTON_SIZE = { sm: "size-7", md: "size-8", lg: "size-10" } as const;

function clamp(v: number, min?: number, max?: number): number {
  let out = v;
  if (min !== undefined) out = Math.max(min, out);
  if (max !== undefined) out = Math.min(max, out);
  return out;
}

function parse(text: string): number | null {
  const normalized = text
    .replace(/[，,]/g, "")
    .replace(/[０-９．－]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  if (normalized.trim() === "" || normalized === "-") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function decimals(step: number): number {
  const s = String(step);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

/**
 * InputNumber
 *
 * 概要: 数値の入力（v1.2）。テキスト入力（`inputMode="decimal"`）に増減ボタンと単位を付けたもの。
 * `min` / `max` の範囲に収め、↑↓ キーでも `step` ずつ増減する（増減ボタンはタブ順に入れない）。全角数字とカンマは受け付けて半角に直す。
 * 範囲への丸め（clamp）は blur と増減のときに行い、入力中の `onValueChange` には打った値をそのまま渡す。
 * 見た目は Input と同じ（sm 32 / md 40 / lg 48px）。表示中は 3 桁区切り、編集中は区切りなし。
 *
 * アンチパターン:
 * - 電話番号・郵便番号・ID のように「数字だが数値ではない」ものに使う（Input に `inputMode="numeric"`）
 * - 単位を placeholder に書く（`unit` に書く）
 * - `<label>` を付けない（Form の Field で付ける）
 *
 * 推奨例:
 * - 金額・数量・件数など「計算する数」に使い、`unit` に単位を書く（「円」「件」）
 * - `step` を業務の刻みに合わせる（金額は 1,000 や 10,000、数量は 1）
 * - `min` / `max` で範囲を決め、範囲外は blur で丸める（エラーにしない）
 *
 * 使用例:
 * ```tsx
 * <InputNumber id="amount" unit="円" min={0} step={1000} defaultValue={1200000} />
 * <InputNumber id="qty" size="sm" min={1} max={99} value={qty} onValueChange={setQty} />
 * ```
 */
export function InputNumber({
  className,
  size = "md",
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  unit,
  format = true,
  hideSteppers = false,
  decrementLabel = "減らす",
  incrementLabel = "増やす",
  disabled,
  readOnly,
  id,
  onBlur,
  onFocus,
  onKeyDown: onKeyDownProp,
  ...props
}: InputNumberProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const controlled = value !== undefined;
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = controlled ? value : inner;
  const [text, setText] = useState<string>(current === null ? "" : String(current));
  const [editing, setEditing] = useState(false);

  const commit = (next: number | null) => {
    const clamped = next === null ? null : clamp(next, min, max);
    if (!controlled) setInner(clamped);
    setText(clamped === null ? "" : String(clamped));
    onValueChange?.(clamped);
  };

  const stepBy = (dir: 1 | -1) => {
    const base = current ?? (dir > 0 ? (min ?? 0) - step : (max ?? 0) + step);
    const next = Number((base + dir * step).toFixed(decimals(step)));
    commit(next);
  };

  const shown = editing
    ? text
    : current === null
      ? ""
      : format
        ? current.toLocaleString("ja-JP", { maximumFractionDigits: 20 })
        : String(current);
  const atMin = min !== undefined && current !== null && current <= min;
  const atMax = max !== undefined && current !== null && current >= max;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDownProp?.(e);
    // readOnly / disabled のときは増減ボタンと同じく ↑↓ でも変えない
    if (e.defaultPrevented || disabled || readOnly) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!atMax) stepBy(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!atMin) stepBy(-1);
    }
  };

  const stepButton = (dir: 1 | -1) => (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      aria-label={dir > 0 ? incrementLabel : decrementLabel}
      aria-controls={inputId}
      disabled={disabled || readOnly || (dir > 0 ? atMax : atMin)}
      onClick={() => stepBy(dir)}
      className={cn(
        "flex shrink-0 items-center justify-center self-center rounded-action text-object-middle transition-colors",
        "hover:bg-surface-well hover:text-object-high disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent",
        BUTTON_SIZE[size],
      )}
    >
      <Icon icon={dir > 0 ? "add" : "remove"} size={3} />
    </button>
  );

  return (
    <div
      data-slot="input-number"
      data-size={size}
      data-disabled={disabled ? "true" : undefined}
      className={cn(
        inputVariants({ size }),
        "flex items-stretch gap-1 px-1 focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus/30",
        "has-[input[aria-invalid=true]]:border-border-negative has-[input[aria-invalid=true]]:focus-within:ring-border-negative/30",
        disabled && "cursor-not-allowed border-border-middle bg-surface-disabled",
        className,
      )}
    >
      {hideSteppers ? null : stepButton(-1)}
      <input
        {...props}
        id={inputId}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={current ?? undefined}
        aria-valuetext={
          current === null
            ? undefined
            : `${current.toLocaleString("ja-JP", { maximumFractionDigits: 20 })}${unit ? ` ${unit}` : ""}`
        }
        aria-valuemin={min}
        aria-valuemax={max}
        value={shown}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => {
          setText(e.target.value);
          const parsed = parse(e.target.value);
          if (!controlled) setInner(parsed);
          onValueChange?.(parsed);
        }}
        onFocus={(e) => {
          setEditing(true);
          setText(current === null ? "" : String(current));
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setEditing(false);
          commit(parse(text));
          onBlur?.(e);
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "min-w-0 flex-1 bg-transparent px-1 text-right font-mono tabular-nums outline-none",
          "placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled",
          hideSteppers && "text-left",
        )}
      />
      {unit ? (
        <span className="self-center whitespace-nowrap pr-1 text-2 text-text-low">{unit}</span>
      ) : null}
      {hideSteppers ? null : stepButton(1)}
    </div>
  );
}
