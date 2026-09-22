# Changelog

すべての変更をここに記録する（semver）。リリース PR で更新する。

## Unreleased

## 0.1.0（公開準備中。npm 公開は H7 の承認後）

### Added
- 2026-09-22 全体レビュー（API の一貫性 / アクセシビリティ / ルールとガイドライン / 構造と DX の 4 本、185 件）の反映:
  - 部品の品質: `EmptyState` / `DataGrid` が `NekoThemeProvider` の外でも落ちない（`useNekoThemeOptional`）、`SearchCombobox` を `FormControl` から結べる、`FilterChip` の非制御対応、`Link external` の rel 結合、`Dialog` のスクロール、`SideNavItem badgeVariant`、shadcn からの対応表（USING §6）
  - アクセシビリティ: ダークテーマの `border-high` / `text-low` のコントラスト（検査ペア 31 組）、Menu / Select 項目のフォーカス表示、強制カラーモードでも見える透明アウトライン、読み上げ名が無い radiogroup / tablist の開発時警告、`Field` の id / aria 注入と `FormLabel required` → `aria-required`、`Button loading` と `Pagination` の端は `aria-disabled`、DataGrid の列幅をキーボードで変更、選択件数・候補件数のライブリージョン、`Table` の横スクロール領域、`prefers-reduced-motion`
  - API の一貫性: `SearchCombobox onChange` → `onValueChange`、`className` はルート要素（`InputPassword` / `InputSearch` / `Textarea` は `inputClassName`）、`Icon` / `Spinner` の props 透過、`IconButton asChild`、`DataGrid selection` / `defaultSelection`、`InputFile defaultValue`、cva の公開、命名規約（設計書 §9.2）
  - ガイドライン v3: レイアウト / フォーム / 知らせ方 / 一覧の絞り込みと一括操作 / ナビゲーション / 部品の選び方 / Motion の 7 本、01〜07 の矛盾修正（状態表示は StatusTag、画面の型 A〜F、読み込みのしきい値、データ書式、a11y の 4 項目）、部品ページの props 表、SETUP は tarball を主手順に
  - サンプル画面: 型 E ログイン（`/samples/login/`）と型 F ダッシュボード（`/samples/dashboard/`）
  - `nekodemo check`: 複数行 JSX の検出（NK004 / NK009）、copy-in の CSS 除外、`--ignore` / `nekodemo.config.json` の `check.ignore` / `--max-warnings`、NK011（空の読み上げ名）、NK012（style のウェイト等）、NK014（primary が 2 つ）、NK016（Toaster の欠落・重複）、NK018（送信ボタンの初期 disabled）、NK020（見出し h1）、NK010 は不足している状態を列挙
  - 品質ゲート: lint は warning でも失敗、CI に生成物の鮮度検査（コントラスト検査を含む）、barrel の網羅性テスト、registry の `styles` 依存と `tw-animate-css`、skill の部品名一覧を生成、`build-package` の書き換えのテスト、`pack:test` に利用側の型検査とサイズ上限、部品ごとの subpath export（`nekodemo/components/*`）
- Phase 0: 開発土台（Next.js 16 / React 19 / Tailwind v4 / Storybook 10 / Vitest 4 / Biome / CI / Claude Code hooks）
- Phase 1: トークン（3 層構造、Tailwind 既定パレットの無効化、shadcn 変数ブリッジ）
- Phase 2: テーマ 3 種（三毛 / アメショ / ロシアンブルー（ダーク））、JSON Schema、コントラスト検査、ランタイム切替
- Phase 3a: 猫耳アイコン基盤（Icon 部品、自動耳、Material Symbols へのフォールバック、カタログ）
- Phase 4: 中核部品 36 種、nekodemo check、4 画面型のサンプル
- Phase 5: AI 向け提供物（USING_NEKODEMO.md / SETUP.md / GUARD_BLOCK.md / skills 5 つ / llms.txt）、shadcn registry、npm 配布物
- Phase 3b: T1 パイプライン（`icons:prompts` / `icons:vectorize` / `icons:audit` / `icons:inspect`）、手動耳 3 個（badge / cake / cloud_download）、耳なし規約に 10 個を追加（「耳を置けず」0）
- ガイドラインサイト（`/guidelines/`）: Foundations / Themes / Components / Patterns の構成で、`docs/guidelines/*.md` と部品の README・stories から生成。部品ページは 11 節（概要・解剖図・選択肢・状態・振る舞い・寸法・使い方・内容・関連部品・参考文献・変更履歴）で未整備の節を明示
- v1.2 部品: `InputNumber`（増減ボタン・単位・3 桁区切り）、`InputDate`（標準の type=date ＋ 猫耳カレンダーボタン）、`InputTime`、`InputFile`（ドロップ領域・検証・一覧）、`SegmentedControl`（Radix ToggleGroup single）、`Stepper`（横 / 縦、aria-current=step）、`FilterChip` / `FilterChipGroup`、`Progress`、`DescriptionList` / `DescriptionItem`、`Accordion`（Radix）、`PageHeader`
- ガイドラインサイト v2: 部品ページの「選択肢」「状態」「寸法」を実装から自動生成（`scripts/component-spec.mjs` が cva / ユニオン型 / size 表 / density を読む）、「使い方」を README の推奨例 / アンチパターンで Do / Don't に、主要 10 部品の解剖図（`anatomy.tsx`）、全部品の手書き節 `docs/guidelines/components/<slug>.md`（振る舞い・内容・参考文献）、Patterns に「サイドパネル」（`08-side-panel.md`）
- Phase 6（v1.1）: `DataGrid`（TanStack Table v9。ソート・列幅・固定・選択・ページング・検索・列の絞り込み・列の表示切替・密度・4 状態・仮想化・行内操作）、`SearchCombobox`（MUI useAutocomplete。単一／複数／自由入力／グループ／読み込み中）、サンプル `/samples/grid/`。`Table` に `containerProps`、`TableHead.onSort` にイベント
