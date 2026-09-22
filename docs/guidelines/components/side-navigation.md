# SideNavigation

部品ページ（/guidelines/components/side-navigation/）の手書き節。実装から機械的に出せない「振る舞い」「内容（文言）」「参考文献」だけを書く。
概要・アンチパターン・推奨例・使用例は `src/components/ui/side-navigation/index.tsx` の JSDoc が正。

## 振る舞い

- 幅は展開時 240px（`w-60`）、折りたたむと 64px（`w-16`）で、`transition-[width]` で変わる。高さは `h-full` なので、親で画面の高さを与える。
- 折りたたむと `SideNavItem` のラベルと `SideNavGroup` の見出しは `sr-only` になり、アイコンだけが残る。読み上げにはラベルが残り、ホバーでは `title` として出る。`badge` は折りたたみ中は表示しない。
- 折りたたみボタンは最下部・右寄せの IconButton で `aria-expanded` を持つ。`collapsible={false}` で消せる。状態は `defaultCollapsed`、または `collapsed` / `onCollapsedChange` で持つ。
- `active` の項目には `aria-current="page"` が付き、`bg-surface-selected` ＋ 太字 ＋ アイコンの塗り（`fill`）の 3 つで示される。1 画面で `active` は 1 つだけにする。
- `asChild` で Next.js の `Link` を包むと、リンクそのものが項目になり、アイコン・ラベル・バッジはその中に差し込まれる。`href` を直接渡すと素の `<a>` になり、ページ全体が再読み込みされる。
- ラベルは 1 行に省略される（`truncate`）。240px に収まらない項目名は途中で切れるので、長い名前はグループの見出し側に寄せる。

## 内容

- 項目名は名詞で 2〜6 文字にする（「案件」「請求」「設定」）。全項目に「〜一覧」「〜管理」を付けない。
- `SideNavGroup` の `label` は分類名（「管理」「レポート」）にし、その中の項目名を繰り返さない。
- `badge` は negative 色で出るので、対応が必要な件数だけに使う。総件数や更新件数の表示には使わない。
- `logo` にはアプリ名を入れる。折りたたむとマスコットだけが残るので、名前が無くても区別が付く並びにする。

## 参考文献

- [shadcn/ui: Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [Material Design 3: Navigation drawer](https://m3.material.io/components/navigation-drawer/guidelines)
