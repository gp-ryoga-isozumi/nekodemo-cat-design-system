# Pagination

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

一覧のページ送り（設計書 §9.1 #28、§10.1 A）。件数の要約（「120件中 1〜20件を表示」）と、前後ボタン・ページ番号。
数値は等幅フォント。

## アンチパターン

- 件数が 1 ページに収まるのに表示する（total <= pageSize なら要約だけにするか出さない）
- 「もっと見る」と併用する

## 推奨例

- 一覧（画面の型 A）の Table の下に置き、`page` / `total` / `pageSize` を検索条件と一緒に持つ
- `unit` に業務の単位を渡す（「件」「名」「社」）
- 絞り込みや並び順を変えたら `onPageChange(1)` で 1 ページ目に戻す
- 1 ページに収まるときも `showSummary` の件数要約は残す（ページ番号は自動で消える）

## 使用例

```tsx
<Pagination page={page} total={120} pageSize={20} onPageChange={setPage} />
```
