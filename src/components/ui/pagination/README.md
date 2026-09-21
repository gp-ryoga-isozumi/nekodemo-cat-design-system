# Pagination

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

一覧のページ送り（設計書 §9.1 #28、§10.1 A）。件数の要約（「120件中 1〜20件を表示」）と、前後ボタン・ページ番号。
数値は等幅フォント。

## アンチパターン

- 件数が 1 ページに収まるのに表示する（total <= pageSize なら要約だけにするか出さない）
- 「もっと見る」と併用する

## 使用例

```tsx
<Pagination page={page} total={120} pageSize={20} onPageChange={setPage} />
```
