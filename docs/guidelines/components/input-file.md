# InputFile

部品ページ（/guidelines/components/input-file/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input-file/index.tsx` の JSDoc が正。

## 振る舞い

- 検証は 1 ファイルずつ、種類（`accept`）→ サイズ（`maxSizeMB`）→ 件数（`maxFiles`）の順に行い、外れたファイルごとに `onReject(file, reason)` が呼ばれる。通ったファイルが 1 つも無ければ `onValueChange` は呼ばれない。
- `accept` は拡張子（`.pdf`）と MIME（`image/*`、`application/pdf`）の両方を見る。ドラッグ＆ドロップで入れたファイルもボタンで選んだファイルと同じ検証を通る。
- `multiple` を付けないときは常に 1 件だけを持ち、次に選んだファイルで置き換わる。同時に 2 件落とすと 2 件目は `count` で拒否される（`maxFiles` は `multiple` のときだけ効く）。
- タブ順とアクセシブルネームを持つのは視覚的に隠した `<input type="file">` のほうで、見えている「ファイルを選ぶ」ボタンは `aria-hidden` かつ `tabIndex={-1}` のマウス専用。ドロップ領域自体もポインタ操作だけに対応する。
- 選んだ直後に中の input を空に戻すので、いったん外した同じファイルをもう一度選び直せる。
- `accept` か `maxSizeMB` を渡すと、領域の下に条件（「.pdf / image/*、10 MB まで」）が自動で出る。一覧のサイズ表示は 1 KB 未満が B、1 MB 未満が KB、それ以上が MB（小数 1 桁）。

## 内容

- 自動で出る条件表示は機械的な表記（`.pdf / image/*`）なので、人の言葉の説明は補足（FormDescription）に別途書く。
- `onReject` の文言は理由ごとに変え、起きたことと次にすることを書く。`type`「PDF か画像だけ添付できます」、`size`「10 MB を超えるファイルは添付できません。圧縮してから選び直してください」、`count`「添付できるのは 5 件までです」。
- `dropText` は後ろにボタンが続くので「〜、または」で終える。`buttonText` は「ファイルを選ぶ」のように動詞で終える。
- `removeLabelSuffix` はファイル名の後ろに空白を挟んで読み上げられるので、「を外す」のように助詞から始める。

## 参考文献

- [MDN: &lt;input type="file"&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
- [shadcn/ui: Input](https://ui.shadcn.com/docs/components/input)
