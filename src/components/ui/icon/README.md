# Icon

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

猫耳アイコン。Material Symbols と同じ名前で指定する。猫版（T1 専用 / T2 自動耳）があれば inline SVG、
無ければ Material Symbols Rounded のフォント（T3）にフォールバックして表示が壊れない（開発時は console.warn）。
色は `text-object-high` などの役割トークンで指定する。

## アンチパターン

- `lucide-react` など別のアイコンライブラリを混ぜる
- 意味を持つアイコンに `label` を付けない（IconButton では必須）
- `style={{ color }}` や `#hex` で色を付ける

## 推奨例

- Button や見出しの先頭に `size={4}` 程度で添え、文字の意味を補う（装飾なので `label` は付けない）
- アイコン単体で意味を持たせるときだけ `label` に読み上げ文を渡す
- 色は `className` に `text-object-low` などの役割トークンで指定する

## 使用例

```tsx
<Icon icon="search" />
<Icon icon="delete" size={5} className="text-object-negative" label="削除" />
<Icon icon="favorite" fill />
```
