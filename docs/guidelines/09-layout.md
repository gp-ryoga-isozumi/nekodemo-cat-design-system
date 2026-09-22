# レイアウトと画面幅

[01-screen-patterns.md](./01-screen-patterns.md) の「共通の枠」を、幅が変わったときまで含めて決めたルールです。5 項目あります。

## 1. 外枠は 3 領域で固定する

画面は「左の SideNavigation」「上のヘッダー」「本文」の 3 領域で組みます。SideNavigation は幅 240px（折りたたみ 64px）、本文は最大幅 1200px・ページ余白 24px・中央寄せです。画面ごとにこの数値を変えません。どの画面も同じ枠に見えることが、プロトタイプの比較を早くします。

- 良い例: `<main className="min-w-0 flex-1 bg-surface-page"><div className="mx-auto max-w-[1200px] p-6">…</div></main>`
- 悪い例: 画面ごとに `max-w-4xl` と `max-w-[1400px]` を使い分ける

実例: `src/app/samples/app-shell.tsx`

## 2. 本文の中は 1 / 2 / 3 カラムで考える

12 分割のグリッドは使いません。2 カラムは 2:1（詳細画面の情報と関連）、3 カラムは 1:1:1（カード群）だけです。カラムの間は 24px（`gap-6`）、カード内は 16px です。列の幅を px で書かず、`grid-cols-*` と `gap-6` で組みます。

- 良い例: `<div className="grid gap-6 lg:grid-cols-3"><div className="lg:col-span-2">…</div><aside>…</aside></div>`
- 悪い例: 本文の中に `w-[720px]` のような固定幅を書く

## 3. 狭い幅では 1 カラムにし、ナビは Drawer に移す

使う境目は 2 つだけです。`md`（768px）未満では SideNavigation を隠し、ヘッダーの `IconButton`（`icon="menu"`）で `Drawer` を開き、`DrawerContent` に `side="left"` を渡して同じ項目を出します。`sm`（640px）未満では複数カラムをすべて 1 カラムにします。ナビを隠したまま代わりを置かないのは不可です（プロトタイプはスマートフォンで開かれます）。

## 4. 画面下部に固定してよいのはフォームのフッターだけ

固定（`fixed`）してよいのは、作成・編集フォームの「キャンセル／保存」の行だけです（画面の型 C）。一覧のツールバーやページングは固定しません。固定した要素の左端は SideNavigation の幅に合わせます（`md:left-60`）。

- 良い例: `<div className="fixed inset-x-0 bottom-0 z-10 border-border-low border-t bg-surface-card px-6 py-3 md:left-60">`
- 悪い例: 一覧のページングを画面下部に固定して、表の最終行が隠れる

## 5. 表がはみ出すときは表だけを横スクロールさせる

幅が足りない表は、ページごと横スクロールさせず、表の外側の領域だけをスクロールさせます（`Table` は外側の `div` が `overflow-x-auto` なので既定でそうなります）。それでも読みにくいときは、列を減らす → `density="xs"` にする → 重要な列を左に寄せる（`DataGrid` は `pinFirstColumn`）の順に検討します。

## AI 向けの要約

- 外枠は SideNavigation 240px（折りたたみ 64px）＋ヘッダー＋本文（最大 1200px、余白 24px）で固定し、画面ごとに変えない。
- 本文は 1 / 2（2:1）/ 3（1:1:1）カラムだけ。列の間は `gap-6`（24px）、固定幅の px を書かない。
- `md` 未満は SideNavigation を `Drawer`（`DrawerContent side="left"`）に移し、`sm` 未満は 1 カラムにする。ナビを隠したままにしない。
- 画面下部に固定してよいのはフォームのフッターだけ。左端は `md:left-60` でそろえる。
- 表がはみ出すときはページではなく表の外側だけを横スクロールさせ、列を減らす・`density="xs"`・重要な列を左の順に検討する。
