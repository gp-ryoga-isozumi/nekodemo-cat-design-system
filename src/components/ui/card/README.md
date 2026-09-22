# Card

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

情報のまとまりを囲む面（設計書 §9.1 #14）。`rounded-container` と `shadow-raise`。
Card / CardHeader / CardTitle / CardDescription / CardAction / CardContent / CardFooter を組み合わせる。

## アンチパターン

- 全部をカードにする（面の重なりは 1 段まで。ページ内の区切りは余白と見出しで）
- カードの中にカードを入れる

## 推奨例

- 詳細画面を「基本情報」「関連する案件」のようなまとまりに分け、1 まとまり 1 枚にする
- 見出しは `CardTitle`、まとまりの操作は `CardAction`（右上）か `CardFooter`（下）に置く
- 作成・編集フォームはセクションごとに Card で囲み、カード同士は余白で離す

## 使用例

```tsx
<Card>
  <CardHeader>
    <CardTitle>基本情報</CardTitle>
    <CardAction><IconButton icon="more_vert" label="操作" /></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button variant="outline" size="sm">編集する</Button></CardFooter>
</Card>
```
