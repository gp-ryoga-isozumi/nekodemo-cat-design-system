# Breadcrumb

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

現在地の階層（設計書 §9.1 #26）。詳細画面の最上部に置く（§10.1 B）。区切りは耳なしの `chevron_right`。
最後の項目は BreadcrumbPage（リンクにしない、`aria-current="page"`）。

## アンチパターン

- 一覧画面（最上位）に置く
- 4 階層を超える（中間を BreadcrumbEllipsis で省略する）

## 使用例

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">ホーム</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/projects">案件</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>社内備品貸出アプリ 改修</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```
