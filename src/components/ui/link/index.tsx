import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export type LinkProps = ComponentProps<"a"> & {
  /** Next.js の Link 等を子に渡してそのまま使う */
  asChild?: boolean;
  /** 外部リンク。target=_blank と rel を付け、末尾に open_in_new アイコンを出す */
  external?: boolean;
};

/**
 * Link
 *
 * 概要: 文中や一覧内のテキストリンク（設計書 §9.1 #3）。色は `text-text-link`、下線あり。
 * `external` で新しいタブに開き、耳なしの `open_in_new` アイコンを付ける。Next.js の `<Link>` は `asChild` で包む。
 *
 * アンチパターン:
 * - 操作（保存・削除）に使う（Button）
 * - 「こちら」だけをリンクにする（リンク先が分かる語をリンクにする）
 *
 * 推奨例:
 * - 画面が変わるもの（詳細・一覧・ヘルプ）への移動に使い、文中では前後の文とつなげて書く
 * - 一覧の行では項目名をリンクにし、行のクリックと同じ詳細へ遷移させる
 * - 別サイトや外部の資料を開くときは `external` を付けて新しいタブで開く
 * - アプリ内の遷移は `asChild` で Next.js の `<Link>` を包む
 *
 * 使用例:
 * ```tsx
 * <Link href="/projects/1">案件の詳細</Link>
 * <Link href="https://example.com" external>ヘルプセンター</Link>
 * <Link asChild><NextLink href="/projects">案件一覧</NextLink></Link>
 * ```
 */
export function Link({
  className,
  asChild = false,
  external = false,
  children,
  rel,
  target,
  ...props
}: LinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  // external のときは呼び出し側の rel を消さずに noopener noreferrer を足す
  const externalProps = external
    ? {
        target: target ?? "_blank",
        rel: [rel, "noopener", "noreferrer"].filter(Boolean).join(" ").replace(/\s+/g, " "),
      }
    : { target, rel };
  return (
    <Comp
      data-slot="link"
      className={cn(
        "inline-flex items-center gap-1 rounded-notice text-text-link underline decoration-1 underline-offset-[3px] transition-colors hover:text-text-high",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
        className,
      )}
      {...externalProps}
      {...props}
    >
      {/* Slot は子が 1 つでないと落ちるため、asChild でも渡せるよう Slottable で包む */}
      <Slot.Slottable>{children}</Slot.Slottable>
      {external ? <Icon icon="open_in_new" size={2} label="新しいタブで開く" /> : null}
    </Comp>
  );
}
