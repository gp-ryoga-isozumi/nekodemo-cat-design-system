# Tooltip

部品ページ（/guidelines/components/tooltip/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/tooltip/index.tsx` の JSDoc が正。

## 振る舞い

- 出るまでの待ち時間は `TooltipProvider` の `delayDuration`（既定 300ms）。離すとすぐ消える。速さを変えるときは個々の Tooltip ではなく Provider 側で変える。
- キーボードでフォーカスしたときにも出るが、クリックでトリガーを押した直後には出ない（Radix の既定）。開いている間は Esc で閉じられる。
- 幅は `max-w-64`（256px）まで。超えると折り返して複数行になる。トリガーからは `sideOffset={6}` の 6px 離れ、矢印が自動で付く。
- 背景は `bg-surface-inverse`、文字は `text-text-inverse` の `text-1`。周りの面の色に関わらず反転色で出るので、濃い背景の上でも枠を足さない。
- 中にボタンやリンクは置かない。トリガーから離れると閉じるためキーボードでは到達できない。押せるものが必要なら Popover にする。
- タップ端末では出ないことがある。IconButton の `label` は Tooltip とは別に必ず渡す（Tooltip は `label` の代わりにならない）。

## 内容

- 1 行・20 文字程度までの補足にする。句点で終える文章は書かない。
- IconButton に添えるときは `label` と同じ文言にする。別の言い方にすると、読み上げと見た目で違う名前になる。
- 画面を見れば分かること（ボタンの文字の繰り返し）は書かない。省略した語の正式名称や、値の意味だけを書く。

## 参考文献

- [WAI-ARIA Authoring Practices: Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [Radix Primitives: Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)
- [Material Design 3: Tooltips](https://m3.material.io/components/tooltips/guidelines)
