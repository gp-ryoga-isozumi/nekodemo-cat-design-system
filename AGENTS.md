# AGENTS.md — nekodemo 開発時の AI 向け指示

このファイルは nekodemo **自体を開発する** AI（Claude Code / Gemini CLI / Codex 等）への指示。
`CLAUDE.md` と `GEMINI.md` はこのファイルへのシンボリックリンク。
nekodemo を**使って**プロトタイプを作る AI 向けのガイドは `docs/ai/USING_NEKODEMO.md`、導入手順は `docs/ai/SETUP.md`、skills は `skills/`。

## 1. まず読むもの

| ファイル | 内容 |
|---|---|
| `prompt/NEKODEMO_DESIGN.md` | 設計書（正）。決定事項 D1〜D11、トークン・テーマ・アイコン・部品・配布の設計 |
| `prompt/IMPLEMENTATION_PLAN.md` | 実装計画。フェーズごとの作業項目・完成条件・人の判断項目 H1〜H7 |

進め方:

- 各フェーズ着手前に計画の該当節を提示し、承認を得てから実装する。
- 設計書の【未確認】は実装前に確認し、結果を設計書に追記する。【初期案】の値を変えたらテーマ JSON と設計書の両方に反映する。
- 完了報告には、変更したファイル、実行したコマンドと結果（失敗はそのまま書く）、設計書へ追記した内容、残課題を書く。

## 2. 技術構成

Next.js 16（App Router、`output: "export"`、GitHub Pages 配信）/ React 19 / TypeScript / Tailwind CSS v4 /
shadcn（copy-in）/ radix-ui / Storybook 10（`@storybook/nextjs-vite`）/ Vitest 4（unit: jsdom、storybook: browser mode）/ Biome / pnpm 10

- Vitest は 4 系に固定（`@storybook/addon-vitest` の peer が `^3 || ^4` のため）。
- TypeScript は 7 系（Go 実装）。`next build` / `tsc --noEmit` / `tsc -p tsconfig.build.json` で動作確認済（2026-09-21）。問題が出たら 5.9 系に固定する。
- 末尾の `nextjs-agent-rules` ブロックは `next dev` が自動追記する（Next.js 16.3 の仕様）。消さずにコミットする。
- リポジトリ: https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system 、npm パッケージ名は `nekodemo`（D9）。

## 3. コマンド

