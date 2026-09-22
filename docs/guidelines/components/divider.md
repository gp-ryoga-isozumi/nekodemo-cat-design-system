# Divider

部品ページ（/guidelines/components/divider/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/divider/index.tsx` の JSDoc が正。

## 振る舞い

- 既定は横向きで、親の幅いっぱいに 1px の線を引く（`h-px w-full`、色は `bg-border-middle`）。太さや色は変えない。
- 縦向き（`orientation="vertical"`）は高さが `h-full` なので、高さのある親に置くか `className="h-6"` のように自分で決める。指定しないと線が出ない。
- `decorative`（既定 true）のままだと読み上げから外れる。ログの日付の境目のように区切り自体に意味があるときだけ `decorative={false}` を渡す。
- 上下左右の余白は Divider が持たない。呼び出し側の `gap` や `my-*` で 4px の倍数を取る。
- Card や Dialog の中で端まで引きたいときは、親の padding を打ち消す（`-mx-4` など）。中途半端な長さで止めない。

## 内容

- 線そのものに文言は無い。区切りに説明が要るなら、名詞の見出しを置いて Divider は外す。
- 「以上」「ここまで」のような文字を線の代わりに置かない。

## 参考文献

- [Radix Primitives: Separator](https://www.radix-ui.com/primitives/docs/components/separator)
- [shadcn/ui: Separator](https://ui.shadcn.com/docs/components/separator)
- [MDN: `<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)
