# SegmentedControl

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

常に見えている 2〜5 択の切替（v1.2）。表示の切替（一覧 / カード、日 / 週 / 月）や絞り込みの
大分類に使う。必ずどれか 1 つが選ばれた状態を保つ（選択中の項目を押しても外れない）。
高さは sm 32 / md 40 / lg 48px。項目にはアイコンだけでなく文言を入れる。
`role="radiogroup"` / `role="radio"` で、←→ で選択が移る（radio group の作法）。

## アンチパターン

- 画面遷移に使う（Tabs か SideNavigation）
- 6 択以上、または項目名が長い（Select）
- 「未選択」を許す（Radio か Checkbox）

## 推奨例

- 「一覧 / カード」「日 / 週 / 月」のように、同じデータの見せ方を切り替える場面に使う
- 項目は 2〜5 個、短い名詞にし、必要ならアイコンを添える（アイコンだけにしない）
- `aria-label` に何の切替かを書く（「表示」「期間」）

## 使用例

```tsx
<SegmentedControl aria-label="表示" defaultValue="list" onValueChange={setView}>
  <SegmentedControlItem value="list"><Icon icon="view_list" />一覧</SegmentedControlItem>
  <SegmentedControlItem value="grid"><Icon icon="grid_view" />カード</SegmentedControlItem>
</SegmentedControl>
```
