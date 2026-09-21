# nekodemo を使ってプロトタイプを作る（AI 向け・1 ファイル完結）

このファイルは、AI コーディングツール（Claude Code / Codex / Gemini CLI / Cursor / Web 版 ChatGPT 等）が
nekodemo（猫がテーマのプロトタイプ用デザインシステム）でプロトタイプ画面を作るときに読む唯一のガイドです。
skills や hooks が使えない環境でも、このファイルだけで完結します。

- リポジトリ: https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system
- npm: `nekodemo`（公開前）／ shadcn registry: `https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/r/{name}.json`
- デモ: https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/ ／ Storybook: 同 `/storybook/`

## 0. 手順（この順で）

1. セットアップが済んでいるか確認する（`package.json` に `nekodemo`、エントリ CSS に `@import "nekodemo/styles.css"`、ルートの `<html>` に `data-neko-theme`）。無ければ `SETUP.md` の手順を実行する。
2. テーマを決める。利用者の指定が無ければ、雰囲気語から 1 案を選んで提案する（§3）。曖昧なら 1 回だけ質問する。
3. 依頼された画面を「画面の型」A〜D（§4）に当てはめ、型ごとの部品構成で組む。
4. 一覧・表・カード群・詳細には 4 状態（読み込み中 / 0 件 / エラー / 成功）を必ず実装する（§5）。
5. `pnpm nekodemo check src --strict` を実行し、指摘を 0 件にする（§8）。
6. 完成チェックリスト（§9）で自己確認し、結果を報告する。

## 1. 守ること（要約）

- UI 部品は `nekodemo` から import する。生の `<button>` `<input>` `<select>` `<textarea>` `<table>` は書かない。
- 色・角丸・文字サイズは役割トークン名だけを使う: `bg-surface-card` `text-text-low` `border-border-middle` `rounded-action` `text-3`。
  `#hex` / `rgb()` / `oklch()` / Tailwind 既定パレット（`bg-blue-500` `text-gray-600` 等）/ 任意値（`text-[13px]` `rounded-[6px]`）/ `style={{ color }}` / `font-medium` `font-semibold` は禁止（ビルドで存在しないうえ check で検出される）。
- アイコンは `<Icon icon="search" />`（Material Symbols の名前、snake_case）。`lucide-react` は使わない。
- テーマは `<html data-neko-theme="…">` と `NekoThemeProvider` の `defaultTheme` でだけ指定する。個別の色の上書きは禁止。
- 主ボタン（`Button` の primary）は 1 画面 1 つ。削除など取り消し不可の操作は `Dialog` で確認し、確定ボタンは `variant="negative"` で「削除する」のように動作を書く（「OK」「はい」は禁止）。
- 文言は「です・ます」、ボタンは「〜する」。猫の言葉遊びは空状態とローディングだけ。

## 2. セットアップ（最小）

Next.js（App Router）の例。Vite は `SETUP.md` を参照。

```tsx
// src/app/layout.tsx
import { NekoHead, NekoThemeProvider, Toaster, TooltipProvider } from "nekodemo";
import "./globals.css"; // @import "tailwindcss"; @source "../../node_modules/nekodemo/dist"; @import "nekodemo/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ja" data-neko-theme="calico" suppressHydrationWarning>
      <head><NekoHead /></head>
      <body>
        <NekoThemeProvider defaultTheme="calico" persist>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </NekoThemeProvider>
      </body>
    </html>
  );
}
```

## 3. テーマ（3 匹）

| ID | 名前 | 雰囲気 | 向いている用途 | scheme |
|---|---|---|---|---|
| `calico` | 三毛 | 親しみやすい・元気・明るい | toC、コミュニティ、学習、子ども向け | light |
| `american-shorthair` | アメショ | 中立・落ち着き・モノトーン | 業務システム、管理画面、ダッシュボード | light |
| `russian-blue` | ロシアンブルー | 上品・クール・静か・夜 | 金融、法務、ヘルスケア、高級感、ダーク UI | **dark** |

- 雰囲気語での指定: 「落ち着いた管理画面」→ `american-shorthair`、「toC で親しみやすく」→ `calico`、「高級感」「ダーク」→ `russian-blue`。
- 切替 UI は `<NekoThemePicker />` をヘッダー右上に 1 つ置く。テーマは即時に切り替わり、リロード不要。
- どのテーマでも同じクラス名（役割トークン）で書く。テーマ固有の書き分けはしない。

## 4. 画面の型（4 つ）

