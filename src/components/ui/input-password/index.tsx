"use client";

import { useState } from "react";
import { cn } from "../../../lib/utils";
import { IconButton } from "../icon-button";
import { Input, type InputProps } from "../input";

export type InputPasswordProps = Omit<InputProps, "type">;

/**
 * InputPassword
 *
 * 概要: パスワード入力（設計書 §9.1 #16）。右端の目のアイコン（耳付き `visibility`）で表示／非表示を切り替える。
 *
 * アンチパターン:
 * - 表示切替を付けない（入力ミスの確認ができない）
 * - `autoComplete` を省略する（`current-password` / `new-password` を付ける）
 *
 * 推奨例:
 * - ログインのパスワードは `autoComplete="current-password"`、新規登録・変更は `new-password` を渡す
 * - 文字数や使える記号の条件は補足（FormDescription）に書き、入力しながら確認できるようにする
 * - Form の中では `FormControl` に包み、ラベルとエラーの出方を Input とそろえる
 *
 * 使用例:
 * ```tsx
 * <InputPassword id="password" autoComplete="current-password" />
 * ```
 */
export function InputPassword({ className, size = "md", disabled, ...props }: InputPasswordProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div data-slot="input-password" className="relative flex items-center">
      <Input
        type={visible ? "text" : "password"}
        size={size}
        disabled={disabled}
        className={cn(size === "sm" ? "pr-9" : "pr-11", className)}
        {...props}
      />
      <IconButton
        icon={visible ? "visibility_off" : "visibility"}
        label={visible ? "パスワードを隠す" : "パスワードを表示"}
        size="sm"
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
        className={cn("absolute", size === "sm" ? "right-0.5" : "right-1")}
      />
    </div>
  );
}
