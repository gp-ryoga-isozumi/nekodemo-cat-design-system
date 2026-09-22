# nekodemo 実装計画 v0.1

> 元文書: `prompt/NEKODEMO_DESIGN.md`（設計書 v0.1）
> 作成日: 2026-09-21 ／ 作成者: Claude Code ／ 状態: **ドラフト（Phase 0 着手承認待ち）**
>
> 設計書 §15 の「各フェーズ着手前に計画を提示し、承認を得てから実装する」に従い、
> 本書はフェーズごとの作業項目・順序・検証ポイント・判断が必要な点を定義する。
> 各フェーズの着手時には本書の該当節を再提示し、必要なら更新する。

---

## 0. 現状と前提

### 0.1 リポジトリの状態（2026-09-21 確認）

- ディレクトリは空（`prompt/NEKODEMO_DESIGN.md` と `.DS_Store` のみ）。git 未初期化。
- `create-next-app` は空でないディレクトリを拒否するため、Phase 0 は **手動スキャフォールド**（`package.json` 等を直接作成）で行う。

### 0.2 ローカル環境【事実】

| ツール | 版 | 備考 |
|---|---|---|
| node | 24.12.0 | `engines.node >= 22` とする |
| pnpm | 10.20.0 | `packageManager` フィールドに固定 |
| npm | 11.6.2 | |
| git | 2.50.1 | |
| gh | 2.90.0 | `gh skill` の要件（2.90 以上）を満たす |
| python3 | 3.14.7 | VTracer の pip 版が 3.14 に対応しているかは要確認 |
| cargo / vtracer | **未導入** | Phase 3b で導入経路を決める（§3b） |

### 0.3 npm 最新版【事実: `npm view`、2026-09-21】

設計書 §3.2 の版と一致。設計書で【未確認】だったものも存在を確認した。

| パッケージ | 版 | 用途 |
|---|---|---|
| next / react | 16.3.5 / 19.3.0 | デモサイト・ライブラリ |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | |
| shadcn | 4.21.0 | copy-in・registry build |
| radix-ui | 1.6.7 | 統合パッケージ |
| culori | 4.0.2 | oklch→sRGB・コントラスト（§7.6 未確認 → 存在確認済） |
| svg-path-bbox | 2.1.0 | 自動耳の外接矩形（§8.5 未確認 → 存在確認済） |
| @material-symbols/svg-500 | 0.47.4 | T2 の元 SVG（パス構成は Phase 3a で確認） |
| sharp | 0.35.4 | audit のラスタライズ |
| ajv | 8.20.0 | テーマ JSON Schema 検証 |
| @tanstack/react-table / react-virtual | 9.2.4 / 3.14.13 | v1.1 |
| @mui/material | 9.4.0 | v1.1 useAutocomplete |
| @visioncortex/vtracer | 1.0.0-alpha.4 | **alpha**。採用は慎重に |
| storybook | 10.6.0 | |
| vitest | 5.0.1 | |
| @biomejs/biome / eslint | 2.5.14 / 10.11.0 | Phase 0 で選択 |
| sonner / class-variance-authority / tailwind-merge | 2.0.8 / 0.7.1 / 3.7.0 | |

---

## 1. 全体方針（設計書からの補強点）

設計書のフェーズ構成（0→1→2→3→4→5→6）は維持する。実装の観点から次の 7 点を補強する。

| # | 補強 | 理由 |
|---|---|---|
| A1 | **Phase 3 を 3a（Icon 部品・T2・T3・カタログ）と 3b（T1 の AI 生成パイプライン）に分割**し、3b は人の作業（画像生成・レビュー）を含む並行トラックにする | T1 60 個は画像生成サービスの選定・規約確認・人のレビューに依存し、AI 単独で完了できない。Phase 4 が必要とするのは Icon 部品と T2/T3 だけ |
| A2 | **`nekodemo check` の中核（NK001〜NK007）を Phase 4 の冒頭に前倒し**する | 36 部品を書きながら lint で自分を検査できる。Phase 4 完成条件「`pnpm check` が 0 件」の前提でもある |
| A3 | **中間マイルストーン M1** を Phase 4 の途中に置く: 中核 12 部品＋check＋最小の `USING_NEKODEMO.md` が揃った時点で、新規プロジェクトで「一覧画面」を AI に作らせる小さな受け入れテストを 1 回行う | 36 部品を作り切る前に「AI が少ないトークンで使える」というループ全体を検証し、土台の問題を早く見つける（C5 の再発防止） |
| A4 | Tailwind の名前空間リセットに伴う **shadcn 互換の追加ブリッジ** を §6.3 に加える: `--shadow-xs/sm/md/lg`（→ raise/float/popout）、`--font-weight-normal: 400` / `--font-weight-bold: 700` の再定義のみ | `--shadow-*: initial` と `--font-*: initial` で shadcn 部品が使う `shadow-xs` や `font-bold` も消える。ウェイトは 400/700 だけ再定義することで `font-semibold` を**構造的に存在させない**（D7 と同じ思想）。Phase 1 のスパイクで確認する |
| A5 | Stop hook は **`stop_hook_active` を読む小さなラッパースクリプト**にする | check が直せない場合に無限ループする。1 度目はブロック（exit 2）、`stop_hook_active` が true のときは警告出力のみ（exit 0）にする |
| A6 | **Playwright を Phase 0 の toolchain に含める** | Phase 2 のスクリーンショット、Storybook の a11y／インタラクションテスト（Vitest browser mode）で必要 |
| A7 | ライブラリ配下（`src/components` `src/lib` `src/themes`）は **相対 import のみ**（`@/` を使わない）にし、`tsc-alias` を不要にする。README は JSDoc から `build:readmes` で生成する | ビルドの単純化。§9.2「README は JSDoc から自動生成」に対応するスクリプトが §14 に無かったので追加 |

### 1.1 人が判断・実行する項目（AI が代行できないもの）

| # | 項目 | 影響するフェーズ | 期限の目安 |
|---|---|---|---|
| H1 | GitHub の owner／org 名、公開 or 非公開、正式名称（D9） | Phase 0（remote / CI）、Phase 5（URL） | **決定済（2026-09-21）**: `gp-ryoga-isozumi/nekodemo-cat-design-system`、公開。npm 名は `nekodemo` のまま（設計書 D11） |
| H2 | lint／format の選択（Biome 推奨、後述） | Phase 0 | **決定済（2026-09-21）**: Biome |
| H3 | T1 用の画像生成サービスの選定と、生成物の商用利用・再配布可否の確認（§3.3 チェックリスト） | Phase 3b | 利用者が実施（2026-09-21 決定）。Phase 3b 開始前 |
| H4 | T1 60 個のレビュー（カタログで確認し採用／不採用を記録） | Phase 3b | v1 公開前 |
| H5 | Sparkle チーム・法務への確認（書面承諾）と、Goodpatch 公式か有志かの決定 | Phase 5（公開） | 利用者が実施（2026-09-21 決定）。npm 公開前 |
| H6 | Gemini CLI／Codex での受け入れテスト実行 | Phase 5 | v1 完成条件。手順は `docs/ai/ACCEPTANCE_TEST.md`。2026-09-22 時点で開発機に両 CLI が無く（認証も要る）、利用者の環境で実施する |
| H7 | `npm publish` / `gh release` の実行（`NEKODEMO_CONFIRM=1` を明示） | Phase 5 | 最後。2026-09-22: 名前 `nekodemo` は npm で未使用、`npm publish --dry-run` は通過（199 ファイル、209 KB）。開発機は npm 未ログインのため、`npm login` 後に `private: true` を外して実行する（H5 の後） |