| 型 | 構成（上から） | 使う部品 |
|---|---|---|
| A. 一覧 | ページ見出し＋主アクション（右上） → 検索・絞り込み行 → Table → Pagination | `Button` `InputSearch` `Tag`（絞り込み）`Table` `Pagination` `EmptyState` `SkeletonRows`。ソート・列幅・選択・列の絞り込みまで要るなら `DataGrid` 1 つで済む（4 状態も内蔵） |
| B. 詳細 | Breadcrumb → 見出し＋状態（`StatusTag`）＋操作 `Menu` → 2 カラム（左: 情報 `Card`、右: 関連 `Card`） | `Breadcrumb` `StatusTag` `Menu` `Card` `Tabs` `Drawer` |
| C. 作成・編集フォーム | 見出し → `Form`（セクションごとに `Card`）→ 画面下部に固定のフッター（キャンセル／保存） | `Form` `Input` `Select` `Textarea` `Checkbox` `RadioGroup` `Switch` `Button` |
| D. 設定 | 左に縦 `Tabs` → 右に設定項目（1 項目 = 見出し・説明・入力の 3 行） | `Tabs`（`orientation="vertical"`）`Switch` `Select` `Divider` `Field` |

共通: 左に `SideNavigation`（幅 240px、折りたたみ 64px）、上にアプリ名＋`NekoThemePicker`＋`Avatar`。コンテンツ幅の最大は 1200px、ページ余白 24px。
実例: リポジトリの `src/app/samples/{list,detail,form,settings}/page.tsx`。DataGrid ＋ SearchCombobox 版の一覧は `src/app/samples/grid/page.tsx`。

## 5. 状態の必須セット（省略不可）

| 状態 | 表現 |
|---|---|
| 読み込み中 | `<SkeletonRows rows={5} />`（一覧）／ `Skeleton` を 3 枚（カード）。初回だけマスコット付きでもよい |
| 0 件 | `<EmptyState title="まだ案件がありません" description="…" action={<Button>案件を追加する</Button>} />`。検索結果 0 件は `title="条件に合う案件がありません"` ＋「条件をクリアする」 |
| エラー | `<InlineMessage variant="negative" action={<Button variant="outline" size="sm">再試行</Button>}>…</InlineMessage>`。全画面エラーにしない |
| 成功 | `toast.success("案件を保存しました")`（3 秒）。画面遷移を伴うときは遷移先で出す |

## 6. 部品一覧と props の要約

すべて `import { … } from "nekodemo"`。props の詳細は `node_modules/nekodemo/dist/components/ui/<name>/index.d.ts` の JSDoc（概要／アンチパターン／使用例）を読む（リポジトリでは `src/components/ui/<name>/README.md`、公開サイトでは Storybook）。表に無い props は `.d.ts` を正とする。このガイド・`SETUP.md`・guidelines は `node_modules/nekodemo/dist/ai/`、skills は `node_modules/nekodemo/skills/` にも同梱されている。

