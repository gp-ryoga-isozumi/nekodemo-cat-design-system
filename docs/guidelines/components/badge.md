# Badge

部品ページ（/guidelines/components/badge/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/badge/index.tsx` の JSDoc が正。

## 振る舞い

- 高さ 20px の丸（`h-5 min-w-5 rounded-round`）で、1 桁でも円形を保つ。数字は等幅（`font-mono`）なので、件数が増えても幅が跳ねない。
- `count` が `max`（既定 99）を超えると `99+` の形に丸める。`max={9}` を渡せば `9+` になる。
- `count={0}` は `0` と表示する。0 件のときに消したいなら、呼び出し側で Badge 自体を出し分ける。
- IconButton に重ねるときは親を `relative` にして右上に `absolute` で置き、Badge には `aria-hidden` を付ける。件数はボタンの `label` に書く。
- `children` を渡すと数値の代わりにその文字を出す。`min-w-5` の円より広がるので `px-2` を足す。
- 色の使い分けは、未対応・エラーが `negative`、通常の通知が `primary`、補足の件数が `neutral`。

## 内容

- 中身は数値か 1〜2 語まで。「進行中」「完了」のような状態のラベルは Tag にする。
- 文字で件数を書くときは単位を半角スペースなしで付ける（`120件`）。
- Badge だけでは何の数か伝わらない。隣の文言か、包むボタン・タブの名前に対象を書く。

## 参考文献

- [shadcn/ui: Badge](https://ui.shadcn.com/docs/components/badge)
- [Material Design 3: Badges](https://m3.material.io/components/badges/guidelines)
