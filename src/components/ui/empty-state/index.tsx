"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Mascot } from "../../mascot";
import { useNekoThemeOptional } from "../../theme/NekoThemeProvider";

export type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
  /** 見出し。例: 「まだ案件がありません」「条件に合う案件がありません」 */
  title: ReactNode;
  /** 説明（任意） */
  description?: ReactNode;
  /** 主アクション（Button）。検索結果 0 件なら「条件をクリアする」 */
  action?: ReactNode;
  /** マスコットを出さない（小さな領域向け） */
  hideMascot?: boolean;
  /** 見出しのレベル（既定 3）。画面の見出し階層に合わせる */
  headingLevel?: 2 | 3 | 4;
};

/**
 * EmptyState
 *
 * 概要: 0 件のときの表示（設計書 §9.1 #35、§10.2）。現在のテーマのマスコット＋見出し＋説明＋主アクション。
 * 初回 0 件は「まだ〜がありません」＋追加アクション、検索結果 0 件は「条件に合う〜がありません」＋条件クリア。
 * マスコットを出してよい 4 か所のうちの 1 つ（§8.6）。
 *
 * アンチパターン:
 * - 表やフォームの中に置く（一覧の領域全体を置き換える）
 * - 猫の言葉遊びを業務文言に混ぜる（見出しは事実を書き、遊びは控えめに）
 *
 * 推奨例:
 * - 一覧の領域全体と置き換えて出し、初回 0 件は「まだ案件がありません」＋ `action` に追加ボタンを置く
 * - 検索・絞り込みの結果 0 件は「条件に合う案件がありません」＋「条件をクリアする」にする
 * - `description` に次にすることを 1 文で書く（「最初の案件を追加すると、ここに一覧が表示されます。」）
 * - Card の中のような狭い領域では `hideMascot` を付け、画面の見出し階層に合わせて `headingLevel` を変える
 *
 * 使用例:
 * ```tsx
 * <EmptyState title="まだ案件がありません" description="最初の案件を追加すると、ここに一覧が表示されます。"
 *   action={<Button><Icon icon="add" size={4} />案件を追加する</Button>} />
 * ```
 */
export function EmptyState({
  className,
  title,
  description,
  action,
  hideMascot = false,
  headingLevel = 3,
  ...props
}: EmptyStateProps) {
  // NekoThemeProvider の外（テーマ無し）でも落ちない。そのときはマスコットを出さない
  const theme = useNekoThemeOptional()?.theme;
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center gap-2 px-4 py-8 text-center", className)}
      {...props}
    >
      {hideMascot || !theme ? null : <Mascot theme={theme} size={96} className="mb-2" />}
      <Heading className="text-4 font-bold leading-7 text-text-high">{title}</Heading>
      {description ? <p className="max-w-[36ch] text-2 text-text-low">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
