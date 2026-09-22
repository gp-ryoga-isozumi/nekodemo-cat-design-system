# Tabs

部品ページ（/guidelines/components/tabs/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/tabs/index.tsx` の JSDoc が正。

## 振る舞い

- 既定は横並び。`TabsList` の下に境界線が入り、選択中の `TabsTrigger` は下端 2px が `border-border-primary`、文字が `text-text-primary` になる。
- `orientation="vertical"` にすると `TabsList` が左の縦並び（最小幅 160px）になり、選択中は右端 2px の線に加えて `bg-surface-selected` が付く。設定画面の左ナビ向け。
- キーボードは Radix 任せ。Tab で選択中のタブに入り、横なら ←→、縦なら ↑↓ で移動する。移動した時点で内容も切り替わる（Enter を押す必要は無い）。
- タブは折り返さない（`whitespace-nowrap`）。数が増えると `TabsList` が横にはみ出すが、スクロールや折りたたみは持たないので、数を減らすか縦にする。
- `disabled` のタブは矢印キーの移動から外れる。選べない理由があるなら、タブを消さずに `TabsContent` の中で理由を説明する。
- `TabsContent` 自体がフォーカスを受け取れる（`focus-visible` でリングが出る）。タブの次の Tab キーで内容側に入る。

## 内容

- タブ名は名詞で 2〜6 文字にそろえる（「概要」「タスク」「履歴」）。動詞や「〜一覧」の繰り返しを付けない。
- 件数は Badge の `count` で添える。タブ名の中に「（8）」と書かない。
- `TabsList` には `aria-label` で何の切り替えかを書く（「案件の情報」）。「タブ」という語は入れない（役割は読み上げが伝える）。

## 参考文献

- [WAI-ARIA Authoring Practices: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [shadcn/ui: Tabs](https://ui.shadcn.com/docs/components/tabs)
- [Material Design 3: Tabs](https://m3.material.io/components/tabs/guidelines)
