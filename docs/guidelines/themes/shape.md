# Shape

角丸と影は「用途名」で指定します。値はテーマごとに変わり（三毛は丸く、ロシアンブルーは角ばる）、コードは用途名だけを書きます。

## 角丸

| 用途 | クラス | 使う場所 |
|---|---|---|
| 操作 | `rounded-action` | Button、Input、Select、Textarea、Checkbox の外枠 |
| 容器 | `rounded-container` | Card、Table の外枠、Popover、Drawer |
| モーダル | `rounded-modal` | Modal、Dialog |
| 通知 | `rounded-notice` | Tag、Badge（ピル以外）、コードの背景 |
| 円 | `rounded-round` | Avatar、IconButton（丸型）、Badge のピル |

`rounded-md` のような Tailwind の既定段階と `rounded-[6px]` のような任意値は使えません（`nekodemo check` の NK003）。

## 影

| クラス | 使う場所 |
|---|---|
| `shadow-raise` | ヘッダー、カードのわずかな浮き |
| `shadow-float` | Popover、Menu、Drawer、Tooltip |
| `shadow-popout` | Modal、Dialog、SearchCombobox の候補パネル |

影は「重なりの順序」を示すためだけに使い、装飾には使いません。ダークテーマでは影が見えにくいため、`border-border-low` の枠線を併用しています。

## 参照

- 余白（4px グリッド）は [余白と色](/guidelines/foundations/spacing-and-color/)。
- 値の一覧は [トークンページ](/tokens/)。
