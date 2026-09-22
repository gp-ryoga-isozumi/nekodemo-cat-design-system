# Spinner

部品ページ（/guidelines/components/spinner/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/spinner/index.tsx` の JSDoc が正。

## 振る舞い

- サイズは `sm` 16px / `md` 20px（既定）/ `lg` 40px。ボタンの中と行内の補足は `sm`〜`md`、パネル全体の読み込みは `lg` にする。
- `role="status"` と `aria-label`（既定「読み込み中」）を持つので単独でも読み上げられる。同じ画面に複数置くときは、同じ文言が繰り返されないよう `label` を分ける。
- 色は `currentColor` で親の文字色を継ぐ。変えたいときだけ `className` に `text-object-primary` などを渡す。
- 回転は `animate-spin`。「視差効果を減らす」が有効だと止まり、毛糸玉の形だけが残る（`motion-reduce:animate-none`）。
- Button の `loading` の中身もこの部品なので、ボタンの中に別の Spinner を足さない。

## 内容

- `label` には何を読み込んでいるかを書く（「案件を読み込み中」）。既定の「読み込み中」のままでよいのは、ボタンの中のように対象が文脈で分かる場所だけ。
- 隣に文も出すときは、`label` と見える文（「案件を読み込んでいます」）が同じ対象を指すようにする。
- 猫の言葉遊びを入れてよいのは、この読み込み中の文言と空状態だけ。エラー文やフォームには持ち込まない。

## 参考文献

- [Material Design 3: Progress indicators](https://m3.material.io/components/progress-indicators/guidelines)
- [shadcn/ui: Skeleton](https://ui.shadcn.com/docs/components/skeleton)
