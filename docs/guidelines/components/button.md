# Button

部品ページ（/guidelines/components/button/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/button/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は文言に合わせる。`w-full` にするのは、フォームの送信やモーダルの下端のように縦に積む場面だけ。最小幅は設けない。
- 文言が 2 行に折り返す長さなら、幅を広げるのではなく文言を短くする。省略記号（…）で切らない。
- `loading` のあいだは幅を保ったまま左のアイコンが Spinner に変わり、`disabled` と同じく押せない。連打しても 2 回送信されない。
- `asChild` で `<a>`（NextLink）を包むと画面遷移のボタンになる。見た目は同じだが、キーボードの振る舞いはリンク（Enter で遷移、Space では押せない）。
- 同じ行に並べるボタンは同じ `size` にし、主ボタン（primary）を右端に置く（Dialog / Drawer のフッターと同じ並び）。
- フォーカスリングはキーボード操作（focus-visible）のときだけ出る。マウスのクリックでは出ない。

## 内容

- 動詞で終える（「保存する」「送信する」「削除する」）。名詞だけ（「保存」）や英語（Save / OK）にしない。
- 取り消せない操作は対象を含める（「案件を削除する」）。確認 Dialog の中では「削除する」と「キャンセル」の 2 択にする。
- 長さは 2〜8 文字。「〜します」（説明文の語尾）や「〜してください」は使わない。
- アイコンだけのボタンは IconButton にし、`label` で読み上げ名を付ける。Button に空の children を渡さない。

## 参考文献

- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [shadcn/ui: Button](https://ui.shadcn.com/docs/components/button)
- [Material Design 3: Buttons](https://m3.material.io/components/buttons/guidelines)
