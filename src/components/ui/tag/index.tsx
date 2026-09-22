import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export const tagVariants = cva(
  "inline-flex h-7 max-w-full shrink-0 items-center gap-1 rounded-notice border px-2.5 text-2 leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border-middle bg-surface-card text-text-high",
        selected: "border-border-primary bg-surface-selected text-text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export const statusTagVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-notice px-2 font-bold text-1 leading-none whitespace-nowrap before:size-1.5 before:rounded-round before:bg-current",
  {
    variants: {
      status: {
        info: "bg-surface-info-subtle text-text-info",
        success: "bg-surface-success-subtle text-text-success",
        warning: "bg-surface-warning-subtle text-text-warning",
        negative: "bg-surface-negative-subtle text-text-negative",
        neutral: "bg-surface-well text-text-middle ring-1 ring-border-middle ring-inset",
      },
    },
    defaultVariants: { status: "neutral" },
  },
);

export type TagProps = ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & {
    /** 指定すると × ボタンが付き、押すと呼ばれる */
    onRemove?: () => void;
    /** × ボタンの読み上げ名。既定「外す」 */
    removeLabel?: string;
  };

/**
 * Tag
 *
 * 概要: 絞り込み条件やラベルを示すチップ（設計書 §9.1 #11）。`onRemove` を渡すと × で外せる。
 * 状態（進行中・完了・確認待ち・差し戻し）は StatusTag を使う（色はステータス色だけ。装飾に使わない §10.5）。
 *
 * アンチパターン:
 * - ボタン代わりに使う（クリックで何かをするなら Button）
 * - 件数を入れる（Badge）
 *
 * 推奨例:
 * - 一覧の絞り込み行に、今かかっている条件を `variant="selected"` で並べ、`onRemove` で 1 つずつ外せるようにする
 * - 進行中・完了・差し戻しなどの状態は StatusTag の `status` で表し、意味どおりの色を割り当てる（完了は success、差し戻しは negative）
 * - 「読み取り専用」「下書き」のような状態でないラベルは `variant="default"` の Tag にする
 * - 条件が複数あるときは Tag の並びの末尾に「条件をクリアする」の ghost ボタンを添える
 *
 * 使用例:
 * ```tsx
 * <Tag variant="selected" onRemove={() => clear("status")}>状態: 進行中</Tag>
 * <Tag>読み取り専用</Tag>
 * <StatusTag status="success">完了</StatusTag>
 * ```
 */
export function Tag({
  className,
  variant = "default",
  onRemove,
  removeLabel = "外す",
  children,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      data-variant={variant}
      className={cn(tagVariants({ variant }), onRemove && "pr-1", className)}
      {...props}
    >
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-my-1 inline-flex size-6 shrink-0 items-center justify-center rounded-notice text-object-low outline-none hover:bg-surface-well hover:text-object-high focus-visible:outline-2 focus-visible:outline-border-focus"
        >
          <Icon icon="close" size={3} />
        </button>
      ) : null}
    </span>
  );
}

export type StatusTagProps = ComponentProps<"span"> & VariantProps<typeof statusTagVariants>;

export function StatusTag({ className, status = "neutral", ...props }: StatusTagProps) {
  return (
    <span
      data-slot="status-tag"
      data-status={status}
      className={cn(statusTagVariants({ status }), className)}
      {...props}
    />
  );
}
