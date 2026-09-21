# 操作の原則

設計書 §10.3 のルールです。6 項目あります。

## 1. 主アクションは 1 画面 1 つ

1 画面の主アクション（primary ボタン）は **1 つ**です。他は secondary / outline / ghost にします。「保存する」と「複製する」を並べたくなったら、片方を secondary に下げるか Menu に入れます。

```tsx
<Button>案件を追加する</Button>
<Button variant="secondary">CSV を書き出す</Button>
<Button variant="ghost">条件をクリアする</Button>
```

## 2. 取り消し不可の操作は Dialog で確認する

削除・取り消し不可の操作は Dialog（確認）を挟み、確認ボタンは `negative` にします。ボタン文言は「削除する」のように動作を書きます（「OK」「はい」は禁止）。

```tsx
<DialogFooter>
  <DialogCancel>キャンセル</DialogCancel>
  <DialogAction variant="negative">削除する</DialogAction>
</DialogFooter>
```

## 3. 送信ボタンの初期状態

送信ボタンの初期状態は Sparkle 公開 Patterns「送信ボタンの初期状態」を参照して決めます。

- https://sparkle-design.goodpatch.com/guidelines/patterns/submit-button-initial-state

このドキュメントでは文面を転載しません。判断が必要になったら上の URL を開いて確認してください。

## 4. 保存後は画面を移す

保存後は編集画面に留まらず、詳細または一覧に戻して Toast で結果を伝えます。Toast は遷移先で表示します（[02-states.md](./02-states.md)）。

- 良い例: 「保存する」→ 詳細に遷移 → 遷移先で `toast.success("案件を保存しました")`
- 悪い例: 編集画面に留まったまま Toast だけ出し、利用者が次に何をすればよいか分からない状態にする

## 5. 一覧の行の操作

一覧の行クリックは詳細へ遷移します。行内の操作ボタンは行末に置きます。行全体がリンクとして働くので、行末のボタンはクリックが行のリンクに伝わらないようにします。

## 6. モーダルは短い入力だけ

モーダルは「その場で完結する短い入力」だけに使います。3 項目を超えるフォームはページにします（Sparkle 公開 Patterns「モーダルとモードレス」を参照）。

nekodemo では確認に Dialog、その場で完結する短い入力に Modal を使います。

## 実例

- 確認 Dialog と行内操作: `src/app/samples/list/page.tsx`
- Menu からの削除と Drawer: `src/app/samples/detail/page.tsx`
- 保存後の遷移と Toast: `src/app/samples/form/page.tsx`

## AI 向けの要約

- 1 画面の primary ボタンは 1 つだけにする。他は secondary / outline / ghost を使う。
- 削除など取り消し不可の操作は Dialog で確認し、確認ボタンは negative、文言は「削除する」にする。「OK」「はい」は使わない。
- 送信ボタンの初期状態は Sparkle 公開 Patterns（https://sparkle-design.goodpatch.com/guidelines/patterns/submit-button-initial-state ）を参照して決める。
- 保存後は編集画面に留まらず、詳細または一覧に戻して遷移先で Toast を出す。
- 一覧の行クリックは詳細へ遷移させ、行内の操作ボタンは行末に置く。
- モーダルはその場で完結する短い入力だけに使う。3 項目を超えるフォームはページにする（Sparkle 公開 Patterns「モーダルとモードレス」を参照）。
