# Avatar

部品ページ（/guidelines/components/avatar/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/avatar/index.tsx` の JSDoc が正。

## 振る舞い

- サイズは `sm` 32px / `md` 40px / `lg` 56px。一覧の行は `sm`、ヘッダーのアカウントは `md`、詳細の見出し脇は `lg` にする。同じ並びの中でサイズを混ぜない。
- `src` の画像が読み込めないときは自動で fallback に切り替わる。`src` があるときだけ 300ms 待ってから出すので、読み込み中に文字がちらつかない。
- `fallback` に文字を渡すと `bg-surface-primary-subtle` の上に太字で出る。渡さないと猫の顔（`cat_face`）のシルエットになるので、担当者未定やゲストのように「人が決まっていない」ことを表すときに省略する。
- 画像は `object-cover` で正方形に切り抜かれる。横長の写真は顔が切れるため、正方形に近い画像を渡す。
- 複数人を並べるときは同じ `size` で横に並べる。重ねて表示する形は用意していない。

## 内容

- `name` は画面に出ている表記と同じ人名にする（「山田 太郎」）。ID やメールアドレスを渡さない。
- `fallback` は 1〜2 文字。姓の頭（「山田」）にし、英字のイニシャル（YT）にはしない。
- 人が決まっていないときの `name` は状態を表す語にする（「担当者未定」「ゲスト」）。「-」や空文字にしない。

## 参考文献

- [shadcn/ui: Avatar](https://ui.shadcn.com/docs/components/avatar)
- [Radix Primitives: Avatar](https://www.radix-ui.com/primitives/docs/components/avatar)
- [MDN: `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
