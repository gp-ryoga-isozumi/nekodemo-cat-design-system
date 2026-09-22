# InputTime

部品ページ（/guidelines/components/input-time/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/input-time/index.tsx` の JSDoc が正。

## 振る舞い

- 高さは Input と同じ sm 32 / md 40 / lg 48px で、右端の `schedule` ボタンのぶん入力欄の右に 40px 空けてある。InputDate と横に並べるときは `size` をそろえる。
- `stepMinutes` はそのまま `step={stepMinutes * 60}`（秒）として `<input type="time">` に渡る。既定の 15 ならブラウザが出す候補と ↑ ↓ の増減幅が 15 分刻みになる。
- ボタンは `tabIndex={-1}` でタブ順に入らない。キーボードでは入力欄で時・分を直接打ち、ボタンは `showPicker()` に失敗すると入力欄へのフォーカスに落ちる。
- 値の受け渡しは `HH:MM` の 24 時間表記で、秒は扱わない。画面上が「09:00」か「午前 9:00」になるかはブラウザの言語設定が決める。
- 数字は等幅（`font-mono tabular-nums`）なので、開始と終了を縦に並べても桁がそろう。
- `disabled` にすると入力欄とボタンの両方が無効になり、枠が `surface-disabled` になる。

## 内容

- ラベルは時刻の意味を名詞で書く（「開始時刻」「終了時刻」）。「時間」は所要時間と紛れるので使わない。
- 本文や一覧に時刻を出すときは `HH:mm`（13:05）にそろえる。「13時5分」と混ぜない。
- 刻みの意図は補足に 1 行で書く（「15 分単位で指定してください」）。`placeholder` には書かない。
- 本文で時間帯を表すときは「9:00 〜 18:00」と結ぶ。入力欄そのものの間には「〜」を置かず、ラベルで開始と終了を書き分ける。

## 参考文献

- [MDN: &lt;input type="time"&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time)
- [Material Design 3: Time pickers](https://m3.material.io/components/time-pickers/guidelines)
