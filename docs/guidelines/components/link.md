# Link

部品ページ（/guidelines/components/link/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/link/index.tsx` の JSDoc が正。

## 振る舞い

- `external` を渡すと `target="_blank"` と `rel="noopener noreferrer"` が付き、末尾に 14px の `open_in_new`（読み上げ名「新しいタブで開く」）が出る。同じタブで開くリンクには渡さない。
- アプリ内の遷移は `asChild` で Next.js の `<Link>` を包む。見た目と `external` の扱いはそのままに、遷移だけ Next.js が受け持つ。
- 色は `text-text-link` で下線つき（`decoration-1 underline-offset-[3px]`）、hover で `text-text-high` に変わる。下線を消さない。
- キーボードでは Enter で遷移する（Space では動かない）。押したときに画面が変わらない処理は Link ではなく Button にする。
- `inline-flex` なので、文中に置くと前後の空白が詰まる。文の途中に差し込むときは `{" "}` で空白を明示する。

## 内容

- 文言は遷移先のページ名・資料名をそのまま使う（「運用ガイド」「ヘルプセンター」）。「見る」「開く」を足さない。
- 外部リンクはどのサービスに出るか分かる名前にする。「外部サイト」とだけ書かない。
- URL そのものを文言にしない。長い URL は行を壊し、読み上げても意味が伝わらない。

## 参考文献

- [WAI-ARIA Authoring Practices: Link Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/)
- [MDN: `<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
