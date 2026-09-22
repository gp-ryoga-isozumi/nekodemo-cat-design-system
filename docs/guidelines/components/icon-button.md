# IconButton

部品ページ（/guidelines/components/icon-button/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/icon-button/index.tsx` の JSDoc が正。

## 振る舞い

- サイズは `sm` 32px / `md` 40px / `lg` 48px の正方形で、中のアイコンは 20 / 24 / 28px に自動で決まる。表の行末は `sm`、ヘッダーやツールバーは `md` にする。
- `label` は `aria-label` と `title` の両方になる。マウスでも文言が読めるので、Tooltip を重ねて付けない。
- `type` は既定で `button`。フォームの中に置いても送信されない。送信に使うときだけ `type="submit"` を渡す。
- 既定の `variant` は `ghost` で、背景は hover のときだけ `bg-surface-well` が付く。単独で置いて押せると分かってほしい場所は `outline`、削除は `negative` にする。
- `disabled` では背景が消えて `text-text-disabled` になるが `title` は残る。押せない理由は別の文字で書く。
- `sm` の 32px は指では小さい。タッチで触る画面では `md` 以上にする。

## 内容

- `label` は操作を表す語にする。同じ画面に同じ語が並ぶときは対象を含める（「山田商事 を編集する」）。
- 「その他」「メニュー」のような曖昧な語にしない。開くものを書く（「操作メニューを開く」）。
- 件数を重ねる通知ボタンは `label` に件数を書き、重ねた Badge は `aria-hidden` にする（「通知を見る（未読 3 件）」）。

## 参考文献

- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Material Design 3: Icon buttons](https://m3.material.io/components/icon-buttons/guidelines)
- [Material Symbols](https://fonts.google.com/icons)
