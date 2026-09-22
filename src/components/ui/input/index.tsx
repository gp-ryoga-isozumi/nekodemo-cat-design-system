import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

export const inputVariants = cva(
  [
    "w-full min-w-0 rounded-action border border-border-high bg-surface-input text-text-high transition-[border-color,box-shadow]",
    "placeholder:text-text-placeholder",
    "outline-none focus-visible:border-border-focus focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-border-focus/30",
    "aria-invalid:border-border-negative aria-invalid:focus-visible:ring-border-negative/30",
    "disabled:cursor-not-allowed disabled:border-border-middle disabled:bg-surface-disabled disabled:text-text-disabled",
    "file:mr-2 file:border-0 file:bg-transparent file:font-bold file:text-text-middle",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-2",
        md: "h-10 px-3 text-3",
        lg: "h-12 px-4 text-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type InputProps = Omit<ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>;

/**
 * Input
 *
 * 概要: 1 行のテキスト入力（設計書 §9.1 #15）。高さは sm 32 / md 40 / lg 48px。
 * ラベル・補足・エラーは Form の Field で付ける。エラー時は `aria-invalid` を付けると枠が negative になる。
 *
 * アンチパターン:
 * - `placeholder` に必須情報を書く（ラベルと補足に書く。§10.4）
 * - `<label>` を付けない（§10.7）
 * - 検索欄に使う（InputSearch）、パスワードに使う（InputPassword）
 *
 * 推奨例:
 * - Form の `FormControl` の中に置き、ラベル・補足・エラーは Form 側に任せる
 * - `placeholder` には入力例だけを書く（「例: 山田商事」）
 * - 通常は既定の md、ツールバーや表の中に収めるときは `size="sm"` にする
 *
 * 使用例:
 * ```tsx
 * <Input id="name" placeholder="例: 山田商事" />
 * <Input size="sm" aria-invalid aria-describedby="name-error" />
 * ```
 */
export function Input({ className, size = "md", type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  );
}
