"use client";

import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

const chipVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-round border font-normal transition-colors",
    "border-border-middle bg-surface-card text-text-middle hover:border-border-high hover:text-text-high",
    "aria-pressed:border-border-primary aria-pressed:bg-surface-primary-subtle aria-pressed:font-bold aria-pressed:text-text-primary",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    "disabled:cursor-not-allowed disabled:border-border-low disabled:bg-surface-disabled disabled:text-text-disabled",
  ],
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-1",
        md: "h-8 px-3 text-2",
        lg: "h-10 px-4 text-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type FilterChipProps = Omit<ComponentProps<"button">, "type"> & {
  /** 選択中（`aria-pressed`） */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** 件数（「進行中 12」のように右に薄く出す） */
  count?: number;
  /** 左のアイコン（Material Symbols 名） */
  icon?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * FilterChip
 *
 * 概要: 一覧を絞り込む「押して ON / OFF する」チップ（v1.2）。検索欄の下に横並びで置き、複数を同時に選べる。
 * 選択中は primary の淡い面とチェックが付き、`aria-pressed` で状態を伝える。`count` で該当件数を添えられる。
 * 選んだ条件を表す（外せる）ラベルは Tag、単一選択の切替は SegmentedControl、6 個以上の候補は Select か SearchCombobox。
 *
 * アンチパターン:
 * - 選択肢が 1 つだけ（Switch か Checkbox）
 * - 同じ画面で単一選択と複数選択の FilterChip を混ぜる
 * - 押しても一覧が変わらない（絞り込み以外の用途に使わない）
 *
 * 推奨例:
 * - 一覧の上に `FilterChipGroup aria-label="状態で絞り込む"` で並べ、押した瞬間に一覧を絞り込む
 * - よく使う条件（「自分の担当」「今週が納期」）を先頭に置く
 * - 絞り込み中は「絞り込みを解除する」の ghost Button を右端に置く
 *
 * 使用例:
 * ```tsx
 * <FilterChipGroup aria-label="状態で絞り込む">
 *   <FilterChip selected={mine} onSelectedChange={setMine} icon="person">自分の担当</FilterChip>
 *   <FilterChip selected={f.has("進行中")} onSelectedChange={(v) => toggle("進行中", v)} count={12}>進行中</FilterChip>
 * </FilterChipGroup>
 * ```
 */
export function FilterChip({
  className,
  selected = false,
  onSelectedChange,
  count,
  icon,
  size = "md",
  children,
  onClick,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      data-slot="filter-chip"
      data-size={size}
      aria-pressed={selected}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onSelectedChange?.(!selected);
      }}
      className={cn(chipVariants({ size }), className)}
      {...props}
    >
      {selected ? (
        <Icon icon="check" size={size === "sm" ? 1 : 2} />
      ) : icon ? (
        <Icon icon={icon} size={size === "sm" ? 1 : 2} />
      ) : null}
      {children}
      {count !== undefined ? (
        <>
          <span aria-hidden="true" className="font-mono font-normal text-text-low tabular-nums">
            {count.toLocaleString("ja-JP")}
          </span>
          {/* 読み上げ名を「進行中 12 件」にする（見た目の数字だけだと「進行中12」と続けて読まれる） */}
          <span className="sr-only"> {count.toLocaleString("ja-JP")} 件</span>
        </>
      ) : null}
    </button>
  );
}

export type FilterChipGroupProps = Omit<ComponentProps<"fieldset">, "aria-label"> & {
  /** 読み上げ名（必須。「状態で絞り込む」）。`<legend>` として視覚的には隠す */
  "aria-label": string;
};

/** FilterChip を横並びにする枠（`<fieldset>` ＋ 隠した `<legend>`、折り返しあり） */
export function FilterChipGroup({
  className,
  "aria-label": label,
  children,
  ...props
}: FilterChipGroupProps) {
  return (
    <fieldset
      data-slot="filter-chip-group"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <legend className="sr-only">{label}</legend>
      {children}
    </fieldset>
  );
}
