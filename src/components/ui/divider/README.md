# Divider

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

区切り線（設計書 §9.1 #13）。横（既定）と縦。装飾ではなく、意味のある区切りにだけ使う。
`decorative`（既定 true）なら読み上げから外れる。

## アンチパターン

- 余白で足りる場所に引く（§10.5 余白は 4px の倍数。セクション間 32）
- 表の縦罫線として使う（Table は縞・縦罫線なし）

## 使用例

```tsx
<Divider />
<Divider orientation="vertical" className="h-6" />
```
