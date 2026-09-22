# Slider

部品ページ（/guidelines/components/slider/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/slider/index.tsx` の JSDoc が正。

## 振る舞い

- つまみにフォーカスすると矢印キーで `step` ずつ動き、Home で最小値、End で最大値になる。`disabled` のときは Tab でフォーカスも移らない。
- つまみは `value` / `defaultValue` の配列の要素数だけ出る。範囲指定は要素 2 つにし、`label` も同じ数の配列で渡す（`["予算の下限", "予算の上限"]`）。足りないと先頭の名前が使い回される。
- 値そのものは部品が表示しない。ラベルの右端に `<output>` を置き、単位付きで出す（「7 日前」「200 万円 〜 800 万円」）。
- 既定は `min={0}` / `max={100}`。`step` はつまみが止まる位置が意味のある単位になるよう決める（進捗率なら 5、金額なら 50）。
- ドラッグでもキー操作でも `onValueChange` が毎回呼ばれる。確定したときだけ処理したいなら `onValueCommit` を使う。
- 縦向き（`orientation="vertical"`）は自身に `min-h-44`（176px）が入るので、高さのある親に置く。

## 内容

- ラベルは何を決める値かを書く（「通知する日数」「予算の範囲」）。`label` は各つまみの読み上げ名なので、範囲では上限・下限を書き分ける。
- 表示する値には単位を付ける（「7 日前」「200 万円」）。数字だけを置かない。
- 端の値に意味があるときは、最小・最大を文字で添える（「1 日前」「30 日前」）。

## 参考文献

- [WAI-ARIA Authoring Practices: Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
- [Radix Primitives: Slider](https://www.radix-ui.com/primitives/docs/components/slider)
- [Material Design 3: Sliders](https://m3.material.io/components/sliders/guidelines)
