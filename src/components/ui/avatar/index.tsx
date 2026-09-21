"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

const SIZES = { sm: "size-8 text-1", md: "size-10 text-2", lg: "size-14 text-4" } as const;

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root> & {
  /** 画像 URL。無い／読み込めないときは fallback */
  src?: string;
  /** 読み上げ名（人の名前）。画像の alt にもなる */
  name: string;
  /** 画像が無いときの表示。文字（イニシャル等）を渡すか、省略すると猫の顔のシルエット */
  fallback?: string;
  size?: keyof typeof SIZES;
};

/**
 * Avatar
 *
 * 概要: 人やアカウントを表す丸い画像（設計書 §9.1 #12）。画像が無いときは `fallback` の文字か、
 * 省略時は猫の顔のシルエット（D13）。
 *
 * アンチパターン:
 * - `name` を省略する（読み上げに必要）
 * - 会社や物に使う（人・アカウント用）
 *
 * 使用例:
 * ```tsx
 * <Avatar name="五十棲" src="/me.png" />
 * <Avatar name="五十棲" fallback="五十" size="lg" />
 * <Avatar name="ゲスト" size="sm" />
 * ```
 */
export function Avatar({ className, src, name, fallback, size = "md", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-round bg-surface-primary-subtle font-bold text-text-primary",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={name}
          className="aspect-square size-full object-cover"
        />
      ) : null}
      <AvatarPrimitive.Fallback
        delayMs={src ? 300 : 0}
        className="flex size-full items-center justify-center"
        aria-label={fallback ? undefined : name}
        role={fallback ? undefined : "img"}
      >
        {fallback ?? <Icon icon="cat_face" size={size === "sm" ? 5 : size === "lg" ? 8 : 6} />}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
