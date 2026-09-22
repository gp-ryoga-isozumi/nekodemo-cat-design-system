# InputTime

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

時刻の入力（v1.2）。ブラウザ標準の `<input type="time">` を Input と同じ見た目にし、右端に猫耳の
`schedule` ボタンを置く（押すとブラウザの時刻一覧が開く）。値は `HH:MM` の 24 時間表記で、
`stepMinutes`（既定 15）で刻みを決める。日付と組にするときは InputDate と横に並べる。
時刻一覧のボタンはタブ順に入れず、キーボードでは入力欄で時・分を直接打つ。

## アンチパターン

- 自由書式のテキスト入力にする（「9:00」「9時」「09:00」の揺れを検証するコストが高い）
- 分単位が要らないのに `stepMinutes={1}` にする（候補が 1,440 個になる）
- `<label>` を付けない（Form の Field で付ける）
- 値を変えさせたくないのに `readOnly` にする（`type="time"` はブラウザによって readOnly でも時刻一覧が開く。`disabled` にする）

## 推奨例

- 開始・終了の時刻は InputTime を 2 つ並べ、`min` / `max` で互いを制限する
- 会議や作業の予定は `stepMinutes={15}`、シフトのように粗い刻みは `stepMinutes={30}`
- 日時が要るときは InputDate + InputTime を横に並べ、Field のラベルを 1 つにする

## 使用例

```tsx
<InputTime id="start" defaultValue="09:00" stepMinutes={15} />
<InputTime id="end" value={end} onValueChange={setEnd} min={start} size="sm" />
```
