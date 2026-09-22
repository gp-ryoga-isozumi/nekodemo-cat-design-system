# SearchCombobox

部品ページ（/guidelines/components/search-combobox/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/search-combobox/index.tsx` の JSDoc が正。

## 振る舞い

- フォーカスした時点で候補が開き、先頭の候補がハイライトされた状態になる。↑↓ で移動、Enter で確定、Esc で閉じる。
- 絞り込みは既定で大文字小文字とアクセントを無視した部分一致。サーバー検索にするときは `filterOptions` で素通しにし、`onInputChange` の呼び出し側でデバウンスする（部品側では待たない）。
- `multiple` では選択済みが Tag として入力欄の中に並び、Backspace で末尾から外れる。選んでも候補は閉じないので続けて選べる。
- `loading` のあいだは候補リストに `sm` の Spinner と「候補を読み込み中…」が出る。候補が 0 件なら `emptyText`（既定「候補がありません」）、`freeSolo` で入力中なら「…を追加するには Enter を押す」に変わる。
- 入力に文字が入ると右端にクリアボタン（読み上げ名は `clearLabel`、既定「クリア」）が出る。`disabled` / `readOnly` では出ない。
- 候補パネルは入力欄の直下に絶対配置され（`z-20`、高さは `max-h-80` まで）、Portal を使わない。スクロール領域や Dialog の下端に置くと隠れるので、下に余白を取る。

## 内容

- `label` は検索する対象の名詞にする（「顧客」「タグ」）。見た目を消す場合も `hideLabel` で残し、削らない。
- `placeholder` には入力例を書く（「山田商事」）。必須や形式のような、消えては困る情報を入れない。
- `getOptionDescription` の 2 行目は同名の候補を見分ける属性（担当者・地域）にする。説明文を入れない。
- 0 件の文言には次にすることを添える（「候補がありません。別の語で検索してください」）。

## 参考文献

- [WAI-ARIA Authoring Practices: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [shadcn/ui: Combobox](https://ui.shadcn.com/docs/components/combobox)
- [Material Design 3: Search](https://m3.material.io/components/search/guidelines)
