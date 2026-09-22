# Toast

部品ページ（/guidelines/components/toast/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/toast/index.tsx` の JSDoc が正。

## 振る舞い

- 出る位置は右上で固定（`position="top-right"`）、幅は最大 360px。長い文言は折り返すので、1〜2 行に収まる長さにする。
- 種別によらず 3 秒（`duration={3000}`）で消える。マウスを載せているあいだと、タブが裏に回っているあいだは数えない。
- 同時に見えるのは 3 件まで。それ以上は隠れるので、連続する操作の結果をまとめて出さない。
- 閉じるボタン（読み上げ名「閉じる」）が常に付く。通知の置き場は `aria-label="通知"` で、`Alt + T` でそこにフォーカスを移せる。
- `action` は右端に 1 つだけ入る。3 秒で消えるため、押し逃すと戻せない操作（取り消し不可の復元など）は置かない。
- `toast.promise` を使うと 1 つの Toast が処理中（`hourglass_empty`）から結果に変わる。処理中のあいだは自動では消えない。

## 内容

- 本文は起きたことの完了形で 20 文字以内、動詞は 1 つ（「案件を保存しました」）。「〜を保存しました。ご確認ください」のように 2 文にしない。
- 対象名を入れて長くなるときは、本文を短くして詳細を `description` に回す（「山田商事 / 1,200,000 円 / 納期 2026/09/21」）。
- 失敗は本文を「保存できませんでした」までにし、原因と対処は `description` に書く（「通信が切れています。再試行してください。」）。
- `action` の文言は「取り消す」のような 1 語の動詞にする。「こちら」「詳細」にしない。

## 参考文献

- [WAI-ARIA Authoring Practices: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [shadcn/ui: Sonner](https://ui.shadcn.com/docs/components/sonner)
- [Material Design 3: Snackbar](https://m3.material.io/components/snackbar/guidelines)
