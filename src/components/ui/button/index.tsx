import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Spinner } from "../spinner";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-action font-bold transition-colors",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-disabled disabled:text-text-disabled",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-surface-primary text-text-on-primary hover:bg-surface-primary-hover active:bg-surface-primary-active",
        secondary:
          "bg-surface-primary-subtle text-text-primary hover:bg-surface-primary-subtle-hover",
        outline: "border border-border-high bg-surface-card text-text-high hover:bg-surface-well",
        ghost: "text-text-high hover:bg-surface-well",
        negative: "bg-surface-negative text-text-on-negative hover:bg-negative-700",
      },
      size: {
        sm: "h-8 px-3 text-1",
        md: "h-10 px-4 text-2",
        lg: "h-12 px-5 text-3",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** 子要素をそのままボタンにする（Link 等） */
    asChild?: boolean;
    /** 処理中。毛糸玉 Spinner を出し、操作を無効にする */
    loading?: boolean;
  };

/**
 * Button
 *
 * 概要: 操作の起点。variant は primary（主アクション）/ secondary / outline / ghost / negative（削除など破壊的操作）、
 * size は sm 32 / md 40 / lg 48px。`loading` で毛糸玉 Spinner を出す（設計書 §9.1 #1）。
 *
 * アンチパターン:
 * - 1 画面に primary を 2 つ以上置く（§10.3。他は secondary / outline / ghost）
 * - 文言を「OK」「はい」にする（「保存する」「削除する」のように動作を書く）
 * - アイコンだけのボタンに使う（IconButton を使い label を付ける）
 * - 削除確認の確定ボタンを primary にする（negative）
 *
 * 推奨例:
 * - 1 画面の主アクション（「保存する」「案件を追加する」）に primary を 1 つ置き、その他は secondary / outline / ghost にする
 * - 送信中は `loading` を付けて二重送信を防ぐ（押せなくなり Spinner が出る）
 * - 削除の確定は `variant="negative"` にし、文言は「削除する」のように動作で書く
 * - フォームのフッターや画面の主アクションは既定の md、Card の中の補助操作は `size="sm"` にする
 *
 * 使用例:
 * ```tsx
 * <Button>保存する</Button>
 * <Button variant="outline" size="sm">キャンセル</Button>
 * <Button variant="negative">削除する</Button>
 * <Button loading>保存中</Button>
 * <Button><Icon icon="add" size={4} />案件を追加する</Button>
 * ```
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  disabled,
  onClick,
  children,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      {...props}
      onClick={(e) => {
        // loading 中は押せない（disabled にするとフォーカスが body に落ちるので aria-disabled で止める）
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {loading ? <Spinner size={size === "lg" ? "md" : "sm"} /> : null}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
}
