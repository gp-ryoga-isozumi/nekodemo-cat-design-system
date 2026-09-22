# Checkbox

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

複数選択のチェックボックス（設計書 §9.1 #20）。チェックマークは猫の顔のシルエット（`cat_face`、D13）、
一部選択（`checked="indeterminate"`）は横棒。Radix ベースなのでキーボード操作と `aria-checked` は自動。
ラベルは `<label htmlFor>` か Form の Field で付ける。

## アンチパターン

- ラベル無しで置く（`aria-label` か `<label>` を必ず付ける）
- 単一の ON/OFF 設定に使う（即時反映する設定は Switch）

## 推奨例

- 「複数から選ぶ」設問や一覧の一括選択に使い、`<label htmlFor>` か Form の Field でラベルを付ける
- 全選択のチェックは、一部だけ選ばれている間 `checked="indeterminate"` にする
- 同意の確認は 1 個だけ置き、ラベルに同意する内容をそのまま書く

## 使用例

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="notify" defaultChecked />
  <label htmlFor="notify" className="text-2">通知を受け取る</label>
</div>
<Checkbox checked="indeterminate" aria-label="すべて選択" />
```
