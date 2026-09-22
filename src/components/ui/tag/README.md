# Tag

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

絞り込み条件やラベルを示すチップ（設計書 §9.1 #11）。`onRemove` を渡すと × で外せる。
状態（進行中・完了・確認待ち・差し戻し）は StatusTag を使う（色はステータス色だけ。装飾に使わない §10.5）。

## アンチパターン

- ボタン代わりに使う（クリックで何かをするなら Button）
- 件数を入れる（Badge）

## 推奨例

- 一覧の絞り込み行に、今かかっている条件を `variant="selected"` で並べ、`onRemove` で 1 つずつ外せるようにする
- 進行中・完了・差し戻しなどの状態は StatusTag の `status` で表し、意味どおりの色を割り当てる（完了は success、差し戻しは negative）
- 「読み取り専用」「下書き」のような状態でないラベルは `variant="default"` の Tag にする
- 条件が複数あるときは Tag の並びの末尾に「条件をクリアする」の ghost ボタンを添える

## 使用例

```tsx
<Tag variant="selected" onRemove={() => clear("status")}>状態: 進行中</Tag>
<Tag>読み取り専用</Tag>
<StatusTag status="success">完了</StatusTag>
```
