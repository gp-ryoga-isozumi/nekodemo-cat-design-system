# Drawer

部品ページ（/guidelines/components/drawer/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/drawer/index.tsx` の JSDoc が正。

## 振る舞い

- `side="right"`（既定）と `"left"` は画面の高さいっぱいで、幅は `w-3/4 max-w-[480px]`。`"bottom"` は幅いっぱいで高さ `max-h-[80vh]`、上端だけ角丸（`rounded-t-modal`）になる。
- 中身は `DrawerHeader` → `DrawerBody` → `DrawerFooter` の縦積み。スクロールするのは `DrawerBody`（`flex-1 overflow-y-auto`）だけで、見出しとフッターは常に見える。
- `showCloseButton`（既定 true）で右上に「閉じる」の IconButton が出る。`DrawerHeader` は右に 48px の余白（`pr-12`）を取っているので、見出し行の右端に別の操作を置かない。
- Esc・オーバーレイのクリック・閉じるボタンで閉じ、フォーカスは開いた要素に戻る。開いている間、背後の一覧は見えるが操作できない。
- `DrawerFooter` は `bg-surface-well` の右寄せの横並びで、下端に張り付く（`mt-auto`）。主ボタンは右端に 1 つだけ置く。
- 一覧の行から開くときは `open` / `onOpenChange` で制御する。`DrawerClose` を `asChild` で使えば、フッターの任意のボタンを閉じる操作にできる。

## 内容

- `DrawerTitle` はその 1 件を特定できる固有名（案件名・顧客名）にする。「詳細」「情報」のような一般名にしない。
- `DrawerDescription` は 1 行の補助情報（顧客名・状態）にとどめ、本文は `DrawerBody` に置く。
- フッターのボタンは「閉じる」と主ボタン 1 つ。主ボタンが画面遷移なら行き先が分かる文言にする（「詳細を開く」）。

## 参考文献

- [shadcn/ui: Sheet](https://ui.shadcn.com/docs/components/sheet)
- [Radix Primitives: Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Material Design 3: Side sheets](https://m3.material.io/components/side-sheets/guidelines)
