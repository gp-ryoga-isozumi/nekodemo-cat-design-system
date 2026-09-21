# Popover

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

トリガーの近くに出る小さなパネル（設計書 §9.1 #30）。列の表示切替、日付選択、短い補足フォームなどに使う。
Radix Popover ベース（Esc・外側クリックで閉じる）。

## アンチパターン

- 操作の一覧に使う（Menu）
- 長いフォームを入れる（Modal / Drawer）
- PopoverTitle を省略する（読み上げに必要。視覚的に隠すなら className="sr-only"）

## 使用例

```tsx
<Popover>
  <PopoverTrigger asChild><Button variant="outline" size="sm">列の表示</Button></PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>列の表示</PopoverTitle>
    …
  </PopoverContent>
</Popover>
```
