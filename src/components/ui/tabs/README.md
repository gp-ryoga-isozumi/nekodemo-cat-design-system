# Tabs

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

同じ階層の内容を切り替える（設計書 §9.1 #25）。横（既定）と縦（`orientation="vertical"`、設定画面の左ナビ用 §10.1 D）。
Radix ベースでキーボード操作（←→ / ↑↓）は自動。

## アンチパターン

- 画面遷移の代わりに使う（URL が変わる移動は SideNavigation / Link）
- タブが 6 個を超える（分割か Select を検討）

## 推奨例

- 詳細画面（画面の型 B）で情報が多いときに、同じ対象の面（概要・タスク・履歴）を 2〜6 個に分ける
- 設定画面（画面の型 D）の左ナビは `orientation="vertical"` にする
- `TabsList` に `aria-label` を付けて何の切替かを示し、タブ名は名詞にする
- 件数を見せたいタブは `TabsTrigger` の中に Badge を置く

## 使用例

```tsx
<Tabs defaultValue="overview">
  <TabsList aria-label="案件の情報">
    <TabsTrigger value="overview">概要</TabsTrigger>
    <TabsTrigger value="tasks">タスク <Badge variant="neutral" count={8} /></TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>
```
