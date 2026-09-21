# Modal

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

その場で完結する短い入力やコンテンツ用のモーダル（設計書 §9.1 #32、§10.3）。
3 項目を超えるフォームはページにする。確認だけなら Dialog。Radix Dialog ベース（Esc・外側クリックで閉じる）。

## アンチパターン

- 長いフォームや一覧を入れる（ページか Drawer）
- ModalTitle を省略する（読み上げに必要。視覚的に隠すなら className="sr-only"）
- モーダルの中からモーダルを開く

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