### 1.2 Phase 0 で決める技術選択（推奨案つき）

| 項目 | 推奨 | 代替 | 理由 |
|---|---|---|---|
| lint / format | **Biome 2.x** | ESLint 10 + Prettier | 1 ツールで完結し高速。設定が少ない。欠点: `eslint-plugin-jsx-a11y` 等が使えないが、a11y は Storybook の a11y アドオンで検査する |
| Storybook framework | **`@storybook/nextjs-vite`**（Vitest アドオン＋a11y アドオン） | `@storybook/react-vite` | Next.js の `next/link` 等をそのままストーリーで使える |
| 単体テスト | Vitest 5 + Testing Library + jsdom。ストーリーは Vitest browser mode（Playwright chromium）で a11y 含めて実行 | jsdom のみ | a11y 違反 0 を CI で機械的に確認するため |
| ライブラリのビルド | `tsc -p tsconfig.build.json`（ESM + d.ts）、相対 import（A7） | tsup / tsdown | `"use client"` ディレクティブをそのまま残せて挙動が読みやすい |
| VTracer | `cargo install vtracer-cli`（Rust 導入）を第一候補。次点 `pip install vtracer`（Python 3.14 対応を確認） | npm `@visioncortex/vtracer`（alpha） | 公式 CLI が最も安定。Phase 3b でのみ必要なので Phase 0 では入れない |

---

## 2. フェーズ別の作業項目

凡例: 〔spike〕= 実装前に小さく検証して結果を設計書に追記する項目。〔人〕= 人の作業。

### Phase 0: 土台

目的: `pnpm dev` / `pnpm storybook` / `pnpm test` / `pnpm lint` / `pnpm build` が通り、AI 向け開発指示と不可逆操作ガードが入った状態。

| # | 作業 | 成果物 |
|---|---|---|
| 0.1 | `git init`、`.gitignore`（node_modules, .next, out, dist, public/r, public/storybook, icons/raw, icons/generated, coverage）、`.editorconfig`、`.nvmrc` | |
| 0.2 | 手動スキャフォールド: `package.json`（`packageManager: pnpm@10.20.0`、`engines`、§14 のスクリプト名を先に全部並べる）、`tsconfig.json`、`next.config.ts`（`output: "export"`、`basePath` は環境変数で切替）、`postcss.config.mjs`、`src/app/layout.tsx` / `page.tsx`、`src/styles/globals.css` | Next.js 16 + React 19 + TS + Tailwind 4 が起動 |
| 0.3 | `pnpm dlx shadcn@latest init` 相当の `components.json`（`rsc: true`、`tsx: true`、alias は `@/`。ただしライブラリ側は相対 import）、`src/lib/utils.ts`（`cn`）、`radix-ui` / `class-variance-authority` / `clsx` / `tailwind-merge` 導入 | |
| 0.4 | Storybook 10（`@storybook/nextjs-vite`、a11y アドオン、Vitest アドオン）。出力先 `public/storybook`。`.storybook/preview.tsx` に `globals.css` を読み込む | `pnpm storybook` |
| 0.5 | Vitest 5 + Testing Library + jsdom。`vitest.workspace` で unit（jsdom）と storybook（browser/Playwright）を分ける。`pnpm exec playwright install chromium` | `pnpm test` |
| 0.6 | lint / format（H2 の決定に従う）。ライブラリ配下で `@/` import を禁止するルールを入れる（A7） | `pnpm lint` / `pnpm format` |
| 0.7 | `tsconfig.build.json`（`src/components`, `src/lib`, `src/themes`, `src/index.ts` → `dist/`）と `build:package` の骨組み | `pnpm build:package` が空でも通る |
| 0.8 | `AGENTS.md`（ビルド手順・規約・禁止事項・不可逆操作の扱い）、`CLAUDE.md` / `GEMINI.md` → `AGENTS.md` へのシンボリックリンク | |
| 0.9 | `.claude/settings.json`（PreToolUse: `scripts/hooks/irreversible-ops-guard.sh` で `npm publish` / `gh release create` / `git push --tags` / `--force` を exit 2 でブロック、`NEKODEMO_CONFIRM=1` 前置時のみ許可）。Stop hook（`pnpm check`）は Phase 4 で check ができてから有効化 | |
| 0.10 | `scripts/new-component.sh <name>`（`index.tsx` / `index.stories.tsx` / `index.test.tsx` / `README.md` / `item.json` の雛形） | |
| 0.11 | `.github/workflows/ci.yml`（install → lint → typecheck → test → build → check → check:contrast）、`pages.yml`（registry + storybook + next export → GitHub Pages）。remote が無い間はローカルで `act` 等は使わず、YAML の静的検証のみ | |

完成条件（設計書 §15 と同じ）: 5 コマンドがローカルで通る。CI は remote 作成後（H1）に緑を確認。

Phase 0 の実施メモ（2026-09-21）:

- TypeScript は 7.0.2（Go 実装）で `next build` / `tsc --noEmit` / `tsc -p tsconfig.build.json` が動作した。問題が出たら 5.9 系に固定する。
- Vitest は `@storybook/addon-vitest` の peer（`^3 || ^4`）に合わせて 4 系に固定した。
- Storybook init が追加した Chromatic / MCP アドオンとサンプルストーリーは削除した。`storybook skills setup` は実行していない。
- 不可逆操作ガードは Node 実装（`scripts/hooks/irreversible-ops-guard.mjs`）にし、コマンド位置（行頭、`&&` `||` `;` `|` の直後）でのみ判定する。Vitest でテストする。heredoc に Markdown 表を書くと `|` で分割されて誤検知するので、そのようなファイルは Write ツールで書く。
- `next dev` が AGENTS.md の末尾に `nextjs-agent-rules` ブロックを自動追記する（Next.js 16.3 の仕様）。有用なので残す。

### Phase 0.5: ビジュアルプレビュー（利用者の要望で追加、2026-09-21）

目的: 具体的な部品を実装する前に、作成予定の 36 部品の見た目と 3 テーマの違いを利用者が確認できるようにする。フィードバックを Phase 1〜2 のトークン・テーマ JSON の初期値と Phase 4 の部品仕様に反映する。

