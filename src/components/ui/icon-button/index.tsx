import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon, type IconSize } from "../icon";

export const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-action transition-colors",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-text-disabled",
  ],
  {
    variants: {
      variant: {
        ghost: "text-object-middle hover:bg-surface-well hover:text-object-high",
        outline:
          "border border-border-high bg-surface-card text-object-middle hover:bg-surface-well hover:text-object-high",
        primary: "bg-surface-primary text-object-on-primary hover:bg-surface-primary-hover",
        negative: "text-object-negative hover:bg-surface-negative-subtle",
      },
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

const ICON_SIZE: Record<"sm" | "md" | "lg", IconSize> = { sm: 5, md: 6, lg: 7 };

export type IconButtonProps = Omit<ComponentProps<"button">, "children"> &
  VariantProps<typeof iconButtonVariants> & {
    /** Material Symbols の名前 */
    icon: string;
    /** 必須。読み上げ名と title になる */
    label: string;
    fill?: boolean;
  };

/**
 * IconButton
 *
 * 概要: アイコンだけのボタン（設計書 §9.1 #2）。`label` は必須で `aria-label` になる（§10.7）。
 * 行末の操作（編集・削除）、ヘッダーの通知・ヘルプ、閉じるボタンに使う。
 *
 * アンチパターン:
 * - `label` を省略する（型で必須にしている）
 * - 主アクションに使う（文言のある Button を使う）
 *
 * 使用例:
 * ```tsx
 * <IconButton icon="edit" label="編集" />
 * <IconButton icon="delete" label="削除" variant="negative" size="sm" />
 * <IconButton icon="close" label="閉じる" variant="outline" />
 * ```
 */
export function IconButton({
  className,
  variant = "ghost",
  size = "md",
  icon,
  label,
  fill,
  type,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? "button"}
      data-slot="icon-button"
      data-variant={variant}
      data-size={size}
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      <Icon icon={icon} size={ICON_SIZE[size ?? "md"]} fill={fill} />
    </button>
  );
}
