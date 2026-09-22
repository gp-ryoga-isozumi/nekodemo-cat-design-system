# Dialog

部品ページ（/guidelines/components/dialog/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/dialog/index.tsx` の JSDoc が正。

## 振る舞い

- 開いている間、背後は操作もスクロールもできない。オーバーレイのクリックと外側のポインタ操作では閉じないので、閉じる手段は `DialogCancel` ／ `DialogAction` ／ Esc の 3 つだけ。
- 開いた直後のフォーカスは `DialogCancel` に入る（Radix AlertDialog の既定）。`DialogCancel` を省くとフォーカスの行き先が決まらないので、確定ボタンだけの Dialog にしない。
- 閉じるとフォーカスは開いた要素（`DialogTrigger` や行内のボタン）に戻る。一覧の行から開いたときも、その行の位置に戻る。
- Esc はキャンセルと同じ結果になる。Esc で失われて困る入力や選択を中に置かない。
- 幅は `sm:max-w-md`（448px）まで、狭い画面では左右に 16px を残す。高さの上限は無いので、`DialogDescription` は数行で収まる長さにする。
- `DialogFooter` は狭い画面で縦積み（`flex-col-reverse` なので確定ボタンが上）、`sm` 以上で右寄せの横並びになる。ボタンは 2 つまでにする。

## 内容

- `DialogTitle` は対象と操作が分かる疑問文にする（「この案件を削除しますか？」）。名詞だけ（「確認」「削除」）にしない。
- `DialogDescription` には巻き込まれる範囲と取り消せないことを具体的に書く（「関連する 8 件のタスクも削除されます。この操作は取り消せません」）。件数は 3 桁区切りにする。
- `DialogCancel` の文言は「キャンセル」で固定する。`DialogAction` は対象を含む動詞にする（「案件を削除する」）。
- 猫の言葉遊びは入れない。確認の文言は普通の業務日本語で書く。

## 参考文献

- [WAI-ARIA Authoring Practices: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [shadcn/ui: Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Material Design 3: Dialogs](https://m3.material.io/components/dialogs/guidelines)
