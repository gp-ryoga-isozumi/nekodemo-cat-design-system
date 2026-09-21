# Textarea

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

複数行のテキスト入力（設計書 §9.1 #18）。`maxLength` を渡すと右下に文字数カウンタ（12/200）が出る。
見た目は Input と同じ役割トークン。ラベル・補足・エラーは Form の Field で付ける。

## アンチパターン

- 1 行で足りる入力に使う（Input）
- 高さを固定して中身をスクロールさせる（resize-y で伸ばせるようにしておく）

## 使用例

```tsx
<Textarea id="memo" maxLength={200} placeholder="メモ" />
<Textarea rows={6} aria-invalid aria-describedby="memo-error" />
```
