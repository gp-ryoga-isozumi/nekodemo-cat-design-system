# 一覧の絞り込みと一括操作

画面の型 A（一覧）の中身のルールです。6 項目あります。表そのものの選び方は [14-choosing-components.md](./14-choosing-components.md) を参照してください。

## 1. 絞り込み行の並びは固定する

見出しの下に 1 行で「検索（`InputSearch`）→ 絞り込み（`FilterChipGroup`）→ 並び替え（`Select`）→ 表示の切替（`SegmentedControl`）」を左から置き、右端に件数を出します。条件が 3 つ以上同時に要る画面では、`FilterChipGroup` の代わりに絞り込みパネルにします（`InputSearch` の `onOpenConditions` で開き、中身は `Popover`（`PopoverTitle` に「絞り込み」）か `Drawer`）。`DataGrid` を使う画面は検索・列の表示切替・密度を内蔵しているので自分で並べず、追加の操作だけを `toolbar` に渡します。

`FilterChipGroup` には `label`（「状態で絞り込む」）が必須です。`aria-label` ではありません。

## 2. 効いている条件は必ず見えるようにする

適用中の条件は `Tag`（`variant="selected"` ＋ `onRemove`）で絞り込み行の下に並べ、右端に「条件をクリアする」（`variant="ghost"` の Button）を置きます。条件が効いているのに画面上で分からない状態にしません。0 件になったときは `EmptyState` の文言を「条件に合う〜がありません」にし、`action` を「条件をクリアする」にします（[02-states.md](./02-states.md)）。

## 3. 件数はページングの近くに 1 か所だけ出す

件数は `Pagination`（`showSummary`、`unit="件"`）が出す「120件中 1〜20件を表示」に任せます。同じ数字を見出しの横と表の上に重ねて出しません。`DataGrid` は件数を自分で出すので、追加で書きません。

## 4. 選択は行頭のチェックボックスだけ

一括操作の対象は行頭の `Checkbox`（`DataGrid` なら `selectable`）で選びます。全選択のチェックは、一部だけ選ばれている間 `checked="indeterminate"` にします。1 件以上選ばれたら表の上に選択ツールバーを出し、「3 件を選択中」＋操作ボタン＋「選択を解除する」を置きます。行クリックの遷移（[03-actions.md](./03-actions.md) の 5）を選択に置き換えません。

- 良い例: `<DataGrid selectable onSelectionChange={setSelected} … />` ＋ 選択件数のツールバー
- 悪い例: 行クリックで選択状態にして、詳細へ行く手段が無くなる

## 5. 一括の取り消し不可操作は件数を書いて確認する

一括削除などは `Dialog` で確認し、`DialogDescription` と `DialogAction` の両方に件数を入れます（「3 件の案件を削除する」）。ページ外を含む全件選択を用意する場合は、確認文に「絞り込み条件に一致する全 120 件」と範囲を書きます。確認なしで一括の削除・公開・権限変更を実行しません。

## 6. 結果は件数で伝え、一部失敗は残す

成功は `toast.success("3 件を削除しました")`。一部が失敗したときは Toast にせず、表の上に `InlineMessage variant="warning"` で「3 件中 1 件を削除できませんでした」と出し、失敗した行を一覧に残して選択も解除しません。

## AI 向けの要約

- 絞り込み行は 検索 → `FilterChipGroup` → 並び替え → 表示切替 の順、右端に件数。条件が 3 つ以上なら `onOpenConditions` で開く絞り込みパネルにする。
- `FilterChipGroup` の読み上げ名は `label`（必須）。`aria-label` ではない。
- 効いている条件は `Tag`（`onRemove`）で見せ、「条件をクリアする」を必ず置く。
- 件数は `Pagination` の `showSummary` か `DataGrid` に任せ、同じ数字を重ねて出さない。
- 選択は行頭の `Checkbox`（`DataGrid` は `selectable`）。1 件以上選んだら「N 件を選択中」＋操作＋選択解除のツールバーを出す。
- 一括の取り消し不可操作は `Dialog` で確認し、本文と確定ボタンに件数を入れる。結果は件数で伝え、一部失敗は `InlineMessage variant="warning"` ＋失敗行を残す。
