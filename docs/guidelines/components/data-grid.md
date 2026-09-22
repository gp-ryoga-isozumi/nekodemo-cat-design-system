# DataGrid

部品ページ（/guidelines/components/data-grid/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/data-grid/index.tsx` の JSDoc が正。

## 振る舞い

- 列幅は既定 160px・最小 64px の `table-fixed`。表の幅は列幅の合計になり、収まらない分は横スクロールする。セルの中身は省略記号で切られる（`truncate`）ので、全文が必要な列は `size` を広げる。
- ソートは 昇順 → 降順 → 解除 の順で、数値列も同じ順に揃えてある（`sortDescFirst: false`）。Shift＋クリックで複数列。列幅はヘッダー右端のハンドルをドラッグ、ダブルクリックで既定に戻る。
- `pinFirstColumn` は先頭列（`selectable` ならチェック列も）を左に固定する。固定セルは背景を自前で持つので、hover と選択の色はそのまま追従する。
- ツールバーの表示は状態で変わる。行を選ぶと選択件数（`aria-live="polite"`）と「選択を解除する」が、列の絞り込みが効いていると「絞り込みを解除する（n）」が現れる。`toolbar` に渡した要素は「列」メニューの左に並ぶ。
- 4 状態は自動で切り替わる。`status="loading"` は Skeleton 5 行と `aria-busy`、`"error"` は InlineMessage（`onRetry` があれば「再試行」）、0 件は EmptyState。検索や絞り込みで 0 件になったときだけ「条件をクリアする」が付く。
- `virtualize` にするとページングが無効になり、`height`（既定 480px）の領域内で行を仮想化する。行の高さは `density`（40 / 56 / 80px）で固定されるため、セルの中に行の高さを超える要素を置かない。

## 内容

- `aria-label` は必須。表の題をそのまま渡す（「案件一覧」）。検索欄の読み上げ名が「<aria-label>を検索」になるので、「〜の表」「テーブル」を含めない。
- `emptyTitle` は対象を含める（「まだ案件がありません」）。`errorMessage` は何が起きたかと次の操作の両方を書く（既定は「一覧を読み込めませんでした。時間をおいて再試行してください。」）。
- `unit` には単位だけを渡す（「件」「名」）。「〜件」のような語句や数字を含めない。
- `rowActions` の IconButton には行を特定できる `label` を付ける（「<案件名> を編集する」）。全行で同じ「編集」にしない。

## 参考文献

- [WAI-ARIA Authoring Practices: Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [shadcn/ui: Data Table](https://ui.shadcn.com/docs/components/data-table)
- [MDN: &lt;table&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
