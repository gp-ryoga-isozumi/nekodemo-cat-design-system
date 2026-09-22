# Skeleton

部品ページ（/guidelines/components/skeleton/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/skeleton/index.tsx` の JSDoc が正。

## 振る舞い

- `Skeleton` 1 枚は `aria-hidden` の四角（既定 `h-4`、`bg-surface-well`、`rounded-notice`）で、読み上げには何も伝わらない。
- `SkeletonRows` は `role="status"` と `aria-label="読み込み中"` を持つ器で、既定 5 行の幅を `w-3/5` → `w-4/5` → `w-2/3` の順に変える。一覧の読み込みは素の `Skeleton` を並べず `SkeletonRows` を使う。
- 形は `className` で作る。アバターは `size-10 rounded-round`、カードは `rounded-container`、ボタンは `h-8 w-24 rounded-action` のように、置き換わる実物と同じ大きさにする。
- 点滅は `animate-pulse`。OS の「視差効果を減らす」が有効だと止まる（`motion-reduce:animate-none`）。
- 実物に差し替えたときに高さが変わると画面が跳ねる。行数・枚数は実際に出る件数の目安（一覧 5 行 / カード 3 枚）に合わせる。

## 内容

- Skeleton の中に文字を入れない。読み上げ名は `SkeletonRows` 側に付いている。
- 読み込みが長引くときの説明（「時間がかかっています」）は Skeleton ではなく、その下に通常の文として置く。

## 参考文献

- [shadcn/ui: Skeleton](https://ui.shadcn.com/docs/components/skeleton)
- [Material Design 3: Progress indicators](https://m3.material.io/components/progress-indicators/guidelines)
