# InputNumber

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

数値の入力（v1.2）。テキスト入力（`inputMode="numeric"`）に増減ボタンと単位を付けたもの。
`min` / `max` の範囲に収め、↑↓ キーでも `step` ずつ増減する（増減ボタンはタブ順に入れない）。全角数字とカンマは受け付けて半角に直す。
見た目は Input と同じ（sm 32 / md 40 / lg 48px）。表示中は 3 桁区切り、編集中は区切りなし。

## アンチパターン

- 電話番号・郵便番号・ID のように「数字だが数値ではない」ものに使う（Input に `inputMode="numeric"`）
- 単位を placeholder に書く（`unit` に書く）
- `<label>` を付けない（Form の Field で付ける）

## 推奨例

- 金額・数量・件数など「計算する数」に使い、`unit` に単位を書く（「円」「件」）
- `step` を業務の刻みに合わせる（金額は 1,000 や 10,000、数量は 1）
- `min` / `max` で範囲を決め、範囲外は blur で丸める（エラーにしない）

## 使用例

```tsx
<InputNumber id="amount" unit="円" min={0} step={1000} defaultValue={1200000} />
<InputNumber id="qty" size="sm" min={1} max={99} value={qty} onValueChange={setQty} />
```
