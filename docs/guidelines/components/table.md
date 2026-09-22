# Table

部品ページ（/guidelines/components/table/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/table/index.tsx` の JSDoc が正。

## 振る舞い

- 外側の `div`（`data-slot="table-container"`）が横スクロールと枠線・角丸を持つ。縦スクロールは持たないので、ヘッダー固定を効かせるには `max-h-*` ＋ `overflow-y-auto` の要素で囲み、そこに `tabIndex={0}` と `aria-label` を付ける。
- `TableHeader` は `sticky top-0` ＋ `bg-surface-well`。囲みをスクロールすると見出しだけが残る。
- 行の高さは `density` で決まる（xs 40 / sm 56（既定）/ md 80px）。見出し行は密度によらず 40px。セルの中身が高いと行はその分伸びるので、行の高さをそろえたい列では中身を 1 行に収める。
- `TableHead` に `sort` を渡すと見出しがボタンになり `aria-sort` が付く。`onSort` にはクリックイベントが渡るので Shift＋クリックの複数列ソートを組める。並べ替え以外の操作は `actions`、列幅ハンドルなどは `trailing` に渡してボタンの入れ子を避ける。
- `TableCell numeric` は右寄せ＋等幅（`tabular-nums`）になる。対応する `TableHead` にも `numeric` を付けないと見出しと値の寄せがずれる。
- 行は hover で `bg-surface-well`、`data-state="selected"` / `aria-selected` で `bg-surface-selected` になる。最終行の下罫線は自動で消える。合計は `TableFooter`（`bg-surface-well` ＋ 太字）に置く。

## 内容

- 列見出しは名詞にし、単位は括弧で付ける（「金額（円）」）。折り返さないので 10 文字程度までにする。
- 数値は 3 桁区切り、日付は `2026/09/21`、時刻は `13:05` にそろえる。値が無いセルは空のままにせず「—」を置き、0 と区別する。
- `TableCaption` は表の下に出る。表の題は見出し（`CardTitle` など）に置き、caption には絞り込み条件や更新時刻のような補足だけを書く。

## 参考文献

- [WAI-ARIA Authoring Practices: Table Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
- [shadcn/ui: Table](https://ui.shadcn.com/docs/components/table)
- [MDN: &lt;table&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