| 部品 | 主な props / 構成 | 用途・注意 |
|---|---|---|
| `Button` | `variant`: primary / secondary / outline / ghost / negative、`size`: sm / md / lg、`loading`、`asChild` | 主アクションは 1 画面 1 つ。文言は「〜する」 |
| `IconButton` | `icon`、`label`（必須）、`variant`: ghost / outline / primary / negative、`size` | 行末の操作、閉じる |
| `Link` | `href`、`external`、`asChild` | 文中・一覧のテキストリンク |
| `Icon` | `icon`（Material Symbols 名）、`size` 1〜12（12〜54px）、`fill`、`label` | 色は `text-object-*`。猫版が無い名前はフォントで表示 |
| `Spinner` | `size`: sm / md / lg、`label` | ボタン内や小さな領域。一覧は Skeleton |
| `Skeleton` / `SkeletonRows` | `className`（形）／ `rows` | 読み込み中 |
| `Tooltip` | `Tooltip` > `TooltipTrigger asChild` + `TooltipContent`（ルートに `TooltipProvider`） | IconButton の補足 |
| `Toaster` / `toast` | `toast.success / error / info / warning(message, { description })` | 一時的な通知 |
| `InlineMessage` | `variant`: info / success / warning / negative、`title`、`action` | 画面内のエラー・注意 |
| `Badge` | `count`、`max`、`variant`: primary / negative / neutral | 件数（数字）。文字は `Tag` |
| `Tag` / `StatusTag` | `Tag`: `variant`: default / selected、`onRemove`、`removeLabel`。`StatusTag`: `status`: info / success / warning / negative / neutral | 絞り込み条件 ／ 状態ラベル |
| `Avatar` | `name`（必須）、`src`、`fallback`、`size` | 画像なしは猫の顔 |
| `Divider` | `orientation` | 意味のある区切りだけ |
| `Card` | `CardHeader` > `CardTitle` `CardDescription` `CardAction`、`CardContent`、`CardFooter` | 情報のまとまり。入れ子にしない |
| `Input` | `size`: sm / md / lg、`aria-invalid`、`type` | ラベルは Form / Field で |
| `InputPassword` | Input と同じ | 表示切替つき |
| `InputSearch` | `value` / `onValueChange`、`onOpenConditions`、`clearLabel`、`size` | 一覧の検索欄 |
| `Textarea` | `maxLength`（カウンタ）、`showCount`、`rows` | |
| `Select` | `Select` > `SelectTrigger`（`size`）> `SelectValue`、`SelectContent` > `SelectItem` | 単一選択 |
| `Checkbox` | `checked`（true / false / "indeterminate"）、`onCheckedChange` | チェックは猫の顔 |
| `RadioGroup` / `RadioItem` | `value` / `onValueChange`、`RadioItem value id` | 2〜5 択 |
| `Switch` | `checked` / `onCheckedChange` | 即時反映の設定 |
| `Slider` | `label`、`min` `max` `value` `onValueChange` | |
| `Form` | `Form {...form}` > `FormField` > `FormItem` > `FormLabel required` / `FormControl` / `FormDescription` / `FormMessage`。`useForm` `zodResolver` `z` も `nekodemo` から import する（別途インストール不要） | react-hook-form + zod |
| `Field` | `label`（必須）`htmlFor`（必須）`description` `error` `required`。中に `Input` / `Select` 等を置く | react-hook-form を使わない静的なラベル付け（設定画面、絞り込み行） |
| `Tabs` | `Tabs`（`orientation`）> `TabsList aria-label` > `TabsTrigger value`、`TabsContent value` | |
| `Breadcrumb` | `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink` / `BreadcrumbPage`、`BreadcrumbSeparator` | 詳細の最上部 |
| `SideNavigation` | `logo`、`collapsed` / `defaultCollapsed`；`SideNavItem icon active badge asChild`；`SideNavGroup label` | 幅 240 / 64px |
| `Pagination` | `page` `total` `pageSize` `onPageChange`、`showSummary`、`unit` | 件数表示つき |
| `Menu` | `Menu` > `MenuTrigger asChild` + `MenuContent` > `MenuItem`（`variant="negative"`）`MenuSeparator` `MenuCheckboxItem` `MenuRadioItem` | 操作の一覧。破壊的操作は最後 |
| `Popover` | `Popover` > `PopoverTrigger asChild` + `PopoverContent` > `PopoverTitle` | 小さなパネル |
| `Dialog` | `Dialog` > `DialogTrigger` + `DialogContent` > `DialogHeader`（`DialogTitle` `DialogDescription`）`DialogFooter`（`DialogCancel` `DialogAction variant="negative"`）。一覧の行メニュー（`MenuItem`）から開くときは `DialogTrigger` を使わず、`<Dialog open={…} onOpenChange={…}>` をページに 1 つ置いて state で開く（Menu が閉じるとトリガーごと消えるため） | 確認専用 |
| `Modal` | `Modal` > `ModalTrigger` + `ModalContent` > `ModalHeader`（`ModalTitle`）`ModalBody` `ModalFooter`（`ModalClose`） | 短い入力 |
| `Drawer` | `Drawer` > `DrawerTrigger` + `DrawerContent side` > `DrawerHeader`（`DrawerTitle`）`DrawerBody` `DrawerFooter` | サイドパネル |
| `Table` | `Table density`（xs / sm / md）> `TableHeader` > `TableRow` > `TableHead`（`numeric` `sort` `onSort`）、`TableBody` > `TableRow` > `TableCell numeric` | 数値は右寄せ等幅。静的な表 |
| `DataGrid` | `aria-label`（必須）`columns`（`{ id, header, accessor?, cell?, numeric?, size?, filter?: "select" }`）`data` `getRowId` `density` `status`（loading / error）`onRetry` `emptyTitle` `emptyAction` `selectable` `onSelectionChange` `searchable` `columnMenu` `pinFirstColumn` `pagination` `pageSize` `virtualize` `height` `rowActions` `toolbar` `caption` | ソート・列幅・固定・選択・ページング・検索・列の絞り込み・列の表示切替・4 状態・仮想化・行内操作をまとめて持つ一覧。0 件は自動で EmptyState |
| `SearchCombobox` | `label`（必須。`hideLabel` で見た目だけ隠す）`options` `getOptionLabel` `getOptionDescription` `groupBy` `multiple` `freeSolo` `value` / `onChange` `inputValue` / `onInputChange` `loading` `emptyText` `size` `disabled` | サジェスト付きの入力。複数選択は Tag、候補に無い値は freeSolo。5 件程度の固定候補は Select |
| `EmptyState` | `title`、`description`、`action`、`headingLevel`（2 / 3 / 4）、`hideMascot` | 0 件 |
| `NekoThemeProvider` / `NekoThemePicker` / `NekoHead` / `useNekoTheme` | `defaultTheme` `persist` ／ `variant`: faces / menu | テーマ |
| `Mascot` | `theme`、`size`、`label` | 空状態・初回ローディング・404・ログインだけ |

