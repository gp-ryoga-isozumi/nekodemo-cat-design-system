# PageHeader

部品ページ（/guidelines/components/page-header/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/page-header/index.tsx` の JSDoc が正。

## 振る舞い

- 並びは `breadcrumb` → 見出し＋`meta` → `description`、`actions` は見出しと同じ行の右端で固定。props を渡す順番を変えても表示順は変わらない。
- 幅が足りなくなると見出しの塊と `actions` が折り返して 2 段になる。`actions` は縮まないので、狭い画面ではボタンが見出しの下に回り込む。
- 長い見出しは省略記号で切らずに折り返す（`text-6` の太字のまま）。`meta` は見出しと同じ行に並び、複数渡すと同じ行の中で折り返す。
- `description` と `actions` は渡さなければ要素自体が描かれないので、空の余白は残らない。`breadcrumb` と `meta` は渡したものをそのまま差し込む。
- 見出しは常に `<h1>` なので、この下に置く節の見出しは `h2` 以下にして見出しレベルを飛ばさない。
- `actions` の中身は 8px 間隔で横に並ぶ。「補助 → 主」の順にし、操作 Menu は右端に置く（Button と同じ並べ方）。

## 内容

- `title` はそのページに付いた名前をそのまま出す。一覧は「案件一覧」、詳細は案件名そのものにし、「詳細」のような画面の種類を足さない。
- `description` は 1 行の説明か属性の並びにする（「山田商事 / 更新 2026/09/22」）。区切りは前後に空白を入れた `/`。
- `meta` に置く StatusTag は 1〜2 個までにする。件数や更新日時は `meta` ではなく `description` に書く。
- 見出しと `description` で同じ言葉を繰り返さない（「案件一覧」の下に「案件の一覧です」と書かない）。

## 参考文献

- [MDN: &lt;header&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header)
- [Material Design 3: Top app bar](https://m3.material.io/components/top-app-bar/guidelines)
