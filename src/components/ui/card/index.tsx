import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

/**
 * Card
 *
 * 概要: 情報のまとまりを囲む面（設計書 §9.1 #14）。`rounded-container` と `shadow-raise`。
 * Card / CardHeader / CardTitle / CardDescription / CardAction / CardContent / CardFooter を組み合わせる。
 *
 * アンチパターン:
 * - 全部をカードにする（面の重なりは 1 段まで。ページ内の区切りは余白と見出しで）
 * - カードの中にカードを入れる
 *
 * 推奨例:
 * - 詳細画面を「基本情報」「関連する案件」のようなまとまりに分け、1 まとまり 1 枚にする
 * - 見出しは `CardTitle`、まとまりの操作は `CardAction`（右上）か `CardFooter`（下）に置く
 * - 作成・編集フォームはセクションごとに Card で囲み、カード同士は余白で離す
 *
 * 使用例:
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>基本情報</CardTitle>
 *     <CardAction><IconButton icon="more_vert" label="操作" /></CardAction>
 *   </CardHeader>
 *   <CardContent>…</CardContent>
 *   <CardFooter><Button variant="outline" size="sm">編集する</Button></CardFooter>
 * </Card>
 * ```
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-container border border-border-low bg-surface-card text-text-high shadow-raise",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 border-border-low border-b px-4 py-3 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 data-slot="card-title" className={cn("text-3 font-bold leading-6", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p data-slot="card-description" className={cn("text-2 text-text-low", className)} {...props} />
  );
}

export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("flex flex-col gap-3 p-4", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-end gap-2 border-border-low border-t px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
