# Checkbox

部品ページ（/guidelines/components/checkbox/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/checkbox/index.tsx` の JSDoc が正。

## 振る舞い

- 大きさは 22px 角で固定し、文字サイズや行の高さでは変わらない。ラベルと横に並べるときは中央（`items-center`）で揃える。
- Space で切り替える。Enter は無効化されているので、フォームの中で押しても送信にならない。
- 一部選択（横棒、10×2px）になるのは `checked="indeterminate"` を渡したときだけ。自分では遷移しないので、子の選択数から呼び出し側で組み立てる。
- 押せるのは四角の 22px と、`<label htmlFor>` で結んだ文字の範囲だけ。行全体を押せるようにしたいときは `<label>` で包む。
- `aria-invalid` を付けると枠が `border-border-negative` になる。`disabled` は `bg-surface-disabled` になり、Tab でも止まらない。
- フォーカスリングはキーボード操作（focus-visible）のときだけ出る。マウスのクリックでは出ない。

## 内容

- ラベルは ON のときに起きることを動作で書く（「通知を受け取る」）。否定形（「通知を受け取らない」）にしない。
- 複数並べるときは語尾と長さを揃える。1 つだけ説明文のように長くしない。
- 一括選択の読み上げ名には対象を入れる（「案件をすべて選択」）。「すべて選択」だけにしない。
- 補足は Field の `description` に書き、ラベルを 2 行に折り返さない。

## 参考文献

- [WAI-ARIA Authoring Practices: Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [shadcn/ui: Checkbox](https://ui.shadcn.com/docs/components/checkbox)
- [Material Design 3: Checkbox](https://m3.material.io/components/checkbox/guidelines)
