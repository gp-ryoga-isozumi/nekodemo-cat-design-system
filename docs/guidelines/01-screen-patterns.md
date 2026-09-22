# 画面の型

設計書 §10.1 のルールです。プロトタイプの画面は次の 6 型のどれかに当てはめて作ります。当てはまらない場合だけ独自レイアウトを作ります。

## 共通の枠

どの型でも外枠は同じです。

- 左に SideNavigation（幅 240px、折りたたみ時 64px）を置きます。
- 上にアプリ名＋NekoThemePicker＋Avatar を置きます。
- コンテンツ幅の最大は 1200px、ページ余白は 24px です。
- 画面の最上部は PageHeader（`breadcrumb` / `title` / `meta` / `description` / `actions`）でそろえます。

幅が変わったときの扱い（`md` 未満のナビ、カラムの分け方、固定フッター）は [09-layout.md](./09-layout.md)、画面どうしのつなぎ方は [13-navigation.md](./13-navigation.md) を参照してください。

実例: `src/app/samples/app-shell.tsx`（SideNavigation と最大幅・余白）、`src/app/site-header.tsx`（ヘッダー）

## A. 一覧

構成（上から）

1. PageHeader（`title` ＋ `actions` に主アクション）
2. 検索・絞り込み行（InputSearch → FilterChipGroup → 並び替え → SegmentedControl）
3. Table（ソート・選択・ページングまで要るなら DataGrid 1 つ）
4. Pagination

使う部品: PageHeader, Button, InputSearch, FilterChipGroup, SegmentedControl, Tag（効いている条件）, Table, DataGrid, Pagination, EmptyState

主アクションは PageHeader の `actions` に 1 つだけ置きます。行クリックは詳細へ遷移させ、行内の操作ボタンは行末にまとめます（§10.3）。0 件・読み込み中・エラーの表示は [02-states.md](./02-states.md) を必ず実装してください。絞り込みと一括操作の詳細は [12-list-and-filters.md](./12-list-and-filters.md) です。

実例: `src/app/samples/list/page.tsx`、`src/app/samples/grid/page.tsx`（DataGrid 版）

## B. 詳細

構成（上から）

1. Breadcrumb（PageHeader の `breadcrumb` に渡す）
2. 見出し＋状態 StatusTag（PageHeader の `meta`）＋操作 Menu（`actions`）
3. 2 カラム（左: 情報 Card、右: 関連 Card）

使う部品: PageHeader, Breadcrumb, StatusTag, Menu, Card, DescriptionList, Tabs, Drawer

項目名と値の並びは DescriptionList で組み、値が空の項目は「—」で残します。情報量が多いときは左カラムを Tabs で分けます。削除などの取り消し不可の操作は Menu の中に置き、実行前に Dialog で確認します。一覧に戻らず 1 件を見るときは Drawer（[08-side-panel.md](./08-side-panel.md)）です。

実例: `src/app/samples/detail/page.tsx`

## C. 作成・編集フォーム

構成（上から）

1. PageHeader（`title` は名詞。保存ボタンは置かない）
2. Form（セクションごとに Card。手順に分けるときは Stepper を上か左に置く）
3. 画面下部に固定のフッター（キャンセル／保存）

使う部品: PageHeader, Stepper, Form（FormField / FormLabel required / FormMessage 等）, Field, Input, InputNumber, InputDate, InputTime, Select, SearchCombobox, Textarea, Checkbox, RadioGroup + RadioItem, Switch, Button

フッターの主アクションは「保存する」1 つで、キャンセルは secondary / outline にします。保存後は編集画面に留まらず、詳細または一覧に戻して Toast で結果を伝えます（§10.3）。ラベル・必須・検証タイミング・エラーの出し方は [10-forms.md](./10-forms.md) に従います。

実例: `src/app/samples/form/page.tsx`

## D. 設定

構成（上から）

1. 左に縦の Tabs（`orientation="vertical"`）
2. 右に設定項目（1 項目 = 見出し・説明・入力の 3 行）

使う部品: Tabs（`orientation="vertical"`）, Field, Switch, Select, Divider, Accordion

設定項目は Field で見出し・説明・入力の 3 行にそろえ、項目の区切りに Divider を使います。普段触らない項目は Accordion で畳みます。切り替えた瞬間に反映する項目は Switch、保存ボタンで反映する項目は Checkbox です。

実例: `src/app/samples/settings/page.tsx`

