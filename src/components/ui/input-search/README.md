# InputSearch

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

検索欄（設計書 §9.1 #17）。Container / Icon（耳付き `search`）/ Value / Clear / Condition の構成。
入力があるとクリア（×）が出る。`onOpenConditions` を渡すと絞り込みボタン（`filter_list`）が付く。
サジェスト付きは v1.1 の SearchCombobox。

## アンチパターン

- 一覧の絞り込みに複数の InputSearch を並べる（1 つにして条件は Tag で見せる）
- 検索の実行を Enter だけにして、入力中の検索も無しにする（プロトタイプでは入力のたびに絞り込む方が試しやすい）

## 推奨例

- 一覧の上に 1 つだけ置き、`placeholder` に何で探せるかを書く（「案件名・顧客名で検索」）
- `onValueChange` で入力のたびに絞り込み、クリア（×）で元の一覧に戻せるようにする
- 条件が増える画面は `onOpenConditions` で絞り込みを開き、選んだ条件は Tag で見せる

## 使用例

```tsx
<InputSearch placeholder="案件名・顧客名で検索" value={q} onValueChange={setQ} onOpenConditions={() => setOpen(true)} />
```
