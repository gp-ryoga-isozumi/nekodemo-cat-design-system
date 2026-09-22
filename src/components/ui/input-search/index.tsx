"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";
import { Input, type InputProps } from "../input";

export type InputSearchProps = Omit<InputProps, "type" | "onChange" | "value" | "defaultValue"> & {
  value?: string;
  defaultValue?: string;
  /** 入力が変わるたびに呼ばれる（クリア時は ""） */
  onValueChange?: (value: string) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 検索条件（絞り込み）ボタンを出し、押されたときに呼ばれる */
  onOpenConditions?: () => void;
  /** クリアボタンの読み上げ名 */
  clearLabel?: string;
};

/**
 * InputSearch
 *
 * 概要: 検索欄（設計書 §9.1 #17）。Container / Icon（耳付き `search`）/ Value / Clear / Condition の構成。
 * 入力があるとクリア（×）が出る。`onOpenConditions` を渡すと絞り込みボタン（`filter_list`）が付く。
 * サジェスト付きは v1.1 の SearchCombobox。
 *
 * アンチパターン:
 * - 一覧の絞り込みに複数の InputSearch を並べる（1 つにして条件は Tag で見せる）
 * - 検索の実行を Enter だけにして、入力中の検索も無しにする（プロトタイプでは入力のたびに絞り込む方が試しやすい）
 *
 * 推奨例:
 * - 一覧の上に 1 つだけ置き、`placeholder` に何で探せるかを書く（「案件名・顧客名で検索」）
 * - `onValueChange` で入力のたびに絞り込み、クリア（×）で元の一覧に戻せるようにする
 * - 条件が増える画面は `onOpenConditions` で絞り込みを開き、選んだ条件は Tag で見せる
 *
 * 使用例:
 * ```tsx
 * <InputSearch placeholder="案件名・顧客名で検索" value={q} onValueChange={setQ} onOpenConditions={() => setOpen(true)} />
 * ```
 */
export function InputSearch({
  className,
  size = "md",
  value,
  defaultValue = "",
  onValueChange,
  onChange,
  onOpenConditions,
  clearLabel = "クリア",
  disabled,
  ref: outerRef,
  ...props
}: InputSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const update = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const trailing = (current ? 1 : 0) + (onOpenConditions ? 1 : 0);
  return (
    <div data-slot="input-search" className="relative flex items-center">
      <Icon
        icon="search"
        size={size === "lg" ? 6 : 5}
        className={cn(
          "pointer-events-none absolute text-object-low",
          size === "sm" ? "left-2" : "left-3",
        )}
      />
      <Input
        ref={(el) => {
          inputRef.current = el;
          if (typeof outerRef === "function") outerRef(el);
          else if (outerRef) outerRef.current = el;
        }}
        type="search"
        size={size}
        disabled={disabled}
        value={current}
        onChange={(e) => {
          update(e.target.value);
          onChange?.(e);
        }}
        className={cn(
          size === "sm" ? "pl-8" : "pl-10",
          trailing === 1 && (size === "sm" ? "pr-9" : "pr-11"),
          trailing === 2 && (size === "sm" ? "pr-16" : "pr-20"),
          "[&::-webkit-search-cancel-button]:hidden",
          className,
        )}
        {...props}
      />
      <span
        className={cn(
          "absolute flex items-center",
          size === "sm" ? "right-0.5 gap-0" : "right-1 gap-0.5",
        )}
      >
        {current ? (
          <IconButton
            icon="close"
            label={clearLabel}
            size="sm"
            disabled={disabled}
            onClick={() => {
              // クリアボタンは消えるので、フォーカスを入力欄に戻す（body に落とさない）
              update("");
              inputRef.current?.focus();
            }}
          />
        ) : null}
        {onOpenConditions ? (
          <IconButton
            icon="filter_list"
            label="検索条件"
            size="sm"
            disabled={disabled}
            onClick={onOpenConditions}
          />
        ) : null}
      </span>
    </div>
  );
}
