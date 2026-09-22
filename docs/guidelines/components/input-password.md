# InputPassword

部品ページ（/guidelines/components/input-password/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input-password/index.tsx` の JSDoc が正。

## 振る舞い

- 高さは Input と同じ sm 32 / md 40 / lg 48px。右端の切り替えボタン（32px）の分だけ入力の右余白が広がるので、末尾の文字が隠れない。
- 切り替えボタンは `type` を `password` と `text` の間で入れ替えるだけで、入力中の文字とキャレットの位置は保たれる。
- 表示状態は部品の中に持つ。1 度表示にすると、送信しても再描画されない限り表示のまま残る。共有画面で使う画面は自分で戻す作りにする。
- ボタンは `aria-pressed` と読み上げ名（「パスワードを表示」「パスワードを隠す」）が切り替わる。Tab の順序は入力 → 切り替えボタン。
- `disabled` を渡すと入力と切り替えボタンがまとめて無効になる。`autoComplete` は用途に合わせて渡す（`current-password` / `new-password`）。

## 内容

- ラベルは「パスワード」。新規設定や変更の画面では「新しいパスワード」と書き分ける。
- 文字数や使える記号の条件は FormDescription に入力前から出す。エラーになってから初めて条件を見せない。
- エラー文は「パスワードが違います」で止めず、次にできること（「もう一度入力してください」）まで書く。
- 切り替えボタンの名前は実装が持つので、横に「表示」などの文字を足さない。

## 参考文献

- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [shadcn/ui: Input](https://ui.shadcn.com/docs/components/input)
- [MDN: `<input>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
