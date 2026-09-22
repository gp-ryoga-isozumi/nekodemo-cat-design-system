import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export const inlineMessageVariants = cva(
  "flex items-start gap-2.5 rounded-container border px-3.5 py-3 text-2 leading-6 [&_svg]:mt-[2px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "border-info-100 bg-surface-info-subtle text-text-info",
        success: "border-success-100 bg-surface-success-subtle text-text-success",
        warning: "border-warning-100 bg-surface-warning-subtle text-text-warning",
        negative: "border-negative-100 bg-surface-negative-subtle text-text-negative",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

const ICON: Record<NonNullable<InlineMessageProps["variant"]>, string> = {
  info: "info",
  success: "check_circle",
  warning: "warning",
  negative: "error",
};

export type InlineMessageProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof inlineMessageVariants> & {
    /** 太字の見出し（任意） */
    title?: ReactNode;
    /** 右端の操作（「再試行」ボタン等） */
    action?: ReactNode;
  };

/**
 * InlineMessage
 *
 * 概要: 画面内に埋め込むメッセージ（設計書 §9.1 #9）。info / success / warning / negative。
 * 一覧やフォームのエラーは全画面にせず、この部品を該当箇所に置いて「再試行」を付ける（§10.2）。
 * negative は `role="alert"`、それ以外は `role="status"`。
 *
 * アンチパターン:
 * - 一時的な成功通知に使う（Toast）
 * - 装飾やお知らせバナーに success / warning の色を使う（ステータス色は状態表現だけ。§10.5）
 *
 * 推奨例:
 * - 読み込みや保存に失敗した領域のすぐ上に `variant="negative"` で置き、`action` に「再試行する」を添える
 * - あらかじめ知らせておく制約や予定は `variant="info"` にし、`title` に要点、本文に詳細を書く
 * - 本文には「何が起きたか」と「どうすればよいか」の両方を書く
 *
 * 使用例:
 * ```tsx
 * <InlineMessage variant="negative" action={<Button variant="outline" size="sm" onClick={retry}>再試行</Button>}>
 *   一覧を読み込めませんでした。通信状態を確認して再試行してください。
 * </InlineMessage>
 * <InlineMessage variant="info" title="自動完了">この案件は 2026/09/30 に自動で完了になります。</InlineMessage>
 * ```
 */
export function InlineMessage({
  className,
  variant = "info",
  title,
  action,
  children,
  ...props
}: InlineMessageProps) {
  const v = variant ?? "info";
  return (
    <div
      data-slot="inline-message"
      data-variant={v}
      role={v === "negative" ? "alert" : "status"}
      className={cn(inlineMessageVariants({ variant: v }), className)}
      {...props}
    >
      <Icon icon={ICON[v]} size={5} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title ? <p className="font-bold">{title}</p> : null}
        <div>{children}</div>
      </div>
      {action ? <div className="ml-auto shrink-0 self-center">{action}</div> : null}
    </div>
  );
}
