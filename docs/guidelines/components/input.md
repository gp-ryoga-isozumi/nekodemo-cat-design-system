# Input

部品ページ（/guidelines/components/input/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は常に親いっぱい（`w-full min-w-0`）。列幅を変えたいときは Input ではなく、囲む `FormItem` やグリッドの幅で決める。最小幅は持たない。
- 高さは `size` で sm 32 / md 40 / lg 48px に固定。文字は sm が `text-2`、md / lg が `text-3`。同じフォームの中では `size` を混ぜない。
- `aria-invalid` を付けると枠が `border-border-negative` に変わり、フォーカス時のリングも negative になる。エラーの文言は Input ではなく `FormMessage` が出す。
- `disabled` は枠 `border-border-middle`・背景 `bg-surface-disabled`・カーソル not-allowed になる。値を見せたまま変更させないだけなら `readOnly` を使う（見た目は通常のまま）。
- 入力値は折り返さず、長い値は欄の中で左右にスクロールする。省略記号は出ないので、確認が必要な長い値は Textarea か別の表示に回す。
- フォーカスリングはキーボード操作（focus-visible）のときだけ、`border-border-focus` の枠と 2px のリングで出る。

## 内容

- `placeholder` は入力例だけにする（「例: 山田商事」「taro@example.com」）。書式・単位・必須の条件は `FormLabel` と `FormDescription` に書く。
- ラベルは名詞にし、「〜を入力」を付けない（「取引先名」）。単位は括弧でラベルに付ける（「受注金額（円）」）。
- 補足（`FormDescription`）は 1 行にとどめる。2 行以上必要なら項目を分けるか、入力例を `placeholder` に移す。
- 変更できない理由はラベルに書く（「案件番号（自動で採番されます）」）。`disabled` にしたまま理由を書かない状態にしない。

## 参考文献

- [shadcn/ui: Input](https://ui.shadcn.com/docs/components/input)
- [MDN: &lt;input&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [Material Design 3: Text fields](https://m3.material.io/components/text-fields/guidelines)
