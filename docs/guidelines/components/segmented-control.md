# SegmentedControl

部品ページ（/guidelines/components/segmented-control/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/segmented-control/index.tsx` の JSDoc が正。

## 振る舞い

- 部品の側で常に値を持つので、選択中の項目をもう一度押しても選択は外れず、`onValueChange` も呼ばれない。値が実際に変わったときだけ 1 回呼ばれる。
- ← → ↑ ↓ を押すと、フォーカスだけでなく選択も隣の項目へ移る（radio group の作法）。端まで行くと反対側に回り込み、`disabled` の項目は飛ばす。矢印キーでも `onValueChange` が発火するので、重い再取得は結果の描画側で受け止める。
- 高さは sm 32 / md 40 / lg 48px（外枠と内側の余白を含む値）。文字は sm・md が `text-2`、lg だけ `text-3` になる。
- 項目が幅に収まらないときは折り返さず横スクロールになる。2〜5 択・短い名詞という前提を外すと、右端の項目が隠れる。
- 選択中は面が `surface-card` になり `shadow-raise` と太字が付く。色の差ではなく面と影で示すので、どのテーマでも選択位置が分かる。
- `aria-label`（または `aria-labelledby`）を渡さないとグループに読み上げ名が付かない。項目名だけでは何の切替か伝わらない。

## 内容

- 項目名は 2〜6 文字の名詞（「一覧」「カード」「日」「週」「月」）。「一覧で見る」のような動詞句にしない。
- `aria-label` は何を切り替えるかの名詞にする（「表示」「期間」）。「切り替え」だけにしない。
- 項目名の長さをそろえる。1 つだけ長いと押せる幅が偏る。略語で縮めるのではなく、長くなるなら Select に替える。

## 参考文献

- [WAI-ARIA Authoring Practices: Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Radix Primitives: Toggle Group](https://www.radix-ui.com/primitives/docs/components/toggle-group)
- [Material Design 3: Segmented buttons](https://m3.material.io/components/segmented-buttons/guidelines)
