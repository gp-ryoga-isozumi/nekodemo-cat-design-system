# InputSearch

部品ページ（/guidelines/components/input-search/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input-search/index.tsx` の JSDoc が正。

## 振る舞い

- 高さは Input と同じ sm 32 / md 40 / lg 48px。幅は親いっぱいに伸びるので、一覧の上では最大幅を親側で決める。
- 入力のたびに `onValueChange` が呼ばれる（デバウンスは無い）。件数が多くて重いときは、呼び出し側で間引くか Enter での実行に切り替える。
- 左の虫眼鏡は飾りで押せない。右端はボタン置き場で、文字があるときだけクリア（×）が出て、`onOpenConditions` を渡したときだけ絞り込み（`filter_list`）が並ぶ。ボタンの数に応じて入力の右余白が広がる。
- クリアを押すと `onValueChange("")` が呼ばれ、非制御なら値も空になる。制御（`value`）で使うときは親で空にしないと消えない。
- ブラウザ標準の × は隠してあるので、消す手段はクリアボタンだけになる。`disabled` にすると入力とボタンがまとめて無効になる。

## 内容

- プレースホルダーには検索対象を書く（「案件名・顧客名で検索」）。「検索」「キーワード」だけにしない。
- 適用中の条件は検索欄の下に Tag で出す。プレースホルダーや入力欄の中に条件名を書かない。
- `clearLabel` の既定は「クリア」。検索欄が複数ある画面では対象を入れる（「案件の検索条件をクリア」）。
- 結果 0 件の文言は EmptyState 側（「条件に合う案件がありません」）で出し、検索欄には出さない。

## 参考文献

- [shadcn/ui: Input](https://ui.shadcn.com/docs/components/input)
- [Material Design 3: Search](https://m3.material.io/components/search/guidelines)
- [MDN: `<input>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
