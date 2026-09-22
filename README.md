# nekodemo（猫デザインシステム）

> 猫がテーマの、プロトタイプ専用デザインシステム。React / Tailwind CSS v4 / shadcn ベース。
> AI コーディングツールに「nekodemo を使って」と指定するだけで、**かわいくて使いやすいプロトタイプ**が、決まったルールで、少ないトークンで出来上がることを目指しています。

- 状態: **v0.1.0（Phase 0〜5 完了。npm 公開は準備中。受け入れテストの手順は [`docs/ai/ACCEPTANCE_TEST.md`](docs/ai/ACCEPTANCE_TEST.md)）**
- デモサイト: https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/ ／ ガイドライン: [`/guidelines/`](https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/guidelines/)（Foundations / Themes / Components / Patterns）／ Storybook: [`/storybook/`](https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/storybook/)
- 実装前のビジュアルプレビュー: [`docs/preview/index.html`](docs/preview/index.html)（36 部品 × 3 テーマ。Phase 4 以降は Storybook が正）
- 設計書: [`prompt/NEKODEMO_DESIGN.md`](prompt/NEKODEMO_DESIGN.md) ／ 実装計画: [`prompt/IMPLEMENTATION_PLAN.md`](prompt/IMPLEMENTATION_PLAN.md)

## AI に使わせるには

利用側プロジェクトで、AI コーディングツールに次のどれかを渡します。

| 環境 | 渡すもの |
|---|---|
| Claude Code / Codex / Gemini CLI / Cursor（skills が使える） | `npx skills add gp-ryoga-isozumi/nekodemo-cat-design-system` で 5 つの skills（`setup-nekodemo` `use-nekodemo` `change-neko-theme` `add-nekodemo-component` `request-cat-icon`）を入れ、「nekodemo を導入して」「nekodemo で一覧画面を作って」と依頼する |
| skills が使えない環境（Web 版 ChatGPT 等） | [`docs/ai/USING_NEKODEMO.md`](docs/ai/USING_NEKODEMO.md)（1 ファイルで完結するガイド）の URL を渡す。導入手順は [`docs/ai/SETUP.md`](docs/ai/SETUP.md) |
| どの環境でも | [`llms.txt`](llms.txt) に入口をまとめています |

導入後は `AGENTS.md` に [`docs/ai/GUARD_BLOCK.md`](docs/ai/GUARD_BLOCK.md) のブロックを貼り、`pnpm nekodemo check src --strict` を AI の応答終了時（Claude Code の Stop hook）に走らせると、役割トークン以外の色や猫版が無いアイコンが自動で検出されます。

利用者向けプロンプトの例:

- 「GitHub の `gp-ryoga-isozumi/nekodemo-cat-design-system` を使って、社内の備品貸出アプリのプロトタイプを作って。テーマはアメショで。」
- 「nekodemo で、案件一覧（検索・絞り込み・ページング付き）と案件詳細を作って。テーマは相手が金融系なので上品なやつ。」
- 「このプロトタイプのテーマを三毛に変えて。」

### 配布経路

| 経路 | 内容 | 使い方 |
|---|---|---|
| npm パッケージ `nekodemo`（公開準備中） | 部品（ESM + 型定義）、`nekodemo/styles.css`（トークン + 3 テーマ）、`nekodemo check`（lint）、`ai/`（AI 向けガイド）、`skills/` | `pnpm add nekodemo`（公開前は `pnpm add https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/nekodemo.tgz`） |
| shadcn registry | 部品のソースを copy-in（npm 依存を増やしたくない場合） | `components.json` に `"registries": { "@nekodemo": "https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/r/{name}.json" }` → `npx shadcn@latest add @nekodemo/styles @nekodemo/theme @nekodemo/button` |
| デモサイト / ガイドライン / Storybook | テーマ切替、トークン一覧、4 画面型のサンプル、ガイドライン（部品ごとの節立てと整備状況）、全部品のストーリー | https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/ ・ [`/storybook/`](https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/storybook/) |

## 解決したい課題

プロトタイプを作ってユーザーインタビューや社内検証にかけると、次の 5 つの問題が繰り返し起きます。nekodemo はこの 5 つに対する打ち手です。

