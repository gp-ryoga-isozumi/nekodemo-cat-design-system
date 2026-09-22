# Progress

部品ページ（/guidelines/components/progress/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/progress/index.tsx` の JSDoc が正。

## 振る舞い

- `value` を渡すと確定、省略すると不確定になる。不確定では棒の全体が明滅し、`aria-valuenow` は付かず読み上げは「処理中」になる（`data-state="indeterminate"`）。
- `value` は 0〜100 に丸めてから使う（-20 は 0、120 は 100）。丸めた後の値が `aria-valuenow` にも `showValue` の数字にも出る。
- 100% になると棒が success の色に変わり、`data-state="complete"` になる。完了しても色を変えたくない場面（続けて次の処理が始まるなど）は `completeVariant={false}`。
- 棒の高さは sm 6px / md 10px で、幅は親いっぱいに広がる。`showValue` の数字は右端に 40px 幅の等幅で固定されるので、0% と 100% で棒の長さが揺れない。
- 幅の変化には 300ms のトランジションが付く。値を細かく更新しても数字と棒が飛ばずに動く。
- 表示だけの部品で、フォーカスも操作もできない。`label` は画面には出ず読み上げ名になるだけなので、見えるラベルは別に置く。

## 内容

- `label` は「何が進んでいるか」の名詞にする（「アップロード」「案件データの取り込み」）。「読み込み中」のような状態語にしない。
- 同じ画面に複数置くときは `label` を対象ごとに書き分ける（「案件データの取り込み」「添付ファイルの取り込み」）。読み上げで取り違えなくなる。
- 見えるテキストには件数を添える（「1,200 件中 504 件」）。割合だけでは残りの量が読めない。数値は 3 桁区切りにする。
- 不確定のときは「取り込み中です。しばらくお待ちください。」のように、終わりが読めないことを文で補う。

## 参考文献

- [MDN: &lt;progress&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)
- [Radix Primitives: Progress](https://www.radix-ui.com/primitives/docs/components/progress)
- [Material Design 3: Progress indicators](https://m3.material.io/components/progress-indicators/guidelines)
