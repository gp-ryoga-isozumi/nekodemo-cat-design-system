# bookmark_add — T1（専用に描く猫耳アイコン）のプロンプト

- 名前: `bookmark_add`（Material Symbols）
- 説明: ブックマーク追加
- 生成に使ったモデル / サービス: （記入）
- 日付: （記入）
- 設定（サイズ・ステップ等）: （記入）
- 利用規約の確認（商用利用・再配布）: （記入。設計書 §3.3）

## プロンプト（そのまま貼る）

> 24-grid の UI ピクトグラム。黒 1 色、純白の背景、影・グラデーション・文字なし。線の太さは 2px 相当、端と角は丸い（Material Symbols Rounded の weight 500 と同じ太さ）。題材: 「ブックマーク追加」。図形本体の上辺に、本体と同じ線幅の中抜きの三角形の猫耳を左右 1 つずつ付ける（付け根は本体の輪郭上、耳の高さはアイコン全体の 1/5、頂点はやや外側に倒す。顔・ひげ・目は描かない）。中央配置、上下左右に 2px の余白。1024×1024。

## 生成後の手順

1. PNG を `icons/raw/bookmark_add.png` に置く（git 管理外）
2. `pnpm icons:vectorize bookmark_add` → `icons/src/bookmark_add.svg`
3. `pnpm icons:audit bookmark_add` で (a)〜(e) が合格すること
4. `pnpm build:icons` → Storybook の Icon Catalog で T2 と並べて確認（12 / 16 / 24 / 48px）
5. 採用したら `icons/manifest.json` の `bespoke` に `{ "bookmark_add": { "reviewer": "", "date": "", "model": "" } }` を記録する
