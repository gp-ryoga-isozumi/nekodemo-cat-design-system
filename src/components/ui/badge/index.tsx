import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

export const badgeVariants = cva(
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-round px-1.5 font-bold font-mono text-1 leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-surface-primary text-text-on-primary",
        negative: "bg-surface-negative text-text-on-negative",
        neutral: "bg-border-middle text-text-middle",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** 数値。max を超えると「99+」のように表示する */
    count?: number;
    max?: number;
  };

/**
 * Badge
 *
 * 概要: 件数を示す小さな丸（設計書 §9.1 #10、D13）。未読数・通知数など数値に使う。
 * 状態を示すラベル（「進行中」「完了」）は Tag の status を使う。
 *
 * アンチパターン:
 * - 文章や長い語を入れる（Tag を使う）
 * - 装飾として色を変える（primary / negative / neutral の 3 種だけ）
 *
 * 推奨例:
 * - 未読・通知など気付いてほしい数は `variant="negative"`、通常の件数は primary か neutral にする
 * - SideNavigation の項目や Tabs の見出しの右に添えて、その画面に何件あるかを示す
 * - 桁が増える数は `max` で上限を決める（`max={99}` で「99+」）
 *
 * 使用例:
 * ```tsx
 * <Badge count={3} variant="negative" />
 * <Badge count={120} max={99} />   // 99+
 * <Badge variant="neutral">120件</Badge>
 * ```
 */
export function Badge({
  className,
  variant = "primary",
  count,
  max = 99,
  children,
  ...props
}: BadgeProps) {
  const content = count !== undefined ? (count > max ? `${max}+` : String(count)) : children;
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {content}
    </span>
  );
}
