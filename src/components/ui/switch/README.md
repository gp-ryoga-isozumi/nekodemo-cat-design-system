# Switch

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

即時に反映される ON/OFF 設定（設計書 §9.1 #22）。保存ボタンを押して反映するフォームの項目は Checkbox。
ラベルは `<label htmlFor>` で結ぶ。

## アンチパターン

- フォームの送信で反映する項目に使う（Checkbox）
- ラベル無しで置く

## 使用例

```tsx
<div className="flex items-center gap-2">
  <Switch id="notify" defaultChecked />
  <label htmlFor="notify" className="text-2">期限が近い案件を通知する</label>
</div>
```