| # | 作業 | 成果物 |
|---|---|---|
| 0.5.1 | 設計書 §6〜§9 の初期案（パレット・角丸・フォント・部品一覧）をそのまま使い、`[data-neko-theme]` → `--nk-p-*` → 役割トークンという本番と同じ CSS 変数構造で、ビルド不要の単一 HTML を書く | `docs/preview/index.html` |
| 0.5.2 | 内容: テーマ切替（3 匹の顔）、36 部品のカタログ（variant・size・状態）、猫耳アイコンの例、マスコット 3 体、4 画面型のうち「A. 一覧」のサンプル、3 テーマ横並び比較 | 同上 |
| 0.5.3 | Artifact として公開し、利用者に URL を渡す。フィードバックを設計書（【初期案】の値）と本計画に反映する | レビュー結果 |

完成条件: 利用者が 3 テーマの見た目と部品一覧を確認し、変更点が設計書に反映されている。プレビュー HTML は実装の参考であり、Phase 4 以降は Storybook が正になる。

フィードバック 1 回目（2026-09-21、反映済み。設計書 D12〜D14）:

- ロシアンブルーをダーク scheme に（黒に近い青灰の地、銀青の主ボタン）。テーマ JSON に `scheme`、`semantic.map.json` に `light` / `dark` の 2 組、`color-scheme` の出力 → Phase 1〜2 の要件に追加。
- Checkbox のチェックと Avatar フォールバックは猫の顔の塗りつぶし（`cat_face` アイコン。3 回目のフィードバックで肉球から変更）→ Phase 3a（`cat_face` を nekodemo 独自アイコンとして登録）と Phase 4（Checkbox / Avatar）の要件に追加。Badge は 4 回目のフィードバックで通常の丸に戻した（猫要素なし）。
- 猫耳は本体と同じ線幅 2 の中抜き三角（3 回目のフィードバックで参考画像に基づき決定。設計書 D14）→ Phase 3a の `ear.svg` と `add-ears.mjs` の規約に反映。`add-ears.mjs` は Material Symbols の塗りパスに対して、輪郭上の付け根 2 点を求めて 2 辺の線（太さ 2 相当の塗り）を合成する。`docs/preview/index.html` の 19 個の耳座標を実装時の参考にする。
- 役割トークンの追加（`text-primary` `text-info/success/warning` `surface-input` `surface-disabled` `surface-primary-subtle-hover`）とステータス色 50〜900 の全段階 → Phase 1 の `tokens/*.json` に反映。

フィードバック 2 回目（2026-09-21、反映済み。設計書 D15）:

- フォントを 3 テーマ共通（Zen Maru Gothic / Noto Sans Mono）に → Phase 2 のテーマ JSON 3 つの `fonts` を同じ値にし、`NekoHead` が出すフォント `<link>` を重複なく 2 ファミリーにまとめる。

### Phase 1: トークン

目的: Tailwind 既定パレットが消え、nekodemo のトークンだけがユーティリティになる状態を、生成スクリプトとテストで固定する。

| # | 作業 | 成果物 |
|---|---|---|
| 1.0 | 〔spike〕最小 CSS で `@theme { --color-*: initial; --text-*: initial; --font-*: initial; --radius-*: initial; --shadow-*: initial; }` ＋ `@theme inline { --color-primary-600: var(--nk-color-primary-600); … }` を `@tailwindcss/node` でコンパイルし、`bg-primary-600` / `text-text-high` / `rounded-action` / `text-3` / `font-bold` が生成され、`bg-blue-500` / `font-semibold` / `text-[13px]` 以外の既定クラスが生成されないことを確認する。**`--font-*: initial` が `--font-weight-*` を消すかどうか**（A4）を必ず確認し、結果を設計書 §6.2 の【未確認】に追記 | `scripts/__tests__/tailwind-reset.spec.ts` |
| 1.1 | `tokens/primitives.json`: ステータス色 4 系統 × 50〜900（全テーマ共通、oklch）、角丸段階 none/xs/sm/md/lg/xl/2xl/3xl = 0/2/4/6/8/12/16/24px、影 raise/float/popout（`--nk-p-shadow-tint` を参照）、タイポ 12 段階（§6.2 の値） | |
| 1.2 | `tokens/semantic.map.json`: §6.1 の役割トークン一覧（text 9 / surface 15 / border 6 / object 6）→ セマンティック参照 | |
| 1.3 | `tokens/shadcn-bridge.json`: §6.3 の表 ＋ A4 の追加（shadow 別名、font-weight 400/700、`--radius-sm/md/lg/xl` の算出、`--text-xs..4xl` 別名、`--sidebar-*`、`--chart-1..5`） | |
| 1.4 | `scripts/build-tokens.mjs` → `src/styles/tokens.css`（§6.2 の 4 ブロック ＋ `@layer base`）。先頭に「生成物・手編集禁止」コメント | `pnpm build:tokens` |
| 1.5 | `src/styles/globals.css`: `@import "tailwindcss"; @import "./tokens.css"; @import "./themes.css";`（themes.css は Phase 2 まで暫定の `:root` プリミティブを置く） | |
| 1.6 | テスト: tokens.css のスナップショット、コンパイル後 CSS に対する存在／非存在アサーション（1.0 のスパイクを正式テスト化） | |
| 1.7 | デモサイト `/tokens`: 役割トークンのスウォッチ、タイポ段階、角丸、影の一覧 | |

完成条件（§15）: 最小ページで各クラスが効く。`bg-blue-500` が生成されないことがテストで固定されている。

Phase 1 の実施メモ（2026-09-21）:

- 1.0 のスパイク結果: 組み合わせは動作する。ただし `--font-*: initial` は `--font-weight-*` を消さないため `--font-weight-*: initial` を追加した（設計書 §6.2 に反映）。
- 生成物の同期テスト（`scripts/build-tokens.test.mjs`）を置き、`pnpm build:tokens` の実行忘れを CI で検出する。
- Storybook の a11y 検査（`test: "error"`）が `text-low`（neutral-500 = L 0.60）の白地コントラスト不足（3.94:1）を検出した。暫定 themes.css で 0.53 に下げ、Phase 2 の全テーマ JSON にも同じ方針を適用する。
- `themes.css` は Phase 1 では三毛のプリミティブだけの暫定手書き。Phase 2 で生成物に置き換える。

Phase 0.5 のプレビューで判明した Phase 1 への要件（2026-09-21）:

- セマンティック層・役割層（`--nk-color-*` 等）は `:root` だけでなく `:root, [data-neko-theme]` に定義する。CSS 変数の `var()` は定義元の要素で解決されるため、`:root` だけに置くと、子要素に `data-neko-theme` を付けてもプリミティブの差し替えが役割層に伝わらない（3 テーマ並列比較や Storybook の横並びで必要）。`build-tokens.mjs` の出力セレクタに反映する。

### Phase 2: テーマ 3 種

目的: `data-neko-theme` の切替で全部の色・角丸・フォントがリロードなしで変わり、3 テーマとも WCAG コントラストをビルドで保証する。

