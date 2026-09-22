// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import { IndexCards, PageHeader } from "../_components/page-header";
import { PATTERNS } from "../_lib/content";

export default function PatternsIndexPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Patterns" }]}
        title="Patterns"
        description="UI における頻出パターンの設計指針です。画面の型、状態の必須セット、操作の原則（送信ボタンの初期状態、モーダルとモードレス、取り消し不可の操作の確認など）。"
      />
      <IndexCards
        items={PATTERNS.map((p) => ({
          href: `/guidelines/patterns/${p.slug}/`,
          title: p.title,
          description: p.description,
        }))}
      />
    </>
  );
}