## E. ログイン

構成（上から）

1. Mascot（マスコットを出してよい 4 か所の 1 つ。[06-cat-flavor.md](./06-cat-flavor.md)）
2. アプリ名
3. Form（メールアドレス・パスワード）＋主アクション「ログインする」

使う部品: Mascot, Card, Form, Input, InputPassword, Button, Link, InlineMessage

SideNavigation とヘッダーは置かず、1 カラムを画面の中央に置きます（幅は最大 400px 程度）。フォームの組み方は [10-forms.md](./10-forms.md) に従い、認証の失敗は InlineMessage（negative）でフォームの上に出します（Toast にしません）。

実例: まだサンプル画面はありません。

## F. ダッシュボード

構成（上から）

1. PageHeader（`actions` に期間切替の SegmentedControl）
2. 指標カード（Card を 3〜4 枚、1 枚 = 見出し・数値・補足）
3. 一覧（直近の項目を Table か DataGrid で 5〜10 行）

使う部品: PageHeader, SegmentedControl, Card, DescriptionList, Table, DataGrid, StatusTag, EmptyState

nekodemo にグラフの部品はありません。推移や内訳はグラフを自作せず、数値（大きめの `text-6` 以上）と表で代替します。指標カードの数値は 3 桁区切りにし、増減は文字で書きます（[04-writing.md](./04-writing.md) の 5）。読み込み中・0 件・エラーの 4 状態は指標カードにも必要です。

実例: まだサンプル画面はありません。

## 6 型の早見表

| 型 | 構成（上から） | 使う部品 |
|---|---|---|
| A. 一覧 | PageHeader ＋主アクション → 検索・絞り込み行 → Table / DataGrid → Pagination | PageHeader, Button, InputSearch, FilterChipGroup, SegmentedControl, Tag, Table, DataGrid, Pagination, EmptyState |
| B. 詳細 | Breadcrumb → 見出し＋StatusTag＋Menu → 2 カラム Card | PageHeader, Breadcrumb, StatusTag, Menu, Card, DescriptionList, Tabs, Drawer |
| C. 作成・編集フォーム | PageHeader → Form（セクションごとに Card）→ 固定フッター | PageHeader, Stepper, Form, Field, Input, InputNumber, InputDate, Select, Textarea, Checkbox, RadioGroup + RadioItem, Switch, Button |
| D. 設定 | 左に縦 Tabs → 右に設定項目（3 行） | Tabs（`orientation="vertical"`）, Field, Switch, Select, Divider, Accordion |
| E. ログイン | Mascot → アプリ名 → Form → 「ログインする」 | Mascot, Card, Form, Input, InputPassword, Button, Link, InlineMessage |
| F. ダッシュボード | PageHeader ＋期間切替 → 指標カード → 直近の一覧 | PageHeader, SegmentedControl, Card, DescriptionList, Table, DataGrid, StatusTag, EmptyState |

## AI 向けの要約

- 依頼された画面を A 一覧 / B 詳細 / C 作成・編集フォーム / D 設定 / E ログイン / F ダッシュボード のどれかに当てはめる。当てはまらないときだけ独自レイアウトを作る。
- 外枠は必ず SideNavigation（240px、折りたたみ 64px）＋ヘッダー（アプリ名・NekoThemePicker・Avatar）にし、画面の最上部は PageHeader でそろえる（E ログインだけは外枠を置かない）。
- コンテンツは最大幅 1200px、ページ余白 24px に収める。幅が変わるときの扱いは 09-layout.md。
- A は PageHeader / InputSearch / FilterChipGroup / Table か DataGrid / Pagination / EmptyState、B は Breadcrumb / StatusTag / Menu / Card / DescriptionList / Tabs で組む。状態表示に Badge を使わない（Badge は件数専用）。
- C は Form（FormLabel required / FormMessage 等）＋各種 Input と画面下部固定のフッターで組み、手順に分けるときだけ Stepper を使う。
- D は Tabs（`orientation="vertical"`）＋ Field / Switch / Select / Divider で組み、1 項目を見出し・説明・入力の 3 行にそろえる。
- E は 1 カラム中央でマスコットを出してよい。F は指標カード＋SegmentedControl の期間切替で組み、グラフ部品は無いので数値と表で代替する。
- 迷ったら `src/app/samples/{list,grid,detail,form,settings}/page.tsx` の実例をそのまま骨組みに使う（E と F のサンプルはまだ無い）。
