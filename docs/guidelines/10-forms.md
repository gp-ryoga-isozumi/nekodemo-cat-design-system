# フォームの組み方

画面の型 C（作成・編集フォーム）の中身のルールです。6 項目あります。部品の使い方は `Form` / `Field` の部品ページを参照してください。

## 1. ラベルは入力の上、1 項目 1 行

ラベルは入力の上に置きます（横並びにしません）。`FormItem` の中に `FormLabel` → `FormControl` → `FormDescription` → `FormMessage` の順で書き、全項目でこの順を崩しません。項目の間は 16px、セクションの間は 32px です。セクションは `Card` で囲みます。

```tsx
<FormItem>
  <FormLabel required>顧客名</FormLabel>
  <FormControl><Input placeholder="例: 山田商事" {...field} /></FormControl>
  <FormDescription>顧客に見せる名前になります</FormDescription>
  <FormMessage />
</FormItem>
```

## 2. 入力の幅は値の長さに合わせる

入力欄をカードいっぱいに伸ばさず、入る値の長さに合わせます。郵便番号・金額・日付のような短い値を幅 100% の `Input` にしません。関連する短い項目は 2 カラムに並べます（`sm:grid-cols-2`）。

- 良い例: 金額は `InputNumber`（`unit="円"`）、日付は `InputDate` を横に 2 つ並べる
- 悪い例: 「郵便番号」を幅 100% の `Input` にする

## 3. 必須は `FormLabel required` だけで示し、任意には何も付けない

必須は `FormLabel required`（`Field` なら `required`）が出す「必須」の語に任せます。`*` や「（必須）」をラベル文言に書き足しません。任意の項目には何も付けません。任意のほうが多い画面では、フォームの先頭に「空欄のままでも保存できます」と 1 文置きます。

## 4. 検証は送信時、再検証は入力時

検証は「保存する」を押したときに走らせます。入力中やフォーカスが外れた時点では出しません。一度エラーが出た項目だけ、入力し直すたびに再検証します（`useForm` の既定の挙動）。送信ボタンは初期状態から押せるままにします（[03-actions.md](./03-actions.md) の 3）。送信中は `loading` で二重送信を防ぎます。

## 5. エラーは項目のそばに出し、最初のエラーへ移動する

エラーは `FormMessage` で項目のすぐ下に出します。送信して 2 つ以上エラーが出たときは、フォームの先頭に `InlineMessage`（`variant="negative"`）で「3 件の入力を確認してください」を出し、最初のエラー項目にフォーカスを移します。入力エラーを Toast だけで伝えるのは不可です（[11-notifications.md](./11-notifications.md)）。

## 6. 手順に分けるのは 3〜5 段のときだけ

入力が長いときは `Stepper` で 3〜5 手順に分け、最後を「確認」の手順にします。2 手順以下は 1 画面にまとめ、6 手順以上は手順をまとめ直します。各手順に「戻る」を置き、完了した手順へは `onStepClick` で戻れるようにします（先の手順へは飛ばしません）。未保存のまま離れようとしたら `Dialog` で確認します。

## AI 向けの要約

- ラベルは入力の上。`FormItem` の中は `FormLabel` → `FormControl` → `FormDescription` → `FormMessage` の順。項目間 16px、セクション間 32px。
- 入力の幅は値の長さに合わせる。短い値を幅 100% にしない。関連する短い項目は `sm:grid-cols-2` で 2 カラムに並べる。
- 必須は `FormLabel required` だけで示す。`*` や「（必須）」を書かない。任意には何も付けない。
- 検証は送信時に走らせ、エラーが出た項目だけ入力のたびに再検証する。送信ボタンは初期から押せるままにし、送信中は `loading` にする。
- エラーは `FormMessage` に出し、2 件以上ならフォーム先頭に `InlineMessage variant="negative"` ＋最初のエラー項目へフォーカスを移す。
- 長い入力は `Stepper` で 3〜5 手順に分け、最後を「確認」にする。未保存で離れるときは `Dialog` で確認する。
