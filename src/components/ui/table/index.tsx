"use client";

import type React from "react";
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export type TableDensity = "xs" | "sm" | "md";

/**
 * Table
 *
 * 概要: 静的な表（設計書 §9.1 #34）。行の高さは density xs 40 / sm 56（既定）/ md 80。
 * ヘッダーは縦スクロール時に固定（`containerProps={{ className: "max-h-96 overflow-y-auto" }}` のように外側に高さを与えたとき）、
 * 数値は `TableCell numeric` で等幅フォント右寄せ、縞模様と縦罫線は使わない。
 * ソート・選択・ページングを備えた DataGrid は v1.1。
 *
 * アンチパターン:
 * - レイアウト目的で使う
 * - 縞模様や縦罫線を足す
 * - 数値を左寄せ・可変幅フォントにする
 *
 * 推奨例:
 * - 一覧（画面の型 A）の本体に使い、行数を見せたい画面は `density="xs"`、1 行の情報が多い画面は `density="md"` にする
 * - 金額・数量・日時の列は `TableHead numeric` と `TableCell numeric` を対で付けて右寄せの等幅にそろえる
 * - 並び替えができる列は `sort` と `onSort` を渡し、今の並び順をヘッダーに示す
 * - 行クリックは詳細へ遷移させ、行内の操作は行末のセルに Menu でまとめる
 *
 * 使用例:
 * ```tsx
 * <Table density="sm">
 *   <TableHeader><TableRow><TableHead>案件名</TableHead><TableHead numeric>金額</TableHead></TableRow></TableHeader>
 *   <TableBody><TableRow><TableCell>備品貸出アプリ</TableCell><TableCell numeric>1,200,000</TableCell></TableRow></TableBody>
 * </Table>
 * ```
 */
export function Table({
  className,
  density = "sm",
  containerProps,
  ...props
}: ComponentProps<"table"> & {
  density?: TableDensity;
  /** スクロールする外側の div に渡す props（仮想化のスクロール要素など） */
  containerProps?: ComponentProps<"div">;
}) {
  // 列があふれて横スクロールするときだけ、コンテナをキーボードで到達できる region にする（axe: scrollable-region-focusable）。
  // あふれない表に余分なタブストップを作らない
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const outerRef = containerProps?.ref;
  const tableName = props["aria-label"];
  return (
    <div
      data-slot="table-container"
      {...(scrollable
        ? {
            tabIndex: 0,
            role: "region",
            "aria-label": `${tableName ?? "表"}（横にスクロールできます）`,
          }
        : {})}
      {...containerProps}
      ref={(el) => {
        innerRef.current = el;
        if (typeof outerRef === "function") outerRef(el);
        else if (outerRef) outerRef.current = el;
      }}
      className={cn(
        "relative w-full overflow-x-auto rounded-container border border-border-low bg-surface-card",
        containerProps?.className,
      )}
    >
      <table
        data-slot="table"
        data-density={density}
        className={cn("w-full caption-bottom border-collapse text-2 leading-6", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("sticky top-0 z-10 bg-surface-well", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child_td]:border-0", className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-border-middle border-t bg-surface-well font-bold", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group/row border-border-low border-b border-l-2 border-l-transparent transition-colors hover:bg-surface-well data-[state=selected]:border-l-border-primary data-[state=selected]:bg-surface-selected aria-selected:border-l-border-primary aria-selected:bg-surface-selected",
        className,
      )}
      {...props}
    />
  );
}

export type TableHeadProps = ComponentProps<"th"> & {
  numeric?: boolean;
  /** ソート状態。指定するとヘッダーがボタンになる */
  sort?: "asc" | "desc" | "none";
  /** クリック時。Shift+クリックの複数列ソートのためにイベントを渡す */
  onSort?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** ソートボタンの隣に置く操作（絞り込みボタンなど）。ボタンの入れ子を避けるため children とは別に描く */
  actions?: ReactNode;
  /** セルの最後（th 直下）に置く要素（列幅のドラッグハンドルなど）。ソートボタンの外に出す */
  trailing?: ReactNode;
};

export function TableHead({
  className,
  numeric,
  sort,
  onSort,
  actions,
  trailing,
  children,
  ...props
}: TableHeadProps) {
  const ariaSort =
    sort === "asc"
      ? "ascending"
      : sort === "desc"
        ? "descending"
        : sort === "none"
          ? "none"
          : undefined;
  return (
    <th
      data-slot="table-head"
      scope={props.scope ?? "col"}
      aria-sort={ariaSort}
      className={cn(
        "h-10 whitespace-nowrap border-border-middle border-b px-3 text-left align-middle font-bold text-text-middle",
        numeric && "text-right",
        className,
      )}
      {...props}
    >
      {sort !== undefined ? (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1 rounded-notice outline-none hover:text-text-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            {children}
            <Icon
              icon={
                sort === "desc" ? "arrow_downward" : sort === "asc" ? "arrow_upward" : "swap_vert"
              }
              size={3}
            />
          </button>
          {actions}
        </span>
      ) : actions ? (
        <span className="inline-flex items-center gap-1">
          {children}
          {actions}
        </span>
      ) : (
        children
      )}
      {trailing}
    </th>
  );
}

export function TableCell({
  className,
  numeric,
  ...props
}: ComponentProps<"td"> & { numeric?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 align-middle",
        "[table[data-density=xs]_&]:h-10 [table[data-density=md]_&]:h-20 [table[data-density=sm]_&]:h-14",
        numeric && "text-right font-mono tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-2 text-text-low", className)}
      {...props}
    />
  );
}
