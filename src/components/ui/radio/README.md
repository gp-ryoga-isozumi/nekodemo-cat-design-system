# Radio

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

排他選択（設計書 §9.1 #21）。RadioGroup の中に RadioItem を並べる。選択肢は 2〜5 個、常に見せたいときに使う。
ラベルは `<label htmlFor>` で結ぶ。

## アンチパターン

- 選択肢が 6 個以上（Select）
- 単一の ON/OFF（Switch）
- RadioGroup に `aria-label` も `aria-labelledby` も付けない

## 使用例

```tsx
<RadioGroup defaultValue="internal" aria-label="公開範囲" className="flex gap-4">
  <div className="flex items-center gap-2">
    <RadioItem value="internal" id="scope-internal" />
    <label htmlFor="scope-internal" className="text-2">社内のみ</label>
  </div>
</RadioGroup>
```
