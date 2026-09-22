// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import NextLink from "next/link";
import { Mascot } from "@/components/mascot";
import { Link } from "@/components/ui/link";
import { nekoThemes } from "@/themes/registry";
import { IndexCards, PageHeader } from "../_components/page-header";
import { THEMES } from "../_lib/content";

export default function ThemesIndexPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Themes" }]}
        title="Themes"
        description="カラーやタイポグラフィなどのデザイントークンの定義です。値はテーマ（3 匹の猫）ごとに変わり、部品とアプリのコードは役割トークン名だけで書きます。"
      />
      <IndexCards
        items={THEMES.map((p) => ({
          href: `/guidelines/themes/${p.slug}/`,
          title: p.title,
          description: p.description,
        }))}
      />
      <section className="mt-8 flex flex-col gap-3">
        <h2 className="font-bold text-5 text-text-high">3 つのテーマ</h2>
        <ul className="grid list-none gap-4 sm:grid-cols-3">
          {nekoThemes.map((t) => (
            <li
              key={t.id}
              data-neko-theme={t.id}
              className="flex flex-col gap-2 rounded-container border border-border-low bg-surface-card p-4 text-text-high"
            >
              <div className="flex items-center gap-2">
                <Mascot theme={t.id} size={40} />
                <span className="font-bold text-4">{t.label.ja}</span>
              </div>
              <p className="text-2 text-text-middle">{t.mood.ja.join("・")}</p>
              <p className="text-1 text-text-low">
                <code className="font-mono">data-neko-theme="{t.id}"</code>
                {t.scheme === "dark" ? "（ダーク）" : ""}
              </p>
              <div className="mt-1 flex gap-1">
                <span
                  className="size-6 rounded-notice bg-surface-primary"
                  title="surface-primary"
                />
                <span className="size-6 rounded-notice bg-surface-well" title="surface-well" />
                <span
                  className="size-6 rounded-notice border border-border-high bg-surface-page"
                  title="surface-page"
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="text-2 text-text-low">
          テーマの雰囲気語と切替の仕組みは{" "}
          <Link asChild>
            <NextLink href="/themes/">テーマの比較ページ</NextLink>
          </Link>
          、トークンの一覧は{" "}
          <Link asChild>
            <NextLink href="/tokens/">トークンページ</NextLink>
          </Link>
          。
        </p>
      </section>
    </>
  );
}
