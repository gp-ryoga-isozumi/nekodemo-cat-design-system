# Select

部品ページ（/guidelines/components/select/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/select/index.tsx` の JSDoc が正。

## 振る舞い

- `SelectTrigger` は親いっぱいの幅で、高さは `size` で sm 32 / md 40 / lg 48px。Input と同じ高さなので、同じ行に並べても揃う。
- 一覧は `position="popper"` でトリガーの下に開き、幅はトリガー以上（`min-w-(--radix-select-trigger-width)`）、高さは画面に収まる範囲まで。収まらない分は上下の矢印でスクロールする。
- 選択中の項目は `bg-surface-selected` と右端の `check` アイコンの 2 つで示す。トリガーの表示は 1 行に省略される（`line-clamp-1`）ので、長い選択肢は見分けが付く語から書く。
- キーボードは Radix 任せ。Enter / Space / ↑↓ で開き、↑↓ で移動、文字キーのタイプアヘッドで候補へ飛び、Esc で閉じてトリガーにフォーカスが戻る。
- `SelectGroup` ＋ `SelectLabel` で見出しを付け、`SelectSeparator` で区切る。`SelectLabel` は選択できない見出しなので、そこに操作を置かない。
- `aria-invalid` で枠が negative になるが、Input と違ってフォーカスリングの色は変わらない。エラーは `FormMessage` の文言で伝える。

## 内容

- `SelectValue` の `placeholder` は「選択してください」にする。未選択と「指定なし」を区別したいときは、「指定なし」を `SelectItem` として明示的に置く。
- 選択肢は名詞で語形をそろえる（「進行中」「完了」「保留」）。操作の一覧ではないので「〜する」の動詞にしない。
- `SelectLabel` の見出しは分類名（「担当部署」「状態」）にし、選択肢の語を繰り返さない。
- 選択肢の並びは意味のある順（進行の順、頻度の高い順）にし、よく選ぶものを先頭に置く。

## 参考文献

- [WAI-ARIA Authoring Practices: Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [shadcn/ui: Select](https://ui.shadcn.com/docs/components/select)
- [Radix Primitives: Select](https://www.radix-ui.com/primitives/docs/components/select)
