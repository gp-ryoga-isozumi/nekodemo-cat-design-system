# Drawer

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

画面端から出るサイドパネル（設計書 §9.1 #33）。一覧を見ながら詳細を確認・編集する用途。
右（既定）／左／下から出せる。Radix Dialog ベース。

## アンチパターン

- 確認だけに使う（Dialog）
- DrawerTitle を省略する
- 幅を画面いっぱいにする（一覧が見えなくなる。最大 480px）

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
