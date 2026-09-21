# 画面の型

設計書 §10.1 のルールです。プロトタイプの画面は次の 4 型のどれかに当てはめて作ります。当てはまらない場合だけ独自レイアウトを作ります。

## 共通の枠

どの型でも外枠は同じです。

- 左に SideNavigation（幅 240px、折りたたみ時 64px）を置きます。
- 上にアプリ名＋NekoThemePicker＋Avatar を置きます。
- コンテンツ幅の最大は 1200px、ページ余白は 24px です。

実例: `src/app/samples/app-shell.tsx`（SideNavigation と最大幅・余白）、`src/app/site-header.tsx`（ヘッダー）

## A. 一覧

構成（上から）

1. ページ見出し＋主アクション（右上）
2. 検索・絞り込み行
3. Table
4. Pagination

使う部品: Button, InputSearch, Tag（絞り込み）, Table, Pagination, EmptyState

主アクションは見出しの右上に 1 つだけ置きます。行クリックは詳細へ遷移させ、行内の操作ボタンは行末にまとめます（§10.3）。0 件・読み込み中・エラーの表示は [02-states.md](./02-states.md) を必ず実装してください。

実例: `src/app/samples/list/page.tsx`

## B. 詳細

構成（上から）

1. Breadcrumb
2. 見出し＋状態 Badge＋操作 Menu
3. 2 カラム（左: 情報 Card、右: 関連 Card）

使う部品: Breadcrumb, Badge, Menu, Card, Tabs

情報量が多いときは左カラムを Tabs で分けます。削除などの取り消し不可の操作は Menu の中に置き、実行前に Dialog で確認します。

実例: `src/app/samples/detail/page.tsx`

## C. 作成・編集フォーム

構成（上から）

1. 見出し
2. Form（セクションごとに Card）
3. 画面下部に固定のフッター（キャンセル／保存）

使う部品: Form（FormField 等）, Input, Select, Textarea, Checkbox, RadioGroup + RadioItem, Switch, Button

フッターの主アクションは「保存する」1 つで、キャンセルは secondary / outline にします。保存後は編集画面に留まらず、詳細または一覧に戻して Toast で結果を伝えます（§10.3）。

実例: `src/app/samples/form/page.tsx`

## D. 設定

構成（上から）

1. 左に Vertical Tabs（v1 は Tabs）
2. 右に設定項目（1 項目 = 見出し・説明・入力の 3 行）

使う部品: Tabs, Switch, Select, Divider

設定項目は Field で見出し・説明・入力の 3 行にそろえ、項目の区切りに Divider を使います。

実例: `src/app/samples/settings/page.tsx`

## 4 型の早見表

| 型 | 構成（上から） | 使う部品 |
|---|---|---|
| A. 一覧 | 見出し＋主アクション → 検索・絞り込み行 → Table → Pagination | Button, InputSearch, Tag, Table, Pagination, EmptyState |
| B. 詳細 | Breadcrumb → 見出し＋Badge＋Menu → 2 カラム Card | Breadcrumb, Badge, Menu, Card, Tabs |
| C. 作成・編集フォーム | 見出し → Form（セクションごとに Card）→ 固定フッター | Form, Input, Select, Textarea, Checkbox, RadioGroup + RadioItem, Switch, Button |
| D. 設定 | 左 Tabs → 右に設定項目（3 行） | Tabs, Switch, Select, Divider |

## AI 向けの要約

- 依頼された画面を A 一覧 / B 詳細 / C 作成・編集フォーム / D 設定 のどれかに当てはめる。当てはまらないときだけ独自レイアウトを作る。
- 外枠は必ず SideNavigation（240px、折りたたみ 64px）＋ヘッダー（アプリ名・NekoThemePicker・Avatar）にする。
- コンテンツは最大幅 1200px、ページ余白 24px に収める。
- A は Button / InputSearch / Tag / Table / Pagination / EmptyState、B は Breadcrumb / Badge / Menu / Card / Tabs で組む。
- C は Form（FormField 等）＋ Input / Select / Textarea / Checkbox / RadioGroup + RadioItem / Switch と画面下部固定のフッターで組む。
- D は Tabs（左）＋ Field / Switch / Select / Divider で組み、1 項目を見出し・説明・入力の 3 行にそろえる。
- 迷ったら `src/app/samples/{list,detail,form,settings}/page.tsx` の実例をそのまま骨組みに使う。