| # | 現場で起きること | nekodemo の打ち手 |
|---|---|---|
| 1 | **見た目に被験者が反応してしまう。** 「色が地味」「なんかチープ」と見た目の話が先に出て、検証したい体験の話ができない。「この程度のものを作ろうとしているのか」と受け取られることもある | 猫テーマで「これは検証用の楽しいモック」と一目で伝わるようにする。可愛さが見た目批判の矛先を逸らし、**使いにくさの指摘は指摘しやすいまま残す** |
| 2 | **作り込むと手間が増える。** 1 を避けようと見た目を整えると、プロトタイプなのに実装工数がかかる | 部品・テーマ・アイコンが最初から揃っていて、AI が組むだけで見た目が完成する |
| 3 | **コンポーネントライブラリの指定だけでは品質が出ない。** 「shadcn を使って」と AI に指示しても、状態設計・余白・文言・操作の原則が無いので、部品は綺麗でも画面としては低品質になる | 「使い方のルール（UX ガイドライン）」と「完成チェックリスト」を、AI が読む形式（AGENTS.md / skills / lint）で同梱する |
| 4 | **どれも同じ見た目になる。** 白背景・青がプライマリの、よくある業務アプリの見た目に収束する | 3 テーマとも白背景＋青ではない配色。テーマは `data-neko-theme` 属性 1 つで切り替わる |
| 5 | **AI がゼロから作り直してトークンを浪費する。** 部品が揃っていないと AI が毎回自作し、生成ルールも無いので出力がぶれる | Tailwind の既定パレットを無効化し、nekodemo のトークン以外はビルドで存在しない状態にする。違反は `nekodemo check` で検出し、AI の応答終了時に自動実行する |

## コンセプト

**「おふざけだが実用に耐える」。** 猫要素で場を和ませつつ、業務画面として普通に使える品質を保ちます。

- **3 匹の猫テーマ。** 三毛（親しみやすい・明るい。toC や学習向け）、アメショ（中立・落ち着き・モノトーン。業務システム向け）、ロシアンブルー（上品・クール・**ダーク**。金融・法務・高級感が要る提案向け）。プライマリ配色・ニュートラルの色味・角丸・マスコットがテーマごとに変わり、ステータス色・余白・部品の構造は共通です。フォントは 3 テーマとも Zen Maru Gothic（丸ゴシック）です。
- **猫耳アイコン。** Material Symbols と同じ名前（`search`、`delete`、`settings` …）で指定でき、本体と同じ線幅の中抜きの耳が付きます。矢印・チェック・× などには付けません。猫版が無い名前でも表示は壊れません（フォールバックあり）。
- **猫要素は効く場所だけ。** 常に出るのは耳付きアイコンだけ。マスコットは空状態・初回ローディング・404・ログインの 4 か所、猫の顔のシルエットはチェックボックスと Avatar のフォールバックだけです。表・フォーム・詳細のような業務データの領域には猫のイラストや絵文字を入れません。やりすぎると「おふざけ」が「使いにくさ」に変わるためです。
- **役割トークンだけで書く。** 部品もアプリ側のコードも `bg-surface-card` `text-text-low` `rounded-action` `text-3` のような役割名だけを使います。`#hex` / `rgb()` / Tailwind 既定パレット（`bg-blue-500` 等）/ 任意値（`text-[13px]`）は禁止で、ビルドで存在せず lint でも検出されます。
- **4 状態は必須。** 一覧・表・カード群・詳細には「読み込み中 / 0 件 / エラー / 成功」を必ず実装します。プロトタイプでも省略しません。
- **AI が読める形で提供する。** `AGENTS.md`、`skills/`、`docs/ai/`、`llms.txt`、`nekodemo check` を同梱し、Claude Code / Codex / Gemini CLI / Cursor / Web 版 ChatGPT のどれからでも同じルールで使えるようにします。

## 用途とスコープ

