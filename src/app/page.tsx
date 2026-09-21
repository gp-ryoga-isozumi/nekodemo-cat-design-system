// nekodemo-check-ignore-file NK010 — 静的なカタログ（データ取得が無いので 4 状態は不要）
import Link from "next/link";

const PAGES: { href: string; title: string; description: string }[] = [
  {
    href: "/tokens/",
    title: "トークン",
    description: "セマンティック層・役割層・タイポグラフィ・角丸・影の一覧",
  },
  {
    href: "/themes/",
    title: "テーマ",
    description: "三毛・アメショ・ロシアンブルー（ダーク）の比較。各カードは自分のテーマで描画",
  },
  {
    href: "/samples/list/",
    title: "画面の型 A: 一覧",
    description: "検索・絞り込み・Table・Pagination。4 状態を切り替えて確認",
  },
  {
    href: "/samples/detail/",
    title: "画面の型 B: 詳細",
    description: "Breadcrumb・状態・操作 Menu・2 カラムの Card・Tabs・Drawer",
  },
  {
    href: "/samples/form/",
    title: "画面の型 C: 作成・編集フォーム",
    description: "Form（react-hook-form + zod）とセクションごとの Card、固定フッター",
  },
  {
    href: "/samples/settings/",
    title: "画面の型 D: 設定",
    description: "縦 Tabs と設定項目（見出し・説明・入力）",
  },
  {
    href: "/storybook/",
    title: "Storybook",
    description: "全部品のストーリー、a11y 結果、アイコンカタログ、テーマ切替ツールバー",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-6 font-bold">nekodemo</h1>
        <p className="text-2 text-text-low">
          猫がテーマのプロトタイプ用デザインシステム。ヘッダー右上でテーマを切り替えられます。
        </p>
      </header>
      <ul className="grid gap-2 sm:grid-cols-2">
        {PAGES.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="flex h-full flex-col gap-1 rounded-container border border-border-low bg-surface-card p-4 shadow-raise hover:bg-surface-well"
            >
              <span className="font-bold text-text-link">{p.title}</span>
              <span className="text-2 text-text-low">{p.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
