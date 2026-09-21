# 余白と色

設計書 §10.5 のルールです。6 項目あります。色・角丸・文字サイズは**役割トークン名だけ**で書きます。

## 1. 余白は 4px の倍数

| 場所 | 余白 |
|---|---|
| ページ余白 | 24 |
| カード内 | 16 |
| フォーム項目間 | 16 |
| セクション間 | 32 |

4px の倍数から外れる値は使いません。

## 2. 色は役割トークン名だけを使う

`bg-surface-card`、`text-text-low`、`border-border-middle` のような役割トークン名だけを使います。

禁止するもの:

- `#hex`（例: `#3b82f6`）
- `rgb()` / `rgba()` / `hsl()` / `oklch()`
- Tailwind 既定パレット名（例: `bg-blue-500`、`text-gray-700`）— ビルドで存在しません
- `style={{ color: … }}` のような style 属性での色指定

## 3. primary 色の使いどころ

primary 色は 1 画面で「主ボタン」「選択状態」「リンク」以外に使いません。

## 4. ステータス色は状態表現だけ

成功＝success、注意＝warning、失敗＝negative、補足＝info。装飾には使いません。

## 5. 文字サイズ

| 用途 | トークン |
|---|---|
| 本文 | `text-3`（16px） |
| 補足 | `text-2`（14px） |
| 見出し | `text-5` / `text-6` |

文字サイズは `text-1`〜`text-12` の段階から選びます。`text-[13px]` のような任意値は禁止です。フォントウェイトは 400 / 700 だけで、`font-medium` / `font-semibold` は使いません。

## 6. 角丸

| 用途 | トークン |
|---|---|
| ボタン・入力 | `rounded-action` |
| カード | `rounded-container` |
| モーダル | `rounded-modal` |
| バッジ | `rounded-notice` |
| 円 | `rounded-round` |

`rounded-md` 等の直接指定は shadcn 由来コード以外では使いません。`rounded-[…]` のような任意値も禁止です。

## `pnpm check` で検出されること

`pnpm check`（nekodemo check）は NK001〜NK010 のルールでソースを検査します。ルールの定義は `scripts/check/rules.mjs` にあります。

| ID | 重さ | 内容 |
|---|---|---|
| NK001 | error | 色の直書き（`#hex` / `rgb()` / `hsl()` / `oklch()`）。役割トークン（`bg-surface-card` 等）を使う |
| NK002 | error | Tailwind 既定パレットのクラス（`bg-blue-500` 等）。ビルドで存在しない |
| NK003 | error | 任意値の色・文字サイズ・角丸（`bg-[#…]` / `text-[13px]` / `rounded-[…]`） |
| NK004 | error | style 属性での色指定（`style={{ color / background / borderColor }}`） |
| NK005 | error | `lucide-react` の import、material-symbols クラスの直書き（Icon 部品を使う） |
| NK006 | warn | 猫版が無いアイコン名（T3 フォールバック） |
| NK007 | error | 400 / 700 以外のフォントウェイト（`font-medium` / `semibold` 等） |
| NK008 | warn | ルートレイアウトに `data-neko-theme` が無い |
| NK009 | warn | 生の `<table>` / `<button>` / `<input>` / `<select>` / `<textarea>`（nekodemo の部品がある） |
| NK010 | info | 一覧を描画しているのに Skeleton / EmptyState の参照が無い（4 状態の抜けの目安） |

作業の最後に `pnpm check` を実行し、0 件にしてから完了報告します。

## AI 向けの要約

- 余白は 4px の倍数。ページ 24、カード内 16、フォーム項目間 16、セクション間 32。
- 色は役割トークン名だけを使う（`bg-surface-card` / `text-text-low` / `border-border-middle`）。`#hex` / `rgb()` / Tailwind 既定パレット / style 属性の色は禁止。
- primary 色は「主ボタン」「選択状態」「リンク」以外に使わない。
- ステータス色（success / warning / negative / info）は状態表現だけに使い、装飾に使わない。
- 文字サイズは `text-1`〜`text-12` から選ぶ（本文 `text-3`、補足 `text-2`、見出し `text-5` / `text-6`）。`text-[13px]` のような任意値と `font-medium` 等は禁止。
- 角丸は `rounded-action`（ボタン・入力）/ `rounded-container`（カード）/ `rounded-modal` / `rounded-notice`（バッジ）/ `rounded-round`（円）を使う。
- 作業の最後に `pnpm check` を実行し、NK001〜NK010 を 0 件にしてから完了報告する。
