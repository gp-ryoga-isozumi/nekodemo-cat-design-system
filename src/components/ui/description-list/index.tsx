import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/utils";

export type DescriptionListProps = ComponentProps<"dl"> & {
  /** 列数（sm 以上で適用。既定 2） */
  columns?: 1 | 2 | 3;
  /** 項目名の位置。`horizontal` は左（幅 8rem）、`vertical` は上 */
  layout?: "horizontal" | "vertical";
  density?: "sm" | "md";
};

export type DescriptionItemProps = Omit<ComponentProps<"div">, "children"> & {
  /** 項目名（「顧客」「金額」） */
  label: ReactNode;
  /** 値。空（null / undefined / ""）なら `emptyText` を薄く出す */
  children?: ReactNode;
  /** 値が空のときの表示。既定「—」 */
  emptyText?: ReactNode;
  /** 複数列のとき、この項目を全幅にする（長い備考など） */
  span?: boolean;
};

/**
 * DescriptionList
 *
 * 概要: 「項目名: 値」の一覧（v1.2）。詳細画面（型 B）の基本情報や、確認画面の入力内容を並べる。
 * `<dl>` / `<dt>` / `<dd>` で組むので読み上げ順が崩れない。`columns` で 2〜3 列のグリッド、
 * `layout="horizontal"` で項目名を左に固定幅で置く。値が空の項目は「—」を薄く出す（行を消さない）。
 *
 * アンチパターン:
 * - 値が空の項目を消す（何が未入力か分からなくなる。「—」で残す）
 * - 表（Table）で代用する（列の比較ではなく 1 件の属性なので DescriptionList）
 * - 項目名を「顧客名：」のように末尾にコロンを付ける（区切りはレイアウトで表す）
 *
 * 推奨例:
 * - 詳細画面の Card の中に置き、関連する項目を 4〜8 個ずつまとめる
 * - 長い値（備考・住所）は `span` で全幅にし、`layout="vertical"` で項目名を上に置く
 * - 値に StatusTag や Link を入れて、状態やリンク先をその場で示す
 *
 * 使用例:
 * ```tsx
 * <DescriptionList columns={2}>
 *   <DescriptionItem label="顧客">山田商事</DescriptionItem>
 *   <DescriptionItem label="金額">1,200,000 円</DescriptionItem>
 *   <DescriptionItem label="状態"><StatusTag status="info">進行中</StatusTag></DescriptionItem>
 *   <DescriptionItem label="備考" span>{project.memo}</DescriptionItem>
 * </DescriptionList>
 * ```
 */
export function DescriptionList({
  className,
  columns = 2,
  layout = "vertical",
  density = "md",
  ...props
}: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      data-layout={layout}
      data-density={density}
      className={cn(
        "grid grid-cols-1",
        density === "sm" ? "gap-x-6 gap-y-3" : "gap-x-8 gap-y-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        className,
      )}
      {...props}
    />
  );
}

function isEmpty(v: ReactNode): boolean {
  return v === null || v === undefined || v === "" || v === false;
}

export function DescriptionItem({
  className,
  label,
  children,
  emptyText = "—",
  span = false,
  ...props
}: DescriptionItemProps) {
  const empty = isEmpty(children);
  return (
    <div
      data-slot="description-item"
      className={cn(
        "flex min-w-0 gap-1",
        "[dl[data-layout=vertical]_&]:flex-col",
        "[dl[data-layout=horizontal]_&]:flex-row [dl[data-layout=horizontal]_&]:gap-4",
        span && "sm:col-span-full",
        className,
      )}
      {...props}
    >
      <dt
        data-slot="description-term"
        className="shrink-0 text-2 text-text-low leading-6 [dl[data-layout=horizontal]_&]:w-32"
      >
        {label}
      </dt>
      <dd
        data-slot="description-details"
        data-empty={empty ? "true" : undefined}
        className={cn(
          "min-w-0 break-words text-3 text-text-high leading-6",
          empty && "text-text-low",
        )}
      >
        {empty ? emptyText : children}
      </dd>
    </div>
  );
}
