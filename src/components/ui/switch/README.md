# Switch

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

即時に反映される ON/OFF 設定（設計書 §9.1 #22）。保存ボタンを押して反映するフォームの項目は Checkbox。
ラベルは `<label htmlFor>` で結ぶ。

## アンチパターン

- フォームの送信で反映する項目に使う（Checkbox）
- ラベル無しで置く

## 推奨例

- 設定画面（画面の型 D）の 1 項目として、切り替えた瞬間に反映される ON/OFF に使う
- `id` を振って `<label htmlFor>` で結び、ラベルは「期限が近い案件を通知する」のように ON のときの動きを書く
- `onCheckedChange` で保存し、結果を Toast（success）で伝える。失敗したら元の状態に戻す
- 説明が要る項目は見出し・説明・入力の 3 行にそろえ、Switch を右端に置く

## 使用例

```tsx
<div className="flex items-center gap-2">
  <Switch id="notify" defaultChecked />
  <label htmlFor="notify" className="text-2">期限が近い案件を通知する</label>
</div>
```
