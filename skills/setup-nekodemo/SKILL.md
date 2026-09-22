---
name: setup-nekodemo
description: >
  nekodemo（猫がテーマのプロトタイプ用デザインシステム）を利用側プロジェクトに導入するスキル。
  「nekodemo を導入」「猫デザインシステムをセットアップ」「nekodemo を使えるようにして」で発動。
  プロジェクトの状態（Next.js / Vite、pnpm / npm）を検出して、不足している手順だけを実行する。
---

# setup-nekodemo

## 前提チェック
1. `package.json` があるか。無ければ利用者に「Next.js（App Router）か Vite のプロジェクトを先に作ってください」と伝えて中断する。
2. フレームワークを判定する: `next` があれば Next.js、`vite` があれば Vite。パッケージマネージャは lockfile（`pnpm-lock.yaml` / `package-lock.json` / `yarn.lock`）で判定する。
3. Tailwind のバージョンを確認する。v3 なら「nekodemo は Tailwind v4 が必要です」と伝え、v4 への移行を提案して中断する。
4. テーマの指定が無ければ 1 回だけ聞く: 「業務系（アメショ）／上品・ダーク系（ロシアンブルー）／親しみ系（三毛）のどれが近いですか？」。答えが無ければ `calico`。

## 手順
`docs/ai/SETUP.md`（https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/SETUP.md）の手順を、上から順に「未実施のものだけ」実行する。

1. `nekodemo` と `tailwindcss` `@tailwindcss/postcss` をインストールする（npm 公開前はデモサイトの tarball URL。SETUP.md §1）。`react-hook-form` / `zod` は不要（`nekodemo` から再 export されている）。
2. `postcss.config.mjs` を作る（既にあれば `@tailwindcss/postcss` が含まれているか確認）。
3. エントリ CSS を `@import "tailwindcss";` `@source "<node_modules への相対パス>/nekodemo/dist";` `@import "nekodemo/styles.css";` の 3 行にする。既存の `@import "tailwindcss"` は重複させず、テンプレート既定の `:root { --background: #fff }` / `@theme inline` / `body { font-family }` は削除する（色の直書きは NK001 で error）。
4. ルート（Next.js は `layout.tsx`、Vite は `index.html` と `main.tsx`）に `data-neko-theme`、`NekoHead`、`NekoThemeProvider`（`defaultTheme` と `persist`）、`TooltipProvider`、`Toaster` を入れる。
5. `nekodemo.config.json` を作る。
6. `AGENTS.md`（無ければ作成）に `docs/ai/GUARD_BLOCK.md` のブロックを貼る。`CLAUDE.md` が独自の内容を持つなら同内容を追記し、中身が `@AGENTS.md` の 1 行だけなら追記しない。既に `<!-- nekodemo:guard:start -->` があれば貼らない。
7. `package.json` に `"lint:nekodemo": "nekodemo check src --strict"` を追加する。応答終了時の hook を登録する（既存の hooks を壊さない）: Claude Code は `.claude/settings.json` の `Stop`、Codex CLI は `.codex/hooks.json` の `Stop`、Cursor は `.cursor/hooks.json` の `stop`（SETUP.md §6 に設定例）。Gemini CLI など hook が無い環境は登録しない。
8. テンプレート既定の画面（`src/app/page.tsx` / `src/App.tsx`）を nekodemo 部品の最小画面に置き換える（SETUP.md §7 の例。既定の画面は Tailwind 既定パレットと `font-medium` を使っていて error になる）。そのうえで `pnpm nekodemo check src` を実行し、error 0 件であることを確認する。

## 完了条件
- 開発サーバーを起動して、ヘッダーに置いた `NekoThemePicker`（または `data-neko-theme` の書き換え）で 3 テーマが切り替わる。
- `pnpm nekodemo check src` の error が 0 件。
- 変更したファイルの一覧と、聞いたテーマを報告する。

## やってはいけないこと
- Tailwind の設定ファイル（`tailwind.config.*`）を新しく作る（v4 では不要）。
- エントリ CSS に色や角丸の定義を足す。
- 利用者の承認なしに既存の `AGENTS.md` の他の節を書き換える（ガードブロックの追記だけ）。
- `nekodemo.config.json` の `themes` を勝手に減らす。
