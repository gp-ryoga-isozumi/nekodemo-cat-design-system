# Pagination

部品ページ（/guidelines/components/pagination/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/pagination/index.tsx` の JSDoc が正。

## 振る舞い

- 総ページ数は `Math.ceil(total / pageSize)` で決まり、`page` は 1〜最終ページに丸められる。範囲外の値を渡しても表示は壊れない。
- ページ番号は 7 ページまでは全部並べ、8 ページ以上は「1 … 現在の前後 1 つ … 最終」に省略する。省略記号は読み上げから外れている。
- 1 ページに収まるときは番号が消えて要約だけになる。0 件のときは「0件中 0〜0件を表示」になるので、0 件の領域は EmptyState と入れ替える。
- 前へ・次へは端でも消さずに `disabled` にする。ボタンは高さ 32px・最小幅 32px で、数字は等幅（`font-mono tabular-nums`）なので桁が増えても位置が動かない。
- 要約は左、番号は右（`ml-auto`）に寄る。幅が足りないと折り返して 2 行になるので、表の下では全幅で置く。
- ページを変えても一覧の先頭へは戻らない。長い一覧では `onPageChange` の中でスクロール位置を戻す。

## 内容

- 要約の文は実装が組み立てる（「120件中 1〜20件を表示」）。「全 120 件」などに言い換えたいときは `showSummary={false}` にして自分で書く。
- `unit` は数えるものの単位を 1 文字で入れる（「件」「人」「行」）。数値と単位のあいだに空白を入れない。
- ページ番号のボタンの読み上げ名は「3 ページ目」。画面には数字だけを出し、「ページ」の語を並べない。
- 1 ページの件数を選ばせる場合は Pagination の外（一覧の上）に置き、要約の文言はそのままにする。

## 参考文献

- [shadcn/ui: Pagination](https://ui.shadcn.com/docs/components/pagination)
- [MDN: `<nav>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
