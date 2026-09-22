# IconButton

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

アイコンだけのボタン（設計書 §9.1 #2）。`label` は必須で `aria-label` になる（§10.7）。
行末の操作（編集・削除）、ヘッダーの通知・ヘルプ、閉じるボタンに使う。

## アンチパターン

- `label` を省略する（型で必須にしている）
- 主アクションに使う（文言のある Button を使う）

## 推奨例

- 一覧の行末の編集・削除や、パネルの閉じるなど、文言を置く余地の無い補助操作に使う
- `label` には対象が分かる文を書く（「この案件を削除する」）
- 行内や入力欄の中は `size="sm"`、削除は `variant="negative"`、面の上で枠を見せたいときは `variant="outline"` にする

## 使用例

```tsx
<IconButton icon="edit" label="編集" />
<IconButton icon="delete" label="削除" variant="negative" size="sm" />
<IconButton icon="close" label="閉じる" variant="outline" />
```
