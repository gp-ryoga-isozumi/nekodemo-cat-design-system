# UX ガイドライン

nekodemo でプロトタイプ画面を作るときのルールです。設計書 §10 を正としています。部品そのものの作法は [../COMPONENT_GUIDE.md](../COMPONENT_GUIDE.md) を参照してください。

## 目次

| ファイル | 内容 |
|---|---|
| [01-screen-patterns.md](./01-screen-patterns.md) | 画面の型。A 一覧 / B 詳細 / C 作成・編集フォーム / D 設定 の 4 型と共通の枠（SideNavigation 240px、最大幅 1200px、ページ余白 24px） |
| [02-states.md](./02-states.md) | 状態の必須セット。読み込み中 / 0 件 / エラー / 成功 の 4 状態。省略はプロトタイプでも不可 |
| [03-actions.md](./03-actions.md) | 操作の原則。主アクション 1 つ、削除の確認 Dialog、保存後の遷移、モーダルの使いどころ |
| [04-writing.md](./04-writing.md) | 文言。「です・ます」、ボタンは「〜する」、エラー文の型、数値・日付の書式 |
| [05-spacing-and-color.md](./05-spacing-and-color.md) | 余白と色。4px の倍数、役割トークン名だけを使う、`pnpm check`（NK001〜NK010） |
| [06-cat-flavor.md](./06-cat-flavor.md) | 猫要素の使いどころ。耳付きアイコン・マスコット・猫の顔のシルエットを出す場所 |
| [07-accessibility.md](./07-accessibility.md) | アクセシビリティの最低ライン。コントラスト、フォーカスリング、label、キーボード操作 |

## 読む順番

1. まず [01-screen-patterns.md](./01-screen-patterns.md) で画面の型を決めます。
2. [02-states.md](./02-states.md) の 4 状態を骨組みに入れます。
3. 中身を作りながら [03-actions.md](./03-actions.md) と [04-writing.md](./04-writing.md) を確認します。
4. スタイルを書くときは [05-spacing-and-color.md](./05-spacing-and-color.md) の役割トークンだけを使います。
5. 猫要素を足すときは [06-cat-flavor.md](./06-cat-flavor.md) で場所を確認します。
6. 仕上げに [07-accessibility.md](./07-accessibility.md) とチェックリストで自己確認します。

同じ内容は AI 向けに `skills/use-nekodemo` と `docs/ai/USING_NEKODEMO.md` にも命令形で置きます。利用側リポジトリに貼るルールは [../ai/GUARD_BLOCK.md](../ai/GUARD_BLOCK.md) にあります。

## 実例

4 つの画面の型には、それぞれ動く実例があります。

- A 一覧: `src/app/samples/list/page.tsx`
- B 詳細: `src/app/samples/detail/page.tsx`
- C 作成・編集フォーム: `src/app/samples/form/page.tsx`
- D 設定: `src/app/samples/settings/page.tsx`
- 共通の枠: `src/app/samples/app-shell.tsx`

## プロトタイプ完成チェックリスト

設計書 §10.8 です。完成前に自己確認します。

- [ ] 4 状態（読み込み・0 件・エラー・成功）を実装した
- [ ] 主ボタンは 1 画面 1 つ
- [ ] 削除に確認 Dialog がある
- [ ] 色・角丸・文字サイズが役割トークン名だけで書かれている（`pnpm nekodemo check` の error が 0 件）
- [ ] 猫版が無いアイコン（T3）を使っていない（`check` の一覧が空）
- [ ] `NekoThemePicker` で 3 テーマを切り替えても崩れない
- [ ] キーボードだけで主要操作ができる
- [ ] 文言が「です・ます」＋「〜する」ボタンになっている

このリポジトリの中では `pnpm check` が同じ検査を実行します。

## AI 向けの要約

- 画面を作る前に 01（画面の型）と 02（4 状態）を読み、どの型で組むかを決める。
- 色・角丸・文字サイズを書くときは 05 の役割トークン名だけを使う。
- 猫要素を足したくなったら 06 で出してよい場所かを確認する。
- 文言を書くときは 04 の「です・ます」＋「〜する」に従う。
- 完成前に上のチェックリスト 8 項目を自己確認する。
- 最後に `pnpm check`（利用側は `pnpm nekodemo check src --strict`）を実行し、error を 0 件にしてから完了報告する（warn は内容を確認する）。
