# Accordion

部品ページ（/guidelines/components/accordion/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/accordion/index.tsx` の JSDoc が正。

## 振る舞い

- `type="single"` は同時に 1 つだけ開く。`collapsible` を付けないと最後に開いた 1 つが閉じられないので、全部閉じた状態を許すなら必ず付ける。`type="multiple"` は複数を同時に開ける。
- 見出しのボタンどうしは ↑ ↓ で移動でき、Home / End で先頭・末尾へ飛ぶ。Tab は開いている本文の中の操作にも入るので、畳んだ項目のリンクはタブ順から外れる。
- 閉じている本文は DOM から外れる。ブラウザのページ内検索にも読み上げにも出てこないので、必ず見つけてほしい情報は畳まない。
- 開閉は高さのアニメーションで、右端の矢印（`keyboard_arrow_down`）が開くと 180 度回る。矢印は耳なしで、開閉の向きだけを示す。
- 項目の区切りは下 1 本の線で、最後の項目には線が付かない。枠で囲みたいときは Card の中に入れる。
- `AccordionItem` に `disabled` を付けると、その見出しだけが押せなくなり文字が `text-disabled` になる。

## 内容

- 見出しは開く前に中身が予測できる言葉にする。「その他」「詳細」のように中身の分からない見出しにしない。
- FAQ の見出しは利用者の言葉で書き、文末に「？」を付けない（「請求先を変更するには」）。
- 最初から開けておきたい項目は `defaultValue` で指定する。見出しに「（重要）」のような飾りを付けて目立たせない。
- 本文が長くなるときは要点だけを残して別ページに分け、見出しからリンクする。

## 参考文献

- [WAI-ARIA Authoring Practices: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [Radix Primitives: Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)
- [shadcn/ui: Accordion](https://ui.shadcn.com/docs/components/accordion)
