# Button

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

操作の起点。variant は primary（主アクション）/ secondary / outline / ghost / negative（削除など破壊的操作）、
size は sm 32 / md 40 / lg 48px。`loading` で毛糸玉 Spinner を出す（設計書 §9.1 #1）。

## アンチパターン

- 1 画面に primary を 2 つ以上置く（§10.3。他は secondary / outline / ghost）
- 文言を「OK」「はい」にする（「保存する」「削除する」のように動作を書く）
- アイコンだけのボタンに使う（IconButton を使い label を付ける）
- 削除確認の確定ボタンを primary にする（negative）

## 使用例

```tsx
<Button>保存する</Button>
<Button variant="outline" size="sm">キャンセル</Button>
<Button variant="negative">削除する</Button>
<Button loading>保存中</Button>
<Button><Icon icon="add" size={4} />案件を追加する</Button>
```
