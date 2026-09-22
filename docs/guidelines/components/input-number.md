# InputNumber

部品ページ（/guidelines/components/input-number/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input-number/index.tsx` の JSDoc が正。

## 振る舞い

- 高さは Input と同じ sm 32 / md 40 / lg 48px で、増減ボタン（sm 28 / md 32 / lg 40px）はその枠の内側に収まる。数字は右寄せの等幅（`font-mono tabular-nums`）なので、複数行に並べても桁がそろう。
- ↑ / ↓ キーで `step` ずつ増減する。増減ボタンは `tabIndex={-1}` でタブ順に入らないので、キーボードだけの操作は入力欄の中で完結する。
- `min` / `max` に達すると、その側の増減ボタンだけが無効になる。未入力のまま ↑ を押したときは `min`（未指定なら 0）から始まる。
- 範囲外の値はエラーにせず、blur したときに `min` / `max` へ丸める（`max={99}` に 150 と打てば 99 になる）。丸めた後の値が `onValueChange` にも渡る。
- 全角数字・全角のマイナスと小数点・カンマは打った時点で数値として解釈し（`onValueChange` には半角の数値が渡る）、blur で表示も半角に直る（「１，２００」→ `1,200`）。
- 3 桁区切りはフォーカスが外れているときだけ付く。編集中は区切りなしの生の数値になる（`format={false}` なら常に区切りなし）。

## 内容

- `unit` には単位だけを 1〜2 文字で入れる（「円」「件」「%」）。「（円）」「単位: 円」のような飾りは付けない。
- ラベルは数えるものの名詞にする（「受注金額」「納品数」）。「金額を入力」のように動詞では書かない。
- `placeholder` に入力例を書くときは区切りを入れない（「例: 1200000」）。3 桁区切りは部品が付ける。
- 範囲は補足（FormDescription）に書く（「1〜99 の範囲で入力してください」）。範囲外は丸めるので、エラー文にはしない。

## 参考文献

- [WAI-ARIA Authoring Practices: Spinbutton Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)
- [MDN: &lt;input type="number"&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- [Material Design 3: Text fields](https://m3.material.io/components/text-fields/guidelines)
