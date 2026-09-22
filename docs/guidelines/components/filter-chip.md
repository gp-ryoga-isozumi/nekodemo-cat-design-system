# FilterChip

部品ページ（/guidelines/components/filter-chip/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/filter-chip/index.tsx` の JSDoc が正。

## 振る舞い

- 状態は部品の中に持たない。押すと `onSelectedChange(!selected)` が呼ばれるだけなので、画面側で `selected` を更新しないと見た目も `aria-pressed` も変わらない。
- `onClick` は `onSelectedChange` より先に呼ばれ、そこで `preventDefault()` すると選択は切り替わらない。確認を挟みたいときに使う。
- 選択中はチェックアイコンが `icon` の位置に入れ替わる。`icon` を渡していないチップは選択時にアイコンのぶん幅が広がるので、並べるチップは `icon` の有無をそろえる。
- 高さは sm 28 / md 32 / lg 40px で、角は `rounded-round`。選択中は枠と文字が primary、面が `surface-primary-subtle` になる。
- `count` は見た目には 3 桁区切りの数字だけを出し、読み上げは「進行中 12 件」になる（数字は `aria-hidden`、読み上げ用の複製が「件」を補う）。
- `FilterChipGroup` は `<fieldset>` と視覚的に隠した `<legend>` で、幅が足りなければ 8px 間隔で折り返す。チップを直接並べるとグループの読み上げ名が無くなる。

## 内容

- 文言は条件そのものの名詞にする（「進行中」「自分の担当」「今週が納期」）。「〜で絞り込む」は付けない。
- `FilterChipGroup` の `aria-label` は何で絞り込むかを書く（「状態で絞り込む」「担当で絞り込む」）。
- `count` には件数の数値だけを渡す。文言側に「12 件」と書き足すと二重に読み上げられる。
- チップの文言に何の条件かを入れない（「状態: 進行中」ではなく「進行中」）。それは `FilterChipGroup` の `aria-label` が持つ。

## 参考文献

- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Material Design 3: Chips](https://m3.material.io/components/chips/guidelines)
