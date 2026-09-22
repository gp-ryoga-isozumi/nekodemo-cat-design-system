# Icon

部品ページ（/guidelines/components/icon/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/icon/index.tsx` の JSDoc が正。

## 振る舞い

- 猫版がある名前（T1 専用 / T2 自動耳）は inline SVG で耳付きに描かれ、無い名前（T3）は Material Symbols Rounded のフォントに落ちる。表示は壊れず、開発時だけ 1 名前につき 1 回 `console.warn` が出る。
- 耳は「頭」に見える上辺を持つ形にだけ付く。`arrow_*` / `chevron_*` / `check` / `close` / `add` / `menu` などには付かず、`pets` や `cruelty_free` も猫要素と競合するので耳なしにしてある。
- `size` は 1〜12 の段階（12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 36 / 42 / 48 / 54px）。既定は 3（16px）で、文中は 3、ボタン内は 3〜4、空状態のような大きな表示は 8 以上にする。
- `label` を渡すと `role="img"` と `aria-label`、SVG の `<title>` が付く。省略すると `aria-hidden` の装飾扱いになるので、文字の隣に添えるアイコンでは省略する。
- 色は `fill="currentColor"`。親の文字色を継ぐので、変えたいときだけ `className` に `text-object-high` などの役割トークンを渡す。`fill` を渡すと塗り版に切り替わる。
- 猫版が無い名前は、まず別名（`expand_more` → `keyboard_arrow_down`）で置き換えられないか確かめ、無ければ `icons/wanted.txt` への追加を依頼する（`nekodemo check` の NK006 が警告する）。

## 内容

- `label` には絵柄ではなくその場での意味を書く（「削除」。「ゴミ箱」にしない）。
- 同じ意味に別々の名前を使わない。画面の中で「編集」は `edit`、「削除」は `delete` に統一する。

## 参考文献

- [Material Symbols](https://fonts.google.com/icons)
- [Material Design 3: Icons](https://m3.material.io/styles/icons/overview)
