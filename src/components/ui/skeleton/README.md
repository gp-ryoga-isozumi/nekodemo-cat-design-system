# Skeleton

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

読み込み中のプレースホルダー（設計書 §9.1 #6、§10.2）。一覧は 5 行、カードは 3 枚を目安に、
実際の内容と同じ形で置く。

## アンチパターン

- ボタンの処理中に使う（Spinner）
- 読み込みが終わっても残す

## 推奨例

- 一覧は `SkeletonRows rows={5}`、カード群は Skeleton を 3 枚置いて、読み込み中の状態を埋める
- `className` で実際の内容と同じ高さ・幅にそろえ、表示が切り替わったときに位置が動かないようにする
- 詳細画面は見出しと本文の形に分けて置き、読み込みが終わったら中身と差し替える

## 使用例

```tsx
<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-round" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-4 w-3/5" />
    <Skeleton className="h-4 w-4/5" />
  </div>
</div>
```