## 7. 役割トークン（クラス名）

| 用途 | クラス |
|---|---|
| 文字色 | `text-text-high`（本文・見出し）`text-text-middle` `text-text-low`（補足）`text-text-placeholder` `text-text-disabled` `text-text-link` `text-text-primary` `text-text-negative` `text-text-info` `text-text-success` `text-text-warning` `text-text-on-primary` `text-text-inverse` |
| 面 | `bg-surface-page` `bg-surface-card` `bg-surface-well` `bg-surface-input` `bg-surface-disabled` `bg-surface-primary`（＋`-hover` `-active` `-subtle` `-subtle-hover`）`bg-surface-selected` `bg-surface-negative`（＋`-subtle`）`bg-surface-info-subtle` `bg-surface-success-subtle` `bg-surface-warning-subtle` `bg-surface-inverse` `bg-surface-overlay` |
| 枠線 | `border-border-low` `border-border-middle` `border-border-high` `border-border-primary` `border-border-negative` `border-border-focus` |
| アイコン・図形 | `text-object-high` `text-object-middle` `text-object-low` `text-object-primary` `text-object-negative` `text-object-on-primary`（`fill-*` `stroke-*` も同名で可） |
| 角丸 | `rounded-action`（ボタン・入力）`rounded-container`（カード）`rounded-modal` `rounded-notice`（タグ）`rounded-round`（円） |
| 影 | `shadow-raise` `shadow-float` `shadow-popout` |
| 文字サイズ | `text-1`（12）`text-2`（14・補足）`text-3`（16・本文）`text-4`（18）`text-5`（20・見出し）`text-6`（24・見出し）… `text-12`（54）。`text-sm` `text-base` `text-lg` 等の別名も同じ段階 |
| フォント | `font-pro`（本文）`font-mono`（数値・コード）。ウェイトは `font-normal` / `font-bold` のみ |
| 余白 | 4px の倍数（`p-4` = 16、`gap-6` = 24 等）。ページ余白 24、カード内 16、フォーム項目間 16、セクション間 32 |
| ステータス色（状態表現だけ） | `bg-info-50` … `text-success-700` 等 50〜900。装飾に使わない |

## 8. nekodemo check

```bash
pnpm nekodemo check src --strict        # error があれば exit 1（npm なら npx nekodemo check src --strict）
pnpm nekodemo check src --format json   # { findings, counts, missingIcons, manualChecks }
```

| ルール | 重大度 | 内容 |
|---|---|---|
| NK001 | error | `#hex` / `rgb()` / `hsl()` / `oklch()` の直書き |
| NK002 | error | Tailwind 既定パレット（`bg-blue-500` 等） |
| NK003 | error | 任意値の色・文字サイズ・角丸（`text-[13px]` 等） |
| NK004 | error | `style={{ color / background / borderColor }}` |
| NK005 | error | `lucide-react` の import、`material-symbols` クラスの直書き |
| NK006 | warn | 猫版が無いアイコン名（フォント表示になる） |
| NK007 | error | `font-medium` / `font-semibold` 等（400 / 700 以外） |
| NK008 | warn | ルートレイアウトに `data-neko-theme` が無い |
| NK009 | warn | 生の `<table>` `<button>` `<input>` `<select>` `<textarea>` |
| NK010 | info | 一覧を描画しているのに Skeleton / EmptyState が無い |

除外が必要なときだけ `// nekodemo-check-ignore-next-line NK009` を使う（理由をコメントに書く）。NK010 は `page.tsx` の JSX 式内の `.map(`（`{items.map(...)}`）を一覧の描画とみなす。`generateStaticParams` 内の `.map` は対象外。

## 9. 完成チェックリスト（最後に自己確認して報告する）

- [ ] 4 状態（読み込み中・0 件・エラー・成功）を実装した
- [ ] 主ボタンは 1 画面 1 つ
- [ ] 削除に確認 Dialog があり、確定ボタンは negative で「削除する」
- [ ] 色・角丸・文字サイズが役割トークン名だけで書かれている（`pnpm nekodemo check` が 0 件）
- [ ] 猫版が無いアイコン（NK006）を使っていない
- [ ] `NekoThemePicker` で 3 テーマを切り替えても崩れない
- [ ] キーボードだけで主要操作（一覧 → 詳細 → 編集 → 保存）ができる
- [ ] 文言が「です・ます」＋「〜する」ボタンになっている
