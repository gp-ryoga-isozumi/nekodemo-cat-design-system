# Spinner

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

読み込み中を表す毛糸玉のアニメーション（設計書 §8.6）。Button の loading 状態でも使う。
`role="status"` と `aria-label` を持つので、単独で置いても読み上げられる。

## アンチパターン

- 一覧やカード群の読み込みに使う（そこは Skeleton。Spinner はボタン内や小さな領域向け）
- 装飾として常時回す

## 推奨例

- ボタンの処理中（Button の `loading`）と、パネルなど小さな領域の待ち時間に使う
- `label` に何を待っているかを書く（「案件を読み込み中」）
- 画面の中ほどに単独で置くときは `size="lg"`、文字やアイコンに添えるときは `size="sm"` にする
- 色は `className` に `text-object-*` の役割トークンで渡す

## 使用例

```tsx
<Spinner />
<Spinner size="lg" label="案件を読み込み中" className="text-object-primary" />
```
