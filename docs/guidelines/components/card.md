# Card

部品ページ（/guidelines/components/card/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/card/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は親（グリッドや flex）が決め、高さは中身なり。横に並べたカードの高さをそろえたいときは `className="h-full"` を付ける（Card 自身が `flex flex-col`）。
- `CardHeader` は `CardAction` を入れたときだけ 2 列（`1fr auto`）になり、操作は右上に固定される。`CardTitle` と `CardDescription` はその左に縦に積まれる。
- 区切り線は `CardHeader` の下と `CardFooter` の上に自動で入る。`CardContent` だけを置けば線の無い面になる。
- `CardFooter` は右寄せの横並び。カードの中の主ボタンは 1 つにし、画面の主アクションはカードの外（ページのヘッダー）に置く。
- カード自体は押せない（ただの面）。カードから遷移させたいときは `CardTitle` の中に Link を 1 つ置き、カード全体をクリック領域にしない。
- 影は `shadow-raise` の 1 段だけで、ホバーで浮かせる演出は持たない。状態の違いは中身（Tag / Badge）で示す。

## 内容

- `CardTitle` は名詞の短い見出しにする（「基本情報」「今月の稼働」）。文にしない。
- `CardDescription` は 1 行の補足だけ。本文や項目は `CardContent` に置く。
- `CardAction` に IconButton を置くときは、`label` に何に対する操作かを入れる（「基本情報の操作」）。
- 同じ画面に並ぶカードの見出しは語形をそろえる（「基本情報」「担当者」「履歴」）。片方だけ「〜の一覧」にしない。

## 参考文献

- [shadcn/ui: Card](https://ui.shadcn.com/docs/components/card)
- [Material Design 3: Cards](https://m3.material.io/components/cards/guidelines)
