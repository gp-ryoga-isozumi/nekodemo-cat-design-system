# DataGrid

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

ソート・列幅・固定・選択・ページング・検索・列の絞り込み・列の表示切替・密度・4 状態・仮想化・行内操作を
備えた表（設計書 §9.4、v1.1）。状態は TanStack Table v9（ヘッドレス）が持ち、描画は Table 部品で行う（D5）。
- ソート: ヘッダーをクリックで 昇順 → 降順 → 解除。Shift+クリックで複数列
- 列幅: ヘッダー右端のハンドルをドラッグ。ダブルクリックで既定幅
- 固定: ヘッダーは常に固定。`pinFirstColumn` で先頭列を左に固定
- 選択: `selectable` でチェックボックス列。全選択・一部選択（indeterminate）・選択件数
- 検索: 上部の InputSearch で全列を部分一致。列ごとの絞り込みは `filter: "select"`
- 状態: `status="loading"` は Skeleton、`"error"` は InlineMessage ＋ 再試行、0 件は EmptyState

## アンチパターン

- 5 行程度の静的な表に使う（Table）
- セル内編集をさせる（v1 では対象外）
- 縞模様や縦罫線を足す

## 使用例

```tsx
<DataGrid
  aria-label="案件一覧"
  columns={[
    { id: "name", header: "案件名" },
    { id: "customer", header: "顧客", filter: "select" },
    { id: "amount", header: "金額", numeric: true, cell: (r) => r.amount.toLocaleString() },
  ]}
  data={projects}
  getRowId={(r) => r.id}
  selectable
  pinFirstColumn
  rowActions={(r) => <IconButton icon="edit" label={`${r.name} を編集`} variant="ghost" size="sm" />}
/>
```
