# Slider

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

範囲内の数値を選ぶ（設計書 §9.1 #23）。値の表示は呼び出し側で `<output>` 等に出す。
`label` は各つまみの `aria-label` になる。

## アンチパターン

- 正確な数値入力に使う（Input type=number）
- 値を表示しない

## 推奨例

- 通知する日数・表示件数のように、だいたいの値を素早く決める設定に使う
- `label` に何を決めるつまみかを書き、現在の値は `<output>` で数値としても見せる
- `min` / `max` を業務の上下限に合わせ、`step` を業務の刻みにする
- 範囲で絞り込むときは値を 2 つの配列で渡し、`label` もつまみごとの配列にする

## 使用例

```tsx
<Slider label="通知する日数" min={1} max={30} defaultValue={[7]} onValueChange={([v]) => setDays(v)} />
```
