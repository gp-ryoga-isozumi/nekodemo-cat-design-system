# UX ガイドライン

nekodemo でプロトタイプ画面を作るときのルールです。設計書 §10 を出発点に、ここ（`docs/guidelines/`）を正としています。部品そのものの作法は [../COMPONENT_GUIDE.md](../COMPONENT_GUIDE.md) を参照してください。

## 目次

### パターンと原則

| ファイル | 内容 |
|---|---|
| [01-screen-patterns.md](./01-screen-patterns.md) | 画面の型。A 一覧 / B 詳細 / C 作成・編集フォーム / D 設定 / E ログイン / F ダッシュボード の 6 型と共通の枠 |
| [02-states.md](./02-states.md) | 状態の必須セット。読み込み中 / 0 件 / エラー / 成功 の 4 状態。省略はプロトタイプでも不可 |
| [03-actions.md](./03-actions.md) | 操作の原則。主アクション 1 つ、取り消し不可の操作の確認、保存後の遷移、モーダルの使いどころ |
| [04-writing.md](./04-writing.md) | 文言。「です・ます」、ボタンは「〜する」、エラー文の型、数値・日付・空値の書式。v1 は日本語のみ |
| [05-spacing-and-color.md](./05-spacing-and-color.md) | 余白と色。4px の倍数、役割トークン名だけを使う、NK001〜NK010 |
| [06-cat-flavor.md](./06-cat-flavor.md) | 猫要素の使いどころ。耳付きアイコン・マスコット・猫の顔のシルエットを出す場所 |
| [07-accessibility.md](./07-accessibility.md) | アクセシビリティの最低ライン。コントラスト、フォーカス、label、キーボード、見出し階層、タッチ目標 |
| [08-side-panel.md](./08-side-panel.md) | サイドパネル。Drawer で出す補助画面と、詳細ページとの使い分け |
| [09-layout.md](./09-layout.md) | レイアウトと画面幅。外枠の寸法、カラムの分け方、狭い幅、固定フッター、表の横スクロール |
| [10-forms.md](./10-forms.md) | フォームの組み方。ラベルの位置、入力の幅、必須の示し方、検証タイミング、Stepper |
| [11-notifications.md](./11-notifications.md) | 知らせ方の選び方。Toast / InlineMessage / FormMessage / Dialog の使い分け |
| [12-list-and-filters.md](./12-list-and-filters.md) | 一覧の絞り込みと一括操作。絞り込み行の並び、条件の見せ方、選択、一括操作の確認と結果 |
| [13-navigation.md](./13-navigation.md) | ナビゲーションの構造。階層の深さ、現在地、Breadcrumb を出す条件、戻り先 |
| [14-choosing-components.md](./14-choosing-components.md) | 部品の選び方。似た部品（Dialog / Modal / Drawer など 8 組）の決定表 |

### themes/（見た目の土台）

| ファイル | 内容 |
|---|---|
| [themes/color.md](./themes/color.md) | 色の 3 層、役割トークンの使い分け、ダークテーマ（ロシアンブルー）での注意 |
| [themes/typography.md](./themes/typography.md) | 文字サイズの段階とウェイト（400 / 700） |
| [themes/shape.md](./themes/shape.md) | 角丸と影の用途名 |
| [themes/icons.md](./themes/icons.md) | 猫耳付きアイコンの階層（T1 / T2 / T3）と使い方 |
| [themes/motion.md](./themes/motion.md) | 動きの時間、動かしてよいもの、`prefers-reduced-motion` |

### components/（部品ページの手書き節）

`components/` には 48 部品ぶんのメモ（`<部品名>.md`）があります。ガイドラインサイトの部品ページで、実装から機械的に出せない節（振る舞い・内容・参考文献）として読み込まれます。部品の props と使用例は、部品の JSDoc（`src/components/ui/<name>/index.tsx`）と `README.md` が正です。

## 読む順番

1. まず [01-screen-patterns.md](./01-screen-patterns.md) で画面の型を決め、[09-layout.md](./09-layout.md) で外枠と幅を決めます。
2. [02-states.md](./02-states.md) の 4 状態を骨組みに入れます。
3. 使う部品に迷ったら [14-choosing-components.md](./14-choosing-components.md) の決定表で決めます。
4. 型ごとの中身を [10-forms.md](./10-forms.md)（フォーム）、[12-list-and-filters.md](./12-list-and-filters.md)（一覧）、[13-navigation.md](./13-navigation.md)（ナビ）で詰めます。
5. 中身を作りながら [03-actions.md](./03-actions.md)・[04-writing.md](./04-writing.md)・[11-notifications.md](./11-notifications.md) を確認します。
6. スタイルを書くときは [05-spacing-and-color.md](./05-spacing-and-color.md) の役割トークンだけを使い、色・文字・角丸・動きの土台は `themes/` を見ます。
7. 猫要素を足すときは [06-cat-flavor.md](./06-cat-flavor.md) で場所を確認します。
8. 仕上げに [07-accessibility.md](./07-accessibility.md) とチェックリストで自己確認します。

同じ内容は AI 向けに `skills/use-nekodemo` と `docs/ai/USING_NEKODEMO.md` にも命令形で置きます。利用側リポジトリに貼るルールは [../ai/GUARD_BLOCK.md](../ai/GUARD_BLOCK.md) にあります。

## 実例

画面の型には、それぞれ動く実例があります。

- A 一覧: `src/app/samples/list/page.tsx`（DataGrid 版は `src/app/samples/grid/page.tsx`）
- B 詳細: `src/app/samples/detail/page.tsx`
- C 作成・編集フォーム: `src/app/samples/form/page.tsx`
- D 設定: `src/app/samples/settings/page.tsx`
- 共通の枠: `src/app/samples/app-shell.tsx`
- E ログイン / F ダッシュボード: サンプル画面はまだありません。

## プロトタイプ完成チェックリスト

設計書 §10.8 です。完成前に自己確認します。

- [ ] `nekodemo check` が出す自己確認項目（`--format json` の `manualChecks`）を上から確認する
- [ ] 色・角丸・文字サイズが役割トークン名だけで書かれている（`pnpm nekodemo check src --strict` の error が 0 件）
- [ ] 残った warn / info は、残す理由を完了報告に書く

利用側プロジェクトでは `pnpm nekodemo check src --strict`（npm なら `npx nekodemo check src --strict`）を実行します。このリポジトリの中では `pnpm check` が同じ検査を実行します。

## AI 向けの要約

- 画面を作る前に 01（画面の型）・09（レイアウト）・02（4 状態）を読み、どの型でどの幅で組むかを決める。
- 似た部品で迷ったら 14（部品の選び方）の決定表で決め、勝手に代用しない。
- フォームは 10、一覧の絞り込みと一括操作は 12、通知の出し分けは 11、ナビは 13 に従う。
- 色・角丸・文字サイズを書くときは 05 の役割トークン名だけを使い、動きは `themes/motion.md` のとおり部品に任せる。
- 猫要素を足したくなったら 06 で出してよい場所かを確認する。文言を書くときは 04 の「です・ます」＋「〜する」に従う。
- 完成前に `nekodemo check` が出す自己確認項目を確認する。
- 最後に `pnpm nekodemo check src --strict`（このリポジトリでは `pnpm check`）を実行し、error 0 件にしてから完了報告する。残した warn / info は理由を書く。