| コマンド | 内容 |
|---|---|
| `pnpm dev` / `pnpm build` | デモサイト（Next.js） |
| `pnpm storybook` / `pnpm build-storybook` | Storybook（出力は `public/storybook`） |
| `pnpm test` / `pnpm test:watch` | Vitest（unit + storybook の 2 プロジェクト） |
| `pnpm lint` / `pnpm format` | Biome ＋ `scripts/lint-imports.mjs` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build:package` | ライブラリを `dist/` に出力（`tsconfig.build.json`） |
| `pnpm new-component <kebab-name>` | 部品の雛形（index / stories / test / README / item.json） |
| `pnpm build:tokens` / `build:themes` / `check:contrast` | `tokens/*.json` → `src/styles/tokens.css`、`themes/*.json` → `themes.css` / `registry.ts` / `NekoHead.tsx`（コントラスト検査つき） |
| `pnpm build:icons` / `icons:list` | `icons/wanted.txt` ＋ `icons/src`（T1）＋ `icons/manual-ears.json`（手動耳）→ `icons.generated.ts` / `icons/status.json`。部品が使うアイコンに猫版が無ければ exit 1 |
| `pnpm icons:prompts` / `icons:vectorize <name>` / `icons:audit` / `icons:inspect <name>` | T1 パイプライン: プロンプト生成（`icons/prompts/`）→ 人が画像生成 → `icons/raw/<name>.png` をベクター化（VTracer。`.venv` に `pip install vtracer`、Python 3.9〜3.13 推奨）→ 検査 (a)〜(e) → `pnpm build:icons`。`icons:inspect` は耳の手動配置用に 24 グリッド付き PNG と上辺のプロファイルを出す |
| `pnpm check` | `nekodemo check src --strict`（NK001〜NK010）。Stop hook でも自動実行 |
| `pnpm build:readmes` | 部品の JSDoc → `README.md` |
| `pnpm build:registry` | `src/components/ui/*/item.json` → `registry.json` → `shadcn build` → `public/r/*.json`、`llms.txt` → `public/` |
| `pnpm pack:test` | `npm pack` → 一時プロジェクトに入れて import / SSR / CSS コンパイル / bin を検証 |
| `pnpm screenshots` | `pnpm build` 後にデモサイトを 3 テーマで撮影 → `docs/screenshots/` |

## 4. リポジトリ構成（要点）

- `tokens/` `themes/` `icons/` … 見た目の唯一の正（JSON / SVG）。ビルドで CSS・TS を生成する。
- `src/styles/tokens.css` `src/styles/themes.css` `src/**/*.generated.ts` `src/themes/registry.ts` … **生成物。手で編集しない。**
- `src/components/ui/<kebab-name>/` … 部品。`index.tsx` / `index.stories.tsx` / `index.test.tsx` / `README.md` / `item.json` の 5 点セット。
- `src/components/theme/` … NekoThemeProvider / NekoThemePicker / NekoHead / useNekoTheme。
- `src/app/` … デモサイト。`src/app/guidelines/` … ガイドラインサイト（`docs/guidelines/*.md`・部品の README・item.json・stories をビルド時に読んで描画する。内容の正はそれらのファイル）。`src/index.ts` … 公開 API。
- `scripts/` … ビルド・検査スクリプト（Node ESM、`.mjs`）。`scripts/hooks/` … Claude Code hooks。
- `docs/ai/` `docs/guidelines/` `skills/` … AI 向け提供物（`.claude/skills` 等は `skills/` へのシンボリックリンク）。`docs/preview/` … 実装前のビジュアルプレビュー（参考）。
- `docs/guidelines/components/<slug>.md` … ガイドラインサイトの部品ページに載せる手書きの節（振る舞い・内容・参考文献）。選択肢・状態・寸法は `scripts/component-spec.mjs` が `index.tsx` から抽出し、概要・使い方は README（JSDoc）から出す。部品を足したらこの md も書く。
- `bin/nekodemo.mjs` `scripts/check/` `icons/status.json` … npm 配布物にも同梱される（`package.json` の `files`）。`scripts/build-package.mjs` が `dist/styles.css` と `dist/ai/` を作る。

## 5. コーディング規約

- ライブラリ配下（`src/components` `src/lib` `src/themes` `src/index.ts`）は **相対 import のみ**（部品のストーリー・テストも含む）。`@/` は `src/app` でのみ使う（`scripts/lint-imports.mjs` が検査）。
- 色・角丸・文字サイズは **役割トークン名だけ**（`bg-surface-card` `text-text-low` `rounded-action` `text-3`）。`#hex` / `rgb()` / Tailwind 既定パレット名（`bg-blue-500` 等）/ 任意値（`text-[13px]`）は禁止。
- アイコンは `Icon` 部品（Material Symbols の名前）。`lucide-react` は使わない。
- フォントウェイトは 400（`font-normal`）/ 700（`font-bold`）のみ。
- 各部品の先頭に JSDoc（概要／アンチパターン／使用例）を日本語で書く。README はそこから生成する。
- テストは「表示・操作・disabled・アクセシブルネーム」の 4 観点。ストーリーは全 variant と状態を持ち、a11y 違反 0 にする。
- バリアント名は `primary` / `secondary` / `outline` / `ghost` / `negative`、サイズは `sm` / `md` / `lg`。
- 「Sparkle」の語を製品名・パッケージ名・属性名・識別子に使わない（D10）。README の参考表記のみ可。
- `icons/raw/`（AI 生成の元画像）はコミットしない。プロンプト（`icons/prompts/`）と SVG（`icons/src/`）だけを残す。
- コミットは 1 コミット 1 目的。メッセージは日本語でよい。

## 6. 不可逆操作

- `npm publish` / `npm unpublish` / `gh release create` / タグ push / force push / タグ削除は
  `.claude/settings.json` の PreToolUse hook（`scripts/hooks/irreversible-ops-guard.sh` → `.mjs`）が exit 2 でブロックする。
- 判定はコマンド位置（行頭、`&&` `||` `;` `|` の直後）でのみ行う。heredoc で書くドキュメント本文の行頭にこれらの語を置くと誤検知するので、その場合は Write ツールでファイルを書く。
- 利用者がその操作を明示したときだけ、そのコマンドの直前に `NEKODEMO_CONFIRM=1 ` を付けて実行する（コマンド単位の承認。環境変数として export したものは無視される）。
- `package.json` の `private: true` は npm 公開（H7）を利用者が明示するまで外さない。公開前の確認は `pnpm pack:test` で行う。
- Stop hook（`scripts/hooks/nekodemo-check-stop.mjs`）が応答終了時に `pnpm check` を実行する。error があると停止がブロックされるので、直してから完了報告する。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
