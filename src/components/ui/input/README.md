# Input

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

1 行のテキスト入力（設計書 §9.1 #15）。高さは sm 32 / md 40 / lg 48px。
ラベル・補足・エラーは Form の Field で付ける。エラー時は `aria-invalid` を付けると枠が negative になる。

## アンチパターン

- `placeholder` に必須情報を書く（ラベルと補足に書く。§10.4）
- `<label>` を付けない（§10.7）
- 検索欄に使う（InputSearch）、パスワードに使う（InputPassword）

## 推奨例

- Form の `FormControl` の中に置き、ラベル・補足・エラーは Form 側に任せる
- `placeholder` には入力例だけを書く（「例: 山田商事」）
- 通常は既定の md、ツールバーや表の中に収めるときは `size="sm"` にする

## 使用例

```tsx
<Input id="name" placeholder="例: 山田商事" />
<Input size="sm" aria-invalid aria-describedby="name-error" />
```
