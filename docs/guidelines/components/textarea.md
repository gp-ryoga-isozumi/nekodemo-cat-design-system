# Textarea

部品ページ（/guidelines/components/textarea/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/textarea/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は親いっぱい（`w-full`）、高さは最小 96px（`min-h-24`）。利用者が縦だけ引き伸ばせる（`resize-y`）ので、初期の行数は `rows` で決めて高さを固定しない。
- `maxLength` を渡すと文字数カウンタが右下に出て、`maxLength` 属性も付く。上限に達した入力はブラウザ側で止まり、貼り付けも切り詰められる。
- カウンタは `12 / 200` の形で、上限に達すると `text-text-negative` に変わる。`showCount={false}` でカウンタだけ消せる（上限は残る）。
- カウンタは `<output>` として入力に `aria-describedby` で結ばれる。数えるのは文字数で、改行も 1 文字として数える。
- 制御（`value`）でも非制御（`defaultValue`）でも数えられる。`value` を渡している間は親が更新した文字数がそのまま出る。
- `aria-invalid` で枠とフォーカスリングが negative になる。Form の中では `FormControl` がこれを自動で付ける。

## 内容

- プレースホルダーは書き方の例だけ（「例: 訪問時の様子と次の打ち合わせの予定」）。必須・上限・形式は書かない。
- 上限はカウンタが示すので、補足に「200 文字以内」と重ねて書かない。書くのは何を書いてほしいかだけにする。
- 「自由記入」「備考」のような空のラベルにしない。何に使う文かをラベルにする（「訪問メモ」）。
- 上限に達したときのエラー文は出さない（入力が止まることで伝わる）。足りないときだけ FormMessage で理由を出す。

## 参考文献

- [MDN: `<textarea>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
- [shadcn/ui: Textarea](https://ui.shadcn.com/docs/components/textarea)
- [Material Design 3: Text fields](https://m3.material.io/components/text-fields/guidelines)
