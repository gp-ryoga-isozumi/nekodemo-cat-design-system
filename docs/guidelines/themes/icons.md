# Icons

アイコンは `Icon` 部品に Material Symbols の名前（snake_case）を渡して使います。猫版がある名前は本体と同じ線幅の中抜きの猫耳付きで描かれ、無い名前は Material Symbols Rounded のフォントで表示されるので画面は壊れません。

## 使い方

```tsx
<Icon icon="search" />                       {/* 装飾（aria-hidden） */}
<Icon icon="delete" label="削除" size={4} />  {/* 意味を持つときは label */}
<Icon icon="favorite" fill />                {/* 塗り版 */}
```

- `size` は 1〜12（12〜54px）。文中は 3（16px）、ボタン内は 3〜4、空状態などの大きな表示は 8 以上。
- 色は `text-object-*`（`object-high` / `middle` / `low` / `primary` / `negative` / `on-primary`）で指定します。
- `IconButton` はアイコンだけのボタン用で、`label` が必須です。
- `lucide-react` など他のアイコン集は使いません（`nekodemo check` の NK005）。

## 耳を付けない規約

矢印・チェック・×・線・トグルのように「頭」に相当する上辺が無い記号には耳を付けません（`arrow_*`、`chevron_*`、`check`、`close`、`add`、`remove`、`menu`、`more_vert`、`drag_*`、`format_*` など）。肉球（`pets`）やウサギ（`cruelty_free`）のように猫要素と競合する形も耳なしです。

## 猫版の階層

| 階層 | 内容 |
|---|---|
| T1 | 専用に描いた耳付きアイコン（`icons/src/`）。画像生成 → ベクター化 → 検査 → 人のレビューを経て採用 |
| T2 | Material Symbols の本体に自動で耳を置いたもの。自動で置けない形は座標を手で指定（`icons/manual-ears.json`） |
| T3 | 猫版が無い名前。フォントで表示され、`nekodemo check` の NK006 が警告する |

猫版が無い名前を使いたいときは、別名（`expand_more` → `keyboard_arrow_down` など）で解決できないか確認し、無ければ `icons/wanted.txt` への追加を依頼します（skill: `request-cat-icon`）。

## 参照

- 全アイコンと階層は Storybook の [Icon Catalog](/storybook/?path=/story/ui-icon--icon-catalog)。
- 猫要素をどこに出すかは [猫要素の使いどころ](/guidelines/foundations/cat-flavor/)。
