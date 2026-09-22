# FilterChip

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

一覧を絞り込む「押して ON / OFF する」チップ（v1.2）。検索欄の下に横並びで置き、複数を同時に選べる。
選択中は primary の淡い面とチェックが付き、`aria-pressed` で状態を伝える。`count` で該当件数を添えられる。
選んだ条件を表す（外せる）ラベルは Tag、単一選択の切替は SegmentedControl、6 個以上の候補は Select か SearchCombobox。

## アンチパターン

- 選択肢が 1 つだけ（Switch か Checkbox）
- 同じ画面で単一選択と複数選択の FilterChip を混ぜる
- 押しても一覧が変わらない（絞り込み以外の用途に使わない）

## 推奨例

- 一覧の上に `FilterChipGroup label="状態で絞り込む"` で並べ、押した瞬間に一覧を絞り込む
- よく使う条件（「自分の担当」「今週が納期」）を先頭に置く
- 絞り込み中は「絞り込みを解除する」の ghost Button を右端に置く

## 使用例

```tsx
<FilterChipGroup label="状態で絞り込む">
  <FilterChip selected={mine} onSelectedChange={setMine} icon="person">自分の担当</FilterChip>
  <FilterChip selected={f.has("進行中")} onSelectedChange={(v) => toggle("進行中", v)} count={12}>進行中</FilterChip>
</FilterChipGroup>
```
