# InlineMessage

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

画面内に埋め込むメッセージ（設計書 §9.1 #9）。info / success / warning / negative。
一覧やフォームのエラーは全画面にせず、この部品を該当箇所に置いて「再試行」を付ける（§10.2）。
negative は `role="alert"`、それ以外は `role="status"`。

## アンチパターン

- 一時的な成功通知に使う（Toast）
- 装飾やお知らせバナーに success / warning の色を使う（ステータス色は状態表現だけ。§10.5）

## 推奨例

- 読み込みや保存に失敗した領域のすぐ上に `variant="negative"` で置き、`action` に「再試行する」を添える
- あらかじめ知らせておく制約や予定は `variant="info"` にし、`title` に要点、本文に詳細を書く
- 本文には「何が起きたか」と「どうすればよいか」の両方を書く

## 使用例

```tsx
<InlineMessage variant="negative" action={<Button variant="outline" size="sm" onClick={retry}>再試行</Button>}>
  一覧を読み込めませんでした。通信状態を確認して再試行してください。
</InlineMessage>
<InlineMessage variant="info" title="自動完了">この案件は 2026/09/30 に自動で完了になります。</InlineMessage>
```
