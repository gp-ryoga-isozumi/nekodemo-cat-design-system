# InputDate

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

日付の入力（v1.2）。ブラウザ標準の `<input type="date">` を Input と同じ見た目にし、右端に猫耳の
`calendar_today` ボタンを置く（押すとブラウザのカレンダーが開く）。値は `YYYY-MM-DD` の文字列で、
表示形式はブラウザの言語設定に従う（日本語環境では 2026/09/22）。カレンダーボタンはタブ順に入れず（`tabIndex=-1`）、
キーボードでは入力欄で年月日を直接打つ。
期間の入力は InputDate を 2 つ並べ、`min` / `max` で互いを制限する。

## アンチパターン

- 自由書式のテキスト入力にする（区切りや桁の揺れを検証するコストが高い）
- 生年月日のように遠い年を選ばせるのにカレンダーだけを提供する（キーボード入力を塞がない）
- `<label>` を付けない（Form の Field で付ける）

## 推奨例

- 納期・開始日・終了日のように「日付を 1 つ選ぶ」入力に使う
- 期間は InputDate を 2 つ並べ、開始の `max` に終了、終了の `min` に開始を渡す
- 既定値には `YYYY-MM-DD` の文字列を渡し、表示形式はブラウザに任せる

## 使用例

```tsx
<InputDate id="due" defaultValue="2026-10-31" min="2026-01-01" />
<InputDate id="from" value={from} onValueChange={setFrom} max={to} size="sm" />
```
