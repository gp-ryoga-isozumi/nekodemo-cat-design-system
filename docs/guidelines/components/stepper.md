# Stepper

部品ページ（/guidelines/components/stepper/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/stepper/index.tsx` の JSDoc が正。

## 振る舞い

- 状態は `current`（0 始まり）から機械的に決まる。手前が完了、同じ位置が現在、後ろが未着手で、`data-status`（`done` / `current` / `upcoming`）に出る。
- `onStepClick` を渡したときだけ、完了した手順が `<button>` になる。現在と未着手はただの表示のままなので、先の手順には飛べない。
- 押せる手順の読み上げ名は「基本情報（完了）に戻る」のように `label` から自動で組み立てる。`label` に文字列以外を渡すとこの名前が付かないので、押せるようにするなら `label` は文字列にする。
- 現在の手順の `<li>` にだけ `aria-current="step"` が付く。`<ol>` 全体の読み上げ名は `aria-label`（既定「手順」）で、同じ画面に 2 つ置くなら書き分ける。
- 丸印は 32px 固定で、完了した区間の線だけが primary で塗られる。横向きは各手順が等幅に伸びるので、手順名が長いと折り返して高さが変わる。
- `description` は横向きだと中央揃えで手順名の下に入る。補足を読ませたいときは `orientation="vertical"` にして左ぞろえにする。

## 内容

- 手順名は 2〜6 文字の名詞（「基本情報」「担当者」「確認」）。番号は丸印が出すので文言には入れない。
- `description` は 1 行の補足（「営業と技術」）に留め、操作の説明は手順の本文側に書く。
- `aria-label` は何の手順かの名詞にする（「案件の作成」）。「ステップ」だけにしない。
- 完了や現在といった状態を手順名に書き足さない（「基本情報（完了）」にしない）。状態は丸印と読み上げ名が持つ。

## 参考文献

- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [MDN: &lt;ol&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
