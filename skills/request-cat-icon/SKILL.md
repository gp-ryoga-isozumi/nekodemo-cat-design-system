---
name: request-cat-icon
description: >
  猫耳版が無いアイコン（nekodemo check の NK006 で警告されるもの）の追加を依頼するスキル。
  「〜のアイコンが猫版になっていない」「filter のアイコンを追加して」「T3 のアイコンを直して」で発動。
  icons/wanted.txt への追加と、T1 用プロンプトの生成、PR 本文の作成までを行う（画像生成は人が行う）。
---

# request-cat-icon

## 前提チェック
1. `pnpm nekodemo check src --format json` を実行し、`missingIcons` の一覧を得る。利用者が名前を指定していればそれを優先する。
2. 名前が Material Symbols に実在するか確認する（https://fonts.google.com/icons で検索）。実在しない名前は近い名前に置き換えて提案する（例: `place` → `location_on`、`expand_more` → `keyboard_arrow_down`）。
3. まず「別名で解決できないか」を見る: nekodemo の `icons/manifest.json` の `aliases` に既にあれば、その名前で `Icon` を使えばよい（依頼不要）。

## 手順（利用側プロジェクトで）
1. 暫定対応: 猫版が無くても `Icon` はフォントで表示されるので、画面は壊れない。先に画面を完成させる。
2. nekodemo リポジトリ（https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system）への依頼を作る:
   - `icons/wanted.txt` に `<name> <一行説明>` を追加する差分
   - T1（専用に描く）にしたい場合は `icons/prompts/<name>.md` のプロンプト（設計書 §8.4 のテンプレート）:
     > 24-grid の UI ピクトグラム。黒 1 色、純白の背景、影・グラデーション・文字なし。線の太さは 2px 相当、端と角は丸い（Material Symbols Rounded の weight 500 と同じ太さ）。題材: 「<説明>」。図形本体の上辺に、本体と同じ線幅の中抜きの猫耳を左右 1 つずつ付ける（付け根は本体の輪郭上、耳の高さはアイコン全体の 1/5、顔・ひげ・目は描かない）。中央配置、上下左右に 2px の余白。
3. PR 本文（または Issue）を作る: 対象の名前、使う画面、T2（自動耳）で十分か T1 が必要か、プロンプト。
4. 利用者に「画像生成と PR は人が行う。マージ後に `nekodemo` を更新すると猫版になる」と伝える。

## 完了条件
- 依頼内容（名前・説明・T1/T2 の希望・プロンプト）が 1 つの Markdown にまとまっている。
- 画面側は暫定でフォント表示のまま動いている。

## やってはいけないこと
- `lucide-react` や別のアイコン集で代用する。
- SVG を利用側プロジェクトに直接埋め込む（nekodemo の Icon 経由で統一する）。
- 画像生成サービスの利用規約を確認せずに生成物をコミットする（設計書 §3.3）。
