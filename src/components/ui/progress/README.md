# Progress

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

処理の進み具合を示す横棒（v1.2）。`value` を渡すと確定（0〜100%）、省略すると不確定（全体が明滅）。
100% で success 色になる。`role="progressbar"` と `aria-valuenow` を持ち、`label` が読み上げ名になる。
回転する小さな待機表示は Spinner、一覧の読み込みは Skeleton を使う。

## アンチパターン

- 何の処理かを示すラベルを付けない（`label` は必須。見出しやテキストも添える）
- 同じ処理に Spinner と Progress を両方出す
- 手順の進み具合に使う（Stepper）

## 推奨例

- ファイルのアップロードや一括取り込みのように、割合が分かる処理に `value` を渡す
- 割合が分からない処理は `value` を省略し、文言で「取り込み中…」と添える
- 100% になったら Toast か InlineMessage で完了を伝え、バーは消すか success のまま残す

## 使用例

```tsx
<Progress label="アップロード" value={42} showValue />
<Progress label="取り込み" size="sm" />
```
