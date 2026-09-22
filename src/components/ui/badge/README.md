# Badge

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

件数を示す小さな丸（設計書 §9.1 #10、D13）。未読数・通知数など数値に使う。shadcn の Badge（文字のラベル）に当たるのは Tag / StatusTag で、状態や分類の語をここに入れない。
状態を示すラベル（「進行中」「完了」）は Tag の status を使う。

## アンチパターン

- 文章や長い語を入れる（Tag を使う）
- 装飾として色を変える（primary / negative / neutral の 3 種だけ）

## 推奨例

- 未読・通知など気付いてほしい数は `variant="negative"`、通常の件数は primary か neutral にする
- SideNavigation の項目や Tabs の見出しの右に添えて、その画面に何件あるかを示す
- 桁が増える数は `max` で上限を決める（`max={99}` で「99+」）

## 使用例

```tsx
<Badge count={3} variant="negative" />
<Badge count={120} max={99} />   // 99+
<Badge variant="neutral">120件</Badge>
```
