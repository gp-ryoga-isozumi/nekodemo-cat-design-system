# nekodemo のセットアップ手順（利用側プロジェクト）

AI が実行する前提で、コマンドとファイル内容を省略せずに書く。Next.js（App Router）と Vite の 2 通り。
既に済んでいる手順は飛ばしてよい（`package.json` に `nekodemo` があるか、エントリ CSS に `nekodemo/styles.css` があるか、で判断する）。

## 0. 前提

- Node.js 22 以上、pnpm（npm でも可。以下 `pnpm` を読み替える）
- React 19、Tailwind CSS v4。Tailwind v3 では動かない

## 1. インストール

npm には未公開なので、デモサイトに置いてある tarball から入れる（GitHub リポジトリからの直接インストールは `dist/` が git 管理外なので動かない）:

```bash
pnpm add https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/nekodemo.tgz
pnpm add -D tailwindcss @tailwindcss/postcss
```

npm に公開後はこちら:

```bash
pnpm add nekodemo
```

`Form` で使う `useForm` / `zodResolver` / `z` は `nekodemo` から import できるので、`react-hook-form` / `zod` を別途入れる必要はない。

## 2. PostCSS（Next.js / Vite 共通）

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

Vite は代わりに `@tailwindcss/vite` プラグインでもよい（`vite.config.ts` の `plugins: [react(), tailwindcss()]`）。

## 3. エントリ CSS

Tailwind v4 は `node_modules` を自動で走査しないため、`@source` で nekodemo の `dist` を指定する。

Next.js `src/app/globals.css`:

```css
@import "tailwindcss";
@source "../../node_modules/nekodemo/dist";
@import "nekodemo/styles.css";
```

Vite `src/index.css`:

```css
@import "tailwindcss";
@source "../node_modules/nekodemo/dist";
@import "nekodemo/styles.css";
```

`nekodemo/styles.css` には Tailwind 既定パレットの無効化（`@theme { --color-*: initial }` 等）、nekodemo のトークン、3 テーマの CSS が含まれる。
このため `bg-blue-500` のような既定パレットのクラスは存在しなくなる（意図どおり）。

create-next-app / create-vite が生成した既定の内容（`:root { --background: #ffffff }`、`@theme inline { … }`、`body { font-family }` 等）は削除して、上の 3 行だけにする。色の直書きは `nekodemo check` の NK001 で error になる。

## 4. ルートに Provider とテーマ属性

Next.js `src/app/layout.tsx`:

```tsx
import { NekoHead, NekoThemeProvider, Toaster, TooltipProvider } from "nekodemo";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-neko-theme="calico" suppressHydrationWarning>
      <head>
        <NekoHead />
      </head>
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

Vite `index.html` と `src/main.tsx`:

```html
<html lang="ja" data-neko-theme="calico">
  <head>
    <meta charset="UTF-8" />
    <!-- フォントは NekoHead が出すが、Vite では main.tsx で描画されるまで待たず、ここに直接書いてもよい -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&family=Noto+Sans+Mono:wght@400;700&display=swap" />
  </head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
