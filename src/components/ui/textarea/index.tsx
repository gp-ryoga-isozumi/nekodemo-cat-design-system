"use client";

import { type ComponentProps, useId, useState } from "react";
import { cn } from "../../../lib/utils";

export type TextareaProps = ComponentProps<"textarea"> & {
  /** 文字数カウンタを出す上限。maxLength も付く */
  maxLength?: number;
  /** カウンタを出すか（maxLength があるときは既定 true） */
  showCount?: boolean;
};

/**
 * Textarea
 *
 * 概要: 複数行のテキスト入力（設計書 §9.1 #18）。`maxLength` を渡すと右下に文字数カウンタ（12/200）が出る。
 * 見た目は Input と同じ役割トークン。ラベル・補足・エラーは Form の Field で付ける。
 *
 * アンチパターン:
 * - 1 行で足りる入力に使う（Input）
 * - 高さを固定して中身をスクロールさせる（resize-y で伸ばせるようにしておく）
 *
 * 推奨例:
 * - 備考・問い合わせ内容など、改行を含む自由記述に使い、ラベルと補足は Form の Field で付ける
 * - 文字数の上限が決まっているものは `maxLength` を渡し、カウンタで残りを見せる
 * - 初期の高さは `rows` を想定の行数に合わせ、足りないときは利用者が縦に伸ばせるようにしておく
 *
 * 使用例:
 * ```tsx
 * <Textarea id="memo" maxLength={200} placeholder="メモ" />
 * <Textarea rows={6} aria-invalid aria-describedby="memo-error" />
 * ```
 */
export function Textarea({
  className,
  maxLength,
  showCount = maxLength !== undefined,
  onChange,
  defaultValue,
  value,
  id,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? "").length);
  const length = value !== undefined ? String(value).length : innerLength;
  return (
    <div data-slot="textarea-wrap" className="flex flex-col gap-1">
      <textarea
        id={textareaId}
        data-slot="textarea"
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setInnerLength(e.target.value.length);
          onChange?.(e);
        }}
        aria-describedby={
          [describedBy, showCount ? `${textareaId}-count` : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(
          "min-h-24 w-full min-w-0 resize-y rounded-action border border-border-high bg-surface-input px-3 py-2 text-3 text-text-high leading-6 transition-[border-color,box-shadow]",
          "placeholder:text-text-placeholder",
          "outline-none focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/30",
          "aria-invalid:border-border-negative aria-invalid:focus-visible:ring-border-negative/30",
          "disabled:cursor-not-allowed disabled:border-border-middle disabled:bg-surface-disabled disabled:text-text-disabled",
          className,
        )}
        {...props}
      />
      {showCount ? (
        <output
          id={`${textareaId}-count`}
          data-slot="textarea-count"
          htmlFor={textareaId}
          className={cn(
            "self-end font-mono text-1 text-text-low",
            maxLength !== undefined && length >= maxLength && "text-text-negative",
          )}
        >
          {length}
          {maxLength !== undefined ? ` / ${maxLength}` : null}
        </output>
      ) : null}
    </div>
  );
}
