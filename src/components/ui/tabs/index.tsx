"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

/**
 * Tabs
 *
 * 概要: 同じ階層の内容を切り替える（設計書 §9.1 #25）。横（既定）と縦（`orientation="vertical"`、設定画面の左ナビ用 §10.1 D）。
 * Radix ベースでキーボード操作（←→ / ↑↓）は自動。
 *
 * アンチパターン:
 * - 画面遷移の代わりに使う（URL が変わる移動は SideNavigation / Link）
 * - タブが 6 個を超える（分割か Select を検討）
 *
 * 推奨例:
 * - 詳細画面（画面の型 B）で情報が多いときに、同じ対象の面（概要・タスク・履歴）を 2〜6 個に分ける
 * - 設定画面（画面の型 D）の左ナビは `orientation="vertical"` にする
 * - `TabsList` に `aria-label` を付けて何の切替かを示し、タブ名は名詞にする
 * - 件数を見せたいタブは `TabsTrigger` の中に Badge を置く
 *
 * 使用例:
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabsList aria-label="案件の情報">
 *     <TabsTrigger value="overview">概要</TabsTrigger>
 *     <TabsTrigger value="tasks">タスク <Badge variant="neutral" count={8} /></TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">…</TabsContent>
 * </Tabs>
 * ```
 */
export function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn(
        "flex gap-4",
        orientation === "horizontal" ? "flex-col" : "flex-row",
        className,
      )}
      {...props}
    />
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex shrink-0 gap-1",
        "data-[orientation=horizontal]:border-border-middle data-[orientation=horizontal]:border-b",
        "data-[orientation=vertical]:min-w-40 data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-border-middle data-[orientation=vertical]:border-r",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-2 font-bold text-text-low transition-colors hover:text-text-high",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-border-focus",
        "disabled:cursor-not-allowed disabled:text-text-disabled",
        "data-[state=active]:text-text-primary",
        "data-[orientation=horizontal]:-mb-px data-[orientation=horizontal]:border-b-2 data-[orientation=horizontal]:border-transparent data-[orientation=horizontal]:data-[state=active]:border-border-primary",
        "data-[orientation=vertical]:-mr-px data-[orientation=vertical]:justify-start data-[orientation=vertical]:rounded-l-action data-[orientation=vertical]:border-r-2 data-[orientation=vertical]:border-transparent data-[orientation=vertical]:data-[state=active]:border-border-primary data-[orientation=vertical]:data-[state=active]:bg-surface-selected",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none focus-visible:outline-2 focus-visible:outline-border-focus",
        className,
      )}
      {...props}
    />
  );
}
