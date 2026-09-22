# Menu

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

操作の一覧を出すドロップダウン（設計書 §9.1 #29）。行末の「⋮」（IconButton more_vert）や見出し横の操作に使う。
Radix DropdownMenu ベースでキーボード操作は自動。破壊的操作は `MenuItem variant="negative"` にして末尾に置き、区切り線で分ける。

## アンチパターン

- 項目が 1 つだけ（Button か IconButton にする）
- 画面遷移と操作を混ぜて並べる（遷移は上、操作は下、破壊的操作は最後）

## 推奨例

- 一覧の行末や詳細の見出し横に `MenuTrigger asChild` で IconButton（more_vert）を置き、その行・そのページの操作をまとめる
- 遷移（「詳細を見る」）を上、操作（「複製する」）を下に置き、`MenuSeparator` で区切る
- 削除は `MenuItem variant="negative"` で末尾に置き、選んだあと Dialog で確認する
- 列の表示や並び順の切替は `MenuCheckboxItem` / `MenuRadioItem` で今の状態を見せる

## 使用例

```tsx
<Menu>
  <MenuTrigger asChild><IconButton icon="more_vert" label="操作" /></MenuTrigger>
  <MenuContent>
    <MenuItem onSelect={edit}><Icon icon="edit" size={4} />編集する</MenuItem>
    <MenuSeparator />
    <MenuItem variant="negative" onSelect={remove}><Icon icon="delete" size={4} />削除する</MenuItem>
  </MenuContent>
</Menu>
```
