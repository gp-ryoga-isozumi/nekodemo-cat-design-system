# Divider

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

区切り線（設計書 §9.1 #13）。横（既定）と縦。装飾ではなく、意味のある区切りにだけ使う。
`decorative`（既定 true）なら読み上げから外れる。

## アンチパターン

- 余白で足りる場所に引く（§10.5 余白は 4px の倍数。セクション間 32）
- 表の縦罫線として使う（Table は縞・縦罫線なし）

## 推奨例

- 設定画面の項目と項目のように、余白だけでは切れ目が伝わらない場所に引く
- Card の中で性質の違う情報を分けるときに 1 本だけ使う
- ツールバーで操作のまとまりを分けるときは `orientation="vertical"` に高さを添えて使う

## 使用例

```tsx
<Divider />
<Divider orientation="vertical" className="h-6" />
```
