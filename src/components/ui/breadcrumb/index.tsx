import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

/**
 * Breadcrumb
 *
 * 概要: 現在地の階層（設計書 §9.1 #26）。詳細画面の最上部に置く（§10.1 B）。区切りは耳なしの `chevron_right`。
 * 最後の項目は BreadcrumbPage（リンクにしない、`aria-current="page"`）。
 *
 * アンチパターン:
 * - 一覧画面（最上位）に置く
 * - 4 階層を超える（中間を BreadcrumbEllipsis で省略する）
 *
 * 推奨例:
 * - 詳細画面の最上部に置き、「ホーム → 一覧 → いま見ている項目」の 3 階層を基本にする
 * - 途中の階層は `BreadcrumbLink` で戻れるようにし、最後の項目は `BreadcrumbPage` で現在地を示す
 * - 階層が深い画面は中間を `BreadcrumbEllipsis` で省略し、先頭と直前の階層を残す
 *
 * 使用例:
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem><BreadcrumbLink href="/">ホーム</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem><BreadcrumbLink href="/projects">案件</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem><BreadcrumbPage>社内備品貸出アプリ 改修</BreadcrumbPage></BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export function Breadcrumb(props: ComponentProps<"nav">) {
  return <nav aria-label="パンくずリスト" data-slot="breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1 break-words text-2 text-text-low",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "rounded-notice transition-colors hover:text-text-link hover:underline focus-visible:outline-2 focus-visible:outline-border-focus",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("font-bold text-text-high", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ className, children, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(className)}
      {...props}
    >
      {children ?? <Icon icon="chevron_right" size={3} className="text-object-low" />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-6 items-center justify-center", className)}
      {...props}
    >
      <Icon icon="more_horiz" size={4} />
      <span className="sr-only">省略</span>
    </span>
  );
}
