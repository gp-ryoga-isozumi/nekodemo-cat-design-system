# Accordion

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

見出しを押して本文を開閉する一覧（v1.2）。設定画面の詳細項目、FAQ、詳細画面の「もっと見る」に使う。
`type="single"`（1 つだけ開く。`collapsible` で全部閉じられる）か `type="multiple"`。
見出しはボタン（`aria-expanded`）、本文は `role="region"` で結び付く（Radix）。矢印は耳なしの `keyboard_arrow_down`。

## アンチパターン

- 主要な情報を畳む（一覧・詳細の本題は開いた状態で見せる。畳むのは補足）
- 画面の切替に使う（Tabs）
- 項目が 1 つだけ（見出し付きの Card にする）

## 推奨例

- 設定画面で「高度な設定」「通知の詳細」のように、普段は触らない項目を畳む
- FAQ や仕様の補足は `type="single" collapsible` で 1 つずつ読ませる
- 見出しは質問文か名詞（「請求先を変更するには」「対応ブラウザ」）にし、本文は 3〜5 行に収める

## 使用例

```tsx
<Accordion type="single" collapsible defaultValue="notify">
  <AccordionItem value="notify">
    <AccordionTrigger>通知の詳細</AccordionTrigger>
    <AccordionContent>納期の 3 日前と当日にメールで通知します。</AccordionContent>
  </AccordionItem>
</Accordion>
```
