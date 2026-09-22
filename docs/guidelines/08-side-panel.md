# サイドパネル

一覧を見たまま 1 件の内容を確認・編集したいときに、画面の右から出す補助画面です。nekodemo では Drawer で作ります。

## いつ使うか

| 場面 | 使うもの |
|---|---|
| 一覧の 1 件を、一覧に戻らずに確認したい（プレビュー） | サイドパネル（Drawer、`side="right"`） |
| 一覧の 1 件を、短い項目だけ直したい（担当者・期限） | サイドパネル、または 3 項目までなら Modal |
| 1 件の情報が多く、関連情報や履歴まで見たい | 詳細ページ（画面の型 B）へ遷移 |
| 取り消せない操作の確認 | Dialog |
| 画面の設定や絞り込みの条件 | Popover、または一覧上の FilterChip |

判断の目安: 「一覧との往復が 3 回以上になりそう」ならサイドパネル、「1 件に 1 分以上とどまる」なら詳細ページ。

## 構成

上から `DrawerHeader`（`DrawerTitle` に項目名、`DrawerDescription` に補足）→ `DrawerBody`（内容。長ければスクロール）→ `DrawerFooter`（右寄せで「閉じる」と主ボタン）。幅は右パネルで 400〜480px（`DrawerContent` の `className` で `sm:max-w-md` など）。

```tsx
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>{project.name}</DrawerTitle>
      <DrawerDescription>{project.customer}</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>
      <DescriptionList columns={1} layout="horizontal">…</DescriptionList>
    </DrawerBody>
    <DrawerFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>閉じる</Button>
      <Button asChild><NextLink href={`/projects/${project.id}`}>詳細を開く</NextLink></Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## 振る舞い

- 開いている間も背後の一覧は見えるが操作できない（モーダル）。行を選び直すときはいったん閉じる。
- Esc、オーバーレイのクリック、「閉じる」で閉じる。閉じたらフォーカスは開いたときの行（またはボタン）に戻る（Radix Dialog の標準）。
- パネルの中で編集した内容は、閉じる前に保存するかどうかを明確にする。未保存で閉じようとしたら Dialog で確認する。
- 下から出す `side="bottom"` は、スマートフォン幅や「補助的な操作パネル」（並び替え・共有）に限る。左から出す `side="left"` はナビゲーション用で、内容の確認には使わない。

## 使い方の Do / Don't

- Do: 一覧の行クリック（または行末の「詳細」）で開き、パネルの見出しにその行の項目名を出す。
- Do: パネル内の主ボタンは 1 つ（「保存する」か「詳細を開く」）。
- Don't: パネルの中にさらに Modal や Drawer を重ねる（Dialog の確認だけは可）。
- Don't: 一覧全体を操作する機能（一括削除、エクスポート）をパネルに入れる（ツールバーに置く）。

## 実例

- `src/app/samples/detail/page.tsx` の「履歴」Drawer。
- `src/app/samples/list/page.tsx` の一覧から詳細へ（パネルではなく遷移にした例。1 件の情報量が多いため）。

## AI 向けの要約

- 一覧を見たまま 1 件を確認・短く編集するなら Drawer（`side="right"`）。1 件に長くとどまるなら詳細ページへ遷移する。
- 構成は DrawerHeader（見出し）→ DrawerBody → DrawerFooter（閉じる＋主ボタン 1 つ）。
- 未保存で閉じようとしたら Dialog で確認する。パネルの中にモーダルを重ねない。
