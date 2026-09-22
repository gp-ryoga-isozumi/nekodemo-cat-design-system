# Popover

部品ページ（/guidelines/components/popover/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/popover/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は既定 288px（`w-72`）で固定。中身が増えても横には広がらないので、必要なら `className` で `w-*` を上書きする。高さは中身なりで、スクロールは自分で付ける。
- 既定の位置はトリガーの下・左端そろえ（`align="start"`、`sideOffset={6}`）。画面からはみ出すときは Radix が自動で反対側に回す。
- 開くとフォーカスがパネルの中に移り、Esc かパネルの外のクリックで閉じてトリガーにフォーカスが戻る。背後は操作できるまま（非モーダル）なので、開いたまま画面をスクロールするとパネルが追従する。
- `PopoverTitle` を置くと `aria-labelledby` が自動で結ばれる。見出しを見せたくないときは消さずに `className="sr-only"` で残す。
- `PopoverClose` を `asChild` で使うと、パネルの中の任意のボタンを閉じる操作にできる。`PopoverAnchor` を使えば、トリガー以外の要素（表のセルなど）を基準に開ける。
- 表のヘッダーに置いた場合、パネルは表の外に描かれる（Portal）ので、表の横スクロールで切れない。

## 内容

- `PopoverTitle` は名詞の短い見出しにし、トリガーのボタン文言とそろえる（ボタン「列」→ 見出し「表示する列」）。
- 中の操作は即時反映を前提にし、「適用する」ボタンを置かない。閉じるボタンを置くなら文言は「閉じる」にする。
- `PopoverDescription` は 2 行まで。操作に必須の説明はパネルの外（ラベルや本文）に書く。

## 参考文献

- [WAI-ARIA Authoring Practices: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [shadcn/ui: Popover](https://ui.shadcn.com/docs/components/popover)
- [Radix Primitives: Popover](https://www.radix-ui.com/primitives/docs/components/popover)
