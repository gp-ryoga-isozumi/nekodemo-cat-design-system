---
name: use-nekodemo
description: >
  nekodemo（猫デザインシステム）でプロトタイプ画面を作るスキル。
  「nekodemo で画面を作って」「プロトタイプを作って」「猫DSで一覧画面を」で発動。
  画面の型を選び、4 状態を実装し、nekodemo check の error を 0 件にして完了する。
---

# use-nekodemo

## 前提チェック
1. `package.json` に `nekodemo` があるか。無ければ `setup-nekodemo` に引き継いで中断する。
2. `nekodemo.config.json` の `defaultTheme` を読む。無ければ利用者に 1 回だけ聞く（既定は `calico`）。
3. ルールの全文は `docs/ai/USING_NEKODEMO.md`（https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/USING_NEKODEMO.md）。部品の props に迷ったらそこを読む。
4. 画面の中身の詳しいルールは guidelines（リポジトリの `docs/guidelines/`、利用側は `node_modules/nekodemo/dist/ai/guidelines/`）を読む: `09-layout.md`（外枠と幅・狭い幅・固定フッター）/ `10-forms.md`（ラベル・必須・検証タイミング）/ `11-notifications.md`（Toast / InlineMessage / FormMessage / Dialog の使い分け）/ `12-list-and-filters.md`（絞り込みと一括操作）/ `13-navigation.md`（階層・現在地・Breadcrumb）/ `14-choosing-components.md`（似た部品の決定表）。

## 手順
1. 依頼内容を画面の型に当てはめる。
   - A 一覧: `PageHeader`（見出し＋主アクション） → `InputSearch`＋`FilterChipGroup`（絞り込み） → `Table` → `Pagination`。ソート・列幅・選択・列の絞り込みが要るなら `DataGrid`（4 状態内蔵、`aria-label` 必須）。サジェスト付きの入力は `SearchCombobox`
   - B 詳細: `PageHeader`（`breadcrumb` + `meta` に `StatusTag` + `actions` に操作 `Menu`） → 2 カラムの `Card`（左: 情報は `DescriptionList`、右: 関連）＋`Tabs`。補足は `Accordion` で畳む
   - C 作成・編集フォーム: 見出し → `Form`（セクションごとに `Card`）→ 画面下部に固定のフッター（キャンセル／保存）。金額は `InputNumber`、日付は `InputDate`、3〜5 手順に分けるなら上に `Stepper`
   - D 設定: 左に縦 `Tabs` → 右に設定項目（見出し・説明・入力の 3 行、`Field` / `Switch` / `Select`）。表示の切替（一覧 / カード、日 / 週 / 月）は `SegmentedControl`
   - 共通枠: 左に `SideNavigation`（240 / 64px）、上にアプリ名＋`NekoThemePicker`＋`Avatar`。最大幅 1200px、余白 24px。
2. 部品は `nekodemo` から import する。生の `<button>` `<input>` `<select>` `<textarea>` `<table>` は書かない。`Form` で使う `useForm` / `zodResolver` / `z` も `nekodemo` から import する（`react-hook-form` / `zod` を入れない）。props に迷ったら `node_modules/nekodemo/dist/components/ui/<name>/index.d.ts` の JSDoc を読む。
3. 色・角丸・文字サイズは役割トークン名だけ（`bg-surface-card` `text-text-low` `border-border-middle` `rounded-action` `text-3`）。`#hex` / `rgb()` / Tailwind 既定パレット / 任意値 / `font-medium` は使わない。
4. アイコンは `<Icon icon="search" />`（Material Symbols 名）。
5. 一覧・表・カード群・詳細に 4 状態を実装する:
   - 読み込み中: `SkeletonRows`（5 行）／ `Skeleton` 3 枚
   - 0 件: `EmptyState`（「まだ〜がありません」＋主アクション。検索 0 件は「条件に合う〜がありません」＋条件クリア）
   - エラー: `InlineMessage variant="negative"` ＋「再試行する」
   - 成功: `toast.success`（3 秒。遷移を伴うなら遷移先で）
6. 操作の原則: 主ボタン（primary）は 1 画面 1 つ。削除は `Dialog` で確認し `DialogAction variant="negative"` に「削除する」（行メニューから開くときは `DialogTrigger` ではなく `<Dialog open onOpenChange>` をページに 1 つ置いて state で開く）。保存後は詳細か一覧に戻す。モーダルは 3 項目以内の短い入力だけ。
7. 文言: 「です・ます」、ボタンは「〜する」、エラー文は「何が起きたか＋どうすればよいか」。数値は 3 桁区切り、日付は `2026/09/21`。
8. 猫要素は耳付きアイコンだけを常用する。マスコットは `EmptyState`・初回ローディング・404・ログインの 4 か所だけ。業務データの領域に猫のイラスト・絵文字を入れない。
9. `pnpm nekodemo check src --strict` を実行し、error を直して 0 件にする（warn は内容を確認する）。NK006（猫版が無いアイコン）が出たら別の名前に替えるか、`request-cat-icon` で追加を依頼する。
10. 完成チェックリストで自己確認し、結果（作った画面、状態、check の結果）を報告する。

## 完了条件
- check の error が 0 件、4 状態あり、主ボタン 1 つ、`NekoThemePicker` で 3 テーマを切り替えても崩れない、キーボードだけで主要操作ができる。

## やってはいけないこと
- 役割トークン以外の色指定、`lucide-react`、生の HTML フォーム要素、猫要素の業務領域への追加。
- 利用者の承認なしに `nekodemo.config.json` の `themes` を変更すること。
- 4 状態の省略（プロトタイプでも不可）。
- 「OK」「はい」というボタン文言。
