# アクセシビリティの最低ライン

設計書 §10.7 のルールです。9 項目あります。プロトタイプでもここは守ります。

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

## 6. 動きは部品に任せる（prefers-reduced-motion）

常に動く表示（`Spinner` の回転、`Skeleton` の明滅）は、部品側が `motion-reduce:animate-none` を持っていて、OS の「視差効果を減らす」設定（`prefers-reduced-motion`）で止まります。利用側で `transition` / `animate-*` / 独自の `@keyframes` を書き足すと、この配慮から外れます。動きの規定は [themes/motion.md](./themes/motion.md) です。

## 7. 見出しの階層を飛ばさない

`<h1>` は 1 画面に 1 つだけです（`PageHeader` の `title` が `<h1>` を出すので、同じ画面にもう 1 つ書きません）。その下は h2 → h3 の順に下げ、レベルを飛ばしません（h2 の次に h4 を置かない）。見た目の大きさは文字サイズのトークン（`text-5` / `text-6`）で調整し、見出しレベルで調整しません。`EmptyState` は `headingLevel`（2 / 3 / 4、既定 3）を置く場所の階層に合わせます（`Card` の中なら 3、ページ全体を置き換えるなら 2）。

## 8. 触れる大きさを 24×24 CSS px 以上にする

クリック・タップできる領域は 24×24 CSS px 以上にします。スマートフォンで触る前提の画面では 44×44 を目安にします。部品の既定（Button / IconButton の md は 40px、lg は 48px）を使えば満たされます。`size="sm"`（32px）は、表の行内やツールバーのように密度が要る場所だけに使い、主要な操作には使いません。並んだ操作の間は 8px 以上あけます。

## 9. 薄い文字は無効化されたコントロールだけ

`text-text-disabled` は、無効化されたコントロール自身のラベルにだけ使います。読む必要のある文字（補足・説明・エラー・空値の「—」以外の本文）は `text-text-middle` 以上にします。「補足だから薄く」と `text-text-disabled` を使うと、読める必要のある文がコントラスト基準を下回ります。操作を無効にするときは、なぜ押せないかを近くに `text-text-middle` で書きます。

## 確認のしかた

```bash
pnpm check:contrast   # テーマのコントラスト（ビルドゲート）
pnpm check            # 役割トークン・生 HTML 要素などの検査
```

コントラストはテーマのビルドで保証されるため、役割トークンを使っているかぎり個別に測り直す必要はありません。役割トークン以外の色を書いた時点で保証が外れることだけ覚えておいてください。

自動検査（Storybook の a11y アドオン / axe）が見ない次の 4 項目は、完成前に手で確認します。

1. フォーカスの見え方 — Tab で回して、どの要素も枠が見えるか（`outline` を打ち消していないか）。
2. reduced-motion — OS の「視差効果を減らす」を ON にして、回り続ける・明滅し続ける表示が止まるか。
3. タッチ目標 — 24×24 CSS px 未満の操作が無いか（`size="sm"` を主要な操作に使っていないか）。
4. フォーカスの戻り — Dialog / Modal / Drawer を閉じたあと、開いたボタンや行にフォーカスが戻るか。

## AI 向けの要約

- コントラストは本文 4.5:1、枠線・アイコン 3:1。テーマがビルドで保証するので、役割トークン以外の色を書かない。
- フォーカスリング（`border-focus` の 2px）を消さない。部品のフォーカス表示を上書きしない。
- IconButton には必ず `label` を渡す。装飾アイコンには `aria-hidden` を付ける。
- フォームの入力には必ず `<label>` を付け、エラーは `aria-describedby` で結び付ける。Form 部品（FormField / FormLabel / FormControl / FormMessage）や Field を使えば満たされる。
- 生の `<input>` / `<select>` / `<textarea>` / `<button>` / `<table>` を書かない。
- キーボードだけで一覧 → 詳細 → 編集 → 保存が完了することを完成前に確認する。
- 利用側で `transition` / `animate-*` を書き足さない。動きは部品に任せ、`prefers-reduced-motion` の配慮を壊さない。
- `<h1>` は 1 画面 1 つ（`PageHeader` が出す）。見出しレベルを飛ばさず、`EmptyState` の `headingLevel` を周囲に合わせる。
- 触れる領域は 24×24 CSS px 以上（タッチ主体なら 44）。`size="sm"` は密度が要る場所だけに使う。
- `text-text-disabled` は無効化されたコントロールのラベルだけに使い、読む必要のある説明・エラーは `text-text-middle` 以上にする。
- axe が見ない 4 項目（フォーカスの見え方・reduced-motion・タッチ目標・フォーカスの戻り）は手で確認する。