- **用途**: デモ、プロトタイプ、社内検証、ユーザーインタビュー用モック。本番プロダクトでの利用は想定していません。
- **利用者**: PdM・デザイナー・エンジニアが AI コーディングツールに指定して使います。人が直接 import して使うこともできます。
- **v1 の範囲**: テーマ 3 種、猫耳アイコン基盤、画面が組める中核部品 36 種、AI 向け提供物（ガイド・skills・lint）、配布（GitHub / npm / shadcn registry / デモサイト）。
- **v1.1**: SearchCombobox（サジェスト＋複数選択）と DataGrid（TanStack Table v9 ベース）。実装済み。

## 技術構成

Next.js 16（デモサイト、静的書き出し）/ React 19 / TypeScript / Tailwind CSS v4 / shadcn（copy-in）/ radix-ui / Storybook 10 / Vitest 4 / Biome / pnpm 10

```text
tokens/  themes/  icons/     … 見た目の唯一の正（JSON / SVG）。ビルドで CSS・TS を生成する
src/components/ui/<name>/   … 部品（index / stories / test / README / item.json の 5 点セット）
src/components/theme/       … NekoThemeProvider / NekoThemePicker / NekoHead
docs/ai/  docs/guidelines/  skills/  … AI が読む「使い方のルール」と skills
scripts/                    … ビルド・検査スクリプト、Claude Code hooks
```

## 開発

```bash
pnpm install
pnpm dev              # デモサイト
pnpm storybook        # Storybook
pnpm test             # Vitest（unit + storybook）
pnpm lint             # Biome + import 検査
pnpm typecheck
pnpm build            # Next.js 静的書き出し
pnpm check            # nekodemo check（役割トークン以外の色などを検出）
pnpm build:package    # ライブラリを dist/ に出力（npm 配布物）
pnpm build:registry   # shadcn registry を public/r/ に出力
pnpm pack:test        # npm pack → 一時プロジェクトで import / CSS / bin を検証
```

開発時の指示（AI 向け）は [`AGENTS.md`](AGENTS.md) にまとめています。各フェーズの完成条件は実装計画を参照してください。

## ロードマップ

| Phase | 内容 | 状態 |
|---|---|---|
| 0 | 土台（Next.js / Tailwind / Storybook / Vitest / Biome / CI / hooks） | 完了 |
| 0.5 | 実装前ビジュアルプレビュー（36 部品 × 3 テーマ）とフィードバック反映 | 完了 |
| 1 | トークン（3 層構造、Tailwind 既定パレットの無効化、shadcn 変数ブリッジ） | 完了 |
| 2 | テーマ 3 種（JSON Schema、コントラスト検査、ランタイム切替） | 完了 |
| 3a | 猫耳アイコン基盤（自動耳、フォールバック、カタログ） | 完了 |
| 3b | 専用に描く猫耳アイコン（T1）のパイプライン（プロンプト 70 件・ベクター化・検査）と手動耳 | ツール完了。画像生成とレビューは人（H3 / H4） |
| 4 | 中核部品 36 種、`nekodemo check`、4 画面型のサンプル | 完了 |
| 5 | AI 向け提供物（ガイド・skills・lint）、配布（registry / npm / デモサイト） | 完了（npm 公開は人の承認待ち） |
| 6 | v1.1（SearchCombobox、DataGrid） | 完了 |
| 7 | v1.2（InputNumber、InputDate、InputTime、InputFile、SegmentedControl、Stepper、FilterChip、Progress、DescriptionList、Accordion、PageHeader。ガイドラインの解剖図・状態・寸法・推奨例） | 進行中 |

## 参考にしたもの・ライセンス

- 本プロジェクトは、[Sparkle Design](https://sparkle-design.goodpatch.com/) の公開ガイドライン（トークン階層・部品仕様・提供方法の考え方）を参考にした**独立したプロジェクト**です。Sparkle Design のガイドライン本文・図・アイコン・コードは含んでおらず、名称も使用していません。
- 部品の実装は [shadcn/ui](https://ui.shadcn.com/)（MIT）を土台にしています。アイコンの名前体系とフォールバックには [Material Symbols](https://fonts.google.com/icons)（Apache-2.0）を使います。
- nekodemo 自体は MIT ライセンスです（[`LICENSE`](LICENSE)）。利用しているオープンソースと Google Fonts の一覧は [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) にあります。
