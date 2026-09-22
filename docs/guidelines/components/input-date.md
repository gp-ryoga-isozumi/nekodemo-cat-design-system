# InputDate

部品ページ（/guidelines/components/input-date/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input-date/index.tsx` の JSDoc が正。

## 振る舞い

- 高さは Input と同じ sm 32 / md 40 / lg 48px。右端のカレンダーボタン（sm 28 / md 32 / lg 40px）のぶん入力欄の右に 40px の余白を取ってあるので、値とボタンが重ならない。
- カレンダーボタンは `tabIndex={-1}` でタブ順に入らない。キーボードでは入力欄に入り、年・月・日の欄をブラウザ標準の操作（← → で欄の移動、↑ ↓ で増減）で埋める。
- ボタンは `showPicker()` を呼ぶ。非対応のブラウザや呼び出しが拒否された場合は入力欄にフォーカスするだけに落ちるので、押しても何も起きない状態にはならない。
- ブラウザ標準のカレンダーアイコンは隠してあり、右端に見えるのは猫耳の `calendar_today` だけになる。
- `readOnly` は入力欄を読み取り専用にしたうえでカレンダーボタンだけを無効にする。`disabled` は両方を無効にし、枠が `surface-disabled` になる。
- 値の受け渡しは常に `YYYY-MM-DD` の文字列（`min` / `max` も同じ書式）で、画面上の並びはブラウザの言語設定が決める。日本語環境では `2026/09/22` になる。

## 内容

- ラベルは日付の意味を名詞で書く（「納品予定日」「開始日」）。「日付」だけにしない。
- 本文や一覧に日付を出すときは `YYYY/MM/DD`（2026/09/22）に整える。`value` の `YYYY-MM-DD` をそのまま文中に出さない。
- 入力例は `placeholder` ではなく補足に書く（`type="date"` では `placeholder` が表示されない）。
- 期間は「開始日」「終了日」と 2 つのラベルを付け、関係は補足に 1 行で書く（「終了日は開始日以降を選んでください」）。

## 参考文献

- [MDN: &lt;input type="date"&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [shadcn/ui: Date Picker](https://ui.shadcn.com/docs/components/date-picker)
- [Material Design 3: Date pickers](https://m3.material.io/components/date-pickers/guidelines)
