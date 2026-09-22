# Changelog

すべての変更をここに記録する（semver）。リリース PR で更新する。

## Unreleased

## 0.1.0（公開準備中。npm 公開は H7 の承認後）

### Added
- Phase 0: 開発土台（Next.js 16 / React 19 / Tailwind v4 / Storybook 10 / Vitest 4 / Biome / CI / Claude Code hooks）
- Phase 1: トークン（3 層構造、Tailwind 既定パレットの無効化、shadcn 変数ブリッジ）
- Phase 2: テーマ 3 種（三毛 / アメショ / ロシアンブルー（ダーク））、JSON Schema、コントラスト検査、ランタイム切替
- Phase 3a: 猫耳アイコン基盤（Icon 部品、自動耳、Material Symbols へのフォールバック、カタログ）
- Phase 4: 中核部品 36 種、nekodemo check、4 画面型のサンプル
- Phase 5: AI 向け提供物（USING_NEKODEMO.md / SETUP.md / GUARD_BLOCK.md / skills 5 つ / llms.txt）、shadcn registry、npm 配布物
- Phase 3b: T1 パイプライン（`icons:prompts` / `icons:vectorize` / `icons:audit` / `icons:inspect`）、手動耳 3 個（badge / cake / cloud_download）、耳なし規約に 10 個を追加（「耳を置けず」0）
- ガイドラインサイト（`/guidelines/`）: Foundations / Themes / Components / Patterns の構成で、`docs/guidelines/*.md` と部品の README・stories から生成。部品ページは 11 節（概要・解剖図・選択肢・状態・振る舞い・寸法・使い方・内容・関連部品・参考文献・変更履歴）で未整備の節を明示
- v1.2 部品: `InputNumber`（増減ボタン・単位・3 桁区切り）、`InputDate`（標準の type=date ＋ 猫耳カレンダーボタン）、`InputTime`、`InputFile`（ドロップ領域・検証・一覧）、`SegmentedControl`（Radix ToggleGroup single）、`Stepper`（横 / 縦、aria-current=step）、`FilterChip` / `FilterChipGroup`、`Progress`、`DescriptionList` / `DescriptionItem`、`Accordion`（Radix）、`PageHeader`
- Phase 6（v1.1）: `DataGrid`（TanStack Table v9。ソート・列幅・固定・選択・ページング・検索・列の絞り込み・列の表示切替・密度・4 状態・仮想化・行内操作）、`SearchCombobox`（MUI useAutocomplete。単一／複数／自由入力／グループ／読み込み中）、サンプル `/samples/grid/`。`Table` に `containerProps`、`TableHead.onSort` にイベント
