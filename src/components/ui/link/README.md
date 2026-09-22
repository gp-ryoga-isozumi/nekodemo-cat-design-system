# Link

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

文中や一覧内のテキストリンク（設計書 §9.1 #3）。色は `text-text-link`、下線あり。
`external` で新しいタブに開き、耳なしの `open_in_new` アイコンを付ける。Next.js の `<Link>` は `asChild` で包む。

## アンチパターン

- 操作（保存・削除）に使う（Button）
- 「こちら」だけをリンクにする（リンク先が分かる語をリンクにする）

## 推奨例

- 画面が変わるもの（詳細・一覧・ヘルプ）への移動に使い、文中では前後の文とつなげて書く
- 一覧の行では項目名をリンクにし、行のクリックと同じ詳細へ遷移させる
- 別サイトや外部の資料を開くときは `external` を付けて新しいタブで開く
- アプリ内の遷移は `asChild` で Next.js の `<Link>` を包む

## 使用例

```tsx
<Link href="/projects/1">案件の詳細</Link>
<Link href="https://example.com" external>ヘルプセンター</Link>
<Link asChild><NextLink href="/projects">案件一覧</NextLink></Link>
```
