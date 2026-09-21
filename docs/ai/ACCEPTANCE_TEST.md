# 受け入れテスト（利用側 AI で nekodemo を使う）

設計書 §15 の Phase 5 完成条件を、人が手元の AI コーディングツールで再現するための手順です。Claude Code では 2026-09-22 に合格済み（実装計画 Phase 5 の実施メモ）。Gemini CLI / Codex での実施（H6）はこの手順で行います。

## 準備（5 分）

1. 新規プロジェクトを作る（Next.js の例）:
   ```bash
   pnpm dlx create-next-app@latest nk-accept --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --no-eslint --yes
   cd nk-accept
   ```
2. skills を入れる（skills が使えるツールの場合）:
   ```bash
   npx skills add gp-ryoga-isozumi/nekodemo-cat-design-system
   ```
   skills が使えないツールでは、依頼文に `docs/ai/USING_NEKODEMO.md` と `docs/ai/SETUP.md` の URL を添える。
3. AI コーディングツールをこのディレクトリで起動する。

## 依頼文（そのまま貼る）

```text
nekodemo を使って案件一覧・案件詳細・案件編集のプロトタイプを作って。テーマは三毛。
（nekodemo の導入手順: https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/SETUP.md
　使い方: https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/USING_NEKODEMO.md）
```

npm 公開前は、AI が `pnpm add nekodemo` に失敗したら次を伝える:

```text
nekodemo はまだ npm に無いので pnpm add https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/nekodemo.tgz で入れて。
```

## 合格条件（人手介入なしで達成すること）

| # | 条件 | 確認方法 |
|---|---|---|
| 1 | セットアップが手順どおり完了している | `src/app/globals.css` が 3 行（`@import "tailwindcss"` / `@source` / `@import "nekodemo/styles.css"`）、`layout.tsx` に `data-neko-theme="calico"`・`NekoHead`・`NekoThemeProvider`、`nekodemo.config.json`、`AGENTS.md` にガードブロック |
| 2 | 一覧・詳細・編集の 3 画面があり、一覧に 4 状態（読み込み中 / 0 件 / エラー / 成功）がある | 画面を開いて状態を切り替える（切替 UI かクエリ） |
| 3 | `pnpm nekodemo check src --strict` が 0 件 | コマンドを実行する |
| 4 | テーマ切替が動く | ヘッダーの `NekoThemePicker` で 3 テーマを切り替え、色・角丸・マスコットが変わる |

Gemini CLI / Codex では 1〜3 の達成を v1 の完成条件とする（設計書 §15）。

## 記録

結果は実装計画（`prompt/IMPLEMENTATION_PLAN.md`）の Phase 5 の実施メモに、ツール名・バージョン・日付・合否・詰まった箇所を追記する。ドキュメントの不備が見つかったら `docs/ai/` と `skills/` を直す（Claude Code での 1 回目は指摘 12 件をすべて反映済み）。
