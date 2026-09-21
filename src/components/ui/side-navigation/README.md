# SideNavigation

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

画面左の主ナビ（設計書 §9.1 #27、§10.1）。幅 240px、折りたたむと 64px（アイコンだけ）。
SideNavGroup で見出しを付け、SideNavItem に `icon` と `active` を渡す。Next.js の Link は `asChild` で包む。
ロゴ枠にはマスコットを置ける（§8.6）。

## アンチパターン

- 項目を 8 個以上並べる（グループ化するか設定に寄せる）
- 現在地（active）を付けない

## 使用例

```tsx
<SideNavigation logo={<><Mascot theme="calico" size={32} /><span>案件管理</span></>}>
  <SideNavItem icon="home" href="/">ダッシュボード</SideNavItem>
  <SideNavItem icon="folder" href="/projects" active badge={3}>案件</SideNavItem>
  <SideNavGroup label="管理">
    <SideNavItem icon="settings" href="/settings">設定</SideNavItem>
  </SideNavGroup>
</SideNavigation>
```
