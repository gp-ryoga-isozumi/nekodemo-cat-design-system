# Link

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

文中や一覧内のテキストリンク（設計書 §9.1 #3）。色は `text-text-link`、下線あり。
`external` で新しいタブに開き、耳なしの `open_in_new` アイコンを付ける。Next.js の `<Link>` は `asChild` で包む。

## アンチパターン

- 操作（保存・削除）に使う（Button）
- 「こちら」だけをリンクにする（リンク先が分かる語をリンクにする）

## 使用例

```tsx
<Link href="/projects/1">案件の詳細</Link>
<Link href="https://example.com" external>ヘルプセンター</Link>
<Link asChild><NextLink href="/projects">案件一覧</NextLink></Link>
```
