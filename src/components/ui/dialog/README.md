# Dialog

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

確認ダイアログ専用（設計書 §9.1 #31、§10.3）。削除や取り消し不可の操作の前に挟む。
Radix AlertDialog ベースで、外側クリックでは閉じず（Esc では閉じる）、原則ボタンで答える。
破壊的操作の確定ボタンは `DialogAction variant="negative"`、文言は「削除する」のように動作を書く（「OK」「はい」は禁止）。
フォームや長い内容は Modal を使う。

## アンチパターン

- 確定ボタンを「OK」「はい」にする
- 確定ボタンを primary にする（破壊的操作は negative）
- 入力フォームを入れる（Modal）

## 推奨例

- 削除・公開停止など取り消せない操作の直前に挟み、`DialogTitle` に「この案件を削除しますか？」と問いを書く
- `DialogDescription` に影響する範囲（一緒に消えるもの、取り消せないこと）を書く
- 確定は `DialogAction variant="negative"` で「削除する」、取り消しは `DialogCancel` で「キャンセル」にする

## 使用例

```tsx
<Dialog>
  <DialogTrigger asChild><Button variant="negative">削除する</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>この案件を削除しますか？</DialogTitle>
      <DialogDescription>関連する 8 件のタスクも削除されます。この操作は取り消せません。</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogCancel>キャンセル</DialogCancel>
      <DialogAction variant="negative" onClick={remove}>削除する</DialogAction>
    </DialogFooter>
  </DialogContent>
</Dialog>
```
