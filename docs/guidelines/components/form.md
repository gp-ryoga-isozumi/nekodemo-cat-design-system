# Form

部品ページ（/guidelines/components/form/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/form/index.tsx` の JSDoc が正。

## 振る舞い

- 並びはラベル → 入力 → 補足 → エラーで固定。`FormItem` の中は 6px 間隔（`gap-1.5`）なので、項目のあいだの余白は親側で決める。
- `FormControl` が子の入力に `id` / `aria-describedby` / `aria-invalid` を付ける。子は 1 つだけ渡す（`Slot` なので複数の子は置けない）。入力側にこれらを自分で書かない。
- `aria-describedby` は `FormDescription` と `FormMessage` が実際に描画されているときだけ結ばれる。補足を条件で出し分けても読み上げが食い違わない。
- `FormMessage` は `role="alert"` なので、出た瞬間に読み上げられる。children を書かなければ zod のメッセージがそのまま出る。
- 検証は送信時に走り、一度エラーが出た項目は入力し直すたびに再検証される（react-hook-form の既定）。送信ボタンは初期状態から押せるままにする。
- react-hook-form を使わない単発の項目は `Field` を使う。`htmlFor` は必須で、子の入力には `id` と `aria-describedby`（`<id>-description` / `<id>-error`）を自分で付ける。

## 内容

- ラベルは名詞（「顧客名」「見積金額」）。「〜を入力」「〜してください」にしない。
- 必須は `FormLabel required` が出す「必須」の語に任せる。`*` や「（必須）」を文言に足さない。任意の項目には何も付けない。
- `FormDescription` には入力する前に知っておくことを書く（「顧客に見せる名前になります」）。プレースホルダーには例だけを書く（「例: 山田商事」）。
- エラー文は「何が起きたか」＋「どうすればよいか」（「メールアドレスの形式が正しくありません。@ を含めて入力してください」）。「必須です」だけにしない。

## 参考文献

- [shadcn/ui: Form](https://ui.shadcn.com/docs/components/form)
- [MDN: `<form>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [Material Design 3: Text fields](https://m3.material.io/components/text-fields/guidelines)
