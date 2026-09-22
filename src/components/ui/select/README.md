# Select

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

単一選択のドロップダウン（設計書 §9.1 #19）。Radix Select ベースでキーボード操作・タイプアヘッドは自動。
複数選択や検索付きは v1.1 の SearchCombobox。

## アンチパターン

- 選択肢が 3 つ以下で常に見せたい場合に使う（Radio）
- 選択肢が 20 を超える場合に使う（SearchCombobox）
- `<label>` を付けない（SelectTrigger に `id` を付け `<label htmlFor>` で結ぶ）

## 推奨例

- 状態・担当部署のように、候補が 4〜20 個で変わらない単一選択に使う
- `SelectTrigger` に `id` を付けて `<label htmlFor>` で結び、未選択は `SelectValue` の `placeholder`（「選択してください」）で示す
- 候補が多いときは `SelectGroup` と `SelectLabel` で見出しを付けて分ける
- 一覧の絞り込みでは `onValueChange` で再検索し、選んだ値を Tag にも出す

## 使用例

```tsx
<Select defaultValue="isozumi">
  <SelectTrigger id="owner" aria-label="担当者"><SelectValue placeholder="選択してください" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="isozumi">五十棲</SelectItem>
    <SelectItem value="yamada">山田</SelectItem>
  </SelectContent>
</Select>
```
