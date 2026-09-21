"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

/**
 * Tooltip
 *
 * 概要: ホバー／フォーカスで出る短い補足（設計書 §9.1 #7）。IconButton の名前や省略した語の説明に使う。
 * TooltipProvider をアプリのルート（NekoThemeProvider の内側）に 1 つ置く。
 *
 * アンチパターン:
 * - 操作に必要な情報を Tooltip にだけ書く（本文かラベルに書く）
 * - タップ端末で前提にする（表示されないことがある）
 *
 * 使用例:
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger asChild><IconButton icon="delete" label="削除" /></TooltipTrigger>
 *     <TooltipContent>削除する</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
export function TooltipProvider({
  delayDuration = 300,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

export function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

export function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-64 rounded-notice bg-surface-inverse px-2 py-1 text-1 text-text-inverse leading-5 shadow-float",
          "fade-in-0 zoom-in-95 animate-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-1px)] rotate-45 fill-surface-inverse" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
