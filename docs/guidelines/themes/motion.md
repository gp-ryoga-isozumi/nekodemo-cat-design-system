# Motion

動きは「出入りを分かりやすくする」ためだけに使います。時間の役割トークンは無く、動きは部品の実装が持っています。4 項目あります。

## 1. 時間は部品の既定に任せる

出入りのアニメーションの既定は 150ms です（`Modal` / `Dialog` / `Menu` / `Select` / `Popover` / `Tooltip`）。`Drawer` だけは開くとき 300ms・閉じるとき 200ms、`Accordion` の開閉は 200ms です。利用側で `duration-*` を書いてこの時間を変えません。

| 動き | 時間 | 使う場所 |
|---|---|---|
| 出入り（既定） | 150ms | `Modal` `Dialog` `Menu` `Select` `Popover` `Tooltip` |
| パネルの出入り | 開く 300ms / 閉じる 200ms | `Drawer` |
| 開閉 | 200ms | `Accordion` |

## 2. 出入りで動かすのは不透明度・95% の拡大縮小・端からのスライドだけ

`Modal` / `Dialog` / `Popover` / `Menu` / `Select` / `Tooltip` は不透明度（`fade-in-0`）と 95% の拡大縮小（`zoom-in-95`）、`Drawer` はそれに端からのスライドが加わります。ここに回転・角丸の変化・高さの変化を足しません。

- 良い例: `Drawer` をそのまま使い、出入りの見え方を部品に任せる
- 悪い例: `className` に `animate-bounce` や独自の `@keyframes` を足す

## 3. hover / focus の変化は色だけ

マウスやキーボードで触れたときに変えるのは色です（部品は `transition-colors`）。大きさ・位置・影を hover で動かしません。動いてほしいのは「今どこを触っているか」であって、レイアウトではありません。

- 良い例: `hover:bg-surface-primary-hover` のように面の色だけが変わる
- 悪い例: カードを hover で `scale-105` させて、隣の要素との間隔が変わって見える

## 4. 常に動く表示は Spinner と Skeleton だけ

回り続ける・明滅し続ける表示は `Spinner`（`animate-spin`）と `Skeleton`（`animate-pulse`）だけです。この 2 つは `motion-reduce:animate-none` を持っているので、OS の「視差効果を減らす」設定（`prefers-reduced-motion`）で止まります。利用側で `transition` や `animate-*` を書き足すと、この配慮から外れます。装飾として何かを常時動かしません。

## AI 向けの要約

- 動きの時間は部品の既定に任せる（出入り 150ms、`Drawer` は開く 300ms / 閉じる 200ms、`Accordion` 200ms）。`duration-*` を書かない。
- 出入りで動かすのは不透明度・95% の拡大縮小・端からのスライドだけ。回転・角丸・高さを動かさない。
- hover / focus で変えるのは色だけ。`scale-*` や位置を動かさない。
- 常に動く表示は `Spinner` と `Skeleton` だけで、`prefers-reduced-motion` で止まる。利用側で `transition` / `animate-*` を足さない。

## 参照

- 影と角丸は [Shape](/guidelines/themes/shape/)。アクセシビリティの最低ラインは [アクセシビリティ](/guidelines/foundations/accessibility/)。