| # | 作業 | 成果物 |
|---|---|---|
| 2.1 | `themes/neko-theme.schema.json`（JSON Schema 2020-12、§7.2 の制約: id 形式、mood 語数、palette 10 段階、radius 4 用途、fonts に 400/700 必須） | |
| 2.2 | `themes/calico.json` / `american-shorthair.json` / `russian-blue.json`（§7.2 の初期案） | |
| 2.3 | `scripts/check-contrast.mjs`（culori 4 の `wcagContrast`、§7.6 の 8 ペア × 3 テーマ。不合格ペアと比を表示して exit 1） | `pnpm check:contrast` |
| 2.4 | `scripts/build-themes.mjs`: Schema 検証（ajv）→ semantic.map + overrides で役割解決 → コントラスト検査 → `src/styles/themes.css`（既定テーマを `:root` に併記、実値のみ）→ `src/themes/registry.ts` → `src/components/theme/NekoHead.tsx`（全テーマのフォント `<link>` ＋ preconnect ＋ Material Symbols Rounded ＋ persist 用 inline script）。フォント URL の HEAD 検証（`--skip-font-check` で無効化可） | `pnpm build:themes` |
| 2.5 | 初期案パレットを検査が通るまで調整し、**結果をテーマ JSON に反映**（設計書の指示）。調整した値と理由を設計書 §7.2 に追記 | |
| 2.6 | `NekoThemeProvider`（約 60 行、外部依存なし、`persist` で localStorage）、`useNekoTheme`、`NekoThemePicker`（`faces` / `menu`。顔アイコンは Phase 4 のマスコットと同じ形の簡易 SVG） | `src/components/theme/` |
| 2.7 | Storybook: `globalTypes.nekoTheme` ツールバー ＋ `html` に属性を付けるデコレータ | |
| 2.8 | デモサイト: ヘッダーに `NekoThemePicker`、`/themes` ページ（3 テーマの mood・フォント・パレット） | |
| 2.9 | Playwright スクリプトで `/tokens` と `/themes` を 3 テーマ分撮影 → `docs/screenshots/` | `pnpm screenshots` |
| 2.10 | テスト: Schema 検証（不正 JSON で失敗する）、コントラスト（3 テーマ合格）、Provider（属性設定・persist）、registry.ts のスナップショット | |

完成条件（§15）: 3 テーマ合格、切替で全体が変わる、スクリーンショットが保存されている、フォント URL 検証が通る。

Phase 2 の実施メモ（2026-09-21）:

- コントラスト検査は 25 ペア × 3 テーマ全合格（`pnpm check:contrast`）。初期案から neutral-400（L 0.63）・neutral-500（L 0.53）を下げ、dark の `text-placeholder` を neutral.400 に、`text-on-negative` 役割を追加した。
- テーマブロックは役割層一式を実値で書く方式にした（既定テーマが `:root` に併記されるため。設計書 §7.3 を更新）。
- `NekoHead` / `registry.ts` / `themes.css` は生成物。同期テスト（`scripts/build-themes.test.mjs`）で実行忘れを検出する。フォント URL は Google Fonts へ実際に取得して検証（`--skip-font-check` で省略可）。
- Mascot（3 体）は Phase 4 予定だったが NekoThemePicker が必要とするため前倒し。色は役割トークン・アクセントだけで描き、自分に `data-neko-theme` を付けて常に自分の毛色で表示する（ネストしたテーマ切替の実例）。
- Storybook のテーマ切替ツールバーは `NekoThemeProvider` を `key` 付きで包み直す方式。
- Vitest は globals を使わないため Testing Library の自動 cleanup が効かず、`vitest.setup.ts` で `afterEach(cleanup)` を入れた。
- `docs/screenshots/` に home / tokens / themes × 3 テーマの 9 枚を保存（`pnpm build && pnpm screenshots`）。

### Phase 3a: アイコン基盤（Phase 4 の前提）

目的: `<Icon icon="search" />` が T1 → T2 → T3 の順で解決され、部品内部で使うアイコンの T3 が 0 件になる。

| # | 作業 | 成果物 |
|---|---|---|
| 3a.1 | 〔spike〕`@material-symbols/svg-500` のパス構成（`rounded/<name>.svg`、fill 版の命名）を確認し設計書 §8.5 に追記。パスの拡縮に `svgpath`（npm）が必要かを確認 | |
| 3a.2 | `icons/wanted.txt`（T1 候補 60 ＋ 一般的な UI アイコン 200 の名前と一行説明）、`icons/manifest.json`（`ears: "none"` の名前: 矢印・シェブロン・チェック・×・＋・−・ハンドル・メニュー・展開／折りたたみ） | |
| 3a.3 | `icons/ear.svg`（§8.3 の標準耳: 底辺 5・高さ 4.5・頂点丸み 0.75・外側 15°） | |
| 3a.4 | `scripts/icons/add-ears.mjs`（bbox → 耳配置 → 必要なら本体 0.85 倍 → evenodd で 1 path に結合 → `icons/generated/<name>.svg`） | `pnpm build:icons`（`icons:ears` は統合） |
| 3a.5 | `scripts/icons/build-icons.mjs`（`icons/src` が `icons/generated` より優先 → `src/components/ui/icon/icons.generated.ts` ＋ `icons/status.json`） | `pnpm build:icons` |
| 3a.6 | `Icon` 部品（§8.2 の props。T1/T2 は inline SVG、T3 は Material Symbols Rounded の `span` ＋ 開発時 `console.warn`）。`NekoHead` に Material Symbols のフォント link を追加 | `src/components/ui/icon/` |
| 3a.7 | `scripts/icons/list-used-icons.mjs`（`icon="..."` を抽出し wanted.txt と差分表示） | `pnpm icons:list` |
| 3a.8 | Storybook「Icon Catalog」: T1 / T2 / Material 原版を並べ、12 / 16 / 24 / 48px で表示。tier・レビュー者・日付を manifest から表示 | |
| 3a.9 | テスト: Icon の描画（既知名 → svg、未知名 → span、`label` 有無で aria）、add-ears の固定入力に対するスナップショット、耳なしリストの尊重 | |

完成条件: 部品内部（Phase 4 完了時点で再確認）の T3 が 0 件。audit は 3b で。

Phase 3a の実施メモ（2026-09-21）:

- `@material-symbols/svg-500` 0.47.4 は `rounded/<name>.svg` / `<name>-fill.svg`、viewBox `0 -960 960 960` の塗りパス（設計書 §8.5 に反映）。
- 自動耳は「本体を 0.8 倍に縮小して下げる → sharp でラスタライズ → 列ごとの最上端から上辺を検出 → 付け根 2 点＋頂点」の手順で、311 名中 T1 1 / 自動耳 138 / 耳なし規約 159 / 耳を置けず 13。耳を置けない形（`badge` `cake` `call` `pets` 等、上辺が狭い）は `status.json` に理由つきで記録し、T1 の候補にする。
- `icons/ear.svg` は作らない（耳は手順的に生成するため）。`add-ears.mjs` の定数（幅 3.6 / 高さ 4.6 / 傾き 0.3 / 上辺の帯 3）が規約の正。
- Material Symbols に無い名前 18 個（`expand_more` `place` `phone` 等）は `icons/manifest.json` の `aliases` で現行名に対応付けた。`Icon` は別名でも引ける。
- `icons.generated.ts` は約 350KB（fill 版を含む）。設計書の見積もり（60〜100KB）を超えたため、v1.2 の名前付き import 版を優先度高にする。
- `pnpm icons:list` が部品内で使うアイコン名を抽出し、猫版が無いものがあれば exit 1（Phase 4 完成条件の検査）。

