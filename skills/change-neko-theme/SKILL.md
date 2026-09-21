---
name: change-neko-theme
description: >
  nekodemo のテーマ（三毛 / アメショ / ロシアンブルー）を切り替えるスキル。
  「テーマを変えて」「もっと落ち着いた雰囲気に」「ダークにして」「猫を変えて」で発動。
  雰囲気語からテーマを 1 案提案し、承認後に data-neko-theme と defaultTheme を書き換える。
---

# change-neko-theme

## 前提チェック
1. `package.json` に `nekodemo` があるか。無ければ `setup-nekodemo` に引き継ぐ。
2. 現在のテーマを確認する: `nekodemo.config.json` の `defaultTheme`、ルートの `data-neko-theme`、`NekoThemeProvider` の `defaultTheme`。3 つが食い違っていれば報告して揃える。

## 手順
1. 利用者の言葉をテーマの語彙と照合し、1 案を選ぶ。
   | 言葉の例 | テーマ |
   |---|---|
   | 親しみやすい、元気、明るい、toC、コミュニティ、学習、子ども向け、カジュアル、ポップ | `calico`（三毛） |
   | 落ち着き、中立、モノトーン、業務、管理画面、ダッシュボード、SaaS、真面目、シンプル | `american-shorthair`（アメショ） |
   | 上品、クール、静か、高級感、金融、法務、ヘルスケア、フォーマル、ダーク、夜 | `russian-blue`（ロシアンブルー・ダーク） |
   判断できなければ 1 回だけ聞く: 「業務系（アメショ）／上品・ダーク系（ロシアンブルー）／親しみ系（三毛）のどれが近いですか？」
2. 提案を短く示す（例: 「金融系なので上品なロシアンブルー（ダーク）を提案します」）。利用者が指定済みならそのまま進む。
3. 次の 3 か所を同じ ID に書き換える:
   - `nekodemo.config.json` の `"defaultTheme"`
   - ルートの `<html data-neko-theme="…">`（Next.js は `app/layout.tsx`、Vite は `index.html`）
   - `<NekoThemeProvider defaultTheme="…">`
4. `persist` を使っている場合、利用者のブラウザには前のテーマが保存されている。「ヘッダーの切替 UI で選び直すか、localStorage の `neko-theme` を消してください」と伝える。
5. 開発サーバーで見た目が変わることを確認し、報告する。

## 完了条件
- 3 か所の ID が一致し、`pnpm nekodemo check src` が 0 件のまま。
- 提案したテーマと理由を 1〜2 行で報告している。

## やってはいけないこと
- テーマ JSON（`themes/*.json`）や CSS 変数を直接編集して色を変えること。色の変更要望は「テーマの切替」か「nekodemo への PR」で対応する。
- 画面ごとに違うテーマを混在させること（`data-neko-theme` はルートに 1 つ）。
- 利用者の承認なしに `nekodemo.config.json` の `themes` を減らすこと。
