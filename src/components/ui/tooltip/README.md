# Tooltip

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

ホバー／フォーカスで出る短い補足（設計書 §9.1 #7）。IconButton の名前や省略した語の説明に使う。
TooltipProvider をアプリのルート（NekoThemeProvider の内側）に 1 つ置く。

## アンチパターン

- 操作に必要な情報を Tooltip にだけ書く（本文かラベルに書く）
- タップ端末で前提にする（表示されないことがある）

## 推奨例

- アイコンだけのボタン（IconButton）に、押すと何が起きるかを 1 行で添える
- 表の見出しの略称や省略した語に、正式名称を補う
- `TooltipTrigger` は `asChild` でボタンやリンクを包み、キーボードのフォーカスでも出るようにする
- `TooltipProvider` はアプリのルート（NekoThemeProvider の内側）に 1 つだけ置く

## 使用例

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><IconButton icon="delete" label="削除" /></TooltipTrigger>
    <TooltipContent>削除する</TooltipContent>
  </Tooltip>
</TooltipProvider>
```
