# InlineMessage

部品ページ（/guidelines/components/inline-message/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/inline-message/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は親いっぱいに広がる。失敗した領域（一覧・フォーム・セクション）のすぐ上に置き、画面の最上部にまとめない。
- `negative` は `role="alert"` で出た瞬間に読み上げられ、他の 3 種類は `role="status"` で区切りのよいところで読まれる。最初から置いてあるものは読み上げられないので、結果として出すときは条件付きで描画する。
- アイコンは variant から決まる（info / check_circle / warning / error）。自分で渡す口は無く、文字色・背景・枠もまとめて切り替わる。
- `action` は右端に縦中央で 1 つだけ入る。狭い幅でも折り返さないので、「再試行する」程度の短いボタンにする。
- `title` を付けると太字 1 行＋本文の 2 段になる。1 文で済む内容なら `title` を付けず本文だけにする。
- 閉じるボタンは無い。消えないので、読めば済む案内を貼りっぱなしにしない（消えてよい通知は Toast）。

## 内容

- `negative` は原因と対処の両方を書く（「一覧を読み込めませんでした。通信状態を確認して再試行してください。」）。「エラーが発生しました」だけにしない。
- `warning` はまだ起きていないことへの予告（「見積金額が 1,200,000 円を超えています」）、`info` は事実の通知に使う。
- 本文は 2 文まで。それより長くなるなら、詳細はページの本文に書いてここには結論だけ残す。
- `title` は名詞（「自動完了」「権限がありません」）にし、本文と同じことを繰り返さない。

## 参考文献

- [WAI-ARIA Authoring Practices: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [shadcn/ui: Alert](https://ui.shadcn.com/docs/components/alert)
