# Menu

部品ページ（/guidelines/components/menu/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/menu/index.tsx` の JSDoc が正。

## 振る舞い

- トリガーは `MenuTrigger asChild` で IconButton や Button を包む。クリックのほか、Enter・Space・下矢印でも開く。
- 幅は最小 176px（`min-w-44`）で、いちばん長い項目に合わせて広がる。高さは画面に収まる範囲までで、超えた分はメニューの中でスクロールする。
- 既定の寄せはトリガーの右端（`align="end"`、`sideOffset` 4px）。左端に合わせたいときだけ `align="start"` にする。
- 矢印キーで項目を移動し、Enter か Space で実行する。Esc・外側のクリック・項目の選択で閉じ、フォーカスはトリガーに戻る。
- 項目のハイライト（`focus:bg-surface-well`）はマウスでもキーボードでも同じ。`MenuItem variant="negative"` だけは文字と背景が negative になる。
- 権限が無い操作は項目を消さずに `disabled` にする。押せないことが見えるので、なぜ無いのかを探さなくて済む。

## 内容

- 項目は動詞で終える（「編集する」「複製する」「削除する」）。遷移は「〜を見る」、操作は「〜する」と書き分ける。
- `MenuLabel` は名詞の見出し（「並び順」「一覧に表示する列」）。項目の説明文をここに書かない。
- `MenuShortcut` は記号だけ（`⌘E`）にする。「ショートカット」などの語を添えない。
- `MenuTrigger` が IconButton のときは `label` に対象を入れる（「案件の操作」）。「操作」だけにしない。

## 参考文献

- [WAI-ARIA Authoring Practices: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [Radix Primitives: Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)
- [Material Design 3: Menus](https://m3.material.io/components/menus/guidelines)
