# Typography

文字はフォント 2 種、サイズ 12 段階、ウェイト 2 種だけで組みます。3 テーマとも同じ設定です（テーマで変わるのは色と角丸）。

## フォント

| 用途 | クラス | フォント |
|---|---|---|
| 本文・見出し・UI | `font-pro`（既定） | Zen Maru Gothic（丸ゴシック。Google Fonts、400 / 700） |
| 数値・コード・日付 | `font-mono` | Noto Sans Mono（Google Fonts、400 / 700） |

フォントは `NekoHead` が `<link>` で読み込みます。表の数値は `TableCell numeric` が等幅で右寄せにします。

## サイズ

サイズは `text-1`（12px）から `text-12`（54px）までの段階名で指定します。`text-sm` / `text-base` / `text-lg` などの別名も同じ段階に割り当ててあり、Tailwind の既定のサイズ（`text-[13px]` のような任意値も含む）は使えません。

- 本文は `text-3`（16px）、補足は `text-2`（14px）、注記やカウンタは `text-1`（12px）。
- 見出しは `text-5`（20px）〜 `text-7`（28px）。ページ見出しは `text-6` か `text-7`。
- 行間は 4px グリッドに乗る値を各段階に持たせているので、`leading-*` の上書きは原則不要です。

## ウェイト

`font-normal`（400）と `font-bold`（700）だけです。`font-medium` / `font-semibold` は存在せず、`nekodemo check` の NK007 で検出されます。強弱は太さではなく、サイズと色（`text-text-high` / `middle` / `low`）で付けます。

## 参照

- 文言の書き方（です・ます、ボタンは「〜する」）は [文言](/guidelines/foundations/writing/)。
- 段階ごとの実寸は [トークンページ](/tokens/)。
