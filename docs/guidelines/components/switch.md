# Switch

部品ページ（/guidelines/components/switch/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/switch/index.tsx` の JSDoc が正。

## 振る舞い

- 大きさは 40×24px で固定。つまみ（20px）が 16px 動くだけで、幅は文言では変わらない。ラベルは右に置く。
- Space でも Enter でも切り替わる（`<button type="button">` なのでフォームの送信にはならない）。
- 押した時点で反映する部品なので、保存ボタンを待たない。反映に通信が要る場合は、失敗したら元の位置に戻して InlineMessage で理由を出す。
- OFF は `bg-border-high`、ON は `bg-surface-primary`。色だけでなくつまみの位置でも差が出るので、状態を文字で書き足さない。
- `disabled` のときは `bg-surface-disabled` になり Tab でも止まらない。権限が無くて触れない設定は、理由を補足に書いて併記する。
- フォーカスリングはキーボード操作（focus-visible）のときだけ出る。

## 内容

- ラベルは ON のときに起きることを書く（「期限が近い案件を通知する」）。「通知設定」のような名詞だけにしない。
- 「する／しない」を両方書かない。オン・オフの語も画面に出さない。
- 設定を並べるときは、補足を 1 行に揃えて「いつ・誰に」効くかを書く。
- 取り消せない結果を伴う設定には使わない（確認が要るものは Dialog ＋ Button）。

## 参考文献

- [WAI-ARIA Authoring Practices: Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- [shadcn/ui: Switch](https://ui.shadcn.com/docs/components/switch)
- [Material Design 3: Switch](https://m3.material.io/components/switch/guidelines)
