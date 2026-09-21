# Badge

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

件数を示す小さな丸（設計書 §9.1 #10、D13）。未読数・通知数など数値に使う。
状態を示すラベル（「進行中」「完了」）は Tag の status を使う。

## アンチパターン

- 文章や長い語を入れる（Tag を使う）
- 装飾として色を変える（primary / negative / neutral の 3 種だけ）

## 使用例

```tsx
<Badge count={3} variant="negative" />
<Badge count={120} max={99} />   // 99+
<Badge variant="neutral">120件</Badge>
```
