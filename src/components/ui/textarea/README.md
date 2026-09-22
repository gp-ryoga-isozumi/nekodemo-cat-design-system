# Textarea

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

複数行のテキスト入力（設計書 §9.1 #18）。`maxLength` を渡すと右下に文字数カウンタ（12/200）が出る。
見た目は Input と同じ役割トークン。ラベル・補足・エラーは Form の Field で付ける。

## アンチパターン

- 1 行で足りる入力に使う（Input）
- 高さを固定して中身をスクロールさせる（resize-y で伸ばせるようにしておく）

## 推奨例

- 備考・問い合わせ内容など、改行を含む自由記述に使い、ラベルと補足は Form の Field で付ける
- 文字数の上限が決まっているものは `maxLength` を渡し、カウンタで残りを見せる
- 初期の高さは `rows` を想定の行数に合わせ、足りないときは利用者が縦に伸ばせるようにしておく

## 使用例

```tsx
<Textarea id="memo" maxLength={200} placeholder="メモ" />
<Textarea rows={6} aria-invalid aria-describedby="memo-error" />
```
