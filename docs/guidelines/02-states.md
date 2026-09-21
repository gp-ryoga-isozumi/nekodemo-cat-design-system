# 状態の必須セット

設計書 §10.2 のルールです。データを表示する部品（一覧・表・カード群・詳細）は、次の 4 状態を**必ず**実装します。省略はプロトタイプでも不可です。

| 状態 | 表現 |
|---|---|
| 読み込み中 | Skeleton（一覧は 5 行、カードは 3 枚）。初回のみマスコット付きローディングを使ってよい |
| 0 件 | EmptyState（マスコット＋「まだ〜がありません」＋主アクション）。検索結果 0 件は「条件に合う〜がありません」＋条件クリア |
| エラー | InlineMessage（negative）＋「再試行」。全画面エラーにしない |
| 成功 | Toast（success）3 秒。画面遷移を伴う場合は遷移先で表示 |

## 読み込み中

一覧は `SkeletonRows` を 5 行、カード群は Skeleton のカードを 3 枚置きます。実際の内容と同じ形で置き、読み込みが終わったら必ず消します。初回のローディングに限り、マスコット付きのローディング表示を使ってかまいません。ボタンの処理中は Skeleton ではなく Spinner（Button の loading）を使います。

```tsx
{loading ? <SkeletonRows rows={5} /> : <Table>…</Table>}
```

## 0 件

EmptyState を一覧の領域全体と置き換えて表示します。文言は 2 種類を使い分けます。

- 初回から 0 件: 「まだ案件がありません」＋主アクション（「案件を追加する」）
- 検索・絞り込みの結果が 0 件: 「条件に合う案件がありません」＋条件クリア（「条件をクリアする」）

EmptyState はマスコットを出してよい 4 か所のうちの 1 つです（[06-cat-flavor.md](./06-cat-flavor.md)）。表やフォームの内側には置きません。

## エラー

InlineMessage の `negative` を、失敗した領域のすぐ上に置き、「再試行」のボタンを添えます。全画面エラーにはしません。エラーの詳細や再試行を Toast にだけ出すのも不可です。

```tsx
<InlineMessage variant="negative" action={<Button variant="outline" onClick={retry}>再試行する</Button>}>
  案件を読み込めませんでした。通信状況を確認してください。
</InlineMessage>
```

## 成功

Toast（success）を 3 秒だけ出します。画面遷移を伴う操作（保存して詳細に戻るなど）は、遷移**先**で表示します。Toaster はアプリのルート（NekoThemeProvider の内側）に 1 つだけ置きます。同時に何個も出しません。

```tsx
toast.success("案件を保存しました");
```

## 自己確認

`pnpm check`（nekodemo check）の NK010 が、一覧を描画しているのに Skeleton / EmptyState の参照が無い画面を「4 状態の抜けの目安」として報告します。報告が出たら 4 状態を見直してください。

実例: `src/app/samples/list/page.tsx`（4 状態すべて）、`src/app/samples/detail/page.tsx`（Skeleton・EmptyState・InlineMessage）

## AI 向けの要約

- データを出す画面には読み込み中 / 0 件 / エラー / 成功の 4 状態を必ず実装する。プロトタイプでも省略しない。
- 読み込み中は Skeleton（一覧は SkeletonRows 5 行、カードは 3 枚）で表す。初回だけマスコット付きローディングを使ってよい。
- 0 件は EmptyState を使い、初回は「まだ〜がありません」＋主アクション、検索結果 0 件は「条件に合う〜がありません」＋条件クリアにする。
- エラーは InlineMessage（negative）＋「再試行」を該当箇所に出す。全画面エラーにしない。
- 成功は Toast（success）を 3 秒。画面遷移を伴う場合は遷移先で表示する。
- Toaster はアプリのルートに 1 つだけ置き、Toast を同時に複数出さない。
- `pnpm check` の NK010 が出たら 4 状態の抜けを疑う。
