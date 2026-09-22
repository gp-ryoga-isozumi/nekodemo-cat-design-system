# ガードブロック

設計書 §17.1 です。nekodemo を使うプロジェクトの `AGENTS.md`（または `CLAUDE.md`）に、下のブロックをそのまま貼り付けてください。AI コーディングツールが毎回読む場所にルールを置くことで、部品の使い方と検査の実行を忘れないようにします。

## 使い方

1. 利用側リポジトリの `AGENTS.md` を開きます。
2. 下のブロックを丸ごと貼り付けます（`<!-- nekodemo:guard:start -->` から `<!-- nekodemo:guard:end -->` まで、コメント行も含めて残します）。
3. すでに貼ってある場合は、開始と終了のコメントに挟まれた範囲だけを新しい内容に差し替えます。

## 貼り付けるブロック

```markdown
<!-- nekodemo:guard:start -->
## nekodemo（猫デザインシステム）を使うときのルール

- UI 部品は `nekodemo` から import する。生の `<button>` `<input>` `<table>` を書かない。
- 色・角丸・文字サイズは役割トークン名だけを使う（`bg-surface-card`, `text-text-low`, `rounded-action`, `text-3`）。
  `#hex` / `rgb()` / Tailwind 既定パレット（`bg-blue-500` 等）/ 任意値（`text-[13px]`）は禁止。
- アイコンは `<Icon icon="search" />`（Material Symbols の名前）。`lucide-react` は使わない。
- フォントウェイトは `font-normal` / `font-bold` だけ（`font-medium` `font-semibold` は禁止）。`style` 属性で色（color / background / borderColor）を指定しない。
- テーマは `<html data-neko-theme="…">` と `NekoThemeProvider` の `defaultTheme` でだけ指定する。
- 画面は A〜F の型（docs/guidelines/01-screen-patterns.md）に当てはめて組む。
- 一覧・表・詳細には「読み込み中 / 0 件 / エラー / 成功」の 4 状態を必ず実装する。
- 主ボタン（primary）は 1 画面 1 つ。削除は Dialog で確認し、ボタンは「削除する」。
- 作業の最後に `pnpm nekodemo check src --strict` を実行し、0 件にしてから完了報告する。
- 詳細: https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/USING_NEKODEMO.md
<!-- nekodemo:guard:end -->
```

## 補足

- ブロックの中身は [../guidelines/](../guidelines/README.md) の要点を 10 行に縮めたものです。詳しい理由や例はガイドライン側にあります。
- `<!-- nekodemo:guard:start -->` / `<!-- nekodemo:guard:end -->` のコメントは、後から機械的に差し替えるための目印です。消さないでください。
- Markdown のコメントなので、貼り付けた `AGENTS.md` の見た目には出ません。

## AI 向けの要約

- 利用側リポジトリの `AGENTS.md` に、上のガードブロックを開始・終了コメントごとそのまま貼る。
- すでにある場合は、開始と終了のコメントに挟まれた範囲だけを差し替える。コメント行は消さない。
- ブロックの文面を勝手に書き換えたり、項目を減らしたりしない。
- 画面は A〜F の型（docs/guidelines/01-screen-patterns.md）に当てはめて組む。
- 貼ったあとは、そこに書かれたルール（画面の型・役割トークン・Icon・ウェイト 400 / 700・4 状態・主ボタン 1 つ・削除の確認 Dialog）に従って実装する。
- 作業の最後に `pnpm nekodemo check src --strict` を実行し、0 件にしてから完了報告する。
- 詳しいルールは https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/USING_NEKODEMO.md を参照する。
