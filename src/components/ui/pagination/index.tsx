"use client";

import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export type PaginationProps = Omit<ComponentProps<"nav">, "onChange"> & {
  /** 現在のページ（1 始まり） */
  page: number;
  /** 総件数 */
  total: number;
  /** 1 ページの件数 */
  pageSize: number;
  onPageChange: (page: number) => void;
  /** 「120件中 1〜20件を表示」を出す（既定 true） */
  showSummary?: boolean;
  /** 件数の単位。既定「件」 */
  unit?: string;
};

/** 表示するページ番号（1 … 現在の前後 … 最後）。null は省略記号 */
export function pageItems(page: number, pageCount: number, siblings = 1): (number | null)[] {
  if (pageCount <= 5 + siblings * 2) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = Math.max(2, page - siblings);
  const end = Math.min(pageCount - 1, page + siblings);
  const items: (number | null)[] = [1];
  if (start > 2) items.push(null);
  for (let i = start; i <= end; i++) items.push(i);
  if (end < pageCount - 1) items.push(null);
  items.push(pageCount);
  return items;
}

/**
 * Pagination
 *
 * 概要: 一覧のページ送り（設計書 §9.1 #28、§10.1 A）。件数の要約（「120件中 1〜20件を表示」）と、前後ボタン・ページ番号。
 * 数値は等幅フォント。
 *
 * アンチパターン:
 * - 件数が 1 ページに収まるのに表示する（total <= pageSize なら要約だけにするか出さない）
 * - 「もっと見る」と併用する
 *
 * 推奨例:
 * - 一覧（画面の型 A）の Table の下に置き、`page` / `total` / `pageSize` を検索条件と一緒に持つ
 * - `unit` に業務の単位を渡す（「件」「名」「社」）
 * - 絞り込みや並び順を変えたら `onPageChange(1)` で 1 ページ目に戻す
 * - 1 ページに収まるときも `showSummary` の件数要約は残す（ページ番号は自動で消える）
 *
 * 使用例:
 * ```tsx
 * <Pagination page={page} total={120} pageSize={20} onPageChange={setPage} />
 * ```
 */
export function Pagination({
  className,
  page,
  total,
  pageSize,
  onPageChange,
  showSummary = true,
  unit = "件",
  ...props
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(total, current * pageSize);
  const items = pageItems(current, pageCount);
  const btn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-action px-2 font-mono text-2 text-text-middle outline-none transition-colors hover:bg-surface-well focus-visible:outline-2 focus-visible:outline-border-focus disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent";
  return (
    <nav
      aria-label="ページ送り"
      data-slot="pagination"
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    >
      {showSummary ? (
        <p className="text-2 text-text-low">
          <span className="font-mono tabular-nums">{total.toLocaleString("ja-JP")}</span>
          {unit}中{" "}
          <span className="font-mono tabular-nums">
            {from.toLocaleString("ja-JP")}〜{to.toLocaleString("ja-JP")}
          </span>
          {unit}を表示
        </p>
      ) : null}
      {pageCount > 1 ? (
        <ul className="ml-auto flex items-center gap-0.5">
          <li>
            <button
              type="button"
              className={btn}
              aria-label="前のページ"
              disabled={current <= 1}
              onClick={() => onPageChange(current - 1)}
            >
              <Icon icon="chevron_left" size={5} />
            </button>
          </li>
          {items.map((item, i) =>
            item === null ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: 省略記号は位置で一意
              <li key={`ellipsis-${i}`} aria-hidden="true" className="px-1 text-text-low">
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  className={cn(
                    btn,
                    item === current &&
                      "bg-surface-primary font-bold text-text-on-primary hover:bg-surface-primary-hover",
                  )}
                  aria-label={`${item} ページ目`}
                  aria-current={item === current ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              </li>
            ),
          )}
          <li>
            <button
              type="button"
              className={btn}
              aria-label="次のページ"
              disabled={current >= pageCount}
              onClick={() => onPageChange(current + 1)}
            >
              <Icon icon="chevron_right" size={5} />
            </button>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}
