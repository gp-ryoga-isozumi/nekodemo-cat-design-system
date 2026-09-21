# InputPassword

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

パスワード入力（設計書 §9.1 #16）。右端の目のアイコン（耳付き `visibility`）で表示／非表示を切り替える。

## アンチパターン

- 表示切替を付けない（入力ミスの確認ができない）
- `autoComplete` を省略する（`current-password` / `new-password` を付ける）

## 使用例

```tsx
<InputPassword id="password" autoComplete="current-password" />
```
