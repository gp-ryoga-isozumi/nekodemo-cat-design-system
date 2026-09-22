# Modal

部品ページ（/guidelines/components/modal/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/modal/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は `sm:max-w-lg`（512px）まで、高さは画面から上下 16px を引いた `max-h-[calc(100%-2rem)]` まで。超えると `ModalBody` だけがスクロールし、`ModalHeader` と `ModalFooter` は常に見える。
- Esc・オーバーレイのクリック・右上の閉じるボタン・`ModalClose` で閉じ、フォーカスは開いた要素に戻る。入力途中でも確認なく閉じるので、失うと困る入力は Dialog で確認するかページにする。
- 開いている間、背後は操作もスクロールもできない。一覧を見ながら入力したい場合は Drawer を使う。
- `ModalHeader` は右に 48px の余白（`pr-12`）を取ってある。`showCloseButton={false}` で閉じるボタンを消すときは、必ずフッターに「キャンセル」を置く。
- `ModalFooter` は狭い画面で縦積み（確定ボタンが上）、`sm` 以上で右寄せの横並びになり、背景は `bg-surface-well`。主ボタンは 1 つだけにする。
- `open` / `onOpenChange` で制御すると、保存に成功したときだけ閉じる作りにできる。`ModalTrigger` を使わず、一覧の行や Menu から開くときもこの形にする。

## 内容

- `ModalTitle` は操作を表す動詞にし、開くボタンの文言とそろえる（ボタン「担当者を変更する」→ 見出し「担当者を変更する」）。
- フッターの確定ボタンは見出しと同じ動詞の短い形にする（見出し「担当者を変更する」→ ボタン「変更する」）。取り消しは「キャンセル」。
- `ModalDescription` は 1〜2 行の補足まで。各項目の説明は `FormDescription` に書く。

## 参考文献

- [WAI-ARIA Authoring Practices: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [shadcn/ui: Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Radix Primitives: Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
