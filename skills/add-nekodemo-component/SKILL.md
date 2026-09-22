---
name: add-nekodemo-component
description: >
  nekodemo の部品を shadcn registry から利用側プロジェクトに copy-in するスキル。
  「Avatar を追加」「registry から入れて」「nekodemo の Table だけ使いたい」で発動。
  components.json に @nekodemo registry を登録し、npx shadcn add @nekodemo/<name> を実行する。
---

# add-nekodemo-component

## 前提チェック
1. `components.json` があるか。無ければ `npx shadcn@latest init` を実行する（Tailwind v4、`cssVariables: true`）。
2. npm パッケージの `nekodemo` を既に使っている場合は、copy-in は不要なことを伝える（`import { Avatar } from "nekodemo"` で使える）。両方混在させない。
3. トークン CSS が入っているか（`styles/nekodemo-tokens.css` があり、エントリ CSS から `@import` されている）。無ければ手順 2 を先に行う。

## 手順
1. `components.json` に registry を登録する（既にあれば飛ばす）:
   ```json
   { "registries": { "@nekodemo": "https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/r/{name}.json" } }
   ```
2. トークンとテーマを入れる: `npx shadcn@latest add @nekodemo/styles @nekodemo/theme`。`styles/nekodemo-tokens.css` と `styles/nekodemo-themes.css` が入るので、エントリ CSS の `@import "tailwindcss";` の後に `@import "tw-animate-css";` と 2 ファイルの `@import` を足す（`tw-animate-css` は `pnpm add tw-animate-css`）。ルートには `NekoThemeProvider` と `data-neko-theme` を置く（`docs/ai/SETUP.md` §4）。
3. 依頼された部品を入れる: `npx shadcn@latest add @nekodemo/<name>`（例: `@nekodemo/avatar`）。`registryDependencies`（`icon`、`button` 等）も同時に入る。
4. 入った部品の import パスを確認する（`@/components/ui/<name>`）。部品内の `../icon` 等の相対 import が解決できていること。`shadcn init` が入れた既定の `components/ui/button.tsx` などの同名ファイルや `lucide-react` が残っていれば削除する（`button.tsx` が残ると `@/components/ui/button` がそちらに解決される）。
5. `pnpm nekodemo check src` を実行して error が 0 件であることを確認する（warn は内容を確認する）。

## 部品名（registry の name）
avatar, badge, breadcrumb, button, card, checkbox, dialog, divider, drawer, empty-state, form, icon, icon-button, inline-message, input, input-password, input-search, link, menu, modal, pagination, popover, radio, select, side-navigation, skeleton, slider, spinner, switch, table, tabs, tag, textarea, toast, tooltip

avatar, badge, breadcrumb, button, card, checkbox, data-grid, dialog, divider, drawer, empty-state, form, icon, icon-button, inline-message, input, input-password, input-search, link, menu, modal, pagination, popover, radio, search-combobox, select, side-navigation, skeleton, slider, spinner, switch, table, tabs, tag, textarea, toast, tooltip

## 完了条件
- 部品が `components/ui/<name>/index.tsx` として入り、型エラーが無い。
- ストーリーや使用例（部品の JSDoc）どおりに描画できる。

## やってはいけないこと
- copy-in した部品の色クラスを書き換える（役割トークンのまま使う）。
- `lucide-react` を追加する（nekodemo の部品は `Icon` を使う）。
- registry の URL を書き換える。
