import { Mascot } from "@/components/mascot";
import { nekoThemes } from "@/themes/registry";

// 各カードに data-neko-theme を付け、現在のテーマに関係なく「その猫の色」で描画する（ネストしたテーマ切替の例）
const PRIMARY_STEPS = [
  "bg-primary-50",
  "bg-primary-100",
  "bg-primary-200",
  "bg-primary-300",
  "bg-primary-400",
  "bg-primary-500",
  "bg-primary-600",
  "bg-primary-700",
  "bg-primary-800",
  "bg-primary-900",
];
const NEUTRAL_STEPS = [
  "bg-neutral-50",
  "bg-neutral-100",
  "bg-neutral-200",
  "bg-neutral-300",
  "bg-neutral-400",
  "bg-neutral-500",
  "bg-neutral-600",
  "bg-neutral-700",
  "bg-neutral-800",
  "bg-neutral-900",
];

export default function ThemesPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-6 font-bold">テーマ</h1>
        <p className="text-2 text-text-low">
          themes/*.json →
          src/styles/themes.css（生成物）。ヘッダーの切替でページ全体が変わり、下の各カードは常に自分のテーマで描画される。
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {nekoThemes.map((t) => (
          <section
            key={t.id}
            data-neko-theme={t.id}
            className="flex flex-col gap-4 rounded-container border border-border-low bg-surface-page p-4 text-text-high shadow-float"
          >
            <div className="flex items-center gap-3">
              <Mascot theme={t.id} size={56} label={t.label.ja} />
              <div className="flex flex-col">
                <span className="text-4 font-bold">{t.label.ja}</span>
                <span className="text-1 text-text-low">
                  {t.id} · {t.scheme} · {t.mood.ja.join("・")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-10 gap-1">
                {PRIMARY_STEPS.map((c) => (
                  <div key={c} className={`${c} aspect-square rounded-notice`} />
                ))}
              </div>
              <div className="grid grid-cols-10 gap-1">
                {NEUTRAL_STEPS.map((c) => (
                  <div key={c} className={`${c} aspect-square rounded-notice`} />
                ))}
              </div>
              <div className="flex gap-1">
                <div className="h-5 flex-1 rounded-notice bg-accent-1" title="accent-1" />
                <div className="h-5 flex-1 rounded-notice bg-accent-2" title="accent-2" />
                <div className="h-5 flex-1 rounded-notice bg-accent-3" title="accent-3" />
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-container border border-border-low bg-surface-card p-3">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-8 items-center rounded-action bg-surface-primary px-3 text-2 font-bold text-text-on-primary">
                  保存する
                </span>
                <span className="inline-flex h-8 items-center rounded-action border border-border-high bg-surface-card px-3 text-2 font-bold text-text-high">
                  キャンセル
                </span>
                <span className="inline-flex h-8 items-center rounded-action bg-surface-negative px-3 text-2 font-bold text-text-on-negative">
                  削除する
                </span>
              </div>
              <div className="h-9 rounded-action border border-border-high bg-surface-input px-3 text-2 leading-9 text-text-placeholder">
                案件名で検索
              </div>
              <div className="flex flex-wrap gap-2 text-1 font-bold">
                <span className="rounded-notice bg-surface-info-subtle px-2 py-1 text-text-info">
                  進行中
                </span>
                <span className="rounded-notice bg-surface-success-subtle px-2 py-1 text-text-success">
                  完了
                </span>
                <span className="rounded-notice bg-surface-warning-subtle px-2 py-1 text-text-warning">
                  確認待ち
                </span>
                <span className="rounded-notice bg-surface-negative-subtle px-2 py-1 text-text-negative">
                  差し戻し
                </span>
              </div>
              <p className="text-2 text-text-middle">
                本文 <span className="text-text-link underline">リンク</span>・
                <span className="text-text-low">補足</span>
              </p>
            </div>
            <dl className="grid grid-cols-[72px_1fr] gap-x-2 gap-y-1 text-1 text-text-low">
              <dt>キーワード</dt>
              <dd className="text-text-middle">{t.mood.keywords.join("、")}</dd>
              <dt>フォント</dt>
              <dd className="text-text-middle">
                {t.fonts.pro} / {t.fonts.mono}
              </dd>
              <dt>マスコット</dt>
              <dd className="text-text-middle">{t.mascot}</dd>
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
