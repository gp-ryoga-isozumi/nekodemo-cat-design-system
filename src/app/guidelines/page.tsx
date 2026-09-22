// nekodemo-check-ignore-file NK010 — 静的なガイドライン（データ取得が無いので 4 状態は不要）
import NextLink from "next/link";
import { Link } from "@/components/ui/link";
import { IndexCards, PageHeader } from "./_components/page-header";
import {
  FOUNDATIONS,
  listComponents,
  PATTERNS,
  SECTION_LABELS,
  sectionStatus,
  THEMES,
} from "./_lib/content";

export default function GuidelinesOverviewPage() {
  const components = listComponents();
  const totals = { done: 0, partial: 0, todo: 0 };
  for (const c of components) {
    for (const key of SECTION_LABELS.map((s) => s.key)) totals[sectionStatus(c)[key]]++;
  }
  const cells = components.length * SECTION_LABELS.length;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Overview" }]}
        title="ガイドライン"
        description="プロトタイプを「かわいくて使いやすい」状態で組むための決まり。基盤（Foundations）、テーマ（Themes）、部品（Components）、頻出パターン（Patterns）の 4 つに分けています。"
      />
      <IndexCards
        items={[
          {
            href: "/guidelines/foundations/",
            title: "Foundations",
            description: `基盤となる原則と方針。アクセシビリティ、文言、余白と色、猫要素の使いどころ（${FOUNDATIONS.length} 項目）`,
          },
          {
            href: "/guidelines/themes/",
            title: "Themes",
            description: `デザイントークンの定義。Color / Typography / Shape / Icons と、3 つのテーマ（${THEMES.length} 項目）`,
          },
          {
            href: "/guidelines/components/",
            title: "Components",
            description: `部品ごとの概要・選択肢・状態・使い方・関連部品（${components.length} 部品）`,
          },
          {
            href: "/guidelines/patterns/",
            title: "Patterns",
            description: `画面の型、状態の必須セット、操作の原則（${PATTERNS.length} 項目）`,
          },
        ]}
      />
      <section className="mt-8 flex flex-col gap-3">
        <h2 className="font-bold text-5 text-text-high">整備状況</h2>
        <p className="text-3 text-text-middle">
          部品ページは一般的なデザインシステムと同じ {SECTION_LABELS.length} 節（
          {SECTION_LABELS.map((s) => s.label).join(" / ")}
          ）で構成しています。現在の埋まり具合は次のとおりです。
          未整備の節は各ページに明示しています。
        </p>
        <dl className="grid grid-cols-3 gap-3 sm:max-w-md">
          {(
            [
              ["整備済み", totals.done, "text-text-success"],
              ["一部", totals.partial, "text-text-warning"],
              ["未整備", totals.todo, "text-text-low"],
            ] as const
          ).map(([label, n, cls]) => (
            <div
              key={label}
              className="rounded-container border border-border-low bg-surface-card p-4"
            >
              <dt className="text-2 text-text-low">{label}</dt>
              <dd className={`font-bold font-mono text-6 ${cls}`}>
                {n}
                <span className="ml-1 font-normal text-2 text-text-low">/ {cells}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-2 text-text-low">
          部品ごとの内訳は{" "}
          <Link asChild>
            <NextLink href="/guidelines/components/">Components の一覧</NextLink>
          </Link>
          。
        </p>
      </section>
      <section className="mt-8 flex flex-col gap-2">
        <h2 className="font-bold text-5 text-text-high">AI に読ませる場合</h2>
        <p className="text-3 text-text-middle">
          このサイトの内容は{" "}
          <Link
            href="https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/USING_NEKODEMO.md"
            external
          >
            USING_NEKODEMO.md
          </Link>{" "}
          に 1 ファイルでまとめてあります。AI コーディングツールにはそちらの URL を渡してください。
        </p>
      </section>
    </>
  );
}
