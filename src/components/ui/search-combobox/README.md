# SearchCombobox

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

サジェスト付きの検索入力（設計書 §9.3、v1.1）。挙動は MUI の `useAutocomplete`（ヘッドレスフック）、
見た目は nekodemo の Input / Tag で組む（D4）。単一／複数（`multiple`）、自由入力（`freeSolo`）、
グループ見出し（`groupBy`）、`loading` の Spinner、0 件の文言に対応する。
↑↓ で候補移動、Enter で確定、Esc で閉じる、Backspace で末尾の選択を外す。
`role="combobox"` / `aria-expanded` / `aria-activedescendant` はフックが付ける。
候補パネルは入力欄の直下に絶対配置する（Radix Popover の Portal はフックのフォーカス管理と干渉するため）。

## アンチパターン

- 5 件程度の固定の選択肢に使う（Select）
- 検索欄として使う（InputSearch。候補を出さない検索は InputSearch）
- `label` を省略する（`hideLabel` で見た目だけ隠す）

## 使用例

```tsx
<SearchCombobox label="顧客" options={customers} getOptionLabel={(c) => c.name} onChange={(c) => setCustomer(c)} />
<SearchCombobox label="タグ" multiple freeSolo options={["急ぎ", "要確認"]} />
```
