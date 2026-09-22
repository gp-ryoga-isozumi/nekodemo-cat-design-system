# DescriptionList

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

「項目名: 値」の一覧（v1.2）。詳細画面（型 B）の基本情報や、確認画面の入力内容を並べる。
`<dl>` / `<dt>` / `<dd>` で組むので読み上げ順が崩れない。`columns` で 2〜3 列のグリッド、
`layout="horizontal"` で項目名を左に固定幅で置く。値が空の項目は「—」を薄く出す（行を消さない）。

## アンチパターン

- 値が空の項目を消す（何が未入力か分からなくなる。「—」で残す）
- 表（Table）で代用する（列の比較ではなく 1 件の属性なので DescriptionList）
- 項目名を「顧客名：」のように末尾にコロンを付ける（区切りはレイアウトで表す）

## 推奨例

- 詳細画面の Card の中に置き、関連する項目を 4〜8 個ずつまとめる
- 長い値（備考・住所）は `span` で全幅にし、`layout="vertical"` で項目名を上に置く
- 値に StatusTag や Link を入れて、状態やリンク先をその場で示す

## 使用例

```tsx
<DescriptionList columns={2}>
  <DescriptionItem label="顧客">山田商事</DescriptionItem>
  <DescriptionItem label="金額">1,200,000 円</DescriptionItem>
  <DescriptionItem label="状態"><StatusTag status="info">進行中</StatusTag></DescriptionItem>
  <DescriptionItem label="備考" span>{project.memo}</DescriptionItem>
</DescriptionList>
```
