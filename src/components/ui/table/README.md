# Table

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

静的な表（設計書 §9.1 #34）。行の高さは density xs 40 / sm 56（既定）/ md 80。
ヘッダーはスクロール時に固定、数値は `TableCell numeric` で等幅フォント右寄せ、縞模様と縦罫線は使わない。
ソート・選択・ページングを備えた DataGrid は v1.1。

## アンチパターン

- レイアウト目的で使う
- 縞模様や縦罫線を足す
- 数値を左寄せ・可変幅フォントにする

## 推奨例

- 一覧（画面の型 A）の本体に使い、行数を見せたい画面は `density="xs"`、1 行の情報が多い画面は `density="md"` にする
- 金額・数量・日時の列は `TableHead numeric` と `TableCell numeric` を対で付けて右寄せの等幅にそろえる
- 並び替えができる列は `sort` と `onSort` を渡し、今の並び順をヘッダーに示す
- 行クリックは詳細へ遷移させ、行内の操作は行末のセルに Menu でまとめる

## 使用例

```tsx
<Table density="sm">
  <TableHeader><TableRow><TableHead>案件名</TableHead><TableHead numeric>金額</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>備品貸出アプリ</TableCell><TableCell numeric>1,200,000</TableCell></TableRow></TableBody>
</Table>
```