### Phase 3b: T1（AI 生成 → ベクター化）〔並行トラック・人の作業を含む〕

| # | 作業 | 担当 |
|---|---|---|
| 3b.1 | VTracer 導入（§1.2 の推奨順）。`scripts/icons/vectorize.mjs`（VTracer → svgo → (2,2)〜(22,22) に正規化 → `currentColor`） | AI |
| 3b.2 | `scripts/icons/audit.mjs`（viewBox、path ≤ 3、sharp で 24px ラスタライズし塗り面積比が T2 中央値 ±30%、耳が y ≤ 6 帯に 2 連結成分、16px でも分離） | AI |
| 3b.3 | `icons/prompts/<name>.md` を wanted.txt の T1 候補 60 個分生成（§8.4 のテンプレート。モデル名・日付欄つき） | AI |
| 3b.4 | 画像生成サービスの選定と規約確認（H3） | 〔人〕 |
| 3b.5 | 60 枚生成 → `icons/raw/` → vectorize → audit → カタログでレビュー → 採用分を `icons/src/` にコミットし manifest に tier / reviewer / date を記録（H4） | 〔人〕＋AI |

完成条件: audit 全件合格、T1 60 個レビュー済み。**T1 が間に合わない場合は T2 を基準として v1 を出せる**（設計書 §8.1 の「T2 を統一基準にする」判断に基づく）。可否は H4 の進捗を見て利用者が決める。

Phase 3b の実施メモ（2026-09-22、AI 側の作業は完了。3b.4 / 3b.5 は人）:

- 3b.1 `scripts/icons/vectorize.mjs`（`pnpm icons:vectorize <name>`）: sharp で 2 値化 → VTracer → svgo（convertPathData / mergePaths）→ 外接矩形を (2,2)〜(22,22) に等倍で収める → `icons/src/<name>.svg`。VTracer は CLI（`cargo install vtracer-cli`）があればそれ、無ければ Python パッケージ（`python3 -m venv .venv && .venv/bin/pip install vtracer`、`VTRACER_PYTHON` で指定可）。**Python 3.14 の vtracer 0.6 はキーワード引数を渡すと segfault する**ため既定値で再試行する（Python 3.9 では引数指定が通ることを確認）。T2 の `search` を 1024px にラスタライズした合成画像で通し試験し、audit (a)〜(e) に合格。
- 3b.2 `scripts/icons/audit.mjs`（`pnpm icons:audit [name]`）: (a) viewBox、(b) path ≤ 3、(c) 24px の塗り面積比が T2（`icons/generated/` の auto-ear / manual-ear）の中央値 ±30%（現在の中央値 21.9%）、(d) y ≤ 6 の帯の連結成分が 2、(e) 16px でも 2。`manifest.nekodemo` のシルエット（cat_face）は (c) を外す。
- 3b.3 `scripts/icons/gen-prompts.mjs`（`pnpm icons:prompts`）: 「基本操作」「一覧・整理」「ファイル・データ」「コミュニケーション」の節（耳なし規約を除く）＋ 手動耳 3 つ = 70 件を `icons/prompts/<name>.md` に生成（モデル・日付・規約確認の記入欄つき。記入済みは上書きしない）。
- 追加: 自動耳が置けなかった 13 個のうち、上辺に相当する部分がある 3 個（badge / cake / cloud_download）は `icons/manual-ears.json` に手で座標を置いた（tier `manual-ear`。`pnpm icons:inspect <name>` で 24 グリッド付き PNG と上辺プロファイルを出して決めた）。残り 10 個（call / category / cruelty_free / park / password / pets / query_stats / restaurant / volume_off / volume_up）は頭に相当する上辺が無いので耳なし規約に入れ、理由を `manifest.earlessNotes` に記録。これで「耳を置けず」は 0。
- `scripts/icons/icons.test.mjs` で手動耳・audit・vectorize（純粋関数と、VTracer がある環境だけの通し）・プロンプト生成を検査する。

### Phase 4: 部品 36 ＋ check の中核

目的: 「一覧 → 詳細 → 編集フォーム → 設定」の 4 画面型が 3 テーマで崩れずに組める。

| # | 作業 | 成果物 |
|---|---|---|
| 4.0 | **`scripts/check/`（NK001〜NK007、テキスト出力、`--strict`）を先に作る**（A2）。`pnpm check` を CI と Stop hook に登録 | `pnpm check` |
| 4.1 | バッチ A（依存なし）: Spinner（毛糸玉 SVG アニメ）、Skeleton、Divider、Badge、Tag、Avatar（猫シルエット）、Link（外部は耳付き `open_in_new`）、Tooltip、Card | 9 部品 |
| 4.2 | バッチ B（操作・フォーム）: Button（loading → Spinner、5 variant × 3 size）、IconButton（`label` 必須）、Input（32/40/48）、InputPassword、InputSearch、Textarea（カウンタ）、Select、Checkbox（耳付き check）、Radio、Switch、Slider、Form（react-hook-form + zod、ラベル／補足／エラー配置固定） | 12 部品 |
| **M1** | **中間マイルストーン**: 4.0〜4.2 ＋ EmptyState ＋ Table ＋ Toast ＋ InlineMessage ＋ Dialog を先行実装し、最小の `docs/ai/USING_NEKODEMO.md` を書いて、新規 Next.js プロジェクトで「案件一覧（4 状態つき）」を Claude Code に作らせる小テストを 1 回行う。結果を設計書に追記し、部品 API・ガイド・check を調整してから残りに進む | 検証レポート |
| 4.3 | バッチ C（フィードバック・オーバーレイ）: Toast（sonner）、InlineMessage、Popover、Menu、Dialog（確認専用、negative）、Modal、Drawer | 7 部品 |
| 4.4 | バッチ D（ナビ・データ）: Tabs、Breadcrumb（耳なし `chevron_right`）、Pagination（件数表示）、SideNavigation（240/64px 折りたたみ）、Table（xs 40 / sm 56 / md 80、数値 `font-mono` 右寄せ、縞・縦罫線なし）、EmptyState、Mascot × 3（幾何学的な簡易 SVG。後でデザイナーが差替可能） | 7 部品 ＋ 3 体 |
| 4.5 | 部品ごとの共通作業: `shadcn add` で copy-in → lucide → `Icon` 置換 → クラスを役割トークン名へ → JSDoc（概要／アンチパターン／使用例、日本語）→ story（全 variant・状態・a11y）→ test（表示・操作・disabled・アクセシブルネーム）→ `item.json`（`registryDependencies`、元 shadcn 版を記録）。`scripts/build-readmes.mjs` で README 生成（A7） | 36 × 5 ファイル |
| 4.6 | デモサイト: `/components` ギャラリー、`/samples/{list,detail,form,settings}`（4 画面型、4 状態の切替つき） | |
| 4.7 | `pnpm check` をリポジトリ自身に対して 0 件にする。Storybook a11y 違反 0 を CI で確認 | |

