# DescriptionList

部品ページ（/guidelines/components/description-list/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/description-list/index.tsx` の JSDoc が正。

## 振る舞い

- `columns`（既定 2）が効くのは sm ブレークポイント以上だけで、それより狭い画面では必ず 1 列になる。列数を増やしても狭い画面の見え方は変わらない。
- `span` を付けた項目は複数列のときだけ全幅になる（1 列のときは元から全幅）。備考や住所のように 1 行に収まらない値に使う。
- `layout="horizontal"` は項目名の幅を 128px に固定する。これより長い項目名は折り返して行が増えるので、横並びにするなら項目名を短くする。
- 値が `null` / `undefined` / `""` / `false` のときだけ `emptyText`（既定「—」）を薄い色で出し、`dd` に `data-empty="true"` が付く。`0` は値として扱われ、そのまま表示される。
- 値は `break-words` で折り返す。長い URL やファイル名を入れても横スクロールにはならず、行の高さだけが増える。
- DOM は常に `dt` → `dd` の順なので、列数やレイアウトを変えても読み上げの順番は「項目名 → 値」のまま崩れない。

## 内容

- `label` は 2〜6 文字の名詞にそろえる（「顧客」「金額」「担当」）。単位は項目名ではなく値側に付ける（「1,200,000 円」）。
- 値は表示用に整形してから渡す。日付は `2026/09/22`、数値は 3 桁区切り、時刻は `13:05`。
- `emptyText` を既定から変えるのは、空の意味が特別なときだけにする（「未設定」「非公開」）。「—」は「値が無い」を表す。
- 未入力は値を渡さずに「—」を出させる。「なし」と書くと 0 件や「該当なし」と意味が混ざる。

## 参考文献

- [MDN: &lt;dl&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)
- [Material Design 3: Lists](https://m3.material.io/components/lists/guidelines)
