// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import { IndexCards, PageHeader } from "../_components/page-header";
import { FOUNDATIONS } from "../_lib/content";

export default function FoundationsIndexPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Foundations" }]}
        title="Foundations"
        description="デザインシステムの基盤となる原則と方針です。"
      />
      <IndexCards
        items={FOUNDATIONS.map((p) => ({
          href: `/guidelines/foundations/${p.slug}/`,
          title: p.title,
          description: p.description,
        }))}
      />
    </>
  );
}
