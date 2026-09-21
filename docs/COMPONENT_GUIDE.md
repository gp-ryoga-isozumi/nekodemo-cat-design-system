# 部品の作法（Phase 4 の実装ガイド）

設計書 §9.2 と AGENTS.md §5 の具体化。1 部品 = `src/components/ui/<kebab-name>/` の 5 点セット。

| ファイル | 内容 |
|---|---|
| `index.tsx` | 実装。先頭に JSDoc（概要／アンチパターン／使用例、日本語）。`"use client"` は Radix や hooks を使うときだけ |
| `index.stories.tsx` | Storybook。`title: "UI/<PascalName>"`、`tags: ["autodocs"]`。全 variant・size・状態（disabled / loading / invalid / empty 等）を別ストーリーで。a11y 違反 0 |
| `index.test.tsx` | Vitest + Testing Library。表示・操作・disabled・アクセシブルネームの 4 観点（該当しない観点は省略可だが理由をコメント） |
| `README.md` | JSDoc と同じ内容（`pnpm build:readmes` で再生成される。手書きでも可） |
| `item.json` | shadcn registry の定義。`registryDependencies` に依存する nekodemo 部品名、`dependencies` に npm 依存、`meta.shadcnSource` に元の shadcn 部品名 |

## 実装の決まり

- import は相対パスのみ（`../../../lib/utils`、`../icon`）。`@/` は使わない（`pnpm lint` の lint-imports が検査）。
- 色・角丸・文字サイズは役割トークンだけ: `bg-surface-card` `text-text-low` `border-border-high` `text-object-middle` `rounded-action` `rounded-container` `rounded-notice` `rounded-round` `text-1〜12` `shadow-raise/float/popout`。`#hex` / `rgb()` / Tailwind 既定パレット / `text-[13px]` / `rounded-[…]` / `font-medium` は禁止（`pnpm check` の NK001〜NK007）。
- アイコンは `<Icon icon="search" size={5} />`（`../icon`）。`lucide-react` は使わない。矢印・チェック・× は耳なしで表示される。
- 状態は `data-slot` / `data-variant` / `data-size` / `data-state` で表す。shadcn の `data-slot` 命名を踏襲。
- フォーカスは `outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus`（入力欄は `focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/30`）。
- 無効は `disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-text-disabled`（opacity で薄くしない）。
- variant 名は `primary / secondary / outline / ghost / negative`、size は `sm / md / lg`（設計書 §9.2）。
- アクセシブルネームが必要な部品（IconButton・Avatar・Spinner 等）は props で必須にする。
- 文言は「です・ます」、ボタンは「〜する」。ストーリーの例文も同じ（案件管理アプリを題材にする）。
- Badge は単独ではアクセシブルネームを持たない（数字だけの span）。IconButton に重ねるときは IconButton の label に件数を含め（例: 「通知を見る（未読 3 件）」）、Badge には `aria-hidden` を付ける。span に `aria-label` を付けると axe の aria-prohibited-attr になる。
- `cn()`（tailwind-merge）には nekodemo の文字サイズ段階・角丸・影を登録してある（`src/lib/utils.ts`）。新しいトークン名の名前空間を増やしたらそこにも追加する。

## 参考にする実装

- `src/components/ui/button/`（cva、asChild、loading、stories、test）
- `src/components/ui/input/`（cva の size、aria-invalid）
- `src/components/ui/checkbox/`（Radix ベース、猫の顔のチェックマーク）
- `src/components/ui/icon/`（stories の Catalog、test の警告検査）

## 検査

```bash
pnpm lint && pnpm typecheck && pnpm check
pnpm exec vitest run --project unit src/components/ui/<name>
pnpm exec vitest run --project storybook   # a11y を含むストーリーの実行
```

## item.json の形

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "操作の起点。primary / secondary / outline / ghost / negative、sm / md / lg、loading",
  "registryDependencies": ["spinner"],
  "dependencies": ["class-variance-authority", "radix-ui"],
  "files": [{ "path": "src/components/ui/button/index.tsx", "type": "registry:ui", "target": "components/ui/button/index.tsx" }],
  "meta": { "shadcnSource": "button", "shadcnVersion": "4.21.0" }
}
```
