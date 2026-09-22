# Drawer

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

画面端から出るサイドパネル（設計書 §9.1 #33）。一覧を見ながら詳細を確認・編集する用途。shadcn の Sheet に相当。右上の × は `DrawerContent showCloseButton={false}` で消せる。
右（既定）／左／下から出せる。Radix Dialog ベース。

## アンチパターン

- 確認だけに使う（Dialog）
- DrawerTitle を省略する
- 幅を画面いっぱいにする（一覧が見えなくなる。最大 480px）

## 推奨例

- 一覧を見たまま 1 件の詳細を確認・編集する場面で、行を選んで右から開く
- 見出しは `DrawerTitle` に項目名、本文は `DrawerBody`、操作は `DrawerFooter` にまとめる
- 画面の下から出す補助的な操作パネルには `side="bottom"` を使う

## 使用例

```tsx
<Drawer>
  <DrawerTrigger asChild><Button variant="outline">詳細を見る</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader><DrawerTitle>社内備品貸出アプリ 改修</DrawerTitle></DrawerHeader>
    <DrawerBody>…</DrawerBody>
    <DrawerFooter><Button variant="outline" size="sm">編集する</Button></DrawerFooter>
  </DrawerContent>
</Drawer>
```
