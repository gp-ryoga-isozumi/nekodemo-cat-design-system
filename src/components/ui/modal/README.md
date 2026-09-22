# Modal

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

その場で完結する短い入力やコンテンツ用のモーダル（設計書 §9.1 #32、§10.3）。
shadcn の **Dialog** に相当する（shadcn の AlertDialog は nekodemo では Dialog）。閉じるボタンと外側クリックで閉じられる（`ModalContent showCloseButton={false}` で右上の × を消せる）。
3 項目を超えるフォームはページにする。確認だけなら Dialog。Radix Dialog ベース（Esc・外側クリックで閉じる）。

## アンチパターン

- 長いフォームや一覧を入れる（ページか Drawer）
- ModalTitle を省略する（読み上げに必要。視覚的に隠すなら className="sr-only"）
- モーダルの中からモーダルを開く

## 推奨例

- 一覧や詳細から離れずに終わる 3 項目までの入力（担当者の変更、期限の延長）に使う
- `ModalTitle` にその場でする操作を書き、`ModalFooter` はキャンセル（`ModalClose`）と主ボタンの 2 つだけにする
- 保存できたら閉じて、呼び出し元の画面で Toast（success）を出す
- 入力が 3 項目を超えたら Modal をやめて作成・編集フォームのページにする

## 使用例

```tsx
<Modal>
  <ModalTrigger asChild><Button variant="outline">担当者を変更する</Button></ModalTrigger>
  <ModalContent>
    <ModalHeader><ModalTitle>担当者を変更する</ModalTitle></ModalHeader>
    <ModalBody>…</ModalBody>
    <ModalFooter>
      <ModalClose asChild><Button variant="ghost">キャンセル</Button></ModalClose>
      <Button onClick={save}>変更する</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```
