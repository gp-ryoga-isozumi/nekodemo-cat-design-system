# アクセシビリティの最低ライン

設計書 §10.7 のルールです。5 項目あります。プロトタイプでもここは守ります。

## 1. コントラスト

コントラストは設計書 §7.6 の基準（本文 4.5:1、枠線・アイコン 3:1）です。これはテーマがビルドで保証します（`pnpm check:contrast` が全テーマを検査し、基準未満ならビルドを失敗させます）。

つまり、役割トークンをそのまま使っているかぎりコントラストは満たされます。逆に、役割トークン以外の色を書くとこの保証から外れます（[05-spacing-and-color.md](./05-spacing-and-color.md)）。

## 2. フォーカスリングを消さない

フォーカスリング（`border-focus` の 2px）を消しません。`outline: none` だけを書いた状態にしない、というルールです。部品側でフォーカス表示は実装済みなので、利用側で上書きして消さないでください。

部品の実装では、ボタン類が `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus`、入力欄が `focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/30` を持ちます。className でこれらを打ち消さないようにします。

## 3. IconButton には必ず label

IconButton には必ず `label` を渡します。文字が無いボタンは、これが唯一のアクセシブルネームになります。装飾のアイコンには `aria-hidden` を付けます。

```tsx
<IconButton icon="delete" label="この案件を削除する" />

<Button>
  <Icon icon="add" size={4} aria-hidden />
  案件を追加する
</Button>
```

Avatar や Spinner のように、見た目だけでは何を指すか分からない部品も、アクセシブルネームを props で必須にしています。省略せずに渡してください。

## 4. フォームの label と aria-describedby

フォームの入力には必ず `<label>` を付けます。エラーは `aria-describedby` で入力と結び付けます。これは Form 部品（FormField / FormLabel / FormControl / FormDescription / FormMessage）が行うので、Form を使えば満たされます。設定画面のような単発の入力では Field を使います。

生の `<input>` / `<select>` / `<textarea>` を書くとこの仕組みから外れます（`pnpm check` の NK009 が検出します）。

## 5. キーボードだけで主要操作ができる

キーボードだけで主要操作（一覧 → 詳細 → 編集 → 保存）が完了することを確認します。Tab で到達でき、Enter / Space で実行でき、Dialog や Modal を Esc で閉じられることを、完成前に一度手で試してください。

確認の手順の例:

1. 一覧で Tab を押し、検索欄 → 絞り込み → 主アクション → 表の行 → Pagination の順に到達できるか。
2. 行にフォーカスした状態で Enter を押し、詳細に移動できるか。
3. 詳細の操作 Menu を開き、矢印キーで項目を選べるか。削除の Dialog を Esc で閉じられるか。
4. フォームで Tab だけで最後まで入力でき、フッターの「保存する」に到達できるか。

## 確認のしかた

```bash
pnpm check:contrast   # テーマのコントラスト（ビルドゲート）
pnpm check            # 役割トークン・生 HTML 要素などの検査
```

コントラストはテーマのビルドで保証されるため、役割トークンを使っているかぎり個別に測り直す必要はありません。役割トークン以外の色を書いた時点で保証が外れることだけ覚えておいてください。

## AI 向けの要約

- コントラストは本文 4.5:1、枠線・アイコン 3:1。テーマがビルドで保証するので、役割トークン以外の色を書かない。
- フォーカスリング（`border-focus` の 2px）を消さない。部品のフォーカス表示を上書きしない。
- IconButton には必ず `label` を渡す。装飾アイコンには `aria-hidden` を付ける。
- フォームの入力には必ず `<label>` を付け、エラーは `aria-describedby` で結び付ける。Form 部品（FormField / FormLabel / FormControl / FormMessage）や Field を使えば満たされる。
- 生の `<input>` / `<select>` / `<textarea>` / `<button>` / `<table>` を書かない。
- キーボードだけで一覧 → 詳細 → 編集 → 保存が完了することを完成前に確認する。
