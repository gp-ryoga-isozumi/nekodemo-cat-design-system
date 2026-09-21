// nekodemo-check-ignore-file NK010 — 静的なカタログ（データ取得が無いので 4 状態は不要）
// デモサイト: トークン一覧（Phase 1）。クラス名はすべて役割トークン／セマンティック名。
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;

// Tailwind はソース中の文字列を走査するため、クラス名はリテラルで並べる
const PALETTES: { name: string; classes: string[] }[] = [
  {
    name: "primary",
    classes: [
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
    ],
  },
  {
    name: "neutral",
    classes: [
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
    ],
  },
  {
    name: "info",
    classes: [
      "bg-info-50",
      "bg-info-100",
      "bg-info-200",
      "bg-info-300",
      "bg-info-400",
      "bg-info-500",
      "bg-info-600",
      "bg-info-700",
      "bg-info-800",
      "bg-info-900",
    ],
  },
  {
    name: "success",
    classes: [
      "bg-success-50",
      "bg-success-100",
      "bg-success-200",
      "bg-success-300",
      "bg-success-400",
      "bg-success-500",
      "bg-success-600",
      "bg-success-700",
      "bg-success-800",
      "bg-success-900",
    ],
  },
  {
    name: "warning",
    classes: [
      "bg-warning-50",
      "bg-warning-100",
      "bg-warning-200",
      "bg-warning-300",
      "bg-warning-400",
      "bg-warning-500",
      "bg-warning-600",
      "bg-warning-700",
      "bg-warning-800",
      "bg-warning-900",
    ],
  },
  {
    name: "negative",
    classes: [
      "bg-negative-50",
      "bg-negative-100",
      "bg-negative-200",
      "bg-negative-300",
      "bg-negative-400",
      "bg-negative-500",
      "bg-negative-600",
      "bg-negative-700",
      "bg-negative-800",
      "bg-negative-900",
    ],
  },
];

const SURFACES = [
  "bg-surface-page",
  "bg-surface-card",
  "bg-surface-well",
  "bg-surface-input",
  "bg-surface-disabled",
  "bg-surface-primary",
  "bg-surface-primary-hover",
  "bg-surface-primary-active",
  "bg-surface-primary-subtle",
  "bg-surface-primary-subtle-hover",
  "bg-surface-selected",
  "bg-surface-negative",
  "bg-surface-negative-subtle",
  "bg-surface-info-subtle",
  "bg-surface-success-subtle",
  "bg-surface-warning-subtle",
  "bg-surface-inverse",
];

const BORDERS = [
  "border-border-low",
  "border-border-middle",
  "border-border-high",
  "border-border-primary",
  "border-border-negative",
  "border-border-focus",
];

const TEXTS: [string, string][] = [
  ["text-text-high", "text-high — 見出し・本文"],
  ["text-text-middle", "text-middle — 表のヘッダー・補足"],
  ["text-text-low", "text-low — ヒント・件数"],
  ["text-text-placeholder", "text-placeholder — プレースホルダー"],
  ["text-text-disabled", "text-disabled — 無効"],
  ["text-text-link", "text-link — リンク"],
  ["text-text-primary", "text-primary — primary 色の文字"],
  ["text-text-negative", "text-negative — エラー文"],
  ["text-text-info", "text-info"],
  ["text-text-success", "text-success"],
  ["text-text-warning", "text-warning"],
];

const TYPE_SCALE: [string, string][] = [
  ["text-1", "text-1 12px"],
  ["text-2", "text-2 14px"],
  ["text-3", "text-3 16px（本文）"],
  ["text-4", "text-4 18px"],
  ["text-5", "text-5 20px（見出し）"],
  ["text-6", "text-6 24px（見出し）"],
  ["text-7", "text-7 28px"],
  ["text-8", "text-8 32px"],
];

export default function TokensPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-6 font-bold">トークン</h1>
        <p className="text-2 text-text-low">
          tokens/*.json →
          src/styles/tokens.css（生成物）。部品とアプリ側のコードは役割トークン名だけを使う。
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-5 font-bold">セマンティック層（50〜900）</h2>
        {PALETTES.map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="w-20 font-mono text-2 text-text-middle">{p.name}</span>
            <div className="grid flex-1 grid-cols-10 gap-1">
              {p.classes.map((c, i) => (
                <div
                  key={c}
                  className={`${c} flex aspect-square items-end justify-center rounded-notice border border-border-low`}
                >
                  <span className="text-1 text-text-low opacity-0">{STEPS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-5 font-bold">役割層</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SURFACES.map((c) => (
            <div
              key={c}
              className={`${c} rounded-action border border-border-middle p-3 font-mono text-1`}
            >
              <span className="rounded-notice bg-surface-card px-1 text-text-middle">
                {c.replace("bg-", "")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {BORDERS.map((c) => (
            <div
              key={c}
              className={`${c} rounded-action border-2 bg-surface-card px-3 py-2 font-mono text-1 text-text-middle`}
            >
              {c.replace("border-", "")}
            </div>
          ))}
        </div>
        <ul className="flex flex-col gap-1 rounded-container border border-border-low bg-surface-card p-4">
          {TEXTS.map(([c, label]) => (
            <li key={c} className={c}>
              {label}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-5 font-bold">タイポグラフィ・角丸・影</h2>
        <div className="flex flex-col gap-1 rounded-container border border-border-low bg-surface-card p-4">
          {TYPE_SCALE.map(([c, label]) => (
            <p key={c} className={c}>
              {label} 猫がテーマのデザインシステム Aa Bb 0123
            </p>
          ))}
          <p className="font-mono text-2">font-mono 1,234,567.89 ／ 2026/09/21 13:05</p>
          <p className="text-2">
            <span className="font-normal">font-normal 400</span> ／{" "}
            <span className="font-bold">font-bold 700</span>
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div
            className="h-12 w-16 rounded-action border border-border-primary bg-surface-primary-subtle"
            title="rounded-action"
          />
          <div
            className="h-12 w-16 rounded-container border border-border-middle bg-surface-card shadow-raise"
            title="rounded-container / shadow-raise"
          />
          <div
            className="h-12 w-16 rounded-modal bg-surface-card shadow-float"
            title="rounded-modal / shadow-float"
          />
          <div
            className="h-12 w-16 rounded-modal bg-surface-card shadow-popout"
            title="shadow-popout"
          />
          <div className="h-12 w-12 rounded-round bg-surface-primary" title="rounded-round" />
          <span className="text-1 text-text-low">
            action / container / modal / round ・ raise / float / popout
          </span>
        </div>
      </section>
    </main>
  );
}
