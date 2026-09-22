# Radio

部品ページ（/guidelines/components/radio/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/radio/index.tsx` の JSDoc が正。

## 振る舞い

- `RadioGroup` は既定で縦積み（`grid gap-3`、12px 間隔）。横に並べるのは選択肢が 3 個までで文言が短いときだけにし、`className="flex gap-4"` で上書きする。
- Tab はグループ全体で 1 回だけ止まり、中の移動は矢印キー。矢印で移った先がそのまま選択される。
- 一度選ぶとキーボードでも未選択には戻せない。空に戻せる必要があるときは「指定なし」を選択肢として置く。
- `RadioItem` は 20px 円、選択中の点は 10px。`disabled` は選択肢ごとにも `RadioGroup` 全体にも付けられ、無効にした選択肢は矢印でも飛ばされる。
- `RadioGroup` 自体にはラベルが付かないので、`aria-label` か `aria-labelledby`（Form なら `FormLabel`）を必ず渡す。`aria-invalid` は `RadioItem` 側の枠に効く。

## 内容

- 選択肢は品詞と長さを揃える（「社内のみ」「全体に公開」）。片方だけ説明を足さない。
- 補足が要る選択肢は、ラベルを短いままにして 1 行の説明を下に添える。ラベル自体を長文にしない。
- グループのラベルは名詞（「公開範囲」）。設問文（「公開範囲を選んでください」）にしない。
- 既定値を 1 つ選んだ状態で出す。既定を決められないときだけ未選択で出す。

## 参考文献

- [WAI-ARIA Authoring Practices: Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [shadcn/ui: Radio Group](https://ui.shadcn.com/docs/components/radio-group)
- [Material Design 3: Radio button](https://m3.material.io/components/radio-button/guidelines)
