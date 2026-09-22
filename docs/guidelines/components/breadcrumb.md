# Breadcrumb

部品ページ（/guidelines/components/breadcrumb/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/breadcrumb/index.tsx` の JSDoc が正。

## 振る舞い

- 部品全体が読み上げ名「パンくずリスト」の `<nav>` になる。1 画面に 1 つだけ置き、詳細画面ではページ見出しのすぐ上に置く。
- 区切り（`BreadcrumbSeparator`）は自動では入らないので、項目のあいだに 1 つずつ書く。区切りは読み上げから外れているため、記号を変えても読み方は変わらない。
- 最後の項目は `BreadcrumbPage` にする。リンクにならず、太字＋`aria-current="page"` になる。
- 幅が足りないと項目の途中で折り返す（`flex-wrap`）。末尾を `…` で切らないので、長いレコード名はそのまま 2 行になる。
- 5 階層以上は中間を `BreadcrumbEllipsis` に置き換える。押しても展開しない飾りなので、省略した階層へは Side Navigation など別の導線から行けるようにする。
- `BreadcrumbLink asChild` で NextLink に差し替えられる。差し替えてもフォーカスリングと hover の下線は変わらない。

## 内容

- 各項目は遷移先の画面見出しと同じ語にする。一覧が「案件一覧」なら、ここも「案件一覧」にする。
- 先頭は「ホーム」。サービス名やロゴの文字を項目にしない。
- 最後の項目はレコードの名前をそのまま出す（「社内備品貸出アプリ 改修」）。「案件詳細」のような画面の種類名にしない。
- 階層の語に「〜の一覧」「〜について」を足さない。名詞で短く揃える。

## 参考文献

- [WAI-ARIA Authoring Practices: Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [shadcn/ui: Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb)
- [MDN: `<nav>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
