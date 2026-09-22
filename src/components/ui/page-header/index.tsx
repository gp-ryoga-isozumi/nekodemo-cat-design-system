import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/utils";

export type PageHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  /** ページ見出し（h1） */
  title: ReactNode;
  /** 見出しの下の 1 行説明 */
  description?: ReactNode;
  /** 見出しの右横に置く状態（StatusTag など） */
  meta?: ReactNode;
  /** 右端の操作。主ボタンは 1 つ */
  actions?: ReactNode;
  /** 見出しの上に置く Breadcrumb */
  breadcrumb?: ReactNode;
};

/**
 * PageHeader
 *
 * 概要: 画面の最上部（v1.2）。Breadcrumb → 見出し（h1）＋状態 → 説明 の順に並べ、右端に主アクションを置く。
 * 4 つの画面の型（一覧・詳細・作成/編集・設定）で同じ骨組みにすることで、AI が画面ごとに見出しの余白や
 * ボタン位置を作り直さずに済む。見出しは `text-6`、説明は `text-2 text-text-low`。
 *
 * アンチパターン:
 * - `actions` に primary の Button を 2 つ以上置く（主アクションは 1 画面 1 つ）
 * - 見出しを動詞にする（「案件を編集する」ではなく「案件の編集」。§10.4）
 * - 説明にページの操作説明を長々と書く（1 行。詳しい説明は InlineMessage か Popover）
 * - 1 画面に 2 つ置く、または `<main>` の外に置く（`<header>` は main の外では banner ランドマークになり、重複は a11y 違反）
 *
 * 推奨例:
 * - 一覧: `title="案件一覧"` + `actions={<Button>案件を追加する</Button>}`
 * - 詳細: `breadcrumb` で一覧に戻れるようにし、`meta` に StatusTag、`actions` に「編集する」と操作 Menu
 * - 作成 / 編集: `title="案件の作成"`、保存ボタンは画面下部の固定フッターに置くので `actions` は空
 *
 * 使用例:
 * ```tsx
 * <PageHeader
 *   breadcrumb={<Breadcrumb>…</Breadcrumb>}
 *   title="社内備品貸出アプリ 改修"
 *   meta={<StatusTag status="info">進行中</StatusTag>}
 *   description="山田商事 / 更新 2026/09/22"
 *   actions={<><Button variant="outline">編集する</Button><Menu>…</Menu></>}
 * />
 * ```
 */
export function PageHeader({
  className,
  title,
  description,
  meta,
  actions,
  breadcrumb,
  ...props
}: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn("flex flex-col gap-2", className)} {...props}>
      {breadcrumb}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-bold text-6 text-text-high">{title}</h1>
            {meta}
          </div>
          {description ? <p className="text-2 text-text-low">{description}</p> : null}
        </div>
        {actions ? (
          <div data-slot="page-header-actions" className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
