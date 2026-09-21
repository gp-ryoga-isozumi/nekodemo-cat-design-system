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

## 使用例

```tsx
<Table density="sm">
  <TableHeader><TableRow><TableHead>案件名</TableHead><TableHead numeric>金額</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>備品貸出アプリ</TableCell><TableCell numeric>1,200,000</TableCell></TableRow></TableBody>
</Table>
```
