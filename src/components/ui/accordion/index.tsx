"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

/**
 * Accordion
 *
 * 概要: 見出しを押して本文を開閉する一覧（v1.2）。設定画面の詳細項目、FAQ、詳細画面の「もっと見る」に使う。
 * `type="single"`（1 つだけ開く。`collapsible` で全部閉じられる）か `type="multiple"`。
 * 見出しはボタン（`aria-expanded`）、本文は `role="region"` で結び付く（Radix）。矢印は耳なしの `keyboard_arrow_down`。
 *
 * アンチパターン:
 * - 主要な情報を畳む（一覧・詳細の本題は開いた状態で見せる。畳むのは補足）
 * - 画面の切替に使う（Tabs）
 * - 項目が 1 つだけ（見出し付きの Card にする）
 *
 * 推奨例:
 * - 設定画面で「高度な設定」「通知の詳細」のように、普段は触らない項目を畳む
 * - FAQ や仕様の補足は `type="single" collapsible` で 1 つずつ読ませる
 * - 見出しは質問文か名詞（「請求先を変更するには」「対応ブラウザ」）にし、本文は 3〜5 行に収める
 *
 * 使用例:
 * ```tsx
 * <Accordion type="single" collapsible defaultValue="notify">
 *   <AccordionItem value="notify">
 *     <AccordionTrigger>通知の詳細</AccordionTrigger>
 *     <AccordionContent>納期の 3 日前と当日にメールで通知します。</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-border-low border-b last:border-b-0", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-3 text-left font-bold text-3 text-text-high transition-colors",
          "hover:text-text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
          "disabled:cursor-not-allowed disabled:text-text-disabled",
          "[&[data-state=open]>[data-slot=accordion-chevron]]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-chevron"
          className="flex shrink-0 text-object-middle transition-transform duration-200"
        >
          <Icon icon="keyboard_arrow_down" size={4} />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-3 text-text-middle data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      <div className="pb-4 leading-7">{children}</div>
    </AccordionPrimitive.Content>
  );
}