```

```tsx
// src/main.tsx
import { NekoThemeProvider, Toaster, TooltipProvider } from "nekodemo";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <NekoThemeProvider defaultTheme="calico" persist>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </NekoThemeProvider>,
);
```

- `data-neko-theme` の値: `calico` / `american-shorthair` / `russian-blue`
- `persist` を付けると localStorage に保存され、`NekoHead` の inline script が初回表示のちらつきを防ぐ。Next.js では `<html suppressHydrationWarning>` を付ける
- ヘッダー右上に `<NekoThemePicker />` を置くと、画面を見る人がその場で切り替えられる

## 5. プロジェクト設定 `nekodemo.config.json`（プロジェクト直下）

```json
{ "defaultTheme": "calico", "themes": ["calico", "american-shorthair", "russian-blue"], "switcher": true }
```

人と AI が読む設定の正（v1 ではツールは読まない。`nekodemo check` も検査しない）。`defaultTheme` はレイアウトの `data-neko-theme` / `defaultTheme` と一致させる。

## 6. AI 向けガード

1. `AGENTS.md`（無ければ作成）に `GUARD_BLOCK.md` の内容を貼る。`CLAUDE.md` が独自の内容を持つなら同じ内容を追記する。`CLAUDE.md` の中身が `@AGENTS.md` の 1 行だけ（Next.js 16 の create-next-app の既定）なら追記しない（二重になる）。
2. `package.json` の scripts に追加:
   ```json
   { "lint:nekodemo": "nekodemo check src --strict" }
   ```
3. Claude Code: `.claude/settings.json` に Stop hook を登録する。応答終了時に check が走り、error があると停止がブロックされて修正が続く。
   ```json
   {
     "hooks": {
       "Stop": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "pnpm nekodemo check src --strict --format text 1>&2 || exit 2",
               "timeout": 60,
               "statusMessage": "nekodemo check を実行中…"
             }
           ]
         }
       ]
     }
   }
   ```
   無限ループを避けたい場合は、hook の入力（stdin の JSON）の `stop_hook_active` が true のときは `exit 0` にする小さなスクリプトを使う（リポジトリの `scripts/hooks/nekodemo-check-stop.mjs` が例）。
4. Codex CLI: `.codex/hooks.json` に同じ形式で登録する（`Stop` イベント。exit 2 と stderr の理由で停止をブロックできる）。
   ```json
   {
     "hooks": {
       "Stop": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "pnpm nekodemo check src --strict --format text 1>&2 || exit 2",
               "timeout": 60,
               "statusMessage": "nekodemo check を実行中…"
             }
           ]
         }
       ]
     }
   }
   ```
5. Cursor: `.cursor/hooks.json` の `stop` イベントに登録する。`stop` は観測用でブロックできないため、error があれば `followup_message` で修正を促す。
   ```json
   {
     "version": 1,
     "hooks": {
       "stop": [{ "command": "node .cursor/hooks/nekodemo-check.mjs", "timeout": 60 }]
     }
   }
   ```
   ```js
   // .cursor/hooks/nekodemo-check.mjs
   import { spawnSync } from "node:child_process";
   const r = spawnSync("pnpm", ["nekodemo", "check", "src", "--strict", "--format", "json"], { encoding: "utf8" });
   const errors = r.status === 0 ? 0 : (JSON.parse(r.stdout || "{}").counts?.error ?? 1);
   if (errors > 0) {
     console.log(JSON.stringify({ followup_message: `nekodemo check で error が ${errors} 件あります。pnpm nekodemo check src --strict を実行して直してください。` }));
   }
   ```
6. Gemini CLI など hook が無い環境: AGENTS.md のガードブロックにある「作業の最後に `pnpm nekodemo check src --strict` を実行する」の指示に従う。

## 7. 既定のテンプレート画面を置き換えて動作確認

create-next-app / create-vite の既定の画面（`src/app/page.tsx` / `src/App.tsx`）は Tailwind 既定パレットや `font-medium` を使っているので、そのままでは `nekodemo check` が error になる。nekodemo の部品で書いた最小の画面に置き換える。

```tsx
// src/app/page.tsx（Next.js の例）
import { Button, EmptyState, NekoThemePicker } from "nekodemo";

export default function Page() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-6 text-text-high">アプリ名</h1>
        <NekoThemePicker />
      </div>
      <EmptyState title="まだ画面がありません" action={<Button>画面を作る</Button>} />
    </main>
  );
}
```

```bash
pnpm nekodemo check src   # 0 件であること（既定の画面を置き換えたあと）
pnpm dev                  # ヘッダーの NekoThemePicker で 3 テーマが切り替わること
```

## 8. shadcn registry から部品だけ取り込む（任意）

npm 依存を増やしたくない場合は、`components.json` に registry を登録して部品のソースを copy-in できます。npm パッケージの `nekodemo` と混在させないでください。

```json
{ "registries": { "@nekodemo": "https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/r/{name}.json" } }
```

1. `npx shadcn@latest add @nekodemo/styles` … `styles/nekodemo-tokens.css` と `styles/nekodemo-themes.css` が入る（`src/` があるプロジェクトでは `src/styles/`）。エントリ CSS の `@import "tailwindcss";` の後に次を足す:
   ```css
   @import "tw-animate-css";
   @import "./styles/nekodemo-tokens.css";
   @import "./styles/nekodemo-themes.css";
   ```
   （エントリ CSS が `src/app/globals.css` なら `../styles/...`。`tw-animate-css` は `pnpm add tw-animate-css`）
2. `npx shadcn@latest add @nekodemo/theme` … `NekoThemeProvider` / `NekoThemePicker` / `NekoHead` / `Mascot` / `themes/registry.ts` が入る。§4 と同じようにルートに置く（import 先は `@/components/theme/...`）
3. `npx shadcn@latest add @nekodemo/button` のように部品を入れる。`registryDependencies`（`icon` `spinner` `lib` 等）も同時に入る
4. 部品は `@/components/ui/<name>` から import する。部品内の相対 import（`../icon` 等）は、shadcn が置く `components/ui/<name>/index.tsx` の配置で解決できる
5. `npx shadcn@latest init` が既定スタイルの部品（`components/ui/button.tsx` 等）や `lucide-react` を入れていたら削除する。nekodemo の部品は `components/ui/<name>/index.tsx` に入るので、同名の `button.tsx` が残っていると `@/components/ui/button` の import がそちらに解決されてしまう