完成条件（§15）: 全部品に story・test・README・item.json。a11y 違反 0。check 0 件。4 画面型が 3 テーマで崩れない。

Phase 4 の実施メモ（2026-09-21）:

- 36 部品（§9.1 #1〜#36）を実装。Icon / Mascot / Theme は前フェーズ分を流用。追加した派生: Tag の StatusTag、Form の Field（静的版）、Skeleton の SkeletonRows、Pagination の pageItems。
- `nekodemo check`（scripts/check/）を Phase 4 の冒頭に実装し、`pnpm check` を CI と Claude Code の Stop hook（scripts/hooks/nekodemo-check-stop.mjs、stop_hook_active で無限ループ回避）に登録した。NK010 は画面（page.tsx / pages/*.tsx）だけを対象にした。
- stories / tests / item.json は Opus 5 のサブエージェント 6 体に分担（部品 index.tsx は Fable が実装）。README は `pnpm build:readmes` で JSDoc から生成する。
- 単体テスト 268 件、ストーリー（a11y を error で実行）232 件がすべて通過。`pnpm check` は error 0（warn 2 は Icon の T3 例示）。`pnpm icons:list` で部品内の T3 は 0 件。
- 検出した不具合: (1) tailwind-merge が `text-2` を色と誤判定して `text-text-on-primary` を落とす → `src/lib/utils.ts` で font-size / rounded / shadow を登録。(2) Radix Slot の asChild で子が複数だと例外 → Button / Link / SideNavItem を `Slot.Slottable` で包む。(3) FormControl の aria-describedby が存在しない id を指す → FormDescription の有無を context で伝える。(4) InputPassword / InputSearch の disabled が内側のボタンに伝わらない → 修正。
- デモサイトに 4 画面型のサンプル（/samples/list・detail・form・settings）と AppShell（SideNavigation）を追加。一覧と詳細は 4 状態を切り替えて確認できる。docs/screenshots に list / form を追加。
- shadcn 部品の取り込みは、shadcn CLI をスクラッチ用ディレクトリで実行して元コードを読み、役割トークン・Icon に置き換えて index.tsx を書き直す方式にした（`item.json` の meta.shadcnSource に元の名前を記録）。

### Phase 5: AI 提供・配布

| # | 作業 | 成果物 |
|---|---|---|
| 5.1 | `scripts/check/` の完成（NK008〜NK010、`--format json`、`manualChecks`）、`bin/nekodemo`。Stop hook ラッパー（A5） | |
| 5.2 | `docs/guidelines/01〜07.md`（§10.1〜10.7 の本文） | |
| 5.3 | `docs/ai/USING_NEKODEMO.md`（1 ファイル完結。部品一覧＋props 要約は型定義から抽出）、`SETUP.md`（Next.js / Vite の 2 通り、Claude Code / Cursor / Codex の hook 形式 〔spike: Cursor・Codex の hook 仕様を各公式ドキュメントで確認〕）、`GUARD_BLOCK.md`（§17.1） | |
| 5.4 | `skills/` × 5（frontmatter 必須、4 節構成、300 行以内）。`.claude/skills` `.agents/skills` `.codex/skills` `.cursor/skills` のシンボリックリンク | |
| 5.5 | `llms.txt`、`README.md`（先頭「AI に使わせるには」＋ §17.5 のプロンプト例）、`LICENSE`（MIT）、`THIRD_PARTY_NOTICES.md`、`CHANGELOG.md`、`nekodemo.config.json` | |
| 5.6 | `registry.json` → `pnpm build:registry`（`shadcn build`）→ `public/r/*.json`。`@nekodemo/theme` item（tokens.css + themes.css を `css` で配布） | |
| 5.7 | `build:package`: `dist/`、`styles.css` 結合、`ai/` コピー、`exports`（`.` / `./<component>` / `./styles.css` / `./themes/registry`）。`npm pack` → 一時的な Vite プロジェクトと Next.js プロジェクトに入れて `@source` 込みで動作確認 | |
| 5.8 | GitHub remote 作成・`pages.yml` デプロイ（H1） | 〔人〕＋AI |
| 5.9 | **受け入れテスト**: 新規 Next.js で「nekodemo を使って案件一覧・詳細・編集のプロトタイプを作って。テーマは三毛」→ (1) セットアップ完了 (2) 4 状態 (3) `check --strict` 0 件 (4) テーマ切替。Gemini CLI / Codex は H6 | |
| 5.10 | §3.3 公開前チェックリスト（H5）、`grep -ri sparkle` が README の参考表記だけであることを確認 | 〔人〕＋AI |
| 5.11 | `npm publish --dry-run` まで。実 publish は H7 | |

完成条件（§15）: 受け入れテスト合格 ＋ §3.3 チェックリスト完了 ＋ npm 公開。

Phase 5 の実施メモ（2026-09-22）:

- 5.1 は Phase 4 で完了済（NK001〜NK010、`--format json`、Stop hook）。`bin/nekodemo.mjs` は `scripts/check/index.mjs` を子プロセスで呼ぶ薄いラッパーで、npm 配布物には `scripts/check/{index,rules}.mjs` と `icons/status.json` をそのまま同梱する（`package.json` の `files`）。
- 5.3 / 5.4: `docs/ai/USING_NEKODEMO.md`（部品一覧と props の要約、役割トークン表、check のルール表、完成チェックリスト）、`SETUP.md`（Next.js / Vite、Stop hook、registry からの copy-in）、`GUARD_BLOCK.md`、skills 5 つ。`.claude/skills` `.agents/skills` `.codex/skills` `.cursor/skills` は `../skills` へのシンボリックリンク。
- 5.5: `llms.txt`（GitHub の絶対 URL と Pages の URL）、`LICENSE`（MIT）、`THIRD_PARTY_NOTICES.md`、`CHANGELOG.md`、README の「AI に使わせるには」（skills / USING_NEKODEMO.md / llms.txt の 3 経路と配布経路の表）。
- 5.6: `registry.json` は `src/components/ui/*/item.json` から `scripts/build-registry.mjs` が生成する（git 管理外）。`shadcn` CLI は devDependency に入れ `pnpm exec shadcn build --output public/r` で 40 項目を出力。部品以外の項目は `lib`（cn）/ `styles`（tokens.css と themes.css を `registry:file` で `styles/nekodemo-*.css` に置く）/ `themes`（registry.ts）/ `mascot` / `theme`（Provider / Picker / NekoHead）。設計書 §12 の「`css` / `cssVars` で配布」は、`@theme` のリセットや 3 テーマ分のブロックを JSON に変換すると利用側の CSS が読めなくなるため採用しなかった。`theme` ↔ `mascot` の循環は `themes` 項目を分けて解消。`scripts/build-registry.test.mjs` が item.json の依存と実際の import の一致・循環なし・参照ファイルの存在を検査する。
- 5.7: `tsc` は相対 import に拡張子を付けないため Node ESM でディレクトリ import（`./components/mascot`）が失敗した。`scripts/build-package.mjs` が `dist/**/*.js, *.d.ts` の相対 import を `.js` / `/index.js` に書き換える（45 ファイル）。`exports` は `.` / `./styles.css` / `./themes/registry` / `./ai/*` / `./package.json`。`./<component>` の個別エントリは v1 では提供しない（ESM で各ファイルに `"use client"` を保持しているのでツリーシェイクで足りる）。`react` / `react-dom` は peerDependencies、`next` は devDependencies へ移動。`scripts/pack-test.mjs`（`pnpm pack:test`、CI にも追加）が `npm pack` → 一時プロジェクトに install → 全 export の SSR 描画 / `@source` 込みの Tailwind コンパイル（既定パレットが出ないこと）/ `npx nekodemo check` の exit code / `dist/ai` と `skills` の同梱を検証する。tarball は 201 KB（展開後 837 KB、199 ファイル）。
- registry の copy-in は、新規 Next.js 16 プロジェクトで `shadcn init` → `components.json` に registries を登録 → `shadcn add @nekodemo/styles @nekodemo/theme @nekodemo/button @nekodemo/empty-state @nekodemo/table` → `next build` が通ることを確認した（ローカルの `public/r` を http.server で配信）。`shadcn init` が入れる既定の `components/ui/button.tsx` が `@/components/ui/button` の解決を奪うので、SETUP.md §8 と skill に削除手順を書いた。
- 5.8: `pages.yml` に `pnpm build:registry` を追加（`public/r` と `public/llms.txt` を `next build` の前に用意）。
- Claude Code Review（GitHub Actions）は PR #3〜#8 でレビューを飛ばしていた（4〜6 ターンで終了、コメントなし）。PR #9 で gh コマンドの許可と system prompt の補足、`show_full_output: true` を入れた。workflow 変更 PR ではレビューが走らない仕様のため Phase 5 の PR で確認したところ、真因はプラグイン本体がサブエージェントをバックグラウンド起動した直後に応答を終えることだった（anthropics/claude-code-action#1646）。PR #11 で `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` を settings で渡して同期実行にし、PR #10 でインラインコメント 2 件が付くことを確認した（所要 13 分）。
- 5.9 受け入れテスト（2026-09-22、Opus 5 のサブエージェントが利用側 AI として実施）: create-next-app の新規プロジェクトに tarball で導入し、skills の手順で一覧 / 詳細 / 編集の 3 画面（4 状態の切替つき）を作成。`pnpm nekodemo check src --strict` 0 件、`next build` 成功、3 画面が dev で 200。人手介入なし。指摘 12 件（D-1〜D-12）を反映: `useForm` / `zodResolver` / `z` を `nekodemo` から再 export（利用側で react-hook-form / zod が解決できず build が落ちた）、公開前の導入経路を Pages 上の tarball（`nekodemo.tgz`）に変更（`pnpm add github:` は dist が無く動かない）、テンプレート既定の CSS / page.tsx の置き換え手順、ガードブロックにウェイトと style 属性の行、Menu から開く Dialog の書き方、`Field` と欠けていた props の記載、NK010 が `generateStaticParams` 内の `.map` を誤検知していたのを JSX 式内だけに限定、`scripts/check/index.mjs` の直接実行判定を realpath に変更（pnpm のシンボリックリンク越しに無言終了していた）、`CLAUDE.md` が `@AGENTS.md` だけのときの扱い。ブラウザでのテーマ切替とキーボード操作の通し確認は未実施（静的には確認済み）。Gemini CLI / Codex での実施（H6）は利用者の環境で行う。
- 5.10 / 5.11（H5・H7）: `grep -i sparkle` は README / THIRD_PARTY_NOTICES / AGENTS の参考表記だけ（guidelines の引用 2 か所は自前の文面に書き換えた）。`npm publish --dry-run` は tarball を展開して `private` を外したコピーで実行し通過（npm 未ログインの警告のみ）。実 publish は H5 の後、利用者が `npm login` してから `NEKODEMO_CONFIRM=1` で実行する。GitHub Release（tag v0.1.0）も同時に行う。

### Phase 6（v1.1）: SearchCombobox・DataGrid

| # | 作業 |
|---|---|
| 6.0 | 〔spike〕TanStack Table v9 の API（`useReactTable` / row model / column sizing / pinning）を公式ドキュメントで確認し §9.4 に追記。`@mui/material/useAutocomplete` が emotion 無しで動くことを pnpm（strict peer）で確認 |
| 6.1 | DataGrid（§9.4 の ✅ 項目: ソート・列幅・ヘッダー固定・先頭列固定・選択・ページング・グローバル検索・列絞り込み・列表示切替・密度・4 状態・仮想化・行内操作） |
| 6.2 | SearchCombobox（§9.3: 単一／複数・サジェスト・freeSolo・groupBy・キーボード・Popover 表示・空表示・a11y）。フック呼び出しは 1 ファイルに閉じ込める（R5） |
| 6.3 | サンプル: 案件一覧（検索・絞り込み・ページング）を DataGrid ＋ SearchCombobox で再現 |

Phase 6 の実施メモ（2026-09-22）:

- 6.0 spike: TanStack Table は 9.2.4。v8 と API が大きく違う（`useTable({ features, columns, data }, selector)`、`tableFeatures({...})` に使う機能と row model（`createSortedRowModel()` 等）を明示登録、`table.FlexRender`、`filterFns` / `sortFns` の登録名が文字列オプションになる、`useLegacyTable` は v8 互換の非推奨 API）。公式サイトの migrating ページは 404 だったため、npm パッケージに同梱された skills（`node_modules/@tanstack/react-table/skills/*/SKILL.md`: getting-started / table-state / with-tanstack-virtual）と `.d.ts` を正にした。`@mui/material@9.4.0` は `@emotion/*` が optional peer で、pnpm の strict な node_modules でも `@mui/material/useAutocomplete` だけを import して動く（emotion 無しで確認）。
- 依存の扱い（設計書 §9.3 からの変更）: `@mui/material` / `@tanstack/react-table` / `@tanstack/react-virtual` は peerDependency ではなく通常の dependencies にした。`nekodemo` のバレル import（`import { Button } from "nekodemo"`）が DataGrid / SearchCombobox のモジュールを必ず評価するため、peer だと利用側が入れない限り import 自体が失敗する（Phase 5 の受け入れテストで react-hook-form が同じ理由で落ちた）。使わない部品は ESM のツリーシェイクで落ちる。
- 6.1 DataGrid: 状態は TanStack、描画は Table 部品（D5）。列定義は nekodemo 独自の薄い型 `DataGridColumn`（id / header / accessor / cell / numeric / size / filter）に絞り、TanStack の ColumnDef を利用側に見せない。数値列も「昇順 → 降順 → 解除」に揃えるため `sortDescFirst: false`。列の絞り込み（`filter: "select"`）はヘッダーの Popover に SearchCombobox（複数選択）を置き、`constructFilterFn` で作った `inList` で判定（TanStack の `arrIncludesSome` はセル側が配列である前提なので使えない）。仮想化は `@tanstack/react-virtual` で、`<tbody>` 内に余白の `<tr>` を置く方式（`Table` に `containerProps` を追加してスクロール要素を渡す）。行クリックでの遷移は付けない（`tr` にフォーカスを持たせるとキーボード操作と a11y ルールに反するため、セル内の Link と行末の操作で代替）。セル間の矢印移動（roving tabindex）は v1.2。
- 6.2 SearchCombobox: `useAutocomplete` のフック呼び出しは 1 ファイルに閉じ込めた（R5）。候補パネルは Radix Popover ではなく入力欄直下の絶対配置（Portal がフックのフォーカス管理と干渉するため）。ハイライト中の候補にはフックが `nk-focused` クラスを付けるので `[&.nk-focused]:bg-surface-well`（NK003 の除外コメント付き）で塗る。`groupBy` はフックがグループの連続を前提とするため、部品側でグループ順に並べ替える。
- 6.3 `src/app/samples/grid/page.tsx`（137 件、担当の絞り込みは SearchCombobox の複数選択、4 状態切替）。単体テスト: SearchCombobox 5 件、DataGrid 8 件（表示・操作・状態・行内操作・アクセシブルネーム）。Radix の DropdownMenu は jsdom ではクリックで開かないためテストはキーボードで開く。
- `Table` に `containerProps`、`TableHead.onSort` にイベント引数（Shift+クリックの複数列ソート）を追加。

---

## 3. 作業量の目安と順序

- 作業量の比率（概算）: Phase 0 = 1、Phase 1 = 1、Phase 2 = 2、Phase 3a = 2、Phase 3b = 2（人の作業を除く）、Phase 4 = 8、Phase 5 = 3、Phase 6 = 3。**Phase 4 が全体の約 4 割**。
- クリティカルパス: 0 → 1（spike 1.0 が最初）→ 2 → 3a → 4.0 → 4.1 → 4.2 → M1 → 4.3 → 4.4 → 5。
- 並行できるもの: Phase 3b（T1）は 3a 完了後いつでも。H1・H3・H5 は早めに着手できると後工程が詰まらない。
- 各フェーズ着手時に本書の該当節を再提示し、完了時に完成条件のチェック結果と、設計書へ追記した【未確認】の結果を報告する。

## 4. 設計書に追記が必要になる【未確認】項目の解消タイミング

| 設計書の箇所 | 内容 | 解消するフェーズ |
|---|---|---|
| §6.2 | `--color-*: initial` ＋ `@theme inline` の組み合わせ（＋ A4 の font-weight） | 1.0 |
| §7.2 | Google Fonts の各ファミリーが 400・700 を提供 | 2.4（HEAD 検証） |
| §7.6 | culori の版と API | 確認済（4.0.2、`wcagContrast`）。2.3 で API 使用を確定 |
| §8.5 | `@material-symbols/svg-500` のパス構成、bbox ライブラリ | 3a.1（svg-path-bbox 2.1.0 は存在確認済） |
| §3.3 / §8.4 | 画像生成サービスの規約 | 3b.4（人） |
| §9.4 | TanStack Table v9 の API 差分 | 6.0 |
| §11.4 | Cursor / Codex の hook 形式 | 5.3（SETUP.md §6 に記載。Claude Code は Stop hook、他は AGENTS.md のガードブロックの「作業の最後に check を実行する」で代替） |
| §14 | ESLint か Biome か | 0.6（H2） |

### ガイドラインサイト v2 の実施メモ（2026-09-22）

比較（PR #15 の Artifact）で「未整備」だった部品ページの節を埋めた。

- 選択肢・状態・寸法: `scripts/component-spec.mjs` が `index.tsx` を読む。cva の `variants` / `defaultVariants`、文字列リテラルのユニオン型 props（`density?: TableDensity`）と分割代入の既定値、`as const` の size 表（クラス文字列か px の数値）、Table の `data-density` ごとの行高、クラス接頭辞（`hover:` `focus-visible:` `disabled:` `aria-invalid:` `data-[state=…]`）から状態。テストは `scripts/component-spec.test.mjs`。
- 使い方: README の「推奨例」（Do）と「アンチパターン」（Don't）。両方あれば整備済み。
- 解剖図: `src/app/guidelines/_components/anatomy.tsx` に主要 10 部品（Button / Input / Select / Table / Dialog / Drawer / Card / Tabs / SideNavigation / DataGrid）の線画＋番号付き構成要素。役割トークンだけで描く。
- 振る舞い・内容・参考文献: `docs/guidelines/components/<slug>.md` の手書き（`## 振る舞い` `## 内容` `## 参考文献`）。全部品分。参考文献は WAI-ARIA APG / shadcn / Radix / Material 3 / MDN に限る。
- Patterns: 「サイドパネル」（`docs/guidelines/08-side-panel.md`、§10.9）。
- 整備状況の判定は `sectionStatus()`（`src/app/guidelines/_lib/content.ts`）に集約し、`content.test.ts` で Button が全節そろうことを確認する。

---

## 変更履歴

| 日付 | 版 | 内容 |
|---|---|---|
| 2026-09-21 | v0.1 | 初版。設計書 v0.1 を元にフェーズ別作業項目・補強点 A1〜A7・人の判断項目 H1〜H7 を定義 |
| 2026-09-21 | v0.1.1 | H1〜H3・H5 の決定を反映。Phase 0 実施メモと Phase 0.5（ビジュアルプレビュー）を追加 |
| 2026-09-21 | v0.1.2 | プレビューのフィードバック 1 回目（ダーク scheme、肉球、太い耳）を Phase 1〜4 の要件に反映 |
| 2026-09-21 | v0.1.3 | フィードバック 2 回目（フォント共通化）を Phase 2 の要件に反映 |
| 2026-09-21 | v0.1.4 | フィードバック 3 回目（中抜きの耳、猫の顔のチェック・バッジ）を Phase 3a / 4 の要件に反映 |
| 2026-09-21 | v0.1.5 | フィードバック 4 回目（Badge を通常の丸に戻す）を反映 |
| 2026-09-21 | v0.1.6 | Phase 1 の実施メモ（スパイク結果、a11y 検出）を追加 |
| 2026-09-21 | v0.1.7 | Phase 2 の実施メモを追加 |
| 2026-09-21 | v0.1.8 | Phase 3a の実施メモを追加 |
| 2026-09-21 | v0.1.9 | Phase 4 の実施メモを追加 |
| 2026-09-22 | v0.1.10 | Phase 5 の実施メモ（registry の項目構成、dist の import 書き換え、pack:test、copy-in の確認、Claude Code Review の修正）を追加 |
| 2026-09-22 | v0.1.11 | Phase 3b の実施メモ（vectorize / audit / prompts、手動耳、耳なし規約の追加）と H6 / H7 の記録 |
| 2026-09-22 | v0.1.12 | Phase 6 の実施メモ（TanStack Table v9 の API、依存の扱い、DataGrid / SearchCombobox の設計判断） |
| 2026-09-22 | v0.1.13 | ガイドラインサイト v2 の実施メモ（選択肢・状態・寸法の自動生成、解剖図、手書き節、サイドパネル） |
