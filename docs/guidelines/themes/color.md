# Color

色は 3 層のトークンで管理し、部品とアプリのコードは最上位の**役割トークン名だけ**で書きます。`#hex` / `rgb()` / `oklch()` の直書きと Tailwind の既定パレット（`bg-blue-500` 等）はビルドで存在せず、`nekodemo check` でも検出されます。

## 3 層の構造

| 層 | 例 | 誰が触るか |
|---|---|---|
| プリミティブ | `--nk-p-primary-500`、`--nk-p-neutral-100` | テーマ JSON（`themes/*.json`）。テーマごとに値が変わる |
| セマンティック | `primary-50〜900`、`neutral-50〜900`、`info / success / warning / negative-50〜900` | 生成物。ステータス色は全テーマ共通、primary と neutral はテーマ由来 |
| 役割 | `text-text-high`、`bg-surface-card`、`border-border-middle`、`text-object-primary` | 部品とアプリのコードはここだけを使う |

役割トークンは `text-*`（文字）、`surface-*`（面）、`border-*`（枠線）、`object-*`（アイコン・図形）の 4 系統です。`bg-surface-primary` のように Tailwind の接頭辞と組み合わせて使います。

## テーマとダークスキーム

- 三毛（`calico`）とアメショ（`american-shorthair`）はライト、ロシアンブルー（`russian-blue`）はダークです。役割トークンの参照先（セマンティックの段階）はライト用とダーク用の 2 組（`tokens/semantic.map.json` の `light` / `dark`）で、テーマの `scheme` に従って切り替わります。
- テーマは `<html data-neko-theme="…">` 1 か所で切り替わります。コードにテーマ固有の分岐を書かず、どのテーマでも同じ役割トークン名で書きます。
- `data-neko-theme` は入れ子にもできます（テーマ比較ページの各カードはこの仕組み）。

## 使い分けの原則

- **primary は主アクションと選択状態だけ**。装飾や強調には使いません（1 画面に主ボタンは 1 つ）。
- **ステータス色（info / success / warning / negative）は状態表現だけ**。`StatusTag` や `InlineMessage` の意味色として使い、見出しや装飾に使いません。
- 文字は `text-text-high`（本文・見出し）/ `text-text-middle` / `text-text-low`（補足）の 3 段階で情報の強弱を付けます。リンクは `text-text-link`。
- 面は `surface-page`（ページ）> `surface-card`（カード）> `surface-well`（へこみ・表のヘッダー）の順に重ねます。

## コントラスト

- 文字は WCAG AA の 4.5:1、UI 部品の境界は 3:1 を下限にします。
- `pnpm build:themes` が 3 テーマ × 25 組の色の組み合わせを検査し、不合格があればビルドが止まります。テーマの色を変えるときは JSON を直し、検査に通るまで調整します。

## 参照

- 実際の色と段階は [トークンページ](/tokens/) と [テーマ比較ページ](/themes/) で確認できます。
- 余白・文字サイズ・角丸との組み合わせは [余白と色](/guidelines/foundations/spacing-and-color/)。
