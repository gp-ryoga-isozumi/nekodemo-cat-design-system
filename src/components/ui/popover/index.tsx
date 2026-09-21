"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import { type ComponentProps, createContext, useContext, useEffect, useId, useState } from "react";
import { cn } from "../../../lib/utils";

/**
 * Popover
 *
 * 概要: トリガーの近くに出る小さなパネル（設計書 §9.1 #30）。列の表示切替、日付選択、短い補足フォームなどに使う。
 * Radix Popover ベース（Esc・外側クリックで閉じる）。
 *
 * アンチパターン:
 * - 操作の一覧に使う（Menu）
 * - 長いフォームを入れる（Modal / Drawer）
 * - PopoverTitle を省略する（読み上げに必要。視覚的に隠すなら className="sr-only"）
 *
 * 使用例:
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild><Button variant="outline" size="sm">列の表示</Button></PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverTitle>列の表示</PopoverTitle>
 *     …
 *   </PopoverContent>
 * </Popover>
 * ```
 */
type PopoverLabelContext = { titleId: string; setHasTitle: (v: boolean) => void };
const LabelContext = createContext<PopoverLabelContext | null>(null);

export function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export function PopoverTrigger(props: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverAnchor(props: ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export function PopoverClose(props: ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  const titleId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  return (
    <LabelContext.Provider value={{ titleId, setHasTitle }}>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          aria-labelledby={hasTitle ? titleId : undefined}
          className={cn(
            "z-50 flex w-72 flex-col gap-3 rounded-container border border-border-low bg-surface-card p-4 text-text-high shadow-popout outline-hidden",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    </LabelContext.Provider>
  );
}

/** 見出し。置くと PopoverContent の aria-labelledby に自動で結ばれる */
export function PopoverTitle({ className, id, ...props }: ComponentProps<"h2">) {
  const ctx = useContext(LabelContext);
  useEffect(() => {
    ctx?.setHasTitle(true);
    return () => ctx?.setHasTitle(false);
  }, [ctx]);
  return (
    <h2
      data-slot="popover-title"
      id={id ?? ctx?.titleId}
      className={cn("text-2 font-bold", className)}
      {...props}
    />
  );
}

export function PopoverDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-2 text-text-low", className)}
      {...props}
    />
  );
}
