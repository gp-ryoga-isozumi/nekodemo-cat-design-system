# ナビゲーションの構造

画面どうしのつなぎ方のルールです。5 項目あります。外枠の寸法は [09-layout.md](./09-layout.md)、画面の型は [01-screen-patterns.md](./01-screen-patterns.md) を参照してください。

## 1. 階層は 2 段まで

`SideNavigation` は「グループ（`SideNavGroup` の `label`）→ 項目（`SideNavItem`）」の 2 段までにします。3 段目が必要になったら、その項目の中を `Tabs` で分けます。項目は 1 グループ 7 つまで、全体で 15 までを目安にし、超えたらグループにまとめるか設定画面に寄せます。

- 良い例: 「案件」「顧客」「通知」＋ `SideNavGroup label="管理"` の中に「設定」
- 悪い例: 項目を 12 個フラットに並べ、似た名前が上下に散る

実例: `src/app/samples/app-shell.tsx`

## 2. 現在地は 1 か所だけで示す

現在地は `SideNavItem` の `active`（`aria-current="page"` が付きます）で示します。加えて、ページ見出し（`PageHeader` の `title`）をナビの項目名とそろえます。ナビが「案件」なのに見出しが「プロジェクト一覧」のように食い違う名前にしません。未対応の件数は `SideNavItem` の `badge` に出します（既定は negative、中立の件数は `badgeVariant="neutral"`）。

## 3. Breadcrumb は 3 階層目から出す

`Breadcrumb` は「一覧 → 詳細 → さらにその中」のように 3 階層目に入ったときだけ出します（画面の型 B）。一覧のような 2 階層目には出しません。最後の要素は `BreadcrumbPage` にしてリンクにせず、4 階層を超えるときは中間を `BreadcrumbEllipsis` で省略します。`PageHeader` を使う画面では `breadcrumb` に渡して見出しの上に置きます。

- 良い例: 「ホーム → 案件 → 社内備品貸出アプリ 改修」の最後を `BreadcrumbPage` にする
- 悪い例: 一覧画面に「ホーム → 案件」の Breadcrumb を置く

実例: `src/app/samples/detail/page.tsx`

## 4. 戻り先を必ず用意する

詳細・フォーム・ウィザードの各画面には、`Breadcrumb` かフッターの「キャンセル」のどちらかで一覧へ戻る道を置きます。ブラウザの戻るだけに頼りません。保存後は詳細か一覧に戻します（[03-actions.md](./03-actions.md) の 4）。

## 5. 画面が変わる移動と、その場の切替を混ぜない

URL が変わる移動は `SideNavigation` / `Link` / `Breadcrumb` で行います。`Tabs` と `SegmentedControl` は同じ画面の中の切替専用で、画面遷移には使いません。`Menu` の中では遷移（「詳細を見る」）を上、操作（「複製する」）を下に置き、`MenuSeparator` で分けます。

- 良い例: 設定画面の左ナビは `Tabs orientation="vertical"`（URL は変えない）
- 悪い例: `Tabs` のクリックで `router.push` して URL を変える

## AI 向けの要約

- `SideNavigation` は 2 段まで（`SideNavGroup` → `SideNavItem`）。3 段目が要るなら `Tabs` に分ける。項目は 1 グループ 7 つ、全体 15 までを目安にする。
- 現在地は `SideNavItem` の `active` で示し、`PageHeader` の `title` をナビの項目名とそろえる。件数は `badge`。
- `Breadcrumb` は 3 階層目から出す。最後は `BreadcrumbPage`（リンクにしない）、4 階層超は `BreadcrumbEllipsis`。
- 詳細・フォームには必ず一覧へ戻る道（`Breadcrumb` かキャンセル）を置く。
- 画面遷移は `SideNavigation` / `Link` / `Breadcrumb`、その場の切替は `Tabs` / `SegmentedControl`。混ぜない。
